# Programming Fundamentals 교육 사이트 기획서

> Python · JavaScript 기초~응용 문법과 코드 실행 시각화 중심의 교육 사이트

## 0. 문서 정보

| 항목 | 내용 |
|---|---|
| 문서 목적 | 교육 범위, 레슨 구성, 실행 시각화, 인터랙션 및 예제 방향을 한 문서에서 정의한다. |
| 주요 학습자 | 프로그래밍 경험이 적거나 없는 제조·반도체 엔지니어 및 일반 입문자 |
| 교육 범위 | Python과 JavaScript의 기초~응용 문법 |
| 범위 밖 | 웹 프레임워크, DOM 중심 웹 개발, 데이터베이스, 서버, 클라우드, 배포, 머신러닝, 특정 사내 시스템 연동 |
| 예제 데이터 | Lot, Wafer, Equipment, measurement를 소재로 한 완전한 가상 데이터 |
| 핵심 원칙 | 설명을 읽는 교육보다 코드의 실행 순서와 값의 변화를 눈으로 확인하는 교육 |

---

## 1. 제품 목표와 교육 원칙

### 1.1 제품 목표

이 사이트는 문법 사전이 아니라 **코드가 실행되는 과정을 관찰하고 조작하는 학습 도구**를 지향한다. 학습자는 다음 질문에 스스로 답할 수 있어야 한다.

- 지금 어느 줄을 실행하고 있는가?
- 해당 줄을 실행하기 전과 후에 어떤 값이 바뀌는가?
- 반복문의 현재 회차에서 변수에는 어떤 값이 들어가는가?
- 함수 호출 시 인수가 매개변수로 어떻게 전달되는가?
- 함수가 종료될 때 어떤 스코프가 사라지고 어떤 값이 돌아오는가?
- 조건이 참 또는 거짓이 되어 어느 경로를 선택했는가?
- Python과 JavaScript에서 같은 사고를 어떤 문법으로 표현하는가?

### 1.2 교육 원칙

1. **한 화면, 한 개념**: 새 문법과 새 업무 개념을 동시에 과도하게 도입하지 않는다.
2. **예측 후 실행**: 학습자가 다음 줄의 결과를 먼저 예측한 뒤 실행해 본다.
3. **값의 출처 표시**: 값이 어디에서 왔고 어디로 이동했는지 화살표와 색상으로 표시한다.
4. **변경 전후 비교**: 할당, 누적, 배열 변경은 실행 전·후 값을 나란히 보여준다.
5. **구체에서 추상으로**: 숫자·문자 같은 단순 예제 후 Lot/Wafer 문맥에 적용한다.
6. **Python 우선, JavaScript 연결**: Python에서 배운 개념을 JavaScript 문법과 대조해 재사용한다.
7. **오류도 학습 콘텐츠**: 에러 발생 줄, 원인, 관련 상태, 수정 힌트를 함께 보여준다.
8. **가상 데이터 사용**: 모든 제조 예제는 일반화된 샘플이며 사내 명칭·수치·규칙을 사용하지 않는다.

### 1.3 레슨 공통 진행 구조

각 레슨은 10~20분을 기준으로 아래 흐름을 따른다.

1. **개념 한 줄**: 이번 문법이 해결하는 문제를 설명한다.
2. **실행 전 예측**: 값 또는 실행 경로를 선택한다.
3. **단계 실행**: `Step`으로 코드와 상태 변화를 관찰한다.
4. **직접 수정**: 변수, 조건, 입력 데이터를 바꾸고 다시 실행한다.
5. **오류 실험**: 대표 실수를 의도적으로 실행하고 원인을 찾는다.
6. **업무형 적용**: 가상 Lot/Wafer/Equipment/measurement 예제를 해결한다.
7. **Python↔JavaScript 연결**: 같은 개념의 상대 언어 표현을 비교한다.
8. **짧은 확인 문제**: 출력, 최종 상태 또는 실행 횟수를 답한다.

---

## 2. 전체 교육 범위

### 2.1 Python 트랙

| 단계 | 레슨 | 핵심 결과 |
|---|---|---|
| 기초 | P01~P07 | 값, 타입, 연산, 문자열, 컬렉션을 읽고 조작한다. |
| 흐름 제어 | P08~P11 | 조건과 반복의 실행 경로를 추적한다. |
| 함수와 데이터 처리 | P12~P17 | 함수, 스코프, 컴프리헨션, 정렬, 순회 도구를 사용한다. |
| 응용 문법 | P18~P23 | 파일, 예외, 모듈, 클래스, CSV/JSON을 다룬다. |
| 종합 실습 | P24 | 여러 문법을 결합해 measurement 요약을 만든다. |

### 2.2 JavaScript 트랙

| 단계 | 레슨 | 핵심 결과 |
|---|---|---|
| 기초 | J01~J06 | 값, 타입, 연산, 문자열, Array, Object를 다룬다. |
| 흐름 제어 | J07~J08 | 조건과 반복의 실행 경로를 추적한다. |
| 함수와 데이터 처리 | J09~J16 | 함수, 스코프, 배열 메서드, 구조 분해, 전개 문법을 사용한다. |
| 응용 문법 | J17~J22 | JSON, 예외, 모듈, 클래스, Promise, async/await를 이해한다. |
| 종합 실습 | J23 | 비동기 로딩과 measurement 요약 흐름을 결합한다. |

### 2.3 권장 이수 순서

```text
Python P01~P13
    ↓
비교 체크포인트 A: 값 · 조건 · 반복 · 함수
    ↓
Python P14~P24
    ↓
JavaScript J01~J10
    ↓
비교 체크포인트 B: 컬렉션 · 함수 · 스코프
    ↓
JavaScript J11~J23
    ↓
비교 체크포인트 C: 데이터 변환 · 오류 · 모듈
```

---

## 3. 공통 실행 시각화 엔진

### 3.1 기본 화면 구성

데스크톱은 3열, 작은 화면은 탭 방식으로 구성한다.

```text
┌──────────────────────┬──────────────────────┬────────────────────────┐
│ CODE                 │ EXECUTION            │ STATE                  │
│ 현재 줄 하이라이트   │ 조건·반복·함수 흐름  │ 변수 / 메모리          │
│ 이전/다음 줄 표시    │ 값 이동 애니메이션   │ Call Stack / Scope     │
│ 중단점·줄 번호        │ 출력·타임라인        │ 컬렉션 상세 보기       │
├──────────────────────┴──────────────────────┴────────────────────────┤
│ ◀ Prev  ▶ Step  ▷ Auto  ❚❚ Pause  ↺ Reset  속도  타임라인  단계 8/31 │
└──────────────────────────────────────────────────────────────────────┘
```

| 영역 | 필수 기능 |
|---|---|
| Code panel | 편집기, 줄 번호, 현재 실행 줄, 직전 실행 줄, 오류 줄, 중단점, 읽기 전용/편집 모드 |
| Current line highlight | 실행 전은 노란색, 실행 완료는 연한 초록색, 오류는 빨간색으로 구분한다. 색만 쓰지 않고 아이콘과 테두리를 병행한다. |
| Variable/Memory panel | 변수명, 타입, 현재 값, 직전 값, 변경 여부, 생성·수정·삭제 상태를 표시한다. |
| Call Stack/Scope | 전역→호출 함수 순서, 활성 프레임, 매개변수, 지역 변수, 반환 대기 위치를 보여준다. |
| Execution flow | 조건 분기, 루프 회차, 함수 진입·복귀, 비동기 대기를 흐름도 또는 타임라인으로 표시한다. |
| Output panel | `print`/`console.log`, 반환값, 경고, 에러를 발생 순서와 코드 줄에 연결한다. |
| Controls | 이전, 다음, 자동 실행, 일시 정지, 초기화, 속도, 단계 타임라인, 중단점까지 실행을 제공한다. |

### 3.2 실행 단계의 기준

학습자에게 의미가 있는 변화를 한 단계로 정의한다. 내부 인터프리터 동작을 모두 노출하지 않는다.

- 변수 생성 또는 값 할당
- 표현식 평가 시작과 결과 확정
- 조건식 평가와 분기 선택
- 반복 변수 갱신과 반복 본문 진입
- 함수 호출, 프레임 생성, 매개변수 바인딩
- `return`, 함수 프레임 제거, 호출 위치 복귀
- 컬렉션 원소 추가·수정·삭제
- 출력 생성
- 예외 발생, 전달, 처리
- Promise 상태 변경 및 `await` 대기·재개

예를 들어 `result = mul(i, k)`는 교육 수준에 따라 다음처럼 확장한다.

```text
기본 모드: 함수 호출 → 반환값 할당
상세 모드: i 읽기 → k 읽기 → mul 프레임 생성 → a/b 바인딩
          → 곱셈 평가 → return → 프레임 제거 → result 할당
```

### 3.3 내부 실행 이벤트 모델

언어별 실행기를 공통 UI에 연결하려면 아래와 같은 언어 중립 이벤트로 변환한다.

```json
{
  "step": 12,
  "event": "FUNCTION_ENTER",
  "line": 6,
  "frameId": "mul#4",
  "parentFrameId": "global",
  "bindings": {
    "a": { "value": 2, "from": "global.i" },
    "b": { "value": 4, "from": "global.k" }
  },
  "message": "mul(i, k)를 호출하여 a=2, b=4가 되었습니다."
}
```

권장 이벤트 종류:

| 분류 | 이벤트 |
|---|---|
| 실행 | `LINE_ENTER`, `LINE_EXIT`, `PROGRAM_END` |
| 값 | `EXPRESSION_EVAL`, `VARIABLE_CREATE`, `VARIABLE_UPDATE`, `VARIABLE_DELETE` |
| 흐름 | `BRANCH_TEST`, `BRANCH_TAKEN`, `LOOP_START`, `LOOP_ITERATION`, `LOOP_END` |
| 함수 | `FUNCTION_CALL`, `FUNCTION_ENTER`, `PARAMETER_BIND`, `FUNCTION_RETURN`, `FRAME_POP` |
| 컬렉션 | `ITEM_READ`, `ITEM_WRITE`, `ITEM_APPEND`, `ITEM_REMOVE`, `ITERATOR_MOVE` |
| 입출력 | `OUTPUT_APPEND`, `INPUT_REQUEST`, `FILE_OPEN`, `FILE_READ`, `FILE_WRITE`, `FILE_CLOSE` |
| 오류 | `ERROR_THROW`, `ERROR_PROPAGATE`, `ERROR_CATCH` |
| 비동기 | `TASK_CREATE`, `PROMISE_STATE`, `AWAIT_SUSPEND`, `AWAIT_RESUME`, `TASK_COMPLETE` |

모든 이벤트는 최소한 `step`, `line`, `event`, `frameId`, `before`, `after`, `message`를 가질 수 있어야 한다. 이전 단계 이동은 이벤트를 역실행하기보다 스냅샷 또는 체크포인트+재실행 방식으로 구현한다.

### 3.4 변수와 메모리 표현 규칙

- 원시값은 변수 카드 안에 직접 표시한다: `threshold → 92.5`.
- List/Array/Object/Dictionary는 변수 카드에서 별도 객체 박스로 선을 연결한다.
- 두 변수가 같은 객체를 가리키면 선 두 개가 같은 객체 박스로 연결되도록 해 참조 공유를 보여준다.
- 변경된 값은 잠시 강조하고 `이전 → 현재`를 표시한다.
- 함수 인수 전달은 원본 변수에서 매개변수로 이동하는 애니메이션을 사용하되, 복사와 참조 공유를 구분한다.
- 범위를 벗어난 변수는 즉시 사라지게 하지 않고 흐려진 뒤 `스코프 종료로 제거됨` 메시지와 함께 접는다.
- 긴 컬렉션은 앞·뒤 일부만 보이고, 교육용 예제는 기본적으로 12개 이하의 원소를 사용한다.

### 3.5 Call Stack과 Scope 표현

```text
Call Stack
┌─ global ─────────────────────────┐
│ i = 2, k = 4, result = 6         │
│ 다음 복귀 위치: line 9           │
└──────────────────────────────────┘
                ↓ call mul(i, k)
┌─ mul#4 (active) ─────────────────┐
│ a = 2  ← global.i                │
│ b = 4  ← global.k                │
│ return a * b                     │
└──────────────────────────────────┘
```

- 스택의 아래는 오래된 호출, 위는 현재 활성 호출이다.
- 동일 함수의 반복 호출은 `mul#1`, `mul#2`처럼 실행 인스턴스를 구분한다.
- 현재 프레임만 선명하게, 대기 중인 프레임은 흐리게 표현한다.
- 반환 시 `8`이 함수 프레임에서 호출 표현식으로 이동한 뒤 프레임이 제거되는 순서를 보여준다.
- Python LEGB와 JavaScript lexical scope는 별도의 스코프 체인 보기로 제공한다.

### 3.6 조건과 반복 시각화

조건식은 한 번에 결과만 보여주지 않고 피연산자와 중간 결과를 펼칠 수 있어야 한다.

```text
measurement >= lower and measurement <= upper
     94.2 >= 90.0       and      94.2 <= 100.0
          True          and           True
                        ↓
                       True → PASS 경로
```

반복문은 현재 반복 변수를 강조한 트랙으로 표현한다.

```text
i: [0] 1 2 3 4 5 6 7 8
k: [0] 1 2 3 4 5 6 7 8
    ↑ 현재: outer #1 / inner #1
```

중첩 반복에서는 안쪽 루프가 끝날 때 `k 종료 → i 증가 → k 새로 시작`을 한 묶음의 전환 애니메이션으로 보여준다. 전체 81회 실행은 `처음 3회`, `회차 건너뛰기`, `마지막 회차`를 지원해 피로도를 낮춘다.

### 3.7 제어 장치

| 제어 | 동작 |
|---|---|
| `Prev` | 직전 의미 단위로 돌아간다. 입력이나 파일 상태도 교육용 가상 환경 안에서 함께 복구한다. |
| `Step` | 다음 의미 단위를 실행한다. 기본 단축키는 `→` 또는 `Space`로 제공한다. |
| `Auto` | 선택한 속도로 자동 실행한다. 중요한 이벤트에서 자동으로 잠시 멈출 수 있다. |
| `Pause` | 현재 이벤트가 완료된 직후 정지한다. |
| `Reset` | 코드와 입력 데이터를 레슨 기본값으로 되돌릴지, 실행 상태만 초기화할지 선택한다. |
| 속도 | 0.5×, 1×, 2×, 4×를 제공한다. 값 이동 애니메이션을 끌 수도 있다. |
| 타임라인 | 전체 단계, 중단점, 함수 호출, 오류, 출력 발생 지점으로 이동한다. |
| Run to breakpoint | 선택 줄 또는 이벤트까지 실행한다. 반복이 긴 예제에 필수다. |
| 상세도 | `핵심 단계`와 `표현식 상세`를 전환한다. |

### 3.8 학습 인터랙션 패턴

| 패턴 | 설명 | 사용 예 |
|---|---|---|
| 결과 예측 | 실행 전 2~4개 선택지에서 출력이나 값 선택 | 조건문, 연산자, 함수 반환 |
| 다음 줄 선택 | 다음에 실행될 코드 줄을 클릭 | 분기, 반복, 함수 |
| 값 끌어놓기 | 인수 값을 매개변수 카드에 배치 | 함수 호출 |
| 코드 빈칸 | 연산자, 변수명, 메서드를 채움 | 거의 모든 레슨 |
| 상태 수정 | 변수/입력 데이터를 직접 변경 후 재실행 | 조건 경계값, 반복 횟수 |
| 순서 배열 | 실행 이벤트 카드를 올바른 순서로 배치 | 중첩 반복, async/await |
| 오류 찾기 | 오류 줄과 이유를 각각 선택 | 타입, 인덱스, 스코프, 예외 |
| 트레이스 완성 | 변수 추적표의 빈 셀을 채움 | 반복, 누적, reduce |
| 표현 변환 | Python 코드를 같은 의미의 JavaScript로 변환 | 비교 체크포인트 |

### 3.9 특수 시각화 플러그인

공통 엔진 위에 개념별 보조 시각화를 붙인다.

- 문자열: 문자 인덱스 띠, 슬라이스 범위
- List/Array: 인덱스 셀, 추가·삭제·정렬 애니메이션
- Dictionary/Object: 키→값 카드와 조회 경로
- Set: 중복 제거 전·후 집합 다이어그램
- 조건문: 조건 평가 트리와 선택 경로
- 반복문: 반복 트랙, 현재 회차, 누적 결과
- 함수: 인수 전달, 프레임 생성, 반환값 이동
- 파일: 파일 커서, 읽은 줄, 열린/닫힌 상태
- 예외: 호출 스택을 거슬러 올라가는 오류 경로
- Promise: pending→fulfilled/rejected 상태 머신과 작업 타임라인
- async/await: 호출 스택, 대기 작업, 재개 시점을 나눈 간소화 타임라인

### 3.10 안전한 실행 환경

- 코드는 네트워크가 차단된 격리 환경에서 실행한다.
- 실행 시간, 메모리, 출력 길이, 반복 횟수에 제한을 둔다.
- 무한 반복 감지 시 중단하고 `while 조건이 계속 True인지 확인하세요`와 현재 변수를 보여준다.
- Python 파일 실습은 레슨별 가상 파일 시스템을 사용한다.
- JavaScript 비동기 실습은 실제 외부 API 대신 지연과 성공/실패를 재현하는 가상 데이터 로더를 사용한다.
- 패키지 설치는 실제 설치 대신 준비된 허용 목록과 가상 설명 흐름으로 제한한다.
- 예제에 회사명, 장비 모델명, 공정명, 실제 기준값 또는 식별자가 포함되지 않도록 콘텐츠 검수 규칙을 둔다.

### 3.11 접근성과 반응형 기준

- 색상 외에 아이콘, 선 종류, 텍스트 라벨로 상태를 중복 표현한다.
- 모든 실행 제어와 코드 선택은 키보드로 조작할 수 있어야 한다.
- 애니메이션 감소 설정을 지원하며, 이때 값 이동을 즉시 상태 변경으로 대체한다.
- 스크린 리더용으로 매 단계 `6번 줄 실행, 변수 result가 6에서 8로 변경됨`과 같은 요약을 제공한다.
- 작은 화면에서는 `Code → Flow → State → Output` 탭을 자동 전환하되 사용자가 고정할 수 있다.
- 숫자 표시는 소수점 자리와 단위를 명확히 하고, 색만으로 PASS/FAIL을 구분하지 않는다.

---

## 4. Python 교육 항목

### P01. 출력과 주석

**학습목표**

- `print()`로 값과 설명 문구를 출력하고 `#` 주석의 역할을 구분한다.
- 코드 실행 결과와 코드 자체를 구분한다.

**핵심 문법**

```python
# 가상 Lot 상태 확인
lot_id = "LOT-A01"
print("Lot:", lot_id)
```

**초보자가 자주 헷갈리는 부분**

- 문자열 따옴표를 빠뜨리거나 출력 결과에도 따옴표가 보일 것으로 생각한다.
- `print()`가 값을 저장하거나 반환한다고 오해한다.
- 주석도 실행되는 명령이라고 생각한다.

**시각화 방식**

- 현재 줄에서 `"Lot:"`과 `lot_id` 값이 Output panel로 복사되는 흐름을 보여준다.
- 주석 줄은 회색으로 표시하고 실행 커서가 건너뛰는 모습을 보여준다.
- `print()`의 반환값 `None`은 상세 모드에서만 표시한다.

**인터랙션 방식**

- 출력될 값을 먼저 선택한 후 `Step`으로 확인한다.
- 따옴표를 제거하거나 변수명을 바꾸어 오류를 비교한다.

**예제 아이디어**

- 가상 Equipment ID와 상태 출력
- 세 개 Wafer ID를 한 줄씩 출력
- 설명 문구와 measurement 값·단위를 함께 출력

### P02. 변수, 할당, 기본 타입

**학습목표**

- 변수에 값을 저장하고 다시 할당할 수 있다.
- `int`, `float`, `str`, `bool`, `None`의 차이를 설명한다.

**핵심 문법**

```python
wafer_count = 25
temperature = 23.5
equipment = "EQ-01"
is_running = True
last_error = None
```

**초보자가 자주 헷갈리는 부분**

- `=`를 수학적 같음으로만 이해한다.
- 변수명과 문자열 값을 구분하지 못한다.
- `"25"`와 `25`, `True`와 `"True"`를 같은 값으로 생각한다.

**시각화 방식**

- 할당문의 오른쪽을 먼저 평가하고 값 카드가 왼쪽 변수 슬롯에 들어가는 순서를 보여준다.
- 재할당 시 `이전 값 → 새 값`과 타입 변화를 표시한다.

**인터랙션 방식**

- 값 카드를 적절한 타입 영역에 끌어놓는다.
- 변수 값을 직접 바꾸고 `type()` 결과를 예측한다.

**예제 아이디어**

- Lot의 wafer 수, 장비명, 가동 여부 저장
- 누락된 measurement를 `None`으로 표현
- 숫자 문자열을 실제 숫자와 비교

### P03. 숫자와 산술 연산자

**학습목표**

- 사칙연산, 몫, 나머지, 거듭제곱을 사용할 수 있다.
- 연산 우선순위와 괄호의 효과를 이해한다.

**핵심 문법**

```python
total = 95 + 97 + 93
average = total / 3
full_groups = 25 // 4
remainder = 25 % 4
scaled = (average - 90) * 10
```

**초보자가 자주 헷갈리는 부분**

- `/`와 `//`의 결과 차이, `%`의 의미를 혼동한다.
- 왼쪽부터 무조건 계산한다고 생각한다.
- 부동소수점 결과가 항상 정확한 십진수라고 기대한다.

**시각화 방식**

- 표현식 트리에서 우선 계산되는 하위 식을 강조한다.
- `/`, `//`, `%`는 25개 Wafer를 4개씩 묶는 블록 그림으로 비교한다.

**인터랙션 방식**

- 괄호 위치를 바꾸고 계산 순서를 재생한다.
- 몫과 나머지로 그룹 수를 맞추는 퍼즐을 제공한다.

**예제 아이디어**

- 가상 measurement 평균 계산
- Wafer를 동일 크기 그룹으로 나누고 남는 수 계산
- 기준값 대비 편차와 백분율 계산

### P04. 문자열과 포매팅

**학습목표**

- 문자열 연결, 인덱싱, 슬라이싱, 주요 메서드와 f-string을 사용한다.
- 문자열이 문자들의 순서 있는 값임을 이해한다.

**핵심 문법**

```python
wafer_id = "WAFER-07"
prefix = wafer_id[:5]
number = wafer_id[-2:]
message = f"{wafer_id}: measurement={94.2:.1f}"
```

**초보자가 자주 헷갈리는 부분**

- 인덱스가 0부터 시작하고 끝 인덱스는 포함되지 않는다는 점을 놓친다.
- 문자열과 숫자를 `+`로 바로 연결하려 한다.
- 메서드가 원본 문자열을 직접 바꾼다고 생각한다.

**시각화 방식**

- 문자열을 인덱스가 붙은 셀로 펼치고 슬라이스에 포함되는 범위를 칠한다.
- f-string 자리표시자에 실제 값이 들어가 최종 문자열이 되는 과정을 보여준다.

**인터랙션 방식**

- 시작·끝 슬라이더를 움직여 슬라이스 결과를 즉시 확인한다.
- 출력 형식의 소수점 자릿수를 바꾸어 비교한다.

**예제 아이디어**

- 가상 Wafer ID에서 접두사와 번호 분리
- Equipment 문자열의 공백 제거와 대문자 통일
- Lot·Wafer·measurement를 한 줄 보고서로 생성

### P05. 비교, 불리언, 논리 연산자

**학습목표**

- 비교식이 `True` 또는 `False`를 만든다는 것을 이해한다.
- `and`, `or`, `not`으로 조건을 결합한다.

**핵심 문법**

```python
measurement = 94.2
in_range = measurement >= 90.0 and measurement <= 100.0
needs_review = not in_range
```

**초보자가 자주 헷갈리는 부분**

- `=`와 `==`를 혼동한다.
- 자연어의 의미만 보고 `and`와 `or`를 반대로 선택한다.
- 여러 비교가 단축 평가된다는 점을 모른다.

**시각화 방식**

- 각 비교의 피연산자와 결과를 따로 계산한 후 논리 게이트처럼 합친다.
- 단축 평가로 실행되지 않은 부분은 `평가 생략`으로 표시한다.

**인터랙션 방식**

- measurement 슬라이더를 움직여 경계값 전후의 결과를 본다.
- 조건 카드 `and`/`or`를 바꿔 PASS 영역의 변화를 확인한다.

**예제 아이디어**

- 가상 measurement의 범위 판정
- 장비가 실행 중이면서 알람이 없는지 확인
- Lot ID가 비어 있거나 Wafer 수가 0인지 확인

### P06. List와 Tuple

**학습목표**

- 순서 있는 여러 값을 List와 Tuple로 저장하고 조회한다.
- 변경 가능한 List와 변경 불가능한 Tuple의 차이를 이해한다.

**핵심 문법**

```python
wafers = ["W01", "W02", "W03"]
wafers.append("W04")
wafers[1] = "W02-R"
range_limit = (90.0, 100.0)
```

**초보자가 자주 헷갈리는 부분**

- 인덱스 범위를 벗어난다.
- `append()`의 반환값을 새 리스트라고 생각한다.
- Tuple도 List처럼 원소를 바꿀 수 있다고 생각한다.
- 대입으로 복사한 두 리스트가 같은 객체를 가리킬 수 있음을 모른다.

**시각화 방식**

- 인덱스가 표시된 셀로 원소를 보여주고 추가·수정 시 셀이 움직이게 한다.
- 별칭이 있는 경우 두 변수의 화살표가 같은 List 객체로 연결되게 한다.
- Tuple은 잠금 아이콘을 표시한다.

**인터랙션 방식**

- 원소를 끌어서 삽입·삭제하고 해당 코드가 생성되도록 한다.
- 별칭과 복사본 중 어느 쪽이 함께 변경되는지 예측한다.

**예제 아이디어**

- 검사 대상 Wafer 목록 관리
- measurement의 고정 상·하한을 Tuple로 표현
- 불량 후보 Wafer를 목록 끝에 추가

### P07. Dictionary와 Set

**학습목표**

- 키로 값을 조회·수정하는 Dictionary를 사용한다.
- Set으로 중복을 제거하고 집합 연산을 수행한다.

**핵심 문법**

```python
wafer = {"id": "W01", "measurement": 94.2, "passed": True}
wafer["measurement"] = 95.1
equipment_ids = {"EQ-01", "EQ-02", "EQ-01"}
```

**초보자가 자주 헷갈리는 부분**

- Dictionary 키와 List 인덱스를 혼동한다.
- 없는 키 접근과 `get()`의 차이를 모른다.
- `{}`가 빈 Set이 아니라 빈 Dictionary라는 점을 놓친다.
- Set의 출력 순서에 의존한다.

**시각화 방식**

- Dictionary는 키가 올바른 값 칸을 여는 사물함 형태로 보여준다.
- Set은 입력 값이 집합 경계로 들어갈 때 중복 카드가 합쳐지게 한다.

**인터랙션 방식**

- 조회할 키를 선택하고 성공·실패 경로를 실행한다.
- 중복 Equipment ID를 넣어 Set 크기의 변화를 확인한다.

**예제 아이디어**

- Wafer별 measurement 레코드 표현
- Equipment ID 중복 제거
- Lot별 Wafer 수를 Dictionary로 집계

### P08. 조건문

**학습목표**

- `if`, `elif`, `else`로 하나의 실행 경로를 선택한다.
- 들여쓰기가 블록을 결정한다는 것을 이해한다.

**핵심 문법**

```python
measurement = 104.3

if measurement < 90.0:
    status = "LOW"
elif measurement <= 100.0:
    status = "PASS"
else:
    status = "HIGH"
```

**초보자가 자주 헷갈리는 부분**

- 서로 독립된 여러 `if`와 `if/elif/else`의 차이를 모른다.
- 첫 번째 참인 분기 이후 나머지는 평가하지 않는다는 점을 놓친다.
- 경계값 `<`와 `<=`, 들여쓰기를 자주 틀린다.

**시각화 방식**

- 조건 평가 트리에서 검사한 경로는 강조하고 건너뛴 경로는 흐리게 한다.
- 들여쓰기 가이드와 블록 범위를 배경색으로 표시한다.

**인터랙션 방식**

- 값별 실행 경로를 먼저 그린 뒤 코드로 확인한다.
- 경계값 90.0, 100.0을 넣어 포함 여부를 테스트한다.

**예제 아이디어**

- measurement를 LOW/PASS/HIGH로 분류
- 장비 상태에 따라 안내 메시지 선택
- Wafer 수가 0, 일부, 최대인 경우 처리

### P09. `for`, `range`, 기본 반복

**학습목표**

- 컬렉션과 `range()`를 순회하고 반복 변수의 변화를 추적한다.
- 반복 횟수와 시작·끝·간격을 계산한다.

**핵심 문법**

```python
for index in range(0, 5):
    print(index)

for wafer_id in ["W01", "W02", "W03"]:
    print(wafer_id)
```

**초보자가 자주 헷갈리는 부분**

- `range(0, 5)`에 5가 포함된다고 생각한다.
- 반복 변수에 인덱스가 들어가는지 원소가 들어가는지 구분하지 못한다.
- 반복문 종료 후 마지막 변수 값이 남는 동작을 예상하지 못한다.

**시각화 방식**

- `range`가 만드는 값 트랙과 현재 선택된 값을 보여준다.
- 컬렉션 원소에서 반복 변수 슬롯으로 값이 이동하고 본문으로 진입하는 흐름을 표시한다.

**인터랙션 방식**

- `start`, `stop`, `step`을 조절해 생성되는 값을 확인한다.
- 다음 반복 변수 값을 맞히고 한 단계 실행한다.

**예제 아이디어**

- W01~W05 검사 메시지 출력
- 가상 measurement 목록을 순서대로 확인
- 2개 간격으로 Wafer 번호 선택

### P10. `while`, `break`, `continue`

**학습목표**

- 조건이 참인 동안 반복하는 `while`의 흐름을 이해한다.
- `break`와 `continue`가 실행 경로에 미치는 영향을 설명한다.

**핵심 문법**

```python
index = 0
measurements = [94.2, None, 101.3, 96.0]

while index < len(measurements):
    value = measurements[index]
    index += 1
    if value is None:
        continue
    if value > 100.0:
        break
```

**초보자가 자주 헷갈리는 부분**

- 반복 변수를 갱신하지 않아 무한 반복을 만든다.
- `continue` 뒤의 코드가 실행된다고 생각한다.
- `break`가 조건문만 끝내는 것으로 오해한다.

**시각화 방식**

- 조건 검사→본문→갱신→조건 복귀의 원형 흐름을 보여준다.
- `continue`와 `break`는 서로 다른 색·선 형태의 점프 화살표로 나타낸다.
- 같은 상태가 반복되면 무한 반복 경고를 표시한다.

**인터랙션 방식**

- 빠진 `index += 1`을 올바른 위치에 배치한다.
- `break`/`continue` 카드를 바꾸어 처리된 원소 수를 비교한다.

**예제 아이디어**

- 첫 상한 초과 measurement에서 탐색 중단
- 누락값을 건너뛰고 유효 데이터만 출력
- 재시도 횟수 제한 시뮬레이션

### P11. 중첩 반복문

**학습목표**

- 바깥 반복 한 회마다 안쪽 반복 전체가 수행됨을 이해한다.
- 전체 실행 횟수와 현재 `(i, k)` 조합을 계산한다.

**핵심 문법**

```python
def mul(a, b):
    return a * b

for i in range(0, 9):
    for k in range(0, 9):
        result = mul(i, k)
```

**초보자가 자주 헷갈리는 부분**

- `i`와 `k`가 동시에 한 번씩만 증가한다고 생각한다.
- 안쪽 반복이 다시 0부터 시작하는 시점을 놓친다.
- 들여쓰기와 전체 호출 횟수를 잘못 계산한다.

**시각화 방식**

- 9×9 격자에서 현재 `(i, k)` 셀을 강조하고 방문 순서를 그린다.
- 바깥/안쪽 반복 트랙을 따로 두고 `k 종료 → i 증가 → k 초기화`를 보여준다.
- `mul(i, k)` 호출 시 실제 값 `mul(2, 4)`로 치환해 표시한다.

**인터랙션 방식**

- 다음 방문할 격자 셀과 다음 변수 값을 선택한다.
- 반복 건너뛰기로 특정 `(i, k)` 또는 마지막 회차까지 이동한다.
- 전체 호출 횟수를 예측하고 실행 카운터로 확인한다.

**예제 아이디어**

- 여러 Lot×Wafer 조합 생성
- Equipment×측정 항목 조합 순회
- 작은 행렬 형태 measurement 데이터 출력

### P12. 함수, 매개변수, 반환값

**학습목표**

- 함수를 정의·호출하고 인수, 매개변수, 반환값을 구분한다.
- 기본값 인수와 키워드 인수를 사용할 수 있다.

**핵심 문법**

```python
def is_in_range(value, lower=90.0, upper=100.0):
    return lower <= value <= upper

passed = is_in_range(94.2)
```

**초보자가 자주 헷갈리는 부분**

- 함수 정의만 하면 본문이 바로 실행된다고 생각한다.
- `print()`와 `return`을 같은 것으로 이해한다.
- 인수와 매개변수 이름이 반드시 같아야 한다고 생각한다.
- 반환하지 않은 함수의 결과가 `None`임을 모른다.

**시각화 방식**

- 호출 시 값이 인수→매개변수로 전달되고 새 스택 프레임이 생성되도록 한다.
- `return` 값이 호출 위치로 이동한 후 변수에 할당되는 순서를 보여준다.

**인터랙션 방식**

- 인수 카드들을 올바른 매개변수에 연결한다.
- `print`만 있는 버전과 `return` 버전의 후속 계산 가능 여부를 비교한다.

**예제 아이디어**

- measurement 범위 판정 함수
- Lot ID와 Wafer ID를 합쳐 샘플 키 생성
- 유효 measurement의 평균 반환

### P13. Scope와 이름 탐색

**학습목표**

- 지역 변수와 전역 변수의 수명·접근 범위를 이해한다.
- Python의 이름 탐색을 입문 수준의 LEGB 흐름으로 설명한다.

**핵심 문법**

```python
threshold = 100.0

def check(value):
    threshold = 98.0
    return value <= threshold

result = check(99.0)
```

**초보자가 자주 헷갈리는 부분**

- 함수 안의 같은 이름이 전역 변수를 자동으로 바꾼다고 생각한다.
- 지역 변수를 함수 밖에서 사용할 수 있다고 생각한다.
- 변수의 값만 보고 어느 스코프에서 찾았는지 놓친다.

**시각화 방식**

- Global과 함수 Scope를 상자로 분리하고 이름 조회가 안쪽에서 바깥쪽으로 이동하는 경로를 표시한다.
- 같은 이름의 변수는 스코프별로 별도 카드로 유지하고 활성 카드에 `사용됨`을 표시한다.

**인터랙션 방식**

- 각 변수 참조가 어느 스코프를 가리키는지 선으로 연결한다.
- 지역 변수 선언을 제거하고 결과가 어떻게 바뀌는지 확인한다.

**예제 아이디어**

- 전역 기본 기준과 함수 내부 임시 기준 비교
- 함수마다 같은 `status` 이름을 안전하게 사용
- 지역 집계값이 함수 종료 후 사라지는 과정 확인

### P14. 문자열·컬렉션 반복 처리 패턴

**학습목표**

- 반복문으로 컬렉션을 변환·필터링·집계하는 기본 패턴을 구분한다.
- 결과 변수를 반복문 앞에서 초기화해야 하는 이유를 설명한다.

**핵심 문법**

```python
measurements = [94.2, 101.3, 96.0, 88.7]
passed = []

for value in measurements:
    if 90.0 <= value <= 100.0:
        passed.append(value)
```

**초보자가 자주 헷갈리는 부분**

- 결과 리스트를 반복문 안에서 매번 새로 만든다.
- 현재 원소와 전체 컬렉션을 혼동한다.
- 누적 변수의 이전 값이 다음 회차에 사용된다는 점을 놓친다.

**시각화 방식**

- 입력, 현재 원소, 판정, 결과 컬렉션을 파이프라인처럼 배치한다.
- 각 회차의 `passed` 변경 전·후와 포함/제외 이유를 타임라인에 남긴다.

**인터랙션 방식**

- 초기화 줄을 반복문 앞/안에 배치해 최종 결과 차이를 비교한다.
- 입력 원소별로 포함/제외 상자를 먼저 선택한다.

**예제 아이디어**

- 범위 안 measurement만 새 목록에 저장
- Wafer ID에 접두사 추가
- 상태별 Wafer 개수 누적

### P15. Comprehension

**학습목표**

- List, Dictionary, Set comprehension의 읽는 순서를 이해한다.
- 단순한 변환과 필터를 반복문에서 comprehension으로 바꾼다.

**핵심 문법**

```python
measurements = [94.2, 101.3, 96.0, 88.7]
passed = [value for value in measurements if 90.0 <= value <= 100.0]
squared = {value: value ** 2 for value in range(3)}
```

**초보자가 자주 헷갈리는 부분**

- 결과 표현식, 반복 부분, 조건 부분을 읽는 순서를 혼동한다.
- 무조건 comprehension이 더 좋은 코드라고 생각한다.
- 중첩 comprehension을 과도하게 사용한다.

**시각화 방식**

- comprehension을 동등한 여러 줄의 반복문으로 펼친 뒤 한 단계씩 대응시킨다.
- 각 입력이 조건 필터를 통과해 결과 표현식으로 변환되는 흐름을 보여준다.

**인터랙션 방식**

- 펼친 반복문 블록을 드래그해 한 줄 comprehension으로 조립한다.
- 복잡도가 임계치를 넘으면 `반복문이 더 읽기 쉬움` 비교 보기를 제공한다.

**예제 아이디어**

- 범위 안 measurement 목록 생성
- Wafer ID→순번 Dictionary 생성
- 중복 Equipment ID를 정규화한 Set 생성

### P16. `enumerate`, `zip`, Unpacking

**학습목표**

- `enumerate()`로 순번과 값을 함께 순회한다.
- `zip()`으로 같은 위치의 데이터를 묶고 unpacking으로 분리한다.

**핵심 문법**

```python
wafers = ["W01", "W02", "W03"]
values = [94.2, 101.3, 96.0]

for index, (wafer_id, value) in enumerate(zip(wafers, values), start=1):
    print(index, wafer_id, value)
```

**초보자가 자주 헷갈리는 부분**

- 인덱스가 필요할 때 `range(len(...))`만 사용한다.
- 서로 길이가 다른 `zip()`이 짧은 쪽에서 끝나는 것을 모른다.
- unpacking할 변수 개수와 값 개수가 맞지 않는다.

**시각화 방식**

- 두 컬렉션을 평행한 행으로 놓고 같은 열의 값이 Tuple로 묶이는 모습을 보여준다.
- `enumerate`가 각 묶음 앞에 순번을 붙이는 단계를 분리한다.

**인터랙션 방식**

- 길이가 다른 목록을 넣고 어느 원소까지 묶이는지 예측한다.
- Tuple 카드를 변수 슬롯에 올바르게 분해한다.

**예제 아이디어**

- Wafer ID와 measurement를 행 단위로 결합
- 1부터 시작하는 검사 순번 부여
- Equipment ID와 상태 목록 짝짓기

### P17. 정렬, `key`, `lambda`

**학습목표**

- `sorted()`와 List의 `sort()` 차이를 이해한다.
- `key` 함수로 정렬 기준을 지정하고 간단한 `lambda`를 읽는다.

**핵심 문법**

```python
records = [
    {"wafer": "W01", "measurement": 94.2},
    {"wafer": "W02", "measurement": 101.3},
    {"wafer": "W03", "measurement": 96.0},
]

ordered = sorted(records, key=lambda item: item["measurement"], reverse=True)
```

**초보자가 자주 헷갈리는 부분**

- `sort()`의 반환값을 정렬된 리스트라고 생각한다.
- 정렬할 레코드와 정렬 기준값을 구분하지 못한다.
- `lambda`가 호출되는 시점과 전달되는 값을 이해하기 어렵다.

**시각화 방식**

- 각 레코드가 `key` 함수에 들어가 정렬 키를 받는 과정을 별도 열로 표시한다.
- 원본 순서와 결과 순서를 나란히 두며 `sorted()`는 새 객체임을 보여준다.

**인터랙션 방식**

- 정렬 키를 Wafer ID 또는 measurement로 전환한다.
- `reverse`를 바꾸고 첫·마지막 레코드를 예측한다.

**예제 아이디어**

- measurement 내림차순 Wafer 목록
- Equipment ID의 숫자 부분 기준 정렬
- 범위 이탈 크기가 큰 순서로 검토 목록 생성

### P18. 파일 읽기와 쓰기

**학습목표**

- `with open()`으로 텍스트 파일을 안전하게 열고 읽고 쓴다.
- 파일 모드와 파일 커서의 기본 동작을 이해한다.

**핵심 문법**

```python
with open("measurements.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

with open("summary.txt", "w", encoding="utf-8") as file:
    file.write("valid_count=3\n")
```

**초보자가 자주 헷갈리는 부분**

- `r`, `w`, `a` 모드의 차이와 `w`가 기존 내용을 대체하는 점을 놓친다.
- 줄바꿈 문자가 결과에 포함된다는 점을 모른다.
- 파일을 닫아야 하는 이유와 `with`의 역할을 이해하기 어렵다.

**시각화 방식**

- 가상 파일을 줄과 커서가 있는 문서로 표현하고 읽은 범위를 강조한다.
- `with` 진입 시 파일이 열리고 블록 종료 시 자동으로 닫히는 상태를 보여준다.
- 쓰기 전·후 파일 내용을 비교한다.

**인터랙션 방식**

- 파일 모드를 선택한 뒤 기존 파일이 어떻게 바뀔지 예측한다.
- 줄바꿈이 포함된 원시 보기와 정리된 보기 사이를 전환한다.

**예제 아이디어**

- 가상 Wafer ID 텍스트 파일 읽기
- 유효 measurement 개수 요약 파일 쓰기
- Equipment 이벤트를 기존 로그 끝에 추가

### P19. 예외 처리

**학습목표**

- 예외가 발생하면 현재 실행 흐름이 바뀐다는 것을 이해한다.
- `try`, `except`, `else`, `finally`, `raise`를 목적에 맞게 사용한다.

**핵심 문법**

```python
raw_value = "N/A"

try:
    measurement = float(raw_value)
except ValueError:
    measurement = None
finally:
    print("conversion finished")
```

**초보자가 자주 헷갈리는 부분**

- 모든 코드를 넓은 `try`에 넣거나 모든 예외를 한 번에 숨긴다.
- `else`와 `finally`가 언제 실행되는지 혼동한다.
- 오류 메시지와 예외 타입을 구분하지 못한다.

**시각화 방식**

- 예외 객체가 생성되어 현재 줄에서 적합한 `except` 블록으로 이동하는 경로를 보여준다.
- 정상/오류 두 실행 타임라인을 나란히 비교하고 `finally`가 양쪽에서 실행됨을 표시한다.

**인터랙션 방식**

- 여러 `except` 중 처리할 블록을 선택한다.
- 정상값, 숫자 아닌 값, 누락값을 넣어 각 경로를 확인한다.

**예제 아이디어**

- measurement 문자열의 숫자 변환
- 없는 Dictionary 키를 안전하게 처리
- 허용 범위 밖 값에 직접 `ValueError` 발생

### P20. Module과 Import

**학습목표**

- 코드를 모듈로 나누고 이름을 import하는 방식을 이해한다.
- 표준 라이브러리와 외부 패키지의 차이를 설명한다.

**핵심 문법**

```python
# validators.py
def is_valid(value):
    return 0 <= value <= 200

# main.py
from validators import is_valid

print(is_valid(94.2))
```

**초보자가 자주 헷갈리는 부분**

- 파일명, 모듈명, 함수명을 혼동한다.
- import 시 모듈의 최상위 코드가 실행될 수 있음을 모른다.
- `import module`과 `from module import name`의 호출 방식 차이를 놓친다.
- `pip`와 `import`가 같은 동작이라고 생각한다.

**시각화 방식**

- 파일 간 의존 관계를 작은 그래프로 보여주고 이름이 현재 namespace에 추가되는 과정을 표시한다.
- 첫 import와 캐시된 재사용을 구분한다.

**인터랙션 방식**

- import 방식에 맞는 올바른 함수 호출 표현을 고른다.
- 함수들을 적절한 모듈 파일로 분류한다.

**예제 아이디어**

- 가상 데이터 검증 함수를 별도 모듈로 분리
- `statistics.mean`으로 평균 계산
- 패키지 설치는 허용된 예제 라이브러리의 개념 흐름만 시뮬레이션

### P21. Class와 객체 기초

**학습목표**

- Class를 객체를 만드는 정의로 이해하고 인스턴스를 생성한다.
- 속성, 메서드, `self`의 역할을 설명한다.

**핵심 문법**

```python
class Wafer:
    def __init__(self, wafer_id, measurement):
        self.wafer_id = wafer_id
        self.measurement = measurement

    def is_in_range(self, lower, upper):
        return lower <= self.measurement <= upper

wafer = Wafer("W01", 94.2)
```

**초보자가 자주 헷갈리는 부분**

- Class와 인스턴스를 같은 것으로 생각한다.
- `self`를 호출 시 직접 넘겨야 한다고 생각한다.
- 지역 변수와 인스턴스 속성을 혼동한다.
- 모든 데이터를 반드시 Class로 만들어야 한다고 생각한다.

**시각화 방식**

- Class 정의와 생성된 인스턴스 객체를 분리해 표시한다.
- 메서드 호출 `wafer.is_in_range(...)`가 함수 프레임의 `self`에 해당 객체를 연결하는 모습을 보여준다.

**인터랙션 방식**

- 같은 Class에서 여러 인스턴스를 만들고 각 속성을 수정해 독립성을 확인한다.
- 지역 변수와 `self.attribute` 카드를 올바른 영역에 배치한다.

**예제 아이디어**

- 가상 Wafer 객체의 측정값과 판정 메서드
- Equipment 객체의 상태 변경
- Lot 객체가 Wafer ID 목록을 보관

### P22. CSV와 JSON 데이터

**학습목표**

- CSV의 행·열과 JSON의 중첩 구조를 Python 데이터 구조로 연결한다.
- 표준 라이브러리로 데이터를 읽고 쓰는 기본 흐름을 익힌다.

**핵심 문법**

```python
import csv
import json

with open("measurements.csv", newline="", encoding="utf-8") as file:
    rows = list(csv.DictReader(file))

payload = json.loads('{"lot": "LOT-A01", "count": 3}')
```

**초보자가 자주 헷갈리는 부분**

- CSV에서 읽은 숫자가 문자열이라는 점을 놓친다.
- JSON 문자열과 Python Dictionary를 같은 것으로 생각한다.
- `load`/`loads`, `dump`/`dumps`를 혼동한다.
- JSON의 `null`, `true`, `false`와 Python 값을 섞어 쓴다.

**시각화 방식**

- CSV 표의 한 행이 Dictionary로 변환되고 필드 타입이 바뀌는 과정을 보여준다.
- JSON 텍스트↔트리↔Python 객체의 세 표현을 연결한다.

**인터랙션 방식**

- 데이터 타입 변환이 필요한 열을 선택한다.
- JSON 트리의 노드를 클릭해 접근 코드와 값을 확인한다.

**예제 아이디어**

- Wafer·measurement 가상 CSV 읽기
- Lot 요약 Dictionary를 JSON 문자열로 내보내기
- 누락 필드와 잘못된 숫자 문자열 검증

### P23. 함수형 도구와 Generator 맛보기

**학습목표**

- `map`, `filter`, `any`, `all`을 반복 처리 관점에서 읽는다.
- `yield`가 값을 한 번에 모두 만들지 않고 필요할 때 제공한다는 개념을 이해한다.

**핵심 문법**

```python
values = [94.2, 101.3, 96.0]
has_high = any(value > 100.0 for value in values)
all_numeric = all(isinstance(value, (int, float)) for value in values)

def valid_values(rows):
    for row in rows:
        if row["measurement"] is not None:
            yield row["measurement"]
```

**초보자가 자주 헷갈리는 부분**

- `map`과 `filter` 결과가 즉시 List라고 생각한다.
- `any`/`all`의 단축 평가와 빈 컬렉션 결과를 예상하기 어렵다.
- Generator가 어디까지 실행되었는지, 왜 한 번 소비하면 비는지 이해하기 어렵다.

**시각화 방식**

- `any`/`all`은 각 입력 검사 후 멈추는 지점을 표시한다.
- Generator는 `일시 정지된 함수 프레임`과 다음 값을 요청할 때 재개되는 위치를 보여준다.

**인터랙션 방식**

- 다음 값을 요청하는 버튼으로 Generator를 한 항목씩 소비한다.
- 동일 문제의 반복문/Generator 표현을 나란히 비교한다.

**예제 아이디어**

- 상한 초과 measurement가 하나라도 있는지 확인
- 모든 Wafer ID 형식이 올바른지 확인
- 큰 데이터 흐름을 흉내 낸 가상 measurement 순차 제공

### P24. Python 종합 실습 — 가상 Measurement 요약기

**학습목표**

- 파일, 변환, 검증, 반복, 함수, 예외, 집계를 연결한다.
- 문제를 작은 함수로 나누고 입력→처리→출력 흐름을 설명한다.

**핵심 문법**

```python
def parse_value(raw):
    try:
        return float(raw)
    except (TypeError, ValueError):
        return None

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

    return {
        "valid_count": len(valid),
        "pass_count": len(passed),
        "average": sum(valid) / len(valid) if valid else None,
    }
```

**초보자가 자주 헷갈리는 부분**

- 데이터 변환, 검증, 집계를 한 반복문에 뒤섞는다.
- 빈 List 평균에서 0으로 나누는 경우를 놓친다.
- 원본 데이터, 유효 데이터, PASS 데이터를 구분하지 못한다.
- 반환된 Dictionary의 의미와 값 출처를 추적하기 어렵다.

**시각화 방식**

- 전체 흐름을 `입력 행 → 변환 → 유효성 검사 → 범위 판정 → 집계 → 요약` 파이프라인으로 표시한다.
- 특정 레코드를 선택하면 함수 호출, 변수 변화, 최종 요약에 대한 기여를 끝까지 추적한다.
- 오류·누락 레코드는 제외 이유를 별도 감사 로그에 남긴다.

**인터랙션 방식**

- 학습자가 함수 블록을 올바른 순서로 조립한다.
- 가상 CSV 행과 기준값을 수정하고 요약 결과를 예측한다.
- 숨은 테스트에서 빈 입력, 전부 누락, 경계값, 숫자 문자열을 처리한다.

**예제 아이디어**

- Lot별 유효 measurement 수, PASS 수, 평균 계산
- 검토가 필요한 Wafer ID 목록 생성
- 요약 결과를 JSON 또는 텍스트 파일로 내보내기

---

## 5. JavaScript 교육 항목

### J01. 출력과 주석

**학습목표**

- `console.log()`로 값을 확인하고 한 줄·여러 줄 주석을 사용한다.
- 개발자 출력과 값 반환을 구분한다.

**핵심 문법**

```javascript
// 가상 Lot 상태 확인
const lotId = "LOT-A01";
console.log("Lot:", lotId);
```

**초보자가 자주 헷갈리는 부분**

- Python의 `print()`와 이름만 다르고 역할은 유사하다는 연결을 놓친다.
- `console.log()`의 결과를 변수에 저장하려 한다.
- 세미콜론을 언제 쓰는지에 집중해 핵심 실행 흐름을 놓친다.

**시각화 방식**

- 인수 값들이 Console panel에 순서대로 나타나는 흐름을 보여준다.
- 주석 줄은 실행 대상이 아님을 표시하고 커서가 건너뛴다.

**인터랙션 방식**

- 출력값을 예측하고 Python `print()` 버전과 나란히 실행한다.
- 여러 값을 하나의 템플릿 문자열 출력으로 바꾼다.

**예제 아이디어**

- Equipment ID와 상태 출력
- Wafer ID 배열의 길이 출력
- measurement와 단위를 함께 출력

### J02. `let`, `const`, 기본 타입

**학습목표**

- 재할당 가능 여부에 따라 `const`와 `let`을 선택한다.
- Number, String, Boolean, `null`, `undefined`의 기본 차이를 이해한다.

**핵심 문법**

```javascript
const equipment = "EQ-01";
let waferCount = 25;
let lastMeasurement = null;
let operatorNote;

waferCount = 24;
```

**초보자가 자주 헷갈리는 부분**

- `const` 객체의 내부 값도 전혀 바꿀 수 없다고 생각한다.
- `null`과 `undefined`를 동일하게 사용한다.
- Number가 정수와 실수를 함께 표현한다는 점을 Python과 혼동한다.

**시각화 방식**

- 바인딩 슬롯에 재할당 잠금 여부를 표시하고 객체 내부 변경과 변수 재할당을 분리한다.
- 선언만 한 변수는 `undefined` 상태 카드로 보여준다.

**인터랙션 방식**

- 코드 상황별로 `let` 또는 `const`를 선택한다.
- 재할당과 객체 속성 변경을 각각 실행해 차이를 확인한다.

**예제 아이디어**

- 고정 Equipment ID는 `const`, 변하는 상태는 `let`
- 아직 측정되지 않은 값을 `null`로 표현
- 선언 전·초기화 전 상태 비교

### J03. 연산자, 타입 변환, 엄격한 동등성

**학습목표**

- 산술·비교·논리 연산자를 사용한다.
- 암시적 타입 변환의 위험과 `===` 사용 이유를 이해한다.

**핵심 문법**

```javascript
const rawValue = "94.2";
const measurement = Number(rawValue);
const isSameTypeAndValue = rawValue === measurement;
const isValid = Number.isFinite(measurement);
```

**초보자가 자주 헷갈리는 부분**

- `+`가 숫자 덧셈과 문자열 연결에 모두 쓰인다.
- `==`가 타입을 변환해 비교한다는 사실을 놓친다.
- `NaN`이 자기 자신과도 같지 않고 `typeof NaN`이 `number`라는 점을 직관적으로 이해하기 어렵다.

**시각화 방식**

- 피연산자의 타입 태그와 암시적 변환 과정을 단계별로 보여준다.
- `==`와 `===` 비교 결과를 같은 입력으로 나란히 표시한다.
- `Number()` 변환 결과가 `NaN`이면 실패 경로를 강조한다.

**인터랙션 방식**

- 문자열·숫자 값을 조합해 연산 결과와 타입을 예측한다.
- 느슨한 비교를 엄격한 비교와 명시적 변환으로 고친다.

**예제 아이디어**

- CSV에서 온 measurement 문자열 변환
- Wafer 개수 문자열과 숫자 비교
- 숫자 아닌 입력을 `Number.isFinite()`로 검증

### J04. 문자열과 Template Literal

**학습목표**

- 문자열 인덱스, 슬라이스, 주요 메서드를 사용한다.
- Template literal로 값과 여러 줄 문자열을 조합한다.

**핵심 문법**

```javascript
const waferId = "WAFER-07";
const prefix = waferId.slice(0, 5);
const number = waferId.slice(-2);
const message = `${waferId}: measurement=${94.2.toFixed(1)}`;
```

**초보자가 자주 헷갈리는 부분**

- 작은따옴표와 backtick을 혼동한다.
- `${...}`를 일반 따옴표 안에서 사용한다.
- `toFixed()` 결과가 문자열이라는 점을 놓친다.

**시각화 방식**

- 문자열 인덱스 띠에서 `slice` 범위를 강조한다.
- Template literal의 각 표현식을 평가해 최종 문자열 슬롯에 끼워 넣는 과정을 보여준다.

**인터랙션 방식**

- 따옴표 종류를 바꿔 Template literal 동작을 비교한다.
- 슬라이스 시작·끝을 움직이고 Python 결과와 비교한다.

**예제 아이디어**

- Wafer ID 부분 문자열 추출
- Equipment·status 한 줄 메시지 생성
- 소수점 자리수를 맞춘 measurement 보고 문구

### J05. Array

**학습목표**

- Array를 생성하고 인덱스로 읽고 수정한다.
- `push`, `pop`, `slice`, `splice`의 역할을 구분한다.

**핵심 문법**

```javascript
const wafers = ["W01", "W02", "W03"];
wafers.push("W04");
wafers[1] = "W02-R";
const firstTwo = wafers.slice(0, 2);
```

**초보자가 자주 헷갈리는 부분**

- `const` Array의 원소를 변경할 수 없다고 생각한다.
- `slice`와 `splice`를 혼동하고 원본 변경 여부를 놓친다.
- 마지막 인덱스를 `length`로 사용한다.
- Array를 `===`로 내용 비교하려 한다.

**시각화 방식**

- 인덱스 셀과 `length`를 별도로 표시한다.
- 원본 변경 메서드는 셀이 직접 움직이고, 새 Array를 만드는 메서드는 복사본 상자가 생성되게 한다.

**인터랙션 방식**

- 메서드를 실행하기 전에 원본/결과 Array를 채운다.
- Python List 메서드와 기능을 짝짓는다.

**예제 아이디어**

- 검사 대기 Wafer 목록 수정
- 첫 두 measurement만 복사
- 마지막 처리 항목 꺼내기

### J06. Object와 참조

**학습목표**

- Object의 속성을 읽고 추가·수정한다.
- 점 표기법과 대괄호 표기법, 객체 참조 공유를 이해한다.

**핵심 문법**

```javascript
const wafer = {
  id: "W01",
  measurement: 94.2,
  passed: true,
};

wafer.measurement = 95.1;
const field = "passed";
console.log(wafer[field]);
```

**초보자가 자주 헷갈리는 부분**

- Object를 Python Dictionary와 완전히 동일하게 생각한다.
- 동적 속성명인데 점 표기법을 사용한다.
- 객체를 다른 변수에 할당하면 깊은 복사가 된다고 생각한다.
- 없는 속성이 오류가 아니라 `undefined`를 줄 수 있음을 모른다.

**시각화 방식**

- 변수 바인딩과 별도 Object 메모리 상자를 화살표로 연결한다.
- 별칭 변수의 속성 변경이 같은 객체에 반영되는 모습을 보여준다.
- 점/대괄호 접근이 선택하는 키를 시각적으로 비교한다.

**인터랙션 방식**

- 정적 키와 동적 키에 맞는 표기법을 선택한다.
- 얕은 복사 전후 어느 객체가 바뀌는지 예측한다.

**예제 아이디어**

- Wafer 레코드 속성 갱신
- 선택한 measurement 필드 동적 조회
- Lot 요약 Object 구성

### J07. 조건문과 조건 표현식

**학습목표**

- `if`, `else if`, `else`로 실행 경로를 선택한다.
- truthy/falsy와 삼항 연산자의 적절한 사용 범위를 이해한다.

**핵심 문법**

```javascript
const measurement = 104.3;
let status;

if (measurement < 90.0) {
  status = "LOW";
} else if (measurement <= 100.0) {
  status = "PASS";
} else {
  status = "HIGH";
}

const label = status === "PASS" ? "OK" : "REVIEW";
```

**초보자가 자주 헷갈리는 부분**

- `0`, `""`, `null`, `undefined`, `NaN`의 falsy 동작을 모른다.
- `"false"`가 truthy라는 점을 예상하지 못한다.
- 중괄호와 들여쓰기를 Python 방식과 섞는다.
- 복잡한 로직을 삼항 연산자에 과도하게 넣는다.

**시각화 방식**

- 조건 평가 트리와 선택된 코드 블록을 연결한다.
- 값이 Boolean으로 변환되는 경우 원래 값→truthy/falsy→분기 순서를 표시한다.

**인터랙션 방식**

- 다양한 값을 truthy/falsy 상자로 분류한다.
- 경계값과 빈 문자열을 넣어 실행 경로를 확인한다.

**예제 아이디어**

- measurement LOW/PASS/HIGH 분류
- 누락된 Equipment status에 기본 라벨 표시
- 검토 여부를 짧은 삼항 표현식으로 생성

### J08. `for`, `while`, `for...of`

**학습목표**

- 카운터 반복과 값 순회를 구분한다.
- `for...of`로 Array의 값을 순회하고 `break`/`continue`를 사용한다.

**핵심 문법**

```javascript
const wafers = ["W01", "W02", "W03"];

for (let index = 0; index < wafers.length; index += 1) {
  console.log(index, wafers[index]);
}

for (const waferId of wafers) {
  console.log(waferId);
}
```

**초보자가 자주 헷갈리는 부분**

- 초기화, 조건, 증감식의 실행 순서를 혼동한다.
- `index <= array.length`로 범위를 벗어난다.
- `for...in`과 `for...of`를 혼동한다.
- `while`에서 상태 갱신을 빠뜨린다.

**시각화 방식**

- 전통 `for`를 `초기화→조건→본문→증감→조건` 순환도로 보여준다.
- `for...of`는 Array 원소에서 반복 변수로 값이 이동하는 트랙으로 표현한다.

**인터랙션 방식**

- 실행 순서 카드를 올바르게 배열한다.
- 같은 Array를 전통 `for`와 `for...of`로 실행해 상태 차이를 비교한다.

**예제 아이디어**

- Wafer ID와 인덱스 출력
- 누락 measurement는 건너뛰기
- 첫 상한 초과 값에서 반복 중단

### J09. 함수 선언, 표현식, 매개변수, 반환값

**학습목표**

- 함수 선언과 함수 표현식을 호출한다.
- 인수 전달, 기본 매개변수, 반환값의 흐름을 이해한다.

**핵심 문법**

```javascript
function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

const passed = isInRange(94.2);
```

**초보자가 자주 헷갈리는 부분**

- 함수 이름만 쓰는 것과 `()`로 호출하는 것을 구분하지 못한다.
- `console.log()`와 `return`을 같은 것으로 생각한다.
- 빠진 인수가 `undefined`가 되는 것을 모른다.
- 함수 선언의 호이스팅을 모든 함수 형태에 동일하게 기대한다.

**시각화 방식**

- 호출 위치에서 새 Call Stack 프레임을 만들고 인수→매개변수 바인딩을 보여준다.
- 반환값이 호출 위치로 돌아가 변수에 할당되는 순서를 표시한다.
- 선언문/표현식의 사용 가능 시점을 타임라인에서 비교한다.

**인터랙션 방식**

- 함수 참조와 함수 호출 표현을 구분하는 문제를 푼다.
- 인수를 빼거나 순서를 바꿔 매개변수 상태를 관찰한다.

**예제 아이디어**

- measurement 범위 판정 함수
- Lot ID와 Wafer ID를 합친 키 반환
- 유효값 평균 함수

### J10. Arrow Function

**학습목표**

- Arrow function의 기본 형태와 암시적 반환을 읽고 쓴다.
- 일반 함수와 Arrow function이 항상 교체 가능한 것은 아님을 이해한다.

**핵심 문법**

```javascript
const isInRange = (value, lower = 90.0, upper = 100.0) =>
  value >= lower && value <= upper;

const toLabel = (wafer) => ({
  id: wafer.id,
  label: `${wafer.id}:${wafer.measurement}`,
});
```

**초보자가 자주 헷갈리는 부분**

- 중괄호를 쓰면 명시적 `return`이 필요하다는 점을 놓친다.
- Object를 암시적으로 반환할 때 괄호가 필요한 이유를 모른다.
- Arrow function에 자체 `this`가 있다고 생각한다.

**시각화 방식**

- Arrow function을 동등한 일반 함수 형태로 펼쳐 대응시킨다.
- `{}`가 함수 본문인지 Object literal인지 파서 관점의 분기 그림으로 보여준다.
- `this`는 J20 Class 레슨과 연결되는 lexical capture로 표시한다.

**인터랙션 방식**

- 일반 함수를 Arrow function으로 변환한다.
- 암시적 반환과 명시적 반환 버전의 결과를 비교한다.

**예제 아이디어**

- Array 메서드에 전달할 measurement 판정 함수
- Wafer 레코드를 라벨 Object로 변환
- 간단한 편차 계산 함수

### J11. Scope, Shadowing, Closure 기초

**학습목표**

- 전역, 함수, 블록 Scope를 구분한다.
- 같은 이름의 shadowing과 closure의 기본 개념을 이해한다.

**핵심 문법**

```javascript
const threshold = 100.0;

function makeChecker(lower, upper) {
  return function check(value) {
    return value >= lower && value <= upper;
  };
}

const isNormal = makeChecker(90.0, 100.0);
const passed = isNormal(94.2);
```

**초보자가 자주 헷갈리는 부분**

- `let`/`const`의 블록 Scope와 `var`의 함수 Scope를 혼동한다.
- 내부 함수가 종료된 외부 함수의 값을 어떻게 기억하는지 이해하기 어렵다.
- 같은 이름의 변수가 어느 Scope에서 선택되는지 놓친다.

**시각화 방식**

- Scope 상자를 중첩하고 이름 조회 선을 안쪽에서 바깥쪽으로 그린다.
- 외부 함수가 종료된 뒤에도 closure가 참조하는 `lower`, `upper` 환경은 남아 있게 표시한다.

**인터랙션 방식**

- 변수 사용 지점을 해당 Scope 정의에 연결한다.
- 서로 다른 기준의 checker 두 개를 만들어 기억하는 값이 다름을 확인한다.

**예제 아이디어**

- 기준 범위를 기억하는 판정 함수 생성
- 블록 안 임시 `status`와 바깥 `status` 비교
- 여러 Equipment별 서로 다른 경고 기준 함수

### J12. `map`

**학습목표**

- `map`이 각 원소를 변환해 같은 길이의 새 Array를 만든다는 것을 이해한다.
- 콜백의 값, 인덱스, 반환값을 추적한다.

**핵심 문법**

```javascript
const measurements = [94.2, 101.3, 96.0];
const deviations = measurements.map((value) => value - 95.0);
```

**초보자가 자주 헷갈리는 부분**

- 콜백에서 `return`을 빠뜨린다.
- `map`이 원본 Array를 직접 바꾼다고 생각한다.
- 변환 대신 부수 효과만 수행하는 데 `map`을 사용한다.

**시각화 방식**

- 입력 셀→콜백 프레임→반환값→같은 위치의 출력 셀을 한 줄씩 연결한다.
- 입력과 결과의 길이가 같음을 고정된 레일로 보여준다.

**인터랙션 방식**

- 각 콜백 반환값을 예측해 결과 Array 셀을 채운다.
- `return`을 제거했을 때 `undefined`가 채워지는 과정을 확인한다.

**예제 아이디어**

- 기준 대비 measurement 편차 계산
- Wafer 레코드를 표시용 문자열로 변환
- 숫자 문자열 Array를 Number Array로 변환

### J13. `filter`와 `find`

**학습목표**

- `filter`의 전체 선택과 `find`의 첫 항목 탐색을 구분한다.
- 콜백의 Boolean 결과가 원소 선택을 결정함을 이해한다.

**핵심 문법**

```javascript
const measurements = [94.2, 101.3, 96.0, 88.7];
const passed = measurements.filter(
  (value) => value >= 90.0 && value <= 100.0,
);
const firstHigh = measurements.find((value) => value > 100.0);
```

**초보자가 자주 헷갈리는 부분**

- `filter`가 Boolean Array를 반환한다고 생각한다.
- `find`가 모든 일치 항목을 반환한다고 생각한다.
- 찾지 못한 `find` 결과 `undefined` 처리를 놓친다.

**시각화 방식**

- 각 원소가 Boolean 게이트를 지나 원본 값 그대로 결과에 포함되는 모습을 보여준다.
- `find`는 첫 참에서 나머지 검사를 중단하도록 타임라인을 접는다.

**인터랙션 방식**

- 입력별 콜백 결과와 최종 포함 여부를 선택한다.
- 같은 조건을 `filter`/`find`로 실행해 호출 횟수를 비교한다.

**예제 아이디어**

- PASS measurement 목록
- 첫 상한 초과 Wafer 찾기
- 특정 Equipment 상태 레코드 모두 선택

### J14. `reduce`

**학습목표**

- accumulator와 current value의 회차별 변화를 추적한다.
- 합계, 개수, 그룹화를 `reduce`로 구현하고 반복문과 비교한다.

**핵심 문법**

```javascript
const measurements = [94.2, 101.3, 96.0];
const total = measurements.reduce(
  (accumulator, value) => accumulator + value,
  0,
);
```

**초보자가 자주 헷갈리는 부분**

- 초기값을 빠뜨려 첫 회차의 의미가 달라지는 것을 놓친다.
- 콜백에서 accumulator를 반환하지 않는다.
- 단순한 작업도 지나치게 복잡한 `reduce`로 표현한다.

**시각화 방식**

- 회차별 `accumulator 이전 값 + current → 새 accumulator`를 표와 애니메이션으로 보여준다.
- 초기값이 있는 경우와 없는 경우 첫 회차를 나란히 비교한다.

**인터랙션 방식**

- 트레이스 표의 다음 accumulator 값을 채운다.
- 같은 집계를 `for...of`와 `reduce`로 전환해 읽기 난이도를 비교한다.

**예제 아이디어**

- measurement 합계와 평균 계산
- PASS/FAIL 개수 Object 생성
- Equipment별 레코드 그룹화는 도전 과제로만 제공

### J15. 구조 분해 할당

**학습목표**

- Array 위치와 Object 키에 따라 값을 구조 분해한다.
- 기본값과 이름 변경을 사용할 수 있다.

**핵심 문법**

```javascript
const limits = [90.0, 100.0];
const [lower, upper] = limits;

const wafer = { id: "W01", measurement: 94.2 };
const { id: waferId, measurement, status = "UNKNOWN" } = wafer;
```

**초보자가 자주 헷갈리는 부분**

- Array는 위치, Object는 키를 기준으로 한다는 차이를 놓친다.
- Object 이름 변경 구문에서 어느 쪽이 원래 키인지 혼동한다.
- 기본값은 속성이 `undefined`일 때만 적용된다는 점을 모른다.

**시각화 방식**

- 원본 Array 셀 또는 Object 키에서 새 변수 슬롯으로 선을 연결한다.
- 이름 변경은 `원래 키 → 새 변수명`, 기본값은 fallback 경로로 표시한다.

**인터랙션 방식**

- 값 카드를 구조 분해 패턴의 올바른 변수에 연결한다.
- 속성 누락, `null`, `undefined`에서 기본값 결과를 비교한다.

**예제 아이디어**

- 기준 Tuple 성격의 Array에서 상·하한 추출
- Wafer Object에서 ID와 measurement 추출
- 함수 매개변수에서 필요한 필드만 구조 분해

### J16. Spread와 Rest

**학습목표**

- Spread로 Array/Object를 펼쳐 새 값을 구성한다.
- Rest로 남은 값이나 가변 인수를 모은다.
- 얕은 복사의 한계를 이해한다.

**핵심 문법**

```javascript
const original = { id: "W01", measurement: 94.2 };
const updated = { ...original, measurement: 95.1 };

function average(...values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}
```

**초보자가 자주 헷갈리는 부분**

- 같은 `...`가 위치에 따라 펼치기와 모으기 역할을 한다.
- Object 속성 순서에 따라 뒤의 값이 앞의 값을 덮어쓴다는 점을 놓친다.
- 중첩 객체까지 깊게 복사된다고 생각한다.

**시각화 방식**

- Spread는 컨테이너가 열려 항목들이 새 컨테이너로 이동하는 모습으로 표현한다.
- Rest는 여러 항목이 하나의 Array 슬롯으로 모이게 한다.
- 중첩 객체 참조는 복사 후에도 같은 메모리 상자를 가리키는 선으로 보여준다.

**인터랙션 방식**

- Object 병합 순서를 바꿔 최종 속성값을 예측한다.
- 얕은 복사 후 중첩 값을 수정해 공유 참조를 확인한다.

**예제 아이디어**

- Wafer 레코드를 원본 훼손 없이 갱신
- 여러 Lot의 Wafer ID Array 결합
- 임의 개수 measurement의 평균 함수

### J17. JSON

**학습목표**

- JSON 텍스트와 JavaScript 값의 차이를 이해한다.
- `JSON.parse()`와 `JSON.stringify()`로 변환한다.

**핵심 문법**

```javascript
const text = '{"lot":"LOT-A01","measurements":[94.2,96.0]}';
const data = JSON.parse(text);
const pretty = JSON.stringify(data, null, 2);
```

**초보자가 자주 헷갈리는 부분**

- JSON을 Object 자체로 생각하고 속성에 바로 접근한다.
- JSON 키·문자열에 큰따옴표가 필요하다는 점을 놓친다.
- 함수, `undefined`, 순환 참조가 일반 JSON으로 표현되지 않음을 모른다.

**시각화 방식**

- 텍스트 토큰→구조 트리→메모리 Object의 변환을 세 단계로 보여준다.
- 파싱 오류 위치를 문자 단위로 강조하고 기대한 토큰을 설명한다.

**인터랙션 방식**

- 잘못된 JSON의 따옴표, 쉼표, 괄호를 수정한다.
- Object를 stringify하기 전 어떤 필드가 사라질지 예측한다.

**예제 아이디어**

- 가상 Lot payload 파싱
- measurement 요약 Object를 JSON 텍스트로 저장
- Python JSON 표현과 값 대응 비교

### J18. 오류와 `try...catch...finally`

**학습목표**

- Error가 발생·전파·처리되는 흐름을 이해한다.
- `throw`로 잘못된 입력을 명시적으로 거부한다.

**핵심 문법**

```javascript
function parseMeasurement(rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new TypeError("measurement must be numeric");
  }
  return value;
}

try {
  parseMeasurement("N/A");
} catch (error) {
  console.log(error.name, error.message);
} finally {
  console.log("conversion finished");
}
```

**초보자가 자주 헷갈리는 부분**

- `throw` 뒤의 코드가 계속 실행된다고 생각한다.
- 문자열을 던지는 것과 `Error` 객체를 던지는 차이를 모른다.
- `catch`가 어떤 함수 깊이의 오류까지 받을 수 있는지 놓친다.
- 모든 오류를 잡고 조용히 무시한다.

**시각화 방식**

- Error 객체가 생성되어 Call Stack을 거슬러 적합한 `catch`로 이동하는 모습을 보여준다.
- 정상/오류 경로에서 `finally` 실행 시점을 비교한다.

**인터랙션 방식**

- Call Stack에서 오류를 처리할 위치를 선택한다.
- 잘못된 값과 범위 밖 값에 서로 다른 Error 타입·메시지를 설계한다.

**예제 아이디어**

- 숫자 아닌 measurement 거부
- 필수 Wafer ID가 없는 레코드 검증
- 비동기 오류 학습 전 동기 오류 경로 익히기

### J19. Module

**학습목표**

- `export`와 `import`로 파일 사이에 이름을 공유한다.
- named export와 default export의 기본 차이를 이해한다.

**핵심 문법**

```javascript
// validators.js
export function isValid(value) {
  return value >= 0 && value <= 200;
}

// main.js
import { isValid } from "./validators.js";
console.log(isValid(94.2));
```

**초보자가 자주 헷갈리는 부분**

- 파일 경로와 export 이름을 혼동한다.
- named/default import의 중괄호 차이를 외우기만 한다.
- 순환 의존성이나 모듈의 한 번 평가되는 특성을 예상하지 못한다.

**시각화 방식**

- 파일을 노드로, import를 방향 간선으로 표시하고 실제로 연결되는 이름을 강조한다.
- export table과 현재 모듈 Scope의 import binding을 나란히 보여준다.

**인터랙션 방식**

- export 형태에 맞는 import 문을 조립한다.
- 순환 연결이 생기면 의존 그래프에서 경고를 확인한다.

**예제 아이디어**

- 검증·집계 함수를 별도 모듈로 분리
- 상·하한 상수를 설정 모듈에서 export
- Python import 방식과 짝지어 비교

### J20. Class와 객체 메서드

**학습목표**

- Class로 인스턴스를 만들고 constructor, 속성, 메서드를 사용한다.
- 메서드 호출에서 `this`가 결정되는 기본 원리를 이해한다.

**핵심 문법**

```javascript
class Wafer {
  constructor(id, measurement) {
    this.id = id;
    this.measurement = measurement;
  }

  isInRange(lower, upper) {
    return this.measurement >= lower && this.measurement <= upper;
  }
}

const wafer = new Wafer("W01", 94.2);
```

**초보자가 자주 헷갈리는 부분**

- `new` 없이 Class를 호출하려 한다.
- `this`를 Class 자체나 항상 같은 객체로 생각한다.
- 메서드를 떼어 전달하면 호출 문맥이 달라질 수 있음을 모른다.
- Python의 `self`와 JavaScript의 `this`를 완전히 같다고 생각한다.

**시각화 방식**

- `new` 실행 시 빈 객체 생성→prototype 연결→constructor 호출→객체 반환을 상세도에 따라 보여준다.
- `wafer.isInRange()` 호출에서 점 왼쪽 객체가 `this`로 연결되는 모습을 표시한다.

**인터랙션 방식**

- 메서드 호출 형태를 바꾸고 `this` 연결을 예측한다.
- Python Class 인스턴스와 생성·메서드 호출 흐름을 비교한다.

**예제 아이디어**

- 가상 Wafer 객체 판정
- Equipment 객체의 상태 업데이트 메서드
- 여러 인스턴스의 독립된 속성 확인

### J21. Promise

**학습목표**

- Promise의 pending, fulfilled, rejected 상태를 설명한다.
- `.then()`, `.catch()`, `.finally()`의 연결 흐름을 이해한다.

**핵심 문법**

```javascript
const loadMeasurements = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve([94.2, 101.3, 96.0]), 500);
  });

loadMeasurements()
  .then((values) => values.filter((value) => value <= 100.0))
  .then((passed) => console.log(passed))
  .catch((error) => console.log(error.message));
```

**초보자가 자주 헷갈리는 부분**

- Promise 객체를 완료된 데이터로 생각한다.
- `.then()`이 원래 Promise를 변경한다고 생각한다.
- `.then()`에서 값을 반환하지 않아 다음 단계에 `undefined`가 전달된다.
- 오류가 어느 `.catch()`로 가는지 이해하기 어렵다.

**시각화 방식**

- Promise 카드를 상태 머신으로 표시하고 각각의 `.then()`이 새 Promise를 만드는 체인을 보여준다.
- 대기 작업과 동기 코드의 실행을 두 레인의 타임라인으로 보여준다.
- 값과 오류가 체인을 따라 이동하는 경로를 구분한다.

**인터랙션 방식**

- 가상 로더의 성공/실패/지연을 전환한다.
- 체인의 각 단계에 전달되는 값을 먼저 채운 뒤 실행한다.

**예제 아이디어**

- 가상 measurement 데이터 지연 로딩
- 로딩→필터→요약 Promise 체인
- 실패 시 사용자용 오류 메시지 생성

### J22. `async` / `await`

**학습목표**

- `async` 함수가 Promise를 반환하고 `await`가 해당 함수의 진행을 일시 정지함을 이해한다.
- `try...catch`로 비동기 오류를 처리한다.

**핵심 문법**

```javascript
async function buildSummary() {
  try {
    const values = await loadMeasurements();
    const valid = values.filter(Number.isFinite);
    return { count: valid.length };
  } catch (error) {
    return { count: 0, error: error.message };
  }
}
```

**초보자가 자주 헷갈리는 부분**

- `await`가 전체 프로그램을 멈춘다고 생각한다.
- `await` 없이 Promise 값을 일반 데이터처럼 사용한다.
- `async` 함수의 `return`이 일반 값처럼 보여도 Promise로 감싸짐을 놓친다.
- 독립 작업을 무조건 순차 `await`해 불필요하게 기다린다.

**시각화 방식**

- 동기 Call Stack과 가상 작업 대기 영역을 분리한다.
- `await`에서 해당 함수 프레임이 대기 상태가 되고, Promise 완료 후 다음 줄로 재개되는 흐름을 보여준다.
- 순차 실행과 `Promise.all` 병렬 대기의 총 타임라인을 비교한다.

**인터랙션 방식**

- 이벤트 카드를 `호출→대기→다른 코드→완료→재개` 순서로 배열한다.
- `await` 위치를 바꿔 Promise 객체와 실제 데이터의 차이를 확인한다.

**예제 아이디어**

- 가상 Lot measurement를 불러와 요약
- 두 Equipment의 가상 데이터를 순차/동시에 로딩
- 실패한 로딩을 `try...catch`로 복구

### J23. JavaScript 종합 실습 — 비동기 Measurement 요약기

**학습목표**

- 비동기 로딩, JSON, 변환, 필터, 집계, 오류 처리를 하나의 흐름으로 연결한다.
- 함수별 입력·출력과 Promise 경계를 설명한다.

**핵심 문법**

```javascript
function summarize(rows, lower = 90.0, upper = 100.0) {
  const values = rows
    .map((row) => Number(row.measurement))
    .filter(Number.isFinite);

  const passed = values.filter(
    (value) => value >= lower && value <= upper,
  );

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    validCount: values.length,
    passCount: passed.length,
    average: values.length > 0 ? total / values.length : null,
  };
}

async function loadAndSummarize() {
  try {
    const jsonText = await loadVirtualData();
    return summarize(JSON.parse(jsonText));
  } catch (error) {
    return { validCount: 0, passCount: 0, average: null, error: error.message };
  }
}
```

**초보자가 자주 헷갈리는 부분**

- Promise, JSON 문자열, Array가 어느 단계에 있는지 구분하지 못한다.
- 메서드 체인에서 데이터 형태가 어떻게 바뀌는지 놓친다.
- 빈 Array 평균과 파싱 실패 경로를 누락한다.
- `async` 함수 결과를 `await`하지 않고 바로 속성 접근한다.

**시각화 방식**

- `Promise → JSON text → Array<Object> → Array<Number> → 요약 Object` 형태 변화를 파이프라인으로 보여준다.
- 한 레코드를 선택하면 `map`, `filter`, `reduce` 각 단계의 값을 추적한다.
- 성공과 로딩 실패, JSON 파싱 실패를 분기 타임라인으로 제공한다.

**인터랙션 방식**

- 처리 블록을 올바른 순서로 조립한다.
- 가상 응답 지연, 실패, 잘못된 JSON을 토글한다.
- 숨은 테스트에서 빈 입력, 누락값, 경계값, 숫자 문자열을 처리한다.

**예제 아이디어**

- Lot별 유효값·PASS 수·평균 비동기 요약
- 검토 대상 Wafer 목록 생성
- Python 종합 실습과 같은 데이터로 결과 일치 확인

---

## 6. Python ↔ JavaScript 비교 학습

### 6.1 비교 학습의 운영 원칙

- 같은 개념을 같은 가상 데이터와 같은 결과로 보여준다.
- 문법 차이뿐 아니라 실행 모델 차이도 보여준다.
- 한 언어를 다른 언어의 규칙으로 해석하지 않도록 `같은 점`, `다른 점`, `주의할 점`을 고정 영역으로 둔다.
- JavaScript 레슨을 시작할 때 이미 배운 Python 개념을 30초 요약 카드로 불러온다.
- 비교 화면에서 두 코드를 동시에 자동 실행하지 않는다. 한쪽을 Step 실행하면 상대 코드의 대응 줄만 강조한다.

### 6.2 핵심 개념 대응표

| 개념 | Python | JavaScript | 학습 포인트 |
|---|---|---|---|
| 출력 | `print(value)` | `console.log(value)` | 둘 다 화면 확인용이며 일반적인 값 반환과 다르다. |
| 주석 | `# text` | `// text`, `/* text */` | 실행되지 않는 설명이다. |
| 변수 선언 | `name = "W01"` | `const name = "W01"` | Python은 별도 선언 키워드가 없고 JS는 `const`/`let`을 선택한다. |
| 없음 | `None` | `null`, `undefined` | JS는 의도적 없음과 미정 상태를 구분할 수 있다. |
| 숫자 | `int`, `float` | `Number` | JS의 일반 Number는 정수·실수를 함께 표현한다. |
| 문자열 포매팅 | `f"{id}: {value}"` | `` `${id}: ${value}` `` | Python은 f-prefix, JS는 backtick과 `${}`를 쓴다. |
| 길이 | `len(items)` | `items.length` | 함수 호출과 속성 접근 차이다. |
| List/Array | `items = []` | `const items = []` | 둘 다 순서와 인덱스가 있으나 메서드 이름과 동작이 다르다. |
| Tuple | `(90, 100)` | 직접 대응 없음 | JS에서는 관례상 Array 또는 Object를 사용한다. |
| Dictionary/Object | `{"id": "W01"}` | `{ id: "W01" }` | 비슷해 보이지만 언어 모델과 키 규칙이 완전히 같지는 않다. |
| Set | `{1, 2}`, `set()` | `new Set([1, 2])` | 중복 제거와 집합 개념은 같다. |
| 비교 | `==` | `===` 권장 | JS의 `==`는 타입 변환이 있어 초보 과정에서는 `===`를 기본으로 한다. |
| 논리 | `and`, `or`, `not` | `&&`, `||`, `!` | JS에서는 피연산자 반환과 truthy/falsy도 주의한다. |
| 조건 | `if x > 0:` | `if (x > 0) {}` | Python은 들여쓰기, JS는 중괄호로 블록을 만든다. |
| 값 순회 | `for item in items:` | `for (const item of items) {}` | 둘 다 원소 자체를 받는다. |
| 숫자 범위 | `for i in range(5):` | `for (let i = 0; i < 5; i += 1)` | JS에는 동일한 내장 `range`가 없다. |
| 함수 | `def check(x):` | `function check(x) {}` | 호출·매개변수·반환 개념은 같다. |
| 짧은 함수 | `lambda x: x * 2` | `(x) => x * 2` | Python lambda는 제한적이며 JS arrow는 `this`도 다르다. |
| 반환 | `return value` | `return value;` | 함수 종료와 값 반환은 같다. |
| 기본 매개변수 | `def f(x=1):` | `function f(x = 1) {}` | 기본 개념은 유사하다. |
| 지역 Scope | 함수, Class, Module 등 | 함수와 `{}` 블록 등 | Python과 JS의 블록 Scope가 다르다. |
| Comprehension | `[f(x) for x in xs]` | `xs.map(f)` | 변환 사고는 같고 표현 방식이 다르다. |
| 필터 | `[x for x in xs if p(x)]` | `xs.filter(p)` | 입력 원소의 선택 과정은 같다. |
| 집계 | `sum(xs)` 또는 반복문 | `xs.reduce(...)` | 단순 합계는 Python 내장 함수가 더 직접적이다. |
| 예외 | `try/except/finally` | `try/catch/finally` | 발생·전파·처리 사고는 같다. |
| 모듈 | `from x import y` | `import { y } from "./x.js"` | 파일 탐색과 export 규칙은 다르다. |
| Class 인스턴스 | `Wafer(...)` | `new Wafer(...)` | JS는 `new`를 사용한다. |
| 인스턴스 참조 | `self`를 명시적 매개변수로 정의 | 호출 문맥의 `this` | 비슷하게 보이지만 결정 방식이 다르다. |
| JSON | `json.loads(text)` | `JSON.parse(text)` | JSON 표준 형식은 같고 API만 다르다. |
| 비동기 | 1차 범위 밖 | `Promise`, `async/await` | 이번 과정에서는 JS의 핵심 응용 문법으로만 다룬다. |

### 6.3 같은 문제, 나란히 보기

#### 조건과 함수

```python
def is_in_range(value, lower=90.0, upper=100.0):
    return lower <= value <= upper

passed = is_in_range(94.2)
```

```javascript
function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

const passed = isInRange(94.2);
```

같은 점:

- 호출 시 새 함수 프레임이 생긴다.
- `94.2`, `90.0`, `100.0`이 각각 매개변수에 연결된다.
- 조건식 결과가 호출 위치로 돌아가 `passed`에 저장된다.

다른 점:

- Python은 연속 비교를 지원하지만 JavaScript에서는 두 비교를 `&&`로 결합한다.
- Python은 들여쓰기로, JavaScript는 중괄호로 함수 블록을 표현한다.

#### 변환과 필터

```python
values = [94.2, 101.3, 96.0]
passed = [value for value in values if value <= 100.0]
labels = [f"{value:.1f}" for value in passed]
```

```javascript
const values = [94.2, 101.3, 96.0];
const passed = values.filter((value) => value <= 100.0);
const labels = passed.map((value) => value.toFixed(1));
```

시각화는 두 언어 모두 `입력→조건 필터→표현 변환→출력` 파이프라인을 공유한다. 다만 Python comprehension은 문장 하나 안에서 필터와 변환을 읽고, JavaScript는 메서드 체인의 단계별 중간 Array를 보여준다.

#### 예외 처리

```python
try:
    value = float(raw_value)
except ValueError as error:
    value = None
finally:
    print("done")
```

```javascript
try {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) throw new TypeError("invalid value");
} catch (error) {
  console.log(error.message);
} finally {
  console.log("done");
}
```

주의할 점: Python의 `float("N/A")`는 예외를 발생시키지만 JavaScript의 `Number("N/A")`는 `NaN`을 만든다. 따라서 두 코드가 겉보기에는 비슷해도 오류 이벤트는 다르게 발생한다.

### 6.4 자주 발생하는 언어 간 전이 오류

| Python에서 생긴 습관 | JavaScript에서의 문제 | 교정 인터랙션 |
|---|---|---|
| `and`, `or`, `not` 사용 | JS 문법 오류 | 대응 연산자 카드를 교체하고 조건 트리를 재실행한다. |
| `for item in items` 사용 | JS 문법 오류 또는 `for...in` 오용 | `for...of`와 인덱스 루프 중 의도에 맞는 것을 선택한다. |
| `len(items)` 사용 | 함수가 존재하지 않음 | Array 객체에서 `length` 속성을 찾아 연결한다. |
| 음수 인덱스 `items[-1]` 사용 | 일반 대괄호 접근은 `undefined` | `items.at(-1)` 또는 `items[items.length - 1]`로 바꾼다. |
| Dictionary와 Object를 완전 동일시 | prototype, 동적 키, 메서드에서 혼란 | 공통 부분과 JS 고유 동작을 메모리 그림으로 비교한다. |
| `==`을 그대로 사용 | 타입 강제 변환으로 의외의 참 | `==`와 `===` 평가 과정을 나란히 재생한다. |
| Python 함수 Scope만 기억 | JS 블록 Scope 누락 | `{}` 진입·종료 시 `let` 변수 생성·삭제를 보여준다. |
| `self`를 `this`로 단순 치환 | `this` 호출 문맥 오류 | 호출 표현식에서 `this`가 결정되는 선을 직접 고른다. |
| `None`을 `undefined` 하나로 치환 | 의도적 없음/미정 상태 혼동 | `null`과 `undefined` 시나리오를 분류한다. |
| List comprehension 기대 | JS 메서드 체인 흐름 누락 | `filter`/`map`의 중간 Array를 직접 채운다. |

### 6.5 비교 체크포인트

#### 체크포인트 A — 값, 조건, 반복, 함수

- 같은 가상 measurement 판정기를 두 언어로 완성한다.
- 각 코드에서 다음 실행 줄과 현재 Scope를 맞힌다.
- 경계값이 두 언어에서 같은 결과를 만드는지 확인한다.

#### 체크포인트 B — 컬렉션과 데이터 변환

- Python List/Dictionary와 JavaScript Array/Object의 구조를 연결한다.
- Python comprehension을 JavaScript `filter`+`map`으로 바꾼다.
- 얕은 복사와 참조 공유가 발생하는 예제를 두 언어에서 추적한다.

#### 체크포인트 C — 오류, 모듈, 종합 흐름

- 문자열 measurement를 안전하게 숫자로 바꾸는 로직을 두 언어로 작성한다.
- import/export 흐름에서 이름이 어느 파일로 이동하는지 표시한다.
- 동일한 가상 입력으로 두 종합 실습의 최종 요약이 같은지 검증한다.

---

## 7. 가상 제조·반도체 예제 데이터 기준

### 7.1 데이터 설계 원칙

- 실제 회사, 팹, 공정, 제품, 장비 모델, 관리 한계, 수율 값을 추정할 수 없게 한다.
- 식별자는 `LOT-A01`, `W01`, `EQ-01`처럼 일반적인 교육용 패턴만 사용한다.
- `measurement`는 의미가 특정되지 않은 무단위 교육값으로 사용한다.
- 숫자 범위 `90.0~100.0`은 문법 교육을 위한 임의 범위이며 실제 판정 기준이 아님을 데이터 화면에 표시한다.
- 레코드는 일반적으로 3~8개, 반복 시각화용 최대 12개를 사용한다.
- 정상, 경계, 범위 이탈, 누락, 숫자 문자열, 잘못된 문자열을 의도적으로 포함한다.

### 7.2 표준 가상 데이터셋

```json
[
  { "lot": "LOT-A01", "wafer": "W01", "equipment": "EQ-01", "measurement": "94.2" },
  { "lot": "LOT-A01", "wafer": "W02", "equipment": "EQ-01", "measurement": "101.3" },
  { "lot": "LOT-A01", "wafer": "W03", "equipment": "EQ-02", "measurement": "96.0" },
  { "lot": "LOT-B02", "wafer": "W01", "equipment": "EQ-02", "measurement": "90.0" },
  { "lot": "LOT-B02", "wafer": "W02", "equipment": "EQ-03", "measurement": null },
  { "lot": "LOT-B02", "wafer": "W03", "equipment": "EQ-03", "measurement": "N/A" },
  { "lot": "LOT-C03", "wafer": "W01", "equipment": "EQ-01", "measurement": "100.0" },
  { "lot": "LOT-C03", "wafer": "W02", "equipment": "EQ-02", "measurement": "88.7" }
]
```

### 7.3 예제 난이도 확장 규칙

| 단계 | 데이터 형태 | 새로 추가할 문제 |
|---|---|---|
| 1 | 숫자 1개 | 값 저장, 계산, 비교 |
| 2 | 숫자 List/Array | 반복, 필터, 합계 |
| 3 | Wafer Object/Dictionary 1개 | 키·속성 접근, 구조 분해 |
| 4 | 레코드 목록 | 중첩 접근, 변환, 정렬, 집계 |
| 5 | CSV/JSON 문자열 | 파싱, 타입 변환, 오류 처리 |
| 6 | 가상 비동기 응답 | Promise, await, 실패 복구 |

### 7.4 피해야 할 예제

- 특정 실제 공정 단계, 레시피, 장비 제어 또는 인터록 로직
- 실존하는 회사·제품·FAB·장비 식별자
- 실제 품질 판정, 관리 한계, 결함 분류 또는 수율 개선을 암시하는 수치
- 업무망 파일 경로, 내부 API, 데이터베이스 스키마, 계정 정보
- 교육 범위를 넘어 실제 생산 의사결정을 자동화하는 코드

---

## 8. 미니 실습 구성

각 실습은 단순 버전과 도전 버전을 제공하며, 동일 데이터로 Python과 JavaScript 변형을 만들 수 있다.

| ID | 실습 | 사용 문법 | 시각화 핵심 | 완료 결과 |
|---|---|---|---|---|
| M01 | Wafer ID 포매터 | 문자열, 함수 | 슬라이스와 값 삽입 | `LOT-A01/W01` 형태 라벨 |
| M02 | Measurement 범위 판정기 | 비교, 조건, 함수 | 조건 평가 트리 | LOW/PASS/HIGH 분류 |
| M03 | 유효 데이터 필터 | 반복 또는 comprehension/filter | 입력→판정→결과 파이프라인 | 유효 숫자 목록 |
| M04 | 첫 경고 검색 | 반복, break 또는 find | 단축 탐색 타임라인 | 첫 상한 초과 레코드 |
| M05 | Lot별 개수 집계 | Dictionary/Object, 반복/reduce | 키별 누적 메모리 | Lot→레코드 수 요약 |
| M06 | Equipment 중복 제거 | Set | 중복 합쳐짐 | 고유 Equipment 목록 |
| M07 | Measurement 순위 | 정렬, key/콜백 | 정렬 키 추출 | 검토 우선 목록 |
| M08 | 가상 CSV 정리 | 파일, CSV, 예외 | 행 변환·제외 사유 | 정리된 레코드와 오류 목록 |
| M09 | JSON 요약 내보내기 | JSON, 함수 | Object↔JSON 트리 | Lot 요약 JSON |
| M10 | 비동기 데이터 요약 | Promise, async/await | 대기·재개 타임라인 | 성공/실패 요약 Object |

### 8.1 실습 공통 상태

- `준비`: 요구사항과 입출력 예시를 읽는다.
- `예측`: 샘플 입력의 결과 또는 실행 흐름을 답한다.
- `작성`: 부분 완성 코드 또는 빈 편집기에서 해결한다.
- `추적`: 실패한 테스트를 Step 실행으로 재현한다.
- `검증`: 공개 테스트와 숨은 경계 테스트를 통과한다.
- `회고`: 사용한 문법, 실수, Python↔JavaScript 차이를 한 줄로 정리한다.

### 8.2 힌트 단계

1. 문제를 다시 설명하는 개념 힌트
2. 관련 변수와 실행 줄을 강조하는 시각 힌트
3. 필요한 문법 형태를 보여주는 구조 힌트
4. 한 줄 또는 한 블록의 부분 정답

정답 전체를 바로 공개하지 않고, 힌트 사용 횟수는 학습 기록에는 남기되 성취를 막지 않는다.

---

## 9. 레슨 페이지 콘텐츠 명세

### 9.1 정보 구조

```text
홈
├─ 시작하기 / 진단
├─ Python
│  ├─ 기초
│  ├─ 흐름 제어
│  ├─ 함수와 데이터 처리
│  ├─ 응용 문법
│  └─ 종합 실습
├─ JavaScript
│  ├─ 기초
│  ├─ 흐름 제어
│  ├─ 함수와 데이터 처리
│  ├─ 응용 문법
│  └─ 종합 실습
├─ Python ↔ JavaScript 비교
├─ 미니 실습
└─ 내 학습
   ├─ 진행률
   ├─ 오답·오류 노트
   └─ 저장한 코드
```

### 9.2 레슨 화면 필수 블록

| 순서 | 블록 | 내용 |
|---:|---|---|
| 1 | 제목과 목표 | 학습목표 2~3개, 예상 시간, 선행 레슨 |
| 2 | 핵심 개념 | 한 문장 정의와 작은 정적 그림 |
| 3 | 기본 예제 | 가장 단순한 코드와 단계 실행 |
| 4 | 실행 해설 | 현재 단계의 의미를 1~2문장으로 표시 |
| 5 | 혼동 방지 | 대표 실수, 오류 재현, 수정 전후 비교 |
| 6 | 직접 조작 | 예측, 값 수정, 빈칸, 순서 배열 중 1개 이상 |
| 7 | 업무형 예제 | 가상 Lot/Wafer/Equipment/measurement 적용 |
| 8 | 언어 비교 | 상대 언어의 동일 개념 3~8줄 코드 |
| 9 | 확인 문제 | 개념 1개, 실행 추적 1개, 코드 수정 1개 |
| 10 | 요약 | `이제 할 수 있는 것`, 다음 레슨 연결 |

### 9.3 단계 설명 문구 규칙

좋은 설명:

> 6번 줄의 `value`는 현재 반복 원소 `101.3`입니다. `value <= 100.0`은 `False`이므로 이 원소는 `passed`에 추가되지 않습니다.

피해야 할 설명:

> 조건문이 실행됩니다. 결과는 False입니다.

모든 단계 문구는 가능하면 아래 네 요소를 포함한다.

```text
[실행 위치] + [사용한 실제 값] + [변경 또는 선택] + [다음 흐름]
```

### 9.4 코드 예제 제작 규칙

- 기본 예제는 화면 스크롤 없이 보이도록 5~12줄을 권장한다.
- 한 예제에서 새 개념은 원칙적으로 1개, 최대 2개다.
- 변수명은 `x`, `data`보다 `wafer_id`, `measurement`, `valid_values`처럼 역할을 드러낸다.
- 실행 시각화가 지나치게 길어지는 입력은 줄이고 전체 횟수는 요약 표시한다.
- 언어별 공식 스타일에 맞게 Python은 snake_case, JavaScript는 camelCase를 사용한다.
- 코드 결과는 항상 동일하게 재현되어야 한다. 임의 값은 seed를 고정하거나 가상 입력으로 대체한다.
- 숨은 부작용을 줄이고, 부작용이 주제라면 변경 대상을 명시한다.

---

## 10. 평가와 학습 피드백

### 10.1 평가 유형

| 평가 | 측정 내용 | 예 |
|---|---|---|
| 개념 확인 | 용어와 문법의 목적 | `return`과 출력의 차이 |
| 코드 읽기 | 최종 출력과 값 | 반복 후 accumulator 값 |
| 흐름 추적 | 다음 줄·호출 순서 | 중첩 반복, 함수 호출 |
| 상태 추적 | 변수·Scope 변화 | 지역 변수 생성·삭제 |
| 오류 진단 | 오류 줄과 원인 | 인덱스 범위, 타입 변환 |
| 코드 완성 | 적절한 문법 선택 | 필터 조건, 예외 처리 |
| 코드 변환 | 두 언어 연결 | comprehension→filter/map |
| 종합 실습 | 요구사항 충족 | measurement 요약기 |

### 10.2 피드백 원칙

- `틀렸습니다` 대신 학습자가 선택한 경로와 실제 실행 경로가 처음 갈라지는 지점을 보여준다.
- 문법 오류는 오류 위치, 기대한 토큰, 올바른 최소 형태를 함께 제공한다.
- 실행 오류는 발생 줄뿐 아니라 관련 변수와 Call Stack 프레임을 강조한다.
- 논리 오류는 예상 상태와 실제 상태를 나란히 보여준다.
- 정답 코드는 결과 확인 후 제공하고, 가능한 경우 학습자 코드의 최소 수정만 먼저 제안한다.
- 같은 실수가 반복되면 관련 레슨의 특정 단계로 바로 돌아가는 링크를 제공한다.

### 10.3 숙련도 판정

| 수준 | 판정 기준 |
|---|---|
| 관찰 | 시각화 도움으로 현재 값과 다음 줄을 식별한다. |
| 설명 | 도움 없이 실행 순서와 값 변화를 말할 수 있다. |
| 수정 | 입력·조건·코드를 바꾸어 원하는 결과를 만든다. |
| 적용 | 새 가상 데이터 문제에 문법을 조합한다. |
| 전이 | 같은 문제를 상대 언어 문법으로 옮긴다. |

진행률은 동영상 시청이나 페이지 방문이 아니라 `예측`, `단계 추적`, `직접 수정`, `확인 문제`의 완료로 계산한다.

---

## 11. 공통 엔진의 기술·콘텐츠 경계

### 11.1 언어 어댑터

공통 UI는 Python과 JavaScript의 실행 결과를 동일 이벤트 포맷으로 받는다.

```text
Python runner ── trace adapter ─┐
                               ├─ common event stream ─ visualization UI
JavaScript runner ─ adapter ───┘
```

공통 처리:

- 현재 줄과 실행 순서
- 변수 생성·수정·삭제
- 함수 진입·반환과 Call Stack
- 조건 분기와 반복 회차
- 컬렉션 원소 읽기·변경
- 출력과 오류

언어별 처리:

- Python: 들여쓰기 블록, `None`, List/Tuple/Dictionary/Set, LEGB, comprehension, Generator
- JavaScript: `let`/`const`, `undefined`/`null`/`NaN`, block scope, Object/Array, callback, Promise, `async`/`await`, `this`

### 11.2 실행 모드

| 모드 | 목적 | 코드 허용 범위 |
|---|---|---|
| Guided trace | 제작자가 검증한 예제를 안정적으로 학습 | 레슨 코드의 지정 부분만 수정 |
| Practice | 과제 해결과 테스트 | 허용된 표준 문법과 가상 파일/API |
| Sandbox | 자유 실험 | 시간·메모리·출력·모듈 제한 안의 일반 코드 |

초기 MVP는 정확한 시각화 품질을 위해 Guided trace와 제한된 Practice를 우선한다. 자유 코드 전체를 완벽히 시각화하는 것은 별도 고난도 과제로 둔다.

### 11.3 상태 저장

- 각 실행은 코드 버전, 입력 데이터, 이벤트 스트림, 최종 출력, 오류를 하나의 세션으로 저장한다.
- 학습자는 최근 성공 버전과 현재 수정 버전을 비교할 수 있다.
- 개인 데이터는 최소화하고 코드·학습 기록의 저장 여부를 알기 쉽게 표시한다.
- 관리자용 분석에는 개인 코드 원문보다 레슨별 오류 유형과 이탈 단계 같은 집계값을 우선한다.

---

## 12. MVP와 단계별 출시 범위

### 12.1 MVP — 핵심 경험 검증

권장 범위는 Python 12개 레슨, JavaScript 10개 레슨, 비교 3개, 미니 실습 4개다.

| 구분 | 포함 |
|---|---|
| Python | P01~P12 |
| JavaScript | J01~J09, J12 |
| 비교 | 변수·타입, 조건·반복, 함수·컬렉션 |
| 실습 | M01~M04 |
| 엔진 | 현재 줄, 변수 패널, Call Stack, 조건·반복 흐름, Output, Prev/Step/Auto/Pause/Reset/속도 |
| 인터랙션 | 결과 예측, 다음 줄 선택, 값 수정, 코드 빈칸 |
| 제외 | 자유 코드 전체 추적, 파일, 모듈, Class, Promise/async, 고급 참조 그래프 |

MVP의 가장 중요한 검증 질문:

1. 학습자가 시각화 후 다음 실행 줄을 더 정확히 예측하는가?
2. 반복 변수와 함수 매개변수의 실제 값을 설명할 수 있는가?
3. Step 수가 많을 때 어느 수준에서 피로를 느끼는가?
4. Code/Flow/State 중 어떤 패널을 가장 자주 보는가?
5. 가상 제조 예제가 이해를 돕고 특정 업무 지식 부담을 만들지는 않는가?

### 12.2 1차 정식 버전

- Python P01~P24 전체
- JavaScript J01~J23 전체
- 비교 체크포인트 A~C
- 미니 실습 M01~M10
- 특수 시각화: 문자열, 컬렉션, 조건, 반복, 함수, Scope, 파일, 오류, Promise
- 오류·오답 노트, 저장 코드, 진행률, 키보드 접근성

### 12.3 후속 확장 후보

현재 범위와 분리해 요구가 확인된 뒤 확장한다.

- 더 많은 알고리즘적 사고 연습
- 테스트 코드 기초
- 정규표현식
- Python 비동기 또는 JavaScript 이벤트 루프 심화
- SQL, 웹, 데이터베이스, API, 배포 트랙
- 강사용 레슨 배정·진행 현황·토론 기능

---

## 13. 콘텐츠 제작 우선순위

### 13.1 시각화 가치가 높은 최우선 레슨

1. P09/J08 반복문
2. P11 중첩 반복문
3. P12/J09 함수·매개변수·반환값
4. P13/J11 Scope
5. P06/P07/J05/J06 컬렉션과 참조
6. P08/J07 조건문
7. J12~J14 `map`/`filter`/`reduce`
8. P19/J18 예외 처리
9. J21/J22 Promise와 `async`/`await`

텍스트 설명만으로도 비교적 이해하기 쉬운 출력·주석보다 위 항목에 프로토타입 및 사용자 테스트 시간을 더 배정한다.

### 13.2 콘텐츠 제작 단위

각 레슨은 다음 묶음으로 관리한다.

```text
lesson metadata
├─ objectives
├─ prerequisite
├─ concept explanation
├─ starter code
├─ virtual input data
├─ expected event trace
├─ step explanations
├─ confusion cases
├─ interactions
├─ exercises and tests
├─ language comparison
└─ accessibility narration
```

### 13.3 레슨 완료 기준

- 학습목표가 관찰 가능한 행동으로 작성되어 있다.
- 정상, 경계, 오류 입력을 포함한다.
- 모든 Step 이벤트와 설명 문구가 코드 실행 결과와 일치한다.
- 변수 변경, 분기, 함수 호출이 시각적으로 추적된다.
- `Prev`, `Reset`, 속도 변경 후 상태가 일관된다.
- 키보드만으로 필수 인터랙션을 완료할 수 있다.
- 애니메이션 감소 모드에서도 같은 정보를 얻을 수 있다.
- Python↔JavaScript 비교가 억지로 일대일 대응시키지 않는다.
- 가상 데이터 정책과 범위 밖 주제를 준수한다.
- 확인 문제와 숨은 테스트가 학습목표를 직접 평가한다.

---

## 14. 품질 검수 기준

### 14.1 문법·실행 정확성

- 예제는 지원 대상 Python/JavaScript 버전에서 실제 실행해 검증한다.
- 출력, 예외 타입, Call Stack, Scope 수명, 컬렉션 변경이 실제 동작과 일치해야 한다.
- JavaScript의 비동기 설명은 브라우저/런타임 내부 세부를 과도하게 단순화해 거짓 설명이 되지 않도록 `교육용 단순 모델`임을 표시한다.
- 구현 세부가 런타임마다 달라지는 경우 핵심 보장과 대표적 동작을 구분한다.

### 14.2 교육 품질

- 설명 없이 시각 효과만 보아도 값의 출처와 도착지를 따라갈 수 있다.
- 애니메이션 없이 텍스트와 상태표만으로도 같은 내용을 이해할 수 있다.
- 한 단계 설명은 현재 줄, 실제 값, 변화, 다음 흐름을 포함한다.
- 정답을 외우는 문제보다 실행을 예측·추적·수정하는 문제가 더 많다.
- 업무형 예제의 도메인 용어가 문법 이해를 방해하지 않는다.

### 14.3 UX 품질

- 기본 예제는 첫 유의미한 상태 변화까지 3회 이하의 조작으로 도달한다.
- 30단계 이상은 구간 건너뛰기 또는 중단점을 제공한다.
- Reset의 범위가 분명하며 학습자 코드가 예고 없이 사라지지 않는다.
- 오류 상태에서도 이전 단계, 코드 수정, 초기화가 가능하다.
- 패널 강조가 너무 많아 현재 초점이 흐려지지 않는다.

### 14.4 가상 데이터·보안 품질

- 실제 사내 정보가 콘텐츠, 로그, 저장 코드, 스크린샷에 포함되지 않는다.
- 외부 네트워크, 로컬 파일, 시스템 명령에 접근할 수 없다.
- 무한 반복과 과도한 메모리·출력을 자동 중단한다.
- 오류 메시지에 서버 경로나 내부 구현 정보가 노출되지 않는다.

---

## 15. 성공 지표

### 15.1 학습 성과

- 레슨 전후 `다음 줄 예측` 정확도 변화
- 반복 변수, 함수 매개변수, 반환값 추적 문제 정답률
- 시각화 도움 없이 유사 문제를 해결하는 전이율
- Python 개념을 JavaScript로 옮기는 비교 문제 정답률
- 동일 오류의 재발 횟수 감소

### 15.2 제품 사용성

- 레슨 완료율과 중도 이탈 단계
- Step/Prev/속도/중단점 사용 분포
- 학습자가 자주 되돌아보는 실행 이벤트
- 힌트 단계별 사용률과 힌트 후 성공률
- 모바일/키보드/애니메이션 감소 모드의 완료율 차이

단순 체류 시간이나 클릭 수는 이해도를 직접 나타내지 않으므로 보조 지표로만 사용한다.

---

## 16. 핵심 예제의 상세 실행 시나리오

아래 예제는 사이트의 대표 데모로 사용한다.

```python
def mul(a, b):
    return a * b

for i in range(0, 3):
    for k in range(0, 3):
        result = mul(i, k)
```

교육 화면에서는 먼저 3×3으로 개념을 익히고, 이후 9×9로 확장한다.

| 단계 | 현재 줄 | Call Stack / Scope | 핵심 변화 | 화면 설명 |
|---:|---:|---|---|---|
| 1 | 1 | global | 함수 `mul` 정의 생성 | 함수 본문은 아직 실행되지 않는다. |
| 2 | 4 | global | `range(0, 3)` 준비 | 반복 값은 0, 1, 2다. 끝값 3은 포함되지 않는다. |
| 3 | 4 | global | `i = 0` | 바깥 반복 첫 회차가 시작된다. |
| 4 | 5 | global | 안쪽 `range(0, 3)` 준비 | `i`는 0으로 고정된 채 `k` 반복을 시작한다. |
| 5 | 5 | global | `k = 0` | 현재 조합은 `(0, 0)`이다. |
| 6 | 6 | global | `mul(i, k)` 호출 준비 | 현재 값으로 치환하면 `mul(0, 0)`이다. |
| 7 | 1 | global→mul#1 | `a = 0`, `b = 0` | 새 함수 프레임에 인수가 매개변수로 연결된다. |
| 8 | 2 | global→mul#1 | `0 * 0 → 0` | 반환할 표현식을 계산한다. |
| 9 | 6 | global | mul#1 제거, `result = 0` | 반환값 0이 호출 위치로 돌아와 저장된다. |
| 10 | 5 | global | `k = 1` | 안쪽 반복 두 번째 회차이며 `i`는 여전히 0이다. |
| 11~14 | 6→1→2→6 | global↔mul#2 | `mul(0, 1) → 0` | 같은 함수지만 새 호출 프레임이다. |
| 15 | 5 | global | `k = 2` | 안쪽 반복 마지막 값이다. |
| 16~19 | 6→1→2→6 | global↔mul#3 | `mul(0, 2) → 0` | 첫 번째 행의 마지막 셀을 채운다. |
| 20 | 5→4 | global | 안쪽 반복 종료, `i = 1` | `k`가 끝난 뒤에야 바깥 반복이 증가한다. |
| 21 | 5 | global | `k = 0`으로 새 안쪽 반복 | 다음 행은 `(1, 0)`부터 시작한다. |

이후 학습자는 다음 세 가지 보기 사이를 전환한다.

```text
Loop track: i와 k의 현재 값 및 반복 회차
Grid view:  (i, k) 방문 순서와 곱셈 결과
Call view:  mul의 인수 전달, 지역 Scope, return
```

대표 확인 문제:

1. `i = 1, k = 2` 다음에 호출되는 인수는 무엇인가?
2. 전체 `mul` 호출 횟수는 몇 회인가?
3. `k = 2` 반복이 끝난 직후 무엇이 먼저 일어나는가?
4. 함수가 종료된 뒤 `a`, `b`는 어디에 있는가?
5. 마지막 `result` 값은 무엇인가?

9×9 확장에서는 81회의 호출을 모두 클릭하게 하지 않는다. 앞의 3회로 규칙을 확인한 뒤 `다음 바깥 회차`, `특정 좌표`, `마지막 호출`로 점프하고, 생략 구간은 집계 타임라인으로 표시한다.

---

## 17. 최종 제안

이 사이트의 차별점은 많은 문법을 담는 데 있지 않다. **현재 줄, 실제 값, Scope, 실행 경로를 하나의 시간축으로 묶어 보여주는 것**이 핵심이다. 따라서 초기 개발은 레슨 수보다 다음 세 장면의 완성도를 우선한다.

1. 반복 변수가 회차마다 바뀌고 중첩 반복이 재시작되는 장면
2. 함수 호출에서 인수가 매개변수로 전달되고 반환값이 돌아오는 장면
3. 조건 또는 오류 때문에 다음 실행 경로가 달라지는 장면

이 세 장면이 자연스럽게 이해되면 같은 공통 엔진을 문자열, 컬렉션, Scope, Array method, Promise까지 확장할 수 있다. 콘텐츠는 Python 24개, JavaScript 23개, 비교 체크포인트 3개, 미니 실습 10개를 1차 정식 범위로 삼고, MVP에서는 시각화 가치가 높은 22개 레슨만 먼저 구현하는 구성이 적절하다.
