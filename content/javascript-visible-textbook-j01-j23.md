# 보이는 JavaScript 교과서

> 코드가 “무슨 뜻인지”를 넘어서, 엔진이 **어느 줄을 읽고, 어떤 값을 만들고, 어디로 이동하고, 무엇을 바꾸는지** 따라가는 현대 JavaScript 입문 과정

---

## 이 교안의 목적

JavaScript는 배우기 전에 이미 써 본 언어인 경우가 많다. 예제를 복사해 붙여 넣으면 동작하고, 동작하니 넘어간다. 그러다 `"1" + 1`이 `"11"`이 되고, `const` 배열에 `push`가 되고, 반복문 안에서 만든 함수가 전부 같은 값을 보는 순간 설명이 막힌다. 문법을 몰라서가 아니라 **실행 중에 무슨 일이 일어나는지**를 본 적이 없어서다.

이 교안은 문법 이름을 외우는 책이 아니다. 다음 질문에 스스로 답할 수 있게 만드는 책이다.

- 지금 실행 중인 줄은 어디인가?
- 이 줄의 오른쪽에서 어떤 값이 먼저 만들어지는가?
- 만들어진 값은 어떤 이름과 연결되는가? 그 연결은 `const`로 고정되는가, 값 자체가 고정되는가?
- 조건이 참인가 거짓인가? Boolean이 아닌 값은 어떤 규칙으로 참·거짓이 되는가?
- 반복할 때 무엇은 유지되고 무엇은 매번 바뀌는가?
- 함수를 호출하면 값이 어느 작업 공간으로 이동하고, `return` 뒤에는 어디로 돌아오는가?
- 함수를 **값으로** 넘기면 그 함수는 누가, 언제, 몇 번 부르는가?
- 지금 이 코드는 지금 도는가, 나중에 도는가?

예제는 현대 JavaScript(ES2015 이후)를 사용한다. 제조·반도체 엔지니어에게 익숙할 수 있는 가상의 Lot, Wafer, Equipment, measurement를 사용하지만 특정 회사의 실제 데이터나 시스템은 전혀 가정하지 않는다.

## 권장 사용법: 예측 → Step → 관찰 → 수정 → 재실행

1. **예측한다.** 실행 버튼을 누르기 전에 출력과 변수 값을 종이나 머릿속에 적는다. 틀린 예측은 실패가 아니라 현재의 mental model을 보여주는 좋은 자료다.
2. **Step으로 한 사건씩 본다.** 한 Step은 대개 “표현식 평가”, “이름에 값 연결”, “조건 검사”, “출력”, “분기 이동”, “함수 프레임 생성” 같은 한 사건을 뜻한다.
3. **변화를 관찰한다.** 현재 줄만 보지 말고 Memory, Output, Call Stack, Scope, 객체 패널 가운데 무엇이 바뀌었는지 찾는다.
4. **한 가지만 수정한다.** 숫자 하나, 조건 하나, `let`을 `const`로 하나만 바꾸고 결과를 다시 예측한다.
5. **재실행해 규칙을 확인한다.** 예제 하나의 결과를 외우지 말고, 입력이 바뀌어도 같은 규칙으로 설명되는지 확인한다.

코드를 따라갈 때에는 다음 형식을 메모로 써도 좋다.

```text
현재 줄:
읽은 값:
새로 만든 값:
바뀐 이름/객체:
조건 결과:
다음 줄:
출력:
```

## 사이트 공통 시각 언어

색상은 테마에 따라 달라질 수 있으므로 색 자체보다 **표시의 의미**를 기억한다.

| 표시 | 의미 |
|---|---|
| 현재 실행 줄 | 지금 엔진이 처리하려는 문장. 아직 실행 전인지, 방금 실행 후인지 Step 라벨로 구분한다. |
| 읽는 값 표시 | 표현식이 이름이나 객체에서 값을 가져오는 순간. 원본이 사라지는 것이 아니라 계산에 사용된다. |
| 값 이동 화살표 | 인수에서 매개변수로, 표현식 결과에서 이름으로, 반환값에서 호출 위치로 값의 관계가 이어짐을 뜻한다. |
| 변경 전/후 표시 | 재할당 또는 객체 내부 변경으로 관찰 가능한 상태가 달라졌음을 뜻한다. |
| 건너뛴 코드 | 조건이 맞지 않거나 `break`·`continue`·`return` 때문에 이번 경로에서 실행되지 않는다. 삭제된 코드는 아니다. |
| Memory 이름 카드 | 현재 scope에서 사용할 수 있는 이름과 그 이름이 가리키는 값/객체를 보여준다. |
| 참조 연결선 | 이름이 객체를 가리키는 관계. 두 이름이 같은 Array를 가리킬 수도 있다. |
| 객체 슬롯 | Array의 인덱스, Object의 키-값처럼 객체 내부 구성을 보여준다. |
| Scope 카드 | 같은 철자의 이름이라도 어느 범위의 이름인지 구분한다. |
| Call Stack 프레임 생성/삭제 | 함수 호출 시 지역 작업 공간이 생기고, 반환 시 사라지는 흐름을 뜻한다. |
| 출력 패널 추가 | `console.log()`가 콘솔에 텍스트를 보낸 사건. 변수 저장이나 함수 반환과는 별개다. |
| 오류 경로 | 현재 문장을 정상 완료하지 못해 가장 가까운 `catch`를 찾는 이동이다. |
| 대기 표식 | Promise가 아직 결과를 정하지 못했거나, `await`에서 실행을 잠시 내려놓은 상태다. |

> **정확한 비유 사용법**
> 초반에는 변수를 “상자”라고 부르면 편할 때가 있다. 그러나 JavaScript에서는 이름과 값의 연결로 생각하는 편이 더 오래 정확하다. `const a = wafer`는 데이터를 복사해 `a`라는 상자에 넣는다는 뜻이 아니라, 지금 만들어진 객체를 `a`라는 이름으로 가리키게 한다는 뜻이다. `const`가 고정하는 것은 **그 연결**이지 객체의 내용이 아니다. J02에서 기초를 만들고 J06에서 두 이름이 같은 객체를 가리키는 경우까지 확장한다.

## JavaScript 전체 학습 지도

| 단계 | 레슨 | 핵심 질문 |
|---|---|---|
| 첫 코드 | J01 출력과 주석 | 코드는 어디서 실행되고 값은 어디에 나타나는가? |
| 값 | J02 let, const, 기본 타입 | 이름과 값의 연결에서 무엇이 고정되는가? |
| 값 | J03 연산자와 타입 변환 | 왜 `"1" + 1`은 `"11"`인가? |
| 값 | J04 문자열과 Template Literal | 텍스트를 어떻게 만들고 값과 조합하는가? |
| 데이터 | J05 Array | 여러 값을 순서대로 묶고, 원본 변경 여부를 어떻게 구분하는가? |
| 데이터 | J06 Object와 참조 | 이름을 복사한 것인가, 대상을 복사한 것인가? |
| 흐름 | J07 조건문과 truthy | Boolean이 아닌 값이 어떻게 참·거짓이 되는가? |
| 흐름 | J08 for, while, for...of | 세는 반복과 값을 꺼내는 반복은 어떻게 다른가? |
| 구조화 | J09 함수 | 코드를 호출 가능한 작업 단위로 묶고 값을 돌려받는 방법은? |
| 구조화 | J10 Arrow Function | 함수가 값이라는 말은 화면에서 무엇으로 보이는가? |
| 구조화 | J11 Scope와 Closure | 함수가 사라진 뒤에도 남아 있는 값은 무엇인가? |
| 처리 | J12 map | 원본을 두고 새 Array를 만든다는 것은 무슨 뜻인가? |
| 처리 | J13 filter와 find | 고르는 일과 찾는 일은 무엇이 다른가? |
| 처리 | J14 reduce | 여러 값이 하나가 되는 과정은 어떤 순서인가? |
| 처리 | J15 구조 분해 할당 | 묶인 값에서 필요한 것만 어떻게 꺼내는가? |
| 처리 | J16 Spread와 Rest | 펼치는 `...`과 모으는 `...`은 어떻게 구분하는가? |
| 경계 | J17 JSON | 텍스트가 JavaScript 값이 되는 경계는 어디인가? |
| 경계 | J18 오류와 try/catch | 실패할 수 있는 경로를 어떻게 드러내고 처리하는가? |
| 구조화 | J19 Module | 여러 파일에 코드를 나누고 이름을 가져오는 방법은? |
| 모델링 | J20 Class | 같은 구조와 동작을 가진 여러 대상을 어떻게 표현하는가? |
| 비동기 | J21 Promise | 아직 없는 결과를 값처럼 다루는 방법은? |
| 비동기 | J22 async / await | 기다리는 코드는 왜 멈춰 있지 않은가? |
| 종합 | J23 비동기 Measurement 요약기 | 수집·정제·판정·집계·보고를 어떻게 연결하는가? |

## 문서 목차

- **1부 — 값과 기본 데이터**: J01 출력과 주석 · J02 let, const, 기본 타입 · J03 연산자, 타입 변환, 엄격한 동등성 · J04 문자열과 Template Literal · J05 Array · J06 Object와 참조
- **2부 — 실행 흐름**: J07 조건문과 조건 표현식 · J08 for, while, for...of
- **3부 — 함수와 데이터 처리**: J09 함수, 매개변수, 반환값 · J10 Arrow Function · J11 Scope, Shadowing, Closure · J12 map · J13 filter와 find · J14 reduce · J15 구조 분해 할당 · J16 Spread와 Rest
- **4부 — 프로그램 경계와 구조**: J17 JSON · J18 오류와 try...catch...finally · J19 Module · J20 Class와 객체 메서드 · J21 Promise · J22 async / await
- **5부 — 종합**: J23 비동기 Measurement 요약기 · J01~J23 개념 연결 지도 · Python 트랙과 나란히 읽기

---

# J01. 출력과 주석

## 1. 레슨 한 줄 질문

**JavaScript는 코드를 어떤 순서로 실행하며, 프로그램이 만든 값을 어디에서 확인할까?**

## 2. 왜 필요한가 / 현실 상황

JavaScript로 계산한 값은 저절로 보이지 않는다. 웹 페이지에서 돌든 Node에서 돌든, 값을 확인하려면 관찰할 통로가 필요하다. 입문 단계에서 가장 단순한 통로가 `console.log()`다.

주석은 반대로 엔진이 실행하지 않는 메모다. 코드가 “무엇을 하는지”를 그대로 번역하기보다, 단위나 판단 근거처럼 코드만으로 놓치기 쉬운 정보를 남긴다.

## 3. 학습 목표

- 위에서 아래로 실행되는 기본 순서를 설명할 수 있다.
- `console.log()`로 문자열과 여러 값을 출력할 수 있다.
- 출력과 값 저장이 서로 다른 사건임을 구분할 수 있다.
- 한 줄 주석과 여러 줄 주석을 적절히 사용할 수 있다.

## 4. 핵심 용어

- **문장(statement)**: 엔진이 수행할 한 단위의 지시다. 보통 세미콜론으로 끝난다.
- **객체(object)**: 이름 붙은 값과 기능을 모아 둔 것이다. `console`이 그중 하나다.
- **메서드(method)**: 객체에 붙어 있는 함수다. `console.log`의 `log`가 그것이다.
- **호출(call)**: 이름 뒤에 괄호를 붙여 그 기능을 실행하는 것이다.
- **인수(argument)**: 괄호 안에 전달하는 값이다.
- **주석(comment)**: `//` 뒤 또는 `/* */` 사이에 적으며 실행에서 제외되는 설명이다.

## 5. Mental Model

처음에는 실행 위치를 책갈피라고 생각하자. 엔진은 파일의 첫 실행 문장에 책갈피를 놓고, 문장을 완료하면 보통 다음 실행 문장으로 이동한다.

```text
코드                                 출력

▶ console.log("START")   ─────→     START
  // 준비 완료                       (아무 변화 없음)
  console.log("END")
```

`console.log()`는 출력 패널에 내용을 추가하지만, 그 내용을 자동으로 변수에 보관하지는 않는다. 주석에서는 책갈피가 멈추지 않는다.

`console`은 마법 낱말이 아니라 **객체**이고 `log`는 그 객체의 **메서드**다. 점은 “이 객체 안에서 이 이름을 찾아라”라는 뜻이다.

```text
console ─── .log ───→ 콘솔에 한 줄 추가
   │
   └── .warn, .error 도 같은 자리에 있다
```

## 6. 핵심 문법 상세 해설

```javascript
console.log("Hello, JavaScript!");
console.log("Lot", "L01");
console.log("count =", 3);
```

첫 줄은 문자열 하나를 전달한다. 둘째 줄처럼 쉼표로 여러 값을 전달하면 `console.log()`는 값 사이에 공백을 넣는다. 문자열과 숫자를 미리 같은 타입으로 바꾸지 않아도 출력할 수 있다.

```text
Hello, JavaScript!
Lot L01
count = 3
```

출력에서 문자열의 따옴표는 보이지 않는다. 값을 **그대로 보여 주는 것**이 아니라 사람이 읽을 형태로 보여 주기 때문이다. 다만 Array나 Object 안에 든 문자열은 구분을 위해 따옴표를 붙여 보여 준다.

```javascript
console.log("W01");
console.log(["W01", "W02"]);
```

```text
W01
[ 'W01', 'W02' ]
```

주석은 두 가지다.

```javascript
// 이 줄의 나머지는 실행되지 않는다.
console.log(12.5); // 확인용 출력

/* 여러 줄에 걸친 설명을 적을 수 있다.
   측정값의 단위는 가상의 nm라고 가정한다. */
```

문자열 안의 `//`는 주석 시작이 아니다.

```javascript
console.log("https://example.test"); // 문자열의 일부인 //는 출력된다.
```

세미콜론은 문장의 끝을 표시한다. JavaScript가 대부분 자동으로 보완해 주지만, 이 과정에서는 일관되게 붙인다. 세미콜론 자체보다 값과 실행 순서를 이해하는 것이 훨씬 중요하다.

## 7. 컴퓨터처럼 코드 읽기

다음 코드를 한 줄씩 읽어 보자.

```javascript
console.log("LOAD");
// data check
console.log("Lot", "L02");
console.log("DONE");
```

1. `console.log("LOAD")`를 만난다. 먼저 `console`이라는 이름을 찾고, 그 안에서 `log`를 찾는다. 문자열 값 `"LOAD"`를 준비해 호출한다. 출력에 `LOAD`가 추가된다.
2. 주석 줄은 실행할 문장이 아니므로 건너간다. “건너간다”는 런타임 사건조차 만들지 않는다는 뜻에 가깝다.
3. `"Lot"`과 `"L02"`를 왼쪽에서 오른쪽으로 인수로 준비하고 호출한다. 두 값 사이에는 공백이 들어간다.
4. 마지막 호출을 실행한다.
5. 파일 끝에 도달하면 프로그램이 끝난다.

## 8. 실행 전 예측 문제

다음 코드의 출력은 몇 줄이며 정확히 무엇일까?

```javascript
const waferId = "W01";
const value = 94.2;
// console.log("이 줄은 실행될까?");
console.log(waferId, value, "nm");
console.log("Lot:", "L01");
```

`waferId`라는 **이름**이 출력에 보이는지, 값만 보이는지도 함께 적는다. 먼저 답을 적은 뒤 다음 절로 이동한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
실행 위치: 1행 실행 전
Output: (비어 있음)
Memory: (이름 없음)
```

**Step 1 — 1행 실행**

- 오른쪽 `"W01"`을 값으로 만든다.
- `waferId`라는 이름을 만들고 그 값과 연결한다.
- 출력은 없다. 값을 보관했을 뿐이다.

**Step 2 — 2행 실행**

- `94.2`를 값으로 만들고 `value`와 연결한다.

**Step 3 — 3행**

- 주석이므로 실행 Step을 만들지 않는다. 안쪽에 `console.log`가 적혀 있어도 마찬가지다.

**Step 4 — 4행 실행**

- `waferId`를 읽어 `"W01"`, `value`를 읽어 `94.2`를 얻는다. 세 번째 인수는 리터럴 `"nm"`이다.
- 세 값을 공백으로 이어 출력한다. 이름은 출력되지 않는다.

```text
Output: W01 94.2 nm
```

**Step 5 — 5행 실행**

- 두 리터럴을 출력한다. 콜론은 문자열의 일부다.

**After**

```text
W01 94.2 nm
Lot: L01
```

Memory에는 `waferId`와 `value` 두 이름이 남아 있다. 출력은 그 이름들의 **사본**이 아니라 그때 읽은 값의 흔적이다.

## 10. Visual Script

1. 코드 패널에서 1행을 현재 줄로 표시한다.
2. 오른쪽 문자열이 값으로 만들어지고 왼쪽 이름으로 화살표가 향한다.
3. Memory에 `waferId` 카드가 생긴다. Output은 그대로다.
4. 주석 줄은 흐리게 유지하며 실행 책갈피가 4행으로 직접 이동한다.
5. 4행에서 두 이름 카드가 각각 읽히는 표시가 켜지고, 세 값이 하나의 출력 줄로 합쳐지는 화살표가 Output 패널로 향한다.
6. 이 레슨에서는 “읽었다고 사라지지 않는다”를 강조한다: 읽기 표시가 꺼진 뒤에도 Memory 카드는 그대로다.

## 11. 왜 이렇게 동작하는가

`console.log`는 언어의 문법이 아니라 **환경이 제공하는 객체의 메서드**다. 브라우저와 Node가 각각 자기 콘솔을 제공하므로, 같은 코드가 어디서 도느냐에 따라 출력이 나타나는 장소가 달라진다. 문법이 아니라 객체이기 때문에 `const write = console.log;`처럼 다른 이름에 담을 수도 있다. 이 사실은 J10에서 “함수는 값이다”로 다시 등장한다.

호출은 **부수 효과**를 낼 수도 있고 값을 돌려줄 수도 있다. `console.log()`는 화면에 쓰는 부수 효과만 내고 돌려주는 값은 `undefined`다. 화면에 보이는 것과 다음 계산에 쓸 값을 돌려받는 것은 다른 일이다.

## 12. 자주 하는 오해/실수

### 오해 1: 출력하면 값이 저장된다

- **잘못된 생각**: `console.log(3)`을 했으니 나중에 `3`을 다시 쓸 수 있다.
- **왜 쉬운가**: 화면에 값이 남아 있기 때문이다.
- **실제 동작**: 출력 기록만 생기며 새 이름은 생기지 않는다.
- **확인 코드**:

```javascript
const result = console.log("완료");
console.log(result); // undefined
```

- **수정 방법**: 값을 재사용하려면 이름과 연결한다.

```javascript
const message = "완료";
console.log(message);
console.log(message);
```

### 오해 2: 따옴표가 없으면 그냥 글자다

```javascript
console.log(EQ01); // ReferenceError: EQ01 is not defined
console.log("EQ01"); // EQ01
```

따옴표가 없으면 **이름**이다. 엔진은 그 이름과 연결된 값을 찾다가 없으면 오류를 낸다. 글자 자체를 보여 주려면 따옴표로 감싼다.

### 오해 3: 주석 안의 코드는 “잠깐 꺼 둔” 코드라 언젠가 실행된다

```javascript
console.log("A"); // console.log("B");
```

`//` 뒤는 줄 끝까지 전부 주석이다. 실행하려면 다음 줄로 옮긴다.

## 13. 업무형/엔지니어형 예제

```javascript
console.log("Measurement check");
console.log("Lot:", "L07");
console.log("Equipment:", "EQ-02");
console.log("Status:", "READY");
```

출력:

```text
Measurement check
Lot: L07
Equipment: EQ-02
Status: READY
```

이 예제는 값을 아직 이름에 담지 않았다. 고정 문자열을 차례로 출력했을 뿐이다. 같은 문자열이 네 번 반복되기 시작하면 그때가 J02에서 이름을 만들 시점이다.

## 14. 직접 해보기

아래 코드가 정확히 두 줄을 출력하도록 고쳐라. 첫 줄은 `L03 W02`, 둘째 줄은 `PASS`여야 한다.

```javascript
console.log("L03" "W02");
// console.log("PASS");
```

## 15. 확인 문제

1. **Concept**: `console.log()`와 주석의 실행상 차이를 한 문장씩 설명하라.
2. **Trace**: `console.log("A", 1)`의 출력에 따옴표와 쉼표가 보이는가?
3. **Fix**: 다음 코드가 두 줄을 모두 출력하도록 고쳐라.

```javascript
console.log("START"); // console.log("END");
```

## 16. 정답 및 해설

1. `console.log()`는 인수를 콘솔로 보내는 메서드 호출이고, `//`나 `/* */`의 주석은 엔진이 실행하지 않는 설명이다.
2. 보이지 않는다. `A 1`로 나타난다. 값 사이의 공백은 `console.log`가 넣은 것이다.
3.

```javascript
console.log("START");
console.log("END");
```

직접 해보기 정답 예:

```javascript
console.log("L03", "W02");
console.log("PASS");
```

인수 사이에는 쉼표가 필요하다. 쉼표 없이 두 문자열을 나열하면 문법 오류다.

## 17. 핵심 요약

- JavaScript는 기본적으로 실행 문장을 위에서 아래로 처리한다.
- `console.log()`는 관찰할 텍스트를 출력하지만 값을 자동 저장하지 않으며 `undefined`를 돌려준다.
- 여러 인수는 공백으로 구분되어 출력되고, 문자열의 따옴표는 최상위에서 보이지 않는다.
- `//`와 `/* */`는 주석이며 문자열 안의 같은 글자와는 다르다.

## 18. 다음 레슨 연결

J02에서는 고정된 값을 바로 출력하는 데서 나아가, 값을 **이름과 연결해 보관하고 다시 읽는 방법**을 배운다. 그리고 그 연결에서 `const`가 정확히 무엇을 고정하는지 본다.

---

# J02. let, const, 기본 타입

## 1. 레슨 한 줄 질문

**`const`는 무엇을 고정하며, 그때 값 자체는 왜 여전히 바뀔 수 있을까?**

## 2. 왜 필요한가 / 현실 상황

장비 ID처럼 한 번 정하면 바꾸지 않을 이름과, 처리 개수처럼 계속 변하는 이름은 의도가 다르다. JavaScript는 선언할 때 `const`와 `let`으로 그 차이를 코드에 적어 둔다. 읽는 사람은 선언만 보고도 “이 이름은 나중에 바뀐다”를 안다.

여기서 거의 모든 입문자가 한 번은 걸린다. `const`로 만든 Array에 값을 넣을 수 있기 때문이다. 이 레슨은 그 장면을 화면에서 직접 본다.

## 3. 학습 목표

- 재할당 여부에 따라 `const`와 `let`을 선택할 수 있다.
- Number, String, Boolean, `null`, `undefined`를 구분할 수 있다.
- `const`가 고정하는 것이 **이름과 값의 연결**이지 값의 내용이 아님을 설명할 수 있다.
- `typeof`로 값의 종류를 확인할 수 있다.

## 4. 핵심 용어

- **선언(declaration)**: 새 이름을 만드는 일이다. `const`, `let`으로 한다.
- **할당(assignment)**: 오른쪽에서 만든 값을 이름과 연결하는 일이다.
- **재할당(reassignment)**: 이미 있는 이름을 **다른 값**과 다시 연결하는 일이다.
- **원시값(primitive)**: 숫자, 문자열, Boolean, `null`, `undefined`처럼 더 쪼갤 수 없는 값이다.
- **참조(reference)**: 이름이 객체를 가리키는 연결이다. Array와 Object가 여기 속한다.

## 5. Mental Model

이름은 값을 담는 상자가 아니라 값을 가리키는 **꼬리표**다. `const`는 그 꼬리표를 다른 값에 옮겨 붙이지 못하게 못을 박는 것이지, 가리키는 대상 자체를 얼리는 것이 아니다.

```text
let  count ──▶ 25          const equipment ──▶ "EQ-01"
     count ──▶ 24                  ✗ 다른 값으로 옮길 수 없음
     (꼬리표를 옮겼다)
```

값이 객체이면 그림이 한 겹 더 생긴다.

```text
const wafers ══▶ ┌────────────────────┐
       ✗         │ Array              │
   (못 박힘)      │  0 │ "W01"         │
                 │  1 │ "W02"  ← push로 늘어남
                 └────────────────────┘
                        ↑
              못은 화살표에 박혀 있지 상자 안에 박혀 있지 않다
```

`wafers.push("W02")`는 화살표를 건드리지 않고 화살표 **끝의 내용**을 바꾼다. `wafers = []`는 화살표 자체를 다른 곳으로 옮기려는 시도이고, 그것이 못에 막힌다.

## 6. 핵심 문법 상세 해설

```javascript
const equipment = "EQ-01";
let waferCount = 25;

waferCount = 24;
console.log(equipment, waferCount);
```

```text
EQ-01 24
```

`const`로 선언한 이름을 재할당하면 실행 자체가 실패한다.

```javascript
const equipment = "EQ-01";
equipment = "EQ-02"; // TypeError: Assignment to constant variable.
```

기본적으로 `const`를 쓰고, 실제로 재할당이 필요할 때만 `let`을 쓴다. 그러면 `let`이라는 글자가 “이 이름은 변한다”는 표시가 된다.

기본 타입은 다섯 가지를 먼저 익힌다.

| 값 | `typeof` 결과 | 설명 |
|---|---|---|
| `25`, `23.5` | `"number"` | 정수와 실수를 모두 Number 하나로 표현한다 |
| `"EQ-01"` | `"string"` | 문자열 |
| `true`, `false` | `"boolean"` | 참·거짓 |
| `undefined` | `"undefined"` | 아직 값을 넣지 않음 |
| `null` | `"object"` | 값이 없음을 **의도적으로** 표시. 결과가 `"object"`인 것은 언어 초기의 오래된 특성이다 |

```javascript
let operatorNote;
let lastMeasurement = null;
console.log(operatorNote, lastMeasurement);
console.log(typeof operatorNote, typeof lastMeasurement);
```

```text
undefined null
undefined object
```

`undefined`는 “아직 아무도 넣지 않았다”, `null`은 “없다고 내가 적었다”이다. 둘을 구분해 쓰면 나중에 “값이 비었다”의 원인을 좁힐 수 있다.

Python을 먼저 배웠다면 철자에 주의한다. JavaScript는 소문자 `true`, `false`, `null`이다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
let total = 0;
total = total + 5;
const label = "sum";
console.log(label, total);
```

1. `let total = 0`: 오른쪽 `0`을 값으로 만들고 `total`이라는 새 이름과 연결한다.
2. `total = total + 5`: **오른쪽이 먼저**다. `total`을 읽어 `0`을 얻고, `0 + 5`를 계산해 `5`를 만든다. 그다음 `total`을 그 새 값에 다시 연결한다. 같은 줄에 있는 `total`이 읽기 한 번, 쓰기 한 번으로 서로 다른 시점에 쓰인다.
3. `const label = "sum"`: 새 이름을 만들고 못을 박는다.
4. 두 이름을 읽어 출력한다.

## 8. 실행 전 예측 문제

```javascript
let count = 1;
count = count + 1;
const values = [];
values.push(3);
values.push(4);
console.log(count, values);
console.log(typeof count, typeof values);
```

`const`로 만든 `values`에 값을 넣는 두 줄이 오류인지 아닌지, 그리고 `typeof values`가 무엇인지 먼저 적는다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
Output: (비어 있음)
```

**Step 1 — 1행 실행**

- `1`을 만들고 `count`와 연결한다. `let`이므로 못을 박지 않는다.

**Step 2 — 2행 실행**

- 오른쪽 `count + 1`을 먼저 계산한다. `count`를 읽어 `1`, 더해서 `2`.
- `count`를 `2`에 다시 연결한다. Memory 카드에 `1 → 2` 변경 전후가 표시된다.

**Step 3 — 3행 실행**

- 빈 Array 객체를 새로 만든다. 객체 패널에 칸이 하나도 없는 상자가 생긴다.
- `values`가 그 상자를 가리킨다. `const`이므로 **화살표에** 못이 박힌다.

**Step 4 — 4행 실행**

- `values`를 읽어 상자를 찾는다. 그 상자에 `3`을 덧붙인다.
- 화살표는 그대로다. 상자의 0번 칸이 생긴다.

**Step 5 — 5행 실행**

- 같은 방식으로 1번 칸에 `4`가 생긴다.

**Step 6~7 — 출력**

```text
2 [ 3, 4 ]
number object
```

**After**

```text
count = 2
values ──▶ [3, 4]   (같은 상자, 처음 만든 그것)
```

Array도 Object의 한 종류라서 `typeof`는 `"object"`다. Array인지 확인하려면 `Array.isArray(values)`를 쓴다. `typeof`로는 구분되지 않는다.

## 10. Visual Script

1. `let`으로 만든 카드와 `const`로 만든 카드를 다른 표시로 그린다. `const` 카드에는 자물쇠 표식을 붙인다.
2. 2행에서 오른쪽 표현식이 먼저 계산되는 순서를 강조한다: `count` 읽기 → `1 + 1` → 결과 → 왼쪽으로 이동.
3. 3행에서 빈 Array 상자가 힙 영역에 생기고 `values` 카드에서 화살표가 뻗는다.
4. `push` 실행 때 **화살표는 정지 상태로 유지**하고 상자 안쪽에만 칸이 추가되는 애니메이션을 준다. 이 대비가 이 레슨의 핵심이다.
5. 자물쇠는 화살표 위에 그린다. 상자 위에 그리면 오해를 강화한다.
6. 마지막에 `typeof` 결과를 카드 옆에 배지로 붙인다.

## 11. 왜 이렇게 동작하는가

`const`는 **바인딩(이름과 값의 연결)**을 고정한다. 값이 원시값이면 값 자체를 바꿀 방법이 없으므로 “상수”처럼 보인다. 값이 객체이면 바인딩은 고정되어 있어도 객체 내부는 별개의 저장소이므로 바뀔 수 있다.

내용까지 얼리고 싶으면 `Object.freeze(obj)`처럼 별도의 조치가 필요하다. 그것은 언어가 이름에 거는 규칙이 아니라 **객체에 거는 규칙**이다. 둘이 다른 층위에 있다는 사실을 잡아 두면 J06의 참조 공유가 훨씬 쉬워진다.

## 12. 자주 하는 오해/실수

### 오해 1: `const` Array에는 아무것도 넣을 수 없다

```javascript
const wafers = [];
wafers.push("W01"); // 가능
wafers = ["W01"];   // TypeError
```

가능한 쪽과 불가능한 쪽이 무엇을 건드리는지 보면 규칙이 하나로 정리된다. 위는 상자를, 아래는 화살표를 건드린다.

### 오해 2: `"true"`는 Boolean이다

```javascript
console.log(typeof true);    // boolean
console.log(typeof "true");  // string
```

따옴표가 붙는 순간 글자다. 그리고 비어 있지 않은 문자열은 조건에서 참으로 취급되므로(J07), `"false"`도 참이 된다.

### 오해 3: `null`과 `undefined`는 같은 것이다

둘 다 “값이 없음”을 나타낼 수 있지만 생기는 경로가 다르다. `undefined`는 아무도 넣지 않아 생기고, `null`은 사람이 적어 넣는다. 그래서 “이 측정은 아직 하지 않았다”를 표시할 때는 `null`을 쓴다.

### 오해 4: 선언 없이 이름을 쓸 수 있다

```javascript
value = 3; // 선언 없이 이름을 만들어 버린다 (엄격 모드에서는 오류)
```

이 과정에서는 언제나 `const`나 `let`으로 선언한다. 선언 없는 이름은 어디서 만들어졌는지 추적할 수 없다.

## 13. 업무형/엔지니어형 예제

```javascript
const equipment = "EQ-01";
let waferCount = 25;
let lastError = null;

waferCount = waferCount - 1;
lastError = "TILT";

console.log(equipment, waferCount, lastError);
console.log(typeof equipment, typeof waferCount, typeof lastError);
```

출력:

```text
EQ-01 24 TILT
string number string
```

세 이름의 선언이 각각 그 이름의 수명을 설명한다. `equipment`는 이 프로그램이 도는 동안 바뀌지 않고, `waferCount`는 처리할 때마다 줄고, `lastError`는 처음에는 없다가 생긴다.

## 14. 직접 해보기

고정된 Lot ID, 변하는 처리 개수, 아직 없는 오류 메시지를 선언하라. 각각 `const`, `let`, `null` 가운데 무엇을 골랐는지와 그 이유를 한 문장으로 적는다. 그다음 처리 개수를 두 번 줄이고 매번 출력해 변경 전후가 화면에서 어떻게 보이는지 확인한다.

## 15. 확인 문제

1. **Concept**: JavaScript에서 정수와 실수의 타입 이름은 같은가?
2. **Trace**: `const values = []; values.push(3);`은 오류인가? 이유를 한 문장으로 답하라.
3. **Fix**: 다음 코드가 오류 없이 `2`를 출력하도록 고쳐라.

```javascript
const count = 1;
count = count + 1;
console.log(count);
```

## 16. 정답 및 해설

1. 같다. 둘 다 `"number"`다.
2. 오류가 아니다. `const`가 고정하는 것은 `values`와 그 Array의 연결이고, `push`는 그 Array의 내용을 바꾸는 일이라 연결을 건드리지 않는다.
3.

```javascript
let count = 1;
count = count + 1;
console.log(count);
```

재할당이 필요한 이름이므로 `let`으로 선언한다. `const`를 유지하고 싶다면 새 이름을 만든다.

```javascript
const count = 1;
const next = count + 1;
console.log(next);
```

## 17. 핵심 요약

- `const`는 이름과 값의 **연결**을 고정하고, `let`은 재할당을 허용한다.
- `const`로 만든 Array·Object의 내부는 바뀔 수 있다. 못은 화살표에 박혀 있다.
- 기본 타입은 Number, String, Boolean, `undefined`, `null`이며 Array와 Object는 `typeof`에서 `"object"`다.
- `undefined`는 아직 넣지 않은 것, `null`은 없다고 적어 둔 것이다.

## 18. 다음 레슨 연결

J03에서는 이렇게 만든 값들을 **계산에 넣는다**. 그리고 문자열과 숫자를 섞었을 때 `+`가 무슨 일을 하는지, 왜 `"1" + 1`이 `"11"`인지를 본다.

---

# J03. 연산자, 타입 변환, 엄격한 동등성

## 1. 레슨 한 줄 질문

**왜 `"1" + 1`은 `2`가 아니라 `"11"`이며, 그것을 어떻게 미리 알 수 있을까?**

## 2. 왜 필요한가 / 현실 상황

CSV 파일, 입력 상자, 네트워크 응답에서 받은 `"94.2"`는 숫자처럼 보여도 문자열이다. JavaScript는 일부 연산에서 타입을 자동으로 바꾸기 때문에 **오류 없이 실행되고 결과만 틀린다**. 오류는 눈에 띄지만 조용히 틀린 값은 그렇지 않다. 그래서 이 레슨이 필요하다.

## 3. 학습 목표

- `+`가 덧셈과 문자열 연결 중 어느 쪽으로 동작할지 판단할 수 있다.
- 입력값을 `Number()`로 명시적으로 변환할 수 있다.
- `==`와 `===`의 차이를 설명하고 `===`를 기본으로 쓸 수 있다.
- `NaN`을 안전하게 검사할 수 있다.

## 4. 핵심 용어

- **피연산자(operand)**: 연산자가 계산에 사용하는 값이다.
- **암묵적 변환(coercion)**: 엔진이 연산을 위해 값의 타입을 자동으로 바꾸는 일이다.
- **명시적 변환**: 사람이 `Number()`, `String()`처럼 직접 바꾸는 일이다.
- **엄격한 동등성(`===`)**: 타입과 값을 모두 비교한다. 변환하지 않는다.
- **`NaN`**: “유효한 숫자 결과가 아님”을 나타내는 Number 값이다.

## 5. Mental Model

`+`만 두 얼굴을 가진다. 나머지 산술 연산자는 숫자로 바꾸려고 시도한다.

```text
        피연산자 중 문자열이 하나라도 있는가?
                    │
        ┌───── 예 ──┴── 아니오 ─────┐
        ▼                           ▼
  문자열 연결                     덧셈
  "1" + 1 → "11"              1 + 1 → 2

  나머지 연산자는 얼굴이 하나다
  "6" - 1 → 5      "6" * 2 → 12
```

비교는 두 갈래다.

```text
"1" == 1     타입을 맞춘 뒤 비교  ──▶ true   (규칙이 길다)
"1" === 1    타입부터 비교        ──▶ false  (규칙이 짧다)
```

`===`를 기본으로 쓰는 이유는 “엄격해서”가 아니라 **머릿속에서 결과를 예측할 수 있어서**다.

## 6. 핵심 문법 상세 해설

```javascript
console.log(1 + 2);
console.log("1" + 2);
console.log(Number("1") + 2);
```

```text
3
12
3
```

둘째 줄에서 `"1"`이 문자열이므로 `+`는 연결로 동작하고 `2`가 `"2"`로 바뀐다. 셋째 줄에서는 계산 전에 사람이 직접 변환했으므로 의도가 코드에 드러난다.

빼기는 다르다.

```javascript
console.log("6" - 1);
console.log("6" * 2);
console.log("6" / "2");
```

```text
5
12
3
```

`-`, `*`, `/`에는 문자열 연결이라는 뜻이 없으므로 엔진이 숫자로 바꾸려 시도한다. 그래서 `+`만 예외적으로 조심하면 된다.

비교 연산자는 이렇게 갈린다.

```javascript
console.log("1" == 1);
console.log("1" === 1);
console.log(0 == "");
console.log(0 === "");
```

```text
true
false
true
false
```

`==`의 변환 규칙은 표로 외워야 할 만큼 길다. 외우는 대신 `===`와 `!==`를 기본으로 쓰고, 타입이 다른 값을 비교해야 하면 한쪽을 먼저 명시적으로 바꾼다.

`NaN`은 특별하다.

```javascript
const measurement = Number("N/A");
console.log(measurement);
console.log(measurement === NaN);
console.log(Number.isNaN(measurement));
console.log(Number.isFinite(measurement));
```

```text
NaN
false
true
false
```

`NaN`은 자기 자신과도 같지 않다. 그래서 `=== NaN` 비교는 언제나 `false`다. 정상적인 유한 숫자인지 확인할 때는 `Number.isFinite()`를 쓴다. 이 함수는 `NaN`뿐 아니라 `Infinity`도 걸러 준다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const raw = "94.2";
const value = Number(raw);
const doubled = value * 2;
console.log(raw + 1);
console.log(doubled);
```

1. `raw`는 문자열 `"94.2"`다.
2. `Number(raw)`가 새 값 `94.2`를 만든다. `raw`는 그대로 문자열이다. 변환은 **새 값을 만드는 일**이지 원본을 고치는 일이 아니다.
3. `value * 2`는 숫자끼리의 곱이라 `188.4`.
4. `raw + 1`은 문자열과 숫자의 `+`라 연결이다. `"94.21"`이 출력된다.
5. `doubled`는 `188.4`다.

4번이 이 레슨이 잡으려는 함정이다. 2번에서 변환했다고 해서 `raw`가 숫자가 되지는 않는다.

## 8. 실행 전 예측 문제

```javascript
console.log("2" + 3);
console.log(Number("2") + 3);
console.log("2" === 2);
console.log("2" == 2);
const bad = Number("N/A");
console.log(bad === NaN, Number.isFinite(bad));
```

여섯 개의 결과와 **각각의 타입**을 적는다. 특히 첫 줄과 둘째 줄의 타입이 다르다는 점에 주의한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
Output: (비어 있음)
```

**Step 1 — 1행: `"2" + 3`**

- 왼쪽 `"2"`는 String, 오른쪽 `3`은 Number다.
- `+`이고 한쪽이 문자열이므로 연결로 동작한다. `3`이 `"3"`이 된다.
- 결과는 `"23"` (String).

```text
Output: 23
```

화면에는 따옴표 없이 `23`으로 보인다. 숫자 이십삼과 구분되지 않으므로, 타입은 표현식 패널에서 확인해야 한다.

**Step 2 — 2행: `Number("2") + 3`**

- `Number("2")`가 먼저 값 `2`를 만든다.
- 이제 양쪽이 Number이므로 덧셈이다. 결과 `5` (Number).

**Step 3 — 3행: `"2" === 2`**

- 타입부터 비교한다. String과 Number는 다르다.
- 값을 볼 것도 없이 `false`.

**Step 4 — 4행: `"2" == 2`**

- 타입이 다르므로 규칙에 따라 한쪽을 바꾼다. 문자열이 숫자로 바뀐다.
- `2 == 2`이므로 `true`.

**Step 5 — 5행: `Number("N/A")`**

- `"N/A"`는 숫자로 읽을 수 없다. 오류가 아니라 `NaN`이라는 값이 만들어진다.
- `bad`가 `NaN`을 가리킨다.

**Step 6 — 6행**

- `bad === NaN`: `NaN`은 자기 자신과도 같지 않으므로 `false`.
- `Number.isFinite(bad)`: `false`.

**After**

```text
23
5
false
true
false false
```

3행과 4행이 같은 두 값에 대해 반대 답을 낸다. 이 한 쌍이 이 레슨의 요점이다.

## 10. Visual Script

1. 표현식 패널에서 `+`를 처리할 때 두 피연산자의 타입 배지를 먼저 켠다.
2. 한쪽이 String이면 “연결” 경로가, 아니면 “덧셈” 경로가 강조되는 두 갈래 그림을 보여 준다.
3. 변환이 일어나는 순간 `3 → "3"`처럼 값이 바뀌는 애니메이션을 준다. 이것이 암묵적 변환의 유일한 가시적 흔적이다.
4. `===` 비교는 타입 배지를 먼저 대조하고 다르면 값 비교 단계를 아예 건너뛰는 것으로 그린다.
5. `==` 비교는 변환 단계가 하나 더 끼어 있는 것으로 그려 두 연산자의 단계 수 차이를 보여 준다.
6. `NaN`이 만들어질 때 Memory 카드에 경고 표식을 붙이고, `=== NaN` 비교가 `false`로 떨어지는 장면을 따로 강조한다.

## 11. 왜 이렇게 동작하는가

`+`는 언어 초기부터 숫자 덧셈과 문자열 연결 두 가지 용도로 쓰였다. 두 용도를 한 기호에 담았으므로 어느 쪽인지 정하는 규칙이 필요했고, 그 규칙이 “한쪽이라도 문자열이면 연결”이다. 다른 산술 연산자에는 그런 이중 용도가 없어 규칙이 단순하다.

`NaN !== NaN`은 실수가 아니라 IEEE 754 부동소수점 표준의 규정이다. “계산에 실패했다”를 나타내는 값 두 개가 같은 실패인지 알 방법이 없으므로 어느 것과도 같지 않다고 정했다. 그래서 언어는 별도의 검사 함수를 제공한다.

## 12. 자주 하는 오해/실수

### 오해 1: `parseInt`가 `Number`의 다른 이름이다

```javascript
console.log(Number("94.2"));
console.log(parseInt("94.2"));
console.log(Number("94.2nm"));
console.log(parseInt("94.2nm"));
```

```text
94.2
94
NaN
94
```

`parseInt`는 **읽을 수 있는 데까지 읽고 멈춘다**. 소수점 이하를 버리고, 뒤에 글자가 붙어 있어도 앞부분만 읽는다. 값 전체가 올바른 숫자인지 확인하고 싶으면 `Number()`를 쓰고 결과를 `Number.isFinite`로 검사한다.

### 오해 2: `value !== NaN`으로 숫자 유효성을 검사할 수 있다

이 비교는 언제나 `true`다. `NaN`이 들어와도 `true`이므로 검사 자체가 무의미하다. `Number.isNaN(value)` 또는 `Number.isFinite(value)`를 쓴다.

### 오해 3: 빈 문자열은 숫자로 바꾸면 `NaN`이다

```javascript
console.log(Number(""));
console.log(Number(" "));
console.log(Number("0"));
```

```text
0
0
0
```

빈 문자열과 공백만 있는 문자열은 `0`이 된다. “값이 없다”가 `0`이 되어 조용히 통과하는 일이 실제 데이터 처리에서 자주 생긴다. 빈 값은 변환 **전에** 따로 걸러야 한다.

### 오해 4: `==`를 쓰면 편하다

```javascript
console.log(null == undefined);
console.log([] == false);
console.log("0" == false);
console.log("0" === false);
```

```text
true
true
true
false
```

편한 것이 아니라 규칙이 많은 것이다. 규칙이 많으면 예측이 어렵고, 예측이 어려우면 버그가 조용해진다.

## 13. 업무형/엔지니어형 예제

```javascript
const rawValues = ["94.2", "N/A", "", "0"];

for (const text of rawValues) {
  const value = Number(text);
  const usable = Number.isFinite(value) && text !== "";
  console.log(text, value, usable);
}
```

출력:

```text
94.2 94.2 true
N/A NaN false
 0 false
0 0 true
```

둘째 줄은 변환이 실패한 경우, 셋째 줄은 **변환은 성공했지만 써서는 안 되는** 경우다. 빈 문자열이 `0`이 되기 때문에 `Number.isFinite`만으로는 걸러지지 않는다. 그래서 조건이 두 개다. 데이터 정제 코드가 지저분해 보이는 이유가 대개 이런 “성공했지만 틀린” 경우 때문이다.

## 14. 직접 해보기

`["94.2", "N/A", "", "0", "94.2nm"]`의 각 값을 `Number()`와 `parseInt()`로 각각 변환하고, `Number.isFinite()` 결과와 함께 한 줄씩 출력하라. 다섯 값 중 실제 측정값으로 쓸 수 있는 것이 무엇인지 판단하고, 그 판단을 코드의 조건식으로 옮겨 적는다.

## 15. 확인 문제

1. **Concept**: `"10" + 5`의 결과와 타입은 무엇인가?
2. **Trace**: `Number("")`의 결과는 무엇이며 왜 문제가 될 수 있는가?
3. **Fix**: 다음 코드가 `"N/A"`를 올바르게 걸러 내도록 고쳐라.

```javascript
const value = Number("N/A");
if (value !== NaN) {
  console.log("사용 가능:", value);
}
```

## 16. 정답 및 해설

1. 문자열 `"105"`다. `+`의 한쪽이 문자열이라 연결로 동작한다.
2. `0`이다. “값이 비었다”가 “측정값이 0이다”와 구분되지 않으므로, 빈 값은 변환 전에 따로 검사해야 한다.
3.

```javascript
const value = Number("N/A");
if (Number.isFinite(value)) {
  console.log("사용 가능:", value);
} else {
  console.log("사용 불가");
}
```

`value !== NaN`은 언제나 참이라 조건 자체가 아무것도 걸러 내지 못한다.

## 17. 핵심 요약

- `+`는 피연산자 중 문자열이 있으면 연결, 아니면 덧셈이다. 다른 산술 연산자는 숫자로 바꾼다.
- 변환은 새 값을 만드는 일이며 원본 이름의 타입을 바꾸지 않는다.
- `===`와 `!==`를 기본으로 쓴다. `==`는 규칙이 길어 예측이 어렵다.
- `NaN`은 자기 자신과 같지 않다. `Number.isFinite()` 또는 `Number.isNaN()`으로 검사한다.
- `Number("")`는 `0`이다. 빈 값은 변환 전에 따로 거른다.

## 18. 다음 레슨 연결

J04에서는 숫자를 **사람이 읽을 문장으로 만드는** 방법을 본다. Template Literal로 값과 텍스트를 조합하고, `toFixed()`가 왜 숫자가 아니라 문자열을 돌려주는지 확인한다.

---

# J04. 문자열과 Template Literal

## 1. 레슨 한 줄 질문

**문자열의 일부를 꺼내고 값과 조합할 때, 원본은 어떻게 되는가?**

## 2. 왜 필요한가 / 현실 상황

측정 결과를 사람이 읽을 한 줄로 만드는 일은 거의 모든 프로그램의 마지막 단계다. `"WAFER-07"`에서 번호만 떼어 내고, `94.234`를 소수점 한 자리로 줄이고, 그 둘을 한 문장에 넣는다. 이 과정에서 원본이 바뀌는지 아닌지를 잘못 알면 바로 다음 계산이 틀어진다.

## 3. 학습 목표

- 인덱스와 `slice()`로 문자열의 일부를 꺼낼 수 있다.
- Template Literal에 값과 표현식을 넣을 수 있다.
- 문자열 메서드가 원본을 바꾸지 않고 **새 문자열을 돌려준다**는 것을 설명할 수 있다.
- `toFixed()`의 반환 타입이 String임을 알고 대응할 수 있다.

## 4. 핵심 용어

- **인덱스(index)**: 문자열 안의 위치이며 0부터 센다.
- **`slice(start, end)`**: `start`를 포함하고 `end`는 제외한 새 문자열을 만든다.
- **Template Literal**: backtick으로 감싸고 `${}` 안에 표현식을 넣을 수 있는 문자열이다.
- **불변(immutable)**: 만들어진 뒤 내용을 바꿀 수 없다는 뜻이다. JavaScript의 문자열이 그렇다.

## 5. Mental Model

문자열은 글자가 순서대로 놓인 자리표다. 자리 번호는 0부터 센다.

```text
문자열:  W  A  F  E  R  -  0  7
인덱스:  0  1  2  3  4  5  6  7
                                8  ← 길이(length)는 8, 마지막 인덱스는 7

slice(0, 5)  →  [0, 5)  →  "WAFER"
slice(-2)    →  뒤에서 2칸  →  "07"
```

그리고 문자열은 **바뀌지 않는다**. 메서드는 원본을 고치는 것이 아니라 새 문자열을 만들어 돌려준다.

```text
raw ──▶ "  eq-01  "        (그대로 남는다)
             │
             │ .trim()
             ▼
         "eq-01"  ──▶ 새 문자열. 어디에도 연결되지 않으면 사라진다
```

받아서 이름에 연결하지 않으면 그 결과는 없는 것과 같다. 이것이 문자열 메서드에서 가장 자주 나오는 실수의 원인이다.

## 6. 핵심 문법 상세 해설

```javascript
const waferId = "WAFER-07";
console.log(waferId[0]);
console.log(waferId.length);
console.log(waferId.slice(0, 5));
console.log(waferId.slice(-2));
```

```text
W
8
WAFER
07
```

`slice(시작, 끝)`은 시작을 포함하고 끝은 제외한다. 그래서 `slice(0, 5)`의 길이는 정확히 `5 - 0`이다. 음수 시작값은 끝에서부터 센다.

Template Literal은 backtick으로 감싼다.

```javascript
const measurement = 94.234;
const message = `${waferId}: measurement=${measurement.toFixed(1)}`;
console.log(message);
```

```text
WAFER-07: measurement=94.2
```

`${}` 안에는 이름만이 아니라 표현식을 넣을 수 있다. 일반 따옴표 안에서는 `${}`가 계산되지 않고 글자 그대로 남는다.

```javascript
console.log("value=${measurement}");
console.log(`value=${measurement}`);
```

```text
value=${measurement}
value=94.234
```

`toFixed(1)`은 소수점 한 자리로 반올림한 **문자열** `"94.2"`를 돌려준다. 화면 표시에는 편하지만 이후 계산이 필요하면 다시 `Number()`로 바꿔야 한다.

```javascript
const shown = measurement.toFixed(1);
console.log(typeof shown);
console.log(shown + 1);
console.log(Number(shown) + 1);
```

```text
string
94.21
95.2
```

J03에서 본 `+`의 두 얼굴이 여기서 그대로 다시 나온다.

자주 쓰는 메서드는 다음과 같다. 전부 새 문자열을 돌려준다.

| 코드 | 결과 |
|---|---|
| `"  eq-01  ".trim()` | `"eq-01"` |
| `"eq-01".toUpperCase()` | `"EQ-01"` |
| `"eq-01".replace("-", "_")` | `"eq_01"` |
| `"EQ-01".includes("EQ")` | `true` |
| `"a,b,c".split(",")` | `["a", "b", "c"]` |

## 7. 컴퓨터처럼 코드 읽기

```javascript
const raw = "  eq-01  ";
raw.trim();
console.log(raw);

const clean = raw.trim();
console.log(clean);
```

1. `raw`는 앞뒤에 공백이 있는 문자열이다.
2. `raw.trim()`이 실행된다. 새 문자열 `"eq-01"`이 만들어진다. **그런데 아무 이름에도 연결하지 않았다.** 만들어지자마자 버려진다.
3. `raw`를 출력하면 여전히 공백이 있다.
4. 이번에는 결과를 `clean`과 연결한다.
5. `clean`을 출력하면 공백이 없다.

2번 줄은 오류가 아니다. 오류가 아니라서 더 찾기 어렵다.

## 8. 실행 전 예측 문제

```javascript
const waferId = "WAFER-07";
console.log(waferId.slice(1, 4));
console.log(waferId.slice(-2));
const measurement = 94.234;
const shown = measurement.toFixed(1);
console.log(shown, typeof shown);
console.log(`${waferId} → ${shown}`);
```

네 줄의 출력과, `shown`의 타입을 적는다. 특히 `slice(1, 4)`의 결과 길이가 몇인지 먼저 계산해 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
Output: (비어 있음)
```

**Step 1 — 1행**

- 문자열 `"WAFER-07"`을 만들고 `waferId`와 연결한다.

**Step 2 — 2행: `slice(1, 4)`**

- 인덱스 1부터 4 직전까지. 즉 1, 2, 3번 자리.
- `"AFE"`라는 **새 문자열**이 만들어진다. `waferId`는 그대로다.

```text
Output: AFE
```

길이는 `4 - 1 = 3`이다. 끝을 제외하는 규칙 덕분에 길이를 뺄셈으로 바로 알 수 있다.

**Step 3 — 3행: `slice(-2)`**

- 음수는 끝에서부터 센다. 끝에서 두 번째 자리부터 끝까지.
- `"07"`.

**Step 4 — 4행**

- `94.234`를 `measurement`와 연결한다.

**Step 5 — 5행: `toFixed(1)`**

- 소수점 한 자리로 반올림한다. 결과는 숫자가 아니라 문자열 `"94.2"`다.
- `shown`이 그 문자열을 가리킨다.

**Step 6 — 6행**

```text
Output: 94.2 string
```

화면의 `94.2`만 보면 숫자와 구분되지 않는다. 옆의 `string`이 유일한 단서다.

**Step 7 — 7행: Template Literal**

- backtick 안에서 `${waferId}`와 `${shown}`이 각각 값으로 바뀌고 나머지 글자와 이어 붙는다.

```text
Output: WAFER-07 → 94.2
```

**After**

```text
waferId  = "WAFER-07"   (한 번도 바뀌지 않았다)
measurement = 94.234    (바뀌지 않았다)
shown    = "94.2"       (새로 만들어진 문자열)
```

## 10. Visual Script

1. 문자열을 인덱스가 붙은 칸으로 그린다. `slice`의 시작과 끝 경계를 세로선으로 표시하고, 끝 경계는 **바깥쪽**에 그려 “제외”를 보여 준다.
2. `slice` 실행 때 원본 칸은 그대로 두고 새 칸 묶음이 아래에 생기는 애니메이션을 준다. 원본에서 글자가 빠져나가는 것처럼 그리면 안 된다.
3. 음수 인덱스는 오른쪽 끝에서 왼쪽으로 세는 보조 눈금을 함께 보여 준다.
4. Template Literal은 `${}` 자리에 값이 들어가 앉는 장면을 슬롯 채우기로 그린다.
5. `toFixed()` 결과에는 String 배지를 크게 붙인다. 이 레슨에서 가장 자주 놓치는 지점이다.
6. 반환값을 어디에도 연결하지 않은 호출은 결과 카드가 만들어졌다가 흐려지며 사라지는 것으로 그린다.

## 11. 왜 이렇게 동작하는가

JavaScript의 문자열은 **불변**이다. 한 번 만들어진 문자열의 내용은 바꿀 수 없다. `waferId[0] = "X"`는 오류를 내지도 않고 아무 일도 하지 않는다. 그래서 모든 문자열 메서드는 새 문자열을 만들어 돌려주는 방식으로 설계되었다.

불변이라는 성질은 불편해 보이지만 이득이 크다. 어떤 이름이 가리키는 문자열은 다른 코드가 몰래 바꿀 수 없다. J06에서 볼 Object·Array의 참조 공유 문제가 문자열에는 아예 생기지 않는 이유가 이것이다.

`toFixed()`가 문자열을 돌려주는 것도 같은 맥락이다. `94.20`처럼 **끝의 0을 유지하는 것**은 숫자로는 표현할 수 없다. 자리수를 맞춘 표시는 표시일 뿐이므로 문자열이어야 한다.

## 12. 자주 하는 오해/실수

### 오해 1: 메서드를 부르면 원본이 바뀐다

```javascript
let text = "eq-01";
text.toUpperCase();
console.log(text); // eq-01

text = text.toUpperCase();
console.log(text); // EQ-01
```

반환값을 다시 연결해야 한다. 이것이 문자열 처리에서 가장 흔한 버그다.

### 오해 2: 일반 따옴표에서도 `${}`가 동작한다

```javascript
const value = 3;
console.log("value=${value}");
console.log(`value=${value}`);
```

backtick이어야 한다. 따옴표 세 종류가 화면에서 비슷해 보이므로 편집기의 구문 강조로 확인하는 습관을 들인다.

### 오해 3: `slice(0, 3)`은 인덱스 3까지 포함한다

포함하지 않는다. 끝은 언제나 제외다. 대신 “길이 = 끝 − 시작”이라는 계산이 항상 성립한다.

### 오해 4: `toFixed()`의 결과로 계산해도 된다

```javascript
const a = (94.234).toFixed(1);
const b = (0.5).toFixed(1);
console.log(a + b);
console.log(Number(a) + Number(b));
```

```text
94.20.5
94.7
```

문자열끼리의 `+`는 연결이다. 계산이 필요하면 `Number()`로 되돌린다.

## 13. 업무형/엔지니어형 예제

```javascript
const raw = "  eq-01  ";
const name = raw.trim().toUpperCase().replace("-", "_");
const measurement = 94.234;
const report = `${name} measurement=${measurement.toFixed(2)}`;

console.log(report);
console.log(raw);
console.log(name.length, raw.length);
```

출력:

```text
EQ_01 measurement=94.23
  eq-01  
5 9
```

메서드를 점으로 이어 붙이면 **왼쪽부터 차례로** 실행된다. `trim()`의 결과에 `toUpperCase()`를 부르고, 그 결과에 `replace()`를 부른다. 중간 결과 세 개가 만들어졌다 사라지고 마지막 것만 `name`에 남는다.

마지막 줄이 이 예제의 요점이다. `raw`는 처음 그대로 9글자다. 네 번의 처리 중 어느 것도 원본을 건드리지 않았다.

## 14. 직접 해보기

`"  eq-01  "`을 `"EQ_01"`로 바꾸는 코드를 두 가지로 써 보라. ① 메서드를 점으로 이어 붙인 한 줄, ② 중간 결과마다 이름을 붙인 여러 줄. 두 번째 방식에서 각 이름이 가리키는 문자열을 전부 출력해, 원본이 몇 번 바뀌었는지 확인한다. (답은 0번이다.)

## 15. 확인 문제

1. **Concept**: `slice(0, 3)`은 인덱스 3의 글자를 포함하는가?
2. **Trace**: `(9.5).toFixed(2)`의 값과 타입은 무엇인가?
3. **Fix**: 다음 코드가 `EQ-01`을 출력하도록 고쳐라.

```javascript
let name = "eq-01";
name.toUpperCase();
console.log(name);
```

## 16. 정답 및 해설

1. 포함하지 않는다. 인덱스 0, 1, 2 세 글자다.
2. `"9.50"`이며 타입은 String이다. 끝의 `0`이 유지되는 것이 문자열임을 보여 주는 단서다.
3.

```javascript
let name = "eq-01";
name = name.toUpperCase();
console.log(name);
```

예측 문제 정답: `"AFE"`, `"07"`, `94.2 string`, `WAFER-07 → 94.2`.

## 17. 핵심 요약

- 인덱스는 0부터 세고 `slice(start, end)`는 끝을 제외한다. 길이는 `end - start`다.
- 문자열은 불변이며 모든 메서드는 새 문자열을 돌려준다. 결과를 이름에 연결하지 않으면 사라진다.
- Template Literal은 backtick과 `${}`를 쓴다. 일반 따옴표에서는 동작하지 않는다.
- `toFixed()`는 String을 돌려준다. 계산에 쓰려면 `Number()`로 되돌린다.

## 18. 다음 레슨 연결

J05에서는 값 하나가 아니라 **여러 값을 순서대로 묶는** Array를 다룬다. 그리고 문자열과 달리 Array는 바뀔 수 있기 때문에, “원본을 바꾸는 메서드”와 “새것을 돌려주는 메서드”를 구분하는 일이 새로 생긴다.

---

# J05. Array

## 1. 레슨 한 줄 질문

**여러 값을 순서대로 묶었을 때, 어떤 조작이 원본을 바꾸고 어떤 조작이 새것을 만들까?**

## 2. 왜 필요한가 / 현실 상황

측정값 하나가 아니라 한 Lot의 25장을 다루기 시작하면 이름을 스물다섯 개 만들 수는 없다. 여러 값을 순서대로 묶은 것이 Array다.

그런데 Array는 문자열과 달리 **바뀐다**. 그래서 “이 메서드는 원본을 고치는가, 새 Array를 돌려주는가”를 매번 알아야 한다. 이름이 비슷한 `slice`와 `splice`가 정확히 반대편에 있어서, 이 구분을 못 하면 원본을 잃는다.

## 3. 학습 목표

- 인덱스로 Array 원소를 읽고 바꿀 수 있다.
- `push`, `pop`, `slice`, `splice`의 원본 변경 여부와 반환값을 구분할 수 있다.
- 마지막 원소의 인덱스를 정확히 계산할 수 있다.
- `const`로 선언한 Array의 내부가 왜 바뀔 수 있는지 설명할 수 있다.

## 4. 핵심 용어

- **Array**: 값을 순서대로 담는 객체다. 인덱스는 0부터 센다.
- **`length`**: 원소의 개수다. 마지막 인덱스는 `length - 1`이다.
- **변경(mutating) 메서드**: 원본 Array를 고친다. `push`, `pop`, `splice`가 그렇다.
- **비변경 메서드**: 원본을 두고 새 Array나 값을 돌려준다. `slice`, `concat`이 그렇다.

## 5. Mental Model

Array는 번호가 붙은 칸의 줄이다.

```text
const wafers = ["W01", "W02", "W03"];

인덱스:   0       1       2          3
        ┌──────┬───────┬───────┐
        │ W01  │ W02   │ W03   │     length = 3
        └──────┴───────┴───────┘
                                 ↑
                        wafers[3] 은 칸이 없다 → undefined
                        마지막 유효 인덱스는 length - 1 = 2
```

메서드는 두 무리로 나뉜다. 이 그림이 이 레슨의 전부다.

```text
원본을 바꾸는 것            원본을 두는 것
push  ┌───┬───┬───┬───┐    slice  ┌───┬───┐  ← 새 Array
      │ A │ B │ C │ D │           │ A │ B │
      └───┴───┴───┴───┘           └───┴───┘
       같은 상자가 길어졌다        원본은 그대로 ┌───┬───┬───┐
                                              │ A │ B │ C │
pop   ┌───┬───┐                               └───┴───┘
      │ A │ B │  ← C가 빠지고
      └───┴───┘     반환값으로 C가 나온다
```

## 6. 핵심 문법 상세 해설

```javascript
const wafers = ["W01", "W02", "W03"];
wafers.push("W04");
wafers[1] = "W02-R";
console.log(wafers);
```

```text
[ 'W01', 'W02-R', 'W03', 'W04' ]
```

`const`는 `wafers`가 **다른 Array**를 가리키지 못하게 막을 뿐, 지금 가리키는 Array의 칸을 바꾸는 일은 막지 않는다(J02의 그림).

메서드의 성격은 두 가지를 함께 봐야 한다. 원본을 바꾸는가, 그리고 무엇을 돌려주는가.

| 코드 | 원본 변경 | 반환값 |
|---|---|---|
| `push(value)` | 예 | 바뀐 뒤의 **길이** |
| `pop()` | 예 | 제거한 마지막 원소 |
| `shift()` | 예 | 제거한 첫 원소 |
| `slice(start, end)` | 아니오 | 복사한 새 Array |
| `splice(start, count)` | 예 | 제거한 원소들의 Array |
| `concat(other)` | 아니오 | 이어 붙인 새 Array |

```javascript
const original = ["A", "B", "C"];
const copied = original.slice(0, 2);
console.log(copied, original);

const removed = original.splice(0, 2);
console.log(removed, original);
```

```text
[ 'A', 'B' ] [ 'A', 'B', 'C' ]
[ 'A', 'B' ] [ 'C' ]
```

두 줄의 첫 번째 값이 똑같다. 다른 것은 **원본**이다. 반환값만 보고 두 메서드를 구분할 수 없다는 점이 이 표의 요점이다.

마지막 원소를 읽는 방법은 두 가지다.

```javascript
const values = [10, 20, 30];
console.log(values[values.length - 1]);
console.log(values.at(-1));
console.log(values[values.length]);
```

```text
30
30
undefined
```

`values[values.length]`가 오류가 아니라 `undefined`라는 점을 기억한다. 조용히 통과하므로 다음 계산에서야 이상해진다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [1, 2, 3];
const result = values.push(4);
console.log(values);
console.log(result);
```

1. 값 세 개를 담은 Array 객체를 만들고 `values`가 그것을 가리킨다.
2. `values`를 읽어 그 Array를 찾는다. `push(4)`가 그 Array의 끝에 칸을 하나 더 만든다. **여기서 새 Array는 만들어지지 않았다.**
3. `push`가 돌려주는 값은 새 길이인 `4`다. Array 자체가 아니다.
4. `values`를 출력하면 `[1, 2, 3, 4]`.
5. `result`를 출력하면 `4`.

4번과 5번의 `4`는 서로 다른 `4`다. 하나는 마지막 원소이고 하나는 길이다. 우연히 같아서 헷갈리기 쉽다.

## 8. 실행 전 예측 문제

```javascript
const values = [1, 2, 3];
const result = values.push(4);
console.log(values, result);

const copied = values.slice(0, 2);
console.log(copied, values);

const removed = values.splice(0, 2);
console.log(removed, values);
```

여섯 개의 출력값을 적는다. 특히 `copied`를 만든 뒤의 `values`와 `removed`를 만든 뒤의 `values`가 어떻게 다른지에 주의한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
객체: (없음)
```

**Step 1 — 1행**

- Array 객체가 만들어진다. 칸 세 개: `0:1`, `1:2`, `2:3`.
- `values`가 그 객체를 가리킨다.

**Step 2 — 2행: `push(4)`**

- `values`를 읽어 객체를 찾는다.
- 3번 칸이 새로 생기고 `4`가 들어간다. **화살표는 그대로다.**
- `push`의 반환값 `4`(새 길이)가 `result`와 연결된다.

```text
객체: [1, 2, 3, 4]
result = 4
```

**Step 3 — 3행 출력**

```text
Output: [ 1, 2, 3, 4 ] 4
```

**Step 4 — 5행: `slice(0, 2)`**

- 인덱스 0과 1을 복사한 **새 Array 객체**가 만들어진다.
- 객체 패널에 상자가 하나 더 생긴다. 원래 상자는 손대지 않았다.
- `copied`가 새 상자를 가리킨다.

```text
객체 1: [1, 2, 3, 4]   ← values
객체 2: [1, 2]         ← copied
```

**Step 5 — 6행 출력**

```text
Output: [ 1, 2 ] [ 1, 2, 3, 4 ]
```

**Step 6 — 8행: `splice(0, 2)`**

- 이번에는 **원래 상자에서** 앞의 두 칸이 빠진다.
- 빠진 값들을 담은 새 Array가 만들어져 반환된다.
- `values`가 가리키는 상자는 `[3, 4]`가 된다.

**Step 7 — 9행 출력**

```text
Output: [ 1, 2 ] [ 3, 4 ]
```

**After**

```text
values  ──▶ [3, 4]     (splice가 원본을 잘랐다)
copied  ──▶ [1, 2]     (slice가 만든 사본. 원본이 잘려도 그대로다)
removed ──▶ [1, 2]     (splice가 돌려준 조각)
```

`copied`와 `removed`의 내용이 같지만 서로 다른 객체이고, 만들어진 경로도 정반대다.

## 10. Visual Script

1. Array를 인덱스 번호가 붙은 칸으로 그린다. `length` 배지를 상자 옆에 항상 표시한다.
2. `push`는 상자 오른쪽에 칸이 자라는 애니메이션으로, 반환값은 **길이 배지에서** 화살표가 나오는 것으로 그린다. 원소에서 나오지 않는다는 것이 중요하다.
3. `slice`는 원본 아래에 새 상자가 생기며 값이 **복사**되는 것으로, 원본 칸은 밝기 변화 없이 유지한다.
4. `splice`는 원본에서 칸이 빠지며 그 칸들이 새 상자로 이동하는 것으로 그린다.
5. 두 메서드를 나란히 놓은 비교 보조 화면을 제공한다. 이름이 비슷한 것이 혼동의 원인이므로 화면에서는 확실히 다르게 보여야 한다.
6. `values[values.length]` 접근은 상자 바깥의 빈 자리를 점선으로 그리고 `undefined`를 띄운다.

## 11. 왜 이렇게 동작하는가

Array는 값이 아니라 **객체**다. 이름은 그 객체를 가리키고, 여러 이름이 같은 객체를 가리킬 수 있다. 그래서 `push`처럼 객체 내부를 바꾸는 조작은 그 객체를 가리키는 모든 이름에서 보인다. J06에서 이 성질을 정면으로 다룬다.

`push`가 길이를 돌려주는 것은 이어서 쓰기 좋기 때문이다. 하지만 실무에서 그 반환값을 쓰는 일은 드물고, 오히려 “Array를 돌려준다”고 착각해 `const next = values.push(4)`라고 쓰는 실수가 훨씬 흔하다.

메서드가 두 무리로 갈리는 것은 언어가 일부러 나눈 것이 아니라 오래 쌓인 결과다. 그래서 이름만으로는 알 수 없고 표로 익혀야 한다. 다만 J12 이후에 배울 `map`·`filter`는 **전부 비변경**이라는 일관된 규칙을 가진다.

## 12. 자주 하는 오해/실수

### 오해 1: `push()`가 새 Array를 돌려준다

```javascript
const values = [1, 2];
const next = values.push(3);
console.log(next);
```

```text
3
```

`next`는 Array가 아니라 길이다. 바뀐 Array가 필요하면 `values`를 그대로 쓴다.

### 오해 2: `slice`와 `splice`는 비슷한 일을 한다

철자만 비슷하다. `slice`는 원본을 두고 복사하고, `splice`는 원본에서 잘라낸다. 이름을 외우기 어렵다면 “`p`가 있는 쪽이 원본을 **부순다**”로 기억한다.

### 오해 3: `===`로 두 Array의 내용을 비교할 수 있다

```javascript
console.log([1, 2] === [1, 2]);
const a = [1, 2];
const b = a;
console.log(a === b);
```

```text
false
true
```

`===`는 “같은 객체를 가리키는가”를 묻는다. 내용이 같은지를 묻지 않는다. 첫 줄은 서로 다른 두 Array를 새로 만들었으므로 `false`다.

### 오해 4: `const`라서 원소도 바꿀 수 없다

J02의 그림을 다시 본다. 못은 화살표에 박혀 있다.

## 13. 업무형/엔지니어형 예제

```javascript
const wafers = ["W01", "W02", "W03"];

wafers.push("W04");
wafers[1] = "W02-R";
console.log(wafers);
console.log(wafers.length, wafers[wafers.length - 1]);

const firstTwo = wafers.slice(0, 2);
console.log(firstTwo);
console.log(wafers);
```

출력:

```text
[ 'W01', 'W02-R', 'W03', 'W04' ]
4 W04
[ 'W01', 'W02-R' ]
[ 'W01', 'W02-R', 'W03', 'W04' ]
```

마지막 두 줄이 요점이다. `firstTwo`를 만든 뒤에도 `wafers`는 네 칸 그대로다. 보고용으로 앞의 두 장만 뽑아 보여 주더라도 원본 목록은 손대지 않았다는 뜻이다.

## 14. 직접 해보기

`["W01", "W02", "W03"]`에서 첫 두 원소를 얻는 코드를 두 가지로 써 보라. 하나는 `slice`, 하나는 `splice`다. **각각 실행 전과 실행 후에 원본을 출력**해서 무엇이 달라졌는지 확인한다. 그다음 “보고서에 앞 두 장만 싣는다”와 “처리 대기열에서 앞 두 장을 꺼낸다” 중 어느 요구에 어느 메서드가 맞는지 한 문장으로 적는다.

## 15. 확인 문제

1. **Concept**: 길이가 4인 Array의 마지막 인덱스는 무엇인가?
2. **Trace**: `push()`의 반환값은 추가된 Array 자체인가?
3. **Fix**: 다음 코드가 원본을 보존하며 앞 두 개를 얻도록 고쳐라.

```javascript
const values = [1, 2, 3];
const head = values.splice(0, 2);
console.log(head, values);
```

## 16. 정답 및 해설

1. `3`이다. 인덱스는 0부터 세므로 마지막은 `length - 1`이다.
2. 아니다. 바뀐 뒤의 길이다.
3.

```javascript
const values = [1, 2, 3];
const head = values.slice(0, 2);
console.log(head, values);
```

```text
[ 1, 2 ] [ 1, 2, 3 ]
```

예측 문제 정답: `[1,2,3,4] 4` / `[1,2] [1,2,3,4]` / `[1,2] [3,4]`.

## 17. 핵심 요약

- Array의 인덱스는 0부터 세고 마지막 인덱스는 `length - 1`이다. 범위 밖 접근은 오류가 아니라 `undefined`다.
- `push`·`pop`·`splice`는 원본을 바꾸고, `slice`·`concat`은 새 Array를 돌려준다.
- `push`의 반환값은 Array가 아니라 길이다.
- `===`는 내용이 아니라 같은 객체인지를 비교한다.

## 18. 다음 레슨 연결

J06에서는 순서가 아니라 **이름으로 찾는** 묶음인 Object를 다룬다. 그리고 이번 레슨에서 잠깐 나온 “같은 객체를 가리킨다”를 정면으로 본다.

---

# J06. Object와 참조

## 1. 레슨 한 줄 질문

**`const b = a;` 뒤에 `b`를 고치면 왜 `a`도 바뀌어 보이는가?**

## 2. 왜 필요한가 / 현실 상황

Wafer 한 장에는 ID, 측정값, 판정 결과가 함께 붙어 있다. 이것을 Array 세 개로 나눠 인덱스를 맞추는 것보다, 이름표가 붙은 한 덩어리로 다루는 편이 정확하다. 그것이 Object다.

그리고 Object를 다른 이름에 넘기는 순간, 프로그래밍 입문에서 가장 많이 물어보는 질문이 나온다. “복사한 줄 알았는데 원본이 바뀌었어요.” 이 레슨은 그 장면을 화면에서 직접 본다.

## 3. 학습 목표

- 점 표기법과 대괄호 표기법을 구분해 쓸 수 있다.
- 속성을 추가·수정하고, 없는 속성을 읽었을 때의 결과를 예측할 수 있다.
- 할당이 객체를 복사하지 않고 참조를 넘긴다는 것을 설명할 수 있다.
- spread(`{ ...obj }`)가 만드는 복사가 어디까지인지 말할 수 있다.

## 4. 핵심 용어

- **속성(property)**: Object 안의 `키: 값` 한 쌍이다.
- **점 표기법**: `wafer.id`. 키 이름이 코드에 고정되어 있다.
- **대괄호 표기법**: `wafer[field]`. 변수에 든 문자열을 키로 쓴다.
- **참조(reference)**: 이름이 객체를 가리키는 연결이다. 값 자체가 아니다.
- **얕은 복사(shallow copy)**: 한 겹만 새로 만들고 안쪽 객체는 그대로 공유하는 복사다.

## 5. Mental Model

Object는 이름표가 붙은 칸의 묶음이다.

```text
const wafer = { id: "W01", measurement: 94.2, passed: true };

wafer ──▶ ┌──────────────┬─────────┐
          │ id           │ "W01"   │
          │ measurement  │ 94.2    │
          │ passed       │ true    │
          └──────────────┴─────────┘
```

할당은 **상자를 복사하지 않는다**. 화살표를 하나 더 그릴 뿐이다.

```text
const same = wafer;

wafer ──┐
        ├──▶ ┌──────────────┬─────────┐
same  ──┘    │ measurement  │ 99.0    │  ← 어느 쪽으로 고쳐도
             └──────────────┴─────────┘     같은 상자가 바뀐다
```

spread는 상자를 하나 새로 만든다. 다만 **한 겹만**이다.

```text
const copied = { ...wafer };

wafer  ──▶ ┌───┬─────┐        copied ──▶ ┌───┬─────┐
           │ a │ 1   │                   │ a │ 1   │
           │ b │ ●───┼──┐                │ b │ ●───┼──┐
           └───┴─────┘  │                └───┴─────┘  │
                        └───────▶ ┌───┬─────┐ ◀───────┘
                                  │ c │ 2   │   안쪽 상자는
                                  └───┴─────┘   여전히 하나다
```

## 6. 핵심 문법 상세 해설

```javascript
const wafer = {
  id: "W01",
  measurement: 94.2,
  passed: true,
};

console.log(wafer.id);
console.log(wafer["id"]);
```

```text
W01
W01
```

두 표기법은 같은 일을 한다. 다른 것은 **키를 어디서 가져오는가**다.

```javascript
const field = "passed";
console.log(wafer.field);
console.log(wafer[field]);
```

```text
undefined
true
```

`wafer.field`는 `"field"`라는 이름의 키를 찾는다. 그런 키가 없으니 `undefined`다. `wafer[field]`는 `field`를 먼저 읽어 `"passed"`를 얻고, 그것을 키로 쓴다. 키 이름이 변수에 들어 있으면 대괄호를 써야 한다.

속성은 언제든 추가하고 바꿀 수 있다.

```javascript
wafer.measurement = 95.1;
wafer.retested = true;
console.log(wafer);
console.log(wafer.operator);
```

```text
{ id: 'W01', measurement: 95.1, passed: true, retested: true }
undefined
```

없는 속성을 읽는 것은 오류가 아니다. `undefined`가 나온다. 다만 그 뒤에 바로 메서드를 부르면 오류가 난다.

```javascript
// TypeError: Cannot read properties of undefined (reading 'length')
console.log(wafer.operator.length);
```

이 오류 메시지의 “of undefined”가 단서다. `wafer`가 아니라 `wafer.operator`가 `undefined`라는 뜻이다.

참조 공유는 이렇게 확인한다.

```javascript
const same = wafer;
same.measurement = 99.0;
console.log(wafer.measurement);

const copied = { ...wafer };
copied.measurement = 97.0;
console.log(wafer.measurement, copied.measurement);
```

```text
99
99 97
```

## 7. 컴퓨터처럼 코드 읽기

```javascript
const a = { value: 1 };
const b = a;
b.value = 2;
console.log(a.value);
```

1. Object 객체가 하나 만들어진다. 칸 하나: `value: 1`.
2. `a`가 그 객체를 가리킨다.
3. `const b = a`: 오른쪽 `a`를 읽는다. 읽은 것은 객체가 아니라 **객체를 가리키는 참조**다. 그 참조를 `b`와 연결한다. 새 객체는 만들어지지 않았다.
4. `b.value = 2`: `b`가 가리키는 객체를 찾아 `value` 칸을 `2`로 바꾼다.
5. `a.value`를 읽는다. `a`가 가리키는 객체는 4번에서 바꾼 바로 그것이다. `2`가 나온다.

3번이 전부다. “복사했다”고 읽으면 5번이 이해되지 않고, “화살표를 하나 더 그렸다”고 읽으면 당연해진다.

## 8. 실행 전 예측 문제

```javascript
const a = { value: 1 };
const b = a;
b.value = 2;

const c = { ...a };
c.value = 3;

console.log(a.value, b.value, c.value);
console.log(a === b, a === c);
```

다섯 개의 값을 적는다. 특히 `c`를 고쳤을 때 `a`가 어떻게 되는지가 앞의 두 줄과 왜 다른지 설명해 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
객체: (없음)
```

**Step 1 — 1행**

- Object 객체가 만들어진다. `value: 1`.
- `a`가 그것을 가리킨다.

**Step 2 — 2행**

- `a`를 읽어 참조를 얻고 `b`와 연결한다.
- **객체 패널에는 아무 변화가 없다.** 새 상자가 생기지 않았다는 것이 이 Step의 관찰 포인트다.

```text
a ──┐
    ├──▶ { value: 1 }
b ──┘
```

**Step 3 — 3행**

- `b`가 가리키는 상자의 `value` 칸이 `1 → 2`로 바뀐다.
- 그 상자를 가리키는 이름이 둘이므로 `a.value`도 `2`다.

**Step 4 — 5행: spread**

- `{ ...a }`가 **새 상자**를 만든다. `a`의 칸들을 하나씩 복사해 넣는다.
- `c`가 새 상자를 가리킨다. 객체 패널에 상자가 둘이 된다.

**Step 5 — 6행**

- `c`가 가리키는 새 상자의 `value`만 `3`이 된다. 첫 상자는 그대로다.

**Step 6~7 — 출력**

```text
2 2 3
true false
```

**After**

```text
상자 1: { value: 2 }   ← a, b 가 함께 가리킨다
상자 2: { value: 3 }   ← c 가 가리킨다
```

`a === b`가 `true`인 이유는 내용이 같아서가 아니라 **같은 상자**여서다. `a === c`는 내용이 달라서가 아니라 다른 상자여서 `false`다. 내용이 똑같아도 `false`였을 것이다.

## 10. Visual Script

1. Object를 키·값 두 칸짜리 표로 그린다. 키 칸은 항상 왼쪽에 고정한다.
2. `const b = a` 실행 때 **새 상자가 생기지 않고 화살표만 하나 늘어나는** 것을 강조한다. 이 레슨의 핵심 장면이므로 잠시 멈춰 보여 준다.
3. 속성 변경 때는 그 상자를 가리키는 **모든 화살표**를 함께 반짝여 “여기서 보는 이름이 둘”임을 보여 준다.
4. spread는 새 상자가 옆에 생기고 칸이 하나씩 복사되는 애니메이션을 준다.
5. 중첩 객체가 있는 경우, 복사된 상자의 안쪽 칸에서 나가는 화살표가 **원본과 같은 곳**을 가리키는 것을 보여 준다. 얕은 복사의 정의가 이 그림이다.
6. `===` 비교는 두 화살표의 끝을 따라가 같은 상자에 도착하는지를 보여 주는 애니메이션으로 그린다.

## 11. 왜 이렇게 동작하는가

원시값과 객체는 저장되는 방식이 다르다. `const x = 3`에서 `3`은 이름 옆에 그대로 놓인다. 반면 Object는 크기가 정해져 있지 않고 나중에 늘어날 수도 있으므로, 이름 옆에는 **어디에 있는지**만 두고 실제 내용은 다른 곳에 둔다. 그래서 이름을 복사하면 위치만 복사된다.

이 설계 덕분에 큰 객체를 함수에 넘길 때 전체를 복사하지 않아도 된다. 대신 함수 안에서 그 객체를 고치면 바깥에서도 보인다. 편의와 위험이 같은 뿌리에서 나온다.

`{ ...obj }`가 한 겹만 복사하는 것도 같은 이유다. 안쪽 값이 또 객체이면 그 값은 “위치”이므로, 위치를 복사하면 같은 곳을 가리킨다. 모든 깊이를 복사하려면 `structuredClone(obj)` 같은 별도의 도구가 필요하다.

## 12. 자주 하는 오해/실수

### 오해 1: 동적 키를 점으로 읽을 수 있다

```javascript
const field = "measurement";
console.log(wafer.field);  // undefined
console.log(wafer[field]); // 실제 값
```

점 뒤에 오는 것은 **글자 그대로의 키**다. 변수에 든 키는 대괄호를 쓴다.

### 오해 2: `const` Object는 속성도 바꿀 수 없다

J02와 같은 이야기다. `const`는 화살표를 고정한다.

### 오해 3: `{ ...obj }`가 완전히 복사한다

```javascript
const source = { id: "W01", limits: { min: 90, max: 100 } };
const copy = { ...source };
copy.limits.max = 200;
console.log(source.limits.max);
```

```text
200
```

한 겹만 복사되었으므로 `limits`는 여전히 같은 상자다.

### 오해 4: 없는 속성을 읽으면 오류가 난다

오류가 나지 않고 `undefined`가 나온다. 오류는 그 `undefined`를 **다시 파고들 때** 난다. 그래서 실패 지점이 원인보다 한두 줄 뒤에 있는 경우가 많다.

## 13. 업무형/엔지니어형 예제

```javascript
const wafer = { id: "W01", measurement: 94.2, passed: true };
const field = "passed";

console.log(wafer.field);
console.log(wafer[field]);

wafer.measurement = 95.1;
wafer.retested = true;

console.log(wafer);
console.log(wafer.operator);
```

출력:

```text
undefined
true
{ id: 'W01', measurement: 95.1, passed: true, retested: true }
undefined
```

첫 줄과 마지막 줄의 `undefined`는 원인이 다르다. 첫 줄은 **표기법을 잘못 골라서**, 마지막 줄은 **그 속성이 실제로 없어서**다. 화면에서는 구분되지 않으므로, `undefined`를 만나면 “키를 잘못 찾았는가, 값이 정말 없는가”를 먼저 나눠 생각한다.

## 14. 직접 해보기

Wafer Object를 하나 만들고 ① 같은 참조 `same`, ② spread 복사본 `copied`를 만들어라. 세 이름의 `measurement`를 각각 다른 값으로 바꾸고 매번 세 이름을 모두 출력한다. 그다음 종이에 상자와 화살표를 그려, 출력 결과가 그림과 맞는지 확인한다.

## 15. 확인 문제

1. **Concept**: 키 이름이 변수 `field`에 들어 있다면 어떤 표기법을 쓰는가?
2. **Trace**: 없는 속성을 읽은 결과는 무엇인가? 오류인가?
3. **Fix**: 다음 코드에서 원본이 바뀌지 않도록 고쳐라.

```javascript
const original = { id: "W01", value: 1 };
const copy = original;
copy.value = 99;
console.log(original.value);
```

## 16. 정답 및 해설

1. 대괄호 표기법 `object[field]`를 쓴다.
2. `undefined`이며 오류가 아니다. 오류는 그 `undefined`의 속성을 다시 읽을 때 난다.
3.

```javascript
const original = { id: "W01", value: 1 };
const copy = { ...original };
copy.value = 99;
console.log(original.value); // 1
```

예측 문제 정답: `2 2 3` / `true false`.

## 17. 핵심 요약

- 점 표기법은 고정된 키, 대괄호 표기법은 변수에 든 키를 쓴다.
- 없는 속성을 읽으면 `undefined`이며 오류가 아니다.
- 할당은 객체를 복사하지 않고 참조를 넘긴다. 두 이름이 같은 상자를 가리킨다.
- `{ ...obj }`는 한 겹만 복사한다. 안쪽 객체는 여전히 공유된다.
- `===`는 내용이 아니라 같은 객체인지를 비교한다.

## 18. 다음 레슨 연결

J07에서는 이렇게 만든 값들을 **판단에 넣는다**. 조건 자리에 Boolean이 아닌 값이 오면 무슨 일이 일어나는지, `[]`와 `"0"`이 왜 참인지를 본다.

---

# J07. 조건문과 조건 표현식

## 1. 레슨 한 줄 질문

**조건 자리에 Boolean이 아닌 값이 오면 엔진은 그것을 어떻게 참·거짓으로 바꾸는가?**

## 2. 왜 필요한가 / 현실 상황

측정값이 규격을 벗어났는지, 입력이 비어 있는지, 이전 오류가 남아 있는지에 따라 프로그램은 다른 길로 간다. `if`는 그 갈림길이다.

JavaScript에서는 갈림길에 Boolean이 아닌 값을 그대로 놓는 코드가 흔하다. `if (name)`, `if (list.length)` 같은 것들이다. 편리하지만 `"0"`은 참이고 `0`은 거짓이며 `[]`도 참이다. 규칙을 모르면 조건이 조용히 반대로 동작한다.

## 3. 학습 목표

- `if` / `else if` / `else`로 하나의 경로만 선택되는 과정을 설명할 수 있다.
- falsy 값 여섯 가지를 말할 수 있다.
- truthy/falsy 변환을 예측할 수 있다.
- 단순한 두 값 선택에 삼항 연산자를 쓸 수 있다.

## 4. 핵심 용어

- **조건식**: `if` 괄호 안의 표현식이다. 값을 하나 만든 뒤 참·거짓으로 바뀐다.
- **분기(branch)**: 조건 결과에 따라 선택되는 코드 경로다.
- **falsy**: 조건 자리에서 거짓으로 취급되는 값이다.
- **truthy**: falsy가 아닌 모든 값이다.
- **삼항 연산자**: `조건 ? 참일 때 값 : 거짓일 때 값`. 문장이 아니라 **값**을 만든다.

## 5. Mental Model

`if` 사슬은 위에서부터 검사하다가 **처음 참인 곳에서 멈춘다**. 그 아래는 검사조차 하지 않는다.

```text
measurement = 104.3

  if (measurement < 90.0)     ─── false ──┐
                                          │ 검사만 하고 지나감
  else if (measurement <= 100.0) ─ false ─┤
                                          │
  else                        ─── 여기 ───┘  status = "HIGH"

  ↓ 사슬 전체에서 실행되는 블록은 정확히 하나 (또는 없음)
```

조건 자리의 값은 Boolean으로 한 번 걸러진다.

```text
값  ──▶ [ falsy 목록에 있는가? ] ──▶ 예 ──▶ 거짓
             │                        (여섯 개뿐이다)
             └── 아니오 ──▶ 참

falsy:  false   0   -0   ""   null   undefined   NaN
그 밖의 모든 값:  "0"  "false"  []  {}  -1  →  전부 참
```

falsy 목록이 짧다는 것이 요령이다. 외울 것은 “참인 것”이 아니라 “거짓인 일곱 가지”뿐이다.

## 6. 핵심 문법 상세 해설

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

console.log(status);
```

```text
HIGH
```

중괄호가 블록의 범위를 정한다. 들여쓰기는 사람이 읽기 위한 것이고 엔진은 중괄호만 본다.

경계값에 주의한다. 위 코드에서 `measurement`가 정확히 `100.0`이면 `PASS`다. `< 100.0`이었다면 `HIGH`가 된다. 규격이 “100 이하 합격”인지 “100 미만 합격”인지는 코드가 아니라 요구사항이 정한다.

조건 자리에 Boolean이 아닌 값이 오면 변환된다.

| falsy 값 | 설명 |
|---|---|
| `false` | 거짓 Boolean |
| `0`, `-0` | 숫자 0 |
| `NaN` | 유효하지 않은 숫자 |
| `""` | 빈 문자열 |
| `null` | 없다고 적어 둔 값 |
| `undefined` | 아직 넣지 않은 값 |

```javascript
console.log(Boolean("0"));
console.log(Boolean("false"));
console.log(Boolean([]));
console.log(Boolean({}));
console.log(Boolean(""));
console.log(Boolean(0));
```

```text
true
true
true
true
false
false
```

`[]`와 `{}`가 참인 것이 특히 자주 문제가 된다. “비어 있으니 거짓이겠지”가 통하지 않는다. 비었는지 보려면 `list.length === 0`처럼 직접 물어야 한다.

삼항 연산자는 값을 만든다.

```javascript
const label = status === "PASS" ? "OK" : "REVIEW";
console.log(label);
```

```text
REVIEW
```

`if`는 문장이라 값이 되지 않지만, 삼항 연산자는 표현식이라 그대로 `const`의 오른쪽에 놓을 수 있다. 값 두 개 중 하나를 고르는 단순한 경우에만 쓴다. 조건이 겹치거나 각 갈래에서 여러 일을 해야 하면 `if`가 읽기 좋다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [0, "0", ""];
for (const value of values) {
  if (value) {
    console.log(value, "참");
  } else {
    console.log(value, "거짓");
  }
}
```

1. Array를 만들고 첫 원소 `0`을 `value`와 연결한다.
2. `if (value)`: `0`은 falsy 목록에 있다. 거짓. `else` 블록으로 간다.
3. `0 거짓`을 출력한다.
4. 다음 원소 `"0"`. 문자열이고 비어 있지 않다. falsy 목록에 없으므로 참.
5. `0 참`을 출력한다. **화면의 `0`이 앞줄과 똑같이 보인다.** 하나는 숫자, 하나는 글자다.
6. 다음 원소 `""`. 빈 문자열은 falsy다. 거짓.
7. ` 거짓`을 출력한다. 빈 문자열이라 앞에 아무것도 보이지 않는다.

3번과 5번의 출력이 눈으로는 구분되지 않는다는 점이 이 예제의 함정이다.

## 8. 실행 전 예측 문제

```javascript
const values = [0, "0", "false", "", null];

for (const value of values) {
  if (value) {
    console.log(value, "→ truthy");
  } else {
    console.log(value, "→ falsy");
  }
}
```

다섯 줄의 출력을 적는다. 특히 `"0"`과 `"false"`가 어느 쪽인지, 그리고 빈 문자열 줄이 화면에서 어떻게 보일지 예상한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
Output: (비어 있음)
```

**Step 1 — 1행**

- 다섯 칸짜리 Array가 만들어진다. 칸마다 타입이 다르다.

**Step 2 — 첫 회차: `value = 0`**

- 조건 검사: `0`은 falsy. 결과 거짓.
- `else` 블록으로 분기한다.

```text
Output: 0 → falsy
```

**Step 3 — 둘째 회차: `value = "0"`**

- 문자열이고 길이가 1이다. falsy 목록에 없다. 결과 참.
- `if` 블록으로 분기한다.

```text
Output: 0 → truthy
```

앞 줄과 화면상 `0`이 같아 보인다. Memory 카드의 타입 배지만이 둘을 구분한다.

**Step 4 — 셋째 회차: `value = "false"`**

- 다섯 글자짜리 문자열이다. 참.

```text
Output: false → truthy
```

글자 `false`가 참으로 판정되는 장면이다. 이 한 줄을 기억하면 규칙 전체가 따라온다.

**Step 5 — 넷째 회차: `value = ""`**

- 빈 문자열은 falsy. 거짓.

```text
Output:  → falsy
```

**Step 6 — 다섯째 회차: `value = null`**

- falsy. 거짓.

```text
Output: null → falsy
```

**After**

```text
0 → falsy
0 → truthy
false → truthy
 → falsy
null → falsy
```

다섯 줄 중 두 줄이 참이다. 둘 다 “비어 있지 않은 문자열”이라는 한 가지 이유로 참이다.

## 10. Visual Script

1. `if` 사슬을 세로로 그리고, 검사한 조건에는 결과 배지를, 검사하지 않은 조건에는 회색 표시를 붙인다.
2. 참인 블록을 만나면 그 아래 `else if`들이 **검사조차 되지 않는다**는 것을 흐리게 처리해 보여 준다.
3. 조건 자리에 Boolean이 아닌 값이 오면 변환 단계를 별도 칸으로 그린다: `값 → Boolean → 분기`.
4. falsy 목록을 조건 검사 순간에 옆에 띄우고, 지금 값이 그 목록에 있는지 하이라이트한다.
5. 같은 화면 표기를 갖는 값(`0`과 `"0"`)이 나올 때는 타입 배지를 크게 강조한다.
6. 삼항 연산자는 두 갈래 중 하나가 값으로 흘러나와 왼쪽 이름에 연결되는 것으로 그린다. 문장이 아니라 값이라는 점이 드러나야 한다.

## 11. 왜 이렇게 동작하는가

JavaScript는 조건 자리에서 값을 Boolean으로 바꾸도록 설계되었다. 이 규칙이 있어 `if (name)`처럼 짧게 쓸 수 있다. 문제는 “비었다”와 “거짓이다”가 값의 종류마다 다르다는 점이다.

문자열과 숫자에는 “비어 있는 상태”가 있다. `""`와 `0`이다. 그래서 이들만 falsy가 되었다. 반면 `[]`와 `{}`는 **객체**이고, 객체는 존재 자체로 참이다. 빈 객체와 채워진 객체를 구분하려면 언어가 안을 들여다봐야 하는데, 그것은 조건 검사가 할 일이 아니라고 본 것이다.

그래서 규칙이 “객체는 무조건 참”으로 단순해졌고, 대신 빈 Array를 검사하려면 사람이 `length`를 직접 물어야 한다. 규칙의 단순함과 사용의 번거로움을 맞바꾼 결과다.

## 12. 자주 하는 오해/실수

### 오해 1: `"false"`는 거짓이다

비어 있지 않은 문자열이므로 참이다. `"0"`도 마찬가지다. 문자열이 문자열의 **내용**대로 판정되는 일은 없다.

### 오해 2: 빈 Array는 거짓이다

```javascript
const list = [];
if (list) {
  console.log("이 줄이 실행된다");
}
if (list.length === 0) {
  console.log("비어 있는지는 이렇게 묻는다");
}
```

```text
이 줄이 실행된다
비어 있는지는 이렇게 묻는다
```

### 오해 3: 들여쓰기가 블록을 만든다

```javascript
if (measurement > 100)
  console.log("HIGH");
  console.log("이 줄은 조건과 무관하게 실행된다");
```

중괄호가 없으면 `if`에 딸리는 것은 **바로 다음 한 문장**뿐이다. 이 과정에서는 언제나 중괄호를 쓴다.

### 오해 4: 경계값은 알아서 포함된다

“100 이하 합격”이라면 `<= 100.0`이라고 적어야 한다. `< 100.0`은 정확히 100인 값을 불합격으로 만든다. 경계값 하나짜리 버그는 테스트에서 잘 걸리지 않는다.

### 오해 5: 중첩 삼항으로 다 해결할 수 있다

```javascript
const grade = v < 90 ? "LOW" : v <= 100 ? "PASS" : "HIGH";
```

동작은 하지만 조건이 셋을 넘어가면 읽기 어렵다. 값을 고르는 것이 아니라 판단을 하는 코드라면 `if` 사슬이 낫다.

## 13. 업무형/엔지니어형 예제

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
console.log(measurement, status, label);
```

출력:

```text
104.3 HIGH REVIEW
```

`status`를 `let`으로 선언한 이유가 여기서 드러난다. 값이 세 갈래 중 하나로 정해지므로 선언 시점에는 무엇이 될지 모른다. 삼항 연산자를 쓰면 `const`로 선언하면서 값을 정할 수 있지만, 갈래가 셋이라 `if` 쪽이 읽기 좋다.

## 14. 직접 해보기

입력값이 `null` 또는 `undefined`이면 `"UNKNOWN"`, 빈 문자열이면 `"EMPTY"`, 그 밖이면 원래 값을 그대로 쓰는 코드를 작성하라. `[null, undefined, "", "EQ-01", 0]` 다섯 값으로 시험하고, `0`이 어느 갈래로 가는지 확인한 뒤 그 결과가 요구사항에 맞는지 판단한다.

## 15. 확인 문제

1. **Concept**: `""`과 `"false"`는 각각 truthy인가 falsy인가?
2. **Trace**: 삼항 연산자의 세 부분을 순서대로 말해 보라.
3. **Fix**: 다음 코드가 빈 Array일 때만 메시지를 내도록 고쳐라.

```javascript
const list = [];
if (list) {
  console.log("비어 있음");
}
```

## 16. 정답 및 해설

1. `""`은 falsy, `"false"`는 truthy다. 비어 있지 않은 문자열은 언제나 참이다.
2. 조건, 참일 때 값, 거짓일 때 값이다.
3.

```javascript
const list = [];
if (list.length === 0) {
  console.log("비어 있음");
}
```

객체는 존재만으로 참이므로 `if (list)`는 언제나 실행된다.

예측 문제 정답: `0 → falsy`, `0 → truthy`, `false → truthy`, ` → falsy`, `null → falsy`.

## 17. 핵심 요약

- `if` 사슬은 처음 참인 블록 하나만 실행하고 나머지는 검사하지 않는다.
- falsy는 `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN` 뿐이다. 나머지는 전부 truthy다.
- `"0"`, `"false"`, `[]`, `{}`는 모두 참이다. 빈 Array는 `length`로 확인한다.
- 삼항 연산자는 문장이 아니라 값을 만든다. 단순한 두 값 선택에만 쓴다.

## 18. 다음 레슨 연결

J08에서는 같은 판단을 **여러 값에 반복해서** 적용한다. 그리고 JavaScript의 세 가지 반복문이 화면에서 서로 다른 수의 단계를 만든다는 것을 본다.

---

# J08. for, while, for...of

## 1. 레슨 한 줄 질문

**세는 반복과 값을 꺼내는 반복은 실행 단계가 어떻게 다른가?**

## 2. 왜 필요한가 / 현실 상황

Wafer 25장, 측정값 1000개를 같은 방식으로 처리하려면 반복이 필요하다. JavaScript에는 반복문이 여러 개 있고 셋 다 자주 쓰인다. 어느 것을 고르느냐에 따라 코드가 드러내는 의도가 달라진다.

전통 `for`는 “몇 번째인가”를 코드에 드러내고, `for...of`는 “무엇인가”만 드러낸다. 인덱스가 필요 없는데 인덱스를 만들면, 읽는 사람은 그 인덱스가 어딘가에서 쓰일 것이라고 기대하게 된다.

## 3. 학습 목표

- 전통 `for`의 네 부분이 각각 몇 번 실행되는지 셀 수 있다.
- `for...of`로 값을 순회하고 `for...in`과 구분할 수 있다.
- `while`로 조건 기반 반복을 쓰고 무한 반복을 피할 수 있다.
- `break`가 반복을 어느 시점에 끝내는지 짚을 수 있다.

## 4. 핵심 용어

- **초기화(init)**: 반복 시작 전에 한 번만 실행되는 부분이다.
- **조건(test)**: 매 회차 **전에** 검사한다. 거짓이면 반복이 끝난다.
- **본문(body)**: 조건이 참일 때 실행되는 블록이다.
- **증감(update)**: 본문 뒤에 실행된다.
- **`break`**: 가장 가까운 반복문을 즉시 끝낸다.

## 5. Mental Model

전통 `for`의 네 부분은 정해진 순서로 돈다. 초기화만 반복 밖에 있다.

```text
for (let index = 0; index < 3; index += 1) { ... }

  ① 초기화 index = 0        (한 번)
        │
        ▼
  ② 조건 index < 3  ──거짓──▶ 반복 끝
        │ 참
        ▼
  ③ 본문 실행
        │
        ▼
  ④ 증감 index += 1
        │
        └──────────▶ ② 로 돌아간다

  길이 3짜리에서:  ① 1회   ② 4회   ③ 3회   ④ 3회
                            ↑
                  마지막 한 번은 "거짓"을 확인하는 검사다
```

`for...of`는 조건 검사가 코드에 드러나지 않는다.

```text
for (const waferId of wafers)

  대기 중:  "W01"  "W02"  "W03"
              ▲
           지금 꺼낸 값 ──▶ waferId

  꺼낼 값이 없으면 반복이 끝난다. index도, 비교식도 코드에 없다.
```

같은 배열을 도는데 화면의 단계 수가 다르다. 이것은 트레이서의 한계가 아니라 두 문법의 실제 차이다.

## 6. 핵심 문법 상세 해설

```javascript
const wafers = ["W01", "W02", "W03"];

for (let index = 0; index < wafers.length; index += 1) {
  console.log(index, wafers[index]);
}
```

```text
0 W01
1 W02
2 W03
```

본문은 3회 실행되지만 조건은 4회 검사된다. 마지막 검사에서 `index`는 3이고 `3 < 3`이 거짓이라 반복이 끝난다.

인덱스가 필요 없으면 `for...of`가 의도를 더 직접 보여 준다.

```javascript
for (const waferId of wafers) {
  console.log(waferId);
}
```

```text
W01
W02
W03
```

`waferId`에는 인덱스가 아니라 **원소 자체**가 들어간다. 매 회차마다 새로 선언되므로 `const`를 쓸 수 있다.

`for...in`은 다르다.

```javascript
for (const key in wafers) {
  console.log(key, typeof key);
}
```

```text
0 string
1 string
2 string
```

`for...in`은 값이 아니라 **키**를 준다. 그리고 Array의 키는 숫자가 아니라 문자열이다. Array를 돌 때는 `for...of`를 쓴다. `for...in`은 Object의 키를 훑을 때 쓴다.

`while`은 조건이 참인 동안 반복한다.

```javascript
const measurements = [93.1, 95.4, 104.2];
let index = 0;

while (index < measurements.length) {
  if (measurements[index] > 100.0) {
    console.log("초과:", index);
    break;
  }
  index = index + 1;
}
```

```text
초과: 2
```

`while`에는 증감 자리가 없다. 본문이 상태를 바꾸지 않으면 조건이 영원히 참이라 프로그램이 멈추지 않는다. `break` 또는 상태 갱신 중 하나는 반드시 있어야 한다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [2, 4];
let total = 0;

for (let i = 0; i < values.length; i += 1) {
  total = total + values[i];
}

console.log(total);
```

1. Array를 만들고 `values`와 연결한다. `total`은 0이다.
2. 초기화 `let i = 0`. 반복 전용 이름 `i`가 생긴다.
3. 조건 `0 < 2` → 참. 본문으로 들어간다.
4. 본문: `values[0]`을 읽어 `2`, `0 + 2 = 2`, `total`을 2로 다시 연결한다.
5. 증감 `i += 1` → `i`는 1.
6. 조건 `1 < 2` → 참. 본문: `values[1]`은 `4`, `2 + 4 = 6`.
7. 증감 → `i`는 2.
8. 조건 `2 < 2` → **거짓**. 본문을 실행하지 않고 반복을 끝낸다.
9. `console.log(total)` → `6`.

8번이 “조건이 4번 아니라 3번 검사되었다”를 확인하는 지점이다. 이 예제는 길이가 2이므로 조건 검사는 3회다.

## 8. 실행 전 예측 문제

```javascript
const wafers = ["W01", "W02", "W03"];
let bodyRuns = 0;
let lastIndex = -1;

for (let index = 0; index < wafers.length; index += 1) {
  bodyRuns = bodyRuns + 1;
  lastIndex = index;
  console.log(index, wafers[index]);
}

console.log("본문", bodyRuns, "회 / 마지막 index", lastIndex);
```

출력 네 줄을 적는다. 그리고 코드에는 보이지 않는 값 하나를 더 예측한다: **조건 검사는 몇 번 실행되며, 마지막 검사 때 `index`는 얼마인가?**

## 9. 단계 실행 Walkthrough

**Before**

```text
wafers = ["W01", "W02", "W03"]
bodyRuns = 0
lastIndex = -1
index는 아직 없다
```

**Step 1 — 초기화**

- `index = 0`. 이 이름은 반복문 헤더에서 만들어지며 반복이 끝나면 사라진다.

**Step 2 — 조건 1회차**

- `0 < 3` → 참. 본문으로 들어간다.

**Step 3 — 본문 1회차**

- `bodyRuns`는 `0 → 1`, `lastIndex`는 `-1 → 0`.
- `wafers[0]`을 읽어 `"W01"`.

```text
Output: 0 W01
```

**Step 4 — 증감**

- `index`는 `0 → 1`. 증감은 본문 **뒤**에 온다는 점을 확인한다.

**Step 5~7 — 2회차**

- 조건 `1 < 3` 참 → 본문 → `index`는 2.

```text
Output: 1 W02
```

**Step 8~10 — 3회차**

- 조건 `2 < 3` 참 → 본문 → `index`는 3.

```text
Output: 2 W03
```

**Step 11 — 조건 4회차**

- `3 < 3` → **거짓**. 본문을 건너뛰고 반복문 다음으로 나간다.
- 이 검사는 출력을 만들지 않지만 실행된 단계다. 화면의 단계 수에는 포함된다.

**Step 12 — 마지막 줄**

```text
Output: 본문 3 회 / 마지막 index 2
```

**After**

```text
bodyRuns  = 3
lastIndex = 2
index     = (사라졌다. 헤더에서 let으로 만든 이름이라 반복문 밖에서는 없다)
```

`lastIndex`를 따로 만든 이유가 이것이다. 반복이 끝난 뒤에 `index`를 읽으려 하면 `ReferenceError`가 난다.

## 10. Visual Script

1. 전통 `for`는 네 부분을 각각 다른 칸으로 그리고, 실행될 때마다 그 칸을 켠다. 실행 횟수 카운터를 칸마다 붙인다.
2. 조건 칸의 카운터가 본문보다 1 크다는 사실이 마지막에 눈에 보여야 한다. 이 레슨의 예측 문제 답이 그것이다.
3. 본문 뒤에서 증감으로, 증감에서 조건으로 돌아가는 곡선 화살표를 그린다. 아래로 빠져나가지 않는다는 것을 보여 준다.
4. `for...of`는 대기 값 목록과 현재 값을 함께 그리고, 조건 칸은 아예 만들지 않는다. 두 반복문을 나란히 놓으면 칸 수가 다르다.
5. `while`은 조건 칸과 본문 칸만 있고 증감 칸이 없다. 대신 본문 안에서 상태를 바꾸는 줄을 강조 표시한다.
6. `break`가 실행되면 남은 대기 값이 흐려지고 반복문 종료 배지가 “break”로 표시된다. “값이 떨어져서 끝난 것”과 구분되어야 한다.

## 11. 왜 이렇게 동작하는가

전통 `for`는 C에서 온 문법이다. 세 부분을 세미콜론으로 나눠 적고, 각각이 “한 번”, “매번 검사”, “매번 실행”이라는 서로 다른 주기를 가진다. 유연하지만 네 부분의 순서를 외워야 한다.

`for...of`는 훨씬 나중에 들어왔다. 대상이 **다음 값을 내놓을 수 있는 것**이기만 하면 되므로 Array뿐 아니라 문자열, `Map`, `Set`에도 쓸 수 있다. 인덱스라는 개념이 아예 없기 때문에 “범위를 벗어난 인덱스” 같은 오류가 생길 수 없다.

`for...in`이 문자열 키를 주는 것은 Object의 키가 원래 문자열이기 때문이다. Array도 내부적으로는 `"0"`, `"1"` 같은 키를 가진 객체다. 그래서 `for...in`으로 Array를 돌면 숫자가 아니라 문자열이 나온다. 이것이 `for...in`을 Array에 쓰면 안 되는 이유 중 하나다.

## 12. 자주 하는 오해/실수

### 오해 1: `index <= array.length`도 된다

```javascript
const wafers = ["W01", "W02"];
for (let i = 0; i <= wafers.length; i += 1) {
  console.log(i, wafers[i]);
}
```

```text
0 W01
1 W02
2 undefined
```

`i`가 `length`와 같은 순간은 마지막 원소의 **다음** 자리다. 오류가 아니라 `undefined`가 나오므로 조용히 지나간다.

### 오해 2: 증감은 본문 앞에 실행된다

본문 뒤다. 그래서 첫 회차의 본문에서 `index`는 초기값 그대로다.

### 오해 3: `for...in`으로 Array 값을 돌 수 있다

키를 준다. 그리고 그 키는 문자열이다. `for...of`를 쓴다.

### 오해 4: `break`는 `if`를 끝낸다

`break`는 가장 가까운 **반복문**을 끝낸다. `if`는 반복문이 아니므로 `if` 안의 `break`도 바깥 반복문을 끝낸다.

### 오해 5: `while`은 언젠가 알아서 끝난다

```javascript
let index = 0;
while (index < 3) {
  console.log(index);
  // index를 바꾸지 않으면 영원히 돈다
}
```

조건에 쓰인 값을 본문이 바꾸는지 반드시 확인한다. 이 사이트에서는 실행 상한이 있어 프로그램이 잘리지만, 실제 환경에서는 브라우저가 멈춘다.

## 13. 업무형/엔지니어형 예제

```javascript
const measurements = [93.1, 95.4, 104.2, 99.8];
const limit = 100.0;

let index = 0;
let firstOver = -1;

while (index < measurements.length) {
  if (measurements[index] > limit) {
    firstOver = index;
    break;
  }
  index = index + 1;
}

console.log("첫 초과 위치:", firstOver);

for (const value of measurements) {
  console.log(value, value > limit ? "OVER" : "ok");
}
```

출력:

```text
첫 초과 위치: 2
93.1 ok
95.4 ok
104.2 OVER
99.8 ok
```

두 반복문이 같은 Array를 돌지만 하는 일이 다르다. 위쪽은 **찾자마자 멈춘다**. 3번 인덱스는 아예 보지 않는다. 아래쪽은 전부 본다. “찾기”와 “훑기”는 다른 작업이고, `break`가 그 차이를 만든다.

`firstOver`를 `-1`로 시작한 것은 “아직 못 찾았다”를 나타내기 위해서다. 초과값이 없으면 `-1`이 그대로 남는다.

## 14. 직접 해보기

같은 Array를 전통 `for`와 `for...of`로 각각 순회하는 코드를 쓰고, 두 버전의 **Step 수**를 화면에서 세어 비교하라. 그다음 “각 줄에 번호를 붙여 출력해야 한다”와 “값만 출력하면 된다”는 두 요구에 각각 어느 버전이 맞는지 고르고 이유를 적는다.

## 15. 확인 문제

1. **Concept**: 전통 `for`의 네 부분은 어떤 순서로 반복되는가?
2. **Trace**: Array 값을 직접 순회할 때 `for...in`과 `for...of` 중 무엇을 쓰는가? 그 이유는?
3. **Fix**: 다음 코드가 마지막에 `undefined`를 출력하지 않도록 고쳐라.

```javascript
const wafers = ["W01", "W02"];
for (let i = 0; i <= wafers.length; i += 1) {
  console.log(wafers[i]);
}
```

## 16. 정답 및 해설

1. 초기화 한 번 뒤 `조건 → 본문 → 증감 → 조건`을 반복한다.
2. `for...of`다. `for...in`은 값이 아니라 키를 주고, Array의 키는 문자열이다.
3.

```javascript
const wafers = ["W01", "W02"];
for (let i = 0; i < wafers.length; i += 1) {
  console.log(wafers[i]);
}
```

`i === length`인 순간은 마지막 원소의 다음 자리다.

예측 문제 정답: `0 W01` / `1 W02` / `2 W03` / `본문 3 회 / 마지막 index 2`. 조건 검사는 4회이고 마지막 검사 때 `index`는 3이다.

## 17. 핵심 요약

- 전통 `for`는 초기화 1회, 조건 `n+1`회, 본문 `n`회, 증감 `n`회 실행된다.
- `for...of`는 값을 직접 주고 조건 검사가 코드에 드러나지 않는다. Array 순회의 기본이다.
- `for...in`은 키를 주며 Array의 키는 문자열이다.
- `while`은 본문이 상태를 바꾸거나 `break`가 있어야 끝난다.
- `break`는 가장 가까운 반복문을 끝낸다.

## 18. 다음 레슨 연결

J09에서는 반복 안에서 하던 일을 **이름 붙은 작업 단위**로 묶는다. 호출할 때 값이 어디로 이동하고 `return` 뒤에 어디로 돌아오는지를 Call Stack에서 본다.

---

# J09. 함수, 매개변수, 반환값

## 1. 레슨 한 줄 질문

**함수를 호출하면 값은 어디로 이동하고, `return` 뒤에는 어디로 돌아오는가?**

## 2. 왜 필요한가 / 현실 상황

“측정값이 규격 안에 있는가”라는 판단이 코드 세 군데에 흩어져 있으면, 규격이 바뀔 때 세 군데를 모두 고쳐야 한다. 하나라도 놓치면 그 자리만 옛 규격으로 남는다.

함수는 그 판단에 이름을 붙여 한 곳에 모은다. 그리고 이름이 붙으면 코드를 읽는 사람이 그 줄에서 “무엇을 하는가”를 다시 해석하지 않아도 된다.

## 3. 학습 목표

- 함수 선언과 호출을 구분하고 인수·매개변수의 이동을 설명할 수 있다.
- `return`이 값을 호출 위치로 돌려주는 과정을 Call Stack에서 짚을 수 있다.
- 기본값 매개변수가 언제 쓰이는지 예측할 수 있다.
- 출력과 반환이 다른 일임을 설명할 수 있다.

## 4. 핵심 용어

- **매개변수(parameter)**: 함수 선언의 괄호 안에 적은 **입력 자리**의 이름이다.
- **인수(argument)**: 호출할 때 실제로 전달하는 값이다.
- **프레임(frame)**: 호출마다 새로 생기는 지역 작업 공간이다.
- **Call Stack**: 프레임이 쌓이는 곳이다. 위가 지금 실행 중인 호출이다.
- **반환값(return value)**: `return`이 호출 위치로 돌려주는 값이다.

## 5. Mental Model

호출은 **작업 공간을 하나 새로 만드는 일**이다. 그 공간은 반환과 함께 사라진다.

```text
  global                          isInRange#1
┌──────────────┐   호출        ┌──────────────────┐
│ passed = ?   │ ──────────▶   │ value  = 94.2    │
│              │   94.2        │ lower  = 90.0    │  ← 기본값이 채운 자리
│              │               │ upper  = 100.0   │
│              │   반환 true   │                  │
│ passed=true  │ ◀──────────   └──────────────────┘
└──────────────┘                    (사라진다)
```

`return`은 두 가지 일을 동시에 한다. **값을 돌려주고**, **그 함수의 실행을 끝낸다**. 아래에 코드가 더 있어도 실행되지 않는다.

```text
function check(value) {
  return value > 100;      ◀── 여기서 함수가 끝난다
  console.log("여기는 실행되지 않는다");
}
```

## 6. 핵심 문법 상세 해설

```javascript
function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

const passed = isInRange(94.2);
console.log(passed);
```

```text
true
```

`function` 뒤에 이름, 괄호 안에 매개변수, 중괄호 안에 본문이 온다. 호출하면 새 프레임이 생기고 매개변수가 인수와 연결된다. 전달하지 않은 자리는 기본값이 채운다.

기본값은 인수가 `undefined`일 때만 쓰인다.

```javascript
console.log(isInRange(94.2));
console.log(isInRange(94.2, 95.0));
console.log(isInRange(94.2, 90.0, 94.0));
```

```text
true
false
false
```

두 번째 호출은 `lower`만 바꿨다. 세 번째는 `upper`를 94.0으로 낮춰 94.2가 벗어났다.

괄호가 있고 없고가 결정적이다.

```javascript
const checker = isInRange;
const result = isInRange(94.2);
console.log(typeof checker, typeof result);
```

```text
function boolean
```

괄호가 없으면 **함수 자체**이고, 괄호가 있으면 **함수를 실행한 결과**다. 이 구분은 J12에서 함수를 다른 함수에 넘길 때 다시 나온다.

함수는 값으로 만들 수도 있다.

```javascript
const half = function (value) {
  return value / 2;
};
console.log(half(10));
```

```text
5
```

함수 선언(`function name() {}`)은 그 줄보다 앞에서도 호출할 수 있지만, `const`에 담은 함수 표현식은 그 줄이 실행된 뒤에만 쓸 수 있다. 이 과정에서는 언제나 정의한 뒤에 호출해 혼동을 없앤다.

`return`이 없으면 `undefined`가 돌아온다.

```javascript
function show(value) {
  console.log(value);
}
const nothing = show(3);
console.log(nothing);
```

```text
3
undefined
```

출력한 것과 돌려준 것은 다르다. `show`는 화면에 썼을 뿐 아무것도 돌려주지 않았다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
function twice(n) {
  return n * 2;
}

const a = 3;
const b = twice(a);
console.log(b);
```

1. 함수 정의가 실행된다. `twice`라는 이름이 함수 객체를 가리킨다. **본문은 아직 돌지 않았다.**
2. `a`는 3.
3. `twice(a)`: 먼저 `a`를 읽어 `3`을 얻는다. 그 값을 들고 호출한다.
4. 새 프레임 `twice#1`이 생긴다. 매개변수 `n`이 `3`과 연결된다. `a`와 `n`은 **다른 이름**이며 지금 같은 값을 가리킬 뿐이다.
5. 본문에서 `n * 2`를 계산해 `6`을 만든다.
6. `return`이 `6`을 호출 위치로 돌려준다. 프레임 `twice#1`이 사라진다.
7. 돌아온 `6`이 `b`와 연결된다.
8. 출력은 `6`.

4번에서 값이 **복사되어 이동**한다는 점이 중요하다. 함수 안에서 `n = 99`로 바꿔도 바깥의 `a`는 그대로다. 다만 인수가 객체이면 이동하는 것이 참조이므로 이야기가 달라진다(J06).

## 8. 실행 전 예측 문제

```javascript
function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

console.log(isInRange(94.2));
console.log(isInRange(94.2, 95.0));
console.log(isInRange(94.2, 90.0, 94.0));
```

세 번의 호출에서 **세 매개변수의 값**과 반환값을 각각 적는다. 기본값이 채워지는 자리와 인수가 채우는 자리를 구분해 적는다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
Memory: (이름 없음)
```

**Step 1 — 함수 정의**

- `isInRange`라는 이름이 생기고 함수 객체를 가리킨다.
- 본문은 실행되지 않았다. 정의는 “나중에 쓸 절차를 등록하는 일”이다.

**Step 2 — 첫 호출: `isInRange(94.2)`**

- 인수 `94.2` 하나만 전달된다.
- 프레임 `isInRange#1`이 생긴다.

```text
Call Stack: [ global | isInRange#1 ]
  value = 94.2   ← 인수가 채웠다
  lower = 90.0   ← 기본값이 채웠다
  upper = 100.0  ← 기본값이 채웠다
```

**Step 3 — 본문 평가**

- `value >= lower` → `94.2 >= 90` → 참.
- 왼쪽이 참이므로 오른쪽도 계산한다. `94.2 <= 100` → 참.
- `&&` 전체가 `true`.

**Step 4 — 반환**

- `true`가 호출 위치로 돌아간다. 프레임이 사라진다.

```text
Output: true
```

**Step 5 — 둘째 호출: `isInRange(94.2, 95.0)`**

```text
  value = 94.2
  lower = 95.0   ← 이번에는 인수가 채웠다
  upper = 100.0  ← 여전히 기본값
```

- `94.2 >= 95.0` → **거짓**.
- `&&`는 왼쪽이 거짓이면 오른쪽을 계산하지 않는다. `value <= upper`는 실행되지 않는다.

```text
Output: false
```

**Step 6 — 셋째 호출: `isInRange(94.2, 90.0, 94.0)`**

```text
  value = 94.2
  lower = 90.0
  upper = 94.0   ← 인수가 채웠다
```

- `94.2 >= 90.0` → 참. 오른쪽도 계산한다.
- `94.2 <= 94.0` → 거짓. 전체 `false`.

```text
Output: false
```

**After**

```text
Call Stack: [ global ]     ← 세 프레임이 모두 생겼다 사라졌다
Output:
true
false
false
```

둘째 호출과 셋째 호출은 답이 같지만 **거짓이 된 지점이 다르다**. 둘째는 첫 비교에서, 셋째는 두 번째 비교에서 갈렸다. 화면의 단계 수가 다르다.

## 10. Visual Script

1. 함수 정의 때 Memory에 함수 카드를 만들고 매개변수 목록을 그 위에 적는다. 본문은 실행되지 않았음을 흐린 표시로 나타낸다.
2. 호출 때 인수가 매개변수로 이동하는 화살표를 하나씩 그린다. 기본값이 채우는 자리는 다른 색 화살표로 구분한다.
3. Call Stack에 프레임이 쌓이는 애니메이션을 준다. 위가 현재 실행 중이다.
4. `&&`의 단축 평가에서 계산하지 않은 오른쪽 항을 흐리게 처리한다. 둘째 호출과 셋째 호출을 나란히 놓으면 흐린 자리가 다르다.
5. `return` 때 값이 프레임에서 호출 위치로 이동하고, 그 직후 프레임이 사라지는 순서를 지킨다. 순서를 바꾸면 값이 어디에서 왔는지 보이지 않는다.
6. 호출이 끝난 뒤 Call Stack이 다시 `global` 하나만 남는 것을 매번 보여 준다.

## 11. 왜 이렇게 동작하는가

프레임을 매번 새로 만드는 이유는 **호출마다 값이 다르기 때문**이다. `isInRange(94.2)`와 `isInRange(101.0)`이 같은 `value`를 공유하면 두 번째 호출이 첫 번째를 덮어쓴다. 재귀 호출에서는 같은 함수가 동시에 여러 번 실행 중일 수도 있으므로, 공간을 나누지 않으면 성립하지 않는다.

기본값이 `undefined`일 때만 적용되는 것도 이유가 있다. `isInRange(94.2, null)`처럼 `null`을 명시적으로 넘겼다면 그것은 “값을 주지 않았다”가 아니라 “없음을 주었다”이다. 두 경우를 구분해야 “인수를 빠뜨렸다”와 “빈 값을 넘겼다”가 다른 결과를 낼 수 있다.

`return`이 함수를 끝내는 것은 “돌려줄 값이 정해졌으면 더 할 일이 없다”는 뜻이다. 그래서 `return`을 조건문 안에 두어 **일찍 빠져나오는** 방식이 자주 쓰인다.

## 12. 자주 하는 오해/실수

### 오해 1: `console.log`가 곧 `return`이다

```javascript
function bad(value) {
  console.log(value * 2);
}
function good(value) {
  return value * 2;
}
console.log(bad(3) + 1);
console.log(good(3) + 1);
```

```text
6
NaN
7
```

`bad(3)`은 `undefined`를 돌려주므로 `undefined + 1`이 `NaN`이 된다. 출력은 사람이 보는 것이고 반환은 코드가 쓰는 것이다.

### 오해 2: 인수를 빠뜨리면 오류가 난다

기본값이 있으면 그 값을, 없으면 `undefined`를 쓴다. 오류는 나지 않는다. 그래서 빠뜨린 인수는 조용히 `undefined`로 흘러가 한참 뒤에 문제를 만든다.

### 오해 3: 이름만 적어도 호출된다

```javascript
console.log(good);
console.log(good(3));
```

```text
[Function: good]
6
```

괄호가 호출이다. 이름만 적으면 함수 자체다.

### 오해 4: `return` 아래 코드도 실행된다

```javascript
function check(value) {
  return value > 100;
  console.log("실행되지 않는다");
}
```

`return`을 만나면 함수가 끝난다.

### 오해 5: 함수 안에서 매개변수를 바꾸면 바깥 변수도 바뀐다

```javascript
function change(n) {
  n = 99;
  return n;
}
const a = 3;
console.log(change(a), a);
```

```text
99 3
```

원시값은 값이 이동하므로 바깥은 그대로다. 다만 인수가 Array나 Object이면 참조가 이동하므로 내부 변경은 바깥에서도 보인다.

## 13. 업무형/엔지니어형 예제

```javascript
function countFinite(values) {
  let count = 0;
  for (const text of values) {
    const value = Number(text);
    if (Number.isFinite(value) && text !== "") {
      count = count + 1;
    }
  }
  return count;
}

const raw = ["94.2", "N/A", "", "101.3"];
const usable = countFinite(raw);
console.log("사용 가능:", usable, "/", raw.length);
```

출력:

```text
사용 가능: 2 / 4
```

함수 안에서 출력하지 않고 **개수를 돌려준다**는 점이 이 예제의 형태다. 그래서 이 함수는 화면에 찍는 데도 쓸 수 있고, 다른 계산에 쓸 수도 있다. 안에서 `console.log`를 했다면 두 번째 용도가 사라진다.

`count`가 `let`인 이유는 회차마다 바뀌기 때문이다. 그리고 그 이름은 프레임 안에만 있으므로 함수 밖에서는 보이지 않는다.

## 14. 직접 해보기

Number Array를 받아 유효값의 **평균**을 돌려주는 `averageFinite(values)`를 작성하라. 함수 안에서는 출력하지 말고, 결과를 바깥에서 출력한다. 빈 Array를 넘겼을 때 무엇을 돌려줄지 먼저 정하고 그 이유를 한 문장으로 적는다.

## 15. 확인 문제

1. **Concept**: 매개변수와 인수의 차이는 무엇인가?
2. **Trace**: `show`와 `show()` 중 어느 것이 호출인가? 나머지는 무엇인가?
3. **Fix**: 다음 코드가 `7`을 출력하도록 고쳐라.

```javascript
function twice(n) {
  console.log(n * 2);
}
console.log(twice(3) + 1);
```

## 16. 정답 및 해설

1. 매개변수는 함수 선언의 입력 자리 이름이고, 인수는 호출할 때 전달하는 실제 값이다.
2. `show()`가 호출이다. `show`는 함수 객체 자체이며 다른 이름에 담거나 다른 함수에 넘길 수 있다.
3.

```javascript
function twice(n) {
  return n * 2;
}
console.log(twice(3) + 1);
```

출력만 하는 함수는 `undefined`를 돌려주므로 뒤의 계산이 `NaN`이 된다.

예측 문제 정답: `true` / `false` / `false`. 매개변수는 각각 `(94.2, 90, 100)`, `(94.2, 95, 100)`, `(94.2, 90, 94)`다.

## 17. 핵심 요약

- 호출마다 새 프레임이 생기고 반환과 함께 사라진다.
- 기본값은 인수가 `undefined`일 때만 적용된다.
- 괄호가 없으면 함수 자체, 있으면 실행 결과다.
- `return`은 값을 돌려주면서 함수를 끝낸다. 없으면 `undefined`가 돌아온다.
- 출력과 반환은 다른 일이다.

## 18. 다음 레슨 연결

J10에서는 같은 함수를 더 짧게 쓰는 Arrow Function을 본다. 그리고 “함수는 값이다”라는 말이 화면에서 정확히 무엇으로 보이는지 확인한다.

---

# J10. Arrow Function

## 1. 레슨 한 줄 질문

**중괄호를 붙이고 떼는 것만으로 반환값이 왜 달라지는가?**

## 2. 왜 필요한가 / 현실 상황

함수를 다른 함수에 넘기는 코드(J12 이후)에서는 함수가 한 줄짜리인 경우가 많다. `function (value) { return value * 2; }`는 그 한 줄을 감싸는 껍질이 본문보다 길다.

Arrow Function은 그 껍질을 줄인다. 다만 줄이는 방법이 두 가지이고, 그 둘을 섞으면 조용히 `undefined`가 나온다. 이 레슨은 그 경계를 정확히 긋는다.

## 3. 학습 목표

- Arrow Function의 두 가지 본문 형태를 구분할 수 있다.
- 암시적 반환과 명시적 반환을 예측할 수 있다.
- Object를 바로 반환할 때 소괄호가 필요한 이유를 설명할 수 있다.
- 함수가 값이라는 것을 화면의 카드로 확인할 수 있다.

## 4. 핵심 용어

- **Arrow Function**: `(매개변수) => 본문` 형태의 함수 값이다.
- **식 본문(expression body)**: 중괄호 없이 표현식 하나를 쓴 형태. 그 값이 자동으로 반환된다.
- **블록 본문(block body)**: 중괄호를 쓴 형태. `return`을 직접 써야 한다.
- **함수 값**: 함수도 다른 값처럼 이름에 담고 넘길 수 있다는 뜻이다.

## 5. Mental Model

같은 함수를 세 가지로 쓸 수 있다. 다른 것은 **껍질뿐**이다.

```text
function difference(value) {          ┐
  return value - 95.0;                │ 선언
}                                     ┘

const difference = function (value) { ┐
  return value - 95.0;                │ 함수 표현식
};                                    ┘

const difference = (value) => value - 95.0;   ← 식 본문 Arrow
```

중괄호가 붙는 순간 규칙이 바뀐다.

```text
(x) => x * 2          중괄호 없음 → 그 값이 반환된다        → 6
(x) => { x * 2; }     중괄호 있음 → return이 없다           → undefined
(x) => { return x * 2; }  중괄호 있음 + return             → 6
                        ↑
             이 한 글자 쌍이 반환 규칙을 바꾼다
```

그리고 함수는 값이다. Memory 카드에 담기고, 다른 함수에 넘어가고, 배열에 들어간다.

```text
double ──▶ ┌─────────────────┐
           │ function        │
           │ (n)             │   ← 힙에 놓인 함수 객체
           │ 정의 위치: 1행   │
           └─────────────────┘
```

## 6. 핵심 문법 상세 해설

```javascript
const difference = (value) => value - 95.0;
console.log(difference(94.2));
```

```text
-0.7999999999999972
```

표현식 하나만 있으면 중괄호와 `return`을 함께 생략한다. 표현식의 값이 그대로 반환된다.

(출력의 긴 꼬리는 부동소수점 표현 때문이다. 화면 표시가 필요하면 `toFixed()`를 쓴다.)

여러 문장이 필요하면 중괄호를 쓴다. 이때는 `return`을 직접 적어야 한다.

```javascript
const describe = (value) => {
  const baseline = 95.0;
  return value - baseline;
};
```

매개변수가 하나면 소괄호도 생략할 수 있지만, 이 과정에서는 항상 적는다. 매개변수가 없거나 둘 이상이면 소괄호가 반드시 필요하므로, 형태를 하나로 통일하는 편이 읽기 쉽다.

```javascript
const now = () => "READY";
const gap = (a, b) => a - b;
```

Object를 바로 반환할 때는 소괄호로 감싼다.

```javascript
const toLabel = (wafer) => ({
  id: wafer.id,
  label: `${wafer.id}:${wafer.measurement}`,
});
```

소괄호가 없으면 `{`가 **함수 본문의 시작**으로 읽힌다. 그러면 안의 `id:`는 속성이 아니라 레이블 문법이 되어 문법 오류가 나거나 `undefined`가 반환된다. 소괄호가 “이것은 값이다”라고 표시해 준다.

`this`에 대해서는 지금 한 가지만 기억한다. Arrow Function은 자기 `this`를 만들지 않고 바깥 것을 그대로 쓴다. 그래서 객체의 메서드로는 보통 일반 함수 문법을 쓴다. 자세한 것은 J20에서 다룬다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const a = (x) => x * 2;
const b = (x) => { x * 2; };

console.log(a(3));
console.log(b(3));
```

1. 첫 줄: 함수 객체가 만들어지고 `a`가 가리킨다. 본문은 아직 돌지 않는다.
2. 둘째 줄: 또 다른 함수 객체가 만들어지고 `b`가 가리킨다.
3. `a(3)`: 프레임이 생기고 `x = 3`. 식 본문이므로 `3 * 2 = 6`이 곧 반환값이다.
4. `6`이 출력된다.
5. `b(3)`: 프레임이 생기고 `x = 3`. 블록 본문이다. `x * 2`를 계산해 `6`을 만든다. **그리고 버린다.** `return`이 없다.
6. 함수가 본문 끝에 도달했으므로 `undefined`를 돌려준다.
7. `undefined`가 출력된다.

5번이 요점이다. 계산은 정상적으로 되었다. 결과를 아무 데도 보내지 않았을 뿐이다. J04에서 본 “반환값을 연결하지 않으면 사라진다”와 같은 장면이다.

## 8. 실행 전 예측 문제

```javascript
const a = (x) => x * 2;
const b = (x) => { x * 2; };
const c = (x) => { return x * 2; };

console.log(a(3), b(3), c(3));
console.log(typeof a, typeof a(3));
```

두 줄의 출력을 적는다. 특히 `b(3)`이 오류인지 값인지, 값이라면 무엇인지 분명히 적는다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
Memory: (이름 없음)
```

**Step 1~3 — 세 함수 정의**

- 함수 객체가 세 개 만들어지고 각각 `a`, `b`, `c`가 가리킨다.
- Memory에 함수 카드가 셋 생긴다. 셋 다 매개변수는 `(x)` 하나다.
- 본문은 하나도 실행되지 않았다.

**Step 4 — `a(3)` 호출**

```text
Call Stack: [ global | a#1 ]
  x = 3
```

- 식 본문 `x * 2` → `3 * 2` → `6`.
- 그 값이 곧 반환값이다.

**Step 5 — `a#1` 반환**

- `6`이 돌아오고 프레임이 사라진다.

**Step 6 — `b(3)` 호출**

```text
Call Stack: [ global | b#1 ]
  x = 3
```

- 블록 본문의 첫 문장 `x * 2;`를 실행한다. `6`이 만들어진다.
- 이 값은 어디에도 연결되지 않는다. 표현식 패널에 잠깐 나타났다 사라진다.

**Step 7 — `b#1` 반환**

- 본문 끝에 도달했다. `return`이 없었으므로 `undefined`를 돌려준다.

**Step 8 — `c(3)` 호출과 반환**

- 블록 본문이지만 `return`이 있다. `6`이 돌아온다.

**Step 9 — 첫 출력**

```text
Output: 6 undefined 6
```

**Step 10 — 둘째 출력**

```text
Output: function number
```

`typeof a`가 `"function"`이라는 것이 “함수도 값”의 증거다. `typeof a(3)`은 호출한 **결과**의 타입이므로 `"number"`다. 괄호 하나가 두 답을 가른다.

**After**

```text
a ──▶ function (x)
b ──▶ function (x)     ← 세 카드가 나란히 남아 있다
c ──▶ function (x)
```

## 10. Visual Script

1. 함수 정의 때 힙에 함수 카드를 만들고 이름 카드에서 화살표를 잇는다. 값과 똑같은 방식으로 그린다 — 그것이 “함수는 값”의 시각적 정의다.
2. 식 본문 호출에서는 표현식 결과에서 곧바로 반환 화살표가 나가는 것으로 그린다.
3. 블록 본문에서 `return` 없이 끝나는 경우, 계산된 값이 만들어졌다가 **연결되지 않고 흐려지는** 애니메이션을 준다. 그리고 별도로 `undefined` 반환 화살표를 그린다. 두 개가 동시에 보여야 “계산은 됐는데 안 돌아왔다”가 이해된다.
4. 세 함수를 나란히 놓고 중괄호 유무를 코드 패널에서 하이라이트한다.
5. Object 반환에서 소괄호가 있는 경우와 없는 경우를 나란히 파싱 결과로 보여 준다.
6. `typeof a`와 `typeof a(3)`을 같은 화면에서 비교해 괄호의 역할을 강조한다.

## 11. 왜 이렇게 동작하는가

Arrow Function의 두 형태는 서로 다른 필요에서 나왔다. 콜백은 대개 “값 하나를 만들어 돌려주는” 일이라, 그 경우를 위해 껍질을 최대한 줄인 식 본문이 있다. 반면 여러 문장이 필요하면 블록이 필요하고, 블록 안에서는 어느 문장이 반환값인지 언어가 알 수 없으므로 `return`이 필요하다.

`{`가 두 가지 뜻(블록 시작 / Object 리터럴)을 갖는 것은 언어의 오래된 사정이다. `=>` 뒤에서는 블록이 훨씬 흔하므로 그쪽을 기본으로 정했고, Object를 돌려주려면 “값이다”라고 표시해야 한다. 그 표시가 소괄호다.

## 12. 자주 하는 오해/실수

### 오해 1: 중괄호를 붙여도 마지막 값이 반환된다

```javascript
const bad = (x) => { x * 2; };
console.log(bad(3));
```

```text
undefined
```

블록 본문에서는 `return`이 필요하다. 이것이 Arrow Function에서 가장 흔한 버그다.

### 오해 2: Object를 그냥 반환할 수 있다

```javascript
const wrong = (id) => { id: id };
const right = (id) => ({ id: id });
console.log(wrong("W01"), right("W01"));
```

```text
undefined { id: 'W01' }
```

`wrong`의 중괄호는 블록으로 읽힌다. 안의 `id:`는 레이블 문법이 되어 아무 값도 만들지 않는다.

### 오해 3: 모든 함수를 Arrow로 바꾸는 편이 낫다

짧은 콜백에는 좋지만, 이름이 필요한 최상위 함수는 `function` 선언이 더 읽기 좋을 때가 많다. 스택 추적에 이름이 남고, 정의 위치가 눈에 띈다.

### 오해 4: `typeof` 결과가 함수 이름이다

`typeof`는 언제나 `"function"`이다. 어떤 함수인지는 알려 주지 않는다.

## 13. 업무형/엔지니어형 예제

```javascript
const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3 },
];

const toLabel = (wafer) => ({
  id: wafer.id,
  label: `${wafer.id}:${wafer.measurement}`,
});

const labels = wafers.map(toLabel);
console.log(labels);
console.log(labels[0].label);
```

출력:

```text
[ { id: 'W01', label: 'W01:94.2' }, { id: 'W02', label: 'W02:101.3' } ]
W01:94.2
```

`wafers.map(toLabel)`에서 `toLabel` 뒤에 괄호가 없다는 점을 본다. 함수를 **넘기는** 것이지 **부르는** 것이 아니다. 부르는 것은 `map`이다.

화면에서 `toLabel` 프레임이 두 번 생겼다 사라지는 것을 확인한다. 우리 코드에는 호출식이 없는데도 프레임이 생긴다. 그것이 J12에서 자세히 볼 콜백이다.

## 14. 직접 해보기

다음 세 가지를 각각 Arrow Function으로 쓰라. ① 숫자를 제곱하는 함수, ② 측정값이 PASS인지 돌려주는 함수, ③ Wafer Object를 받아 `{ id, label }` Object를 돌려주는 함수. 각각 식 본문과 블록 본문 중 어느 쪽이 읽기 좋은지 고르고, ③은 소괄호를 빼면 어떻게 되는지도 실행해 확인한다.

## 15. 확인 문제

1. **Concept**: 표현식 하나짜리 Arrow Function에서 함께 생략할 수 있는 두 가지는 무엇인가?
2. **Trace**: `const f = (x) => { x + 1; };`에서 `f(1)`의 결과는 무엇인가?
3. **Fix**: 다음 함수가 Object를 반환하도록 고쳐라.

```javascript
const toItem = (id) => { id: id, ok: true };
console.log(toItem("W01"));
```

## 16. 정답 및 해설

1. 본문 중괄호와 `return`이다. 둘은 함께 생략되거나 함께 쓰인다.
2. `undefined`다. 계산은 되지만 돌려주지 않는다.
3.

```javascript
const toItem = (id) => ({ id: id, ok: true });
console.log(toItem("W01"));
```

```text
{ id: 'W01', ok: true }
```

예측 문제 정답: `6 undefined 6` / `function number`.

## 17. 핵심 요약

- 식 본문은 중괄호와 `return`을 함께 생략하고, 블록 본문은 `return`이 필요하다.
- Object를 바로 반환하려면 소괄호로 감싼다.
- 함수는 값이다. 이름에 담고 다른 함수에 넘길 수 있다. `typeof`는 `"function"`이다.
- 괄호가 없으면 함수 자체, 있으면 호출 결과다.

## 18. 다음 레슨 연결

J11에서는 이 함수들이 **어느 이름을 볼 수 있는지**를 본다. 그리고 함수가 만들어진 자리의 값을 함수가 계속 기억하는 Closure를 만난다.

---

# J11. Scope, Shadowing, Closure

## 1. 레슨 한 줄 질문

**호출이 끝나 프레임이 사라진 뒤에도, 그 안의 값을 계속 기억하는 함수는 무엇을 붙들고 있는가?**

## 2. 왜 필요한가 / 현실 상황

같은 철자의 이름이 안팎에 있으면 “지금 이 줄의 `status`는 어느 것인가”를 답할 수 있어야 한다. 그리고 “기준값 100을 기억하는 검사 함수”를 만들려면 함수가 만들어진 자리의 값을 붙들 수 있어야 한다.

이 두 가지가 같은 규칙에서 나온다. 이름을 찾는 규칙, 즉 Scope다.

## 3. 학습 목표

- 함수 Scope와 블록 Scope를 구분할 수 있다.
- 같은 이름이 안쪽에서 바깥을 가리는 shadowing을 설명할 수 있다.
- 반환된 함수가 바깥 값을 기억하는 Closure를 설명할 수 있다.
- 서로 다른 호출이 서로 다른 기억을 갖는다는 것을 확인할 수 있다.

## 4. 핵심 용어

- **Scope**: 어떤 이름이 보이는 범위다.
- **shadowing**: 안쪽의 같은 이름이 바깥 이름을 잠시 가리는 것이다. 삭제가 아니다.
- **Closure**: 함수와, 그 함수가 참조하는 바깥 환경의 묶음이다.
- **블록 Scope**: `let`/`const`가 가장 가까운 중괄호 안에서만 보이는 성질이다.

## 5. Mental Model

이름을 찾을 때는 **안쪽에서 바깥으로** 한 겹씩 나간다. 처음 찾은 것을 쓴다.

```text
┌─ global ────────────────────────────────┐
│  status = "GLOBAL"                      │
│                                         │
│  ┌─ inspect#1 ─────────────────────┐    │
│  │  status = "LOCAL"   ◀── 여기서   │    │
│  │  console.log(status)   먼저 찾힌다│   │
│  └─────────────────────────────────┘    │
│                                         │
│  console.log(status)  ◀── 바깥에서는     │
│                            GLOBAL       │
└─────────────────────────────────────────┘
```

안쪽 이름은 바깥 이름을 **가릴 뿐 지우지 않는다**. 프레임이 사라지면 바깥 것이 다시 보인다.

Closure는 이 그림에서 화살표 하나를 남기는 일이다.

```text
makeChecker(90, 100) 호출

  makeChecker#1 ┌──────────────┐
                │ lower = 90   │ ◀────────────┐
                │ upper = 100  │              │ check 함수가
                └──────────────┘              │ 이 환경을 붙들고 있다
                       │ return               │
                       ▼                      │
  normal ──▶ ┌─────────────────┐ ─────────────┘
             │ function check  │
             └─────────────────┘

  makeChecker#1 프레임은 Call Stack에서 사라졌지만
  그 안의 값은 아직 참조되고 있으므로 살아 있다.
```

`makeChecker`를 두 번 부르면 환경도 두 개다. 두 검사 함수는 서로 다른 기준을 기억한다.

## 6. 핵심 문법 상세 해설

함수는 자기 안에서 만든 이름을 밖으로 내보내지 않는다.

```javascript
function inspect() {
  const inner = "LOCAL";
  console.log(inner);
}
inspect();
console.log(inner); // ReferenceError: inner is not defined
```

```text
LOCAL
```

`inner`는 프레임과 함께 사라졌다. 밖에서 그 이름을 찾으면 “그런 이름이 없다”는 오류가 난다. 값이 `undefined`인 것과 이름 자체가 없는 것은 다르다.

같은 이름이 안팎에 있으면 안쪽이 이긴다.

```javascript
const status = "GLOBAL";
function inspect() {
  const status = "LOCAL";
  console.log(status);
}
inspect();
console.log(status);
```

```text
LOCAL
GLOBAL
```

`let`과 `const`는 **블록**에서도 같은 일이 일어난다.

```javascript
const status = "GLOBAL";
if (true) {
  const status = "BLOCK";
  console.log(status);
}
console.log(status);
```

```text
BLOCK
GLOBAL
```

`var`는 블록이 아니라 함수를 경계로 삼기 때문에 이 규칙이 통하지 않는다. 현대 JavaScript에서 `let`/`const`를 기본으로 쓰는 이유 중 하나가 이것이다. 이 과정에서는 `var`를 쓰지 않는다.

Closure는 함수를 돌려줄 때 드러난다.

```javascript
function makeChecker(lower, upper) {
  return function check(value) {
    return value >= lower && value <= upper;
  };
}

const normal = makeChecker(90, 100);
const strict = makeChecker(95, 98);

console.log(normal(96), strict(96));
console.log(normal(94.2), strict(94.2));
```

```text
true true
true false
```

`makeChecker`의 호출은 이미 끝났다. 그런데 `check`가 `lower`와 `upper`를 계속 읽는다. 함수가 “코드만” 기억하는 것이 아니라 **코드와 그 코드가 참조하는 바깥 환경**을 함께 붙들고 있기 때문이다.

두 번의 호출이 두 개의 환경을 만들었으므로 `normal`과 `strict`가 다른 답을 낸다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
function makeCounter() {
  let count = 0;
  return function bump() {
    count = count + 1;
    return count;
  };
}

const next = makeCounter();
console.log(next(), next(), next());
```

1. `makeCounter`가 정의된다.
2. `makeCounter()` 호출. 프레임이 생기고 `count = 0`.
3. `bump` 함수 객체가 만들어진다. 이 함수는 `count`를 참조한다.
4. `bump`가 반환된다. `makeCounter#1` 프레임이 Call Stack에서 빠진다. **그러나 `count`는 사라지지 않는다.** `bump`가 붙들고 있다.
5. `next()` 첫 호출: `count`를 읽어 0, 1을 만들어 다시 연결, 1을 반환.
6. 둘째 호출: 같은 `count`를 읽어 1 → 2.
7. 셋째 호출: 2 → 3.
8. 출력은 `1 2 3`.

5~7번에서 세 번의 호출이 **같은 `count`**를 본다는 점이 Closure의 정의다. 매번 0에서 시작하지 않는다.

## 8. 실행 전 예측 문제

```javascript
const status = "GLOBAL";

function inspect() {
  const status = "LOCAL";
  console.log("안쪽:", status);
}

inspect();
console.log("바깥:", status);

function makeChecker(lower, upper) {
  return function check(value) {
    return value >= lower && value <= upper;
  };
}

const normal = makeChecker(90, 100);
const strict = makeChecker(95, 98);

console.log(normal(96), strict(96));
console.log(normal(94.2), strict(94.2));
```

네 줄의 출력을 적는다. 특히 마지막 두 줄에서 같은 값을 넣었는데 답이 갈리는 경우가 있는지 확인한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
```

**Step 1 — 1행**

- global 프레임에 `status = "GLOBAL"`.

**Step 2 — `inspect()` 호출**

```text
Call Stack: [ global | inspect#1 ]
  global   : status = "GLOBAL"
  inspect#1: (아직 없음)
```

**Step 3 — 함수 안의 선언**

- `inspect#1` 프레임에 `status = "LOCAL"`이 생긴다.
- 이제 같은 철자의 카드가 **두 프레임에 하나씩** 있다. 화면에서 두 카드가 동시에 보인다.

**Step 4 — 안쪽 출력**

- 이름을 찾을 때 현재 프레임부터 본다. `inspect#1`에서 찾았다.

```text
Output: 안쪽: LOCAL
```

**Step 5 — 프레임 종료**

- `inspect#1`이 사라진다. 그 안의 `status` 카드도 함께 사라진다.

**Step 6 — 바깥 출력**

- 이제 global의 `status`만 남았다.

```text
Output: 바깥: GLOBAL
```

**Step 7~8 — `makeChecker(90, 100)`**

- 프레임이 생기고 `lower = 90`, `upper = 100`.
- `check` 함수 객체가 만들어져 반환된다. 프레임이 Call Stack에서 빠진다.
- `normal`이 그 함수를 가리킨다.

**Step 9~10 — `makeChecker(95, 98)`**

- 또 다른 프레임, 또 다른 `lower`/`upper`, 또 다른 `check` 객체.
- `strict`가 그것을 가리킨다.

**Step 11 — `normal(96)`**

```text
Call Stack: [ global | check#1 ]
  value = 96
```

- `96 >= lower`를 계산할 때 `lower`를 찾는다. 현재 프레임에 없으므로 **함수가 기억하는 바깥 환경**에서 찾는다. `90`이다.
- 표현식 패널에 `96 >= 90`으로 치환되어 나타난다. **이 치환된 숫자가 기억하고 있던 값의 정체다.**
- `96 <= 100` → 참. 반환 `true`.

**Step 12 — `strict(96)`**

- 같은 코드, 다른 환경. `96 >= 95` 참, `96 <= 98` 참 → `true`.

```text
Output: true true
```

**Step 13 — `normal(94.2)`, `strict(94.2)`**

- `normal`: `94.2 >= 90` 참, `94.2 <= 100` 참 → `true`.
- `strict`: `94.2 >= 95` → **거짓**. 단축 평가로 오른쪽은 계산하지 않는다 → `false`.

```text
Output: true false
```

**After**

```text
normal ──▶ check   ── 기억: lower=90,  upper=100
strict ──▶ check   ── 기억: lower=95,  upper=98

같은 코드를 가리키는 두 함수가 서로 다른 답을 낸다.
```

## 10. Visual Script

1. 프레임마다 이름 카드를 따로 그린다. 같은 철자가 두 프레임에 있으면 둘 다 보이게 하고, 지금 읽히는 쪽만 강조한다.
2. 이름을 찾는 순간 안쪽 프레임에서 바깥으로 훑는 화살표를 짧게 보여 준다. 처음 찾은 곳에서 멈춘다.
3. 프레임이 사라질 때 그 안의 카드가 함께 사라지는 것으로 shadowing이 “삭제가 아니라 가림”임을 보여 준다.
4. Closure는 프레임이 Call Stack에서 빠지되 **그 카드 묶음이 함수 카드에 매달린 채 남는** 것으로 그린다. Call Stack에서는 사라지고 화면에서는 남는 이 두 가지가 동시에 보여야 한다.
5. `normal`과 `strict`의 기억 묶음을 서로 다른 색으로 구분해 나란히 배치한다.
6. 비교식이 치환될 때(`96 >= 90`) 그 `90`이 어느 기억 묶음에서 왔는지 연결선을 그린다. Closure가 화면에 드러나는 유일한 순간이다.

## 11. 왜 이렇게 동작하는가

함수는 정의될 때 “내가 어디에서 만들어졌는지”를 함께 기억한다. 호출된 위치가 아니라 **정의된 위치**가 기준이다. 이것을 정적(lexical) Scope라고 한다. 코드를 읽는 것만으로 어떤 이름이 어디에서 오는지 알 수 있다는 뜻이라, 사람이 추론할 수 있다.

프레임이 사라져도 값이 남는 이유는, 값이 사라지는 기준이 “호출이 끝났는가”가 아니라 “아직 참조하는 것이 있는가”이기 때문이다. `check`가 `lower`를 참조하는 한 그 값은 정리되지 않는다.

이 성질은 J12 이후의 콜백에서 계속 쓰인다. `values.filter((v) => v > limit)`에서 `limit`은 콜백 바깥의 이름이다. 콜백이 그것을 볼 수 있는 것이 바로 Closure다.

## 12. 자주 하는 오해/실수

### 오해 1: shadowing은 바깥 변수를 바꾼다

```javascript
const status = "GLOBAL";
function inspect() {
  const status = "LOCAL";
}
inspect();
console.log(status);
```

```text
GLOBAL
```

가릴 뿐이다. 프레임이 사라지면 원래대로다.

### 오해 2: 바깥 함수가 끝나면 기억도 사라진다

`makeCounter`의 `count`는 프레임이 빠진 뒤에도 살아 있다. “Call Stack에서 사라짐”과 “값이 정리됨”은 다른 사건이다.

### 오해 3: 같은 함수를 가리키면 결과도 같다

`normal`과 `strict`는 같은 `check` 코드를 쓰지만 다른 환경을 기억한다. 코드가 같다고 결과가 같지 않다.

### 오해 4: Closure가 기억하는 것은 값의 사본이다

사본이 아니라 그 이름 자체다. 그래서 나중에 바뀌면 바뀐 값이 보인다.

```javascript
function makeReader() {
  let value = 1;
  const read = () => value;
  value = 99;
  return read;
}
console.log(makeReader()());
```

```text
99
```

### 오해 5: `var`도 블록 Scope다

아니다. `var`는 함수 경계만 본다. 이 과정에서는 쓰지 않는다.

## 13. 업무형/엔지니어형 예제

```javascript
function makeHighChecker(limit) {
  return function isHigh(value) {
    return value > limit;
  };
}

const overSpec = makeHighChecker(100.0);
const overWarn = makeHighChecker(98.0);
const measurements = [94.2, 99.1, 104.3];

for (const value of measurements) {
  console.log(value, overWarn(value), overSpec(value));
}
```

출력:

```text
94.2 false false
99.1 true false
104.3 true true
```

가운데 줄이 두 기준을 나누는 값이다. 99.1은 경고 기준은 넘었지만 규격은 넘지 않았다.

기준값을 함수의 매개변수로 매번 넘기는 대신 **한 번 기억시켜 두는** 것이 이 형태의 목적이다. 반복문 안에서는 값만 넘기면 되므로 호출부가 짧아지고, 기준이 바뀌면 함수를 만드는 한 줄만 고치면 된다.

## 14. 직접 해보기

기준값 하나를 기억해 `value > limit`을 돌려주는 `makeHighChecker(limit)`를 직접 작성하라. 서로 다른 limit으로 함수를 두 개 만들고 같은 값을 검사해, 두 함수가 다른 답을 내는 것을 확인한다. 그다음 두 함수가 각각 기억하는 값을 종이에 상자로 그려 본다.

## 15. 확인 문제

1. **Concept**: shadowing은 바깥 이름을 삭제하는가?
2. **Trace**: Closure가 기억하는 것은 함수 코드뿐인가?
3. **Fix**: 다음 코드가 `1 2 3`을 출력하도록 고쳐라.

```javascript
function makeCounter() {
  return function bump() {
    let count = 0;
    count = count + 1;
    return count;
  };
}
const next = makeCounter();
console.log(next(), next(), next());
```

## 16. 정답 및 해설

1. 삭제하지 않는다. 안쪽에서만 가리며 프레임이 끝나면 바깥 것이 다시 보인다.
2. 아니다. 함수 코드와 그 코드가 참조하는 바깥 환경의 묶음이다.
3.

```javascript
function makeCounter() {
  let count = 0;
  return function bump() {
    count = count + 1;
    return count;
  };
}
const next = makeCounter();
console.log(next(), next(), next());
```

`count`가 `bump` 안에 있으면 호출마다 새로 만들어져 언제나 1이 된다. 기억되어야 할 값은 **바깥 함수**에 두어야 한다.

예측 문제 정답: `안쪽: LOCAL` / `바깥: GLOBAL` / `true true` / `true false`.

## 17. 핵심 요약

- 이름은 안쪽 Scope부터 바깥으로 찾고 처음 찾은 것을 쓴다.
- shadowing은 가리는 것이지 삭제가 아니다.
- `let`/`const`는 블록 Scope, `var`는 함수 Scope다. `var`는 쓰지 않는다.
- Closure는 함수와 그 함수가 참조하는 바깥 환경의 묶음이다. 호출마다 별도의 환경이 만들어진다.
- 기억하는 것은 값의 사본이 아니라 이름 자체다.

## 18. 다음 레슨 연결

J12에서는 함수를 **다른 함수에 넘긴다**. 우리가 호출식을 쓰지 않았는데도 프레임이 생기는 장면을 보게 되고, 그때 이 레슨의 Closure가 그대로 쓰인다.

---

# J12. map

## 1. 레슨 한 줄 질문

**우리 코드에는 호출식이 없는데, 콜백 함수의 프레임은 왜 생기는가?**

## 2. 왜 필요한가 / 현실 상황

측정값 목록을 편차 목록으로, 문자열 목록을 숫자 목록으로 바꾸는 일은 데이터 처리의 절반이다. `for` 반복문으로도 되지만, “빈 Array를 만들고, 돌면서, push한다”는 세 줄이 매번 반복된다.

`map`은 그 세 줄을 하나로 줄인다. 대신 **함수를 값으로 넘기는** 방식을 쓴다. J10에서 본 “함수는 값이다”가 여기서 처음 실제로 쓰인다.

## 3. 학습 목표

- `map`이 콜백을 원소마다 한 번씩 호출한다는 것을 확인할 수 있다.
- 결과 Array의 길이가 원본과 같은 이유를 설명할 수 있다.
- 콜백에서 `return`을 빠뜨렸을 때의 결과를 예측할 수 있다.
- 콜백이 받는 두 번째 인수(인덱스)를 쓸 수 있다.

## 4. 핵심 용어

- **콜백(callback)**: 다른 함수에 넘겨 **그쪽이 부르게** 하는 함수다.
- **고차 함수**: 함수를 인수로 받거나 함수를 돌려주는 함수다. `map`이 그것이다.
- **변환(map)**: 각 원소를 새 값으로 바꿔 같은 길이의 새 Array를 만드는 일이다.
- **비변경**: 원본 Array를 바꾸지 않는다는 뜻이다.

## 5. Mental Model

`map`은 칸마다 한 번씩 콜백을 부르고, 그 **반환값**을 같은 자리에 넣는다.

```text
values   ┌──────┬──────┬──────┐
         │  1   │  2   │  3   │
         └──┬───┴──┬───┴──┬───┘
            │      │      │      각 칸마다 콜백을 한 번씩 부른다
            ▼      ▼      ▼
         콜백(1) 콜백(2) 콜백(3)
            │      │      │      콜백이 return한 값이
            ▼      ▼      ▼      같은 자리에 놓인다
doubled  ┌──────┬──────┬──────┐
         │  10  │  20  │  30  │  ← 길이는 언제나 원본과 같다
         └──────┴──────┴──────┘

values 는 그대로다.
```

호출식이 우리 코드에 없다는 점이 중요하다. `values.map(double)`에는 `double(...)`이 없다. 부르는 것은 `map`이다.

```text
우리가 쓴 것 :  values.map(double)      ← double 뒤에 괄호가 없다
map이 하는 일:  double(1) → double(2) → double(3)
```

## 6. 핵심 문법 상세 해설

```javascript
const measurements = [94.2, 101.3, 96.0];
const deviations = measurements.map((value) => value - 95.0);
console.log(deviations);
console.log(measurements);
```

```text
[ -0.7999999999999972, 6.299999999999997, 1 ]
[ 94.2, 101.3, 96 ]
```

원본은 그대로다. `map`은 언제나 새 Array를 만든다.

(긴 소수 꼬리는 부동소수점 표현 때문이다. 보고용으로는 `toFixed()`를 쓴다.)

콜백은 값 외에 인덱스도 받을 수 있다.

```javascript
const labels = measurements.map((value, index) => `M${index}:${value}`);
console.log(labels);
```

```text
[ 'M0:94.2', 'M1:101.3', 'M2:96' ]
```

`map`은 콜백에 세 개의 인수(값, 인덱스, 원본 Array)를 넘긴다. 우리는 필요한 만큼만 매개변수로 받으면 된다. 받지 않은 인수는 그냥 무시된다.

이미 만들어 둔 함수를 넘길 수도 있다.

```javascript
const toNumber = (text) => Number(text);
const numbers = ["94.2", "101.3"].map(toNumber);
console.log(numbers);
```

```text
[ 94.2, 101.3 ]
```

`toNumber` 뒤에 괄호가 없다는 점을 다시 확인한다. 괄호를 붙이면 지금 한 번 호출해 그 **결과**를 넘기게 된다.

콜백에 중괄호를 쓰면 `return`이 필요하다(J10).

```javascript
const wrong = [1, 2].map((value) => {
  value * 10;
});
console.log(wrong);
```

```text
[ undefined, undefined ]
```

오류가 아니다. 길이는 그대로 2이고 내용만 `undefined`다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [1, 2];
const doubled = values.map((value) => value * 10);
console.log(doubled);
```

1. Array를 만들고 `values`와 연결한다.
2. 화살표 함수 객체가 만들어진다. **아직 호출되지 않았다.** 이 객체가 `map`에 인수로 전달된다.
3. `map`이 시작된다. 결과를 담을 새 Array를 준비한다.
4. `map`이 0번 칸의 값 `1`을 들고 콜백을 부른다. 프레임이 생기고 `value = 1`. `1 * 10 = 10`을 반환한다. 프레임이 사라진다.
5. 반환된 `10`이 결과 Array의 0번 칸에 놓인다.
6. 1번 칸으로 같은 일을 한다. `20`이 1번 칸에 놓인다.
7. 칸이 더 없으므로 `map`이 결과 Array를 돌려준다.
8. `doubled`가 그 Array를 가리킨다.

4번과 6번에서 프레임이 생겼다 사라진다. 우리 코드에는 그 호출이 적혀 있지 않은데도 그렇다. 이것이 이 레슨의 관찰 포인트다.

## 8. 실행 전 예측 문제

```javascript
const values = [1, 2, 3];
const calls = [];

const doubled = values.map((value) => {
  calls.push(value);
  return value * 10;
});

const missing = values.map((value) => {
  value * 10;
});

console.log(doubled);
console.log(missing);
console.log("콜백 호출 횟수:", calls.length, calls);
console.log("원본:", values);
```

네 줄의 출력을 적는다. 특히 `missing`의 **길이**와 **내용**을 각각 적고, 콜백이 몇 번 호출되었는지 예측한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
values = [1, 2, 3]
calls  = []
Call Stack: [ global ]
```

**Step 1 — `map` 시작**

- 콜백 함수 객체가 만들어져 `map`에 전달된다.
- 아직 아무 프레임도 생기지 않았다.

**Step 2 — 콜백 1회차**

```text
Call Stack: [ global | map 콜백#1 ]
  value = 1
```

- `calls.push(1)` — 바깥 Array를 건드린다. 콜백이 바깥 이름 `calls`를 볼 수 있는 것은 J11의 Closure다.
- `1 * 10 = 10`을 반환한다.

**Step 3 — 프레임 종료**

- `map 콜백#1`이 사라진다. 반환된 `10`이 결과의 0번 자리로 간다.

**Step 4~7 — 2, 3회차**

- 같은 일이 두 번 더 일어난다. 프레임 이름이 `#2`, `#3`으로 늘어난다.
- `calls`는 `[1, 2, 3]`이 된다.

**Step 8 — `doubled` 연결**

```text
doubled ──▶ [10, 20, 30]
values  ──▶ [1, 2, 3]      (그대로)
```

**Step 9~12 — 둘째 `map`**

- 콜백이 또 세 번 호출된다. 매번 `value * 10`을 계산한다.
- 계산 결과는 어디에도 연결되지 않고 사라진다. 함수가 본문 끝에 도달하므로 `undefined`가 반환된다.
- 결과 Array의 세 칸에 `undefined`가 놓인다.

**Step 13~16 — 출력**

```text
[ 10, 20, 30 ]
[ undefined, undefined, undefined ]
콜백 호출 횟수: 3 [ 1, 2, 3 ]
원본: [ 1, 2, 3 ]
```

**After**

```text
doubled ──▶ [10, 20, 30]
missing ──▶ [undefined, undefined, undefined]   ← 길이는 3이다
values  ──▶ [1, 2, 3]                            ← 한 번도 바뀌지 않았다
```

`missing`이 빈 Array가 아니라는 점을 확인한다. 콜백은 정상적으로 세 번 실행되었고, 돌려준 값이 `undefined`였을 뿐이다.

## 10. Visual Script

1. `map` 호출 시 원본 Array 아래에 빈 결과 Array를 미리 그린다. 칸 수가 같다는 것이 처음부터 보여야 한다.
2. 회차마다 원본의 한 칸이 강조되고, 그 값이 콜백 프레임의 매개변수로 이동하는 화살표를 그린다.
3. 콜백 프레임이 생겼다 사라지는 것을 매 회차 보여 준다. Call Stack의 깊이가 오르내린다.
4. 반환값이 결과 Array의 **같은 인덱스** 칸으로 이동하는 화살표를 그린다. 자리가 어긋나지 않는다는 것이 `map`의 정의다.
5. 콜백이 바깥 이름(`calls`)을 읽을 때 프레임 밖으로 나가는 연결선을 보여 준다. Closure가 여기서 쓰인다.
6. `return`이 없는 콜백에서는 계산된 값이 흐려지고 대신 `undefined`가 결과 칸으로 가는 것을 나란히 그린다.

## 11. 왜 이렇게 동작하는가

`map`은 반복의 **모양**을 고정하고 안에서 할 일만 바꿀 수 있게 만든 도구다. “빈 Array 준비 → 돌면서 → 결과를 push → 돌려주기”라는 뼈대는 언제나 같고, 다른 것은 “각 원소로 무엇을 만드는가”뿐이다. 그 다른 부분을 함수로 떼어 인수로 받는다.

그래서 `map`을 쓰면 읽는 사람이 뼈대를 다시 읽지 않아도 된다. `for` 반복문을 보면 “이 반복이 무엇을 만드는가”를 본문에서 찾아야 하지만, `map`을 보면 “원본과 같은 길이의 새 Array”라는 것을 이름만으로 안다.

결과 길이가 항상 같은 것도 그래서다. 개수를 바꾸는 것은 `map`의 일이 아니라 `filter`의 일이다(J13).

## 12. 자주 하는 오해/실수

### 오해 1: 콜백에 중괄호를 쓰고 `return`을 빠뜨린다

가장 흔한 실수다. 결과가 `[undefined, ...]`가 되고 길이는 그대로라, 다음 단계까지 조용히 흘러간다.

### 오해 2: `map`이 원본을 바꾼다

바꾸지 않는다. 원본을 바꾸고 싶으면 결과를 다시 연결하거나 처음부터 다른 방법을 쓴다.

### 오해 3: 함수를 넘길 때 괄호를 붙인다

```javascript
const numbers = ["1", "2"].map(Number);
```

`Number` 뒤에 괄호가 없다. 붙이면 지금 한 번 호출해 그 결과(`NaN`)를 넘기게 된다.

### 오해 4: 결과가 필요 없어도 `map`을 쓴다

```javascript
values.map((value) => console.log(value));
```

동작하지만 `[undefined, undefined, ...]`라는 쓸모없는 Array를 만든다. 출력만 할 것이라면 `for...of`가 의도를 정확히 보여 준다.

### 오해 5: 콜백은 값 하나만 받는다

값, 인덱스, 원본 Array 세 개를 받는다. 필요한 만큼만 매개변수로 적으면 된다.

## 13. 업무형/엔지니어형 예제

```javascript
const raw = ["94.2", "101.3", "N/A"];

const numbers = raw.map((text) => Number(text));
const labels = raw.map((text, index) => `M${index}:${text}`);

console.log(numbers);
console.log(labels);
console.log(raw);
```

출력:

```text
[ 94.2, 101.3, NaN ]
[ 'M0:94.2', 'M1:101.3', 'M2:N/A' ]
[ '94.2', '101.3', 'N/A' ]
```

세 번째 값이 `NaN`이 되었다. `map`은 **거르지 않는다**. 길이가 같아야 하므로 실패한 값도 자리를 지킨다.

이것이 문제가 아니라 설계다. 변환과 선별은 다른 일이고, 다음 레슨의 `filter`가 선별을 맡는다. 두 단계를 이어 쓰면 `raw.map(...).filter(...)`가 된다.

## 14. 직접 해보기

`["94.2", "101.3", "N/A"]`를 Number Array로 바꾸고, `NaN`이 몇 번째 자리에 남는지 확인하라. 그다음 같은 일을 `for...of`와 `push`로 다시 써 보고, 두 코드에서 “반복의 뼈대”가 차지하는 줄 수를 세어 비교한다.

## 15. 확인 문제

1. **Concept**: 입력 길이가 4이면 `map` 결과의 길이는 얼마인가?
2. **Trace**: 콜백에서 `return`을 빠뜨리면 결과 Array에는 무엇이 들어가는가?
3. **Fix**: 다음 코드가 `[10, 20]`을 만들도록 고쳐라.

```javascript
const result = [1, 2].map((value) => {
  value * 10;
});
console.log(result);
```

## 16. 정답 및 해설

1. 4다. `map`은 개수를 바꾸지 않는다.
2. `undefined`가 들어간다. 콜백은 정상적으로 호출되었고 돌려준 값이 없을 뿐이다.
3.

```javascript
const result = [1, 2].map((value) => value * 10);
console.log(result);
```

또는 중괄호를 유지하고 `return`을 적는다.

```javascript
const result = [1, 2].map((value) => {
  return value * 10;
});
```

예측 문제 정답: `[10, 20, 30]` / `[undefined, undefined, undefined]` / `콜백 호출 횟수: 3 [1, 2, 3]` / `원본: [1, 2, 3]`.

## 17. 핵심 요약

- `map`은 원소마다 콜백을 한 번 부르고 그 반환값으로 같은 길이의 새 Array를 만든다.
- 원본은 바뀌지 않는다.
- 콜백에 중괄호를 쓰면 `return`이 필요하다. 빠뜨리면 `undefined`가 채워진다.
- 콜백은 값, 인덱스, 원본 Array를 받는다.
- 함수를 넘길 때는 괄호를 붙이지 않는다.

## 18. 다음 레슨 연결

J13에서는 **개수를 바꾸는** 도구를 본다. 조건에 맞는 것만 남기는 `filter`와, 하나만 찾고 멈추는 `find`가 어떻게 다른지 확인한다.

---

# J13. filter와 find

## 1. 레슨 한 줄 질문

**“모두 고르기”와 “하나 찾기”는 실행 단계에서 무엇이 다른가?**

## 2. 왜 필요한가 / 현실 상황

측정값 목록에서 규격을 벗어난 것만 보고 싶을 때가 있고, 첫 번째 이상값이 어디인지만 알면 되는 때가 있다. 두 요구는 비슷해 보이지만 하는 일이 다르다. 하나는 전부 검사하고, 하나는 찾는 즉시 멈춘다.

그리고 돌려주는 것의 **모양**이 다르다. 하나는 Array, 하나는 원소(또는 `undefined`)다. 이 차이를 놓치면 `.length`를 엉뚱한 것에 부르게 된다.

## 3. 학습 목표

- `filter`가 조건에 맞는 **원본 원소**를 모아 새 Array를 만든다는 것을 설명할 수 있다.
- `find`가 처음 참인 원소 하나를 돌려주고 멈춘다는 것을 확인할 수 있다.
- 찾지 못했을 때의 결과를 각각 예측하고 처리할 수 있다.
- 두 메서드의 콜백 호출 횟수 차이를 셀 수 있다.

## 4. 핵심 용어

- **술어(predicate)**: 참·거짓을 돌려주는 콜백이다. `filter`와 `find`가 쓴다.
- **선별(filter)**: 조건에 맞는 원소만 남긴 새 Array를 만드는 일이다.
- **탐색(find)**: 조건에 맞는 첫 원소 하나를 돌려주는 일이다.
- **단축(short-circuit)**: 답이 정해지면 나머지를 보지 않는 것이다.

## 5. Mental Model

두 메서드는 같은 술어를 쓰지만 결과의 모양과 멈추는 시점이 다르다.

```text
values = [94.2, 101.3, 96.0, 88.7]
조건   = value > 100

filter                              find
┌──────┐ 검사 → 거짓 → 버림          ┌──────┐ 검사 → 거짓 → 다음
│ 94.2 │                            │ 94.2 │
├──────┤ 검사 → 참   → 담음          ├──────┤ 검사 → 참 → 이것을 돌려주고 끝
│101.3 │                            │101.3 │ ◀── 반환값
├──────┤ 검사 → 거짓                 ├──────┤
│ 96.0 │                            │ 96.0 │  검사하지 않음
├──────┤ 검사 → 거짓                 ├──────┤
│ 88.7 │                            │ 88.7 │  검사하지 않음
└──────┘                            └──────┘
결과: [101.3]  (Array, 길이 1)      결과: 101.3   (원소 그 자체)
콜백 4회                            콜백 2회
```

찾지 못했을 때도 다르다.

```text
조건에 맞는 것이 하나도 없으면

  filter  ──▶  []          빈 Array. 길이 0. 반복해도 안전하다.
  find    ──▶  undefined   Array가 아니다. .length를 부르면 오류다.
```

## 6. 핵심 문법 상세 해설

```javascript
const values = [94.2, 101.3, 96.0, 88.7];

const passed = values.filter((value) => value >= 90 && value <= 100);
const firstHigh = values.find((value) => value > 100);

console.log(passed);
console.log(firstHigh);
```

```text
[ 94.2, 96 ]
101.3
```

`filter`의 콜백은 원소를 **바꾸지 않는다**. 참이면 원본 원소를 그대로 결과에 담는다. `map`과 헷갈리기 쉬운 지점이다.

```text
map    : 콜백의 반환값이 결과에 들어간다
filter : 콜백의 반환값은 참·거짓 판정에만 쓰이고, 결과에는 원본 원소가 들어간다
```

찾지 못한 경우를 확인한다.

```javascript
const negative = values.filter((value) => value < 0);
const firstNegative = values.find((value) => value < 0);

console.log(negative, negative.length);
console.log(firstNegative);
```

```text
[] 0
undefined
```

`find`의 결과를 그대로 쓰면 위험하다.

```javascript
console.log(firstNegative.toFixed(1)); // TypeError
```

그래서 `find` 뒤에는 보통 확인이 따라온다.

```javascript
if (firstNegative !== undefined) {
  console.log(firstNegative.toFixed(1));
} else {
  console.log("없음");
}
```

`filter`는 빈 Array를 돌려주므로 이런 확인 없이 바로 반복할 수 있다. 반복이 0회 돌 뿐이다.

관련된 메서드도 함께 알아 둔다.

| 메서드 | 돌려주는 것 | 멈추는가 |
|---|---|---|
| `filter(fn)` | 조건에 맞는 원소들의 새 Array | 아니오 |
| `find(fn)` | 첫 원소 또는 `undefined` | 예 |
| `findIndex(fn)` | 첫 원소의 인덱스 또는 `-1` | 예 |
| `some(fn)` | 하나라도 참이면 `true` | 예 |
| `every(fn)` | 전부 참이면 `true` | 예(거짓을 만나면) |

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [1, 5, 9];
const big = values.find((value) => value > 4);
console.log(big);
```

1. Array를 만든다.
2. 술어 함수 객체가 만들어져 `find`에 넘어간다.
3. `find`가 0번 칸의 `1`로 콜백을 부른다. `1 > 4` → 거짓. 다음으로 간다.
4. 1번 칸의 `5`로 부른다. `5 > 4` → **참**.
5. `find`가 즉시 멈춘다. 2번 칸의 `9`는 콜백에 넘어가지 않는다.
6. 참이 나온 원소 `5`를 돌려준다. **`true`가 아니라 `5`다.**
7. `big`은 `5`.

5번이 `filter`와의 차이다. `filter`였다면 `9`도 검사해 `[5, 9]`를 돌려주었을 것이다.

## 8. 실행 전 예측 문제

```javascript
const values = [94.2, 101.3, 96.0, 88.7];

const passed = values.filter((value) => value >= 90 && value <= 100);
const firstHigh = values.find((value) => value > 100);
const negative = values.filter((value) => value < 0);
const firstNegative = values.find((value) => value < 0);

console.log(passed);
console.log(firstHigh);
console.log(negative, negative.length);
console.log(firstNegative);
```

네 줄의 출력을 적는다. 그리고 코드에 보이지 않는 값을 하나 더 예측한다: **네 번의 호출에서 콜백은 각각 몇 번 실행되는가?**

## 9. 단계 실행 Walkthrough

**Before**

```text
values = [94.2, 101.3, 96.0, 88.7]
Call Stack: [ global ]
```

**Step 1~4 — 첫 `filter`: 네 번의 검사**

- 94.2 → `94.2 >= 90` 참, `94.2 <= 100` 참 → **담는다**.
- 101.3 → 첫 비교는 참, `101.3 <= 100` 거짓 → 버린다.
- 96.0 → 둘 다 참 → **담는다**.
- 88.7 → `88.7 >= 90` 거짓. 단축 평가로 두 번째 비교는 하지 않는다 → 버린다.

콜백 프레임이 네 번 생겼다 사라진다.

```text
passed ──▶ [94.2, 96]
```

**Step 5~6 — `find`: 두 번의 검사**

- 94.2 → `94.2 > 100` 거짓. 다음.
- 101.3 → 참. **여기서 멈춘다.**
- 96.0과 88.7로는 콜백이 호출되지 않는다. 화면의 대기 칸이 회색으로 남는다.

```text
firstHigh = 101.3
```

**Step 7~10 — 둘째 `filter`: 네 번의 검사, 아무것도 담기지 않음**

- 네 값 모두 `value < 0`이 거짓이다.
- 결과는 빈 Array다. **객체는 만들어졌다.** `null`이 아니다.

```text
negative ──▶ []   (length 0)
```

**Step 11~14 — 둘째 `find`: 네 번의 검사, 못 찾음**

- 끝까지 갔지만 참이 없었다.
- `undefined`를 돌려준다. 이번에는 단축이 일어나지 않아 콜백이 네 번 호출된다.

**Step 15~18 — 출력**

```text
[ 94.2, 96 ]
101.3
[] 0
undefined
```

**After**

```text
콜백 호출 횟수:  filter 4  ·  find 2  ·  filter 4  ·  find 4

find는 "빨리 찾으면 빨리 멈춘다". 못 찾으면 filter와 같은 횟수를 돈다.
```

## 10. Visual Script

1. 원본 Array의 칸을 세로로 그리고, 검사한 칸에는 참·거짓 배지를 붙인다. 검사하지 않은 칸은 회색으로 남긴다.
2. `filter`는 참인 칸에서 결과 Array로 **원본 값이 그대로** 이동하는 화살표를 그린다. 값이 변형되지 않는다는 것이 보여야 한다.
3. `find`는 참을 만나는 순간 남은 칸이 회색으로 굳고 종료 배지가 켜진다. `filter`와 나란히 놓으면 회색 칸의 유무가 한눈에 다르다.
4. 콜백 호출 카운터를 각 메서드 옆에 표시한다. 이 레슨의 예측 문제 답이 그 숫자다.
5. 결과의 모양을 다르게 그린다. `filter`는 상자, `find`는 값 하나. 빈 결과일 때 `[]`와 `undefined`의 차이가 특히 분명해야 한다.
6. `undefined`에 `.length`를 부르는 순간을 오류 경로로 보여 주는 보조 화면을 둔다.

## 11. 왜 이렇게 동작하는가

두 메서드가 나뉜 이유는 **질문이 다르기 때문**이다. “조건에 맞는 것이 몇 개이고 무엇인가”와 “조건에 맞는 것이 있는가, 있다면 첫 번째는 무엇인가”는 다른 질문이다. 후자는 답이 정해지는 순간 더 볼 이유가 없다.

`filter`가 빈 Array를 돌려주고 `find`가 `undefined`를 돌려주는 것도 각 질문에 맞는 답이다. “해당 없음”을 Array로 표현하면 빈 Array이고, 원소 하나로 표현하면 “그런 것 없음”이다. `find`가 빈 Array를 돌려줄 수는 없다 — 그러면 원소가 Array인 경우와 구분되지 않는다.

`filter`의 콜백이 원소를 바꿀 수 없는 것도 설계다. 바꾸는 일은 `map`이 한다. 두 일을 한 메서드에 넣으면 “참을 돌려주면 담고, 다른 값을 돌려주면 그 값을 담는다” 같은 규칙이 필요해지고, `0`이나 `""`을 돌려주는 순간 무너진다.

## 12. 자주 하는 오해/실수

### 오해 1: `filter` 결과가 `[true, false, ...]`다

```javascript
const result = [1, 5].filter((v) => v > 3);
console.log(result);
```

```text
[ 5 ]
```

콜백의 반환값은 판정에만 쓰인다. 결과에는 원본 원소가 들어간다.

### 오해 2: `find` 결과에 `.length`를 부를 수 있다

`find`는 Array가 아니라 원소를 돌려준다. 개수가 필요하면 `filter(...).length`를 쓴다.

### 오해 3: 못 찾은 `find` 결과를 바로 쓴다

```javascript
const found = [1, 2].find((v) => v > 10);
console.log(found.toFixed(1)); // TypeError
```

`undefined`인지 먼저 확인한다. 또는 `find(...) ?? 기본값`을 쓴다.

### 오해 4: `filter`도 찾으면 멈춘다

멈추지 않는다. 전부 검사한다. 첫 하나만 필요하면 `find`를 쓴다.

### 오해 5: `filter`가 원본을 바꾼다

바꾸지 않는다. `map`과 마찬가지로 새 Array를 돌려준다.

## 13. 업무형/엔지니어형 예제

```javascript
const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3 },
  { id: "W03", measurement: 96.0 },
];

const passed = wafers.filter((wafer) => wafer.measurement <= 100.0);
const firstHigh = wafers.find((wafer) => wafer.measurement > 100.0);

console.log("합격:", passed.length, "장");
for (const wafer of passed) {
  console.log(" ", wafer.id, wafer.measurement);
}

if (firstHigh) {
  console.log("첫 초과:", firstHigh.id, firstHigh.measurement);
} else {
  console.log("초과 없음");
}
```

출력:

```text
합격: 2 장
  W01 94.2
  W03 96
첫 초과: W02 101.3
```

`passed`는 Array이므로 바로 반복한다. 합격이 하나도 없어도 반복이 0회 돌 뿐이라 별도 확인이 필요 없다.

`firstHigh`는 원소 하나이므로 `if`로 확인한 뒤 쓴다. 여기서 `if (firstHigh)`가 쓸 수 있는 이유는 Object가 언제나 truthy이기 때문이다(J07). 다만 원소가 숫자 `0`일 수 있는 목록이라면 `!== undefined`로 명시적으로 비교해야 한다.

## 14. 직접 해보기

Wafer Object Array에서 ① 모든 PASS 레코드, ② 첫 HIGH 레코드를 각각 찾아라. HIGH가 하나도 없는 목록으로도 실행해, 두 결과가 각각 무엇이 되는지 확인한다. 그다음 `find` 결과를 확인 없이 바로 쓰면 어떤 오류가 나는지 실제로 만들어 본다.

## 15. 확인 문제

1. **Concept**: 모든 일치 항목이 필요할 때와 첫 항목만 필요할 때 각각 어떤 메서드를 쓰는가?
2. **Trace**: `find()`가 아무것도 찾지 못하면 무엇을 돌려주는가? `filter()`는?
3. **Fix**: 다음 코드가 오류 없이 동작하도록 고쳐라.

```javascript
const values = [1, 2, 3];
const found = values.find((value) => value > 10);
console.log(found.toFixed(1));
```

## 16. 정답 및 해설

1. 전부 필요하면 `filter()`, 첫 하나면 `find()`다.
2. `find()`는 `undefined`, `filter()`는 빈 Array `[]`다.
3.

```javascript
const values = [1, 2, 3];
const found = values.find((value) => value > 10);
if (found !== undefined) {
  console.log(found.toFixed(1));
} else {
  console.log("없음");
}
```

예측 문제 정답: `[94.2, 96]` / `101.3` / `[] 0` / `undefined`. 콜백 호출은 각각 4회, 2회, 4회, 4회다.

## 17. 핵심 요약

- `filter`는 조건에 맞는 **원본 원소**를 모은 새 Array를, `find`는 첫 원소 하나를 돌려준다.
- `find`는 참을 만나면 멈춘다. `filter`는 끝까지 검사한다.
- 못 찾으면 `filter`는 `[]`, `find`는 `undefined`다. 후자는 쓰기 전에 확인한다.
- 둘 다 원본을 바꾸지 않는다.

## 18. 다음 레슨 연결

J14에서는 여러 값을 **하나로 줄인다**. 합계와 집계표를 만드는 `reduce`에서 회차마다 무엇이 다음 회차로 넘어가는지 본다.

---

# J14. reduce

## 1. 레슨 한 줄 질문

**여러 값이 하나가 되는 동안, 회차와 회차 사이를 무엇이 건너가는가?**

## 2. 왜 필요한가 / 현실 상황

합계, 평균, 최댓값, 상태별 개수 — 목록을 요약한 값 하나로 줄이는 일은 보고서의 마지막 단계다. `for`와 누적 변수로도 되지만, 그 패턴이 반복되면 “무엇을 누적하는가”가 코드 속에 묻힌다.

`reduce`는 그 누적을 명시적으로 드러낸다. 대신 콜백이 인수를 두 개 받고, 그 반환값이 다음 회차로 넘어간다. 이 연결 고리를 놓치면 결과가 조용히 `undefined`나 `NaN`이 된다.

## 3. 학습 목표

- 콜백의 반환값이 다음 회차의 누적값이 된다는 것을 설명할 수 있다.
- 초기값이 무엇을 정하는지 말할 수 있다.
- 회차별 누적값의 변화를 표로 적을 수 있다.
- 누적 대상이 Object인 집계표를 만들 수 있다.

## 4. 핵심 용어

- **누적값(accumulator)**: 지금까지의 결과다. 회차마다 갱신된다.
- **초기값**: 첫 회차의 누적값이다. `reduce`의 두 번째 인수다.
- **집계(reduce)**: 여러 값을 하나로 줄이는 일이다.

## 5. Mental Model

`reduce`는 누적값을 손에 들고 칸을 하나씩 지나간다. 매번 **새 누적값을 받아 든다**.

```text
초기값 0
   │
   ▼
  0  +  94.2  ──▶  94.2      (1회차 반환값)
   │
   ▼
94.2 + 101.3  ──▶ 195.5      (2회차 반환값 = 1회차 반환값을 이어받았다)
   │
   ▼
195.5 + 96.0  ──▶ 291.5      (3회차 반환값)
   │
   ▼
 결과 291.5                   마지막 반환값이 reduce 전체의 값이다
```

콜백이 반환하지 않으면 그 자리에서 사슬이 끊긴다.

```text
0 + 94.2 ──▶ (return 없음) ──▶ undefined
                                   │
                                   ▼
                         undefined + 101.3 ──▶ NaN
                                   │
                                   ▼
                                 NaN + 96.0 ──▶ NaN
```

첫 회차의 실수가 마지막까지 번진다. 그래서 `reduce`의 오류는 어디서 시작됐는지 찾기 어렵다.

## 6. 핵심 문법 상세 해설

```javascript
const values = [94.2, 101.3, 96.0];
const total = values.reduce((accumulator, value) => accumulator + value, 0);
console.log(total);
```

```text
291.5
```

마지막 인수 `0`이 초기값이다. 콜백은 `(누적값, 현재값)` 순서로 받는다.

| 회차 | 들어온 누적값 | 현재값 | 반환한 새 누적값 |
|---:|---:|---:|---:|
| 1 | 0 | 94.2 | 94.2 |
| 2 | 94.2 | 101.3 | 195.5 |
| 3 | 195.5 | 96.0 | 291.5 |

초기값을 생략하면 규칙이 달라진다.

```javascript
console.log([1, 2, 3].reduce((a, b) => a + b));
console.log([1, 2, 3].reduce((a, b) => a + b, 10));
```

```text
6
16
```

초기값이 없으면 **첫 원소가 초기 누적값**이 되고 콜백은 두 번째 원소부터 호출된다. 그리고 빈 Array에서는 오류가 난다.

```javascript
console.log([].reduce((a, b) => a + b, 0));
```

```text
0
```

초기값을 주면 빈 Array도 안전하다. 결과의 타입도 초기값이 정한다. 그래서 이 과정에서는 언제나 초기값을 적는다.

누적값이 Object이면 집계표가 된다.

```javascript
const statuses = ["PASS", "FAIL", "PASS"];
const counts = statuses.reduce((acc, status) => {
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});
console.log(counts);
```

```text
{ PASS: 2, FAIL: 1 }
```

`acc[status] ?? 0`은 “아직 그 키가 없으면 0부터”라는 뜻이다. `??`는 왼쪽이 `null`이나 `undefined`일 때만 오른쪽을 쓴다(J03의 `||`와 달리 `0`이나 `""`은 그대로 통과시킨다).

여기서 `return acc;`를 빠뜨리면 두 번째 회차의 `acc`가 `undefined`가 되어 `undefined[status]`에서 오류가 난다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const values = [1, 2, 3];
const total = values.reduce((sum, value) => sum + value, 10);
console.log(total);
```

1. Array를 만든다. 콜백 함수 객체가 만들어져 `reduce`에 넘어간다.
2. `reduce`가 누적값을 초기값 `10`으로 시작한다.
3. 1회차: 콜백을 `(10, 1)`로 부른다. `11`을 반환한다. `reduce`가 누적값을 `11`로 갱신한다.
4. 2회차: `(11, 2)`. `13`을 반환한다.
5. 3회차: `(13, 3)`. `16`을 반환한다.
6. 칸이 더 없다. 마지막 반환값 `16`이 `reduce`의 결과다.
7. `total`은 16.

3~5번에서 누적값은 **`reduce`가 들고 있다**. 우리 코드에 누적 변수가 없다는 점이 `for` 버전과의 차이다.

## 8. 실행 전 예측 문제

```javascript
const values = [1, 2, 3];
const total = values.reduce((sum, value) => sum + value, 10);
console.log(total);

const statuses = ["PASS", "FAIL", "PASS"];
const counts = statuses.reduce((acc, status) => {
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});
console.log(counts);

const empty = [].reduce((sum, value) => sum + value, 0);
console.log(empty);
```

세 줄의 출력을 적는다. 그리고 첫 번째 `reduce`의 **회차별 누적값**을 표로 적는다.

## 9. 단계 실행 Walkthrough

**Before**

```text
values = [1, 2, 3]
Call Stack: [ global ]
```

**Step 1 — `reduce` 시작**

- 누적값이 초기값 `10`으로 놓인다. 이 값은 우리 코드의 이름이 아니라 `reduce`가 들고 있는 것이다.

**Step 2 — 1회차**

```text
Call Stack: [ global | reduce 콜백#1 ]
  sum   = 10
  value = 1
```

- `10 + 1 = 11`을 반환한다. 프레임이 사라진다.
- 누적값이 `11`이 된다.

**Step 3 — 2회차**

```text
  sum   = 11    ◀── 앞 회차의 반환값이 여기로 들어왔다
  value = 2
```

- `13`을 반환한다.

**Step 4 — 3회차**

```text
  sum   = 13
  value = 3
```

- `16`을 반환한다. 칸이 더 없다.

**Step 5 — 결과**

```text
total = 16
Output: 16
```

**Step 6~8 — 집계표 `reduce`**

- 초기값은 빈 Object `{}`. 객체 패널에 칸 없는 상자가 생긴다.
- 1회차 `("PASS")`: `acc["PASS"]`는 없으므로 `undefined`. `?? 0`이 `0`을 고른다. `0 + 1 = 1`을 `PASS` 칸에 쓴다. `acc`를 반환한다.
- 2회차 `("FAIL")`: 같은 상자에 `FAIL: 1` 칸이 생긴다.
- 3회차 `("PASS")`: `acc["PASS"]`는 이제 `1`. `?? `는 왼쪽이 `null`/`undefined`가 아니므로 그대로 쓴다. `1 + 1 = 2`.

**중요**: 세 회차가 **같은 상자**를 고쳤다. 누적값이 Object이면 `reduce`는 매번 새 상자를 만드는 것이 아니라 같은 상자를 돌린다. 그래서 `return acc`가 필요하다 — 반환하지 않으면 다음 회차가 상자를 못 받는다.

```text
Output: { PASS: 2, FAIL: 1 }
```

**Step 9 — 빈 Array**

- 콜백이 한 번도 호출되지 않는다. 초기값이 그대로 결과가 된다.

```text
Output: 0
```

**After**

```text
total  = 16
counts ──▶ { PASS: 2, FAIL: 1 }   (초기값으로 준 그 상자)
empty  = 0                        (콜백 0회 호출)
```

## 10. Visual Script

1. 누적값을 Array 바깥의 별도 칸으로 그린다. 그것이 `reduce`가 들고 있는 값이며 우리 코드의 이름이 아니라는 것이 보여야 한다.
2. 회차마다 그 칸의 값이 콜백의 첫 매개변수로 이동하고, 반환값이 다시 그 칸으로 돌아오는 순환을 그린다. 이 왕복이 `reduce`의 전부다.
3. 회차별 누적값의 이력을 `10 → 11 → 13 → 16`으로 쌓아 보여 준다.
4. `return`이 없는 콜백에서는 누적 칸이 `undefined`로 바뀌고, 그다음 회차부터 `NaN`이 번지는 것을 그대로 보여 준다.
5. 누적값이 Object인 경우, 매 회차가 **같은 상자**를 고치는 것을 강조한다. 새 상자가 생기지 않는다.
6. 빈 Array에서는 콜백 프레임이 한 번도 생기지 않고 초기값이 바로 결과가 되는 것을 보여 준다.

## 11. 왜 이렇게 동작하는가

`reduce`는 “왼쪽부터 접어 나가기”다. 이름이 `reduce`(줄이다)인 것은 여러 값이 하나로 줄기 때문이다. `map`이 개수를 유지하고 `filter`가 개수를 줄인다면, `reduce`는 개수를 1로 만든다.

초기값이 선택 사항인 것은 오래된 설계다. 없으면 첫 원소를 쓰는 편이 합계 같은 경우에 편하지만, 빈 Array에서 오류가 나고 결과 타입이 원소 타입에 묶인다. 집계표처럼 결과 타입이 원소와 다른 경우에는 초기값이 반드시 필요하다.

`reduce`가 강력한 이유는 `map`과 `filter`를 모두 표현할 수 있기 때문이다. 하지만 그 강력함이 곧 “무엇을 하는 코드인지 이름만으로 알 수 없다”는 뜻이기도 하다. 합계나 집계처럼 “하나로 줄인다”가 분명한 경우에 쓰고, 변환이나 선별은 이름이 그것을 말해 주는 `map`·`filter`에 맡긴다.

## 12. 자주 하는 오해/실수

### 오해 1: 콜백에서 반환을 빠뜨린다

```javascript
const bad = [1, 2, 3].reduce((sum, value) => {
  sum + value;
}, 0);
console.log(bad);
```

```text
undefined
```

첫 회차가 `undefined`를 반환하면 다음 회차의 누적값이 `undefined`가 되고, 마지막까지 번진다.

### 오해 2: 초기값 없이 써도 괜찮다

빈 Array에서 오류가 나고, 결과 타입이 원소 타입에 묶인다. 언제나 적는 편이 안전하다.

### 오해 3: 매 회차 새 누적 Object가 만들어진다

누적값이 Object이면 같은 상자를 계속 고친다. `return acc`가 그 상자를 다음 회차로 넘기는 유일한 통로다.

### 오해 4: 콜백 인수 순서를 바꿔도 된다

첫 번째가 누적값, 두 번째가 현재값이다. 순서를 바꾸면 이름만 바뀌는 것이 아니라 값이 뒤바뀐다.

### 오해 5: 하나의 `reduce`에 전부 넣는 편이 효율적이다

변환·선별·집계를 한 콜백에 넣으면 읽기 어려워진다. 중간 결과에 이름을 붙이는 편이 이해를 도우면 `map` → `filter` → `reduce`로 나눈다.

## 13. 업무형/엔지니어형 예제

```javascript
const wafers = [
  { id: "W01", measurement: 94.2, status: "PASS" },
  { id: "W02", measurement: 101.3, status: "FAIL" },
  { id: "W03", measurement: 96.0, status: "PASS" },
];

const total = wafers.reduce((sum, wafer) => sum + wafer.measurement, 0);
const average = total / wafers.length;

const counts = wafers.reduce((acc, wafer) => {
  acc[wafer.status] = (acc[wafer.status] ?? 0) + 1;
  return acc;
}, {});

console.log("합계", total.toFixed(1), "평균", average.toFixed(2));
console.log(counts);
```

출력:

```text
합계 291.5 평균 97.17
{ PASS: 2, FAIL: 1 }
```

두 `reduce`가 같은 목록을 돌지만 누적값의 **타입**이 다르다. 하나는 숫자, 하나는 Object다. 초기값이 그 타입을 정한다는 것이 여기서 분명해진다.

`average`를 `reduce` 안에서 계산하지 않은 이유는 나눗셈이 마지막에 한 번만 필요하기 때문이다. 회차마다 나누면 결과가 틀린다.

## 14. 직접 해보기

`["PASS", "FAIL", "PASS"]`를 `{ PASS: 2, FAIL: 1 }`로 집계하는 코드를 작성하라. 회차마다 누적 Object가 어떤 상태인지 표로 적고, `return acc`를 빼면 어느 회차에서 무엇이 실패하는지 실제로 실행해 확인한다. 그다음 같은 일을 `for...of`로 다시 써서 두 코드를 비교한다.

## 15. 확인 문제

1. **Concept**: 다음 회차의 누적값은 어디에서 오는가?
2. **Trace**: 빈 Array에서도 안전하게 합계 0을 얻으려면 무엇이 필요한가?
3. **Fix**: 다음 코드가 `6`을 출력하도록 고쳐라.

```javascript
const total = [1, 2, 3].reduce((sum, value) => {
  sum + value;
}, 0);
console.log(total);
```

## 16. 정답 및 해설

1. 직전 회차 콜백의 반환값이다.
2. 초기값 `0`을 준다. 초기값이 없으면 빈 Array에서 오류가 난다.
3.

```javascript
const total = [1, 2, 3].reduce((sum, value) => sum + value, 0);
console.log(total);
```

또는 중괄호를 유지하고 `return sum + value;`를 적는다.

예측 문제 정답: `16` / `{ PASS: 2, FAIL: 1 }` / `0`. 첫 `reduce`의 누적값은 `10 → 11 → 13 → 16`이다.

## 17. 핵심 요약

- 콜백의 반환값이 다음 회차의 누적값이 된다. 반환을 빠뜨리면 사슬이 끊긴다.
- 초기값은 첫 누적값이자 결과의 타입을 정한다. 빈 Array에서도 안전하다.
- 누적값이 Object이면 매 회차가 같은 상자를 고친다.
- 콜백 인수는 `(누적값, 현재값)` 순서다.

## 18. 다음 레슨 연결

J15에서는 이렇게 만든 요약 Object에서 **필요한 값만 꺼내는** 문법을 본다. 구조 분해 할당으로 여러 이름을 한 줄에 만든다.

---

# J15. 구조 분해 할당

## 1. 레슨 한 줄 질문

**Array는 위치로, Object는 이름으로 꺼낸다 — 그 차이는 코드의 어디에 드러나는가?**

## 2. 왜 필요한가 / 현실 상황

`wafer.id`, `wafer.measurement`, `wafer.status`를 한 함수 안에서 열 번 쓰면 `wafer.`이 열 번 반복된다. 읽는 사람은 매번 “어느 객체의 것인가”를 확인해야 한다.

구조 분해는 필요한 값을 **처음에 한 번** 꺼내 이름을 붙인다. 그러면 그 아래 코드는 짧은 이름만 쓴다. 함수 매개변수 자리에 쓰면 “이 함수가 객체의 어느 부분을 쓰는가”가 선언에 드러난다.

## 3. 학습 목표

- Array 구조 분해가 **위치**로, Object 구조 분해가 **키**로 연결됨을 설명할 수 있다.
- 속성 이름을 바꿔 받을 수 있다.
- 기본값이 언제 적용되는지(`undefined`일 때만) 예측할 수 있다.
- 함수 매개변수 자리에서 구조 분해를 쓸 수 있다.

## 4. 핵심 용어

- **구조 분해(destructuring)**: 묶인 값에서 여러 이름을 한 번에 만드는 문법이다.
- **위치 기반**: Array 구조 분해. 순서가 의미를 정한다.
- **키 기반**: Object 구조 분해. 이름이 의미를 정하고 순서는 상관없다.
- **이름 바꾸기**: `{ id: waferId }`. 왼쪽이 원래 키, 오른쪽이 새 이름이다.

## 5. Mental Model

Array는 **자리**를 보고, Object는 **이름표**를 본다.

```text
Array 구조 분해 — 위치가 전부다
      const [lower, upper] = [90.0, 100.0];

      [ 90.0 , 100.0 ]
         │        │
         ▼        ▼
       lower    upper       이름은 마음대로. 순서가 연결을 정한다


Object 구조 분해 — 이름표를 찾는다
      const { measurement, id } = { id: "W01", measurement: 94.2 };

      { id: "W01" , measurement: 94.2 }
           │              │
           └──────┐       └──────┐     쓴 순서와 상관없이
                  ▼              ▼     같은 이름표를 찾아간다
                 id         measurement
```

이름을 바꿔 받는 문법은 방향을 헷갈리기 쉽다.

```text
const { id: waferId } = wafer;
         │      │
         │      └── 새로 만들 이름
         └── 찾아갈 원래 키

"원래 키 : 새 이름" 이다. Object 리터럴과 같은 모양이지만 방향이 반대다.
```

기본값은 `undefined`일 때만 쓰인다.

```text
{ note = "-" } 에서

  note가 undefined   ──▶ "-"  를 쓴다
  note가 null        ──▶ null 을 쓴다   ← 값이 있는 것으로 본다
  note가 0 이나 ""   ──▶ 그대로 쓴다
```

## 6. 핵심 문법 상세 해설

```javascript
const limits = [90.0, 100.0];
const [lower, upper] = limits;
console.log(lower, upper);
```

```text
90 100
```

이름은 원본과 관계없다. 위치만 맞으면 된다. 자리를 건너뛰려면 쉼표를 비워 둔다.

```javascript
const [, second] = ["A", "B"];
console.log(second);
```

```text
B
```

Object는 키로 연결한다.

```javascript
const wafer = { id: "W01", measurement: 94.2, note: null };
const { id: waferId, measurement, status = "UNKNOWN", note = "-" } = wafer;
console.log(waferId, measurement, status, note);
```

```text
W01 94.2 UNKNOWN null
```

네 가지가 한 줄에 들어 있다.

- `id: waferId` — 원래 키 `id`의 값을 새 이름 `waferId`에 담는다.
- `measurement` — 키와 이름이 같다.
- `status = "UNKNOWN"` — 그런 키가 없어 `undefined`이므로 기본값이 쓰였다.
- `note = "-"` — 키는 있고 값이 `null`이다. **`undefined`가 아니므로 기본값이 쓰이지 않는다.**

마지막이 이 레슨에서 가장 자주 틀리는 지점이다. `null`은 “값이 있음”이다.

함수 매개변수 자리에서도 쓴다.

```javascript
function label({ id, measurement }) {
  return `${id}:${measurement}`;
}
console.log(label(wafer));
```

```text
W01:94.2
```

이 선언은 “나는 객체를 받고, 그중 `id`와 `measurement`를 쓴다”를 한 줄로 말한다. 프레임에는 `id`와 `measurement` 두 이름이 생긴다. `wafer`라는 이름은 함수 안에 없다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const wafer = { id: "W01", measurement: 94.2 };
const { measurement, id, status = "UNKNOWN" } = wafer;
console.log(id, measurement, status);
```

1. Object를 만들고 `wafer`와 연결한다.
2. 구조 분해가 시작된다. 오른쪽 `wafer`를 읽어 상자를 찾는다.
3. `measurement`라는 이름표를 찾는다. 있다. 값 `94.2`로 이름 `measurement`를 만든다.
4. `id`라는 이름표를 찾는다. 있다. `"W01"`로 이름 `id`를 만든다. **쓴 순서와 상자의 순서가 달라도 상관없다.**
5. `status`라는 이름표를 찾는다. 없다. 읽은 값은 `undefined`다. 기본값이 있으므로 `"UNKNOWN"`으로 이름을 만든다.
6. 세 이름을 출력한다.

한 줄이 세 개의 VARIABLE_CREATE를 만든다. 화면에서 카드가 셋 생기는 것을 보면 “한 줄”이 아니라 “세 가지 일”임이 분명해진다.

## 8. 실행 전 예측 문제

```javascript
const limits = [90.0, 100.0];
const [lower, upper] = limits;

const wafer = { id: "W01", measurement: 94.2, note: null };
const { id: waferId, measurement, status = "UNKNOWN", note = "-" } = wafer;

console.log(lower, upper);
console.log(waferId, measurement, status, note);
console.log(wafer.id, wafer.status);
```

세 줄의 출력을 적는다. 특히 `note`가 `"-"`인지 `null`인지, 그리고 마지막 줄의 두 값이 위 줄의 `waferId`·`status`와 어떻게 다른지 설명해 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
```

**Step 1 — 1행**

- 두 칸짜리 Array가 만들어진다.

**Step 2 — 2행: Array 구조 분해**

- 오른쪽 `limits`를 읽는다.
- 0번 칸의 `90`으로 `lower`를 만든다.
- 1번 칸의 `100`으로 `upper`를 만든다.

```text
Memory: limits, lower = 90, upper = 100
```

카드가 한 번에 두 개 생긴다.

**Step 3 — 4행**

- 세 칸짜리 Object가 만들어진다. `note`의 값은 `null`이다.

**Step 4 — 5행: Object 구조 분해**

네 이름이 차례로 만들어진다.

- `waferId`: 상자에서 `id` 이름표를 찾아 `"W01"`.
- `measurement`: 이름표 그대로 `94.2`.
- `status`: 그런 이름표가 없다 → `undefined` → 기본값 `"UNKNOWN"`.
- `note`: 이름표가 있고 값은 `null`. `undefined`가 아니므로 **기본값을 쓰지 않는다** → `null`.

```text
Memory: waferId = "W01", measurement = 94.2,
        status = "UNKNOWN", note = null
```

**Step 5 — 6행 출력**

```text
Output: 90 100
```

**Step 6 — 7행 출력**

```text
Output: W01 94.2 UNKNOWN null
```

**Step 7 — 8행 출력**

- 이번에는 상자에서 직접 읽는다. `wafer.id`는 `"W01"`, `wafer.status`는 그런 이름표가 없어 `undefined`다.
- 위 줄의 `status`가 `"UNKNOWN"`인 것과 대비된다. 기본값은 **꺼낸 이름**에만 채워졌고 상자는 그대로다.

```text
Output: W01 undefined
```

**After**

```text
lower = 90        upper = 100
waferId = "W01"   measurement = 94.2
status = "UNKNOWN"   ← 키가 없어서 기본값
note = null          ← 키가 있어서 기본값을 안 씀

wafer 상자: { id, measurement, note }   ← status 칸은 생기지 않았다
`id`라는 이름도 만들어지지 않았다. 우리가 만든 것은 `waferId`다.
```

`status`와 `note`가 나란히 있는 것이 이 레슨의 요점이다. 둘 다 기본값이 적혀 있지만 하나만 쓰였다.

## 10. Visual Script

1. Array 구조 분해는 칸과 이름을 위치로 잇는 화살표로 그린다. 이름을 바꿔도 화살표가 그대로임을 보여 준다.
2. Object 구조 분해는 이름표를 찾아가는 화살표로 그린다. 쓴 순서와 상자 순서가 다른 예제를 일부러 쓰고, 화살표가 교차하는 모습을 보여 준다.
3. `id: waferId`는 두 칸짜리 카드로 그린다. 왼쪽이 “찾을 이름표”, 오른쪽이 “만들 이름”이라는 라벨을 붙인다.
4. 기본값 판정은 별도 단계로 그린다: 읽은 값 → `undefined`인가? → 예면 기본값, 아니면 읽은 값. `null`이 “아니오” 쪽으로 가는 것을 강조한다.
5. 한 줄이 여러 개의 이름 카드를 만드는 것을 애니메이션으로 하나씩 보여 준다.
6. 함수 매개변수 구조 분해에서는 프레임 안에 꺼낸 이름들만 생기고 원본 객체 이름은 없다는 것을 보여 준다.

## 11. 왜 이렇게 동작하는가

Array와 Object의 연결 방식이 다른 것은 두 자료구조의 성격이 다르기 때문이다. Array는 순서가 의미를 가지므로 위치로 연결하는 것이 자연스럽고, Object는 키가 의미를 가지므로 이름으로 연결하는 것이 자연스럽다. 그래서 Array 구조 분해에서는 이름을 마음대로 지어도 되고, Object 구조 분해에서는 이름이 곧 키다.

기본값이 `undefined`일 때만 적용되는 것은 J02의 구분과 이어진다. `undefined`는 “아무도 넣지 않았다”이고 `null`은 “없다고 적었다”이다. 후자는 사람이 내린 결정이므로 언어가 덮어쓰지 않는다.

`{ id: waferId }`의 방향이 헷갈리는 것은 Object 리터럴과 모양이 같기 때문이다. 리터럴에서는 왼쪽이 만들 키, 오른쪽이 넣을 값이다. 구조 분해에서는 왼쪽이 찾을 키, 오른쪽이 만들 이름이다. 위치가 같고 역할이 뒤집혀 있다. 이 문법은 “양쪽에서 같은 모양이 같은 구조를 뜻한다”는 원칙을 따른 결과다 — 만드는 쪽과 꺼내는 쪽이 같은 모양이면 눈으로 대응시킬 수 있다.

## 12. 자주 하는 오해/실수

### 오해 1: Object 구조 분해도 순서대로 연결된다

```javascript
const { measurement, id } = { id: "W01", measurement: 94.2 };
console.log(id, measurement);
```

```text
W01 94.2
```

이름표로 찾으므로 순서는 상관없다.

### 오해 2: `id: waferId`에서 `waferId`가 원래 키다

반대다. 왼쪽이 원래 키, 오른쪽이 새 이름이다.

### 오해 3: 기본값이 `null`에도 적용된다

적용되지 않는다. `null`은 값이 있는 것으로 본다. `null`도 걸러야 한다면 `??`를 따로 쓴다.

```javascript
const note = wafer.note ?? "-";
```

### 오해 4: 구조 분해가 원본을 바꾼다

바꾸지 않는다. 읽어서 새 이름을 만들 뿐이다.

### 오해 5: 없는 키를 꺼내면 오류다

`undefined`가 된다. 그 값을 바로 파고들면 그때 오류가 난다(J06).

## 13. 업무형/엔지니어형 예제

```javascript
const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3, status: "FAIL" },
];

function label({ id, measurement, status = "UNKNOWN" }) {
  return `${id}:${measurement}:${status}`;
}

for (const wafer of wafers) {
  console.log(label(wafer));
}

const [first, second] = wafers;
console.log(first.id, second.id);
```

출력:

```text
W01:94.2:UNKNOWN
W02:101.3:FAIL
W01 W02
```

첫 Wafer에는 `status`가 없어 기본값이 쓰였고, 둘째에는 있어 그대로 쓰였다. 같은 함수가 두 모양의 객체를 모두 받는다.

매개변수 자리의 구조 분해는 **문서 역할**도 한다. 이 함수의 선언만 보면 “객체에서 세 가지를 쓰고, 그중 하나는 없어도 된다”를 알 수 있다. `function label(wafer)`였다면 본문을 읽어야 안다.

## 14. 직접 해보기

Wafer Object에서 ID는 `waferId`라는 이름으로 바꿔 꺼내고, measurement는 그대로, status는 기본값과 함께 꺼내라. 그다음 Object의 속성 순서를 바꿔 다시 실행해 결과가 같은지 확인한다. 마지막으로 `status: null`인 Wafer로 실행해 기본값이 쓰이는지 확인한다.

## 15. 확인 문제

1. **Concept**: Array 구조 분해와 Object 구조 분해는 각각 무엇을 기준으로 연결되는가?
2. **Trace**: `const { note = "-" } = { note: null };`에서 `note`는 무엇인가?
3. **Fix**: 다음 코드가 `W01`을 출력하도록 고쳐라.

```javascript
const wafer = { id: "W01" };
const { waferId: id } = wafer;
console.log(waferId);
```

## 16. 정답 및 해설

1. Array는 원소의 위치, Object는 속성 키를 기준으로 연결된다.
2. `null`이다. 기본값은 `undefined`일 때만 적용된다.
3.

```javascript
const wafer = { id: "W01" };
const { id: waferId } = wafer;
console.log(waferId);
```

왼쪽이 찾아갈 원래 키, 오른쪽이 만들 이름이다. 원래 코드는 `waferId`라는 키를 찾아 `id`라는 이름을 만들려 한 것이다.

예측 문제 정답: `90 100` / `W01 94.2 UNKNOWN null` / `W01 undefined`.

## 17. 핵심 요약

- Array 구조 분해는 위치로, Object 구조 분해는 키로 연결된다.
- `{ 원래키: 새이름 }` 순서다. Object 리터럴과 모양은 같고 방향은 반대다.
- 기본값은 값이 `undefined`일 때만 적용된다. `null`에는 적용되지 않는다.
- 매개변수 자리에 쓰면 함수가 객체의 어느 부분을 쓰는지 선언에 드러난다.

## 18. 다음 레슨 연결

J16에서는 같은 `...` 기호가 자리에 따라 **펼치기**와 **모으기**로 갈리는 것을 본다. 그리고 J06에서 본 얕은 복사를 다시 정확히 짚는다.

---

# J16. Spread와 Rest

## 1. 레슨 한 줄 질문

**같은 `...`가 어떤 자리에서는 펼치고 어떤 자리에서는 모으는데, 그 자리는 무엇으로 구분하는가?**

## 2. 왜 필요한가 / 현실 상황

두 목록을 이어 붙이고, 원본을 두고 일부만 바꾼 새 Object를 만들고, 개수가 정해지지 않은 인수를 받는 일 — 셋 다 자주 있고, 셋 다 `...`로 쓴다.

기호가 하나라 헷갈리지만 규칙은 단순하다. **값을 쓰는 자리에서는 펼치고, 값을 받는 자리에서는 모은다.**

## 3. 학습 목표

- Spread로 Array·Object를 펼쳐 새것을 만들 수 있다.
- Object 병합에서 뒤의 키가 앞을 덮는 규칙을 예측할 수 있다.
- Rest 매개변수로 여러 인수를 Array로 받을 수 있다.
- 얕은 복사의 경계를 정확히 말할 수 있다.

## 4. 핵심 용어

- **Spread**: 값을 쓰는 자리에서 컨테이너의 내용을 펼친다.
- **Rest**: 값을 받는 자리에서 남은 것들을 하나로 모은다.
- **병합(merge)**: 여러 Object의 속성을 합쳐 새 Object를 만드는 일이다.
- **얕은 복사**: 한 겹만 새로 만들고 안쪽 객체는 공유하는 복사다.

## 5. Mental Model

자리로 구분한다.

```text
쓰는 자리 (값이 필요한 곳)              받는 자리 (이름을 만드는 곳)
  [...first, ...second]                  function f(...values)
  { ...original, note: "x" }              const [head, ...rest] = list
  f(...args)

  ── 펼친다 ──▶                          ◀── 모은다 ──
```

Array Spread는 칸을 하나씩 옮겨 담는다.

```text
first  [ W01 , W02 ]      second [ W03 ]
          │      │                  │
          ▼      ▼                  ▼
all    [ W01 , W02 , W03 ]     ← 새 Array. 원본 둘은 그대로다
```

Object Spread는 **왼쪽부터** 넣으므로 뒤가 이긴다.

```text
{ ...original, measurement: 95.1 }
   │              │
   │              └── 나중에 들어와 앞의 값을 덮는다  → 95.1
   └── id, measurement(94.2) 가 먼저 들어간다

{ measurement: 95.1, ...original }
   │                   │
   └── 먼저 들어가고    └── original의 94.2가 덮는다   → 94.2
```

## 6. 핵심 문법 상세 해설

```javascript
const first = ["W01", "W02"];
const second = ["W03"];
const all = [...first, ...second];

console.log(all);
console.log(first, second);
```

```text
[ 'W01', 'W02', 'W03' ]
[ 'W01', 'W02' ] [ 'W03' ]
```

`all`은 새 Array이고 원본 둘은 그대로다.

Object에서는 순서가 결과를 정한다.

```javascript
const original = { id: "W01", measurement: 94.2 };
const updated = { ...original, measurement: 95.1 };
const reversed = { measurement: 95.1, ...original };

console.log(updated);
console.log(reversed);
```

```text
{ id: 'W01', measurement: 95.1 }
{ measurement: 94.2, id: 'W01' }
```

`updated`는 “원본을 두고 measurement만 바꾼 새 Object”라는 흔한 형태다. `reversed`는 그 의도를 뒤집는다. 순서가 곧 우선순위다.

Rest는 받는 자리에 온다.

```javascript
function average(...values) {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

console.log(average(94.2, 101.3, 96.0));
console.log(average());
```

```text
97.16666666666667
0
```

`values`는 Array다. 그래서 `length`도, `reduce`도 바로 쓸 수 있다. Rest 매개변수는 마지막에 하나만 올 수 있다.

구조 분해에서도 쓴다.

```javascript
const [head, ...rest] = ["W01", "W02", "W03"];
console.log(head, rest);
```

```text
W01 [ 'W02', 'W03' ]
```

그리고 Spread는 함수 호출에서 반대 방향으로도 쓴다.

```javascript
const values = [94.2, 101.3];
console.log(average(...values));
```

```text
97.75
```

`average(values)`였다면 Array 하나를 받았을 것이다. `...`가 그것을 두 개의 인수로 펼친다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const source = { id: "W01", details: { status: "PASS" } };
const copy = { ...source };
copy.details.status = "REVIEW";
console.log(source.details.status);
```

1. 상자가 두 개 만들어진다. 바깥 상자의 `details` 칸은 안쪽 상자를 **가리킨다**.
2. `{ ...source }`가 새 바깥 상자를 만든다. `id` 칸에는 `"W01"`이 복사되고, `details` 칸에는 **안쪽 상자를 가리키는 화살표가 복사된다**. 안쪽 상자는 새로 만들어지지 않았다.
3. `copy.details`를 읽으면 그 화살표를 따라 안쪽 상자에 도착한다. `status`를 `"REVIEW"`로 바꾼다.
4. `source.details`도 같은 안쪽 상자를 가리킨다. `"REVIEW"`가 나온다.

2번이 얕은 복사의 정의다. 복사된 것은 값이 아니라 **화살표**다.

## 8. 실행 전 예측 문제

```javascript
const first = ["W01", "W02"];
const second = ["W03"];
const all = [...first, ...second];

const original = { id: "W01", measurement: 94.2 };
const updated = { ...original, measurement: 95.1 };
const reversed = { measurement: 95.1, ...original };

console.log(all, first);
console.log(updated.measurement, reversed.measurement);

const source = { details: { status: "PASS" } };
const copy = { ...source };
copy.details.status = "REVIEW";
console.log(source.details.status, copy.details.status);
```

세 줄의 출력을 적는다. 특히 `updated`와 `reversed`가 왜 다른지, 마지막 줄의 두 값이 왜 같은지 설명해 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
```

**Step 1~2 — Array 두 개**

- 상자가 두 개 만들어진다.

**Step 3 — Array Spread**

- 새 Array 상자가 만들어진다.
- `first`의 칸이 하나씩 새 상자에 복사된다. 그다음 `second`의 칸이 이어진다.
- 원본 두 상자는 손대지 않았다.

```text
all ──▶ ["W01", "W02", "W03"]
first ──▶ ["W01", "W02"]     (그대로)
```

**Step 4 — Object 하나**

- `{ id: "W01", measurement: 94.2 }` 상자.

**Step 5 — `updated`**

- 새 상자를 만든다.
- 왼쪽부터: `...original`이 `id`와 `measurement(94.2)`를 넣는다.
- 그다음 `measurement: 95.1`이 같은 칸에 다시 쓴다. **덮어쓴다.**
- 결과 `measurement`는 95.1.

**Step 6 — `reversed`**

- 새 상자를 만든다.
- 왼쪽부터: `measurement: 95.1`이 먼저 들어간다.
- 그다음 `...original`이 `id`를 넣고 `measurement(94.2)`로 **덮어쓴다**.
- 결과 `measurement`는 94.2.

```text
Output: [ 'W01', 'W02', 'W03' ] [ 'W01', 'W02' ]
Output: 95.1 94.2
```

**Step 7 — 중첩 Object**

- 바깥 상자와 안쪽 상자, 둘이 만들어진다.

**Step 8 — 얕은 복사**

- 새 바깥 상자가 만들어진다.
- `details` 칸에는 **안쪽 상자로 가는 화살표**가 복사된다. 객체 패널을 보면 안쪽 상자는 여전히 하나이고 화살표가 두 개다.

**Step 9 — 안쪽 수정**

- `copy.details`를 따라가 안쪽 상자의 `status`를 바꾼다.
- 그 상자를 가리키는 화살표가 둘이므로 양쪽에서 보인다.

```text
Output: REVIEW REVIEW
```

**After**

```text
source ──▶ { details: ●──┐
copy   ──▶ { details: ●──┤
                          └──▶ { status: "REVIEW" }   ← 상자는 하나뿐이다
```

## 10. Visual Script

1. Spread를 “칸이 하나씩 새 상자로 이동하는” 애니메이션으로 그린다. 원본 칸은 남아 있어야 한다.
2. Object 병합에서는 **왼쪽부터 순서대로** 칸이 채워지는 것을 보여 주고, 같은 키가 다시 오면 그 칸의 값이 바뀌는 장면을 강조한다. 순서가 우선순위라는 것이 여기서 보인다.
3. `updated`와 `reversed`를 나란히 그려 같은 재료가 순서 때문에 다른 결과가 되는 것을 비교한다.
4. Rest 매개변수는 여러 인수가 하나의 Array 상자로 모이는 것으로 그린다. Spread와 화살표 방향이 반대여야 한다.
5. 얕은 복사에서는 안쪽 상자가 **하나만** 그려져야 한다. 두 개로 그리면 이 레슨이 무너진다.
6. 안쪽 상자를 고치는 순간 양쪽 화살표가 함께 반짝인다.

## 11. 왜 이렇게 동작하는가

`...`가 두 가지 뜻을 갖는 것은 문맥이 명확하기 때문이다. Array 리터럴이나 함수 호출 인수 자리는 “값이 필요한 곳”이고, 매개변수 목록이나 구조 분해 왼쪽은 “이름을 만드는 곳”이다. 같은 기호가 반대 방향으로 읽히지만 자리가 어느 쪽인지는 언제나 분명하다.

Object 병합에서 뒤가 이기는 것은 “나중에 쓴 것이 최종 결정”이라는 자연스러운 규칙이다. 그래서 `{ ...기본값, ...사용자설정 }`처럼 우선순위를 순서로 표현할 수 있다.

얕은 복사에 머무는 이유는 J06과 같다. 안쪽 값이 객체이면 그 값은 “위치”이고, 위치를 복사하면 같은 곳을 가리킨다. 모든 깊이를 복사하려면 언어가 객체를 끝까지 따라가야 하는데, 그것은 순환 참조나 함수 같은 값에서 답이 없다. 그래서 기본 동작은 한 겹이고, 필요하면 `structuredClone()`을 따로 부른다.

## 12. 자주 하는 오해/실수

### 오해 1: `...`는 언제나 펼친다

받는 자리에서는 모은다. 자리를 보고 판단한다.

### 오해 2: Object 병합에서 앞이 이긴다

뒤가 이긴다. `{ ...a, ...b }`에서 겹치는 키는 `b`의 값이 남는다.

### 오해 3: Object spread가 깊은 복사다

한 겹이다. 중첩 객체는 공유된다.

### 오해 4: Rest 매개변수를 앞에 둘 수 있다

```javascript
function f(...values, last) {} // SyntaxError
```

남은 것을 모으는 것이므로 마지막에만 올 수 있고 하나만 쓸 수 있다.

### 오해 5: `f(values)`와 `f(...values)`가 같다

전자는 Array 하나를 넘기고, 후자는 원소 개수만큼의 인수를 넘긴다.

## 13. 업무형/엔지니어형 예제

```javascript
function average(...values) {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

console.log(average(94.2, 101.3, 96.0).toFixed(2));
console.log(average());

const source = { id: "W01", details: { status: "PASS" } };
const copy = { ...source };
copy.id = "W02";
copy.details.status = "REVIEW";

console.log(source.id, copy.id);
console.log(source.details.status, copy.details.status);
```

출력:

```text
97.17
0
W01 W02
REVIEW REVIEW
```

마지막 두 줄이 얕은 복사의 경계를 정확히 보여 준다. `id`는 한 겹 안에 있어서 갈라졌고, `details.status`는 두 겹 안에 있어서 공유되었다. 같은 복사, 다른 결과다.

`average()`를 인수 없이 부를 수 있다는 점도 확인한다. Rest는 “0개 이상”을 받으므로 빈 Array가 된다. 그 경우를 함수가 직접 처리해야 한다.

## 14. 직접 해보기

원본 Wafer Object를 유지하면서 measurement와 status를 바꾼 새 Object를 만들어라. 그다음 그 Wafer에 중첩된 `details` 속성을 추가하고 복사본에서 `details` 안을 고쳐, 어느 값이 갈라지고 어느 값이 공유되는지 확인한다. 고치기 전에 상자와 화살표를 먼저 그려 예측한다.

## 15. 확인 문제

1. **Concept**: 함수 매개변수 자리의 `...args`는 펼치는가, 모으는가?
2. **Trace**: `{ ...a, value: 3 }`에서 `a`에도 `value`가 있으면 어느 값이 남는가?
3. **Fix**: 다음 코드에서 `source`의 안쪽 값이 바뀌지 않도록 고쳐라.

```javascript
const source = { details: { status: "PASS" } };
const copy = { ...source };
copy.details.status = "REVIEW";
console.log(source.details.status);
```

## 16. 정답 및 해설

1. 모은다. 전달된 인수들을 하나의 Array로 만든다.
2. 뒤에 쓴 `3`이 남는다.
3. 안쪽도 새로 만들어야 한다.

```javascript
const source = { details: { status: "PASS" } };
const copy = { ...source, details: { ...source.details } };
copy.details.status = "REVIEW";
console.log(source.details.status); // PASS
```

깊이가 더 있으면 `structuredClone(source)`을 쓴다.

예측 문제 정답: `[ 'W01', 'W02', 'W03' ] [ 'W01', 'W02' ]` / `95.1 94.2` / `REVIEW REVIEW`.

## 17. 핵심 요약

- 값을 쓰는 자리에서는 펼치고(Spread), 이름을 만드는 자리에서는 모은다(Rest).
- Object 병합은 왼쪽부터 채우므로 뒤에 쓴 키가 이긴다.
- Rest 매개변수는 Array이며 마지막에 하나만 올 수 있다.
- Spread는 한 겹만 복사한다. 중첩 객체는 공유된다.

## 18. 다음 레슨 연결

J17에서는 프로그램 **바깥**의 텍스트를 다룬다. JSON 문자열이 JavaScript 값이 되는 경계에서 무엇이 살아남고 무엇이 사라지는지 본다.

---

# J17. JSON

## 1. 레슨 한 줄 질문

**텍스트가 JavaScript 값이 되는 경계에서, 무엇이 살아남고 무엇이 사라지는가?**

## 2. 왜 필요한가 / 현실 상황

웹 API나 파일은 JavaScript의 Object를 그대로 보내지 않는다. 언어가 달라도 읽을 수 있는 텍스트 규칙, JSON을 쓴다.

그래서 프로그램의 양 끝에는 언제나 변환이 있다. 들어올 때 텍스트를 값으로 바꾸고, 나갈 때 값을 텍스트로 바꾼다. 이 경계를 흐릿하게 두면 “문자열에 `.measurement`를 붙였는데 `undefined`”라는 오류를 만나게 된다.

## 3. 학습 목표

- JSON 문자열과 이미 파싱된 Object를 구분할 수 있다.
- `JSON.parse()`와 `JSON.stringify()`로 서로 변환할 수 있다.
- `undefined`와 함수가 JSON에서 사라지는 것을 설명할 수 있다.
- 잘못된 JSON의 오류를 읽고 원인을 좁힐 수 있다.

## 4. 핵심 용어

- **JSON**: 언어 중립적인 데이터 텍스트 규칙이다.
- **`JSON.parse(text)`**: 텍스트를 검사해 JavaScript 값으로 만든다.
- **`JSON.stringify(value)`**: 값을 JSON 텍스트로 만든다.
- **직렬화(serialize)**: 값을 전송·저장할 수 있는 텍스트로 바꾸는 일이다.

## 5. Mental Model

경계에 두 개의 문이 있다. 각 문은 한 방향으로만 연다.

```text
   프로그램 바깥                      프로그램 안
  ┌──────────────────┐             ┌──────────────────────┐
  │ '{"id":"W01",    │  parse  ──▶ │ { id: "W01",         │
  │   "value":94.2}' │             │   value: 94.2 }      │
  │                  │ ◀── stringify│                     │
  │  글자의 나열      │             │  칸이 있는 상자        │
  │  .id 로 못 읽는다 │             │  .id 로 읽는다        │
  └──────────────────┘             └──────────────────────┘
```

나가는 문은 좁다. 통과하지 못하는 것이 있다.

```text
{ id: "W01", note: undefined, check: () => true }
      │            │                  │
      ▼            ▼                  ▼
   "id" 남음     사라짐              사라짐

  결과: {"id":"W01"}

  JSON에는 undefined도, 함수도 표현할 방법이 없다.
  오류가 아니라 조용히 빠진다.
```

## 6. 핵심 문법 상세 해설

```javascript
const text = '{"lot":"LOT-A01","measurements":[94.2,96.0]}';
const data = JSON.parse(text);

console.log(typeof text, typeof data);
console.log(data.lot);
console.log(text.lot);
```

```text
string object
LOT-A01
undefined
```

마지막 줄이 경계를 보여 준다. `text`는 문자열이므로 `lot`이라는 속성이 없다. 오류가 아니라 `undefined`다(J06).

거꾸로도 간다.

```javascript
const summary = { validCount: 2, average: 95.1 };
console.log(JSON.stringify(summary));
console.log(JSON.stringify(summary, null, 2));
```

```text
{"validCount":2,"average":95.1}
{
  "validCount": 2,
  "average": 95.1
}
```

세 번째 인수 `2`는 들여쓰기 칸 수다. 사람이 읽을 파일에 쓴다. 전송할 때는 짧은 쪽이 낫다.

JSON의 규칙은 JavaScript 문법보다 좁다.

- 키와 문자열은 **큰따옴표만** 쓴다.
- 마지막 항목 뒤에 쉼표를 두지 않는다.
- 주석을 넣을 수 없다.
- 값으로는 문자열, 숫자, Boolean, `null`, Array, Object만 쓴다.

```javascript
JSON.parse("{'lot': 'A'}");
```

작은따옴표는 JSON이 아니다. `SyntaxError`가 난다. 오류 메시지에 나오는 위치를 보고 따옴표·쉼표·괄호를 확인한다.

나가는 문에서 빠지는 것들도 확인해 둔다.

```javascript
const source = { id: "W01", note: undefined, check: () => true, at: null };
console.log(JSON.stringify(source));
```

```text
{"id":"W01","at":null}
```

`null`은 남고 `undefined`는 사라진다. J02에서 나눈 “없다고 적은 것”과 “아직 안 넣은 것”의 차이가 여기서 실제 결과를 가른다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
const text = '{"value":"94.2"}';
const data = JSON.parse(text);
console.log(data.value + 1);
console.log(Number(data.value) + 1);
```

1. `text`는 글자 열여섯 개짜리 문자열이다.
2. `JSON.parse`가 문법을 검사하고 상자를 만든다. `value` 칸에 들어가는 것은 **문자열 `"94.2"`**다. JSON 안에서 따옴표에 싸여 있었기 때문이다.
3. `data.value + 1`: 문자열과 숫자의 `+`이므로 연결이다(J03). `"94.21"`.
4. `Number(data.value) + 1`: 변환 후 덧셈. `95.2`.

2번이 요점이다. `JSON.parse`는 **JSON에 적힌 타입 그대로** 만든다. `"94.2"`라고 적혀 있으면 문자열이고, `94.2`라고 적혀 있으면 숫자다. 파싱했다고 숫자가 되지 않는다.

## 8. 실행 전 예측 문제

```javascript
const text = '{"id":"W01","measurement":94.2,"note":null}';
const wafer = JSON.parse(text);

console.log(typeof text, typeof wafer);
console.log(wafer.measurement + 1);
console.log(wafer.note, wafer.missing);

wafer.checked = undefined;
wafer.at = "2026-01-01";
console.log(JSON.stringify(wafer));
```

네 줄의 출력을 적는다. 특히 마지막 줄에 `checked`가 들어가는지, `note`가 들어가는지 각각 판단한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Memory: (이름 없음)
```

**Step 1 — 1행**

- 글자 마흔세 개짜리 문자열이 만들어진다. 아직 상자가 아니다.

**Step 2 — 2행: `JSON.parse`**

- 텍스트를 앞에서부터 읽으며 문법을 검사한다.
- 상자를 만들고 칸 셋을 채운다.

```text
wafer ──▶ ┌──────────────┬─────────┐
          │ id           │ "W01"   │  ← 문자열
          │ measurement  │ 94.2    │  ← 숫자 (따옴표가 없었다)
          │ note         │ null    │
          └──────────────┴─────────┘
```

**Step 3 — 3행**

```text
Output: string object
```

`text`는 여전히 문자열이다. 파싱은 원본을 바꾸지 않고 새 값을 만든다.

**Step 4 — 4행**

- `wafer.measurement`는 숫자 `94.2`. 숫자끼리의 덧셈이다.

```text
Output: 95.2
```

JSON에 `"94.2"`라고 적혀 있었다면 여기서 `94.21`이 나왔을 것이다.

**Step 5 — 5행**

- `note`는 `null`(칸이 있고 값이 null).
- `missing`은 그런 칸이 없다 → `undefined`.

```text
Output: null undefined
```

**Step 6~7 — 속성 추가**

- `checked` 칸에 `undefined`를 넣는다. 칸은 생긴다.
- `at` 칸에 문자열을 넣는다.

**Step 8 — `JSON.stringify`**

- 칸을 순서대로 훑으며 텍스트로 옮긴다.
- `checked`의 값이 `undefined`다. **JSON에 쓸 수 없으므로 그 칸을 통째로 건너뛴다.**
- `note`의 `null`은 JSON에 있는 값이므로 그대로 쓴다.

```text
Output: {"id":"W01","measurement":94.2,"note":null,"at":"2026-01-01"}
```

**After**

```text
wafer 상자에는 칸이 다섯 (id, measurement, note, checked, at)
JSON 텍스트에는 넷 (checked가 빠졌다)

상자와 텍스트가 1:1이 아니다.
```

## 10. Visual Script

1. 문자열은 글자 칸의 나열로, 파싱 결과는 키·값 상자로 그린다. 두 그림이 확실히 달라야 경계가 보인다.
2. `JSON.parse` 실행 때 텍스트를 왼쪽부터 훑으며 상자의 칸이 하나씩 생기는 애니메이션을 준다.
3. 파싱된 값의 타입 배지를 칸마다 붙인다. `"94.2"`와 `94.2`가 다른 배지를 갖는 것이 핵심이다.
4. `stringify`에서는 칸을 순서대로 읽어 텍스트가 자라는 것으로 그린다.
5. `undefined`인 칸에 도달하면 그 칸이 흐려지고 텍스트에 아무것도 추가되지 않는 장면을 강조한다. “오류 없이 사라진다”가 이 레슨의 가장 중요한 관찰이다.
6. 파싱 실패 시에는 텍스트의 실패 위치에 표식을 찍고 오류 경로를 보여 준다.

## 11. 왜 이렇게 동작하는가

JSON은 JavaScript에서 나왔지만 JavaScript 전용이 아니다. 여러 언어가 읽을 수 있어야 하므로, 어느 언어에나 있는 것만 남겼다. 함수는 언어마다 다르고, `undefined`는 JavaScript에만 있는 개념이다. 그래서 둘 다 빠졌다.

`undefined`가 오류 대신 조용히 사라지는 것은 실용적 선택이다. 객체에 `undefined` 속성이 섞이는 일은 흔한데, 그때마다 전송이 실패하면 쓰기 어렵다. 대신 “보냈다고 생각했는데 안 갔다”는 문제가 생긴다. 반드시 보내야 하는 “값 없음”은 `null`로 적는다.

`JSON.parse`가 타입을 그대로 만드는 것도 규칙이다. JSON 텍스트의 따옴표 유무가 곧 타입이므로, 파서가 추측할 여지가 없다. 그래서 “숫자처럼 생긴 문자열”은 파싱 후에도 문자열이고, J03에서 배운 변환이 여전히 필요하다.

## 12. 자주 하는 오해/실수

### 오해 1: JSON 문자열에 바로 속성 접근이 된다

```javascript
const text = '{"id":"W01"}';
console.log(text.id);
```

```text
undefined
```

파싱 전에는 글자일 뿐이다.

### 오해 2: 이미 Object인 것을 다시 파싱한다

```javascript
JSON.parse({ id: "W01" });
```

Object가 먼저 문자열로 바뀌어 `"[object Object]"`가 되고, 그것은 JSON이 아니라 `SyntaxError`가 난다.

### 오해 3: 파싱하면 숫자가 된다

JSON에 따옴표가 있었으면 문자열이다. `Number()`가 여전히 필요하다.

### 오해 4: `undefined`도 저장된다

사라진다. 오류도 나지 않는다.

### 오해 5: JSON에 주석이나 작은따옴표를 쓸 수 있다

쓸 수 없다. JSON은 JavaScript 문법의 부분집합이 아니라 별도의 좁은 규칙이다.

## 13. 업무형/엔지니어형 예제

```javascript
const raw = '[{"id":"W01","measurement":"94.2"},{"id":"W02","measurement":"N/A"}]';
const rows = JSON.parse(raw);

const parsed = rows.map((row) => ({
  id: row.id,
  value: Number(row.measurement),
}));

const usable = parsed.filter((row) => Number.isFinite(row.value));

console.log(rows.length, usable.length);
for (const row of usable) {
  console.log(row.id, row.value);
}
console.log(JSON.stringify(usable));
```

출력:

```text
2 1
W01 94.2
[{"id":"W01","value":94.2}]
```

이 세 단계가 데이터 처리의 기본형이다. **파싱 → 변환 → 선별**. 각 단계가 다른 일을 하고, 각 단계가 새 값을 만든다.

원본 JSON에서 measurement가 문자열이었다는 점을 확인한다. `"94.2"`와 `"N/A"`가 같은 타입으로 들어왔고, 변환 단계에서 하나는 숫자가 되고 하나는 `NaN`이 되었다. 선별은 그다음이다.

## 14. 직접 해보기

따옴표, 끝 쉼표, 닫는 괄호가 각각 잘못된 JSON 문자열 세 개를 만들어 파싱해 보고, 세 오류 메시지가 각각 어느 위치를 가리키는지 확인하라. 그다음 올바른 JSON을 파싱해 `status` 속성을 추가하고, 들여쓰기가 있는 JSON 텍스트로 다시 만든다.

## 15. 확인 문제

1. **Concept**: JSON 문자열을 값으로, 값을 JSON 문자열로 바꾸는 함수는 각각 무엇인가?
2. **Trace**: `JSON.stringify({ a: undefined, b: null })`의 결과는 무엇인가?
3. **Fix**: 다음 코드가 `94.2`를 출력하도록 고쳐라.

```javascript
const text = '{"measurement":94.2}';
console.log(text.measurement);
```

## 16. 정답 및 해설

1. `JSON.parse()`와 `JSON.stringify()`다.
2. `{"b":null}`이다. `undefined`인 속성은 통째로 빠진다.
3.

```javascript
const text = '{"measurement":94.2}';
const data = JSON.parse(text);
console.log(data.measurement);
```

예측 문제 정답: `string object` / `95.2` / `null undefined` / `{"id":"W01","measurement":94.2,"note":null,"at":"2026-01-01"}`.

## 17. 핵심 요약

- JSON 문자열과 파싱된 값은 다른 것이다. 파싱 전에는 속성 접근이 되지 않는다.
- `JSON.parse`는 JSON에 적힌 타입을 그대로 만든다. 따옴표가 있으면 문자열이다.
- `JSON.stringify`는 `undefined`와 함수를 조용히 뺀다. `null`은 남는다.
- JSON은 큰따옴표만 쓰고 주석과 끝 쉼표를 허용하지 않는다.

## 18. 다음 레슨 연결

J18에서는 이 경계에서 **실패했을 때** 무슨 일이 일어나는지 본다. 오류가 Call Stack을 거슬러 올라가는 경로를 화면에서 따라간다.

---

# J18. 오류와 try...catch...finally

## 1. 레슨 한 줄 질문

**오류가 나면 실행 위치는 어디로 이동하며, 그 사이의 코드는 어떻게 되는가?**

## 2. 왜 필요한가 / 현실 상황

숫자가 아닌 measurement를 그대로 계산하면 `NaN`이 조용히 퍼진다. 열 줄 뒤의 평균이 `NaN`이 되어서야 알아차리고, 그때는 어느 값이 원인인지 알 수 없다.

발견한 지점에서 오류로 알리면 실패 위치와 원인이 함께 남는다. 그리고 처리할 수 있는 위쪽 코드가 기본값을 쓸지 건너뛸지 결정한다. 발견하는 곳과 결정하는 곳을 나누는 것이 이 문법의 목적이다.

## 3. 학습 목표

- `throw`가 함수의 남은 코드를 건너뛰는 것을 설명할 수 있다.
- 오류가 Call Stack을 거슬러 가장 가까운 `catch`를 찾는 경로를 짚을 수 있다.
- `finally`가 정상·오류 양쪽에서 실행되는 것을 확인할 수 있다.
- 오류 객체의 `name`과 `message`를 읽을 수 있다.

## 4. 핵심 용어

- **`throw`**: 오류를 만들어 알리는 문장이다. 그 아래 코드는 실행되지 않는다.
- **오류 객체**: `name`과 `message`를 가진 객체다. `Error`, `TypeError`, `RangeError` 등이 있다.
- **전파(propagate)**: 처리할 `catch`를 찾아 Call Stack을 거슬러 오르는 이동이다.
- **`finally`**: 정상 종료든 오류든 반드시 실행되는 블록이다.

## 5. Mental Model

오류는 값이 아니라 **경로**다. 정상 경로가 끊기고 가장 가까운 `catch`로 점프한다.

```text
  try {
    const value = parseValue("N/A");   ──┐  ① 호출
    console.log(value);         ✗ 건너뜀 │
  } catch (error) {                      │
    console.log(error.name);    ◀────────┘  ③ 여기로 점프
  } finally {
    console.log("정리");        ◀───────── ④ 언제나 실행
  }

  function parseValue(text) {
    const value = Number(text);
    if (!Number.isFinite(value)) {
      throw new RangeError(...);  ────────  ② 여기서 경로가 끊긴다
    }
    return value;                ✗ 건너뜀
  }
```

Call Stack에 프레임이 여러 겹이면 하나씩 걷어내며 올라간다.

```text
  global  ◀── catch 있음. 여기서 멈춘다
    │
  work#1  ── catch 없음 → 프레임을 걷어내고 위로
    │
  parse#1 ── throw 발생
```

`catch`는 실패한 줄로 **돌아가지 않는다**. 그 줄은 끝난 일이다.

## 6. 핵심 문법 상세 해설

```javascript
function parseMeasurement(rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new TypeError("measurement must be numeric");
  }
  return value;
}
```

`throw`가 실행되면 아래 `return`은 실행되지 않는다. 오류 객체에는 종류를 나타내는 `name`과 설명인 `message`가 있다.

```javascript
try {
  const value = parseMeasurement("N/A");
  console.log("값:", value);
} catch (error) {
  console.log("실패:", error.name, error.message);
} finally {
  console.log("변환 종료");
}
```

```text
실패: TypeError measurement must be numeric
변환 종료
```

`try` 안의 `console.log("값:", value)`는 실행되지 않았다. 오류가 그 앞에서 경로를 끊었기 때문이다.

정상값이면 `catch`를 건너뛰고 `finally`는 그대로 실행된다.

```javascript
try {
  console.log("값:", parseMeasurement("94.2"));
} catch (error) {
  console.log("실패:", error.name);
} finally {
  console.log("변환 종료");
}
```

```text
값: 94.2
변환 종료
```

오류 종류는 골라서 쓴다.

| 종류 | 언제 |
|---|---|
| `TypeError` | 값의 종류가 잘못됐다 |
| `RangeError` | 값의 범위가 잘못됐다 |
| `Error` | 그 밖의 일반적인 실패 |

문자열을 던지지 않는다.

```javascript
throw "문제 발생";        // 권하지 않는다
throw new Error("문제 발생"); // 이렇게 쓴다
```

문자열을 던지면 `name`도 스택 정보도 없다. `catch`에서 받은 것이 무엇인지 매번 확인해야 한다.

그리고 오류를 삼키지 않는다.

```javascript
try {
  risky();
} catch (error) {
  // 아무것도 하지 않음
}
```

이 코드는 실패했다는 사실 자체를 지운다. 복구할 방법이 없다면 정보를 붙여 다시 던지거나, 아예 잡지 않고 위로 보낸다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
function inner() {
  throw new Error("깊은 곳에서 실패");
}
function outer() {
  inner();
  console.log("이 줄은 실행되지 않는다");
}
try {
  outer();
} catch (error) {
  console.log("잡음:", error.message);
}
```

1. `outer()` 호출. 프레임 `outer#1`이 생긴다.
2. `inner()` 호출. 프레임 `inner#1`이 생긴다. Call Stack은 세 겹이다.
3. `throw`가 실행된다. 오류 객체가 만들어진다.
4. `inner#1`에는 `catch`가 없다. 프레임이 걷어내지며 `outer#1`로 올라간다.
5. `outer#1`에도 `catch`가 없다. `console.log`는 실행되지 않고 프레임이 걷어내진다.
6. `global`의 `try`에 딸린 `catch`를 만난다. 여기서 멈춘다.
7. 오류 객체가 `error`와 연결되고 메시지를 출력한다.

4~5번이 “전파”다. 프레임이 하나씩 사라지는 것을 화면에서 볼 수 있다. 정상 반환과 달리 **반환값이 없다**.

## 8. 실행 전 예측 문제

```javascript
function parseValue(text) {
  const value = Number(text);
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${text}`);
  }
  return value;
}

const inputs = ["94.2", "N/A"];

for (const text of inputs) {
  try {
    console.log("값:", parseValue(text));
  } catch (error) {
    console.log("실패:", error.name, error.message);
  } finally {
    console.log("정리:", text);
  }
}
```

출력을 순서대로 적는다. 총 몇 줄인지, 그리고 `finally`가 몇 번 실행되는지 먼저 세어 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
inputs = ["94.2", "N/A"]
```

**Step 1 — 첫 회차: `text = "94.2"`**

- `try` 블록에 들어간다.
- `parseValue("94.2")` 호출. 프레임 `parseValue#1`이 생긴다.

**Step 2 — 함수 안**

- `Number("94.2")` → `94.2`.
- `Number.isFinite(94.2)` → 참. `!`가 붙어 조건은 거짓. `throw`를 건너뛴다.
- `return 94.2`.

**Step 3 — 정상 반환**

- 프레임이 사라지고 값이 돌아온다.

```text
Output: 값: 94.2
```

**Step 4 — `catch` 건너뜀, `finally` 실행**

- 오류가 없었으므로 `catch`는 실행되지 않는다.
- `finally`는 실행된다.

```text
Output: 정리: 94.2
```

**Step 5 — 둘째 회차: `text = "N/A"`**

- `parseValue("N/A")` 호출. 프레임 `parseValue#2`.

**Step 6 — `throw`**

- `Number("N/A")` → `NaN`. `Number.isFinite(NaN)` → 거짓. `!`로 조건은 참.
- `RangeError` 객체가 만들어진다. `message`는 템플릿으로 만든 문자열이다.
- `throw`가 실행된다. 아래 `return`은 실행되지 않는다.

**Step 7 — 전파**

- `parseValue#2`에 `catch`가 없다. 프레임이 걷어내진다.
- `try` 안의 `console.log("값:", ...)`도 실행되지 않는다. 인수를 만드는 도중에 실패했기 때문이다.

**Step 8 — `catch` 진입**

- 오류 객체가 `error`와 연결된다.

```text
Output: 실패: RangeError 숫자가 아닙니다: N/A
```

**Step 9 — `finally`**

```text
Output: 정리: N/A
```

**After**

```text
값: 94.2
정리: 94.2
실패: RangeError 숫자가 아닙니다: N/A
정리: N/A
```

네 줄이다. `finally`는 두 번 모두 실행되었고, `catch`는 한 번만 실행되었다. 그리고 반복문은 오류 때문에 멈추지 않았다 — `try`가 반복문 안에 있으므로 오류가 그 회차 안에서 처리되었다.

## 10. Visual Script

1. `throw` 실행 순간 정상 경로 화살표를 끊고 오류 경로를 다른 표시로 그린다.
2. 전파는 Call Stack의 프레임이 위에서부터 하나씩 걷어내지는 애니메이션으로 보여 준다. 정상 반환과 달리 **값이 함께 이동하지 않는다**는 것이 보여야 한다.
3. 건너뛴 코드(함수의 남은 줄, `try`의 남은 줄)를 흐리게 처리하고 “삭제된 것이 아니라 이번 경로에서 실행되지 않았다”는 라벨을 붙인다.
4. `catch`에 도착하면 오류 객체가 `error` 이름과 연결되는 화살표를 그린다. 이 순간부터 오류는 값으로 다뤄진다.
5. `finally`는 두 경로(정상·오류)에서 모두 같은 블록으로 화살표가 들어오는 것으로 그린다.
6. 반복문 안의 `try`에서는 오류 처리 후 다음 회차로 정상 복귀하는 것을 보여 준다. 반복이 멈추지 않는 이유가 여기 있다.

## 11. 왜 이렇게 동작하는가

오류를 반환값으로 돌려주는 방법도 있다. 그러나 그러면 호출하는 쪽이 매번 확인해야 하고, 확인을 빠뜨리면 잘못된 값이 그대로 흐른다. `throw`는 **확인을 빠뜨릴 수 없게** 만든다. 처리하지 않으면 프로그램이 멈추므로 조용히 지나갈 수 없다.

Call Stack을 거슬러 올라가는 것은 “처리할 수 있는 곳”이 대개 위쪽이기 때문이다. `parseValue`는 값이 잘못됐다는 사실만 알고, 그것을 건너뛸지 기본값을 쓸지 사용자에게 물을지는 위쪽 코드가 안다. 발견하는 곳과 결정하는 곳을 나누는 구조다.

`finally`가 언제나 실행되는 것은 정리 작업 때문이다. 열어 둔 것을 닫고, 표시한 상태를 되돌리는 일은 성공하든 실패하든 해야 한다. 그 코드를 두 번 쓰지 않도록 언어가 자리를 만들어 두었다.

## 12. 자주 하는 오해/실수

### 오해 1: `catch` 뒤에 실패한 줄부터 다시 실행된다

돌아가지 않는다. `try` 블록의 남은 줄은 건너뛰고 `catch`부터 이어진다.

### 오해 2: 문자열을 던져도 된다

```javascript
try {
  throw "문제";
} catch (error) {
  console.log(error.name);
}
```

```text
undefined
```

`name`도 `message`도 없다. `new Error(...)`를 쓴다.

### 오해 3: `try` 범위를 넓게 잡는 편이 안전하다

넓게 잡으면 어느 작업이 실패했는지 알 수 없다. 실패할 수 있는 부분만 감싼다.

### 오해 4: 잡았으면 성공한 것이다

```javascript
try {
  return parseValue(text);
} catch (error) {
  return 0;
}
```

실패를 `0`으로 바꾸면 그 `0`이 평균에 섞인다. 실패를 어떻게 표현할지는 요구사항이 정한다.

### 오해 5: `finally`는 오류일 때만 실행된다

정상 경로에서도 실행된다. 그래서 “언제나”라는 뜻의 이름이다.

## 13. 업무형/엔지니어형 예제

```javascript
function readMeasurement(row) {
  if (row === null || row === undefined) {
    throw new TypeError("행이 없습니다");
  }
  const value = Number(row.measurement);
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${row.measurement}`);
  }
  return value;
}

const rows = [
  { id: "W01", measurement: "94.2" },
  { id: "W02", measurement: "N/A" },
  null,
];

let ok = 0;
const failures = [];

for (const row of rows) {
  try {
    const value = readMeasurement(row);
    ok = ok + 1;
    console.log("OK", value);
  } catch (error) {
    failures.push(error.name);
  }
}

console.log("성공", ok, "실패", failures);
```

출력:

```text
OK 94.2
성공 1 실패 [ 'RangeError', 'TypeError' ]
```

두 실패의 **종류가 다르다**. 하나는 값의 범위가 잘못됐고 하나는 행 자체가 없다. 같은 `catch`로 잡았지만 `name`이 원인을 구분해 준다.

`try`가 반복문 **안**에 있다는 점이 중요하다. 바깥에 있었다면 첫 실패에서 반복 전체가 끝났을 것이다. “한 행이 실패해도 나머지는 처리한다”는 요구가 `try`의 위치로 표현된다.

## 14. 직접 해보기

필수 `id`가 없으면 `TypeError`, measurement가 허용 범위 밖이면 `RangeError`를 던지는 검증 함수를 만들어라. `catch`에서는 두 종류를 구분해 다른 메시지를 내되, 예상하지 않은 종류는 `throw error`로 다시 던진다. 그다음 `try`를 반복문 바깥으로 옮겨 보고 결과가 어떻게 달라지는지 확인한다.

## 15. 확인 문제

1. **Concept**: `throw` 다음 줄은 같은 정상 흐름에서 실행되는가?
2. **Trace**: 정상과 오류 양쪽에서 모두 실행되는 블록은 무엇인가?
3. **Fix**: 다음 코드가 오류 종류를 제대로 보여 주도록 고쳐라.

```javascript
try {
  throw "measurement가 숫자가 아닙니다";
} catch (error) {
  console.log(error.name, error.message);
}
```

## 16. 정답 및 해설

1. 실행되지 않는다. `throw`가 그 함수의 정상 경로를 끝낸다.
2. `finally`다.
3.

```javascript
try {
  throw new TypeError("measurement가 숫자가 아닙니다");
} catch (error) {
  console.log(error.name, error.message);
}
```

```text
TypeError measurement가 숫자가 아닙니다
```

문자열을 던지면 `name`과 `message`가 없다.

예측 문제 정답: 네 줄이며 `값: 94.2` / `정리: 94.2` / `실패: RangeError 숫자가 아닙니다: N/A` / `정리: N/A`. `finally`는 두 번 실행된다.

## 17. 핵심 요약

- `throw`는 그 함수의 정상 경로를 끝낸다. 아래 코드는 실행되지 않는다.
- 오류는 Call Stack을 거슬러 가장 가까운 `catch`를 찾는다. 프레임이 하나씩 걷어내진다.
- `catch`는 실패한 줄로 돌아가지 않는다.
- `finally`는 정상·오류 양쪽에서 실행된다.
- 문자열이 아니라 `Error` 객체를 던진다. `name`이 원인을 구분해 준다.

## 18. 다음 레슨 연결

J19에서는 이런 검증 함수들이 늘어났을 때 **파일을 나누는** 방법을 본다. 이름을 내보내고 가져오는 경계가 어디에 그어지는지 확인한다.

---

# J19. Module

## 1. 레슨 한 줄 질문

**`import`를 만나면 실행 위치는 어느 파일의 몇 행으로 이동하는가?**

## 2. 왜 필요한가 / 현실 상황

파일 하나에 읽기, 파싱, 검증, 출력이 다 들어 있으면 고칠 자리를 찾기 어렵다. 규격을 바꾸려면 어느 줄을 봐야 하는지가 파일 이름에 드러나야 한다.

모듈은 파일마다 책임을 나누고, **밖에 내보낼 이름**을 명시한다. 내보내지 않은 것은 그 파일 안의 일로 남는다. J11의 Scope가 파일 단위로 한 겹 더 생긴다고 보면 된다.

## 3. 학습 목표

- `export`와 `import`로 파일 사이에서 이름을 공유할 수 있다.
- `import`를 만났을 때 **의존 파일의 최상위 코드가 먼저 도는** 순서를 설명할 수 있다.
- 모듈 namespace가 함수의 사본이 아니라 하나의 카드라는 것을 설명할 수 있다.
- 내보내지 않은 이름이 밖에서 보이지 않는 이유를 말할 수 있다.

## 4. 핵심 용어

- **모듈(module)**: 자기 Scope를 가진 파일 하나다.
- **`export`**: 그 파일 밖으로 내보낼 이름을 표시한다.
- **`import`**: 다른 파일의 이름을 현재 파일로 가져온다.
- **module namespace**: 그 모듈이 내보낸 이름들의 묶음이다.
- **평가 순서**: import된 모듈의 최상위 코드가 먼저 실행된다.

## 5. Mental Model

파일 두 개를 나란히 놓고 본다. `import` 줄에서 실행 위치가 **건너간다**.

```text
  predict.js                          config.js
┌───────────────────────────┐       ┌──────────────────────────┐
│ 1 import { LIMIT } from   │──────▶│ 1 export const LIMIT=100 │
│     "./config.js"         │  ①    │ 2                        │
│                           │       │ 3 console.log("config…") │
│ 3 console.log("main…")    │◀──────│                          │
│                           │  ②    └──────────────────────────┘
└───────────────────────────┘

  ① import 줄에서 config.js의 최상위가 끝까지 돈다
  ② 그다음에야 main의 첫 줄이 돈다

  그래서 출력 순서는 config가 먼저다.
```

`import`가 만드는 것은 함수의 사본이 아니라 **카드 하나와 그것을 가리키는 이름**이다.

```text
  module:config ──▶ ┌──────────────┬─────────┐
                    │ LIMIT        │ 100     │
                    │ LABEL        │ "SPEC"  │
                    └──────────────┴─────────┘
                          ▲       ▲
                          │       │
                       LIMIT   LABEL      ← predict.js에 생긴 이름들
```

내보내지 않은 이름은 이 카드에 없다. 그래서 밖에서 찾을 수 없다.

## 6. 핵심 문법 상세 해설

`config.js`:

```javascript
export const LIMIT = 100.0;
export const LABEL = "SPEC";

const INTERNAL = "이 이름은 내보내지 않는다";

console.log("config 최상위가 실행되었습니다");
```

`predict.js`:

```javascript
import { LIMIT, LABEL } from "./config.js";

console.log("main의 첫 줄");
console.log(LABEL, LIMIT);
```

```text
config 최상위가 실행되었습니다
main의 첫 줄
SPEC 100
```

출력 순서가 코드에 적힌 순서와 다르다. `import` 줄이 파일 맨 위에 있고, 그 줄에서 `config.js` 전체가 먼저 돌기 때문이다.

`INTERNAL`은 `export`가 없으므로 `predict.js`에서 가져올 수 없다. 가져오려 하면 오류다. 이것이 모듈이 만드는 경계다.

중괄호가 있는 `import`는 **이름을 골라 가져오는** 것이다.

```javascript
import { LIMIT } from "./config.js";        // 고른 이름만
import * as config from "./config.js";      // 카드 전체를 하나의 이름으로
```

두 번째 형태에서는 `config.LIMIT`처럼 점을 찍어 쓴다. 이름이 어느 파일에서 왔는지가 코드에 드러나므로, 가져올 것이 많을 때 읽기 좋다.

`export default`도 있다. 모듈 하나에 하나만 둘 수 있고, 가져올 때 중괄호를 쓰지 않으며 이름을 마음대로 지을 수 있다.

```javascript
export default function summarize(values) { /* ... */ }
import summarize from "./summarize.js";
```

이 과정에서는 named export만 쓴다. 이름이 양쪽에서 같아야 하므로 “어디서 온 이름인가”를 검색으로 찾을 수 있다.

경로 규칙도 확인해 둔다. 같은 폴더의 파일은 `"./config.js"`처럼 `./`로 시작하고 확장자를 적는다. `"config.js"`는 다른 뜻(설치된 패키지)이 된다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
// utils.js
export const BASE = 10;
console.log("utils 실행");

// main.js
import { BASE } from "./utils.js";
console.log("main 실행");
console.log(BASE);
```

1. `main.js`가 실행을 시작한다. 첫 문장은 `import`다.
2. 실행 위치가 `utils.js`의 1행으로 건너간다. **module frame이 하나 생긴다.**
3. `BASE`가 그 파일의 이름으로 만들어진다.
4. `console.log("utils 실행")`이 실행된다. 출력 첫 줄이 여기서 나온다.
5. 파일 끝에 도달한다. module frame이 사라지고, 내보낸 이름들로 카드가 만들어진다.
6. 실행 위치가 `main.js`의 `import` 줄로 돌아온다. `BASE`라는 이름이 `main.js`에 생긴다.
7. `console.log("main 실행")`.
8. `console.log(BASE)` → `10`.

2번과 5번이 함수 호출과 닮았다. 프레임이 생기고, 코드가 돌고, 프레임이 사라진다. 다른 것은 이 프레임이 **한 번만** 만들어진다는 점이다. 같은 모듈을 여러 곳에서 import해도 최상위 코드는 한 번만 돈다.

## 8. 실행 전 예측 문제

`config.js`:

```javascript
export const LIMIT = 100.0;
export const LABEL = "SPEC";

console.log("config 최상위가 실행되었습니다");
```

`predict.js`:

```javascript
import { LIMIT, LABEL } from "./config.js";

console.log("main의 첫 줄");
console.log(LABEL, LIMIT);
console.log(LIMIT > 99);
```

네 줄의 출력을 **순서대로** 적는다. 특히 첫 줄이 어느 파일에서 나오는지가 이 문제의 전부다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
보이는 파일: predict.js
```

**Step 1 — `import` 줄**

- 실행 위치가 `config.js`로 옮겨 간다. 코드 패널이 그 파일로 바뀐다.
- module frame `module:config`가 Call Stack에 쌓인다.

```text
Call Stack: [ global | module:config ]
보이는 파일: config.js
```

**Step 2 — config.js 1행**

- `LIMIT`이 그 파일의 이름으로 만들어진다. 값은 100.

**Step 3 — config.js 2행**

- `LABEL`이 만들어진다.

**Step 4 — config.js 4행**

```text
Output: config 최상위가 실행되었습니다
```

**첫 출력이 config에서 나왔다.** 이 레슨의 예측 문제 답이 여기다.

**Step 5 — module frame 종료**

- 파일 끝에 도달한다. frame이 사라진다.
- 내보낸 이름 둘로 module namespace 카드가 만들어진다.

```text
module:config ──▶ { LIMIT: 100, LABEL: "SPEC" }
```

**Step 6 — predict.js로 복귀**

- `LIMIT`과 `LABEL`이라는 이름이 `predict.js`에 생긴다. 각각 카드의 값을 가리킨다.
- 코드 패널이 다시 `predict.js`로 돌아온다.

**Step 7 — 3행**

```text
Output: main의 첫 줄
```

**Step 8 — 4행**

```text
Output: SPEC 100
```

**Step 9 — 5행**

- `100 > 99` → `true`.

```text
Output: true
```

**After**

```text
config 최상위가 실행되었습니다
main의 첫 줄
SPEC 100
true
```

`predict.js`의 코드를 위에서 아래로 읽으면 “main의 첫 줄”이 먼저일 것 같지만, `import` 줄이 이미 한 파일을 통째로 돌리고 왔다.

## 10. Visual Script

1. 코드 패널이 두 파일을 전환한다. 지금 실행 중인 파일 이름을 상단에 크게 표시한다.
2. `import` 줄에서 다른 파일로 건너가는 화살표를 그리고, 그 파일의 1행부터 실행되는 것을 보여 준다.
3. Call Stack에 module frame을 함수 프레임과 다른 표시로 쌓는다. 호출이 아니라 **적재**라는 것이 구분되어야 한다.
4. module frame이 끝날 때 그 프레임의 이름 카드들이 module namespace 카드로 옮겨 앉는 애니메이션을 준다. 내보내지 않은 이름은 옮겨 가지 않고 사라진다.
5. 가져온 이름에서 카드로 향하는 화살표를 그린다. 함수 본문이 복사되지 않았다는 것이 보여야 한다.
6. 출력 패널의 첫 줄 옆에 “config.js에서”라는 출처 표시를 붙인다. 순서가 이 레슨의 관찰 대상이다.

## 11. 왜 이렇게 동작하는가

모듈이 자기 Scope를 갖는 것은 이름 충돌을 없애기 위해서다. 파일이 스무 개인 프로그램에서 모든 최상위 이름이 하나의 공간에 있으면, 한 파일에서 `total`을 만드는 순간 다른 파일의 `total`이 깨진다. 파일마다 벽을 세우고 문을 `export`로 여는 방식이 그 문제를 없앤다.

import된 모듈이 먼저 도는 것은 당연한 순서다. `main.js`가 `LIMIT`을 쓰려면 그 값이 이미 만들어져 있어야 한다. 그래서 언어는 의존 관계를 먼저 해결한 뒤 본 파일을 실행한다.

같은 모듈이 한 번만 실행되는 것도 중요하다. 세 파일이 같은 설정 파일을 import한다고 그 파일이 세 번 돌면, 최상위에서 하는 일(연결 열기, 카운터 초기화)이 세 번 일어난다. 한 번만 돌고 결과를 나눠 쓴다.

## 12. 자주 하는 오해/실수

### 오해 1: named import에서 중괄호를 빠뜨린다

```javascript
import LIMIT from "./config.js";   // default export를 찾는다 → undefined
import { LIMIT } from "./config.js"; // 이름을 골라 가져온다
```

중괄호가 “이름을 고른다”는 표시다.

### 오해 2: 내보내지 않은 이름도 가져올 수 있다

`export`가 없으면 그 파일 안의 일이다. 밖에서 이름을 적어도 찾을 수 없다.

### 오해 3: 경로에서 `./`나 확장자를 빼도 된다

브라우저의 ESM에서는 `"./config.js"`처럼 전부 적어야 한다. `"config"`는 설치된 패키지를 찾는 뜻이 된다.

### 오해 4: import는 코드를 복사한다

복사하지 않는다. 카드 하나를 만들고 이름이 그것을 가리킨다. 그래서 `import`한 이름 두 개가 같은 함수를 가리킬 수 있다.

### 오해 5: 두 파일이 서로 import해도 된다

문법상 되지만 어느 쪽이 먼저 돌아야 하는지가 정해지지 않아 값이 `undefined`인 채로 쓰이는 일이 생긴다. 의존은 한 방향으로 그린다.

## 13. 업무형/엔지니어형 예제

`measurement_utils.js`:

```javascript
export const LIMIT = 100.0;

export function parseValue(text) {
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function judge(value) {
  return value > LIMIT ? "HIGH" : "PASS";
}
```

`work.js`:

```javascript
import { LIMIT, parseValue, judge } from "./measurement_utils.js";

const raw = ["94.2", "101.3", "N/A"];
let ok = 0;

for (const text of raw) {
  const value = parseValue(text);
  if (value === null) {
    console.log(text, "→ 사용 불가");
  } else {
    ok = ok + 1;
    console.log(text, "→", value, judge(value));
  }
}

console.log("기준", LIMIT, "· 사용 가능", ok, "건");
```

출력:

```text
94.2 → 94.2 PASS
101.3 → 101.3 HIGH
N/A → 사용 불가
기준 100 · 사용 가능 2 건
```

`judge`가 쓰는 `LIMIT`은 **자기 파일의 이름**이다. `work.js`가 `LIMIT`을 가져오지 않았더라도 `judge`는 정상 동작한다. 함수가 정의된 자리의 이름을 본다는 J11의 규칙이 파일 경계를 넘어서도 그대로다.

`work.js`가 `LIMIT`을 따로 가져온 이유는 마지막 줄에서 **직접 출력**하기 때문이다. 쓰지 않는 이름은 가져오지 않는다.

## 14. 직접 해보기

검증 함수는 `validators.js`에, 합계 함수는 `summaries.js`에 나눠 담아라. `main.js`가 두 파일을 한 방향으로만 의존하도록 화살표를 그린 뒤 `import` 문을 완성한다. 그다음 각 파일의 최상위에 `console.log`를 하나씩 넣어 실행 순서를 직접 확인한다.

## 15. 확인 문제

1. **Concept**: named import에서 이름 주위에 무엇을 쓰는가? 그것은 무슨 뜻인가?
2. **Trace**: `main.js`의 첫 줄이 `import`일 때, 첫 출력은 어느 파일에서 나오는가?
3. **Fix**: 다음 코드가 `100`을 출력하도록 고쳐라.

```javascript
// config.js
const LIMIT = 100.0;

// main.js
import { LIMIT } from "./config.js";
console.log(LIMIT);
```

## 16. 정답 및 해설

1. 중괄호 `{}`를 쓴다. “내보낸 이름 중에서 이것을 고른다”는 뜻이다.
2. import된 파일이다. 그 파일의 최상위 코드가 먼저 끝까지 돈다.
3. `config.js`에서 내보내야 한다.

```javascript
// config.js
export const LIMIT = 100.0;
```

`export`가 없으면 그 이름은 `config.js` 안의 일이다.

예측 문제 정답: `config 최상위가 실행되었습니다` / `main의 첫 줄` / `SPEC 100` / `true`.

## 17. 핵심 요약

- 모듈은 자기 Scope를 가진 파일이며 `export`한 이름만 밖에서 보인다.
- `import` 줄에서 의존 파일의 최상위 코드가 먼저 끝까지 실행된다.
- 같은 모듈은 한 번만 실행되고 결과를 나눠 쓴다.
- import는 코드를 복사하지 않는다. namespace 카드를 만들고 이름이 그것을 가리킨다.
- 함수는 정의된 파일의 이름을 본다. 호출한 파일의 이름이 아니다.

## 18. 다음 레슨 연결

J20에서는 파일이 아니라 **대상 하나**를 단위로 묶는다. 같은 구조와 동작을 가진 Wafer가 여러 장일 때, 설계도와 실물을 나누는 방법을 본다.

---

# J20. Class와 객체 메서드

## 1. 레슨 한 줄 질문

**설계도 하나와 실물 여럿은 화면에서 각각 무엇으로 보이는가?**

## 2. 왜 필요한가 / 현실 상황

Wafer 스물다섯 장이 각각 ID, 측정값, 판정 결과를 갖고, 모두 같은 방식으로 판정된다. Object 리터럴을 스물다섯 번 쓰면 구조가 어긋날 수 있고, 판정 함수를 따로 두면 “이 함수가 어느 데이터의 것인가”가 코드에 드러나지 않는다.

Class는 **만드는 규칙**과 **할 수 있는 일**을 한 곳에 모은다. 그리고 실물마다 자기 값을 갖는다.

## 3. 학습 목표

- `class`로 설계도를 정의하고 `new`로 실물을 만들 수 있다.
- `constructor`가 실물의 초기 상태를 정한다는 것을 설명할 수 있다.
- method가 설계도에 하나만 있고 실물이 공유한다는 것을 확인할 수 있다.
- `this`가 “점 왼쪽의 그 실물”을 가리킨다는 것을 설명할 수 있다.

## 4. 핵심 용어

- **class**: 실물을 만드는 설계도다. 값이 아니라 규칙이 들어 있다.
- **instance**: 설계도로 만든 실물이다. 자기 값을 갖는다.
- **constructor**: `new` 할 때 한 번 실행되어 초기 상태를 만드는 method다.
- **method**: 설계도에 적힌 동작이다. 모든 실물이 같은 것을 쓴다.
- **`this`**: method가 실행되는 동안 “점 왼쪽의 실물”을 가리킨다.

## 5. Mental Model

설계도 카드와 실물 카드는 다른 것이다. 화면에서도 다르게 그려진다.

```text
     설계도 (class Wafer)                실물 (instance)
┌────────────────────────────┐     ┌───────────────────────┐
│ 초기 상태 규칙              │     │ Wafer                 │
│   .id  .measurement .status│     │  .id          "W01"   │
│                            │     │  .measurement 94.2    │
│ method                     │     │  .status      "PASS"  │
│   judge(limit)             │     └───────────────────────┘
│   label()                  │     ┌───────────────────────┐
└────────────────────────────┘     │ Wafer                 │
        ▲        ▲                 │  .id          "W02"   │
        │        │                 │  .measurement 101.3   │
        └────────┴─── method는     │  .status      "HIGH"  │
            여기 하나뿐이다         └───────────────────────┘
```

`new`는 두 가지를 한다.

```text
  new Wafer("W01", 94.2)

   ① 빈 실물 카드를 만든다
   ② constructor를 그 카드를 this로 삼아 실행한다
        this.id = id           → 카드에 칸이 생긴다
        this.measurement = ... → 칸이 하나 더
        this.status = ...      → 칸이 하나 더
   ③ 그 카드를 돌려준다
```

method 안의 `this`는 호출할 때 정해진다.

```text
  first.judge(100)   →  this = first  (점 왼쪽의 그것)
  second.judge(100)  →  this = second

  같은 코드가 다른 카드를 고친다.
```

## 6. 핵심 문법 상세 해설

```javascript
class Wafer {
  constructor(id, measurement) {
    this.id = id;
    this.measurement = measurement;
    this.status = "UNKNOWN";
  }

  judge(limit) {
    this.status = this.measurement > limit ? "HIGH" : "PASS";
    return this.status;
  }

  label() {
    return `${this.id}:${this.status}`;
  }
}
```

`constructor`에는 `function`을 쓰지 않고, method 사이에 쉼표를 찍지 않는다. Object 리터럴과 모양이 비슷해 헷갈리기 쉬운 지점이다.

```javascript
const first = new Wafer("W01", 94.2);
console.log(first.id, first.status);
console.log(first.judge(100.0));
console.log(first.status);
```

```text
W01 UNKNOWN
PASS
PASS
```

`new`를 빠뜨리면 오류다.

```javascript
// TypeError: Class constructor Wafer cannot be invoked without 'new'
const bad = Wafer("W01", 94.2);
```

class는 “부르는 것”이 아니라 “만드는 것”이다.

실물이 여럿이면 값은 따로, method는 공유다.

```javascript
const second = new Wafer("W02", 101.3);
console.log(first === second);
console.log(first.judge === second.judge);
```

```text
false
true
```

두 줄이 이 레슨의 요점이다. 실물은 다르고 method는 같다. 그래서 스물다섯 장을 만들어도 `judge` 코드는 하나뿐이다.

`this`는 호출 형태가 정한다.

```javascript
console.log(first.judge(100.0));
console.log(second.judge(100.0));
console.log(first.status, second.status);
```

```text
PASS
HIGH
PASS HIGH
```

같은 `judge`가 두 번 실행됐고 매번 다른 카드를 고쳤다. 점 왼쪽이 무엇이었는지가 그 차이의 전부다.

Arrow Function을 method로 쓰지 않는 이유가 여기 있다. Arrow는 자기 `this`를 만들지 않고 바깥 것을 쓰므로(J10), 점 왼쪽을 받지 못한다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  bump() {
    this.count = this.count + 1;
    return this.count;
  }
}

const a = new Counter();
const b = new Counter();
console.log(a.bump(), a.bump(), b.bump());
```

1. class 정의가 실행된다. 설계도 카드가 만들어진다. **아직 실물은 없다.**
2. `new Counter()`: 빈 카드가 만들어지고 `constructor` 프레임이 생긴다. `this`는 그 카드다.
3. `this.count = 0`으로 칸이 하나 생긴다. 프레임이 끝나고 카드가 `a`와 연결된다.
4. 또 `new Counter()`: **다른 카드**가 만들어진다. `b`가 그것을 가리킨다.
5. `a.bump()`: `bump` 프레임이 생기고 `this`는 `a`의 카드다. `0 → 1`. `1`을 반환.
6. `a.bump()`: 같은 카드. `1 → 2`. `2`를 반환.
7. `b.bump()`: **다른 카드**. `0 → 1`. `1`을 반환.
8. 출력은 `1 2 1`.

7번이 요점이다. `b`는 두 번의 `a.bump()`와 무관하다. 값은 카드마다 따로다.

## 8. 실행 전 예측 문제

```javascript
class Wafer {
  constructor(id, measurement) {
    this.id = id;
    this.measurement = measurement;
    this.status = "UNKNOWN";
  }

  judge(limit) {
    this.status = this.measurement > limit ? "HIGH" : "PASS";
    return this.status;
  }

  label() {
    return `${this.id}:${this.status}`;
  }
}

const first = new Wafer("W01", 94.2);
const second = new Wafer("W02", 101.3);

console.log(first.judge(100.0), second.judge(100.0));
console.log(first.label(), second.label());
console.log(first === second, first.judge === second.judge);
```

세 줄의 출력을 적는다. 특히 마지막 줄의 두 비교가 왜 반대 답을 내는지 설명해 본다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
힙: (비어 있음)
```

**Step 1 — class 정의**

- 설계도 카드가 힙에 놓인다. method 둘과 초기 상태 규칙 셋이 적힌다.
- 실물은 아직 없다.

```text
class:Wafer ──▶ 초기 상태 규칙: .id .measurement .status
                method: judge(limit), label()
```

**Step 2 — `new Wafer("W01", 94.2)`**

- `Wafer#1` 프레임이 생긴다. `id = "W01"`, `measurement = 94.2`.

**Step 3~5 — constructor 본문**

- `this.id = id` → 실물 카드가 힙에 나타나고 `id` 칸이 생긴다.
- `this.measurement = measurement` → 칸 하나 더.
- `this.status = "UNKNOWN"` → 칸 하나 더.

카드가 **비어 있는 상태로 먼저 생기고 칸이 하나씩 붙는** 순서를 확인한다. 이것이 초기 상태 규칙이 실행되는 장면이다.

**Step 6 — 프레임 종료**

- 실물 카드가 `first`와 연결된다.

**Step 7~11 — 둘째 실물**

- 같은 일이 반복된다. **다른 카드**가 만들어진다.

```text
힙: class:Wafer , Wafer 실물 2개
```

**Step 12 — `first.judge(100.0)`**

- `Wafer.judge#1` 프레임이 생긴다. `limit = 100`.
- `this.measurement`를 읽는다 → `94.2`. `94.2 > 100` → 거짓 → `"PASS"`.
- `this.status`가 `"UNKNOWN" → "PASS"`로 바뀐다. **첫 번째 카드만 바뀐다.**

**Step 13 — `second.judge(100.0)`**

- `Wafer.judge#2`. 같은 코드, 다른 카드. `101.3 > 100` → 참 → `"HIGH"`.

```text
Output: PASS HIGH
```

**Step 14~15 — `label()` 두 번**

- 각 카드의 `id`와 `status`를 읽어 문자열을 만든다.

```text
Output: W01:PASS W02:HIGH
```

**Step 16 — 마지막 비교**

- `first === second`: 두 카드는 다른 상자다 → `false`.
- `first.judge === second.judge`: 둘 다 설계도의 같은 함수를 가리킨다 → `true`.

```text
Output: false true
```

**After**

```text
class:Wafer ──▶ method 2개 (여기 하나뿐)
   ▲    ▲
   │    │
 실물1  실물2
 .status "PASS"   .status "HIGH"
```

## 10. Visual Script

1. 설계도 카드와 실물 카드를 다른 모양으로 그린다. 설계도에는 “규칙”, 실물에는 “값”이라는 라벨을 붙인다.
2. `new` 실행 때 빈 실물 카드가 먼저 생기고 constructor가 칸을 하나씩 붙이는 순서를 보여 준다. 완성된 카드가 통째로 나타나면 안 된다.
3. constructor 프레임의 `this`에서 실물 카드로 연결선을 그린다.
4. method 호출 때 점 왼쪽의 카드에서 `this`로 화살표를 그린다. 두 실물의 호출을 나란히 보면 화살표가 다른 곳을 가리킨다.
5. method는 설계도 카드에만 그리고, 실물 카드에는 그리지 않는다. `first.judge === second.judge`가 `true`인 이유가 그림에 있어야 한다.
6. 속성 변경 때 그 실물 카드만 반짝이고 다른 실물은 그대로임을 보여 준다.

## 11. 왜 이렇게 동작하는가

method를 설계도에 두는 것은 메모리 때문만이 아니다. 실물마다 함수 사본이 있으면 “이 실물의 `judge`는 고쳐졌을 수도 있다”가 가능해진다. 하나만 두면 “Wafer의 `judge`는 언제나 그것”이라고 말할 수 있다.

`this`가 호출할 때 정해지는 것은 method가 여러 실물을 상대하기 때문이다. 정의 시점에는 어느 실물의 것이 될지 알 수 없다. 그래서 점 왼쪽이 그때그때 알려 준다.

이 규칙 때문에 method를 떼어 내면 `this`를 잃는다.

```javascript
const judge = first.judge;
judge(100.0); // this가 없다 → 오류
```

Arrow Function은 반대로 자기 `this`를 만들지 않고 정의된 자리의 것을 그대로 쓴다. 그래서 콜백으로는 편하고(J12) method로는 맞지 않는다. 두 문법의 차이가 여기서 갈린다.

## 12. 자주 하는 오해/실수

### 오해 1: `new` 없이 부를 수 있다

```javascript
const bad = Wafer("W01", 94.2); // TypeError
```

class는 `new`로만 부른다.

### 오해 2: method 사이에 쉼표를 찍는다

Object 리터럴이 아니다. class 본문에서는 쉼표를 찍지 않는다.

### 오해 3: constructor에 `function`을 쓴다

`constructor(id) { ... }`라고만 쓴다.

### 오해 4: method를 Arrow Function으로 쓴다

```javascript
class Bad {
  judge = (limit) => this.measurement > limit;
}
```

동작하는 경우도 있지만 실물마다 함수가 하나씩 생겨 `first.judge === second.judge`가 `false`가 된다. 이 과정에서는 일반 method 문법을 쓴다.

### 오해 5: 실물이 값을 공유한다

각 실물은 자기 칸을 갖는다. 공유되는 것은 method뿐이다.

## 13. 업무형/엔지니어형 예제

```javascript
class Lot {
  constructor(id) {
    this.id = id;
    this.wafers = [];
  }

  record(waferId, measurement) {
    this.wafers.push({ id: waferId, measurement });
    return this.wafers.length;
  }

  summary(limit) {
    const high = this.wafers.filter((wafer) => wafer.measurement > limit);
    return `${this.id}: ${this.wafers.length}장 중 초과 ${high.length}장`;
  }
}

const lot = new Lot("L01");
console.log(lot.record("W01", 94.2));
console.log(lot.record("W02", 101.3));
console.log(lot.record("W03", 96.0));
console.log(lot.summary(100.0));
```

출력:

```text
1
2
3
L01: 3장 중 초과 1장
```

`this.wafers`는 Array이고 `record`가 그 Array를 고친다. `constructor`에서 `this.wafers = []`로 시작했으므로 **실물마다 자기 Array를 갖는다.** 두 번째 Lot을 만들면 그쪽은 빈 Array부터 시작한다.

`summary` 안의 `filter` 콜백은 `this`를 쓰지 않고 매개변수만 쓴다. 그래서 Arrow Function으로 써도 안전하다. `this`를 써야 했다면 Arrow가 바깥(=method)의 `this`를 그대로 물려받으므로 오히려 이쪽이 편하다.

## 14. 직접 해보기

Wafer class에 `isHigh(limit)` method를 추가하라. `judge`와 달리 상태를 바꾸지 않고 참·거짓만 돌려주는 형태여야 한다. 그다음 실물 세 개를 만들어 각각 호출하고, 화면에서 method 카드가 몇 개인지 확인한다. (하나다.)

## 15. 확인 문제

1. **Concept**: `new`가 하는 두 가지 일은 무엇인가?
2. **Trace**: `first.judge === second.judge`는 왜 `true`인가?
3. **Fix**: 다음 코드가 동작하도록 고쳐라.

```javascript
class Wafer {
  constructor(id) {
    this.id = id;
  },
  label() {
    return this.id;
  }
}
```

## 16. 정답 및 해설

1. 빈 실물 카드를 만들고, 그 카드를 `this`로 삼아 `constructor`를 실행한다. 그리고 그 카드를 돌려준다.
2. method는 설계도에 하나만 있고 모든 실물이 그것을 가리키기 때문이다.
3. class 본문에서는 쉼표를 찍지 않는다.

```javascript
class Wafer {
  constructor(id) {
    this.id = id;
  }
  label() {
    return this.id;
  }
}
```

예측 문제 정답: `PASS HIGH` / `W01:PASS W02:HIGH` / `false true`.

## 17. 핵심 요약

- class는 설계도, `new`가 만든 것이 실물이다. 화면에서 두 카드는 다르게 그려진다.
- `constructor`는 실물의 초기 상태를 만든다. 카드는 비어서 생기고 칸이 하나씩 붙는다.
- method는 설계도에 하나만 있고 모든 실물이 공유한다.
- `this`는 점 왼쪽의 실물이다. 호출 형태가 정한다.
- 실물의 값은 카드마다 따로다.

## 18. 다음 레슨 연결

J21부터는 **아직 없는 결과**를 다룬다. 지금 도는 코드와 나중에 도는 코드가 어떻게 갈리는지, 그리고 그 사이에 프로그램이 무엇을 하고 있는지 본다.

---

# J21. Promise

## 1. 레슨 한 줄 질문

**결과가 아직 없는데 값처럼 다룰 수 있다면, 그 값은 지금 무엇인가?**

## 2. 왜 필요한가 / 현실 상황

파일을 읽거나 서버에 요청하는 일은 시간이 걸린다. 그동안 프로그램 전체가 멈춰 있으면 화면이 얼어붙는다. 그래서 JavaScript는 기다리지 않고 다음 줄로 넘어간다.

그러면 결과를 어디서 받는가? **결과가 들어올 자리**를 미리 값으로 만들어 두고, 그 자리에 “도착하면 할 일”을 붙여 둔다. 그 자리가 Promise다.

## 3. 학습 목표

- Promise의 세 상태를 구분하고 상태가 한 번만 정해진다는 것을 설명할 수 있다.
- `.then()`이 새 Promise를 돌려준다는 것을 확인할 수 있다.
- 동기 코드가 먼저 끝나고 `then` 콜백이 나중에 도는 순서를 예측할 수 있다.
- `.catch()`로 실패 경로를 처리할 수 있다.

## 4. 핵심 용어

- **Promise**: 나중에 값이나 실패 이유가 도착할 자리다.
- **pending / fulfilled / rejected**: 진행 중 / 성공값 도착 / 실패 이유 도착.
- **`.then(fn)`**: 성공값이 도착하면 `fn`을 부른다. 그리고 **새 Promise**를 돌려준다.
- **microtask**: 동기 코드가 다 끝난 뒤 도는 짧은 작업이다. `then` 콜백이 여기 들어간다.

## 5. Mental Model

Promise는 상자 하나다. 지금은 비어 있고 나중에 딱 한 번 채워진다.

```text
  const task = delay(10, "결과");

  task ──▶ ┌──────────────────────┐
           │ Promise              │
           │  상태: pending       │  ← 지금은 비어 있다
           └──────────────────────┘
                     │
              10ms 뒤 한 번만
                     ▼
           ┌──────────────────────┐
           │  상태: fulfilled     │
           │  값:  "결과"          │  ← 여기서 다시 바뀌지 않는다
           └──────────────────────┘
```

프로그램은 그 사이에 멈추지 않는다.

```text
  console.log("A")          ──▶ 지금
  const task = delay(...)   ──▶ 지금 (상자만 만든다)
  task.then(fn)             ──▶ 지금 (할 일을 붙여만 둔다)
  console.log("C")          ──▶ 지금
  ────────── 동기 코드 끝 ──────────
  fn 실행                    ──▶ 나중
```

`then`은 상자를 바꾸지 않는다. **새 상자**를 만들어 돌려준다. 그래서 이어 붙일 수 있다.

```text
  task ─┬─ .then(f) ──▶ 새 상자 ─┬─ .then(g) ──▶ 또 새 상자
        │                        │
     원본은 그대로           f가 돌려준 값이 여기 담긴다
```

## 6. 핵심 문법 상세 해설

```javascript
function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}
```

`new Promise(executor)`의 `executor`는 **즉시** 실행된다. 그 안에서 `resolve(값)`을 부르면 상자가 채워진다. 여기서는 `setTimeout`이 나중에 부르도록 예약했다.

상태는 세 가지이고 한 번만 정해진다.

| 상태 | 뜻 | 다음 |
|---|---|---|
| `pending` | 아직 진행 중 | fulfilled 또는 rejected로 **한 번** 바뀐다 |
| `fulfilled` | 성공값이 도착했다 | 끝 |
| `rejected` | 실패 이유가 도착했다 | 끝 |

```javascript
console.log("A");
Promise.resolve().then(() => console.log("B"));
console.log("C");
```

```text
A
C
B
```

`Promise.resolve()`는 이미 완료된 Promise다. 그런데도 `B`가 마지막이다. `then` 콜백은 **현재 동기 코드가 전부 끝난 뒤**에 돈다. 이미 결과가 있어도 줄 사이에 끼어들지 않는다.

체인은 값을 이어 나른다.

```javascript
Promise.resolve([1, 2, 3])
  .then((values) => values.length)
  .then((count) => console.log("개수", count));
```

```text
개수 3
```

첫 `then`이 돌려준 값이 다음 `then`의 인수가 된다. `return`을 빠뜨리면 다음 단계가 `undefined`를 받는다(J10과 같은 함정이다).

실패는 다른 길로 간다.

```javascript
Promise.reject(new RangeError("범위 밖"))
  .then((value) => console.log("성공", value))
  .catch((error) => console.log("실패", error.name));
```

```text
실패 RangeError
```

`then`의 성공 콜백은 건너뛰고 가장 가까운 `catch`로 간다. J18의 오류 경로와 같은 모양이다.

`.finally(fn)`은 성공·실패 양쪽에서 실행되며 값을 바꾸지 않는다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
console.log("1");
const p = Promise.resolve("값");
console.log("2", p);
p.then((v) => console.log("4", v));
console.log("3");
```

1. `1`을 출력한다.
2. 이미 fulfilled인 Promise를 만든다.
3. `2`와 함께 그 Promise를 출력한다. 값이 아니라 상자가 찍힌다: `Promise { '값' }`.
4. `then`으로 할 일을 붙인다. **콜백은 아직 실행되지 않는다.** 대기 목록에 들어간다.
5. `3`을 출력한다. 동기 코드가 끝났다.
6. 이제 대기 목록의 콜백이 돈다. `4 값`을 출력한다.

4번과 6번 사이가 이 레슨의 관찰 대상이다. 그 사이에 Call Stack은 비어 있고 프로그램은 끝나지 않았다.

## 8. 실행 전 예측 문제

```javascript
function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

console.log("A 시작");

const task = delay(10, "결과");
console.log("B 만든 직후:", task);

task.then((value) => {
  console.log("D 도착:", value);
});

console.log("C 동기 끝");
```

네 줄의 출력을 **순서대로** 적는다. 특히 둘째 줄에서 `task`가 무엇으로 찍히는지, 그리고 `D`가 몇 번째 줄인지 예측한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
대기 중인 작업: (없음)
```

**Step 1 — `console.log("A 시작")`**

```text
Output: A 시작
```

**Step 2 — `delay(10, "결과")` 호출**

- `delay` 프레임이 생긴다.
- `new Promise(...)`가 상자를 만들고 executor를 **즉시** 실행한다.
- executor 안의 `setTimeout`이 “10ms 뒤에 할 일”을 예약한다. 예약만 하고 바로 돌아온다.
- 작업 목록에 상자가 하나 올라간다. 상태는 `pending`.

```text
대기 중인 작업: new Promise — 대기
```

**Step 3 — 반환**

- 상자가 `task`와 연결된다. `delay` 프레임이 사라진다.

**Step 4 — `console.log("B 만든 직후:", task)`**

- 상자 자체가 찍힌다. 아직 값이 없다.

```text
Output: B 만든 직후: Promise { <pending> }
```

**Step 5 — `task.then(...)`**

- 콜백을 상자에 붙여 둔다. **콜백은 실행되지 않는다.**
- `then`이 돌려준 새 상자는 어디에도 연결하지 않았으므로 그냥 둔다.

**Step 6 — `console.log("C 동기 끝")`**

```text
Output: C 동기 끝
```

**여기서 동기 코드가 끝났다.** Call Stack이 비었다. 그런데 프로그램은 끝나지 않는다. 작업 목록에 대기 중인 상자가 있기 때문이다.

**Step 7 — 예약된 타이머가 돈다**

- `() => resolve("결과")`가 실행된다. 콜백 프레임이 잠깐 생긴다.
- 상자의 상태가 `pending → fulfilled`로 바뀌고 값이 `"결과"`가 된다.

```text
대기 중인 작업: new Promise — 완료  '결과'
```

**Step 8 — 붙여 둔 콜백이 돈다**

- 상태가 정해졌으므로 대기하던 콜백이 다음 차례에 실행된다.

```text
Output: D 도착: 결과
```

**After**

```text
A 시작
B 만든 직후: Promise { <pending> }
C 동기 끝
D 도착: 결과
```

코드에 적힌 순서는 A → B → D → C인데 실행된 순서는 A → B → C → D다. `then` 안에 적힌 것만 나중에 돌았다.

## 10. Visual Script

1. Promise를 상태 배지가 달린 상자로 그린다. `pending`은 비어 있고 테두리를 강조한다.
2. `new Promise`의 executor가 **즉시** 도는 것을 보여 준다. 여기가 첫 오해가 생기는 자리다.
3. `setTimeout` 예약은 작업 목록에 “예약됨” 표시로 남긴다. 가상 시계를 같이 보여 준다.
4. `then` 호출 때 콜백이 상자에 붙는 애니메이션을 주고, **실행되지 않는다**는 것을 회색으로 표시한다. 동시에 새 상자가 하나 더 생기는 것을 그린다.
5. 동기 코드가 끝나 Call Stack이 비는 순간을 명시적으로 표시한다. “스택은 비었고 프로그램은 끝나지 않았다”가 이 레슨의 결정적 장면이다.
6. 상태가 정해지는 순간 상자의 배지가 바뀌고, 붙어 있던 콜백이 대기 목록으로 옮겨 가고, 그다음 단계에서 실행되는 세 박자를 나눠 보여 준다.

## 11. 왜 이렇게 동작하는가

`then` 콜백이 즉시 돌지 않는 것은 **예측 가능성** 때문이다. 만약 이미 완료된 Promise의 콜백이 즉시 돌면, 같은 코드가 “결과가 이미 있는가”에 따라 다른 순서로 실행된다. 언제나 동기 코드가 끝난 뒤로 미루면 순서가 하나로 정해진다.

상태가 한 번만 정해지는 것도 같은 이유다. 두 번 바뀔 수 있으면 `then` 콜백이 몇 번 도는지, 어떤 값을 받는지 알 수 없다. 한 번만 정해지므로 “결과를 기다린다”가 명확한 뜻을 갖는다.

`then`이 새 Promise를 돌려주는 것은 체인을 만들기 위해서다. 원본을 고친다면 같은 Promise에 두 개의 `then`을 붙였을 때 서로 간섭한다. 새 상자를 만들면 각 체인이 독립적이다.

## 12. 자주 하는 오해/실수

### 오해 1: Promise를 값처럼 쓴다

```javascript
const p = delay(10, [1, 2, 3]);
console.log(p.length);
```

```text
undefined
```

상자에는 `length`가 없다. 값을 꺼내려면 `then`이나 `await`(J22)가 필요하다.

### 오해 2: `then` 콜백에서 `return`을 빠뜨린다

```javascript
Promise.resolve([1, 2, 3])
  .then((values) => { values.length; })
  .then((count) => console.log(count));
```

```text
undefined
```

블록 본문에는 `return`이 필요하다.

### 오해 3: 이미 완료된 Promise의 콜백은 즉시 돈다

돌지 않는다. 동기 코드가 끝난 뒤다.

### 오해 4: `catch`는 마지막에만 쓸 수 있다

체인 어디에나 놓을 수 있고, 그 앞에서 생긴 실패만 잡는다. 뒤에서 생긴 실패는 잡지 못한다.

### 오해 5: `executor` 안의 코드는 나중에 돈다

`new Promise(fn)`의 `fn`은 **즉시** 실행된다. 나중에 도는 것은 그 안에서 예약한 것뿐이다.

## 13. 업무형/엔지니어형 예제

```javascript
function fetchMeasurement(id, ms, value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === null) {
        reject(new RangeError(`측정 실패: ${id}`));
      } else {
        resolve({ id, value });
      }
    }, ms);
  });
}

fetchMeasurement("W01", 20, 94.2)
  .then((row) => {
    console.log("도착:", row.id, row.value);
    return row.value > 100 ? "HIGH" : "PASS";
  })
  .then((status) => {
    console.log("판정:", status);
  })
  .catch((error) => {
    console.log("실패:", error.name, error.message);
  });

fetchMeasurement("W02", 10, null)
  .then((row) => {
    console.log("도착:", row.id);
  })
  .catch((error) => {
    console.log("실패:", error.name, error.message);
  });

console.log("요청 두 건을 보냈습니다");
```

출력:

```text
요청 두 건을 보냈습니다
실패: RangeError 측정 실패: W02
도착: W01 94.2
판정: PASS
```

세 가지를 확인한다.

첫째, **동기 줄이 가장 먼저** 나온다. 요청 두 건은 예약만 되었다.

둘째, **코드에 먼저 적힌 W01이 나중에** 나온다. 대기 시간이 20ms와 10ms로 다르기 때문이다. 코드 순서가 완료 순서를 정하지 않는다.

셋째, W02의 실패는 첫 `then`을 건너뛰고 `catch`로 갔다. W01은 두 `then`을 차례로 지나며 값을 넘겼다.

## 14. 직접 해보기

성공·실패·지연 시간을 고를 수 있는 가상 로더를 만들어라. 그다음 `then` 두 개와 `catch` 하나를 이어 붙이고, 각 단계에서 받은 값을 표로 기록한다. 첫 `then`에서 일부러 `return`을 빼고 다시 실행해 다음 단계가 무엇을 받는지 확인한다.

## 15. 확인 문제

1. **Concept**: Promise의 세 상태는 무엇이며 몇 번 바뀔 수 있는가?
2. **Trace**: `then()`은 원래 Promise를 고치는가?
3. **Fix**: 다음 코드가 `3`을 출력하도록 고쳐라.

```javascript
Promise.resolve([1, 2, 3])
  .then((values) => { values.length; })
  .then((count) => console.log(count));
```

## 16. 정답 및 해설

1. `pending`, `fulfilled`, `rejected`이며 `pending`에서 한 번만 바뀐다.
2. 고치지 않는다. 새 Promise를 돌려준다.
3.

```javascript
Promise.resolve([1, 2, 3])
  .then((values) => values.length)
  .then((count) => console.log(count));
```

블록 본문을 쓰려면 `return values.length;`를 적는다.

예측 문제 정답: `A 시작` / `B 만든 직후: Promise { <pending> }` / `C 동기 끝` / `D 도착: 결과`.

## 17. 핵심 요약

- Promise는 나중에 채워질 자리다. 상태는 `pending`에서 한 번만 바뀐다.
- `new Promise`의 executor는 즉시 실행된다. 나중에 도는 것은 그 안에서 예약한 것뿐이다.
- `then` 콜백은 동기 코드가 전부 끝난 뒤에 돈다. 이미 완료된 Promise라도 마찬가지다.
- `then`은 새 Promise를 돌려주므로 이어 붙일 수 있다. 콜백에서 `return`을 빠뜨리면 다음 단계가 `undefined`를 받는다.
- 실패는 성공 콜백을 건너뛰고 가장 가까운 `catch`로 간다.

## 18. 다음 레슨 연결

J22에서는 같은 기다림을 **위에서 아래로 읽히는 문법**으로 쓴다. 그리고 `await`가 멈추는 것이 프로그램 전체가 아니라 그 함수 하나라는 것을 화면에서 확인한다.

---

# J22. async / await

## 1. 레슨 한 줄 질문

**`await`가 멈추는 것은 프로그램인가, 그 함수 하나인가?**

## 2. 왜 필요한가 / 현실 상황

`then` 체인은 정확하지만 읽기 어렵다. 단계가 셋만 넘어가도 “지금 이 콜백이 받은 값이 어느 단계의 것인지”를 눈으로 따라가야 한다. 조건문이나 반복문이 끼면 더 어려워진다.

`async`/`await`는 같은 일을 **위에서 아래로** 쓰게 해 준다. 문법만 바뀌고 실행 방식은 그대로다. 그래서 J21의 그림을 알고 있어야 이 문법이 안전하게 읽힌다.

## 3. 학습 목표

- `async` 함수가 언제나 Promise를 돌려준다는 것을 설명할 수 있다.
- `await`에서 그 함수만 멈추고 다른 코드는 계속 돈다는 것을 확인할 수 있다.
- `try`/`catch`로 비동기 실패를 처리할 수 있다.
- 독립된 작업을 `Promise.all`로 함께 기다릴 수 있다.

## 4. 핵심 용어

- **`async` 함수**: 반환값이 자동으로 Promise가 되는 함수다.
- **`await`**: Promise의 결과가 정해질 때까지 **그 함수만** 멈춘다.
- **재개(resume)**: 결과가 도착해 멈췄던 자리부터 이어 실행하는 것이다.
- **`Promise.all`**: 여러 작업을 함께 시작해 전부 끝나기를 기다린다.

## 5. Mental Model

`await`는 그 함수의 프레임을 **호출 스택에서 잠시 내려놓는다**. 지역 변수는 그대로 든 채다.

```text
  await 이전                  await 하는 동안             재개 후
┌──────────────┐           ┌──────────────┐          ┌──────────────┐
│ Call Stack   │           │ Call Stack   │          │ Call Stack   │
│  global      │           │  global      │          │  global      │
│  main#1      │           │              │          │  main#1      │
│  loadValue#1 │  ──────▶  │  (비었다)     │ ──────▶  │  loadValue#1 │
└──────────────┘           └──────────────┘          └──────────────┘
                            멈춘 프레임은 옆에서
                            지역 변수를 들고 기다린다
                            그동안 다른 코드가 돈다
```

`async` 함수의 반환값은 언제나 Promise다.

```text
  async function answer() { return 42; }

  answer()  ──▶  Promise { 42 }      ← 42가 아니다
  await answer()  ──▶  42
```

그래서 `async` 함수를 부른 쪽도 기다릴 방법이 필요하다. `await`나 `.then`이다.

## 6. 핵심 문법 상세 해설

```javascript
async function answer() {
  return 42;
}

const result = answer();
console.log(result);
```

```text
Promise { 42 }
```

`return 42`라고 적었지만 나온 것은 상자다. `async`가 붙는 순간 반환값이 감싸인다.

```javascript
async function buildSummary() {
  const values = await delay(10, [1, 2, 3]);
  return { count: values.length };
}
```

1. `delay(...)`가 Promise를 돌려준다.
2. `await`에서 `buildSummary`의 진행만 멈춘다. 프레임이 스택을 떠난다.
3. 그동안 다른 동기 코드와 예약된 작업이 계속 실행된다.
4. Promise가 fulfilled되면 성공값이 `values`에 들어가고 다음 줄부터 재개한다.
5. `return`한 값이 `buildSummary()`가 돌려준 Promise의 성공값이 된다.

**`await`는 프로그램 전체를 멈추지 않는다.** 이 문장이 이 레슨의 전부다.

실패는 `try`/`catch`로 잡는다.

```javascript
async function safeLoad(text) {
  try {
    const value = await readValue(text);
    return { value, error: null };
  } catch (error) {
    return { value: null, error: error.message };
  }
}
```

기다린 Promise가 rejected되면 `await` 자리에서 오류를 던진 것처럼 동작한다. J18에서 배운 문법이 그대로 쓰인다.

독립된 작업은 함께 시작한다.

```javascript
const first = await loadA();
const second = await loadB();
```

이렇게 쓰면 `loadA`가 끝난 뒤에야 `loadB`가 **시작된다**. 두 작업이 서로 무관하다면 낭비다.

```javascript
const [first, second] = await Promise.all([loadA(), loadB()]);
```

이쪽은 둘을 먼저 시작하고 둘 다 끝나기를 기다린다. `loadA()`와 `loadB()`의 괄호에 주목한다. 여기서 이미 호출되어 두 작업이 동시에 진행 중이다.

서로 의존하는 작업(뒤가 앞의 결과를 쓴다)은 순차가 맞다. 독립일 때만 함께 시작한다.

## 7. 컴퓨터처럼 코드 읽기

```javascript
async function work() {
  console.log("2");
  await delay(10, null);
  console.log("4");
}

console.log("1");
work();
console.log("3");
```

1. `1`을 출력한다.
2. `work()` 호출. 프레임이 생기고 본문이 **동기적으로** 시작된다. `2`를 출력한다.
3. `await`를 만난다. `delay`가 만든 Promise가 아직 pending이다.
4. `work#1` 프레임이 스택을 떠난다. `work()`는 pending Promise를 돌려주고 호출한 쪽으로 돌아간다.
5. `3`을 출력한다. 동기 코드가 끝났다.
6. 타이머가 돌아 Promise가 fulfilled된다.
7. `work#1` 프레임이 스택으로 돌아온다. `await` 다음 줄부터 이어 실행한다. `4`를 출력한다.

2번이 중요하다. `async` 함수의 본문은 **첫 `await`까지 동기적으로 실행된다.** 호출하자마자 나중으로 미뤄지는 것이 아니다.

## 8. 실행 전 예측 문제

```javascript
function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function loadValue(id) {
  console.log("요청:", id);
  const value = await delay(10, id * 10);
  console.log("응답:", value);
  return value;
}

async function main() {
  const first = await loadValue(1);
  const second = await loadValue(2);
  console.log("합계", first + second);
}

console.log("A 동기");
main();
console.log("B 동기");
```

일곱 줄의 출력을 **순서대로** 적는다. 특히 `B 동기`가 몇 번째인지, 그리고 `요청: 2`가 `응답: 10`보다 앞인지 뒤인지 예측한다.

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
대기 중인 작업: (없음)
```

**Step 1 — `console.log("A 동기")`**

```text
Output: A 동기
```

**Step 2 — `main()` 호출**

- `main#1` 프레임이 생긴다. 결과 Promise가 작업 목록에 오른다(pending).

**Step 3 — `loadValue(1)` 호출**

- `loadValue#1` 프레임이 생긴다. 결과 Promise가 하나 더 대기 목록에 오른다.
- 본문이 동기적으로 시작된다.

```text
Output: 요청: 1
```

**Step 4 — `delay(10, 10)`**

- 상자가 만들어지고 타이머가 예약된다.

**Step 5 — `loadValue#1`의 `await`**

- 프레임이 스택을 떠난다. 지역 변수 `id = 1`을 든 채 대기한다.
- `loadValue(1)`은 pending Promise를 돌려준다.

**Step 6 — `main#1`의 `await`**

- `main`도 pending Promise를 기다린다. 프레임이 스택을 떠난다.
- `main()`은 pending Promise를 돌려준다.

```text
Call Stack: [ global ]
대기 중인 작업:  main() — 대기 · loadValue() — 대기 · new Promise — 대기
```

**Step 7 — `console.log("B 동기")`**

```text
Output: B 동기
```

동기 코드가 끝났다. **여기까지 출력은 세 줄이고, 그중 둘이 동기 줄이다.**

**Step 8 — 타이머가 돈다**

- `delay`의 상자가 `10`으로 정해진다.

**Step 9 — `loadValue#1` 재개**

- 프레임이 스택으로 돌아온다. `value = 10`.

```text
Output: 응답: 10
```

**Step 10 — `loadValue#1` 반환**

- `return 10`. `loadValue(1)`의 Promise가 `10`으로 정해진다. 프레임이 사라진다.

**Step 11 — `main#1` 재개**

- `first = 10`. 다음 줄로 간다.

**Step 12~15 — 둘째 호출**

- `loadValue(2)`가 같은 과정을 반복한다.

```text
Output: 요청: 2
Output: 응답: 20
```

**Step 16 — 합계**

```text
Output: 합계 30
```

**After**

```text
A 동기
요청: 1
B 동기
응답: 10
요청: 2
응답: 20
합계 30
```

`요청: 1`과 `B 동기` 사이에 `await`가 있었다. 그래서 세 번째 줄이 동기 코드다. 그리고 `요청: 2`는 `응답: 10`보다 **뒤**다 — `main`이 첫 결과를 받은 뒤에야 두 번째 호출을 시작하기 때문이다.

## 10. Visual Script

1. `await`에서 프레임이 Call Stack을 떠나 옆의 “멈춤” 영역으로 이동하는 애니메이션을 준다. 사라지는 것이 아니라 **옮겨 가는** 것으로 그린다.
2. 멈춘 프레임의 지역 변수 카드는 그대로 보인다. 이것이 `then` 체인과의 결정적 차이다.
3. Call Stack이 비는 순간을 명시한다. 그때 작업 목록에는 여러 건이 남아 있어야 한다.
4. 결과가 정해지면 프레임이 스택으로 돌아오고 `await` 다음 줄이 현재 줄이 되는 것을 보여 준다.
5. `async` 함수의 반환값에는 언제나 Promise 배지를 붙인다. `return 42`가 `Promise { 42 }`가 되는 순간을 강조한다.
6. 순차 대기와 `Promise.all`을 나란히 놓고 가상 시계로 비교한다. 두 번째 작업의 **시작 시점**이 다르다는 것이 보여야 한다.

## 11. 왜 이렇게 동작하는가

`async` 함수는 사실 J21의 Promise 위에 얹힌 문법이다. 엔진은 `await`를 만나면 그 함수의 나머지를 “결과가 오면 할 일”로 등록하고 함수를 빠져나간다. 즉 `then` 콜백을 사람 대신 만들어 주는 것이다.

그래서 `await`가 프로그램을 멈추지 않는다. 멈춘 것처럼 보이는 것은 그 함수의 코드가 이어 붙어 있기 때문이고, 실제로는 함수가 조각조각 나뉘어 나중에 이어 실행된다.

`async` 함수가 Promise를 돌려주는 것도 필연이다. 함수가 중간에 빠져나오는데 무언가를 돌려주긴 해야 한다. 그때 돌려줄 수 있는 것은 “나중에 채워질 자리” 뿐이다.

이 구조 때문에 `await`는 `async` 함수 안에서만 쓸 수 있다. 함수가 아닌 곳에서는 “나머지를 나중에 이어 실행한다”는 조각을 만들 수 없기 때문이다.

## 12. 자주 하는 오해/실수

### 오해 1: `await`가 프로그램 전체를 멈춘다

멈추는 것은 그 함수 하나다. 다른 코드는 계속 돈다.

### 오해 2: async 함수의 반환값이 그 값이다

```javascript
async function answer() { return 42; }
console.log(answer());
console.log(answer() + 1);
```

```text
Promise { 42 }
Promise { 42 }1
```

두 번째 줄은 상자와 숫자를 `+`로 이은 결과다(J03). 값을 쓰려면 `await`가 필요하다.

### 오해 3: `await` 없이 결과를 읽는다

```javascript
const rows = loadRows();
console.log(rows.length); // undefined
```

상자에는 `length`가 없다.

### 오해 4: 독립된 작업도 하나씩 기다린다

서로 결과를 쓰지 않는다면 `Promise.all`로 함께 시작한다. 순차로 쓰면 대기 시간이 더해진다.

### 오해 5: `try`/`catch`가 비동기에는 안 통한다

`await`가 있는 자리에서는 통한다. rejected된 Promise는 그 자리에서 던져진 것처럼 동작한다.

## 13. 업무형/엔지니어형 예제

```javascript
function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function readValue(text) {
  const value = await delay(10, Number(text));
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${text}`);
  }
  return value;
}

async function main() {
  const inputs = ["94.2", "N/A", "101.3"];
  let total = 0;
  for (const text of inputs) {
    try {
      const value = await readValue(text);
      total = total + value;
      console.log("OK", value);
    } catch (error) {
      console.log("실패", error.name, error.message);
    }
  }
  console.log("합계", total.toFixed(1));
}

main();
console.log("동기 부분은 여기서 끝납니다");
```

출력:

```text
동기 부분은 여기서 끝납니다
OK 94.2
실패 RangeError 숫자가 아닙니다: N/A
OK 101.3
합계 195.5
```

첫 줄이 동기 코드라는 점을 다시 확인한다. `main()`은 첫 `await`에서 바로 빠져나왔다.

그다음이 이 예제의 요점이다. **반복문과 `try`/`catch`가 비동기 안에서도 그대로 읽힌다.** J08의 반복문과 J18의 오류 처리를 그대로 쓰면서 기다림만 추가되었다. `then` 체인으로 같은 것을 쓰려면 재귀나 `reduce`가 필요하다.

`await`가 반복문 안에 있으므로 세 입력을 **하나씩** 처리한다. 서로 독립이므로 `Promise.all`로 함께 시작할 수도 있지만, 그러면 실패 하나가 전체를 멈추게 할지 아닌지를 따로 정해야 한다.

## 14. 직접 해보기

Equipment 두 개의 가상 데이터를 ① 하나씩 `await`로, ② `Promise.all`로 불러오는 코드를 각각 써 보라. 각 버전에서 **두 번째 작업이 시작되는 시점**을 화면의 작업 목록으로 확인한다. 그다음 둘 중 하나가 실패하도록 만들어 전체 결과가 어떻게 달라지는지 본다.

## 15. 확인 문제

1. **Concept**: `async` 함수는 언제나 무엇을 돌려주는가?
2. **Trace**: `await`는 프로그램 전체와 현재 함수 중 무엇을 멈추는가?
3. **Fix**: 다음 코드가 `3`을 출력하도록 고쳐라.

```javascript
async function load() {
  return [1, 2, 3];
}
const rows = load();
console.log(rows.length);
```

## 16. 정답 및 해설

1. Promise를 돌려준다. `return 42`도 `Promise { 42 }`가 된다.
2. 현재 `async` 함수의 진행만 멈춘다. 다른 코드는 계속 실행된다.
3. 결과를 기다려야 한다.

```javascript
async function load() {
  return [1, 2, 3];
}
async function main() {
  const rows = await load();
  console.log(rows.length);
}
main();
```

예측 문제 정답: `A 동기` / `요청: 1` / `B 동기` / `응답: 10` / `요청: 2` / `응답: 20` / `합계 30`.

## 17. 핵심 요약

- `async` 함수는 언제나 Promise를 돌려준다.
- 본문은 첫 `await`까지 동기적으로 실행된다.
- `await`는 그 함수의 프레임만 스택에서 내려놓는다. 지역 변수는 그대로 남는다.
- `try`/`catch`가 비동기 실패에도 그대로 쓰인다.
- 독립된 작업은 `Promise.all`로 함께 시작한다. 의존하는 작업은 순차가 맞다.

## 18. 다음 레슨 연결

J23에서는 지금까지 배운 것을 하나의 프로그램으로 잇는다. 비동기 로딩, JSON 파싱, 변환·선별·집계, 오류 처리가 한 줄기로 이어지고, 각 단계에서 데이터의 **모양**이 어떻게 바뀌는지 따라간다.

---

# J23. 비동기 Measurement 요약기

## 1. 레슨 한 줄 질문

**입력이 프로그램에 들어와 보고서가 되기까지, 데이터의 모양은 몇 번 바뀌는가?**

## 2. 왜 필요한가 / 현실 상황

지금까지 배운 것이 실제 프로그램에서는 한 줄기로 이어진다. 데이터를 비동기로 받고, 텍스트를 값으로 바꾸고, 쓸 수 있는 것만 고르고, 하나로 줄이고, 실패하면 그 사실을 결과에 담아 돌려준다.

각 단계는 이미 배웠다. 새로 배울 것은 **잇는 방법**이다. 그리고 이었을 때 생기는 문제 — 어디서 실패했는지, 실패했을 때 무엇을 돌려줘야 하는지 — 를 다룬다.

## 3. 학습 목표

- 비동기 로딩부터 요약까지의 데이터 모양 변화를 단계별로 말할 수 있다.
- 성공과 실패가 **같은 모양의 결과**를 돌려주게 만들 수 있다.
- `Number(null)`과 `Number("")`가 0이라는 함정을 피할 수 있다.
- 빈 입력에서 평균이 무엇이어야 하는지 정하고 그 결정을 코드로 옮길 수 있다.

## 4. 핵심 용어

- **파이프라인**: 한 단계의 출력이 다음 단계의 입력이 되는 처리 흐름이다.
- **정규화(normalize)**: 여러 모양의 입력을 하나의 모양으로 맞추는 일이다.
- **결과 계약**: 성공이든 실패든 호출자가 받는 키가 같다는 약속이다.
- **경계**: 프로그램 바깥의 텍스트가 값이 되는 지점이다.

## 5. Mental Model

데이터는 여섯 번 모양을 바꾼다. 각 화살표가 한 단계다.

```text
        Promise                      ← 아직 값이 아니다
           │ await
           ▼
        JSON 문자열                   ← 글자의 나열
           │ JSON.parse
           ▼
        Array<Object>                ← 상자들
           │ map(toMeasurement)
           ▼
        Array<Number | null>         ← 실패한 자리는 null
           │ filter(!== null)
           ▼
        Array<Number>                ← 쓸 수 있는 값만
           │ filter + reduce
           ▼
        Summary Object               ← 보고서
```

각 함수가 무엇을 받아 무엇을 돌려주는지 이 표로 고정해 두면, 메서드가 다섯 개 이어져도 길을 잃지 않는다.

실패는 파이프라인을 끊지 않고 **결과에 담긴다**.

```text
  성공: { validCount: 2, passCount: 1, average: 97.75, error: null }
  실패: { validCount: 0, passCount: 0, average: null,  error: "..." }
             ↑ 키가 같다. 호출자는 error만 보면 된다.
```

## 6. 핵심 문법 상세 해설

### 6.1 가상 로더

```javascript
function loadVirtualData(ms, text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text === null) {
        reject(new Error("로더가 응답하지 않았습니다"));
      } else {
        resolve(text);
      }
    }, ms);
  });
}
```

실제 네트워크 대신 시간이 걸리는 일을 흉내 낸다. `text`가 `null`이면 실패하도록 해 두어, 로딩 실패 경로도 시험할 수 있다.

### 6.2 값 하나를 읽는 규칙

```javascript
function toMeasurement(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
```

**변환보다 검사가 먼저다.** `Number(null)`과 `Number("")`는 둘 다 `0`이다(J03). 그대로 변환하면 “값이 없음”이 “측정값 0”이 되어 평균에 섞인다. 그래서 명시적 결측을 먼저 걸러 낸다.

실패를 `null`로 통일하는 이유는 다음 단계가 한 가지만 검사하면 되게 하기 위해서다. `NaN`을 그대로 흘려보내면 `Number.isFinite`를 매번 다시 불러야 한다.

### 6.3 요약

```javascript
function summarize(rows, lower = 90.0, upper = 100.0) {
  const values = rows
    .map((row) => toMeasurement(row.measurement))
    .filter((value) => value !== null);

  const passed = values.filter((value) => value >= lower && value <= upper);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    validCount: values.length,
    passCount: passed.length,
    average: values.length > 0 ? total / values.length : null,
    error: null,
  };
}
```

세 도구가 각자의 일만 한다. `map`이 모양을 바꾸고(J12), `filter`가 개수를 줄이고(J13), `reduce`가 하나로 만든다(J14).

평균의 분모가 `0`이 될 수 있으므로 `values.length > 0`을 검사한다. 빈 입력의 평균을 `0`으로 두면 “측정값이 전부 0이었다”와 구분되지 않으므로 `null`로 정한다. 이것은 문법이 아니라 **요구사항 결정**이다.

### 6.4 비동기 경계

```javascript
async function loadAndSummarize(ms, text) {
  try {
    const jsonText = await loadVirtualData(ms, text);
    const rows = JSON.parse(jsonText);
    return summarize(rows);
  } catch (error) {
    return { validCount: 0, passCount: 0, average: null, error: error.message };
  }
}
```

`try` 안에 두 가지 실패가 들어 있다. 로딩 실패는 `await`에서, JSON 문법 오류는 `JSON.parse`에서 난다. 둘 다 같은 `catch`가 받는다.

성공과 실패가 **같은 네 키**를 돌려준다. 그래서 호출자는 결과가 무엇이든 `result.error`만 확인하면 된다.

### 6.5 실행

```javascript
const GOOD =
  '[{"wafer":"W01","measurement":"94.2"},' +
  '{"wafer":"W02","measurement":"N/A"},' +
  '{"wafer":"W03","measurement":101.3}]';

async function main() {
  const ok = await loadAndSummarize(10, GOOD);
  console.log("정상:", ok.validCount, ok.passCount, ok.average, ok.error);

  const broken = await loadAndSummarize(10, "{망가진 JSON");
  console.log("파싱 실패:", broken.validCount, broken.average, broken.error !== null);

  const down = await loadAndSummarize(10, null);
  console.log("로더 실패:", down.validCount, down.error);

  const empty = await loadAndSummarize(10, "[]");
  console.log("빈 입력:", empty.validCount, empty.average);
}

main();
console.log("동기 부분 끝");
```

네 경우를 한 프로그램에서 확인한다. 정상, 파싱 실패, 로딩 실패, 빈 입력이다.

## 7. 컴퓨터처럼 코드 읽기

전체 프로그램의 큰 순서는 이렇다.

1. 함수 네 개가 정의된다. 아직 아무것도 실행되지 않았다.
2. `main()`이 호출된다. 첫 `await`까지 동기적으로 실행되고, 거기서 프레임이 스택을 떠난다.
3. `console.log("동기 부분 끝")`이 실행된다. **여기까지가 동기 코드다.**
4. 타이머가 돌아 첫 로딩이 끝난다. `loadAndSummarize`가 재개된다.
5. `JSON.parse`가 텍스트를 Array로 만든다. `summarize`가 세 단계를 지나 요약 Object를 만든다.
6. `main`이 재개되어 첫 줄을 출력한다.
7. 나머지 세 경우가 같은 방식으로 차례차례 처리된다.

3번이 이 프로그램에서 가장 자주 오해되는 지점이다. 출력의 첫 줄이 코드의 마지막 줄에서 나온다.

레코드별로 따라가면 이렇다.

| Wafer | 원본 | `toMeasurement` | 유효 | PASS(90~100) | 평균에 포함 |
|---|---|---:|---|---|---|
| W01 | `"94.2"` | 94.2 | 예 | 예 | 예 |
| W02 | `"N/A"` | `null` | 아니오 | — | 아니오 |
| W03 | `101.3` | 101.3 | 예 | 아니오 | 예 |

따라서 `validCount = 2`, `passCount = 1`, `average = (94.2 + 101.3) / 2 = 97.75`다.

## 8. 실행 전 예측 문제

§6의 6.1~6.5를 이어 붙인 프로그램을 실행한다. 출력 다섯 줄을 **순서대로** 적는다.

특히 다음 세 가지를 먼저 정한다.

- 첫 줄은 어느 `console.log`에서 나오는가?
- `average`는 몇인가? W02의 `"N/A"`가 평균에 들어가는가?
- 빈 입력의 `average`는 `0`인가 `null`인가?

## 9. 단계 실행 Walkthrough

**Before**

```text
Call Stack: [ global ]
대기 중인 작업: (없음)
```

**Step 1~4 — 정의**

- 함수 네 개와 상수 하나가 만들어진다. 몸통은 아직 돌지 않았다.

**Step 5 — `main()` 호출**

- `main#1` 프레임이 생기고 결과 Promise가 대기 목록에 오른다.
- 첫 줄 `loadAndSummarize(10, GOOD)`가 호출된다. 그 프레임도 생긴다.
- `loadVirtualData`가 Promise를 만들고 타이머를 예약한다.
- `loadAndSummarize`가 `await`에서 멈춘다. 이어서 `main`도 멈춘다.

```text
Call Stack: [ global ]
대기 중인 작업:  main() 대기 · loadAndSummarize() 대기 · new Promise 대기
```

**Step 6 — 동기 코드의 끝**

```text
Output: 동기 부분 끝
```

**Step 7 — 첫 타이머**

- `resolve(GOOD)`가 실행되어 Promise가 문자열로 정해진다.

**Step 8 — `loadAndSummarize` 재개**

- `jsonText`에 문자열이 들어온다. 타입은 String이다.

**Step 9 — `JSON.parse`**

- 상자 세 개짜리 Array가 만들어진다. 힙에 Array 하나와 Object 셋이 나타난다.

**Step 10 — `summarize` 호출**

- `map` 콜백이 세 번 돈다. `toMeasurement` 프레임도 세 번 생겼다 사라진다.

```text
map 결과: [94.2, null, 101.3]
```

`"N/A"`는 `Number`로 바꾸면 `NaN`이지만, 우리 함수는 `null`로 통일했다.

**Step 11 — `filter`**

```text
values: [94.2, 101.3]      length 2
```

**Step 12 — PASS 선별**

- `94.2`는 90~100 안이라 통과, `101.3`은 벗어난다.

```text
passed: [94.2]             length 1
```

**Step 13 — `reduce`**

```text
0 → 94.2 → 195.5
average = 195.5 / 2 = 97.75
```

**Step 14 — 결과 Object 반환, `main` 재개**

```text
Output: 정상: 2 1 97.75 null
```

**Step 15~17 — 파싱 실패**

- 로딩은 성공해 문자열이 도착한다.
- `JSON.parse("{망가진 JSON")`이 `SyntaxError`를 던진다.
- `catch`가 받아 실패 모양의 Object를 돌려준다.

```text
Output: 파싱 실패: 0 null true
```

**Step 18~20 — 로더 실패**

- 타이머가 `reject`를 부른다. `await` 자리에서 오류가 난 것처럼 동작한다.
- `JSON.parse`는 실행되지 않는다.

```text
Output: 로더 실패: 0 로더가 응답하지 않았습니다
```

**Step 21~23 — 빈 입력**

- `JSON.parse("[]")`가 빈 Array를 만든다.
- `map`과 `filter` 콜백이 **한 번도 호출되지 않는다.**
- `reduce`는 초기값 `0`을 그대로 돌려준다. 평균은 분모가 0이므로 `null`.

```text
Output: 빈 입력: 0 null
```

**After**

```text
동기 부분 끝
정상: 2 1 97.75 null
파싱 실패: 0 null true
로더 실패: 0 로더가 응답하지 않았습니다
빈 입력: 0 null
```

네 경우 모두 같은 네 키를 돌려주었다. 호출한 쪽 코드는 한 가지 모양만 다루면 된다.

## 10. Visual Script

1. 화면 위쪽에 §5의 데이터 모양 사슬을 항상 띄우고, 지금 어느 단계인지 표시한다. 긴 파이프라인에서 위치를 잃지 않게 하는 장치다.
2. `await` 지점마다 Call Stack이 비고 작업 목록이 차는 것을 보여 준다. 이 프로그램에서는 그 순간이 네 번 나온다.
3. `map` → `filter` → `reduce`에서 Array가 세 번 새로 만들어지는 것을 나란히 그린다. 원본은 계속 남아 있다.
4. `toMeasurement`가 `null`을 돌려주는 회차에서 그 자리를 다른 표시로 남긴다. 값이 사라진 것이 아니라 “쓸 수 없음”으로 기록된 것이다.
5. 실패 경로에서는 `try` 안의 남은 줄이 흐려지고 `catch`가 만든 Object가 같은 네 칸으로 채워지는 것을 보여 준다. 성공 결과와 나란히 놓아 키가 같음을 강조한다.
6. 빈 입력 회차에서는 콜백 프레임이 하나도 생기지 않는 것을 보여 준다. “반복이 0회 돈다”가 화면에 보여야 한다.

## 11. 왜 이렇게 동작하는가

이 프로그램의 구조는 “각 함수가 한 가지만 한다”는 원칙에서 나왔다.

`toMeasurement`는 값 하나를 판단한다. 여러 값을 보지 않으므로 시험하기 쉽다. `summarize`는 동기 함수다. 비동기를 섞지 않았으므로 Array만 주면 어디서든 부를 수 있다. `loadAndSummarize`만 비동기이고, 그 함수의 일은 **경계를 지키는 것**이다.

비동기를 한 함수에만 가둔 것이 이 설계의 핵심이다. 파이프라인 전체가 `async`가 되면 각 단계를 따로 시험할 수 없고, `await`가 어디에 필요한지도 흐려진다.

성공과 실패가 같은 키를 돌려주는 것은 호출자를 위한 결정이다. 실패할 때 `null`이나 다른 모양을 돌려주면 호출자가 매번 “이번엔 무슨 모양인가”를 먼저 확인해야 한다. 같은 모양이면 `result.error`만 보면 된다.

## 12. 자주 하는 오해/실수

### 오해 1: `await` 전에 결과를 쓴다

```javascript
const rows = loadVirtualData(10, GOOD);
console.log(rows.length); // undefined
```

Promise에는 `length`가 없다.

### 오해 2: JSON 문자열에 바로 `map`을 부른다

```javascript
jsonText.map(...); // TypeError
```

`JSON.parse`가 먼저다(J17).

### 오해 3: `Number(null)`과 `Number("")`가 `NaN`이다

둘 다 `0`이다. 누락값이 유효값으로 세어지는 가장 흔한 원인이다. 변환 **전에** 검사한다.

### 오해 4: 평균을 PASS 값으로만 낸다

요구사항이 “유효값의 평균”이라면 PASS 여부와 무관하게 유효한 값 전부를 쓴다. 두 개념을 섞으면 숫자가 조용히 틀린다.

### 오해 5: 실패할 때 다른 모양을 돌려준다

```javascript
catch (error) {
  return null; // 호출자가 매번 분기해야 한다
}
```

같은 키를 유지한다.

### 오해 6: 빈 입력의 평균은 0이다

`0`은 “전부 0으로 측정되었다”와 구분되지 않는다. `null`로 두고 호출자가 판단하게 한다.

## 13. 업무형/엔지니어형 예제

요약에 두 가지를 더한다. 잘못된 값의 개수와, 다시 봐야 할 Wafer 목록이다.

```javascript
function toMeasurement(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function summarize(rows, lower = 90.0, upper = 100.0) {
  const parsed = rows.map((row) => ({
    wafer: row.wafer,
    value: toMeasurement(row.measurement),
  }));

  const valid = parsed.filter((row) => row.value !== null);
  const review = valid.filter((row) => row.value < lower || row.value > upper);
  const total = valid.reduce((sum, row) => sum + row.value, 0);

  return {
    validCount: valid.length,
    invalidCount: parsed.length - valid.length,
    passCount: valid.length - review.length,
    average: valid.length > 0 ? total / valid.length : null,
    reviewWaferIds: review.map((row) => row.wafer),
    error: null,
  };
}

const rows = [
  { wafer: "W01", measurement: "94.2" },
  { wafer: "W02", measurement: "N/A" },
  { wafer: "W03", measurement: 101.3 },
  { wafer: "W04", measurement: "" },
];

const summary = summarize(rows);
console.log(summary.validCount, summary.invalidCount, summary.passCount);
console.log(summary.average.toFixed(2));
console.log(summary.reviewWaferIds);
console.log(JSON.stringify(summary));
```

출력:

```text
2 2 1
97.75
[ 'W03' ]
{"validCount":2,"invalidCount":2,"passCount":1,"average":97.75,"reviewWaferIds":["W03"],"error":null}
```

`map`의 결과를 숫자가 아니라 **`{ wafer, value }` Object**로 바꾼 것이 이 버전의 핵심이다. 값만 남기면 나중에 “어느 Wafer였는지”를 되찾을 수 없다. 어느 단계에서 무엇을 버릴지는 마지막에 무엇이 필요한지가 정한다.

`W04`의 빈 문자열이 `invalidCount`에 들어간 것도 확인한다. `Number("")`가 `0`이라 그냥 변환했다면 유효값 세 개, 평균 65.17이 되었을 것이다.

## 14. 직접 해보기

1. `summarize`에 `maxValue`와 `minValue`를 추가하라.
2. `loadAndSummarize`의 `catch`가 오류 **종류**도 담게 하라(`errorName`). 로딩 실패와 파싱 실패를 구분할 수 있어야 한다.
3. 다섯 경우로 시험하라: 정상 응답, 빈 Array, 모두 잘못된 값, 잘못된 JSON, 로더 실패.
4. 다섯 경우 모두 결과 Object의 **키가 같은지** 확인하라.

## 15. 확인 문제

1. **Concept**: `await` 직후 `jsonText`의 타입은 무엇이고, `JSON.parse` 직후는 무엇인가?
2. **Trace**: `Number(null)`이 `0`인데 누락값을 제외하려면 어느 시점에 무엇을 검사해야 하는가?
3. **Fix**: 다음 코드가 빈 입력에서 `null`을 돌려주도록 고쳐라.

```javascript
function average(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}
console.log(average([]));
```

## 16. 정답 및 해설

1. `await` 직후는 String, `JSON.parse` 직후는 `Array<Object>`다.
2. `Number()`를 부르기 **전에** `raw === null || raw === undefined || raw === ""`를 검사한다.
3. 분모가 0인 경우를 먼저 처리한다.

```javascript
function average(values) {
  if (values.length === 0) {
    return null;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}
console.log(average([]));
```

원래 코드는 `0 / 0`이라 `NaN`을 돌려준다. `NaN`은 조용히 다음 계산으로 번진다(J03).

예측 문제 정답: `동기 부분 끝` / `정상: 2 1 97.75 null` / `파싱 실패: 0 null true` / `로더 실패: 0 로더가 응답하지 않았습니다` / `빈 입력: 0 null`.

## 17. 핵심 요약

- 데이터는 Promise → 문자열 → Array<Object> → Array<Number|null> → Array<Number> → Summary로 모양을 바꾼다. 각 단계에서 무엇을 받아 무엇을 돌려주는지 말할 수 있어야 한다.
- 비동기는 경계 함수 하나에만 둔다. 나머지는 동기 함수라 따로 시험할 수 있다.
- 변환보다 검사가 먼저다. `Number(null)`과 `Number("")`는 `0`이다.
- 성공과 실패가 같은 키를 돌려준다. 호출자는 `error`만 확인한다.
- 빈 입력의 평균은 `0`이 아니라 `null`이다. 이것은 문법이 아니라 요구사항 결정이다.

## 18. 다음 레슨 연결

이 과정의 마지막 레슨이다. 최종 프로그램에는 선언과 타입(J02·J03), 문자열(J04), Array와 Object(J05·J06), 조건과 반복(J07·J08), 함수와 Closure(J09~J11), map·filter·reduce(J12~J14), 구조 분해와 spread(J15·J16), JSON(J17), 오류(J18), 그리고 Promise와 async/await(J21·J22)가 모두 들어 있다.

코드를 외우기보다 **각 줄 앞뒤에서 데이터의 모양이 무엇인지** 말할 수 있다면 이 과정의 목표를 달성한 것이다.

---

# J01~J23 개념 연결 지도

| 레슨 | 남는 한 문장 | 어디서 다시 쓰이는가 |
|---|---|---|
| J01 출력과 주석 | 출력과 저장은 다른 사건이다 | 모든 레슨의 관찰 통로 |
| J02 let·const·타입 | `const`는 연결을 고정하지 값을 얼리지 않는다 | J05·J06의 참조 |
| J03 연산자와 변환 | `+`만 두 얼굴을 가진다 | J04·J17·J23의 데이터 정제 |
| J04 문자열 | 문자열 메서드는 새것을 돌려준다 | J12의 비변경 원칙 |
| J05 Array | 원본을 바꾸는 메서드와 새것을 만드는 메서드가 갈린다 | J12~J14 |
| J06 Object와 참조 | 할당은 화살표를 하나 더 그린다 | J16의 얕은 복사, J20의 instance |
| J07 조건과 truthy | falsy는 일곱 가지뿐이다 | J13의 술어 |
| J08 반복문 | 세는 반복과 값을 꺼내는 반복은 단계 수가 다르다 | J12~J14의 대안 |
| J09 함수 | 호출마다 프레임이 생기고 반환과 함께 사라진다 | 이후 전부 |
| J10 Arrow Function | 중괄호를 쓰면 `return`이 필요하다 | J12~J14의 콜백 |
| J11 Scope와 Closure | 함수는 정의된 자리의 이름을 본다 | J12의 콜백, J19의 module |
| J12 map | 개수를 유지하고 모양을 바꾼다 | J23의 파이프라인 |
| J13 filter와 find | 고르는 일과 찾는 일은 멈추는 시점이 다르다 | J23 |
| J14 reduce | 콜백의 반환값이 다음 회차로 건너간다 | J23의 집계 |
| J15 구조 분해 | Array는 위치로, Object는 이름으로 | J22의 `Promise.all` 결과 |
| J16 Spread와 Rest | 쓰는 자리는 펼치고 받는 자리는 모은다 | J06의 복사, J23의 병합 |
| J17 JSON | 텍스트와 값은 다른 것이다 | J23의 경계 |
| J18 오류 | 오류는 값이 아니라 경로다 | J22·J23의 실패 처리 |
| J19 Module | `import` 줄에서 다른 파일이 통째로 돈다 | 프로그램 구조 |
| J20 Class | 설계도는 하나, 실물은 여럿 | 데이터 모델링 |
| J21 Promise | 상태는 한 번만 정해진다 | J22·J23 |
| J22 async/await | 멈추는 것은 그 함수 하나다 | J23 |
| J23 종합 | 실패도 같은 모양으로 돌려준다 | 실무 |

# Python 트랙과 나란히 읽기

두 트랙은 **같은 열여덟 개 절**로 되어 있다. 같은 자리에 같은 종류의 내용이 있으므로 나란히 놓고 읽을 수 있다.

| 주제 | Python | JavaScript | 다른 점 |
|---|---|---|---|
| 출력 | P01 `print()` | J01 `console.log()` | JS는 `console` 객체의 method다 |
| 이름과 값 | P02 | J02 | JS는 `const`/`let`으로 재할당 가능 여부를 선언에 적는다 |
| 타입 변환 | P03 | J03 | Python은 `"1" + 1`이 오류, JS는 `"11"` |
| 문자열 | P04 f-string | J04 Template Literal | 둘 다 불변이고 메서드가 새것을 돌려준다 |
| 순서 있는 묶음 | P06 List | J05 Array | Python은 Tuple로 불변을 표현, JS는 관례로 다룬다 |
| 키로 찾는 묶음 | P07 Dictionary | J06 Object | JS의 Object 키는 문자열이다 |
| 조건 | P08 | J07 | Python의 빈 리스트는 거짓, JS의 `[]`는 참 |
| 반복 | P09·P10 | J08 | `for i in range(3)` 대 `for (let i = 0; i < 3; i++)` — JS는 조건 검사가 드러난다 |
| 함수 | P12 | J09·J10 | JS는 함수가 값이라는 점이 문법에 더 드러난다 |
| Scope | P13 | J11 | Python은 함수 Scope, JS는 블록 Scope |
| 변환·선별·집계 | P14·P15 | J12~J14 | Python은 comprehension, JS는 메서드 체인 |
| 묶음 풀기 | P16 | J15 | 이름이 다를 뿐 같은 일이다 |
| 예외 | P19 | J18 | `except` 대 `catch`, 나머지는 같다 |
| 파일 나누기 | P20 | J19 | Python은 `import config`, JS는 `import { x } from "./config.js"` |
| Class | P21 | J20 | Python은 `self`를 매개변수로 적고 JS는 `this`가 자동이다 |
| 비동기 | (없음) | J21~J23 | JavaScript 트랙에만 있다 |

두 트랙을 다 읽었다면, 같은 프로그램을 두 언어로 쓰고 **화면의 단계 수를 비교해 보는 것**이 가장 좋은 마무리다. 무엇이 언어의 차이이고 무엇이 그저 표기의 차이인지가 거기서 갈린다.
