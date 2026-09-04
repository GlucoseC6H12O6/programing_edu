/**
 * 실행 트레이스 스키마 (v1)
 *
 * 기획서 §3.3의 "언어 중립 이벤트 모델"을 타입으로 옮긴 것이다.
 * 설계 원칙 두 가지:
 *
 *  1. 표현식 단위까지 미리 설계한다. §3.2의 상세 모드(`i 읽기 → k 읽기 →
 *     프레임 생성 → 바인딩 → 곱셈 → return`)를 나중에 끼워 넣으려면 스키마를
 *     줄 단위에만 맞춰 두면 안 된다. 구현은 단계적으로 하되 스키마는 지금 연다.
 *  2. 이벤트는 변경분만 담는다. 전체 상태는 reducer가 events를 접어서 만든다.
 *     (§3.3 "이전 단계 이동은 역실행이 아니라 스냅샷 또는 체크포인트+재실행")
 */

export type Language = "python" | "javascript";

/** §3.7 상세도: `핵심 단계`와 `표현식 상세` 전환 */
export type DetailLevel = "core" | "expression";

export type FrameId = string;
export type HeapId = string;
export type LoopId = string;

// ─────────────────────────────────────────────────────────────
// 값
// ─────────────────────────────────────────────────────────────

export type PrimitiveType =
  | "int"
  | "float"
  | "str"
  | "bool"
  | "none" // Python None
  | "undefined" // JS undefined
  | "null" // JS null
  | "nan"
  | "bigint"
  | "file"; // §P18의 파일 통로. 내용이 아니라 통로라는 것이 요점이다

export interface PrimitiveValue {
  kind: "primitive";
  type: PrimitiveType;
  /** 화면에 그대로 쓰는 언어별 표기. 예: "94.2", "'W01'", "True", "None" */
  repr: string;
}

/** 힙 객체 참조. §3.4의 "변수 카드 → 객체 박스" 선이 이 참조로 그려진다. */
export interface RefValue {
  kind: "ref";
  id: HeapId;
}

export type Value = PrimitiveValue | RefValue;

export const prim = (type: PrimitiveType, repr: string): PrimitiveValue => ({
  kind: "primitive",
  type,
  repr,
});
export const ref = (id: HeapId): RefValue => ({ kind: "ref", id });

// ─────────────────────────────────────────────────────────────
// 힙
// ─────────────────────────────────────────────────────────────

export interface ParamSpec {
  name: string;
  default?: Value;
}

export interface HeapFunction {
  kind: "function";
  id: HeapId;
  name: string;
  params: ParamSpec[];
  defLine: number;
}

/** list / tuple / JS Array. `frozen`은 §P06의 Tuple 잠금 아이콘용. */
export interface HeapSequence {
  kind: "sequence";
  id: HeapId;
  label: "list" | "tuple" | "array";
  items: Value[];
  frozen?: boolean;
}

export interface MapEntry {
  key: string;
  value: Value;
}

/** dict / JS Object / 클래스 인스턴스 */
export interface HeapMapping {
  kind: "mapping";
  id: HeapId;
  label: "dict" | "object" | "instance";
  className?: string;
  entries: MapEntry[];
}

export interface HeapSet {
  kind: "set";
  id: HeapId;
  items: Value[];
  /**
   * 표시 순서가 실제 순서가 아님을 뜻한다. Python의 set은 순서를 보장하지 않아
   * 트레이서가 임의로 고정한 순서다. JS의 Set은 삽입 순서를 지키므로 붙지 않는다.
   */
  unordered?: boolean;
}

/**
 * §P21 §10-1 "Class Card에는 attribute 초기화 규칙과 method 함수들을, Heap에는
 * instance 카드를 따로 둔다". 설계도는 인스턴스가 아니므로 카드가 다르다.
 * 인스턴스 쪽은 `HeapMapping`의 label="instance"가 맡는다.
 */
export interface HeapClass {
  kind: "class";
  id: HeapId;
  name: string;
  methods: { name: string; params: string[] }[];
  /** class attribute. instance attribute와 다른 카드에 있다는 것이 §6의 요점 */
  attributes: MapEntry[];
  /** §5의 "initial state rule". __init__이 self에 붙이는 이름들 */
  initRule?: string[];
}

/**
 * §P20 §10-1 "각각 독립된 Module Namespace 카드를 둔다".
 *
 * import는 함수 내용을 복사하는 것이 아니라 이 카드 하나를 만들고 이름이
 * 그것을 가리키게 하는 일이다 (§5). 그래서 카드가 별도로 있어야 한다.
 */
export interface HeapModule {
  kind: "module";
  id: HeapId;
  name: string;
  names: MapEntry[];
}

/** range는 값을 모두 만들지 않으므로 별도 표현. §P09의 값 트랙에 쓰인다. */
export interface HeapRange {
  kind: "range";
  id: HeapId;
  start: number;
  stop: number;
  step: number;
}

export type HeapObject =
  | HeapFunction
  | HeapSequence
  | HeapMapping
  | HeapSet
  | HeapRange
  | HeapClass
  | HeapModule;

// ─────────────────────────────────────────────────────────────
// 바인딩 / 프레임 / 루프
// ─────────────────────────────────────────────────────────────

/** §1.2-3 "값의 출처 표시": 값이 어디에서 왔는지 화살표로 그리기 위한 정보 */
export interface ValueOrigin {
  kind: "literal" | "argument" | "expression" | "iteration" | "return" | "import";
  /** 출처 경로. 예: "global.i" */
  from?: string;
  label?: string;
}

export interface Binding {
  name: string;
  value: Value;
  origin?: ValueOrigin;
  createdAtStep: number;
  updatedAtStep: number;
  /** 직전 값. §1.2-4 "변경 전후 비교"에서 `이전 → 현재` 표시에 쓴다. */
  previous?: Value;
  /**
   * §3.4: 범위를 벗어난 변수는 즉시 사라지게 하지 않고 흐려진 뒤 접는다.
   * 프레임이 pop 돼도 한 단계는 retired 상태로 남긴다.
   */
  retired?: boolean;
}

export interface Frame {
  id: FrameId;
  /** 표시 이름. "global" 또는 함수명 */
  name: string;
  /** 동일 함수의 반복 호출 구분. §3.5의 mul#1, mul#2 */
  callNumber?: number;
  /** module의 최상위 실행 프레임. 호출이 아니므로 회차 번호가 없다 (§P20) */
  kind?: "module";
  parentId: FrameId | null;
  bindings: Binding[];
  /** §3.5 "다음 복귀 위치" */
  returnLine: number | null;
  /** 호출한 줄 */
  callLine?: number;
  /** §P23: yield에서 멈춘 generator 프레임은 사라지지 않고 "paused"로 남는다 */
  phase: "active" | "waiting" | "returning" | "retired" | "paused";
}

/** §3.6 반복 트랙 */
export interface LoopState {
  id: LoopId;
  frameId: FrameId;
  line: number;
  /** 반복 변수 이름들. for i in ... → ["i"], for a, b in ... → ["a","b"] */
  varNames: string[];
  /** 트랙에 그릴 값 미리보기 */
  track: string[];
  /** 현재 회차 인덱스. -1이면 아직 첫 회차 진입 전 */
  index: number;
  parentLoopId?: LoopId;
  status: "running" | "done";
}

export interface OutputEntry {
  step: number;
  line: number;
  stream: "stdout" | "stderr" | "return" | "warning";
  text: string;
}

export interface ErrorState {
  step: number;
  line: number;
  /** ValueError, TypeError ... */
  name: string;
  message: string;
  /** 오류가 거쳐 온 프레임. §3.9 "호출 스택을 거슬러 올라가는 오류 경로" */
  propagatedThrough: FrameId[];
  caught: boolean;
  caughtAtLine?: number;
}

/** 상세 모드에서 "지금 무엇을 계산 중인가"를 표시하기 위한 노트 */
export interface EvalNote {
  step: number;
  line: number;
  /** 화면에 보여줄 원본 표현식. 예: "mul(i, k)" */
  expression: string;
  /** 실제 값으로 치환한 형태. §P11 "mul(i, k) → mul(2, 4)" */
  substituted?: string;
  result?: Value;
}

// ─────────────────────────────────────────────────────────────
// 프로그램 상태 (reducer 산출물)
// ─────────────────────────────────────────────────────────────

/**
 * 아직 결과가 정해지지 않은 일. §J21 §5의 "대기 중인 작업" 카드다.
 *
 * Call Stack에는 없는데 프로그램은 끝나지 않은 상태가 비동기의 전부이므로,
 * 그 사이에 무엇이 남아 있는지를 보여 주는 자리가 따로 있어야 한다.
 */
export interface TaskState {
  id: string;
  label: string;
  state: "pending" | "fulfilled" | "rejected";
  value?: Value;
  /** 이 작업을 기다리며 멈춰 있는 프레임 */
  awaitedBy?: FrameId;
}

export interface ProgramState {
  step: number;
  /** 이번 단계에서 실행할(또는 실행한) 줄 */
  line: number | null;
  /** §3.1 "이전/다음 줄 표시" */
  prevLine: number | null;
  /** 실행이 끝난 줄. 연한 초록 하이라이트 */
  completedLines: number[];
  frames: Frame[];
  heap: Record<HeapId, HeapObject>;
  loops: LoopState[];
  output: OutputEntry[];
  evaluating: EvalNote[];
  /** §P18 §10-1의 Disk File 패널. 프로그램 바깥에 있고 실행이 끝나도 남는다. */
  files: FileState[];
  /** 지금 실행 중인 파일. `TraceDocument.source.path`가 기본값이다. */
  sourcePath: string | null;
  /** §J21 §10의 작업 목록. 비동기 레슨에서만 찬다. */
  tasks: TaskState[];
  status: "ready" | "running" | "done" | "error";
  error: ErrorState | null;
}

// ─────────────────────────────────────────────────────────────
// 이벤트
// ─────────────────────────────────────────────────────────────

interface EventBase {
  step: number;
  line: number;
  frameId: FrameId;
  detail: DetailLevel;
  /**
   * 이 줄이 속한 파일. 레슨 대부분은 한 파일이라 비어 있고, 그때는
   * `TraceDocument.source`를 뜻한다. §P20처럼 여러 파일이 도는 레슨에서만 찬다.
   */
  source?: string;
  /**
   * §9.3 규칙에 맞춘 설명 문구.
   * 대부분 narrate.ts가 이벤트에서 생성하고, 레슨이 개별 오버라이드한다.
   * (P11 9×9면 수백 단계라 손으로 쓸 수 없다.)
   */
  message?: string;
  /**
   * 원본 소스 위치. 계측 코드 ↔ 원본 매핑이 어긋나면 하이라이트 전체가
   * 무너지므로 이벤트마다 들고 다닌다.
   */
  span?: { startCol: number; endCol: number };
}

// 실행
export interface LineEnterEvent extends EventBase {
  type: "LINE_ENTER";
}
export interface LineExitEvent extends EventBase {
  type: "LINE_EXIT";
}
export interface ProgramEndEvent extends EventBase {
  type: "PROGRAM_END";
  reason: "normal" | "error" | "truncated";
}

// 값
export interface ExpressionEvalEvent extends EventBase {
  type: "EXPRESSION_EVAL";
  expression: string;
  substituted?: string;
  result?: Value;
  /** 계산 시작만 알리는 이벤트면 true (결과는 뒤따르는 이벤트에서 확정) */
  pending?: boolean;
}
export interface VariableCreateEvent extends EventBase {
  type: "VARIABLE_CREATE";
  name: string;
  value: Value;
  origin?: ValueOrigin;
}
export interface VariableUpdateEvent extends EventBase {
  type: "VARIABLE_UPDATE";
  name: string;
  before: Value;
  after: Value;
  origin?: ValueOrigin;
}
export interface VariableDeleteEvent extends EventBase {
  type: "VARIABLE_DELETE";
  name: string;
}

// 흐름
export interface BranchTestEvent extends EventBase {
  type: "BRANCH_TEST";
  expression: string;
  substituted?: string;
  result: boolean;
  /** §3.6 조건 평가 트리의 하위 항목 */
  operands?: { expression: string; substituted: string; result?: string }[];
  /** §P05 단축 평가로 실행되지 않은 부분 */
  skipped?: string[];
}
export interface BranchTakenEvent extends EventBase {
  type: "BRANCH_TAKEN";
  label: string;
  targetLine: number;
}
export interface LoopStartEvent extends EventBase {
  type: "LOOP_START";
  loopId: LoopId;
  varNames: string[];
  track: string[];
  parentLoopId?: LoopId;
}
export interface LoopIterationEvent extends EventBase {
  type: "LOOP_ITERATION";
  loopId: LoopId;
  index: number;
}
export interface LoopEndEvent extends EventBase {
  type: "LOOP_END";
  loopId: LoopId;
  reason: "exhausted" | "break";
}

// 함수
export interface FunctionDefineEvent extends EventBase {
  type: "FUNCTION_DEFINE";
  name: string;
  heapId: HeapId;
  params: ParamSpec[];
}
export interface FunctionCallEvent extends EventBase {
  type: "FUNCTION_CALL";
  callee: string;
  /** 실제 값으로 치환한 호출식. §P11 "mul(2, 4)" */
  substituted: string;
  args: { value: Value; from?: string }[];
  targetFrameId: FrameId;
  /** method 호출에서 점 왼쪽이 가리킨 객체. §P21 §10-4의 self 연결선 */
  receiver?: Value;
}
export interface FunctionEnterEvent extends EventBase {
  type: "FUNCTION_ENTER";
  /** 모듈의 최상위 실행도 프레임을 만든다. 호출이 아니라는 것만 다르다. */
  kind?: "module";
  name: string;
  callNumber: number;
  parentFrameId: FrameId;
  returnLine: number;
}
export interface ParameterBindEvent extends EventBase {
  type: "PARAMETER_BIND";
  name: string;
  value: Value;
  from?: string;
}
export interface FunctionReturnEvent extends EventBase {
  type: "FUNCTION_RETURN";
  value: Value;
  /** 반환값이 돌아갈 줄 */
  toLine: number;
}
export interface FramePopEvent extends EventBase {
  type: "FRAME_POP";
  poppedFrameId: FrameId;
  /** 끝까지 소비되지 않은 generator가 프로그램 종료로 정리된 경우 (§P23) */
  reason?: "abandoned";
}

// generator (§P23)
/** 호출했지만 몸통은 아직 돌지 않았다. 이 시차가 이 레슨의 전부다. */
export interface GeneratorCreateEvent extends EventBase {
  type: "GENERATOR_CREATE";
  name: string;
  substituted: string;
  targetFrameId: FrameId;
}
export interface GeneratorYieldEvent extends EventBase {
  type: "GENERATOR_YIELD";
  value: Value;
  /** 값을 받아 갈 프레임 */
  toFrameId: FrameId;
}
export interface GeneratorResumeEvent extends EventBase {
  type: "GENERATOR_RESUME";
  fromFrameId: FrameId;
}

// 클래스 (§P21)
export interface ClassDefineEvent extends EventBase {
  type: "CLASS_DEFINE";
  name: string;
  heapId: HeapId;
  methods: string[];
}
/** 설계도 호출이 만든 빈 instance. __init__ 프레임보다 먼저 온다 (§10-2) */
export interface InstanceCreateEvent extends EventBase {
  type: "INSTANCE_CREATE";
  heapId: HeapId;
  className: string;
  classHeapId: HeapId;
}
export interface AttrReadEvent extends EventBase {
  type: "ATTR_READ";
  target: HeapId;
  attr: string;
  value: Value;
  /** 이름을 어느 카드에서 찾았는가. §6의 "class attribute를 가린다" */
  owner: "instance" | "class" | "module";
}
export interface AttrWriteEvent extends EventBase {
  type: "ATTR_WRITE";
  target: HeapId;
  attr: string;
  before?: Value;
  after: Value;
}

// 컬렉션
/**
 * 힙에 객체가 놓이거나 내용이 바뀐 것을 알린다.
 *
 * tracer는 모든 변형(append, 슬라이스 대입, sort ...)을 계측하는 대신 값을 읽는
 * 시점에 스냅샷과 비교해 달라졌으면 이 이벤트를 다시 낸다. 계측하지 못한 변형이
 * 있어도 §3.4의 힙 그림이 조용히 틀리는 일이 없다. ITEM_* 이벤트는 "무엇이
 * 어떻게 바뀌었는가"를 설명하기 위한 것이고, 힙의 진실은 항상 이쪽이다.
 */
export interface HeapAllocEvent extends EventBase {
  type: "HEAP_ALLOC";
  object: HeapObject;
}
export interface ItemReadEvent extends EventBase {
  type: "ITEM_READ";
  target: HeapId;
  key: string;
  value: Value;
}
export interface ItemWriteEvent extends EventBase {
  type: "ITEM_WRITE";
  target: HeapId;
  key: string;
  before?: Value;
  after: Value;
}
export interface ItemAppendEvent extends EventBase {
  type: "ITEM_APPEND";
  target: HeapId;
  value: Value;
}
export interface ItemRemoveEvent extends EventBase {
  type: "ITEM_REMOVE";
  target: HeapId;
  key: string;
}
export interface IteratorMoveEvent extends EventBase {
  type: "ITERATOR_MOVE";
  target: HeapId;
  index: number;
  value: Value;
}

// 모듈 (§P20)
export interface ModuleImportEvent extends EventBase {
  type: "MODULE_IMPORT";
  module: string;
  heapId: HeapId;
  /** 이 문장이 현재 namespace에 만드는 이름들 */
  binds: string[];
  /** `from ... import ...`에서 고른 이름들. 통째 import면 없다. */
  names?: string[];
  /** §10-6 Import Cache: 이미 로드된 모듈이면 최상위 코드를 다시 돌지 않는다 */
  cached: boolean;
}

// 파일 (§P18)
/**
 * §5의 세 영역 중 "Disk file"과 "File object"의 상태.
 *
 * 내용을 통째로 들고 다니는 이유는 힙과 같다. 쓰기 이벤트를 접어서 내용을
 * 재구성하면 계측하지 못한 변형에서 화면이 조용히 어긋난다. 진실은 항상
 * 이벤트가 실어 온 전체 내용이다.
 */
export interface FileState {
  path: string;
  content: string;
  /** 열려 있는 통로. 닫히면 사라진다 (§10-6의 "closed 표식") */
  open?: { mode: string; encoding: string; cursor: number };
  updatedAtStep?: number;
}

export interface FileOpenEvent extends EventBase {
  type: "FILE_OPEN";
  path: string;
  mode: string;
  encoding: string;
  cursor: number;
  content: string;
  /** w 모드가 버린 기존 내용. §10-5의 "위험 사건" */
  discarded?: string;
}
export interface FileWriteEvent extends EventBase {
  type: "FILE_WRITE";
  path: string;
  text: string;
  cursor: number;
  content: string;
}
export interface FileReadEvent extends EventBase {
  type: "FILE_READ";
  path: string;
  text: string;
  cursor: number;
}
export interface FileCloseEvent extends EventBase {
  type: "FILE_CLOSE";
  path: string;
  content: string;
}

// 입출력
export interface OutputAppendEvent extends EventBase {
  type: "OUTPUT_APPEND";
  stream: OutputEntry["stream"];
  text: string;
}

// 오류
export interface ErrorThrowEvent extends EventBase {
  type: "ERROR_THROW";
  name: string;
  message: string;
}
export interface ErrorPropagateEvent extends EventBase {
  type: "ERROR_PROPAGATE";
  fromFrameId: FrameId;
  toFrameId: FrameId;
}
export interface ErrorCatchEvent extends EventBase {
  type: "ERROR_CATCH";
  handlerLine: number;
}

/**
 * 비동기 (J21/J22). Phase 2에서 reducer를 채운다.
 * 스키마만 먼저 여는 이유는 위 설계 원칙 1과 같다.
 */
export interface TaskCreateEvent extends EventBase {
  type: "TASK_CREATE";
  taskId: string;
  label: string;
}
export interface PromiseStateEvent extends EventBase {
  type: "PROMISE_STATE";
  taskId: string;
  state: "pending" | "fulfilled" | "rejected";
  value?: Value;
}
export interface AwaitSuspendEvent extends EventBase {
  type: "AWAIT_SUSPEND";
  taskId: string;
}
export interface AwaitResumeEvent extends EventBase {
  type: "AWAIT_RESUME";
  taskId: string;
  value?: Value;
}
export interface TaskCompleteEvent extends EventBase {
  type: "TASK_COMPLETE";
  taskId: string;
}

export type TraceEvent =
  | LineEnterEvent
  | LineExitEvent
  | ProgramEndEvent
  | ExpressionEvalEvent
  | VariableCreateEvent
  | VariableUpdateEvent
  | VariableDeleteEvent
  | BranchTestEvent
  | BranchTakenEvent
  | LoopStartEvent
  | LoopIterationEvent
  | LoopEndEvent
  | FunctionDefineEvent
  | FunctionCallEvent
  | FunctionEnterEvent
  | ParameterBindEvent
  | FunctionReturnEvent
  | FramePopEvent
  | GeneratorCreateEvent
  | GeneratorYieldEvent
  | GeneratorResumeEvent
  | ModuleImportEvent
  | FileOpenEvent
  | FileWriteEvent
  | FileReadEvent
  | FileCloseEvent
  | ClassDefineEvent
  | InstanceCreateEvent
  | AttrReadEvent
  | AttrWriteEvent
  | HeapAllocEvent
  | ItemReadEvent
  | ItemWriteEvent
  | ItemAppendEvent
  | ItemRemoveEvent
  | IteratorMoveEvent
  | OutputAppendEvent
  | ErrorThrowEvent
  | ErrorPropagateEvent
  | ErrorCatchEvent
  | TaskCreateEvent
  | PromiseStateEvent
  | AwaitSuspendEvent
  | AwaitResumeEvent
  | TaskCompleteEvent;

export type TraceEventType = TraceEvent["type"];

// ─────────────────────────────────────────────────────────────
// 트레이스 문서
// ─────────────────────────────────────────────────────────────

export interface TraceSource {
  path: string;
  language: Language;
  lines: string[];
}

export interface TraceDocument {
  version: 1;
  /** 레슨 id. 예: "p11-nested-loops" */
  lessonId: string;
  source: TraceSource;
  /** 초기 힙. 레슨이 미리 넣어 두는 가상 입력 데이터 */
  /** main 외의 파일들. §P20의 imported module 소스가 여기 들어온다. */
  sources?: TraceSource[];
  initialHeap?: Record<HeapId, HeapObject>;
  /** 실행 전 디스크에 있던 파일들 (§P18 §9의 "Before") */
  initialFiles?: Record<string, string>;
  events: TraceEvent[];
  meta: {
    generator: string;
    /** §3.10 이벤트 상한에 걸려 잘렸는지 */
    truncated: boolean;
    /**
     * 계측 실행이 낸 stdout. 계측 없이 그대로 실행한 결과와 같아야 한다.
     * 빌드에서 이 둘을 비교해 "계측이 의미를 바꾸지 않는다"를 검사한다.
     */
    stdout?: string;
    createdAt?: string;
  };
}
