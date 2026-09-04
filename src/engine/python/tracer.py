"""
Python 실행 트레이서 — AST 계측 방식.

설계 결정 (README 참고):
  인터프리터를 새로 만들지 않는다. 원본 AST에 프로브 호출을 심고 **진짜
  CPython**으로 실행한 뒤, 프로브가 남긴 이벤트 배열을 트레이스로 넘긴다.
  덕분에 연산자 오버로딩·정수 정밀도·예외 타입 같은 것이 전부 실제 Python과
  같다. 흉내 낸 언어와 진짜 언어가 미묘하게 다른 문제가 아예 생기지 않는다.

  같은 파일이 두 곳에서 돌아간다.
    · 빌드 타임: CPython → content/lessons/**/trace.*.golden.json
    · 브라우저:   Pyodide → 연습/샌드박스 모드의 즉석 실행
  둘이 같은 코드이므로 "미리 만든 트레이스"와 "직접 실행한 트레이스"가
  갈라질 수 없다.

── detail 규칙 ────────────────────────────────────────────────
`core`는 **의미 단위를 닫는 이벤트**에 붙인다 (기획서 §3.2).
  · 문장의 결과가 확정되는 이벤트  → core
    (대입의 VARIABLE_*, 반복의 LOOP_*, 조건의 BRANCH_TEST, 출력, 오류)
  · 장면이 바뀌는 이벤트          → core (FUNCTION_CALL, FUNCTION_DEFINE)
  · 마지막 PARAMETER_BIND         → core (프레임 생성 + 전체 인수 연결이 한 단계)
  · return 문의 값 표현식         → core (함수 본문의 의미는 그 계산에 있다)
  · 나머지(줄 진입, 인수 읽기, 프레임 생성/제거, 반환 자체) → expression
"""

from __future__ import annotations

import ast
import builtins
import inspect
import operator
import time

TRACER = "__trace__"

DEFAULT_LIMITS = {
    "max_events": 20000,   # §3.10 실행 상한
    "max_seconds": 5.0,
    "max_track": 200,      # 반복 트랙 미리보기 최대 개수
    "max_items": 200,      # 힙 컨테이너 미리보기 최대 개수
    "max_depth": 6,        # 중첩 컨테이너 전개 깊이
}

BIN_OPS = {
    ast.Add: ("+", operator.add),
    ast.Sub: ("-", operator.sub),
    ast.Mult: ("*", operator.mul),
    ast.Div: ("/", operator.truediv),
    ast.FloorDiv: ("//", operator.floordiv),
    ast.Mod: ("%", operator.mod),
    ast.Pow: ("**", operator.pow),
    ast.BitAnd: ("&", operator.and_),
    ast.BitOr: ("|", operator.or_),
    ast.BitXor: ("^", operator.xor),
    ast.LShift: ("<<", operator.lshift),
    ast.RShift: (">>", operator.rshift),
}

CMP_OPS = {
    ast.Eq: ("==", operator.eq),
    ast.NotEq: ("!=", operator.ne),
    ast.Lt: ("<", operator.lt),
    ast.LtE: ("<=", operator.le),
    ast.Gt: (">", operator.gt),
    ast.GtE: (">=", operator.ge),
    ast.In: ("in", lambda a, b: a in b),
    ast.NotIn: ("not in", lambda a, b: a not in b),
    ast.Is: ("is", operator.is_),
    ast.IsNot: ("is not", operator.is_not),
}

UNARY_OPS = {
    ast.USub: ("-", operator.neg),
    ast.UAdd: ("+", operator.pos),
    ast.Not: ("not ", operator.not_),
    ast.Invert: ("~", operator.invert),
}

# §3.10 "네트워크·파일·패키지 설치 없음". 화이트리스트 밖은 NameError가 난다.
# BaseException은 학습자가 직접 쓰는 일이 없어도 반드시 있어야 한다. try 문을
# 계측할 때 `except BaseException`으로 감싸 오류를 기록하고 다시 던지기 때문이다.
_SAFE_NAMES = (
    "abs all any bool chr dict divmod enumerate filter float format int isinstance "
    "len list map max min ord pow print range repr reversed round set setattr sorted "
    "str sum tuple type zip "
    # P21이 요구한 것. getattr/hasattr는 §6의 attribute 설명에, object/super는
    # 상속에, staticmethod/classmethod/property는 §6 뒷부분에 나온다.
    "getattr hasattr object super staticmethod classmethod property issubclass "
    "BaseException Exception ValueError TypeError KeyError IndexError ZeroDivisionError "
    "AttributeError NameError RuntimeError StopIteration ArithmeticError "
    "LookupError OverflowError"
).split()


def safe_builtins() -> dict:
    table = {name: getattr(builtins, name) for name in _SAFE_NAMES if hasattr(builtins, name)}
    # 학습자가 직접 쓰는 이름이 아니지만 `class` 문이 컴파일되면 이 이름을
    # __builtins__에서 찾는다. 없으면 클래스 정의 자체가 NameError로 죽는다.
    table["__build_class__"] = builtins.__build_class__
    table["__name__"] = "__main__"
    return table


class VirtualModule:
    """import가 만든 module 객체. §P20 §5의 "module namespace"다.

    진짜 모듈을 그대로 넘기지 않는 이유는 두 가지다. 하나는 안전이고, 다른
    하나는 화면이다. 카드에 이름을 몇 백 개 늘어놓으면 §10-4의 "점 접근은
    카드 안의 이름 탐색"이 그림으로 성립하지 않는다.
    """

    def __init__(self, name: str, members: dict):
        object.__setattr__(self, "_name", name)
        object.__setattr__(self, "_members", dict(members))

    @property
    def name(self) -> str:
        return object.__getattribute__(self, "_name")

    @property
    def members(self) -> dict:
        return object.__getattribute__(self, "_members")

    def __getattr__(self, key: str):
        members = object.__getattribute__(self, "_members")
        if key in members:
            return members[key]
        raise AttributeError(
            f"module '{object.__getattribute__(self, '_name')}'에는 '{key}'라는 이름이 없습니다"
        )

    def __repr__(self) -> str:
        return f"<module '{self.name}'>"


def _members(module, names: str) -> dict:
    return {n: getattr(module, n) for n in names.split() if hasattr(module, n)}


def stdlib_modules() -> dict:
    """이 사이트가 여는 표준 모듈. 교재가 실제로 쓰는 것만 있다.

    결정성이 조건이다. `random`이나 `datetime.now`처럼 실행마다 값이 달라지는
    것은 골든 트레이스를 무너뜨리므로 넣지 않는다.
    """
    import csv as _csv
    import json as _json
    import math as _math
    import statistics as _statistics
    from pathlib import PurePosixPath

    return {
        "json": _members(_json, "loads dumps load dump"),
        "math": _members(_math, "sqrt floor ceil fabs pow isnan isinf isfinite inf nan pi e"),
        "statistics": _members(_statistics, "mean median stdev pstdev"),
        "csv": _members(_csv, "reader writer DictReader DictWriter"),
        # 진짜 Path는 디스크를 만진다(exists, open ...). 경로 조립만 남긴
        # PurePosixPath면 §13 예제 C의 `/`와 `.name`이 그대로 성립한다.
        "pathlib": {"Path": PurePosixPath, "PurePosixPath": PurePosixPath},
    }


class VirtualFile:
    """열려 있는 파일. §P18 §5의 "File object: cursor + mode"를 그대로 들고 있다.

    진짜 파일을 열지 않는 이유는 안전 때문만이 아니다. 학습자의 코드가 무엇을
    읽고 썼는지 보여 주려면 통로가 우리 손 안에 있어야 한다. 커서와 모드는
    화면에 그릴 상태이지 구현 세부가 아니다.
    """

    def __init__(self, fs: "VirtualFS", path: str, mode: str, encoding: str):
        self.fs = fs
        self.path = path
        self.mode = mode
        self.encoding = encoding
        self.closed = False
        # w는 열자마자 기존 내용을 버린다. §10-5가 "위험 사건"으로 명시한 지점이다.
        self.cursor = len(fs.disk.get(path, "")) if mode == "a" else 0

    # ── 읽기 ──────────────────────────────────────────────────

    def _rest(self) -> str:
        return self.fs.disk.get(self.path, "")[self.cursor:]

    def read(self, size: int = -1) -> str:
        self._require("r")
        text = self._rest() if size < 0 else self._rest()[:size]
        self.cursor += len(text)
        self.fs.record_read(self, text)
        return text

    def readline(self) -> str:
        self._require("r")
        rest = self._rest()
        if not rest:
            return ""
        cut = rest.find("\n")
        text = rest if cut < 0 else rest[: cut + 1]
        self.cursor += len(text)
        self.fs.record_read(self, text)
        return text

    def readlines(self) -> list[str]:
        return list(self)

    def __iter__(self):
        return self

    def __next__(self) -> str:
        line = self.readline()
        if not line:
            raise StopIteration
        return line

    # ── 쓰기 ──────────────────────────────────────────────────

    def write(self, text: str) -> int:
        if self.mode == "r":
            raise ValueError("읽기 모드로 연 파일에는 쓸 수 없습니다")
        if self.closed:
            raise ValueError("닫힌 파일에는 쓸 수 없습니다")
        body = self.fs.disk.get(self.path, "")
        # 커서 위치에 끼워 넣는다. §10-4의 "문자열 카드가 파일 커서 위치에 들어간다"
        self.fs.disk[self.path] = body[: self.cursor] + text + body[self.cursor + len(text):]
        self.cursor += len(text)
        self.fs.record_write(self, text)
        return len(text)

    def writelines(self, lines) -> None:
        for line in lines:
            self.write(line)

    # ── 통로 열고 닫기 ────────────────────────────────────────

    def close(self) -> None:
        if self.closed:
            return
        self.closed = True
        self.fs.record_close(self)

    def __enter__(self) -> "VirtualFile":
        return self

    def __exit__(self, *_exc) -> bool:
        # §10-7: 블록 안에서 오류가 나도 이 정리 단계는 실행된다.
        self.close()
        return False

    def __repr__(self) -> str:
        # 기본 repr은 메모리 주소를 담는다. 실행마다 달라지므로 골든 트레이스가
        # 성립하지 않는다. 주소는 학습자에게 아무 뜻도 없다.
        state = "닫힘" if self.closed else f"{self.mode} 모드"
        return f"<{self.path} 통로, {state}>"

    def _require(self, mode: str) -> None:
        if self.closed:
            raise ValueError("닫힌 파일은 읽을 수 없습니다")
        if self.mode != mode:
            raise ValueError(f"'{self.mode}' 모드로 연 파일은 읽을 수 없습니다")


class VirtualFS:
    """§P18 §5의 "Disk file". 프로그램 바깥에 있고 실행이 끝나도 남는다."""

    MODES = ("r", "w", "a")

    def __init__(self, recorder: "Recorder", disk: dict[str, str]):
        self.recorder = recorder
        self.disk = dict(disk)

    def open(self, path, mode: str = "r", *, encoding: str = "utf-8", **_ignored) -> VirtualFile:
        path = str(path)
        base = mode.replace("t", "").replace("+", "") or "r"
        if base not in self.MODES:
            raise ValueError(f"이 사이트의 파일 통로는 {', '.join(self.MODES)} 모드만 엽니다")
        if base == "r" and path not in self.disk:
            raise FileNotFoundError(f"No such file or directory: '{path}'")
        before = self.disk.get(path, "")
        if base == "w":
            self.disk[path] = ""
        elif path not in self.disk:
            self.disk[path] = ""

        handle = VirtualFile(self, path, base, encoding)
        self.recorder.file_open(handle, before)
        return handle

    def record_read(self, handle: VirtualFile, text: str) -> None:
        self.recorder.file_read(handle, text)

    def record_write(self, handle: VirtualFile, text: str) -> None:
        self.recorder.file_write(handle, text)

    def record_close(self, handle: VirtualFile) -> None:
        self.recorder.file_close(handle)


class TraceLimit(Exception):
    """이벤트/시간 상한에 걸려 실행을 중단한다. 무한 루프도 여기서 잡힌다."""


# ─────────────────────────────────────────────────────────────
# 값 인코딩
# ─────────────────────────────────────────────────────────────

def _prim(type_: str, repr_: str) -> dict:
    return {"kind": "primitive", "type": type_, "repr": repr_}


def _param_names(fn) -> list[str]:
    """method 카드에 적을 파라미터 이름. self는 §6이 "직접 적지 않는다"고
    설명하는 대상이라 카드에도 남긴다."""
    code = getattr(fn, "__code__", None)
    if code is None:
        return []
    return list(code.co_varnames[: code.co_argcount])


class Recorder:
    """프로브가 호출하는 객체. 계측 코드에서는 `__trace__`라는 이름으로 보인다."""

    def __init__(self, statics: list[dict], limits: dict):
        self.statics = statics
        self.limits = limits
        self.events: list[dict] = []
        self.truncated = False
        # 계측 없이 그냥 실행했을 때의 stdout. "계측이 의미를 바꾸지 않는다"를
        # 빌드에서 자동으로 검사하기 위한 것이다 (scripts/emit-traces.ts).
        self.stdout: list[str] = []

        self._t0 = time.monotonic()
        self._frames: list[dict] = [
            {"id": "global", "name": "global", "call_line": None, "bindings": {}, "returned": True}
        ]
        self._call_counts: dict[str, int] = {}
        self._loop_index: dict[str, int] = {}

        # 힙: 파이썬 객체 identity → HeapId. 객체를 강한 참조로 붙들어 두어야
        # id() 재사용으로 다른 객체가 같은 칸을 차지하는 사고가 없다.
        self._heap_ids: dict[int, str] = {}
        self._heap_keep: dict[int, object] = {}
        self._heap_snapshots: dict[str, dict] = {}
        self._heap_seq = 0
        self._expanding: set[int] = set()

        # `class` 문이 만든 클래스 객체들. 힙에 인스턴스 카드를 그릴지,
        # 그냥 repr 문자열로 접을지를 이 집합으로 가른다. str이나 dict처럼
        # 내장 타입까지 카드로 펼치면 화면이 곧바로 무너진다.
        self._user_classes: dict[int, type] = {}
        # 클래스 이름 → __init__이 self에 붙이는 attribute 이름들 (§5)
        self._init_rules: dict[str, list[str]] = {}

        # §P20 §10-6의 Import Cache. 같은 모듈을 두 번 import해도 최상위 코드는
        # 한 번만 돈다. 이 사실이 §9 Step 2가 가르치는 것이다.
        self._modules: dict[str, VirtualModule] = {}
        self._module_sources: dict[str, tuple] = {}   # 이름 → (계측된 ast, 표시 경로)
        self._stdlib: dict[str, dict] = {}
        self._builtins: dict = {}
        # 계측을 거친 함수 객체들. 이 목록에 있으면 몸통 안에서 enter 프로브가
        # 돌므로 호출부도 프레임을 열어 줘야 한다. 아니면 프레임이 열린 채 남는다.
        self._instrumented: set[int] = set()
        # 아직 살아 있는 generator 프레임. `all(...)`처럼 끝까지 소비하지 않는
        # 호출은 프레임을 멈춘 채로 두고 간다. 프로그램이 끝날 때 정리한다.
        self._paused: list[dict] = []
        # comprehension이 만드는 중인 결과. P15 §9가 'hidden result builder'라 부른다.
        self._comp_builders: dict[str, list] = {}

        self._attr_before: dict | None = None
        self._pending_call: dict | None = None
        self._last_popped: str | None = None
        self._pending_sub: tuple[str, str] | None = None
        self._reported_errors: set[int] = set()

    # ── 이벤트 ────────────────────────────────────────────────

    def _emit(self, type_: str, line: int, detail: str = "expression", frame: str | None = None, **fields) -> dict:
        if len(self.events) >= self.limits["max_events"]:
            self.truncated = True
            raise TraceLimit()
        if time.monotonic() - self._t0 > self.limits["max_seconds"]:
            self.truncated = True
            raise TraceLimit()
        event = {
            "type": type_,
            "step": len(self.events) + 1,
            "line": line,
            "frameId": frame or self._frames[-1]["id"],
            "detail": detail,
        }
        # 어느 파일의 줄인가. main.py면 붙이지 않는다 (대부분의 레슨이 한 파일이다).
        where = self._frames[-1].get("source")
        if where:
            event["source"] = where
        event.update({k: v for k, v in fields.items() if v is not None})
        self.events.append(event)
        return event

    def _span(self, st: dict) -> dict | None:
        if st.get("col") is None:
            return None
        return {"startCol": st["col"], "endCol": st["end_col"]}

    # ── 값 ────────────────────────────────────────────────────

    def value(self, obj) -> dict:
        if obj is None:
            return _prim("none", "None")
        if isinstance(obj, bool):
            return _prim("bool", "True" if obj else "False")
        if isinstance(obj, int):
            return _prim("int", repr(obj))
        if isinstance(obj, float):
            if obj != obj:
                return _prim("nan", "nan")
            return _prim("float", repr(obj))
        if isinstance(obj, str):
            return _prim("str", repr(obj))
        if isinstance(obj, VirtualFile):
            return _prim("file", repr(obj))
        if isinstance(obj, VirtualModule):
            return {"kind": "ref", "id": self._heap(obj)}
        if isinstance(obj, (list, tuple, dict, set, frozenset, range)) or callable(obj):
            return {"kind": "ref", "id": self._heap(obj)}
        if self.is_instance(obj):
            return {"kind": "ref", "id": self._heap(obj)}
        return _prim("str", repr(obj))

    def is_instance(self, obj) -> bool:
        """`class` 문으로 만든 클래스의 인스턴스인가."""
        return id(type(obj)) in self._user_classes

    def is_class(self, obj) -> bool:
        return id(obj) in self._user_classes

    def _heap(self, obj) -> str:
        key = id(obj)
        heap_id = self._heap_ids.get(key)
        if heap_id is None:
            heap_id = self._new_heap_id(obj)
            self._heap_ids[key] = heap_id
            self._heap_keep[key] = obj
        self._sync(heap_id, obj)
        return heap_id

    def _new_heap_id(self, obj) -> str:
        # 클래스 검사가 먼저다. 클래스도 callable이라 순서를 바꾸면 설계도가
        # 함수 카드로 그려진다.
        if self.is_class(obj):
            return f"class:{obj.__name__}"
        if isinstance(obj, VirtualModule):
            return f"module:{obj.name}"
        if callable(obj):
            return f"fn:{getattr(obj, '__name__', 'anonymous')}"
        self._heap_seq += 1
        label = type(obj).__name__
        return f"{label}@{self._heap_seq}"

    def _sync(self, heap_id: str, obj) -> None:
        """힙 객체의 현재 내용을 스냅샷과 비교해 달라졌으면 HEAP_ALLOC을 다시 낸다.

        모든 변형(append, 슬라이스 대입, sort ...)을 계측하는 대신 값을 읽을 때
        맞춰 넣는다. 계측하지 못한 변형이 있어도 화면의 힙이 조용히 틀리는 일이 없다.
        """
        if id(obj) in self._expanding:
            return
        self._expanding.add(id(obj))
        try:
            snapshot = self._describe(heap_id, obj)
        finally:
            self._expanding.discard(id(obj))
        if snapshot is None or self._heap_snapshots.get(heap_id) == snapshot:
            return
        self._heap_snapshots[heap_id] = snapshot
        line = self._frames[-1].get("line") or 1
        self._emit("HEAP_ALLOC", line, "expression", object=snapshot)

    def _describe(self, heap_id: str, obj) -> dict | None:
        cap = self.limits["max_items"]
        if isinstance(obj, range):
            return {"kind": "range", "id": heap_id, "start": obj.start, "stop": obj.stop, "step": obj.step}
        if isinstance(obj, (list, tuple)):
            label = "list" if isinstance(obj, list) else "tuple"
            body = {"kind": "sequence", "id": heap_id, "label": label,
                    "items": [self.value(v) for v in list(obj)[:cap]]}
            if label == "tuple":
                body["frozen"] = True
            return body
        if isinstance(obj, dict):
            return {"kind": "mapping", "id": heap_id, "label": "dict",
                    "entries": [{"key": self._key(k), "value": self.value(v)}
                                for k, v in list(obj.items())[:cap]]}
        if isinstance(obj, (set, frozenset)):
            # 파이썬은 프로세스마다 문자열 해시를 무작위화하므로 set의 순회 순서가
            # 실행마다 달라진다. 그대로 실으면 골든 트레이스가 매번 바뀌어 검증이
            # 성립하지 않는다. set에는 애초에 의미 있는 순서가 없으니 표시 순서를
            # repr로 고정하고, 이 순서가 실제 순서가 아니라는 것을 unordered로
            # 알린다. (JS의 Set은 삽입 순서를 지키므로 정렬하지 않는다.)
            items = sorted((self.value(v) for v in obj), key=lambda v: v.get("repr", ""))
            return {"kind": "set", "id": heap_id, "items": items[:cap], "unordered": True}
        if isinstance(obj, VirtualModule):
            # §P20 §10-1 "독립된 Module Namespace 카드". 값과 함수가 같이 산다.
            return {
                "kind": "module", "id": heap_id, "name": obj.name,
                "names": [{"key": k, "value": self.value(v)}
                          for k, v in list(obj.members.items())[:cap]],
            }
        if self.is_class(obj):
            # P21 §10-1: "Class Card에는 attribute 초기화 규칙과 method 함수들을,
            # Heap에는 instance 카드를 따로 둔다." 설계도와 실물은 다른 카드다.
            body = {
                "kind": "class", "id": heap_id, "name": obj.__name__,
                "methods": [{"name": k, "params": _param_names(v)}
                            for k, v in vars(obj).items() if callable(v)],
                # class attribute (§6의 `unit = "nm"`). instance attribute와
                # 다른 카드에 있다는 것 자체가 이 레슨의 요점이다.
                "attributes": [{"key": k, "value": self.value(v)} for k, v in vars(obj).items()
                               if not callable(v) and not k.startswith("__")][:cap],
            }
            # §5의 "initial state rule: id, status". __init__이 self에 붙이는
            # 이름들이며 계측 시점에 AST로 뽑아 둔다.
            rule = self._init_rules.get(obj.__name__)
            if rule:
                body["initRule"] = rule
            return body
        if self.is_instance(obj):
            # JS 트레이서가 이미 label="instance"인 mapping을 낸다. 같은 것을
            # 두 모양으로 만들지 않는다. 점으로 닿는 이름이라는 사실은
            # label이 들고 있고 화면이 그렇게 그린다.
            return {
                "kind": "mapping", "id": heap_id, "label": "instance",
                "className": type(obj).__name__,
                "entries": [{"key": k, "value": self.value(v)}
                            for k, v in list(vars(obj).items())[:cap]],
            }
        if callable(obj):
            return None  # FUNCTION_DEFINE이 이미 넣었다
        return None

    @staticmethod
    def _key(k) -> str:
        return k if isinstance(k, str) else repr(k)

    def show(self, obj) -> str:
        v = self.value(obj)
        return v["repr"] if v["kind"] == "primitive" else self._label(v["id"])

    def _label(self, heap_id: str) -> str:
        snap = self._heap_snapshots.get(heap_id)
        if not snap:
            return f"<{heap_id}>"
        if snap["kind"] == "sequence":
            inner = ", ".join(i.get("repr", "…") for i in snap["items"][:6])
            return f"[{inner}]" if snap["label"] == "list" else f"({inner})"
        if snap["kind"] == "mapping":
            if snap.get("label") == "instance":
                inner = ", ".join(f"{e['key']}={e['value'].get('repr', '…')}"
                                  for e in snap["entries"][:3])
                return f"{snap['className']}({inner})"
            inner = ", ".join(f"{e['key']}: {e['value'].get('repr', '…')}" for e in snap["entries"][:4])
            return "{" + inner + "}"
        if snap["kind"] == "set":
            return "{" + ", ".join(i.get("repr", "…") for i in snap["items"][:6]) + "}"
        if snap["kind"] == "class":
            return snap["name"]
        if snap["kind"] == "module":
            return f"module {snap['name']}"
        return f"<{heap_id}>"

    # ── 프레임 헬퍼 ────────────────────────────────────────────

    def _bind(self, frame: dict, name: str, value: dict) -> dict | None:
        before = frame["bindings"].get(name)
        frame["bindings"][name] = value
        return before

    # ─────────────────────────────────────────────────────────
    # 프로브 (계측 코드가 호출하는 지점)
    # ─────────────────────────────────────────────────────────

    def line(self, sid: int) -> None:
        st = self.statics[sid]
        self._frames[-1]["line"] = st["line"]
        self._emit("LINE_ENTER", st["line"], "expression", span=self._span(st))

    def define(self, sid: int, fn) -> None:
        st = self.statics[sid]
        heap_id = self._heap(fn)
        self._instrumented.add(id(fn))
        self._heap_keep[id(fn)] = fn
        self._emit("FUNCTION_DEFINE", st["line"], "core",
                   name=st["name"], heapId=heap_id, params=st["params"], span=self._span(st))
        self._bind(self._frames[-1], st["name"], {"kind": "ref", "id": heap_id})

    def arg(self, sid: int, value):
        st = self.statics[sid]
        self._emit("EXPRESSION_EVAL", st["line"], "expression",
                   expression=st["text"], result=self.value(value), span=self._span(st))
        return value

    def call(self, __sid: int, __fn, *args, **kwargs):
        st = self.statics[__sid]
        if inspect.isgeneratorfunction(__fn):
            # generator 함수는 호출해도 몸통이 돌지 않는다. 프레임을 여기서
            # 밀어 넣으면 닫을 사람이 없어 열린 채 남는다 (P23의 요점이다).
            return self._generator(st, __fn, args, kwargs)
        name = getattr(__fn, "__name__", st["callee"])
        self._call_counts[name] = self._call_counts.get(name, 0) + 1
        number = self._call_counts[name]
        frame_id = f"{name}#{number}"

        shown = [self.show(a) for a in args] + [f"{k}={self.show(v)}" for k, v in kwargs.items()]
        origins = list(st["arg_names"]) + [None] * len(kwargs)
        caller = self._frames[-1]["id"]
        arg_specs = [
            {"value": self.value(a),
             **({"from": f"{caller}.{origins[i]}"} if i < len(origins) and origins[i] else {})}
            for i, a in enumerate(list(args) + list(kwargs.values()))
        ]

        self._emit("FUNCTION_CALL", st["line"], "core",
                   callee=st["callee"], substituted=f"{st['callee']}({', '.join(shown)})",
                   args=arg_specs, targetFrameId=frame_id, span=self._span(st))

        self._pending_call = {
            "frame_id": frame_id, "name": name, "number": number,
            "return_line": st["line"], "parent": caller,
            "froms": [spec.get("from") for spec in arg_specs],
        }
        depth = len(self._frames)
        try:
            result = __fn(*args, **kwargs)
        except TraceLimit:
            raise
        except BaseException as exc:
            # 예외로 빠져나가는 길은 정상 반환과 다르다. 반환값도, 복귀도 없다.
            # §3.9 "호출 스택을 거슬러 올라가는 오류 경로"가 여기서 만들어진다.
            self._pending_call = None
            self.thrown_at(exc, st["line"])
            if len(self._frames) > depth:
                frame = self._frames.pop()
                self._last_popped = frame["id"]
                self._emit("ERROR_PROPAGATE", frame.get("line", st["line"]), "expression",
                           frame=frame["id"], fromFrameId=frame["id"], toFrameId=self._frames[-1]["id"])
                self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame["id"])
            raise
        else:
            self._pending_call = None
            if len(self._frames) > depth:
                frame = self._frames[-1]
                if not frame["returned"]:
                    # 명시적 return이 없는 함수도 None을 돌려준다 (§3.5)
                    self._emit("FUNCTION_RETURN", frame.get("line", st["line"]), "expression",
                               value=_prim("none", "None"), toLine=frame["call_line"])
                self._frames.pop()
                self._last_popped = frame["id"]
                self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame["id"])
            return result

    # ── generator (P23) ───────────────────────────────────────

    def _generator(self, st: dict, fn, args: tuple, kwargs: dict):
        name = fn.__name__
        self._call_counts[name] = self._call_counts.get(name, 0) + 1
        number = self._call_counts[name]
        frame_id = f"{name}#{number}"
        shown = [self.show(a) for a in args] + [f"{k}={self.show(v)}" for k, v in kwargs.items()]
        raw = fn(*args, **kwargs)
        self._emit("GENERATOR_CREATE", st["line"], "core", name=name,
                   substituted=f"{name}({', '.join(shown)})", targetFrameId=frame_id,
                   span=self._span(st))
        return self._drive(frame_id, name, number, raw, st)

    def _drive(self, frame_id: str, name: str, number: int, raw, st: dict):
        """generator를 한 값씩 끌어낸다.

        값을 요구할 때만 몸통이 돌고, yield에서 프레임이 **멈춘 채로** 남는다.
        이 둘이 P23이 가르치는 전부라 프레임을 밀고 당기는 일을 그대로 낸다.
        """
        frame: dict | None = None
        while True:
            parent = self._frames[-1]["id"]
            if frame is None:
                self._pending_call = {"frame_id": frame_id, "name": name, "number": number,
                                      "return_line": st["line"], "parent": parent, "froms": []}
            else:
                self._frames.append(frame)
                self._emit("GENERATOR_RESUME", frame.get("line", st["line"]), "core",
                           frame=frame_id, fromFrameId=parent)
            try:
                value = next(raw)
            except StopIteration:
                if frame is not None and self._frames and self._frames[-1] is frame:
                    self._frames.pop()
                self._pending_call = None
                if frame is not None and frame in self._paused:
                    self._paused.remove(frame)
                self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame_id)
                return
            except TraceLimit:
                raise
            except BaseException as exc:
                self._pending_call = None
                self.thrown_at(exc, st["line"])
                if self._frames[-1]["id"] == frame_id:
                    popped = self._frames.pop()
                    if popped in self._paused:
                        self._paused.remove(popped)
                    self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame_id)
                raise
            if frame is None:
                frame = self._frames[-1]      # enter 프로브가 만든 프레임
                self._paused.append(frame)
            self._frames.pop()
            self._emit("GENERATOR_YIELD", frame.get("line", st["line"]), "core",
                       frame=frame_id, value=self.value(value), toFrameId=parent)
            yield value

    def close_paused(self) -> None:
        """끝까지 소비하지 않은 generator의 프레임을 정리한다.

        `all(checks())`는 거짓을 만나면 더 요구하지 않는다. 그 프레임은 멈춘
        채로 남아 있다가 프로그램이 끝나며 사라진다. 조용히 없애면 화면에
        닫히지 않는 프레임이 남고, 그냥 두면 그것이 틀린 그림이 된다.
        """
        while self._paused:
            frame = self._paused.pop()
            self._emit("FRAME_POP", self._frames[-1].get("line") or 1, "expression",
                       poppedFrameId=frame["id"], reason="abandoned")

    # ── comprehension / lambda (P15, P17) ─────────────────────

    def comp_iter(self, sid: int, iterable):
        """comprehension의 입력. 여기서부터 §P15 §9의 회차가 시작된다.

        comprehension은 한 줄이지만 안에서 도는 것은 반복문이다. 결과만 보여
        주면 "왜 12와 14만 남았는가"를 설명할 자리가 없다.
        """
        st = self.statics[sid]
        track, materialized = self._preview(iterable)
        items = materialized if materialized is not None else list(iterable)
        self._loop_index[st["loop_id"]] = -1
        self._emit("LOOP_START", st["line"], "core", loopId=st["loop_id"],
                   varNames=st["names"], track=track, parentLoopId=st["parent_loop"],
                   span=self._span(st))
        # §9가 "hidden result builder"라고 부른 것. 원소가 하나씩 쌓이는 자리가
        # 눈에 보여야 필터에 걸린 원소와 통과한 원소의 차이가 드러난다.
        if st["builder"]:
            builder: list = []
            self._comp_builders[st["loop_id"]] = builder
            # 이름을 붙여 둔다. 힙에 정체 모를 리스트가 하나 더 있는 것보다
            # "결과를 담는 중인 자리"라고 읽히는 편이 낫다.
            self._heap_seq += 1
            heap_id = f"builder@{self._heap_seq}"
            self._heap_ids[id(builder)] = heap_id
            self._heap_keep[id(builder)] = builder
            self._sync(heap_id, builder)
        return self._comp_steps(st, items)

    def _comp_steps(self, st: dict, items):
        frame = self._frames[-1]
        for index, item in enumerate(items):
            for name, value in zip(st["names"], self._spread(st["names"], item)):
                encoded = self.value(value)
                before = self._bind(frame, name, encoded)
                origin = {"kind": "iteration", "label": st["label"]}
                if before is None:
                    self._emit("VARIABLE_CREATE", st["line"], "expression",
                               name=name, value=encoded, origin=origin)
                else:
                    self._emit("VARIABLE_UPDATE", st["line"], "expression",
                               name=name, before=before, after=encoded, origin=origin)
            self._loop_index[st["loop_id"]] = index
            self._emit("LOOP_ITERATION", st["line"], "core", loopId=st["loop_id"], index=index)
            yield item

    @staticmethod
    def _spread(names: list[str], item):
        """`for k, v in pairs`처럼 대상이 여럿이면 원소를 풀어 준다."""
        if len(names) == 1:
            return [item]
        try:
            return list(item)[: len(names)]
        except TypeError:
            return [item] * len(names)

    def comp_test(self, sid: int, value):
        st = self.statics[sid]
        result = bool(value)
        substituted = None
        if self._pending_sub and self._pending_sub[0] == st["text"]:
            substituted = self._pending_sub[1]
        self._pending_sub = None
        self._emit("BRANCH_TEST", st["line"], "core", expression=st["text"],
                   substituted=substituted, result=result, span=self._span(st))
        return value

    def comp_elt(self, sid: int, value):
        st = self.statics[sid]
        substituted = None
        if self._pending_sub and self._pending_sub[0] == st["text"]:
            substituted = self._pending_sub[1]
        self._pending_sub = None
        self._emit("EXPRESSION_EVAL", st["line"], "core", expression=st["text"],
                   substituted=substituted, result=self.value(value), span=self._span(st))
        builder = self._comp_builders.get(st["loop_id"])
        if builder is not None:
            builder.append(value)
            heap_id = self._heap_ids.get(id(builder))
            if heap_id:
                self._emit("ITEM_APPEND", st["line"], "expression",
                           target=heap_id, value=self.value(value))
                self._sync(heap_id, builder)
        return value

    def comp_done(self, sid: int, result):
        st = self.statics[sid]
        self._comp_builders.pop(st["loop_id"], None)
        self._emit("LOOP_END", st["line"], "core", loopId=st["loop_id"], reason="exhausted")
        return result

    def keyfn(self, sid: int, fn):
        """`key=lambda x: ...`을 프레임이 보이는 함수로 감싼다.

        §P17 §9 Step 1이 "lambda frame은 호출마다 잠깐 생기며 x가 현재 record를
        가리킨다"고 적은 그 프레임이다. 감싸지 않으면 정렬은 결과만 있는
        블랙박스가 된다.
        """
        st = self.statics[sid]
        params = st["params"]

        def wrapped(*args, **kwargs):
            self._call_counts["lambda"] = self._call_counts.get("lambda", 0) + 1
            number = self._call_counts["lambda"]
            frame_id = f"lambda#{number}"
            shown = ", ".join(self.show(a) for a in args)
            self._emit("FUNCTION_CALL", st["line"], "core", callee="lambda",
                       substituted=f"lambda({shown})", args=[{"value": self.value(a)} for a in args],
                       targetFrameId=frame_id, span=self._span(st))
            self._emit("FUNCTION_ENTER", st["line"], "expression", frame=frame_id,
                       name="lambda", callNumber=number,
                       parentFrameId=self._frames[-1]["id"], returnLine=st["line"])
            frame = {"id": frame_id, "name": "lambda", "call_line": st["line"],
                     "bindings": {}, "returned": False, "line": st["line"],
                     "source": st.get("src")}
            self._frames.append(frame)
            for index, name in enumerate(params):
                value = self.value(args[index]) if index < len(args) else _prim("none", "None")
                self._emit("PARAMETER_BIND", st["line"], "core" if index == len(params) - 1
                           else "expression", name=name, value=value)
                self._bind(frame, name, value)
            try:
                result = fn(*args, **kwargs)
            except BaseException:
                if self._frames and self._frames[-1] is frame:
                    self._frames.pop()
                raise
            # 반환은 아직 그 프레임 안에서 일어나는 일이다. 먼저 빼면 반환값이
            # 호출한 쪽 프레임에 적힌다.
            # key 함수가 무엇을 돌려줬는지가 §P17 §9 Step 1의 전부다. 이것이
            # 빠지면 세 프레임이 생겼다 사라지는 장면만 남는다.
            self._emit("FUNCTION_RETURN", st["line"], "core",
                       value=self.value(result), toLine=st["line"])
            if self._frames and self._frames[-1] is frame:
                self._frames.pop()
            self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame_id)
            return result

        return wrapped

    def enter(self, sid: int, *values):
        st = self.statics[sid]
        pending = self._pending_call
        parent = pending["parent"] if pending else self._frames[-1]["id"]
        frame_id = pending["frame_id"] if pending else f"{st['name']}#?"
        number = pending["number"] if pending else 1
        return_line = pending["return_line"] if pending else st["line"]
        froms = pending["froms"] if pending else []
        self._pending_call = None

        # frame=frame_id 가 중요하다. reducer는 이 값을 **새 프레임의 id**로 쓴다.
        self._emit("FUNCTION_ENTER", st["line"], "expression", frame=frame_id,
                   name=st["name"], callNumber=number, parentFrameId=parent, returnLine=return_line)
        frame = {"id": frame_id, "name": st["name"], "call_line": return_line,
                 "bindings": {}, "returned": False, "line": st["line"],
                 # 함수 몸통의 줄 번호는 그 함수가 정의된 파일의 것이다
                 "source": st.get("src")}
        self._frames.append(frame)

        names = st["params"]
        for index, name in enumerate([p["name"] for p in names]):
            value = self.value(values[index]) if index < len(values) else _prim("none", "None")
            # 마지막 바인딩만 core: 프레임 생성 + 인수 연결 전체가 한 단계다.
            last = index == len(names) - 1
            self._emit("PARAMETER_BIND", st["line"], "core" if last else "expression",
                       name=name, value=value,
                       **({"from": froms[index]} if index < len(froms) and froms[index] else {}))
            self._bind(frame, name, value)

    def ret(self, sid: int, value):
        st = self.statics[sid]
        frame = self._frames[-1]
        frame["returned"] = True
        self._emit("FUNCTION_RETURN", st["line"], "expression",
                   value=self.value(value), toLine=frame["call_line"] or st["line"])
        return value

    def assign(self, sid: int, *values) -> None:
        st = self.statics[sid]
        frame = self._frames[-1]
        frame["line"] = st["line"]
        origin = dict(st["origin"])
        if origin.get("kind") == "return" and self._last_popped:
            origin["from"] = self._last_popped
        for index, name in enumerate(st["names"]):
            value = self.value(values[index])
            before = self._bind(frame, name, value)
            if before is None:
                self._emit("VARIABLE_CREATE", st["line"], "core",
                           name=name, value=value, origin=origin, span=self._span(st))
            else:
                self._emit("VARIABLE_UPDATE", st["line"], "core",
                           name=name, before=before, after=value, origin=origin, span=self._span(st))

    def delete(self, sid: int, name: str) -> None:
        st = self.statics[sid]
        self._frames[-1]["bindings"].pop(name, None)
        self._emit("VARIABLE_DELETE", st["line"], "core", name=name)

    # ── 표현식 ────────────────────────────────────────────────

    def binop(self, sid: int, left, right):
        st = self.statics[sid]
        result = st["fn"](left, right)
        self._record_expr(st, f"{self.show(left)} {st['op']} {self.show(right)}", result)
        return result

    def unaryop(self, sid: int, operand):
        st = self.statics[sid]
        result = st["fn"](operand)
        self._record_expr(st, f"{st['op']}{self.show(operand)}", result)
        return result

    def compare(self, sid: int, left, right):
        st = self.statics[sid]
        result = st["fn"](left, right)
        self._record_expr(st, f"{self.show(left)} {st['op']} {self.show(right)}", result)
        return result

    def boolop(self, sid: int, *thunks):
        """단축 평가를 보존한다 (§P05). 실행되지 않은 항은 `skipped`로 남는다."""
        st = self.statics[sid]
        is_and = st["op"] == "and"
        result = None
        used = 0
        for thunk in thunks:
            result = thunk()
            used += 1
            if (is_and and not result) or (not is_and and result):
                break
        shown = " ".join
        parts = st["texts"][:used]
        skipped = st["texts"][used:]
        self._emit("EXPRESSION_EVAL", st["line"], "expression",
                   expression=st["text"],
                   substituted=f" {st['op']} ".join(parts) if parts else st["text"],
                   result=self.value(result))
        if skipped:
            self.events[-1]["message"] = (
                f"{st['line']}번 줄의 `{st['text']}`에서 앞쪽 결과만으로 값이 정해져 "
                f"`{'`, `'.join(skipped)}`은 계산하지 않았습니다."
            )
        return result

    def _record_expr(self, st: dict, substituted: str, result) -> None:
        if not st["emit"]:
            # if/while의 조건식이면 BRANCH_TEST가 대신 보여 준다. 중복 방지.
            self._pending_sub = (st["text"], substituted)
            return
        self._emit("EXPRESSION_EVAL", st["line"], "core" if st["core"] else "expression",
                   expression=st["text"], substituted=substituted,
                   result=self.value(result), span=self._span(st))

    def getitem(self, sid: int, target, key):
        st = self.statics[sid]
        result = target[key]
        value = self.value(target)
        if value["kind"] == "ref":
            self._emit("ITEM_READ", st["line"], "expression",
                       target=value["id"], key=self._key(key), value=self.value(result))
        return result

    def setitem(self, sid: int, target, key, item):
        st = self.statics[sid]
        container = self.value(target)
        before = None
        try:
            before = self.value(target[key])
        except (KeyError, IndexError, TypeError):
            pass
        target[key] = item
        if container["kind"] == "ref":
            self._emit("ITEM_WRITE", st["line"], "core", target=container["id"],
                       key=self._key(key), before=before, after=self.value(item))
            self._sync(container["id"], target)

    # ── 모듈 (P20) ────────────────────────────────────────────

    def import_(self, sid: int) -> tuple:
        """`import config` / `from config import LIMIT`을 대신한다.

        `__import__`은 화이트리스트 밖이다. 진짜 import를 열면 무엇이든 들어올
        뿐 아니라, §9가 요구하는 "module frame에서 최상위 코드가 도는 장면"을
        만들 수 없다. 실행 순서가 이 레슨의 내용 그 자체다.
        """
        st = self.statics[sid]
        cached = st["module"] in self._modules
        module = self._load(st["module"], st["line"])

        if st["kind"] == "plain":
            values = [module]
        else:
            values = [getattr(module, name) for name in st["names"]]

        self._emit("MODULE_IMPORT", st["line"], "core", module=st["module"],
                   heapId=self._heap(module), binds=st["binds"],
                   names=st["names"] or None, cached=cached, span=self._span(st))

        frame = self._frames[-1]
        origin = {"kind": "import", "label": st["module"]}
        for name, value in zip(st["binds"], values):
            encoded = self.value(value)
            before = self._bind(frame, name, encoded)
            if before is None:
                self._emit("VARIABLE_CREATE", st["line"], "expression",
                           name=name, value=encoded, origin=origin)
            else:
                self._emit("VARIABLE_UPDATE", st["line"], "expression",
                           name=name, before=before, after=encoded, origin=origin)
        return tuple(values)

    def _load(self, name: str, line: int) -> VirtualModule:
        if name in self._modules:
            return self._modules[name]        # §10-6 Import Cache
        if name in self._module_sources:
            module = self._run_module(name, line)
        elif name in self._stdlib:
            module = VirtualModule(name, self._stdlib[name])
        else:
            raise ImportError(f"이 사이트에서 열 수 있는 모듈이 아닙니다: '{name}'")
        self._modules[name] = module
        return module

    def _run_module(self, name: str, line: int) -> VirtualModule:
        """모듈의 최상위 코드를 자기 프레임에서 실행한다 (§9 Step 1)."""
        tree, path = self._module_sources[name]
        frame_id = f"module:{name}"
        parent = self._frames[-1]["id"]
        # 프레임을 먼저 쌓아야 이 뒤의 이벤트가 모듈 파일의 줄로 기록된다
        self._frames.append({"id": frame_id, "name": name, "call_line": line,
                             "bindings": {}, "returned": True, "line": 1, "source": path})
        self._emit("FUNCTION_ENTER", 1, "core", frame=frame_id, name=name, callNumber=1,
                   parentFrameId=parent, returnLine=line, kind="module")
        namespace = {TRACER: self, "__builtins__": self._builtins, "__name__": name}
        try:
            exec(compile(tree, path, "exec"), namespace)
        finally:
            self._frames.pop()
            self._last_popped = frame_id
        self._emit("FRAME_POP", line, "expression", poppedFrameId=frame_id)
        members = {k: v for k, v in namespace.items()
                   if not k.startswith("__") and k != TRACER}
        return VirtualModule(name, members)

    # ── 파일 (P18) ────────────────────────────────────────────

    def _file_line(self) -> int:
        return self._frames[-1].get("line") or 1

    def file_open(self, handle, before: str) -> None:
        self._emit("FILE_OPEN", self._file_line(), "core", path=handle.path,
                   mode=handle.mode, encoding=handle.encoding, cursor=handle.cursor,
                   content=handle.fs.disk[handle.path],
                   # w 모드가 기존 내용을 버린 순간은 그 자체로 보여 줄 장면이다
                   discarded=before if handle.mode == "w" and before else None)

    def file_write(self, handle, text: str) -> None:
        self._emit("FILE_WRITE", self._file_line(), "core", path=handle.path,
                   text=text, cursor=handle.cursor, content=handle.fs.disk[handle.path])

    def file_read(self, handle, text: str) -> None:
        if not text:
            return   # 끝에 닿아 빈 문자열을 받은 것은 장면이 아니다
        self._emit("FILE_READ", self._file_line(), "core", path=handle.path,
                   text=text, cursor=handle.cursor)

    def file_close(self, handle) -> None:
        self._emit("FILE_CLOSE", self._file_line(), "core", path=handle.path,
                   content=handle.fs.disk[handle.path])

    # ── 클래스 (P21) ──────────────────────────────────────────

    def classdef(self, sid: int, cls) -> None:
        st = self.statics[sid]
        self._user_classes[id(cls)] = cls
        self._heap_keep[id(cls)] = cls
        if st["init_rule"]:
            self._init_rules[cls.__name__] = st["init_rule"]
        heap_id = self._heap(cls)   # 등록 뒤라야 설계도 카드로 그려진다
        self._emit("CLASS_DEFINE", st["line"], "core", name=st["name"], heapId=heap_id,
                   methods=st["methods"], span=self._span(st))
        self._bind(self._frames[-1], st["name"], {"kind": "ref", "id": heap_id})

    def construct(self, __sid: int, __cls, *args, **kwargs):
        """`Device("A")` — 설계도를 부르는 장면.

        §10-2가 요구한 순서는 "빈 instance 카드를 만든 뒤 __init__ frame을 push"다.
        CPython은 이 둘을 한 호출로 처리하므로 __new__와 __init__을 나눠 부른다.
        __new__를 직접 정의한 클래스는 나눌 수 없으니 통째로 부르고 카드만 뒤에 만든다.
        """
        st = self.statics[__sid]
        name = f"{__cls.__name__}.__init__"
        self._call_counts[name] = self._call_counts.get(name, 0) + 1
        frame_id = f"{name}#{self._call_counts[name]}"

        shown = [self.show(a) for a in args] + [f"{k}={self.show(v)}" for k, v in kwargs.items()]
        caller = self._frames[-1]["id"]
        self._emit("FUNCTION_CALL", st["line"], "core",
                   callee=__cls.__name__, substituted=f"{__cls.__name__}({', '.join(shown)})",
                   args=[{"value": self.value(a)} for a in [*args, *kwargs.values()]],
                   targetFrameId=frame_id, span=self._span(st))

        init = getattr(__cls, "__init__", None)
        if __cls.__new__ is not object.__new__ or not callable(init) or init is object.__init__:
            obj = __cls(*args, **kwargs)
            self._announce(st, obj, __cls)
            return obj

        obj = __cls.__new__(__cls)
        self._announce(st, obj, __cls)
        self._pending_call = {"frame_id": frame_id, "name": name,
                              "number": self._call_counts[name], "return_line": st["line"],
                              "parent": caller, "froms": []}
        self._run_framed(init, (obj, *args), kwargs, st, len(self._frames))
        return obj

    def _announce(self, st: dict, obj, cls) -> None:
        heap_id = self._heap(obj)
        self._emit("INSTANCE_CREATE", st["line"], "core", heapId=heap_id,
                   className=cls.__name__, classHeapId=self._heap(cls), span=self._span(st))

    def _run_framed(self, fn, args, kwargs, st: dict, depth: int):
        """call()의 프레임 뒷정리와 같은 규칙. 오류로 빠져나가는 길도 같다."""
        try:
            result = fn(*args, **kwargs)
        except TraceLimit:
            raise
        except BaseException as exc:
            self._pending_call = None
            self.thrown_at(exc, st["line"])
            if len(self._frames) > depth:
                frame = self._frames.pop()
                self._last_popped = frame["id"]
                self._emit("ERROR_PROPAGATE", frame.get("line", st["line"]), "expression",
                           frame=frame["id"], fromFrameId=frame["id"],
                           toFrameId=self._frames[-1]["id"])
                self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame["id"])
            raise
        self._pending_call = None
        if len(self._frames) > depth:
            frame = self._frames[-1]
            if not frame["returned"]:
                self._emit("FUNCTION_RETURN", frame.get("line", st["line"]), "expression",
                           value=_prim("none", "None"), toLine=frame["call_line"])
            self._frames.pop()
            self._last_popped = frame["id"]
            self._emit("FRAME_POP", st["line"], "expression", poppedFrameId=frame["id"])
        return result

    def attrcall(self, __sid: int, __obj, *args, **kwargs):
        """`a.run()` — 점 왼쪽을 먼저 평가해 대상을 찾고 그 객체를 self로 넘긴다 (§10-4).

        내장 타입의 method(`"x".strip()`, `d.items()`)도 여기를 지난다. 그쪽은
        보여 줄 장면이 없으므로 이미 화면에 있는 객체만 갱신하고 조용히 지나간다.
        """
        st = self.statics[__sid]
        bound = getattr(__obj, st["method"])
        # module의 함수(`measurement_utils.parse_value`)도 계측된 함수라서
        # 프레임을 열어야 한다. 열지 않으면 몸통의 enter 프로브가 만든 프레임이
        # 닫히지 않고 남는다.
        framed = (self.is_instance(__obj) or self.is_class(__obj)
                  or id(bound) in self._instrumented)

        if not framed:
            result = bound(*args, **kwargs)
            known = self._heap_ids.get(id(__obj))
            if known:
                self._sync(known, __obj)   # sort()처럼 제자리에서 바꾸는 호출
            return result

        holder = self.value(__obj)
        if self.is_instance(__obj):
            owner = type(__obj).__name__
        elif self.is_class(__obj):
            owner = __obj.__name__
        elif isinstance(__obj, VirtualModule):
            owner = __obj.name
        else:
            owner = st["callee"].rsplit(".", 1)[0]
        name = f"{owner}.{st['method']}"
        self._call_counts[name] = self._call_counts.get(name, 0) + 1
        frame_id = f"{name}#{self._call_counts[name]}"

        shown = [self.show(a) for a in args] + [f"{k}={self.show(v)}" for k, v in kwargs.items()]
        self._emit("FUNCTION_CALL", st["line"], "core",
                   callee=st["callee"], substituted=f"{st['callee']}({', '.join(shown)})",
                   args=[{"value": self.value(a)} for a in [*args, *kwargs.values()]],
                   targetFrameId=frame_id, receiver=holder, span=self._span(st))

        self._pending_call = {"frame_id": frame_id, "name": name,
                              "number": self._call_counts[name], "return_line": st["line"],
                              "parent": self._frames[-1]["id"], "froms": []}
        return self._run_framed(bound, args, kwargs, st, len(self._frames))

    def getattr_(self, sid: int, obj):
        st = self.statics[sid]
        result = getattr(obj, st["attr"])
        if isinstance(obj, VirtualModule):
            # §10-4 "점 접근은 module 카드 안의 attribute 이름 탐색"
            self._emit("ATTR_READ", st["line"], "expression", target=self._heap(obj),
                       attr=st["attr"], value=self.value(result), owner="module",
                       span=self._span(st))
            return result
        if self.is_instance(obj) or self.is_class(obj):
            holder = self.value(obj)
            # §6: 같은 이름이 instance에도 class에도 있을 수 있다. 어느 카드에서
            # 찾았는지가 이 레슨의 요점이라 owner로 남긴다.
            found = "instance" if st["attr"] in vars(obj) else "class"
            self._emit("ATTR_READ", st["line"], "expression", target=holder["id"],
                       attr=st["attr"], value=self.value(result),
                       owner=found if self.is_instance(obj) else "class", span=self._span(st))
        return result

    def setattr_(self, sid: int, obj, value) -> None:
        st = self.statics[sid]
        before = None
        if (self.is_instance(obj) or self.is_class(obj)) and st["attr"] in vars(obj):
            before = self.value(vars(obj)[st["attr"]])
        setattr(obj, st["attr"], value)
        self._write_attr(st, obj, before, value)

    def attr_pre(self, sid: int, obj):
        """`self.count += 1`의 이전 값. 문장은 원본 그대로 실행해야 in-place
        의미(`list += ...`)가 보존되므로 앞뒤로 나눠 본다."""
        st = self.statics[sid]
        self._attr_before = None
        if self.is_instance(obj) or self.is_class(obj):
            try:
                self._attr_before = self.value(getattr(obj, st["attr"]))
            except AttributeError:
                pass
        return obj

    def attr_post(self, sid: int, obj) -> None:
        st = self.statics[sid]
        before, self._attr_before = self._attr_before, None
        self._write_attr(st, obj, before, getattr(obj, st["attr"]))

    def _write_attr(self, st: dict, obj, before, value) -> None:
        holder = self.value(obj)
        if holder["kind"] != "ref":
            return   # 모듈 속성처럼 카드가 없는 대상은 보여 줄 자리가 없다
        self._emit("ATTR_WRITE", st["line"], "core", target=holder["id"], attr=st["attr"],
                   before=before, after=self.value(value), span=self._span(st))
        self._sync(holder["id"], obj)

    def method(self, sid: int, target, *args):
        """append / pop / remove 처럼 §3.4의 힙 그림이 바뀌는 호출."""
        st = self.statics[sid]
        name = st["method"]
        container = self.value(target)
        result = getattr(target, name)(*args)
        if container["kind"] == "ref":
            heap_id = container["id"]
            if name == "append" and args:
                self._emit("ITEM_APPEND", st["line"], "core", target=heap_id, value=self.value(args[0]))
            elif name in ("pop", "remove", "discard"):
                self._emit("ITEM_REMOVE", st["line"], "core", target=heap_id,
                           key=self._key(args[0]) if args else "-1")
            self._sync(heap_id, target)
        return result

    def print_(self, sid: int, *args, sep=" ", end="\n"):
        st = self.statics[sid]
        text = sep.join(str(a) for a in args) + end
        self.stdout.append(text)
        self._emit("OUTPUT_APPEND", st["line"], "core", stream="stdout", text=text.rstrip("\n"))

    # ── 흐름 ──────────────────────────────────────────────────

    def test(self, sid: int, value):
        st = self.statics[sid]
        result = bool(value)
        substituted = None
        if self._pending_sub and self._pending_sub[0] == st["text"]:
            substituted = self._pending_sub[1]
        self._pending_sub = None
        self._emit("BRANCH_TEST", st["line"], "core",
                   expression=st["text"], substituted=substituted, result=result, span=self._span(st))
        target = st["then_line"] if result else st["else_line"]
        if target:
            self._emit("BRANCH_TAKEN", st["line"], "expression",
                       label=st["then_label"] if result else st["else_label"], targetLine=target)
        return value

    def loop_iter(self, sid: int, iterable):
        st = self.statics[sid]
        track, materialized = self._preview(iterable)
        self._loop_index[st["loop_id"]] = -1
        self._emit("LOOP_START", st["line"], "core", loopId=st["loop_id"],
                   varNames=st["names"], track=track, parentLoopId=st["parent_loop"], span=self._span(st))
        if isinstance(iterable, VirtualFile):
            return self._file_lines(st["line"], iterable)
        return iter(materialized if materialized is not None else iterable)

    def _file_lines(self, line: int, handle):
        """파일 반복에서 다음 줄을 읽는 일은 `for` 줄에서 일어난다. 그냥 두면
        직전 문장의 줄 번호가 남아 있어 읽기 장면이 엉뚱한 줄에 붙는다."""
        while True:
            self._frames[-1]["line"] = line
            try:
                yield next(handle)
            except StopIteration:
                return

    def loop_step(self, sid: int, *values) -> None:
        st = self.statics[sid]
        frame = self._frames[-1]
        frame["line"] = st["line"]
        for index, name in enumerate(st["names"]):
            value = self.value(values[index])
            before = self._bind(frame, name, value)
            origin = {"kind": "iteration", "label": st["source_label"]}
            if before is None:
                self._emit("VARIABLE_CREATE", st["line"], "expression",
                           name=name, value=value, origin=origin)
            else:
                self._emit("VARIABLE_UPDATE", st["line"], "expression",
                           name=name, before=before, after=value, origin=origin)
        index = self._loop_index.get(st["loop_id"], -1) + 1
        self._loop_index[st["loop_id"]] = index
        self._emit("LOOP_ITERATION", st["line"], "core", loopId=st["loop_id"], index=index)

    def while_start(self, sid: int) -> None:
        st = self.statics[sid]
        self._loop_index[st["loop_id"]] = -1
        self._emit("LOOP_START", st["line"], "core", loopId=st["loop_id"],
                   varNames=st["names"], track=[], parentLoopId=st["parent_loop"])

    def while_test(self, sid: int, value):
        st = self.statics[sid]
        result = bool(value)
        substituted = None
        if self._pending_sub and self._pending_sub[0] == st["text"]:
            substituted = self._pending_sub[1]
        self._pending_sub = None
        self._emit("BRANCH_TEST", st["line"], "expression",
                   expression=st["text"], substituted=substituted, result=result)
        if result:
            index = self._loop_index.get(st["loop_id"], -1) + 1
            self._loop_index[st["loop_id"]] = index
            self._emit("LOOP_ITERATION", st["line"], "core", loopId=st["loop_id"], index=index)
        return result

    def loop_done(self, sid: int) -> None:
        st = self.statics[sid]
        self._emit("LOOP_END", st["line"], "core", loopId=st["loop_id"], reason="exhausted")

    def loop_break(self, sid: int) -> None:
        st = self.statics[sid]
        self._emit("LOOP_END", st["line"], "core", loopId=st["loop_id"], reason="break")

    # ── 오류 ──────────────────────────────────────────────────

    def raising(self, sid: int, exc):
        self.thrown(sid, exc)
        return exc

    def thrown(self, sid: int, exc) -> None:
        self.thrown_at(exc, self.statics[sid]["line"])

    def thrown_at(self, exc, fallback: int) -> None:
        """오류를 한 번만 기록한다. 프레임을 거슬러 올라가며 여러 번 지나가므로
        같은 예외 객체에 대해서는 가장 깊은 지점의 기록만 남긴다."""
        if id(exc) in self._reported_errors:
            return
        self._reported_errors.add(id(exc))
        self._emit("ERROR_THROW", self._error_line(exc, fallback), "core",
                   name=type(exc).__name__, message=str(exc))

    def _error_line(self, exc, fallback: int) -> int:
        """계측 노드는 원본 위치를 물려받으므로 트레이스백 줄 번호가
        학습자가 보는 줄 번호와 그대로 일치한다."""
        line = None
        tb = getattr(exc, "__traceback__", None)
        while tb is not None:
            if 1 <= tb.tb_lineno <= self.limits.get("source_lines", 10 ** 6):
                line = tb.tb_lineno
            tb = tb.tb_next
        return line or self._frames[-1].get("line") or fallback

    def caught(self, sid: int) -> None:
        st = self.statics[sid]
        self._emit("ERROR_CATCH", st["line"], "core", handlerLine=st["line"])

    def unwind(self, to_frame: str) -> None:
        while len(self._frames) > 1 and self._frames[-1]["id"] != to_frame:
            frame = self._frames.pop()
            self._emit("ERROR_PROPAGATE", frame.get("line", 1), "expression",
                       fromFrameId=frame["id"], toFrameId=self._frames[-1]["id"])

    # ── 반복 트랙 미리보기 ─────────────────────────────────────

    def _preview(self, iterable):
        """반복 트랙에 미리 보여 줄 값들. 제너레이터처럼 미리 볼 수 없으면 빈 트랙."""
        cap = self.limits["max_track"]
        if isinstance(iterable, VirtualFile):
            # 파일은 실제로 한 줄씩 읽어야 FILE_READ가 나온다. 그래서 트랙만
            # 미리 채우고 materialized는 주지 않는다.
            rest = iterable.fs.disk.get(iterable.path, "")[iterable.cursor:]
            lines = rest.splitlines(keepends=True)[:cap]
            return [self.show(line) for line in lines], None
        if isinstance(iterable, (range, list, tuple, str, dict, set, frozenset)):
            items = list(iterable)
            if len(items) <= cap:
                return [self.show(v) for v in items], items
            return [self.show(v) for v in items[:cap]] + ["…"], items
        return [], None


# ─────────────────────────────────────────────────────────────
# AST 계측
# ─────────────────────────────────────────────────────────────

class Instrumenter(ast.NodeTransformer):
    """원본 AST에 프로브 호출을 심는다.

    두 가지를 지킨다.
      1. 의미를 바꾸지 않는다. 단축 평가는 람다로, 연산자는 `operator` 모듈로
         원래 동작 그대로 넘긴다.
      2. 줄 번호를 보존한다. 삽입한 노드는 원본 노드의 위치를 복사하므로
         예외 트레이스백의 줄 번호가 학습자가 보는 코드와 그대로 일치한다.
    """

    def __init__(self, source: str, statics: list[dict] | None = None,
                 source_id: str | None = None):
        self.source = source
        # 이 파일에서 만든 정적 정보라는 표시. 함수가 어느 파일에 정의됐는지는
        # 호출 프레임의 줄 번호를 어느 파일에서 읽어야 하는지와 같은 문제다.
        self.source_id = source_id
        # 모듈 파일은 main과 statics 목록을 함께 쓴다. 프로브는 sid 하나로
        # 정적 정보를 찾으므로 목록이 갈라지면 엉뚱한 항목을 읽는다.
        self.statics: list[dict] = [] if statics is None else statics
        self.user_functions: set[str] = set()
        self.user_classes: set[str] = set()
        self._loop_stack: list[dict] = []
        self._class_stack: list[str] = []
        self._loop_seq = 0

    # ── 헬퍼 ──────────────────────────────────────────────────

    def add(self, **fields) -> int:
        if self.source_id:
            fields["src"] = self.source_id
        self.statics.append(fields)
        return len(self.statics) - 1

    def text(self, node) -> str:
        try:
            segment = ast.get_source_segment(self.source, node)
        except Exception:
            segment = None
        return segment if segment else ast.unparse(node)

    def pos(self, node) -> dict:
        return {
            "line": getattr(node, "lineno", 1),
            "col": getattr(node, "col_offset", None),
            "end_col": getattr(node, "end_col_offset", None),
        }

    def probe(self, method: str, sid: int, args=None, keywords=None) -> ast.Call:
        return ast.Call(
            func=ast.Attribute(value=ast.Name(id=TRACER, ctx=ast.Load()), attr=method, ctx=ast.Load()),
            args=[ast.Constant(value=sid), *(args or [])],
            keywords=keywords or [],
        )

    def stmt(self, call: ast.Call, at) -> ast.Expr:
        return ast.copy_location(ast.Expr(value=call), at)

    @staticmethod
    def _names_of(target) -> list[str] | None:
        """대입 대상에서 이름을 순서대로 모은다.

        중첩을 펼치는 이유: `for index, (name, value) in enumerate(zip(...))`는
        흔한 관용구인데, 예전에는 한 겹만 보고 None을 돌려줬다. 그러면 호출부가
        그 자리를 `["_"]`로 메워 **존재하지 않는 이름을 읽는 코드**를 생성했고
        NameError로 끝났다. 대입문에서도 같은 이유로 변수 이벤트가 통째로
        빠져 있었다.
        """
        if isinstance(target, ast.Name):
            return [target.id]
        if isinstance(target, ast.Starred):
            return Instrumenter._names_of(target.value)
        if isinstance(target, (ast.Tuple, ast.List)):
            names: list[str] = []
            for element in target.elts:
                inner = Instrumenter._names_of(element)
                if inner is None:
                    return None
                names.extend(inner)
            return names
        return None

    @staticmethod
    def _loads(names: list[str]) -> list[ast.Name]:
        return [ast.Name(id=n, ctx=ast.Load()) for n in names]

    # ── 모듈 / 함수 ───────────────────────────────────────────

    def visit_Module(self, node: ast.Module) -> ast.Module:
        methods: set[str] = set()
        for child in ast.walk(node):
            if isinstance(child, ast.ClassDef):
                self.user_classes.add(child.name)
                methods.update(f.name for f in child.body
                               if isinstance(f, (ast.FunctionDef, ast.AsyncFunctionDef)))
        for child in ast.walk(node):
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                self.user_functions.add(child.name)
        # method는 이름만으로 부를 수 없다. 전역 함수 취급하면 `run(...)` 같은
        # 무관한 호출까지 method 프레임으로 잡힌다.
        self.user_functions -= methods
        node.body = self.body(node.body)
        return node

    def visit_ClassDef(self, node: ast.ClassDef):
        at = self.pos(node)
        line_sid = self.add(**at)
        names = [f.name for f in node.body if isinstance(f, ast.FunctionDef)]
        sid = self.add(**at, name=node.name, methods=names,
                       init_rule=self._init_rule(node))

        self._class_stack.append(node.name)
        saved = self._loop_stack
        self._loop_stack = []
        node.body = self.body(node.body)
        self._loop_stack = saved
        self._class_stack.pop()

        ast.fix_missing_locations(node)
        register = self.stmt(self.probe("classdef", sid, [ast.Name(id=node.name, ctx=ast.Load())]), node)
        return [self.stmt(self.probe("line", line_sid), node), node, register]

    @staticmethod
    def _init_rule(node: ast.ClassDef) -> list[str]:
        """§5의 "initial state rule". __init__이 self에 붙이는 attribute 이름들이다.
        실행해 보지 않아도 설계도 카드에 적을 수 있으므로 계측 시점에 뽑는다."""
        init = next((f for f in node.body
                     if isinstance(f, ast.FunctionDef) and f.name == "__init__"), None)
        if init is None or not init.args.args:
            return []
        this = init.args.args[0].arg
        return [t.attr for statement in ast.walk(init)
                for t in getattr(statement, "targets", [])
                if isinstance(t, ast.Attribute) and isinstance(t.value, ast.Name)
                and t.value.id == this]

    def body(self, statements: list) -> list:
        out: list = []
        for statement in statements:
            result = self.visit(statement)
            if isinstance(result, list):
                out.extend(result)
            elif result is not None:
                out.append(result)
        return out

    def visit_FunctionDef(self, node: ast.FunctionDef):
        params = [{"name": a.arg} for a in
                  [*node.args.posonlyargs, *node.args.args,
                   *([node.args.vararg] if node.args.vararg else []),
                   *node.args.kwonlyargs,
                   *([node.args.kwarg] if node.args.kwarg else [])]]
        # method 프레임은 `Device.run#1`처럼 보여야 두 인스턴스의 호출이 구분된다
        is_method = bool(self._class_stack)
        prefix = f"{self._class_stack[-1]}." if is_method else ""
        sid = self.add(**self.pos(node), name=prefix + node.name, params=params)

        saved = self._loop_stack
        saved_class = self._class_stack
        self._loop_stack = []
        self._class_stack = []   # method 안의 중첩 def는 method가 아니다
        node.body = self.body(node.body)
        self._loop_stack = saved
        self._class_stack = saved_class

        # docstring은 남겨 두고 그 뒤에 프로브를 넣는다
        insert_at = 1 if (node.body and isinstance(node.body[0], ast.Expr)
                          and isinstance(node.body[0].value, ast.Constant)
                          and isinstance(node.body[0].value.value, str)) else 0
        enter = self.stmt(self.probe("enter", sid, self._loads([p["name"] for p in params])), node)
        node.body.insert(insert_at, enter)

        if is_method:
            # method는 클래스 namespace에 들어간다. 전역에 FUNCTION_DEFINE을 내면
            # 설계도 안의 함수가 전역 변수처럼 보인다 (§10-1이 카드를 나눈 이유).
            return node
        define = self.stmt(self.probe("define", sid, [ast.Name(id=node.name, ctx=ast.Load())]), node)
        return [node, define]

    def visit_Return(self, node: ast.Return):
        line = self.pos(node)
        line_sid = self.add(**line)
        value = node.value if node.value is not None else ast.copy_location(ast.Constant(value=None), node)
        # return 문의 값 표현식은 함수 본문의 의미 그 자체다 → core
        node.value = self.probe("ret", self.add(**line), [self.expr(value, core=True)])
        ast.fix_missing_locations(node)
        return [self.stmt(self.probe("line", line_sid), node), node]

    # ── 대입 ──────────────────────────────────────────────────

    def _origin(self, value) -> dict:
        """값의 출처 (§1.2-3). 반드시 **계측 전** 노드로 판단해야 한다.
        계측 후에는 모든 호출이 `__trace__.call(...)`이라 구분이 사라진다."""
        if isinstance(value, ast.Call):
            callee = value.func
            if isinstance(callee, ast.Name) and callee.id in self.user_functions:
                return {"kind": "return"}
            return {"kind": "expression"}
        if isinstance(value, ast.Constant):
            return {"kind": "literal"}
        if isinstance(value, (ast.List, ast.Dict, ast.Set, ast.Tuple)):
            return {"kind": "literal"}
        return {"kind": "expression"}

    def visit_Assign(self, node: ast.Assign):
        at = self.pos(node)
        line_sid = self.add(**at)
        target = node.targets[0]

        if (isinstance(target, ast.Attribute) and len(node.targets) == 1
                and isinstance(target.value, ast.Name)):
            # `self.equipment_id = equipment_id` (§6). 오른쪽을 먼저 읽고
            # 그 값을 instance attribute에 연결한다.
            sid = self.add(**at, attr=target.attr)
            call = self.probe("setattr_", sid, [ast.Name(id=target.value.id, ctx=ast.Load()),
                                                self.expr(node.value)])
            replaced = ast.copy_location(ast.Expr(value=call), node)
            ast.fix_missing_locations(replaced)
            return [self.stmt(self.probe("line", line_sid), node), replaced]

        if isinstance(target, ast.Subscript) and len(node.targets) == 1:
            sid = self.add(**at)
            call = self.probe("setitem", sid, [
                self.expr(target.value), self.expr(target.slice), self.expr(node.value)])
            replaced = ast.copy_location(ast.Expr(value=call), node)
            ast.fix_missing_locations(replaced)
            return [self.stmt(self.probe("line", line_sid), node), replaced]

        names = self._names_of(target)
        origin = self._origin(node.value)  # 계측 전에 판단한다 (아래 주석 참고)
        node.value = self.expr(node.value)
        ast.fix_missing_locations(node)
        if names is None:
            return [self.stmt(self.probe("line", line_sid), node), node]

        sid = self.add(**at, names=names, origin=origin)
        record = self.stmt(self.probe("assign", sid, self._loads(names)), node)
        return [self.stmt(self.probe("line", line_sid), node), node, record]

    def visit_AugAssign(self, node: ast.AugAssign):
        at = self.pos(node)
        line_sid = self.add(**at)
        node.value = self.expr(node.value)
        ast.fix_missing_locations(node)
        head = self.stmt(self.probe("line", line_sid), node)
        if isinstance(node.target, ast.Attribute) and isinstance(node.target.value, ast.Name):
            sid = self.add(**at, attr=node.target.attr)
            holder = node.target.value.id
            ast.fix_missing_locations(node)
            return [head,
                    self.stmt(self.probe("attr_pre", sid, [ast.Name(id=holder, ctx=ast.Load())]), node),
                    node,
                    self.stmt(self.probe("attr_post", sid, [ast.Name(id=holder, ctx=ast.Load())]), node)]

        names = self._names_of(node.target)
        if names is None:
            return [head, node]
        sid = self.add(**at, names=names, origin={"kind": "expression"})
        return [head, node, self.stmt(self.probe("assign", sid, self._loads(names)), node)]

    def visit_Delete(self, node: ast.Delete):
        out = [node]
        for target in node.targets:
            if isinstance(target, ast.Name):
                sid = self.add(**self.pos(node))
                out.append(self.stmt(self.probe("delete", sid, [ast.Constant(value=target.id)]), node))
        return out

    def visit_Expr(self, node: ast.Expr):
        at = self.pos(node)
        line_sid = self.add(**at)
        node.value = self.expr(node.value)
        ast.fix_missing_locations(node)
        return [self.stmt(self.probe("line", line_sid), node), node]

    # ── 흐름 ──────────────────────────────────────────────────

    def visit_If(self, node: ast.If):
        at = self.pos(node)
        text = self.text(node.test)
        then_line = node.body[0].lineno if node.body else None
        else_line = node.orelse[0].lineno if node.orelse else None
        sid = self.add(**at, text=text, then_line=then_line, else_line=else_line,
                       then_label="if", else_label="else")
        node.test = self.probe("test", sid, [self.expr(node.test, suppress=text)])
        node.body = self.body(node.body)
        node.orelse = self.body(node.orelse)
        ast.fix_missing_locations(node)
        return node

    def visit_For(self, node: ast.For):
        at = self.pos(node)
        # 이름을 못 찾으면 빈 목록이다. 없는 이름으로 메우면 그 이름을 읽는
        # 코드가 생성된다. while이 이미 names=[]로 도는 길과 같다.
        names = self._names_of(node.target) or []
        self._loop_seq += 1
        loop_id = f"loop:{'-'.join(names)}@{node.lineno}"
        parent = self._loop_stack[-1]["loop_id"] if self._loop_stack else None

        source_label = "range"
        if isinstance(node.iter, ast.Call) and isinstance(node.iter.func, ast.Name):
            source_label = node.iter.func.id
        elif isinstance(node.iter, ast.Name):
            source_label = node.iter.id

        start_sid = self.add(**at, loop_id=loop_id, names=names, parent_loop=parent)
        step_sid = self.add(**at, loop_id=loop_id, names=names, source_label=source_label)
        done_sid = self.add(**at, loop_id=loop_id)
        break_sid = self.add(**at, loop_id=loop_id)

        node.iter = self.probe("loop_iter", start_sid, [self.expr(node.iter)])

        self._loop_stack.append({"loop_id": loop_id, "break_sid": break_sid})
        node.body = [self.stmt(self.probe("loop_step", step_sid, self._loads(names)), node),
                     *self.body(node.body)]
        node.orelse = [self.stmt(self.probe("loop_done", done_sid), node), *self.body(node.orelse)]
        self._loop_stack.pop()

        ast.fix_missing_locations(node)
        return node

    def visit_While(self, node: ast.While):
        at = self.pos(node)
        text = self.text(node.test)
        self._loop_seq += 1
        loop_id = f"loop:while@{node.lineno}"
        parent = self._loop_stack[-1]["loop_id"] if self._loop_stack else None

        start_sid = self.add(**at, loop_id=loop_id, names=[], parent_loop=parent)
        test_sid = self.add(**at, loop_id=loop_id, text=text)
        done_sid = self.add(**at, loop_id=loop_id)
        break_sid = self.add(**at, loop_id=loop_id)

        node.test = self.probe("while_test", test_sid, [self.expr(node.test, suppress=text)])
        self._loop_stack.append({"loop_id": loop_id, "break_sid": break_sid})
        node.body = self.body(node.body)
        node.orelse = [self.stmt(self.probe("loop_done", done_sid), node), *self.body(node.orelse)]
        self._loop_stack.pop()

        ast.fix_missing_locations(node)
        return [self.stmt(self.probe("while_start", start_sid), node), node]

    def visit_With(self, node: ast.With):
        """`with open(...) as file:` — 통로를 여는 문장.

        `as` 이름은 블록 안에서만 쓰는 이름이라 블록 **안쪽**에 만든다. 바깥에
        만들면 §10-6의 "블록을 나가면 통로가 닫힌다"가 화면에서 어긋난다.
        """
        at = self.pos(node)
        line_sid = self.add(**at)
        names: list[str] = []
        for item in node.items:
            item.context_expr = self.expr(item.context_expr)
            if item.optional_vars is not None:
                names.extend(self._names_of(item.optional_vars) or [])

        node.body = self.body(node.body)
        if names:
            sid = self.add(**at, names=names, origin={"kind": "expression"})
            node.body.insert(0, self.stmt(self.probe("assign", sid, self._loads(names)), node))
        ast.fix_missing_locations(node)
        return [self.stmt(self.probe("line", line_sid), node), node]

    def visit_Import(self, node: ast.Import):
        at = self.pos(node)
        out: list = [self.stmt(self.probe("line", self.add(**at)), node)]
        for alias in node.names:
            if "." in alias.name:
                raise SyntaxError(f"점이 들어간 모듈 이름은 아직 열지 않습니다: {alias.name}")
            bind = alias.asname or alias.name
            sid = self.add(**at, kind="plain", module=alias.name, names=[], binds=[bind])
            out.append(self._bind_import(node, sid, [bind]))
        return out

    def visit_ImportFrom(self, node: ast.ImportFrom):
        at = self.pos(node)
        if node.module is None or any(a.name == "*" for a in node.names):
            raise SyntaxError("상대 import와 `import *`는 열지 않습니다")
        names = [a.name for a in node.names]
        binds = [a.asname or a.name for a in node.names]
        sid = self.add(**at, kind="from", module=node.module, names=names, binds=binds)
        return [self.stmt(self.probe("line", self.add(**at)), node),
                self._bind_import(node, sid, binds)]

    def _bind_import(self, at, sid: int, binds: list[str]) -> ast.Assign:
        """import 문을 프로브 호출 + 대입으로 바꾼다.

        문장을 그대로 두고 프로브를 덧붙일 수 없다. `import`는 __import__을
        찾는데 그 이름이 샌드박스에 없어서 문장 자체가 죽기 때문이다.
        """
        assign = ast.Assign(
            targets=[ast.Tuple(elts=[ast.Name(id=b, ctx=ast.Store()) for b in binds],
                               ctx=ast.Store())],
            value=self.probe("import_", sid),
        )
        ast.copy_location(assign, at)
        ast.fix_missing_locations(assign)
        return assign

    def visit_Break(self, node: ast.Break):
        if not self._loop_stack:
            return node
        return [self.stmt(self.probe("loop_break", self._loop_stack[-1]["break_sid"]), node), node]

    def visit_Raise(self, node: ast.Raise):
        if node.exc is None:
            return node
        sid = self.add(**self.pos(node))
        node.exc = self.probe("raising", sid, [self.expr(node.exc)])
        ast.fix_missing_locations(node)
        return node

    def visit_Try(self, node: ast.Try):
        at = self.pos(node)
        sid = self.add(**at)
        body = self.body(node.body)
        # 어떤 예외든 지나가면서 한 번 기록하고 그대로 다시 던진다.
        watcher = ast.Try(
            body=body,
            handlers=[ast.ExceptHandler(
                type=ast.Name(id="BaseException", ctx=ast.Load()),
                name="__exc__",
                body=[self.stmt(self.probe("thrown", sid, [ast.Name(id="__exc__", ctx=ast.Load())]), node),
                      ast.Raise(exc=None, cause=None)],
            )],
            orelse=[], finalbody=[],
        )
        ast.copy_location(watcher, node)
        node.body = [watcher]
        for handler in node.handlers:
            hid = self.add(line=handler.lineno, col=handler.col_offset, end_col=handler.end_col_offset)
            handler.body = [self.stmt(self.probe("caught", hid), handler), *self.body(handler.body)]
        node.orelse = self.body(node.orelse)
        node.finalbody = self.body(node.finalbody)
        ast.fix_missing_locations(node)
        return node

    # ── 표현식 ────────────────────────────────────────────────

    def expr(self, node, core: bool = False, suppress: str | None = None):
        """표현식 계측. `suppress`가 주어지면 그 텍스트의 최상위 노드는
        이벤트를 내지 않는다 (조건식은 BRANCH_TEST가 대신 보여 준다)."""
        if node is None:
            return None
        text = self.text(node)
        emit = suppress != text

        if isinstance(node, ast.BinOp) and type(node.op) in BIN_OPS:
            op, fn = BIN_OPS[type(node.op)]
            sid = self.add(**self.pos(node), text=text, op=op, fn=fn, emit=emit, core=core)
            out = self.probe("binop", sid, [self.expr(node.left), self.expr(node.right)])
            return ast.copy_location(out, node)

        if isinstance(node, ast.UnaryOp) and type(node.op) in UNARY_OPS:
            op, fn = UNARY_OPS[type(node.op)]
            sid = self.add(**self.pos(node), text=text, op=op, fn=fn, emit=emit, core=core)
            return ast.copy_location(self.probe("unaryop", sid, [self.expr(node.operand)]), node)

        if isinstance(node, ast.Compare) and len(node.ops) == 1 and type(node.ops[0]) in CMP_OPS:
            op, fn = CMP_OPS[type(node.ops[0])]
            sid = self.add(**self.pos(node), text=text, op=op, fn=fn, emit=emit, core=core)
            out = self.probe("compare", sid, [self.expr(node.left), self.expr(node.comparators[0])])
            return ast.copy_location(out, node)

        if isinstance(node, ast.BoolOp):
            op = "and" if isinstance(node.op, ast.And) else "or"
            texts = [self.text(v) for v in node.values]
            sid = self.add(**self.pos(node), text=text, op=op, texts=texts, emit=emit, core=core)
            thunks = [ast.Lambda(args=ast.arguments(posonlyargs=[], args=[], kwonlyargs=[],
                                                    kw_defaults=[], defaults=[]),
                                 body=self.expr(v))
                      for v in node.values]
            return ast.copy_location(self.probe("boolop", sid, thunks), node)

        if isinstance(node, ast.Subscript) and isinstance(node.ctx, ast.Load):
            sid = self.add(**self.pos(node), text=text)
            out = self.probe("getitem", sid, [self.expr(node.value), self.expr(node.slice)])
            return ast.copy_location(out, node)

        if isinstance(node, (ast.ListComp, ast.SetComp, ast.GeneratorExp, ast.DictComp)):
            return self.comprehension(node, text, core=core)

        if isinstance(node, ast.Lambda):
            # 몸통 안쪽은 평소대로 계측하고, 바깥에서 프레임만 씌운다.
            node.body = self.expr(node.body, core=True)
            params = [a.arg for a in [*node.args.posonlyargs, *node.args.args]]
            sid = self.add(**self.pos(node), text=text, params=params)
            ast.fix_missing_locations(node)
            return ast.copy_location(self.probe("keyfn", sid, [node]), node)

        if isinstance(node, ast.Attribute) and isinstance(node.ctx, ast.Load):
            # `eq1.status`, `config.LIMIT`. 점 오른쪽 이름을 어느 카드에서
            # 찾았는지가 P20·P21의 핵심이라 읽는 장면을 남긴다.
            sid = self.add(**self.pos(node), text=text, attr=node.attr)
            out = self.probe("getattr_", sid, [self.expr(node.value)])
            return ast.copy_location(out, node)

        if isinstance(node, ast.Call):
            return self.call(node, text)

        # 그 밖의 노드는 자식만 계측한다
        for field, old in ast.iter_fields(node):
            if isinstance(old, list):
                setattr(node, field, [self.expr(v) if isinstance(v, ast.expr) else v for v in old])
            elif isinstance(old, ast.expr):
                setattr(node, field, self.expr(old))
        return node

    def comprehension(self, node, text: str, core: bool = False):
        """comprehension 안의 숨은 반복을 드러낸다 (§P15 §10-1의 네 영역).

        가장 바깥 `for` 하나만 계측한다. 중첩까지 손대면 생성되는 코드가
        원래 의미와 어긋날 위험이 커지는데, 교재의 중첩 예는 §10-6이 P11
        격자로 넘기므로 여기서 감당할 것이 아니다.
        """
        at = self.pos(node)
        first = node.generators[0]
        if first.is_async:
            return node

        names = self._names_of(first.target) or []
        self._loop_seq += 1
        loop_id = f"comp:{'-'.join(names) or 'item'}@{node.lineno}"
        parent = self._loop_stack[-1]["loop_id"] if self._loop_stack else None
        label = first.iter.id if isinstance(first.iter, ast.Name) else "입력"
        builds = isinstance(node, (ast.ListComp, ast.SetComp))

        iter_sid = self.add(**at, loop_id=loop_id, names=names, parent_loop=parent,
                            label=label, builder=builds)
        first.iter = self.probe("comp_iter", iter_sid, [self.expr(first.iter)])

        first.ifs = [
            self.probe("comp_test",
                       self.add(**self.pos(test), text=self.text(test), loop_id=loop_id),
                       [self.expr(test, suppress=self.text(test))])
            for test in first.ifs
        ]

        for extra in node.generators[1:]:
            extra.iter = self.expr(extra.iter)
            extra.ifs = [self.expr(test) for test in extra.ifs]

        if isinstance(node, ast.DictComp):
            node.key = self.expr(node.key)
            node.value = self.expr(node.value)
        else:
            elt_text = self.text(node.elt)
            elt_sid = self.add(**self.pos(node.elt), text=elt_text, loop_id=loop_id)
            # 안쪽 연산이 따로 이벤트를 내면 같은 식이 두 번 보인다. 조건식에서
            # BRANCH_TEST가 대신 보여 주는 것과 같은 처리다.
            node.elt = self.probe("comp_elt", elt_sid, [self.expr(node.elt, suppress=elt_text)])

        done_sid = self.add(**at, loop_id=loop_id)
        ast.fix_missing_locations(node)
        # GeneratorExp는 게으르다. 여기서 끝났다고 말하면 거짓이 된다.
        if isinstance(node, ast.GeneratorExp):
            return node
        return ast.copy_location(self.probe("comp_done", done_sid, [node]), node)

    def call(self, node: ast.Call, text: str):
        func = node.func
        at = self.pos(node)

        if isinstance(func, ast.Name) and func.id == "print":
            sid = self.add(**at)
            out = self.probe("print_", sid, [self.expr(a) for a in node.args],
                             [ast.keyword(arg=k.arg, value=self.expr(k.value)) for k in node.keywords])
            return ast.copy_location(out, node)

        if isinstance(func, ast.Attribute) and func.attr in ("append", "pop", "remove", "discard", "insert"):
            sid = self.add(**at, method=func.attr)
            out = self.probe("method", sid, [self.expr(func.value), *[self.expr(a) for a in node.args]])
            return ast.copy_location(out, node)

        if isinstance(func, ast.Name) and func.id in self.user_classes:
            sid = self.add(**at)
            out = self.probe("construct", sid,
                             [ast.Name(id=func.id, ctx=ast.Load()), *[self.expr(a) for a in node.args]],
                             [ast.keyword(arg=k.arg, value=self.expr(k.value)) for k in node.keywords])
            return ast.copy_location(out, node)

        if isinstance(func, ast.Attribute):
            # 남은 모든 점 호출이 여기로 온다. 내장 타입의 method는 attrcall이
            # 조용히 통과시키므로 기존 트레이스가 달라지지 않는다.
            sid = self.add(**at, method=func.attr, callee=self.text(func))
            out = self.probe("attrcall", sid,
                             [self.expr(func.value), *[self.expr(a) for a in node.args]],
                             [ast.keyword(arg=k.arg, value=self.expr(k.value)) for k in node.keywords])
            return ast.copy_location(out, node)

        if isinstance(func, ast.Name) and func.id in self.user_functions:
            arg_names = [a.id if isinstance(a, ast.Name) else None for a in node.args]
            sid = self.add(**at, callee=func.id, arg_names=arg_names)
            # 인수는 호출 전에 하나씩 읽힌다. §3.2의 "i 읽기 → k 읽기 → 프레임 생성"
            wrapped = []
            for original in node.args:
                inner = self.expr(original)
                if isinstance(original, ast.Constant):
                    wrapped.append(inner)  # 리터럴은 읽는 장면이 없다
                else:
                    aid = self.add(**self.pos(original), text=self.text(original))
                    wrapped.append(ast.copy_location(self.probe("arg", aid, [inner]), original))
            out = self.probe("call", sid, [ast.Name(id=func.id, ctx=ast.Load()), *wrapped],
                             [ast.keyword(arg=k.arg, value=self.expr(k.value)) for k in node.keywords])
            return ast.copy_location(out, node)

        node.func = self.expr(func) if not isinstance(func, ast.Name) else func
        node.args = [self.expr(a) for a in node.args]
        for keyword in node.keywords:
            keyword.value = self.expr(keyword.value)
        return node


# ─────────────────────────────────────────────────────────────
# 진입점
# ─────────────────────────────────────────────────────────────

def trace_source(code: str, *, path: str = "main.py", lesson_id: str = "adhoc",
                 limits: dict | None = None, files: dict | None = None,
                 modules: dict | None = None) -> dict:
    """소스를 계측 실행해 TraceDocument(dict)를 만든다. 브라우저/빌드 공용 진입점."""
    lines = code.splitlines()
    settings = {**DEFAULT_LIMITS, "source_lines": len(lines), **(limits or {})}

    tree = ast.parse(code, filename=path)
    instrumenter = Instrumenter(code)
    tree = instrumenter.visit(tree)
    ast.fix_missing_locations(tree)

    recorder = Recorder(instrumenter.statics, settings)
    # open은 화이트리스트에 없다. 진짜 파일이 아니라 이 트레이스에 매인 통로여야
    # 커서와 내용을 화면에 그릴 수 있기 때문이다 (§P18 §5).
    table = safe_builtins()
    filesystem = VirtualFS(recorder, files or {})
    table["open"] = filesystem.open
    recorder._builtins = table
    recorder._stdlib = stdlib_modules()
    # 같은 레슨에 딸린 다른 파일들. §P20 §5가 나란히 두는 두 번째 파일이다.
    for name, body in (modules or {}).items():
        module_tree = ast.parse(body, filename=f"{name}.py")
        module_tree = Instrumenter(body, recorder.statics, f"{name}.py").visit(module_tree)
        ast.fix_missing_locations(module_tree)
        recorder._module_sources[name] = (module_tree, f"{name}.py")
    namespace = {TRACER: recorder, "__builtins__": table, "__name__": "__main__"}

    reason = "normal"
    try:
        exec(compile(tree, path, "exec"), namespace)
    except TraceLimit:
        reason = "truncated"
    except BaseException as exc:  # noqa: BLE001 — 학습자 코드의 오류는 결과물이다
        reason = "error"
        _record_uncaught(recorder, exc)

    try:
        recorder.close_paused()
    except TraceLimit:
        pass

    last_line = recorder.events[-1]["line"] if recorder.events else 1
    try:
        recorder._emit("PROGRAM_END", last_line, "core", frame="global", reason=reason)
    except TraceLimit:
        pass

    return {
        "version": 1,
        "lessonId": lesson_id,
        "source": {"path": path, "language": "python", "lines": lines},
        # 모듈 파일도 코드 패널이 보여 줄 수 있어야 §10-2의 "하이라이트를
        # imported module의 첫 줄로 옮긴다"가 성립한다.
        "sources": [{"path": f"{name}.py", "language": "python", "lines": body.splitlines()}
                    for name, body in (modules or {}).items()],
        "initialFiles": dict(files or {}),
        "events": recorder.events,
        "meta": {
            "generator": "python-tracer/1",
            "truncated": recorder.truncated,
            # 계측 실행의 stdout. 계측 없는 실행과 같아야 한다.
            "stdout": "".join(recorder.stdout),
        },
    }


def _record_uncaught(recorder: Recorder, exc: BaseException) -> None:
    """잡히지 않은 예외를 오류 이벤트로 남긴다. 줄 번호는 트레이스백에서 얻는다.

    계측 코드는 원본 노드의 위치를 그대로 물려받으므로 트레이스백의 줄 번호가
    학습자가 보는 코드의 줄 번호와 일치한다.
    """
    try:
        recorder.thrown_at(exc, 1)   # 이미 call()이 기록했다면 무시된다
        recorder.unwind("global")    # 계측 밖에서 풀린 프레임이 있으면 정리
    except TraceLimit:
        pass


if __name__ == "__main__":
    import json
    import sys

    source_path = sys.argv[1]
    lesson = sys.argv[2] if len(sys.argv) > 2 else "adhoc"
    # 세 번째 인수는 "실행 전 디스크에 있던 파일들"이다 (§9의 Before 상태).
    seed = {}
    if len(sys.argv) > 3 and sys.argv[3]:
        with open(sys.argv[3], encoding="utf8") as handle:
            seed = json.load(handle)
    mods = {}
    if len(sys.argv) > 4 and sys.argv[4]:
        with open(sys.argv[4], encoding="utf8") as handle:
            for name, module_path in json.load(handle).items():
                with open(module_path, encoding="utf8") as source:
                    mods[name] = source.read()
    with open(source_path, encoding="utf8") as handle:
        body = handle.read()
    document = trace_source(body, path=source_path.split("/")[-1], lesson_id=lesson,
                            files=seed, modules=mods)
    json.dump(document, sys.stdout, ensure_ascii=False)
