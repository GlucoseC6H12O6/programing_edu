# JavaScript 응용·종합 원고 — J17~J23

## J17. JSON

### 이번 레슨이 끝나면

JSON 텍스트와 JavaScript Object를 구분하고 `JSON.parse()`와 `JSON.stringify()`로 서로 변환할 수 있다. 잘못된 JSON의 기본 문법 오류도 찾을 수 있다.

### 왜 배우나요?

웹 API나 파일은 JavaScript의 Object를 그대로 전송하지 않는다. 언어가 달라도 읽을 수 있는 텍스트 규칙인 JSON을 주로 사용한다. 계산하려면 텍스트를 JavaScript 값으로 바꾸고, 저장하거나 전송하려면 다시 텍스트로 바꿔야 한다.

### JSON 텍스트를 Object로 바꾸기

```javascript
const text = '{"lot":"LOT-A01","measurements":[94.2,96.0]}';
const data = JSON.parse(text);

console.log(typeof text); // "string"
console.log(data.lot);    // "LOT-A01"
```

`text`는 글자 하나하나가 들어 있는 String이다. 아직 `text.lot`으로 접근할 수 없다. `JSON.parse()`가 문법을 검사하고 Object와 Array를 만들어야 속성을 사용할 수 있다.

### Object를 JSON 텍스트로 바꾸기

```javascript
const summary = { validCount: 2, average: 95.1 };
const compact = JSON.stringify(summary);
const pretty = JSON.stringify(summary, null, 2);
```

`stringify` 결과는 String이다. 세 번째 인수 2를 주면 사람이 읽기 좋은 들여쓰기가 들어간다.

### JSON의 규칙

- Object 키와 문자열은 큰따옴표를 사용한다.
- 마지막 항목 뒤에 쉼표를 두지 않는다.
- 주석을 넣을 수 없다.
- 값으로 문자열, 숫자, Boolean, `null`, Array, Object를 쓸 수 있다.
- 함수와 `undefined`는 일반적인 JSON 값으로 표현되지 않는다.

### 먼저 예상해 보기

```javascript
const source = { id: "W01", note: undefined, check: () => true };
const text = JSON.stringify(source);
```

결과 문자열에 어떤 속성이 남는지 예상한다.

### 파싱 오류 읽기

```javascript
JSON.parse("{'lot': 'A'}");
```

JavaScript Object처럼 작은따옴표를 썼지만 JSON은 큰따옴표만 허용하므로 `SyntaxError`가 발생한다. 오류 메시지와 표시된 문자 위치를 보고 따옴표·쉼표·괄호를 확인한다.

### 자주 하는 실수

- JSON 문자열과 이미 파싱된 Object를 같은 것으로 본다.
- `JSON.parse()`에 Object를, `JSON.stringify()`에 JSON 문자열을 무조건 다시 넣는다.
- 함수나 `undefined`도 원래 모습 그대로 저장될 것으로 기대한다.
- 순환 참조가 있는 Object를 stringify한다. 일반 JSON은 순환 구조를 표현할 수 없다.

### 직접 해보기

따옴표, 끝 쉼표, 닫는 괄호가 각각 잘못된 JSON 세 개를 수정한다. 파싱한 Object에 `status`를 추가하고 보기 좋은 JSON 문자열로 다시 만든다.

### 확인 문제

1. JSON 문자열을 Object로 바꾸는 함수는 무엇인가?
2. Object를 전송 가능한 JSON 문자열로 바꾸는 함수는 무엇인가?
3. JSON 문자열에서 작은따옴표와 주석을 사용할 수 있는가?

<details><summary>정답과 해설</summary>

1. `JSON.parse()`다.
2. `JSON.stringify()`다.
3. 둘 다 사용할 수 없다. JSON 문자열과 키에는 큰따옴표를 쓰고 주석은 허용하지 않는다.
4. 예상 문제에서는 `id`만 남아 `{"id":"W01"}`이 된다.

</details>

### 다음 레슨

JSON이 잘못되면 파싱 중 오류가 발생한다. J18에서는 오류 객체가 어떻게 이동하고 복구되는지 배운다.

---

## J18. 오류와 try...catch...finally

### 이번 레슨이 끝나면

오류가 발생하고 Call Stack을 따라 전달되는 흐름을 설명할 수 있다. `throw`, `try`, `catch`, `finally`로 예상 가능한 실패를 알리고 처리할 수 있다.

### 왜 배우나요?

숫자가 아닌 measurement를 그대로 계산하면 `NaN`이 조용히 퍼질 수 있다. 잘못된 데이터를 발견한 순간 오류로 알리고, 처리할 수 있는 상위 코드가 사용자 메시지나 기본값을 선택하게 하는 편이 안전하다.

### 오류를 만들어 알리기

```javascript
function parseMeasurement(rawValue) {
  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new TypeError("measurement must be numeric");
  }

  return value;
}
```

`throw`가 실행되면 같은 함수의 아래 `return`은 실행하지 않는다. `TypeError` 객체에는 오류 종류를 나타내는 `name`과 설명인 `message`가 있다.

### 오류를 처리하기

```javascript
try {
  const value = parseMeasurement("N/A");
  console.log(value);
} catch (error) {
  console.log(error.name, error.message);
} finally {
  console.log("conversion finished");
}
```

실행 흐름은 다음과 같다.

1. `try`에서 함수를 호출한다.
2. 함수 안에서 TypeError가 발생한다.
3. `parseMeasurement`의 남은 줄과 `try`의 남은 줄을 건너뛴다.
4. 호출 스택을 거슬러 가장 가까운 `catch`로 이동한다.
5. 오류 객체가 `error`에 연결되고 메시지를 출력한다.
6. `finally`를 실행한다.

정상값을 넣으면 `catch`는 건너뛰지만 `finally`는 여전히 실행된다.

### 먼저 예상해 보기

입력 `"94.2"`와 `"N/A"`에서 실행되는 블록, 출력 순서, 함수 반환 여부를 각각 적는다.

### 오류를 숨기지 않기

```javascript
try {
  riskyWork();
} catch (error) {
  // 아무것도 하지 않음
}
```

이 코드는 원인과 실패 사실을 잃어버린다. 복구 방법이 없다면 의미 있는 정보를 붙여 다시 `throw error`하거나 상위 코드가 처리하게 둔다. 처리 가능한 오류와 프로그래밍 버그를 구분한다.

### 자주 하는 실수

- `throw "message"`처럼 문자열만 던져 표준 Error 정보와 스택을 잃는다.
- catch가 실패한 줄로 돌아가 다시 실행한다고 생각한다.
- try 범위를 지나치게 넓게 잡아 어느 작업이 실패했는지 모르게 한다.
- 오류를 모두 잡고 성공 결과처럼 반환한다.

### 직접 해보기

필수 `id`가 없으면 TypeError, measurement가 허용 범위 밖이면 RangeError를 던지는 검증 함수를 만든다. catch에서는 오류 종류와 메시지를 출력하되 예상하지 않은 오류는 다시 던진다.

### 확인 문제

1. `throw` 다음 줄은 같은 정상 흐름에서 실행되는가?
2. 정상과 오류 양쪽에서 실행되는 블록은 무엇인가?
3. catch가 없는 함수에서 생긴 오류는 어디로 이동하는가?

<details><summary>정답과 해설</summary>

1. 실행되지 않는다.
2. `finally`다.
3. 호출한 함수 쪽으로 Call Stack을 거슬러 처리할 catch를 찾는다. 끝까지 없으면 프로그램이 오류로 종료된다.
4. 정상 입력은 숫자와 완료 메시지를, 잘못된 입력은 오류 이름·메시지와 완료 메시지를 출력한다.

</details>

### 다음 레슨

검증과 파싱 함수가 많아지면 파일별 책임을 나눠야 한다. J19에서 Module을 배운다.

---

## J19. Module

### 이번 레슨이 끝나면

`export`와 `import`로 파일 사이에서 이름을 공유할 수 있다. named export와 default export의 기본 차이와 모듈 의존 방향을 설명할 수 있다.

### 왜 배우나요?

파일 하나에 로딩, 파싱, 검증, 화면 출력이 모두 섞이면 수정 범위를 찾기 어렵다. 모듈은 파일마다 책임을 나누고 외부에 공개할 이름을 명시한다.

### Named export

`validators.js`:

```javascript
export const LOWER = 90;
export const UPPER = 100;

export function isValid(value) {
  return value >= LOWER && value <= UPPER;
}
```

`main.js`:

```javascript
import { isValid, UPPER } from "./validators.js";

console.log(isValid(94.2));
console.log(UPPER);
```

중괄호 안 이름은 export한 이름과 일치해야 한다. 다른 로컬 이름을 쓰려면 `import { isValid as checkValue } ...`처럼 명시한다.

### Default export

```javascript
// summarize.js
export default function summarize(values) {
  return { count: values.length };
}

// main.js
import summarize from "./summarize.js";
```

모듈 하나에는 default export가 하나만 있다. 가져올 때 중괄호를 쓰지 않으며 로컬 이름을 선택할 수 있다. 팀 규칙에 따라 named export를 일관되게 쓰기도 한다.

### 모듈이 실행되는 순서

`main.js`가 의존 모듈을 import하면 먼저 의존 모듈의 최상위 코드를 평가한다. 같은 모듈은 한 번 평가한 뒤 재사용한다. import한 이름은 단순한 복사본이 아니라 export 쪽 값과 연결된 binding이라는 점도 알아둔다.

### 먼저 예상해 보기

다음 중 named export `isValid`를 올바르게 가져오는 문장을 고른다.

```javascript
import isValid from "./validators.js";
import { isValid } from "./validators.js";
```

### 자주 하는 실수

- named import의 중괄호를 빠뜨린다.
- 상대 파일인데 `./`를 빼거나 잘못된 경로·대소문자를 쓴다.
- 두 파일이 서로 import하는 순환 의존성을 만든다.
- export하지 않은 내부 함수를 다른 파일에서 직접 사용하려 한다.

### 직접 해보기

검증 함수는 `validators.js`, 합계 함수는 `summaries.js`로 나눈다. `main.js`가 두 파일을 한 방향으로만 의존하도록 그래프를 그리고 import 문을 완성한다.

### 확인 문제

1. named import에서 이름 주위에 무엇을 쓰는가?
2. default export는 한 모듈에 여러 개 둘 수 있는가?
3. 모듈을 나누는 주된 목적은 무엇인가?

<details><summary>정답과 해설</summary>

1. 중괄호 `{}`를 쓴다.
2. 하나만 둘 수 있다.
3. 파일별 책임을 분리하고 필요한 기능을 명시적으로 재사용하기 위해서다.
4. 예상 문제는 두 번째 named import가 맞다.

</details>

### 다음 레슨

파일 단위의 책임을 나눴다. J20에서는 관련 데이터와 동작을 객체 단위로 묶는 Class를 배운다.

---

## J20. Class와 객체 메서드

### 이번 레슨이 끝나면

`new`로 Class 인스턴스를 만들고 constructor, 속성, 메서드를 사용할 수 있다. 메서드 호출 형태가 `this`를 정한다는 기본 원리를 설명할 수 있다.

### Class 정의와 인스턴스 생성

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

const first = new Wafer("W01", 94.2);
```

`Wafer`는 구조와 메서드의 설계다. `new Wafer(...)`를 실행할 때 실제 객체인 인스턴스가 생긴다.

### new가 하는 일

입문 수준에서는 다음 네 단계로 이해한다.

1. 빈 객체를 만든다.
2. 그 객체를 Class의 메서드와 연결한다.
3. 새 객체를 `this`로 두고 constructor를 호출한다.
4. 완성된 객체를 반환한다.

Class는 일반 함수처럼 `Wafer(...)`만 호출할 수 없고 `new`가 필요하다.

### 메서드와 this

```javascript
first.isInRange(90, 100);
```

점 왼쪽의 `first`가 메서드 안의 `this`가 된다. Python의 `self`처럼 현재 객체를 가리키지만, JavaScript의 `this`는 함수를 **어떻게 호출했는지**에 따라 달라질 수 있다.

```javascript
const check = first.isInRange;
check(90, 100); // 객체 없이 호출해 this 연결이 사라짐
```

메서드를 떼어 내 호출하면 원래 객체 정보가 자동 보존되지 않는다. 필요하면 wrapper 함수나 `bind`를 사용한다.

### 먼저 예상해 보기

두 인스턴스 `first(94.2)`, `second(101.3)`를 만든 뒤 `second.measurement = 99.0`으로 바꾸면 각 판정 결과가 무엇인지 적는다.

### 자주 하는 실수

- Class를 `new` 없이 호출한다.
- `this`가 언제나 Class 자체를 가리킨다고 생각한다.
- 메서드를 다른 변수에 저장해도 호출 대상이 자동으로 유지된다고 생각한다.
- 모든 Object를 Class로 만든다. 데이터 묶음만 필요하면 단순 Object가 더 적절할 수 있다.

### 직접 해보기

`Equipment` Class에 `id`, `status`, `start()` 메서드를 만든다. 인스턴스 두 개 중 하나만 시작하고 각 상태를 확인한다. 그다음 `start` 메서드를 변수에 떼어 호출했을 때 문제를 관찰한다.

### 확인 문제

1. Class 인스턴스를 만들 때 사용하는 키워드는 무엇인가?
2. `object.method()`에서 일반적으로 `this`는 무엇인가?
3. 메서드를 변수에 떼어 호출하면 원래 객체가 자동 보존되는가?

<details><summary>정답과 해설</summary>

1. `new`다.
2. 점 왼쪽의 `object`다.
3. 보존되지 않는다. 호출 형태가 바뀌어 `this`도 달라질 수 있다.
4. 예상 문제는 둘 다 `true`다. 두 인스턴스는 독립적이고 second만 99.0으로 바뀐다.

</details>

### 다음 레슨

지금까지 값은 즉시 얻었다. J21에서는 나중에 완료되거나 실패할 작업을 표현하는 Promise를 배운다.

---

## J21. Promise

### 이번 레슨이 끝나면

Promise의 세 상태를 구분하고 `.then()`, `.catch()`, `.finally()` 체인에서 값과 오류가 이동하는 경로를 설명할 수 있다.

### 왜 배우나요?

파일이나 네트워크에서 데이터를 가져오는 작업은 시간이 걸린다. JavaScript는 기다리는 동안 프로그램 전체를 멈추지 않는다. Promise는 “결과가 지금은 없지만 나중에 성공값이나 실패 이유가 도착한다”는 약속 객체다.

### 세 상태

| 상태 | 의미 | 다음 변화 |
|---|---|---|
| `pending` | 아직 진행 중 | fulfilled 또는 rejected로 한 번 변함 |
| `fulfilled` | 성공값 도착 | 완료 상태 |
| `rejected` | 실패 이유 도착 | 완료 상태 |

한 번 완료된 Promise는 다른 상태로 다시 바뀌지 않는다.

### Promise 체인

```javascript
loadMeasurements()
  .then((values) => values.filter((value) => value <= 100))
  .then((passed) => console.log(passed))
  .catch((error) => console.log(error.message))
  .finally(() => console.log("finished"));
```

첫 `then`은 성공값 Array를 받아 필터 결과를 반환한다. 그 반환값이 다음 `then`으로 전달된다. 각 `then`은 원래 Promise를 바꾸는 것이 아니라 **새 Promise를 반환**한다.

어느 단계에서 오류가 발생하거나 rejected Promise를 반환하면 정상값 경로를 건너뛰어 다음 `catch`로 간다. `finally`는 성공과 실패 모두에서 실행되며 일반적으로 앞의 결과를 바꾸는 용도로 쓰지 않는다.

### 비동기 실행 순서

```javascript
console.log("A");
Promise.resolve().then(() => console.log("B"));
console.log("C");
```

출력은 `A`, `C`, `B`다. `then` 콜백은 현재 동기 코드가 끝난 뒤 실행된다. Promise가 이미 fulfilled여도 콜백이 현재 줄 사이에 즉시 끼어들지는 않는다.

### 먼저 예상해 보기

다음 체인에서 두 번째 `then`이 받는 값은 무엇인가?

```javascript
Promise.resolve([1, 2, 3])
  .then((values) => { values.length; })
  .then((count) => console.log(count));
```

### 자주 하는 실수

- Promise 자체를 완료된 Array처럼 사용한다.
- `then` 콜백에서 `return`을 빠뜨려 다음 단계에 `undefined`를 보낸다.
- 체인 중간 Promise를 반환하지 않아 바깥 체인이 작업 완료를 기다리지 못하게 한다.
- catch에서 오류를 처리한 뒤 무엇을 반환하는지 생각하지 않는다.

### 직접 해보기

성공, 실패, 1초 지연을 선택할 수 있는 가상 로더로 체인의 각 Promise 상태와 콜백 입력을 표에 기록한다. 첫 then에서 필터 결과를 일부러 반환하지 않았을 때 다음 단계도 비교한다.

### 확인 문제

1. Promise의 성공 상태 이름은 무엇인가?
2. `then()`은 원래 Promise를 수정하는가?
3. 동기 코드와 이미 완료된 Promise의 then 콜백 중 무엇이 먼저 끝나는가?

<details><summary>정답과 해설</summary>

1. fulfilled다.
2. 수정하지 않고 새 Promise를 반환한다.
3. 현재 동기 코드가 먼저 끝난다.
4. 예상 문제는 첫 then이 반환하지 않았으므로 `undefined`다.

</details>

### 다음 레슨

Promise 체인의 흐름을 이해했다. J22에서는 같은 대기를 위에서 아래로 읽기 쉬운 `async/await` 문법으로 표현한다.

---

## J22. async / await

### 이번 레슨이 끝나면

`async` 함수의 실제 반환값이 Promise임을 설명하고, `await`에서 함수가 정지·재개되는 흐름과 비동기 오류 처리를 추적할 수 있다.

### async 함수는 Promise를 반환한다

```javascript
async function answer() {
  return 42;
}

const result = answer();
```

코드에는 `return 42`라고 쓰였지만 `result`는 숫자 42가 아니라 42로 fulfilled되는 Promise다. 실제 값이 필요하면 `await answer()` 또는 `.then()`을 사용한다.

### await의 동작

```javascript
async function buildSummary() {
  const values = await loadMeasurements();
  return { count: values.length };
}
```

1. `loadMeasurements()`가 Promise를 반환한다.
2. `await`에서 `buildSummary` 함수의 진행만 잠시 멈춘다.
3. JavaScript는 다른 동기 코드와 준비된 작업을 계속 실행한다.
4. Promise가 fulfilled되면 성공값이 `values`에 들어가고 다음 줄부터 재개한다.
5. 함수의 return 값은 Promise의 성공값이 된다.

`await`가 프로그램 전체를 멈추는 것이 아니다.

### 오류 처리

```javascript
async function safeLoad() {
  try {
    const values = await loadMeasurements();
    return { values, error: null };
  } catch (error) {
    return { values: [], error: error.message };
  }
}
```

기다린 Promise가 rejected되면 await 지점에서 오류를 던진 것처럼 `catch`로 이동한다.

### 순차 대기와 동시 대기

```javascript
const first = await loadFirst();
const second = await loadSecond();
```

두 작업이 서로 독립인데 이렇게 쓰면 첫 작업이 끝난 뒤 두 번째를 시작할 수 있다.

```javascript
const [first, second] = await Promise.all([
  loadFirst(),
  loadSecond(),
]);
```

두 작업을 먼저 시작하고 모두 완료되기를 기다린다. 서로 의존하는 작업은 순차 실행이 맞고, 독립 작업만 함께 시작한다.

### 먼저 예상해 보기

```javascript
console.log("start");
buildSummary().then(() => console.log("done"));
console.log("outside");
```

로더가 비동기라면 세 출력의 기본 순서를 적는다.

### 자주 하는 실수

- `await` 없이 Promise의 `.length`나 속성을 읽는다.
- async 함수 호출 결과를 일반 Object로 생각한다.
- 독립된 작업을 무조건 하나씩 await해 대기 시간을 늘린다.
- catch에서 성공 결과와 전혀 다른 형태를 반환해 호출 코드가 매번 분기하게 만든다.

### 직접 해보기

Equipment 두 개의 가상 데이터를 ① 순차로, ② `Promise.all`로 불러온다. 시작·완료 시점을 타임라인으로 기록하고 둘 중 하나가 실패할 때의 전체 결과도 확인한다.

### 확인 문제

1. async 함수는 언제나 무엇을 반환하는가?
2. await는 프로그램 전체와 현재 async 함수 중 무엇을 멈추는가?
3. 서로 독립된 두 Promise를 함께 기다리는 도구는 무엇인가?

<details><summary>정답과 해설</summary>

1. Promise를 반환한다.
2. 현재 async 함수의 진행만 일시 정지한다.
3. `Promise.all()`을 사용할 수 있다.
4. 예상 순서는 `start`, `outside`, `done`이다.

</details>

### 다음 레슨

J23에서는 비동기 로딩, JSON 파싱, 데이터 변환, 필터, 집계, 오류 처리를 하나의 프로그램으로 결합한다.

---

## J23. 비동기 Measurement 요약기

### 이번 레슨이 끝나면

비동기로 받은 JSON을 단계별로 변환해 일관된 요약 Object를 만들 수 있다. 성공·로딩 실패·파싱 실패·빈 입력에서 데이터 형태와 실행 경로를 설명할 수 있다.

### 문제 정의

가상 로더는 다음 JSON 문자열을 나중에 반환한다.

```json
[
  { "wafer": "W01", "measurement": "94.2" },
  { "wafer": "W02", "measurement": "N/A" },
  { "wafer": "W03", "measurement": 101.3 }
]
```

목표는 유효 숫자 개수, PASS 개수, 평균을 구하는 것이다. 로딩 또는 JSON 파싱이 실패해도 호출자는 같은 키를 가진 결과 Object를 받아야 한다.

### 데이터 형태를 먼저 추적하기

```text
Promise
  ↓ await
JSON String
  ↓ JSON.parse
Array<Object>
  ↓ map(Number)
Array<Number | NaN>
  ↓ filter(Number.isFinite)
Array<Number>
  ↓ filter + reduce
Summary Object
```

각 함수가 어떤 형태를 받고 무엇을 반환하는지 알면 긴 메서드 체인도 길을 잃지 않는다.

### 동기 요약 함수

```javascript
function summarize(rows, lower = 90, upper = 100) {
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
    error: null,
  };
}
```

### 레코드별 추적

| Wafer | 원본 | Number 결과 | 유효 | PASS | 평균에 포함 |
|---|---|---:|---|---|---|
| W01 | `"94.2"` | 94.2 | 예 | 예 | 예 |
| W02 | `"N/A"` | `NaN` | 아니오 | 아니오 | 아니오 |
| W03 | `101.3` | 101.3 | 예 | 아니오 | 예 |

따라서 `validCount=2`, `passCount=1`, `average=97.75`다.

### 비동기 경계와 오류 결과

```javascript
async function loadAndSummarize() {
  try {
    const jsonText = await loadVirtualData();
    const rows = JSON.parse(jsonText);
    return summarize(rows);
  } catch (error) {
    return {
      validCount: 0,
      passCount: 0,
      average: null,
      error: error.message,
    };
  }
}
```

성공과 실패 모두 같은 네 키를 반환한다. 호출자는 먼저 결과가 도착하도록 await한 뒤 `result.error`만 확인하면 된다.

### 빈 입력

빈 Array에서는 reduce 초기값 0 덕분에 합계가 0이다. 그러나 평균의 분모가 0이므로 `values.length > 0`을 검사해 `null`을 반환한다.

### 먼저 예상해 보기

경계값 90.0, 100.0, `null`이 들어 있는 세 행을 요약했을 때 Number 변환 결과와 최종 요약을 적는다. `Number(null)`이 0이라는 JavaScript 특성이 요구사항에 맞는지도 판단한다.

### 중요한 데이터 검증 보완

단순히 `Number(row.measurement)`만 사용하면 빈 문자열과 `null`도 0이 되어 유효 숫자로 통과할 수 있다. 요구사항이 “누락값 제외”라면 변환 전에 명시적으로 검사한다.

```javascript
function toMeasurement(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return null;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
```

이 함수를 map에 사용한 뒤 `value !== null`로 필터하면 데이터 의미가 더 정확하다.

### 자주 하는 실수

- Promise를 await하기 전에 JSON 문자열이나 Object처럼 사용한다.
- JSON 문자열에 바로 `.map()`을 호출한다.
- `Number(null)`과 `Number("")`가 0이라는 점을 놓쳐 누락값을 유효값으로 센다.
- PASS 값만 평균에 넣거나 원본 행 수를 유효 개수로 사용한다.
- 실패 결과의 Object 형태를 성공 결과와 다르게 만들어 사용 코드를 복잡하게 한다.

### 직접 해보기

1. `toMeasurement`를 요약 함수에 연결한다.
2. 결과에 `invalidCount`와 `reviewWaferIds`를 추가한다.
3. 정상 응답, 빈 Array, 모두 잘못된 값, 잘못된 JSON, 로더 실패를 시험한다.
4. 모든 경우 결과 Object의 키가 같은지 확인한다.

### 확인 문제

1. await 직후 `jsonText`의 타입은 무엇인가?
2. `JSON.parse` 직후 데이터 형태는 무엇인가?
3. `Number(null)`이 0인데 누락값을 제외하려면 어느 시점에 무엇을 검사해야 하는가?
4. 로딩 실패와 JSON 파싱 실패는 어느 블록에서 처리되는가?

<details><summary>정답과 해설</summary>

1. String이다.
2. 이 예에서는 `Array<Object>`다.
3. Number 변환 전에 `raw === null || raw === undefined || raw === ""`를 검사한다.
4. 둘 다 `try` 안에서 발생하므로 같은 `catch`에서 처리할 수 있다. 필요하면 오류 종류를 기록해 원인을 구분한다.
5. 경계값 90과 100은 PASS지만 `null`은 명시적 검사로 제외해야 한다. 최종 결과는 `validCount=2`, `passCount=2`, `average=95`, `error=null`이다.

</details>

### 과정 마무리

최종 프로그램에는 선언과 타입, 함수, Scope, Array·Object, map·filter·reduce, JSON, 오류, Promise, async/await가 모두 들어 있다. 코드를 외우기보다 각 줄 앞뒤에서 데이터의 형태가 무엇인지 말할 수 있다면 JavaScript 과정의 목표를 달성한 것이다.
