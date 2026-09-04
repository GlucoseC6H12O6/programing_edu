# Python 응용·종합 원고 — P18~P24

## P18. 파일 읽기와 쓰기

### 이번 레슨이 끝나면

텍스트 파일을 읽기·쓰기·추가 모드로 열고 `with`를 사용해 안전하게 닫을 수 있다. 읽은 줄에 포함된 줄바꿈 문자도 정리할 수 있다.

### 왜 배우나요?

프로그램이 끝난 뒤에도 데이터를 남기거나 외부에서 만든 데이터를 읽으려면 파일이 필요하다. 파일은 디스크에 있고, Python은 먼저 파일과 연결되는 통로인 **파일 객체**를 열어야 내용을 주고받을 수 있다.

### 파일 열기

```python
with open("wafers.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()
```

- `"wafers.txt"`: 열 파일의 경로다.
- `"r"`: 읽기 모드다.
- `encoding="utf-8"`: 글자를 바이트로 바꾸는 규칙을 지정한다.
- `as file`: 열린 파일 객체를 블록 안에서 `file`이라는 이름으로 사용한다.
- `with` 블록이 끝나면 오류가 발생했더라도 파일을 닫는다.

### 모드 선택

| 모드 | 의미 | 기존 파일이 있을 때 |
|---|---|---|
| `r` | 읽기 | 내용을 보존한다. 파일이 없으면 오류다. |
| `w` | 쓰기 | 기존 내용을 지우고 처음부터 쓴다. |
| `a` | 추가 | 기존 내용 끝에 이어 쓴다. |

`w`는 되돌릴 수 없이 기존 내용을 덮어쓸 수 있으므로, 로그 추가 목적이라면 `a`가 맞는지 먼저 확인한다.

### 줄바꿈 문자

파일에 다음 내용이 있다고 하자.

```text
W01
W02
```

`readlines()` 결과는 보통 `['W01\n', 'W02\n']`처럼 줄 끝의 `\n`을 포함한다. `line.strip()`은 앞뒤 공백과 줄바꿈을 제거한 새 문자열을 반환한다.

### 먼저 예상해 보기

기존 `summary.txt` 내용이 `count=2\n`일 때 `w` 모드와 `a` 모드로 `count=3\n`을 한 번 쓴 최종 파일을 각각 적는다.

### 한 단계씩 따라가기

1. `wafers.txt`를 읽기 모드로 연다.
2. 모든 줄을 문자열 List로 읽는다.
3. 읽기 블록이 끝나 파일을 닫는다.
4. 각 줄의 줄바꿈을 제거해 `cleaned`에 모은다.
5. `summary.txt`를 쓰기 모드로 연다. 기존 내용은 지워진다.
6. 정리된 항목 수를 한 줄 쓴다.
7. 쓰기 블록이 끝나 파일을 닫는다.

### 자주 하는 실수

- 로그를 `w`로 열어 기존 기록을 잃는다.
- `readlines()` 결과에서 `\n`을 보지 못해 문자열 비교가 실패한다.
- `with` 밖에서 이미 닫힌 `file`을 읽거나 쓴다.
- 운영체제마다 달라질 수 있는 기본 인코딩에 의존한다.

### 직접 해보기

세 Wafer ID를 `wafers.txt`에 한 줄씩 쓰고 다시 읽어 공백 없는 List로 만든다. 두 번째 실행에서는 `a`로 `W04`를 추가한 뒤 결과를 확인한다.

### 확인 문제

1. 기존 내용을 유지하면서 끝에 추가하는 모드는 무엇인가?
2. `with`를 사용하는 가장 중요한 이유는 무엇인가?
3. 읽은 줄의 끝에 남은 `\n`을 제거하려면 어떤 문자열 메서드를 사용할 수 있는가?

<details>
<summary>정답과 해설</summary>

1. `a` 모드다.
2. 블록이 끝날 때 파일을 확실히 닫아 자원을 정리하기 위해서다.
3. `strip()`을 사용할 수 있다. 줄 끝만 다루고 다른 공백을 보존해야 한다면 `rstrip("\n")`도 고려한다.
4. 예상 문제: `w`는 `count=3\n`만 남고, `a`는 `count=2\ncount=3\n`이 된다.

</details>

### 다음 레슨

파일에는 숫자가 아닌 값이나 잘못된 형식이 들어올 수 있다. P19에서는 이런 실패를 예외로 다룬다.

---

## P19. 예외 처리

### 이번 레슨이 끝나면

예외가 발생한 뒤 실행 흐름이 어떻게 바뀌는지 추적할 수 있다. `try`, `except`, `else`, `finally`, `raise`를 각각 필요한 위치에 사용할 수 있다.

### 왜 배우나요?

`float("N/A")`처럼 실행 전에 완전히 막기 어려운 실패가 있다. 예외 처리는 오류를 숨기는 기술이 아니라, 예상 가능한 실패를 발견하고 안전한 다음 행동을 선택하는 기술이다.

### 네 블록의 역할

```python
def to_float(raw):
    try:
        value = float(raw)
    except ValueError:
        return None
    else:
        return value
    finally:
        print("검사:", raw)
```

| 블록 | 실행 조건 |
|---|---|
| `try` | 먼저 실행할, 실패할 수 있는 코드 |
| `except ValueError` | `try`에서 해당 타입의 예외가 발생했을 때 |
| `else` | `try`가 예외 없이 끝났을 때 |
| `finally` | 정상·오류·return 여부와 관계없이 마지막에 |

`to_float("94.2")`는 94.2를 반환하고, `to_float("N/A")`는 `None`을 반환한다. 두 호출 모두 `finally`의 검사 메시지를 출력한다.

### 예외의 이동

예외가 발생하면 그 줄 아래의 정상 코드는 실행하지 않는다. 현재 함수 안에서 맞는 `except`를 찾고, 없으면 호출한 함수의 위치로 거슬러 올라간다. 끝까지 처리할 곳이 없으면 프로그램이 오류로 종료된다.

### 직접 예외 발생시키기

```python
def check_range(value):
    if value > 200.0:
        raise ValueError("허용 범위를 벗어났습니다")
    return value
```

`raise`는 잘못된 입력을 발견한 함수가 명확한 타입과 메시지로 실패를 알리는 방법이다. `raise` 아래의 코드는 실행되지 않는다.

### 먼저 예상해 보기

`to_float("94.2")`, `to_float("N/A")`의 반환값과 출력 순서를 각각 적는다. `return`을 만나도 `finally`가 실행되는지 생각한다.

### 자주 하는 실수

```python
try:
    # 너무 많은 코드
except Exception:
    pass
```

이 코드는 프로그래밍 실수까지 조용히 숨길 수 있다. 실패할 수 있는 줄만 좁게 `try`에 넣고, 처리 방법을 알고 있는 구체적인 예외 타입만 잡는다.

`except`는 실패한 줄로 돌아가 다시 실행하지 않는다. 처리 블록을 실행한 뒤 전체 try 문 다음으로 간다.

### 직접 해보기

문자열을 정수로 바꾸는 `to_int`를 작성한다. 숫자가 아니면 `None`, 정상이라면 정수를 반환하고, 두 경우 모두 원본 입력을 출력한다. 빈 문자열과 `"12"`를 시험한다.

### 확인 문제

1. 정상 경로에서만 실행되는 블록은 무엇인가?
2. 어떤 경우에도 마지막에 실행되는 블록은 무엇인가?
3. `raise` 뒤의 같은 함수 코드는 계속 실행되는가?

<details>
<summary>정답과 해설</summary>

1. `else`다.
2. `finally`다.
3. 실행되지 않는다. 예외 처리 흐름으로 이동한다.
4. 예상 문제: 첫 호출은 `검사: 94.2`를 출력하고 94.2를 반환한다. 둘째는 `검사: N/A`를 출력하고 `None`을 반환한다.

</details>

### 다음 레슨

검증과 변환 함수가 늘어나면 파일별로 역할을 나눠야 한다. P20에서 Module과 Import를 배운다.

---

## P20. Module과 Import

### 이번 레슨이 끝나면

Python 파일을 모듈로 이해하고 다른 파일의 함수·상수를 가져올 수 있다. `import module`과 `from module import name`의 호출 차이도 구분할 수 있다.

### 왜 배우나요?

모든 코드를 한 파일에 넣으면 원하는 함수를 찾기 어렵고 재사용하기도 힘들다. 관련 기능을 별도 파일로 나누면 파일 이름 자체가 역할을 설명한다.

### 파일 두 개 연결하기

`validators.py`:

```python
LOWER = 90.0
UPPER = 100.0

def is_valid(value):
    return LOWER <= value <= UPPER
```

`main.py`:

```python
from validators import is_valid, UPPER

print(is_valid(94.2))
print(UPPER)
```

모듈은 기본적으로 `.py` 파일 하나다. `from validators import is_valid`는 `validators.py`의 이름을 현재 파일에 직접 연결한다.

### 두 import 방식

```python
import validators
print(validators.is_valid(94.2))
```

이 방식은 이름 앞에 모듈을 붙여 출처가 분명하다.

```python
from validators import is_valid
print(is_valid(94.2))
```

이 방식은 선택한 이름을 현재 Scope에 직접 가져와 짧게 쓸 수 있다. 어떤 방식을 사용하든 호출 표현이 import 문과 맞아야 한다.

### import 때 일어나는 일

처음 import하면 Python은 모듈 파일의 최상위 코드를 실행해 함수와 변수를 만든다. 같은 실행 과정에서 다시 import할 때는 보통 이미 불러온 모듈을 재사용한다. 함수 본문은 호출할 때 실행되지만 모듈 최상위의 `print()` 같은 코드는 import 시 실행될 수 있다.

### 표준 라이브러리와 외부 패키지

```python
import statistics
print(statistics.mean([94.2, 96.0, 101.3]))
```

`statistics`는 Python과 함께 제공되는 표준 라이브러리다. 외부 패키지는 별도 설치가 필요할 수 있다. `pip install`은 파일을 환경에 설치하고, `import`는 이미 사용할 수 있는 모듈을 현재 프로그램에 연결한다.

### 먼저 예상해 보기

`import validators`만 사용했을 때 `is_valid(94.2)`와 `validators.is_valid(94.2)` 중 어느 호출이 가능한가?

### 자주 하는 실수

- 파일 이름과 가져올 함수 이름을 섞는다.
- `import validators` 뒤 모듈 이름 없이 함수를 직접 부른다.
- 사용자 파일 이름을 `statistics.py`처럼 표준 모듈과 같게 지어 엉뚱한 파일을 불러온다.
- 두 모듈이 서로를 import하는 순환 의존성을 만든다.

### 직접 해보기

평균 계산 함수는 `summaries.py`, 범위 검사 함수는 `validators.py`로 나누고 `main.py`에서 둘을 사용한다. 각 호출만 보아도 함수의 출처가 드러나도록 import 방식을 선택한다.

### 확인 문제

1. Python 모듈의 가장 단순한 형태는 무엇인가?
2. `import math` 뒤 제곱근 함수는 `sqrt(4)`와 `math.sqrt(4)` 중 어떻게 호출하는가?
3. `pip install`과 `import`는 같은 일인가?

<details>
<summary>정답과 해설</summary>

1. Python 코드가 들어 있는 `.py` 파일 하나다.
2. `math.sqrt(4)`로 호출한다.
3. 아니다. `pip`는 패키지를 설치하고 `import`는 사용할 수 있는 모듈을 프로그램에 연결한다.
4. 예상 문제의 정답은 `validators.is_valid(94.2)`다.

</details>

### 다음 레슨

파일별로 함수를 묶는 방법을 배웠다. P21에서는 관련 데이터와 동작을 객체 하나에 묶는 Class를 배운다.

---

## P21. Class와 객체 기초

### 이번 레슨이 끝나면

Class와 인스턴스를 구분하고 생성자, 속성, 메서드, `self`의 역할을 설명할 수 있다. 같은 Class에서 서로 독립된 객체 여러 개를 만들 수 있다.

### 왜 배우나요?

Wafer마다 ID와 measurement가 있고 동일한 판정 기능을 사용한다고 하자. Dictionary와 함수로도 표현할 수 있지만, 데이터와 그 데이터에 밀접한 동작을 하나의 설계로 묶고 싶을 때 Class를 사용할 수 있다.

### Class는 설계, 인스턴스는 실제 객체

```python
class Wafer:
    def __init__(self, wafer_id, measurement):
        self.wafer_id = wafer_id
        self.measurement = measurement

    def is_in_range(self, lower, upper):
        return lower <= self.measurement <= upper
```

`Wafer` Class는 어떤 속성과 메서드를 가질지 정의한다. 아직 특정 Wafer 객체는 없다.

```python
first = Wafer("W01", 94.2)
second = Wafer("W02", 101.3)
```

호출할 때마다 서로 다른 인스턴스가 생긴다. `__init__`은 새 인스턴스에 초기 속성을 붙인다.

### self 이해하기

```python
first.is_in_range(90.0, 100.0)
```

점 왼쪽의 `first`가 메서드의 첫 매개변수 `self`에 자동으로 연결된다. 직접 `first`를 한 번 더 넘기지 않는다. 따라서 메서드는 `self.measurement`로 지금 호출한 객체의 값을 읽는다.

### 인스턴스는 독립적이다

```python
second.measurement = 99.0
```

`second`만 99.0으로 바뀌고 `first.measurement`는 계속 94.2다. 같은 Class로 만들었다는 것은 구조와 메서드를 공유한다는 뜻이지 속성값까지 한 상자에 공유한다는 뜻은 아니다.

### 먼저 예상해 보기

위 수정 뒤 `first.is_in_range(90, 100)`과 `second.is_in_range(90, 100)`의 결과를 각각 적는다.

### 자주 하는 실수

- Class 이름과 생성된 인스턴스를 같은 것으로 생각한다.
- `first.is_in_range(first, 90, 100)`처럼 `self`를 직접 전달한다.
- `measurement = measurement`라고 써 지역 이름만 다루고, `self.measurement` 속성을 만들지 않는다.
- 단순 Dictionary면 충분한 데이터까지 모두 Class로 만든다. Class는 관련 동작과 상태를 함께 관리할 가치가 있을 때 선택한다.

### 직접 해보기

`Equipment` Class를 만들고 `equipment_id`, `status` 속성과 `start()` 메서드를 추가한다. 인스턴스 두 개 중 하나만 시작했을 때 상태가 독립적인지 확인한다.

### 확인 문제

1. Class와 인스턴스의 차이는 무엇인가?
2. `wafer.check()` 호출에서 `self`에는 무엇이 들어가는가?
3. `__init__`의 주된 역할은 무엇인가?

<details>
<summary>정답과 해설</summary>

1. Class는 객체의 구조와 동작을 정의하고, 인스턴스는 그 정의로 실제 생성된 개별 객체다.
2. 점 왼쪽의 `wafer` 인스턴스가 자동으로 들어간다.
3. 새 인스턴스의 초기 속성을 설정한다.
4. 예상 문제는 둘 다 `True`다. 값은 각각 94.2와 수정된 99.0이다.

</details>

### 다음 레슨

객체와 컬렉션을 만들 수 있게 되었다. P22에서는 CSV와 JSON 텍스트를 이런 Python 값으로 변환한다.

---

## P22. CSV와 JSON 데이터

### 이번 레슨이 끝나면

CSV의 행·열과 JSON 텍스트를 Python의 Dictionary·List로 연결할 수 있다. 문자열로 읽은 숫자를 변환하고 `load/loads`, `dump/dumps`의 차이를 구분할 수 있다.

### 왜 배우나요?

데이터는 프로그램 안의 List 형태로만 오지 않는다. 표 형식은 CSV, 중첩된 메시지는 JSON으로 주고받는 경우가 많다. 두 형식 모두 파일이나 네트워크에서 올 때는 우선 **텍스트**다.

### CSV: 모든 칸은 먼저 문자열이다

```text
wafer,measurement
W01,94.2
W02,101.3
```

`csv.DictReader`로 읽으면 한 행은 대략 다음처럼 된다.

```python
{"wafer": "W01", "measurement": "94.2"}
```

CSV에 숫자처럼 적혀 있어도 값은 문자열 `"94.2"`다. 계산하려면 `float(row["measurement"])`로 명시적으로 변환한다.

### JSON: 텍스트와 Python 값 구분하기

```python
import json

raw = '{"lot": "LOT-A01", "count": 3, "note": null}'
payload = json.loads(raw)
```

`raw`는 문자열 하나이고 `payload`는 키로 접근할 수 있는 Dictionary다. JSON의 `null`, `true`, `false`는 파싱 뒤 Python의 `None`, `True`, `False`가 된다.

| 함수 | 입력 | 결과 |
|---|---|---|
| `json.load(file)` | 열린 파일 객체 | Python 값 |
| `json.loads(text)` | JSON 문자열 | Python 값 |
| `json.dump(value, file)` | Python 값과 파일 | 파일에 JSON 기록 |
| `json.dumps(value)` | Python 값 | JSON 문자열 |

끝의 `s`는 문자열(string)을 다룬다고 기억할 수 있다.

### 먼저 예상해 보기

`json.loads('{"value": null, "ok": true}')`의 결과 타입과 두 값의 Python 표현을 적는다.

### 자주 하는 실수

- JSON 문자열에 `raw["lot"]`처럼 바로 접근한다. 먼저 `json.loads(raw)`가 필요하다.
- CSV 숫자 문자열에 1을 더한다. 먼저 `float()` 또는 `int()`로 변환한다.
- Python Dictionary를 JSON이라고 부른다. 모양이 비슷해도 메모리의 Python 값과 전송용 텍스트는 다르다.
- `loads`에 파일 객체를, `load`에 문자열을 넘긴다.

### 직접 해보기

두 CSV 행을 Dictionary List로 바꾸고 measurement를 `float`로 변환한다. `"N/A"` 행 하나를 추가했을 때 P19의 예외 처리로 안전하게 제외한다. 결과 List 하나를 `json.dumps()`로 문자열화한다.

### 확인 문제

1. CSV에서 읽은 `94.2` 칸의 최초 타입은 보통 무엇인가?
2. JSON 문자열을 Python 값으로 바꾸는 함수는 무엇인가?
3. JSON `null`은 Python에서 무엇이 되는가?

<details>
<summary>정답과 해설</summary>

1. `str`이다.
2. 문자열이면 `json.loads`, 파일이면 `json.load`다.
3. `None`이 된다.
4. 예상 결과는 Dictionary이고 값은 `None`, `True`다.

</details>

### 다음 레슨

데이터 변환 흐름을 만들 수 있게 되었다. P23에서는 필요할 때만 값을 만들거나 결과가 정해지는 순간 멈추는 도구를 배운다.

---

## P23. 함수형 도구와 Generator 맛보기

### 이번 레슨이 끝나면

`map`, `filter`, `any`, `all`을 반복 처리로 읽을 수 있다. Generator가 값을 미리 모두 만들지 않고 요청할 때 하나씩 제공한다는 것을 설명할 수 있다.

### 왜 배우나요?

모든 데이터를 끝까지 검사하거나 중간 List를 모두 만들 필요가 없는 경우가 있다. 상한 초과값이 하나라도 있는지만 묻는다면 첫 초과값을 찾은 순간 답이 정해진다.

### map과 filter

```python
values = [94.2, 101.3, 96.0]
doubled = list(map(lambda v: v * 2, values))
in_range = list(filter(lambda v: v <= 100.0, values))
```

- `map`은 각 원소를 함수로 변환한다.
- `filter`는 함수 결과가 참인 원소만 통과시킨다.
- Python 3의 `map`과 `filter`는 결과 List를 즉시 만들지 않는다. 값을 필요로 하는 통로를 돌려주므로 화면에서 List로 보려면 `list()`로 소비한다.

### any와 all의 단축 평가

```python
has_high = any(value > 100.0 for value in values)
all_positive = all(value > 0 for value in values)
```

`any`는 참을 처음 만나면 `True`로 끝난다. `all`은 거짓을 처음 만나면 `False`로 끝난다. 이미 답이 정해졌으므로 뒤 원소는 검사하지 않는다.

빈 컬렉션에서는 `any([])`가 `False`, `all([])`가 `True`다. `all`은 반례가 하나도 없다고 이해할 수 있다.

### Generator와 yield

```python
def valid_values(rows):
    for row in rows:
        if row["measurement"] is not None:
            yield row["measurement"]
```

`yield`가 있는 함수를 호출하면 본문을 즉시 끝까지 실행하지 않고 Generator 객체를 만든다.

```python
stream = valid_values(rows)
first = next(stream)
second = next(stream)
```

첫 `next`에서 첫 `yield`까지 실행해 값을 주고 멈춘다. 다음 `next`는 처음부터가 아니라 멈춘 위치 다음에서 이어진다. 끝까지 소비한 Generator는 같은 값을 다시 주지 않는다.

### 먼저 예상해 보기

값 `[94.2, 101.3, 96.0]`에 대해 `any(value > 100 for value in values)`는 몇 번째 값에서 멈추는가? Generator 예제에서 두 번의 `next` 결과도 적는다.

### 자주 하는 실수

- `map` 결과가 이미 List라고 생각한다.
- Generator를 한 번 출력한 뒤 다시 순회하면 처음부터 반복될 것으로 기대한다.
- `any`와 `all`이 언제나 모든 원소를 검사한다고 생각한다.
- 짧은 List에도 무조건 함수형 도구를 써서 오히려 읽기 어렵게 만든다.

### 직접 해보기

measurement 행에서 `None`이 아닌 값만 `yield`하는 Generator를 만들고 `next()`를 한 번씩 눌러 프레임이 어디서 멈추고 재개되는지 기록한다. 모두 소비한 뒤 한 번 더 `next()`했을 때의 `StopIteration`도 확인한다.

### 확인 문제

1. Python 3의 `map` 결과를 List로 보려면 무엇으로 감싸는가?
2. `any`는 언제 검사를 멈추는가?
3. Generator가 두 번째 `next()`에서 처음부터 실행되지 않는 이유는 무엇인가?

<details>
<summary>정답과 해설</summary>

1. `list()`로 감싼다.
2. 참인 원소를 처음 만나는 순간 멈춘다. 끝까지 없으면 `False`다.
3. Generator가 실행 위치와 지역 상태를 보존하고 `yield` 다음 줄부터 재개하기 때문이다.
4. 예상 문제는 두 번째 값 101.3에서 멈춘다. 예제 Generator의 결과는 94.2, 96.0이다.

</details>

### 다음 레슨

이제 개별 도구를 익혔다. P24에서는 불완전한 입력을 변환·검증·집계하는 하나의 프로그램으로 결합한다.

---

## P24. 가상 Measurement 요약기

### 이번 레슨이 끝나면

숫자 문자열, 누락값, 잘못된 값이 섞인 입력을 작은 함수들로 처리해 유효 개수·PASS 개수·평균을 만들 수 있다. 각 결과가 어떤 입력에서 왔는지 역으로 설명할 수 있다.

### 문제 정의

다음 입력을 처리한다고 하자.

```python
rows = [
    {"measurement": "94.2"},
    {"measurement": "N/A"},
    {"measurement": 101.3},
]
```

요구사항은 다음과 같다.

1. 숫자로 바꿀 수 없는 값은 유효값에서 제외한다.
2. 90.0 이상 100.0 이하인 값만 PASS로 센다.
3. 평균은 모든 유효값으로 계산한다.
4. 유효값이 없으면 평균은 `None`이다.

### 일을 작은 단계로 나누기

```text
입력 행
  ↓ measurement 꺼내기
숫자 변환
  ↓ 실패하면 제외
유효값 저장
  ↓ 범위 검사
PASS 저장
  ↓ 반복 종료
개수와 평균 계산
```

변환, 검증, 판정, 집계를 분리하면 어느 행이 왜 제외됐는지 추적할 수 있다.

### 변환 함수

```python
def parse_value(raw):
    try:
        return float(raw)
    except (TypeError, ValueError):
        return None
```

이 함수의 책임은 “입력을 숫자 또는 `None`으로 통일한다” 하나뿐이다. PASS 여부나 평균은 판단하지 않는다.

### 요약 함수

```python
def summarize(rows, lower=90.0, upper=100.0):
    valid = []
    passed = []

    for row in rows:
        value = parse_value(row.get("measurement"))
        if value is None:
            continue

        valid.append(value)
        if lower <= value <= upper:
            passed.append(value)

    average = sum(valid) / len(valid) if valid else None
    return {
        "valid": len(valid),
        "passed": len(passed),
        "average": average,
    }
```

### 레코드별 실행 추적

| 행 | 원본 | 변환 | 유효 목록에 추가 | PASS 목록에 추가 | 이유 |
|---:|---|---:|---|---|---|
| 1 | `"94.2"` | 94.2 | 예 | 예 | 숫자이며 범위 안 |
| 2 | `"N/A"` | `None` | 아니오 | 아니오 | 숫자 변환 실패 |
| 3 | `101.3` | 101.3 | 예 | 아니오 | 유효 숫자지만 상한 초과 |

최종 유효값은 `[94.2, 101.3]`, PASS 값은 `[94.2]`다. 평균은 `(94.2 + 101.3) / 2 = 97.75`다.

### 빈 입력 방어

`valid`가 비었을 때 `sum(valid) / len(valid)`를 실행하면 0으로 나누어 `ZeroDivisionError`가 발생한다. `if valid`는 List에 원소가 있을 때만 참이므로 조건식으로 평균 계산을 막는다.

### 먼저 예상해 보기

다음 입력의 결과를 계산한다.

```python
[
    {"measurement": 90.0},
    {"measurement": 100.0},
    {"measurement": None},
]
```

경계값 두 개가 PASS에 포함되는지와 평균을 적는다.

### 자주 하는 실수

- `float(row["measurement"])`를 try 없이 바로 호출해 한 행의 오류로 전체 처리를 중단한다.
- 원본 행 개수를 유효 개수로 사용한다.
- `passed` 값만으로 평균을 계산해 요구사항과 다른 통계를 만든다.
- 빈 List 평균을 방어하지 않는다.
- 모든 처리를 하나의 긴 반복문에 넣어 테스트할 단위를 없앤다.

### 직접 해보기

결과에 `invalid` 개수와 `review_rows`를 추가한다. `review_rows`에는 변환할 수 없거나 범위 밖인 행의 인덱스를 넣는다. 빈 입력, 모두 잘못된 입력, 경계값 입력을 각각 시험한다.

### 확인 문제

1. `parse_value`가 PASS 여부까지 판단하지 않는 이유는 무엇인가?
2. 101.3은 유효 개수와 PASS 개수 중 어디에 포함되는가?
3. 빈 입력 평균을 `None`으로 만드는 조건을 설명해 보자.

<details>
<summary>정답과 해설</summary>

1. 함수 하나가 한 책임만 가지면 변환과 판정을 따로 테스트하고 재사용할 수 있기 때문이다.
2. 숫자로 변환 가능하므로 유효 개수에는 포함되지만 상한보다 커서 PASS 개수에는 포함되지 않는다.
3. 유효값 List가 비었으면 나누기를 실행하지 않고 `None`을 선택한다.
4. 예상 문제 결과는 `valid=2`, `passed=2`, `average=95.0`이다. 90.0과 100.0은 `<=` 때문에 모두 포함된다.

</details>

### 과정 마무리

이 프로그램에는 변수, 타입, 비교, 조건, 반복, List, Dictionary, 함수, Scope, 예외, 집계가 모두 들어 있다. 완성 코드를 외우는 대신 각 줄이 파이프라인의 어느 단계에 속하는지 설명할 수 있다면 Python 기초 과정의 목표를 달성한 것이다.
