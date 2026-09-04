# JavaScript 기초·흐름 제어 원고 — J01~J08

## J01. 출력과 주석

### 이번 레슨이 끝나면

`console.log()`로 값을 확인하고 한 줄·여러 줄 주석을 구분할 수 있다. 출력하는 일과 함수가 값을 반환하는 일이 다르다는 것도 설명할 수 있다.

### 왜 배우나요?

JavaScript의 변수와 계산 결과는 자동으로 화면에 보이지 않는다. 개발 중 값을 확인하려면 **콘솔**에 출력한다. 콘솔은 프로그램의 상태를 살펴보는 기록 창이라고 생각하면 된다.

### 가장 작은 예제

```javascript
const lotId = "LOT-A01";
console.log("Lot:", lotId);
```

- `console`은 콘솔 기능을 모아 둔 객체다.
- 점 `.`은 그 객체의 기능 중 `log`를 선택한다.
- 괄호 안에는 출력할 값을 쉼표로 나열한다.
- 실제 출력에서는 따옴표와 쉼표가 사라지고 값 사이에 공백이 들어간다.

```text
Lot: LOT-A01
```

세미콜론은 문장의 끝을 명시한다. JavaScript가 많은 경우 자동으로 보완하지만, 이 과정에서는 일관되게 사용한다. 세미콜론 자체보다 값과 실행 순서를 이해하는 것이 더 중요하다.

### 주석

```javascript
// 이 줄의 나머지는 한 줄 주석이다.

/* 여러 줄에 걸친
   설명을 적을 수 있다. */
```

주석은 사람이 읽는 메모이며 실행되지 않는다.

### 먼저 예상해 보기

```javascript
const waferId = "W01";
const value = 94.2;
console.log(waferId, value, "nm");
```

출력이 `W01 94.2 nm`인지, 변수 이름과 따옴표까지 보이는지 먼저 예상한다.

### 자주 하는 실수

```javascript
console.log(W01);     // ReferenceError: W01이라는 이름이 없음
console.log("W01");   // 문자열 W01 출력
```

또 `const result = console.log("완료")`에서 `result`는 출력 문자열이 아니라 `undefined`다. `console.log()`는 확인용으로 보여 줄 뿐 계산에 사용할 값을 반환하지 않는다.

### 직접 해보기

Equipment ID, 상태, measurement를 ① 여러 인수, ② 하나의 Template Literal 두 방식으로 출력한다.

### 확인 문제

1. `console.log("A", 1)`의 출력에 따옴표와 쉼표가 보이는가?
2. `//` 뒤의 코드는 실행되는가?
3. `console.log(EQ-01)`을 고쳐 보자.

<details><summary>정답과 해설</summary>

1. 보이지 않고 보통 `A 1`로 나타난다.
2. 줄 끝까지 주석이라 실행되지 않는다.
3. 글자 자체라면 `console.log("EQ-01")`로 쓴다.

</details>

### Python 연결

Python의 `print()`와 목적은 비슷하다. JavaScript에서는 `console` 객체의 `log` 메서드를 호출한다는 표현 차이가 있다.

---

## J02. let, const, 기본 타입

### 이번 레슨이 끝나면

재할당 여부에 따라 `const`와 `let`을 선택하고 Number, String, Boolean, `null`, `undefined`를 구분할 수 있다.

### 왜 배우나요?

장비 ID처럼 한 번 정하면 바꾸지 않을 이름과 처리 횟수처럼 계속 변하는 이름은 의도가 다르다. JavaScript는 선언할 때 `const`와 `let`으로 그 차이를 코드에 표시한다.

### 선언과 재할당

```javascript
const equipment = "EQ-01";
let waferCount = 25;

waferCount = 24;        // 가능
equipment = "EQ-02";   // TypeError
```

`const`는 이름을 다른 값에 다시 연결하지 않겠다는 뜻이고, `let`은 나중에 재할당할 수 있다는 뜻이다. 기본적으로 `const`를 사용하고 실제로 재할당해야 할 때 `let`을 사용한다.

### 기본 타입

| 값 | `typeof` 결과 | 설명 |
|---|---|---|
| `25`, `23.5` | `"number"` | 정수와 실수를 모두 Number로 표현 |
| `"EQ-01"` | `"string"` | 문자열 |
| `true` | `"boolean"` | 참·거짓 |
| `undefined` | `"undefined"` | 값이 할당되지 않음 |
| `null` | `"object"` | 의도적으로 값이 없음을 표시. `typeof` 결과는 오래된 언어 특성이다. |

```javascript
let operatorNote;           // undefined
let lastMeasurement = null; // 아직 측정값이 없다고 의도적으로 표시
```

### const 객체는 내부가 얼어붙지 않는다

```javascript
const wafers = [];
wafers.push("W01"); // 가능: 같은 Array 내부 변경
wafers = [];         // 불가능: 이름을 새 Array에 재할당
```

`const`가 고정하는 것은 변수와 객체의 연결이다. 객체 내부 변경까지 막으려면 별도 방법이 필요하다.

### 먼저 예상해 보기

`let count = 1; count = count + 1;` 뒤의 값과 `const values = []; values.push(3);`의 가능 여부를 적는다.

### 자주 하는 실수

- `"true"`는 Boolean이 아니라 문자열이며 조건에서 truthy로 취급된다.
- `null`과 `undefined`는 둘 다 값 부재를 나타낼 수 있지만 의미와 발생 방식이 다르다.
- Python처럼 `True`, `False`, `None`이라고 쓰지 않는다. JavaScript는 소문자 `true`, `false`, `null`이다.

### 직접 해보기

고정된 Lot ID, 변하는 처리 개수, 아직 없는 오류 메시지를 선언한다. 왜 각각 `const` 또는 `let`, `null`을 골랐는지 한 문장으로 설명한다.

### 확인 문제

1. JavaScript에서 정수와 실수의 기본 타입 이름은 같은가?
2. `const` Array에 `push()`할 수 있는가?
3. 값을 나중에 재할당해야 하는 변수는 `let`과 `const` 중 무엇을 쓰는가?

<details><summary>정답과 해설</summary>

1. 둘 다 Number다.
2. 가능하다. Array 자체에 대한 연결은 그대로이고 내부가 바뀐다.
3. `let`을 쓴다.

</details>

---

## J03. 연산자, 타입 변환, 엄격한 동등성

### 이번 레슨이 끝나면

입력값을 명시적으로 Number로 변환하고 `===`로 타입과 값이 모두 같은지 비교할 수 있다. `NaN`을 안전하게 검사할 수 있다.

### 왜 배우나요?

CSV나 입력 상자에서 받은 `"94.2"`는 숫자처럼 보여도 문자열이다. JavaScript는 일부 연산에서 타입을 자동으로 바꾸기 때문에 실행은 되지만 의도와 다른 결과가 나올 수 있다.

### +는 덧셈일 수도 연결일 수도 있다

```javascript
console.log(1 + 2);       // 3
console.log("1" + 2);     // "12"
console.log(Number("1") + 2); // 3
```

피연산자 중 문자열이 있으면 `+`는 문자열 연결로 동작할 수 있다. 계산 전에 `Number()`로 명시적으로 변환하면 의도가 분명하다.

### ==와 ===

```javascript
console.log("1" == 1);   // true: 비교 전에 타입 변환
console.log("1" === 1);  // false: 타입과 값 모두 비교
```

입문 과정에서는 예상하기 쉬운 `===`와 `!==`를 기본으로 사용한다. 다른 타입을 비교해야 한다면 한쪽을 먼저 명시적으로 변환한다.

### NaN 검사

```javascript
const measurement = Number("N/A"); // NaN
console.log(measurement === NaN);    // false
console.log(Number.isFinite(measurement)); // false
```

`NaN`은 “유효한 숫자 결과가 아님”을 나타내는 Number 값이며 자기 자신과도 같지 않다. 정상적인 유한 숫자인지 확인할 때 `Number.isFinite()`를 사용한다.

### 먼저 예상해 보기

`"2" + 3`, `Number("2") + 3`, `"2" === 2`, `"2" == 2`의 결과와 타입을 적는다.

### 자주 하는 실수

- `parseInt("94.2")`로 소수를 읽어 94만 남긴다. 소수까지 필요하면 `Number()` 또는 `parseFloat()`를 검토한다.
- `value !== NaN`으로 숫자 유효성을 판단한다. 이 비교는 의도대로 동작하지 않는다.
- `==`의 변환 규칙에 기대어 빈 문자열·0·false를 비교한다.

### 직접 해보기

`["94.2", "N/A", "", "0"]`을 하나씩 Number로 바꾸고 `Number.isFinite()` 결과를 기록한다. 빈 문자열이 0으로 변환되는 점이 요구사항에 맞는지도 별도로 판단한다.

### 확인 문제

1. `"10" + 5`의 결과는 무엇인가?
2. 타입 변환 없이 값과 타입을 함께 비교하는 연산자는 무엇인가?
3. `NaN`이 아닌 유한 숫자인지 검사하는 방법은 무엇인가?

<details><summary>정답과 해설</summary>

1. 문자열 `"105"`다.
2. `===`다.
3. `Number.isFinite(value)`를 사용한다.

</details>

---

## J04. 문자열과 Template Literal

### 이번 레슨이 끝나면

문자열의 일부를 `slice()`로 꺼내고 Template Literal에 값과 표현식을 넣을 수 있다. `toFixed()`가 문자열을 반환한다는 점도 설명할 수 있다.

### 문자열의 위치

```javascript
const waferId = "WAFER-07";
const first = waferId[0];       // "W"
const prefix = waferId.slice(0, 5); // "WAFER"
const number = waferId.slice(-2);   // "07"
```

인덱스는 0부터 시작한다. `slice(시작, 끝)`은 시작을 포함하고 끝은 제외한다. 음수 시작값은 문자열 끝에서부터 센다. 문자열 메서드는 원본을 바꾸지 않고 새 문자열을 반환한다.

### Template Literal

```javascript
const measurement = 94.234;
const message = `${waferId}: measurement=${measurement.toFixed(1)}`;
```

backtick `` ` ``으로 문자열을 감싸고 `${}` 안에 변수나 식을 넣는다. 결과는 `WAFER-07: measurement=94.2`다. 일반 따옴표 안에서는 `${}`가 계산되지 않는다.

`toFixed(1)`은 소수점 한 자리 문자열 `"94.2"`를 반환한다. 화면 표시에는 편리하지만 이후 숫자 계산이 필요하면 다시 Number로 변환해야 한다.

### 먼저 예상해 보기

`"ABCDE".slice(1, 4)`, `"ABCDE".slice(-2)`, `(9.5).toFixed(2)`의 값과 마지막 결과의 타입을 적는다.

### 자주 하는 실수

```javascript
const message = "value=${value}";  // 그대로 value=${value}
const message = `value=${value}`;  // 실제 값 삽입
```

또 `text.toUpperCase()`만 호출하고 `text`가 바뀌었다고 기대하면 안 된다. `text = text.toUpperCase()`처럼 반환값을 저장한다.

### 직접 해보기

`"  eq-01  "`을 `trim()`, `toUpperCase()`, `replace()`로 `"EQ_01"`로 바꾸고 measurement를 소수점 두 자리로 넣은 보고 문장을 만든다.

### 확인 문제

1. `slice(0, 3)`은 인덱스 3의 글자를 포함하는가?
2. `${}`가 동작하려면 어떤 따옴표를 사용하는가?
3. `toFixed()`의 반환 타입은 무엇인가?

<details><summary>정답과 해설</summary>

1. 포함하지 않는다.
2. backtick을 사용한다.
3. String이다.
4. 예상 결과는 `"BCD"`, `"DE"`, `"9.50"`과 String이다.

</details>

---

## J05. Array

### 이번 레슨이 끝나면

Array 원소를 읽고 수정하며 `push`, `pop`, `slice`, `splice`의 원본 변경 여부와 반환값을 구분할 수 있다.

### 기본 구조

```javascript
const wafers = ["W01", "W02", "W03"];
wafers.push("W04");
wafers[1] = "W02-R";
```

Array는 여러 값을 순서대로 보관하고 인덱스는 0부터 시작한다. 위 코드 뒤 `wafers`는 `["W01", "W02-R", "W03", "W04"]`다. `const`는 변수 재할당을 막지만 같은 Array의 원소 변경은 허용한다.

### 메서드 비교

| 코드 | 원본 변경 | 반환값 |
|---|---|---|
| `push(value)` | 예 | 새 길이 |
| `pop()` | 예 | 제거한 마지막 원소 |
| `slice(start, end)` | 아니오 | 복사한 새 Array |
| `splice(start, count)` | 예 | 제거한 원소 Array |

```javascript
const original = ["A", "B", "C"];
const copied = original.slice(0, 2); // ["A", "B"], 원본 유지
const removed = original.splice(0, 2); // ["A", "B"], 원본은 ["C"]
```

### 마지막 인덱스

길이가 3이면 인덱스는 0, 1, 2다. `array[array.length]`는 범위 밖이므로 `undefined`다. 마지막 원소는 `array[array.length - 1]` 또는 `array.at(-1)`로 읽는다.

### 먼저 예상해 보기

`const values = [1, 2, 3]; const result = values.push(4);` 뒤 `values`와 `result`를 각각 적는다.

### 자주 하는 실수

- `slice`와 `splice`의 철자와 원본 변경 여부를 섞는다.
- `a === b`로 두 Array의 내용을 비교한다. `===`는 두 변수가 같은 Array 객체를 가리키는지 확인한다.
- `const`라서 원소도 바꿀 수 없다고 생각한다.

### 직접 해보기

원본 `["W01", "W02", "W03"]`에서 첫 두 원소를 복사한 결과와 제거한 결과를 각각 별도 코드로 실행한다. 실행 전후 원본을 반드시 출력한다.

### 확인 문제

1. 길이가 4인 Array의 마지막 인덱스는 무엇인가?
2. 원본을 유지하며 일부를 복사하는 메서드는 무엇인가?
3. `push()`의 반환값은 추가된 Array 자체인가?

<details><summary>정답과 해설</summary>

1. 3이다.
2. `slice()`다.
3. 아니다. 변경된 Array의 새 길이다. 예상 문제에서 `values`는 `[1,2,3,4]`, `result`는 4다.

</details>

---

## J06. Object와 참조

### 이번 레슨이 끝나면

Object 속성을 점 또는 대괄호로 읽고 추가·수정할 수 있다. 객체를 다른 변수에 할당했을 때 복사되지 않고 참조가 공유되는 이유를 설명할 수 있다.

### Object 만들기

```javascript
const wafer = {
  id: "W01",
  measurement: 94.2,
  passed: true,
};
```

Object는 `키: 값` 쌍을 모은다. `wafer.id`는 이름이 코드에 고정된 속성을 읽고, `wafer[field]`는 변수에 들어 있는 문자열을 실제 키로 사용한다.

```javascript
const field = "passed";
console.log(wafer.field);   // undefined: field라는 키를 찾음
console.log(wafer[field]);  // true: field의 값 "passed"를 키로 사용
```

### 속성 변경과 없는 속성

```javascript
wafer.measurement = 95.1; // 기존 속성 수정
wafer.retested = true;    // 새 속성 추가
console.log(wafer.operator); // undefined
```

없는 속성을 읽으면 일반적으로 오류가 아니라 `undefined`를 얻는다. 하지만 그 뒤에 메서드를 바로 호출하면 오류가 날 수 있으므로 선택 속성인지 확인해야 한다.

### 참조 공유

```javascript
const same = wafer;
same.measurement = 99.0;
console.log(wafer.measurement); // 99.0
```

Object를 할당하면 내용 전체가 복사되는 것이 아니라 같은 객체를 가리키는 참조가 전달된다.

```javascript
const copied = { ...wafer };
copied.measurement = 97.0;
```

spread로 새 1단계 Object를 만들 수 있다. 단, 안에 또 Object가 있으면 그 중첩 객체는 여전히 공유될 수 있다. 이것이 얕은 복사다.

### 먼저 예상해 보기

`const a = { value: 1 }; const b = a; b.value = 2;` 뒤 `a.value`를 적는다.

### 자주 하는 실수

- 동적 키를 점 표기법으로 읽는다.
- `const` Object는 속성도 바꿀 수 없다고 생각한다.
- `{ ...object }`가 모든 깊이의 값을 완전히 복사한다고 생각한다.

### 직접 해보기

원본 Wafer, 같은 참조, spread 복사본을 만들고 각각 measurement를 수정한다. 어떤 변수가 어느 객체를 가리키는지 화살표로 그린다.

### 확인 문제

1. 키 이름이 변수 `field`에 들어 있다면 어떤 표기법을 쓰는가?
2. 없는 속성을 읽은 기본 결과는 무엇인가?
3. `b = a` 뒤 Object 속성 변경이 함께 보이는 이유는 무엇인가?

<details><summary>정답과 해설</summary>

1. `object[field]` 대괄호 표기법을 쓴다.
2. `undefined`다.
3. 두 변수가 같은 Object를 가리키기 때문이다. 예상 문제의 `a.value`는 2다.

</details>

---

## J07. 조건문과 조건 표현식

### 이번 레슨이 끝나면

`if`, `else if`, `else`로 하나의 경로를 선택하고, JavaScript의 truthy/falsy 변환을 예측할 수 있다. 단순한 두 값 선택에는 삼항 연산자를 사용할 수 있다.

### 조건문 읽기

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
```

위에서 아래로 검사해 처음 참인 블록만 실행한다. 중괄호가 블록 범위를 결정하고 들여쓰기는 사람이 구조를 읽도록 돕는다.

### truthy와 falsy

조건 자리에 Boolean이 아닌 값이 오면 JavaScript가 참·거짓으로 변환한다.

| falsy 값 | 설명 |
|---|---|
| `false` | 거짓 Boolean |
| `0`, `-0`, `NaN` | 거짓으로 변환되는 숫자 |
| `""` | 빈 문자열 |
| `null`, `undefined` | 값 부재 |

그 밖의 대부분 값은 truthy다. 특히 `"false"`, `"0"`, `[]`, `{}`는 내용이 비슷해 보여도 truthy다.

### 삼항 연산자

```javascript
const label = status === "PASS" ? "OK" : "REVIEW";
```

`조건 ? 참일 때 값 : 거짓일 때 값`으로 읽는다. 단순히 값 두 개 중 하나를 고를 때 유용하다. 여러 작업이나 중첩 조건은 일반 조건문이 더 읽기 좋다.

### 먼저 예상해 보기

`0`, `"0"`, `"false"`, `null`, `[]`를 각각 `if (value)`에 넣었을 때 어느 블록으로 가는지 적는다.

### 자주 하는 실수

- 문자열 `"false"`를 거짓으로 기대한다. 비어 있지 않은 문자열은 truthy다.
- Python처럼 들여쓰기만 하고 중괄호 구조를 무시한다.
- 여러 조건과 계산을 중첩 삼항식에 넣어 읽을 수 없게 만든다.
- 100도 PASS인데 `< 100`을 사용해 경계값을 제외한다.

### 직접 해보기

입력값이 `null` 또는 `undefined`면 `"UNKNOWN"`, 빈 문자열이면 `"EMPTY"`, 그 밖이면 원래 값을 사용하는 조건문을 작성한다.

### 확인 문제

1. `""`은 truthy인가 falsy인가?
2. `"false"`는 truthy인가 falsy인가?
3. 삼항 연산자의 세 부분을 순서대로 말해 보자.

<details><summary>정답과 해설</summary>

1. falsy다.
2. 비어 있지 않은 문자열이라 truthy다.
3. 조건, 참일 때 값, 거짓일 때 값이다.
4. 예상 결과: `0` 거짓, `"0"` 참, `"false"` 참, `null` 거짓, `[]` 참이다.

</details>

---

## J08. for, while, for...of

### 이번 레슨이 끝나면

전통 `for`, `for...of`, `while`의 용도를 구분하고 각 문법의 실행 순서를 추적할 수 있다. `break`로 반복을 중단하고 범위를 벗어난 인덱스를 피할 수 있다.

### 세는 반복

```javascript
const wafers = ["W01", "W02", "W03"];

for (let index = 0; index < wafers.length; index += 1) {
  console.log(index, wafers[index]);
}
```

전통 `for`의 실행 순서는 다음과 같다.

1. `let index = 0`: 반복 시작 전에 한 번만 실행한다.
2. `index < wafers.length`: 매 회차 전에 검사한다.
3. 중괄호 본문을 실행한다.
4. `index += 1`: 본문 뒤에 실행한다.
5. 다시 2번 조건 검사로 간다.

길이 3인 Array에서 본문은 3회지만 조건은 마지막 실패까지 포함해 4회 검사한다.

### 값을 꺼내는 반복

```javascript
for (const waferId of wafers) {
  console.log(waferId);
}
```

인덱스가 필요 없으면 `for...of`가 의도를 더 직접 보여 준다. `waferId`에는 `"W01"`, `"W02"`, `"W03"` 원소 자체가 차례로 들어간다.

`for...in`은 배열의 값이 아니라 열거 가능한 **키**를 순회하므로 일반적인 Array 값 순회에는 `for...of`를 사용한다.

### 조건 기반 반복과 break

```javascript
let index = 0;
while (index < measurements.length) {
  if (measurements[index] > limit) {
    console.log("first over limit at", index);
    break;
  }
  index += 1;
}
```

`while`은 조건이 참인 동안 반복한다. `break`는 첫 초과값을 찾는 순간 반복 전체를 끝낸다. 초과값이 없을 때도 `index`가 계속 증가해 조건이 거짓이 되도록 해야 한다.

### 먼저 예상해 보기

Array 길이가 3일 때 전통 `for`의 초기화, 조건 검사, 본문, 증감은 각각 몇 번 실행되는가? 마지막 조건 검사 때 `index` 값도 적는다.

### 자주 하는 실수

```javascript
index <= wafers.length // index가 length와 같을 때 범위 밖
index < wafers.length  // 마지막 유효 인덱스까지만
```

또 `while`에서 상태 갱신을 빠뜨리면 조건이 계속 참인 무한 반복이 될 수 있다. `break`는 `if`만이 아니라 가장 가까운 반복문을 끝낸다.

### 직접 해보기

같은 Array를 전통 `for`와 `for...of`로 각각 순회한다. 인덱스가 필요한 요구와 값만 필요한 요구에 더 적합한 버전을 고르고 이유를 설명한다.

### 확인 문제

1. 전통 `for`의 네 부분은 어떤 순서로 반복되는가?
2. Array 값을 직접 순회할 때 `for...in`과 `for...of` 중 무엇을 쓰는가?
3. `index <= array.length`가 위험한 이유는 무엇인가?

<details><summary>정답과 해설</summary>

1. 초기화 한 번 후 `조건 → 본문 → 증감 → 조건`을 반복한다.
2. `for...of`를 쓴다.
3. `index === length`인 순간은 마지막 원소 다음이라 `array[index]`가 `undefined`다.
4. 예상 문제: 초기화 1회, 조건 4회, 본문 3회, 증감 3회이며 마지막 검사 때 index는 3이다.

</details>

### 다음 레슨

반복 중 재사용할 계산을 함수로 분리하면 코드가 더 명확해진다. J09에서 함수 선언과 반환 흐름을 배운다.
