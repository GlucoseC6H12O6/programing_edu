# JavaScript 함수와 데이터 처리 원고 — J09~J16

## J09. 함수 선언, 표현식, 매개변수, 반환값

### 이번 레슨이 끝나면

함수 선언과 함수 표현식을 읽고 호출할 수 있다. 인수·매개변수·기본값·반환값의 이동을 단계별로 설명할 수 있다.

### 함수는 입력을 받아 결과를 만든다

```javascript
function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

const passed = isInRange(94.2);
```

`function` 뒤에는 함수 이름, 괄호 안에는 입력 자리인 매개변수, 중괄호 안에는 본문이 온다. `isInRange(94.2)`를 호출하면 새 작업 공간이 생기고 `value=94.2`, `lower=90.0`, `upper=100.0`이 된다.

`return`은 계산 결과를 호출한 자리로 돌려준다. 따라서 호출 표현식 전체가 `true`로 바뀌고 `passed`에 저장된다.

### 함수 참조와 호출

```javascript
const checker = isInRange;      // 함수 자체를 저장
const result = isInRange(94.2); // 함수를 호출하고 결과 저장
```

괄호가 없으면 함수 자체이고, 괄호가 있으면 함수를 실행한 결과다. 콜백으로 함수를 전달할 때 이 차이가 중요하다.

### 함수 표현식

```javascript
const average = function (values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};
```

함수를 값으로 만들어 변수에 저장할 수도 있다. 함수 선언은 선언문보다 앞에서 호출할 수 있는 특성이 있지만, `const`에 저장한 함수 표현식은 해당 줄이 실행된 뒤에만 사용할 수 있다. 입문 단계에서는 정의한 뒤 호출해 혼동을 줄인다.

### 먼저 예상해 보기

```javascript
isInRange(94.2)
isInRange(94.2, 95.0)
isInRange(94.2, 90.0, 94.0)
```

각 호출에서 세 매개변수 값과 반환값을 적는다.

### 자주 하는 실수

- `console.log()`와 `return`을 같은 것으로 본다. 출력만 한 함수의 결과는 `undefined`다.
- 빠진 인수는 자동으로 오류가 아니라 `undefined`가 될 수 있다. 기본값이 있으면 그 값을 쓴다.
- 함수 이름만 적고 호출했다고 생각한다.
- `return` 아래 코드가 계속 실행된다고 생각한다.

### 직접 해보기

Number Array를 받아 유효값 개수를 반환하는 `countFinite(values)`를 작성한다. 함수 안에서 출력하지 말고 반환한 결과를 바깥에서 출력한다.

### 확인 문제

1. 매개변수와 인수의 차이는 무엇인가?
2. `show`와 `show()` 중 어느 것이 호출인가?
3. 반환문이 없는 함수의 결과는 무엇인가?

<details><summary>정답과 해설</summary>

1. 매개변수는 함수 선언의 입력 자리, 인수는 호출할 때 전달하는 실제 값이다.
2. `show()`가 호출이다.
3. `undefined`다.
4. 예상 결과는 `true`, `false`, `false`다.

</details>

---

## J10. Arrow Function

### 이번 레슨이 끝나면

Arrow Function의 매개변수와 반환값을 읽고 일반 함수와 서로 바꿔 쓸 수 있다. 중괄호와 Object 반환에서 자주 생기는 실수를 피할 수 있다.

### 같은 함수를 두 방식으로 쓰기

```javascript
function difference(value) {
  return value - 95.0;
}

const differenceArrow = (value) => value - 95.0;
```

한 개의 표현식만 있는 Arrow Function은 중괄호와 `return`을 생략할 수 있다. 표현식 결과가 자동으로 반환된다.

```javascript
const differenceArrow = (value) => {
  const baseline = 95.0;
  return value - baseline;
};
```

본문에 중괄호를 쓰면 여러 문장을 넣을 수 있지만 반환할 값에는 `return`을 직접 써야 한다.

### Object를 바로 반환하기

```javascript
const toLabel = (wafer) => ({
  id: wafer.id,
  label: `${wafer.id}:${wafer.measurement}`,
});
```

Object literal의 `{}`를 함수 본문 중괄호로 오해하지 않게 소괄호로 감싼다.

### 먼저 예상해 보기

```javascript
const a = (x) => x * 2;
const b = (x) => { x * 2; };
const c = (x) => { return x * 2; };
```

`a(3)`, `b(3)`, `c(3)`의 결과를 적는다.

### this에 관한 첫 원칙

Arrow Function은 자신의 `this`를 만들지 않고 바깥 Scope의 `this`를 사용한다. 그래서 객체 메서드가 호출 대상에 따라 `this`를 받아야 할 때 일반 메서드 문법을 쓰는 편이 맞다. 자세한 내용은 J20에서 다룬다.

### 자주 하는 실수

- 중괄호를 추가하면서 `return`을 빠뜨린다.
- Object를 소괄호 없이 암시적으로 반환한다.
- 모든 일반 함수를 무조건 Arrow로 바꾼다.

### 직접 해보기

숫자 제곱, PASS 여부, Wafer 표시 Object를 반환하는 일반 함수 세 개를 Arrow Function으로 바꾼다. 각각 암시적 반환과 명시적 반환 중 읽기 좋은 형태를 선택한다.

### 확인 문제

1. 표현식 하나인 Arrow Function에서 생략할 수 있는 것은 무엇인가?
2. 중괄호 본문에서 값을 반환하려면 무엇이 필요한가?
3. Object literal을 바로 반환할 때 왜 소괄호를 쓰는가?

<details><summary>정답과 해설</summary>

1. 본문 중괄호와 `return`을 함께 생략할 수 있다.
2. 명시적인 `return`이 필요하다.
3. `{}`가 함수 본문이 아니라 반환할 Object임을 구분하기 위해서다.
4. 예상 결과는 6, `undefined`, 6이다.

</details>

---

## J11. Scope, Shadowing, Closure 기초

### 이번 레슨이 끝나면

전역·함수·블록 Scope를 구분하고 같은 이름이 가려지는 과정을 설명할 수 있다. 반환된 내부 함수가 바깥 값을 기억하는 Closure도 이해할 수 있다.

### 블록 Scope

```javascript
const status = "GLOBAL";

if (true) {
  const status = "BLOCK";
  console.log(status); // BLOCK
}

console.log(status); // GLOBAL
```

`let`과 `const`는 가장 가까운 중괄호 블록 안에서만 보인다. 안쪽의 같은 이름이 바깥 이름을 잠시 가리는 것을 shadowing이라고 한다.

`var`는 블록이 아니라 함수 Scope를 가지므로 `let/const`와 다르게 움직인다. 현대 JavaScript에서는 명확한 Scope를 위해 `let/const`를 기본으로 사용한다.

### Closure

```javascript
function makeChecker(lower, upper) {
  return function check(value) {
    return value >= lower && value <= upper;
  };
}

const isNormal = makeChecker(90, 100);
console.log(isNormal(94.2));
```

`makeChecker` 호출은 끝났지만 반환된 `check` 함수가 `lower=90`, `upper=100` 환경을 계속 참조한다. 함수와 그 함수가 기억하는 바깥 환경의 묶음을 Closure라고 한다.

### 서로 다른 기억

```javascript
const normal = makeChecker(90, 100);
const strict = makeChecker(95, 98);
```

두 호출은 별도 환경을 만든다. `normal(94.2)`는 `true`, `strict(94.2)`는 `false`다.

### 먼저 예상해 보기

안쪽 블록과 바깥에서 같은 `status`를 출력한 결과, 위 두 checker가 96에 반환하는 결과를 적는다.

### 자주 하는 실수

- `let` 변수를 선언된 블록 밖에서 사용한다.
- `var`도 같은 블록 Scope라고 생각한다.
- 바깥 함수가 끝나면 Closure가 기억한 값도 무조건 사라진다고 생각한다.
- Closure가 참조하는 객체를 나중에 바꾸면 그 변화가 보일 수 있다는 점을 놓친다.

### 직접 해보기

기준값 하나를 기억해 `value > limit`을 반환하는 `makeHighChecker(limit)`를 작성한다. 서로 다른 limit 두 개로 함수를 만든 뒤 같은 값을 검사한다.

### 확인 문제

1. `let/const`의 가장 가까운 Scope는 일반적으로 무엇인가?
2. shadowing은 바깥 변수를 삭제하는가?
3. Closure가 기억하는 것은 단순히 코드인가, 코드와 필요한 바깥 환경인가?

<details><summary>정답과 해설</summary>

1. 중괄호 블록 Scope다.
2. 삭제하지 않고 안쪽에서만 가린다.
3. 함수 코드와 그 코드가 참조하는 바깥 환경이다.
4. 예상 출력은 BLOCK, GLOBAL이고 96은 normal과 strict 모두 `true`다.

</details>

---

## J12. map

### 이번 레슨이 끝나면

`map()`의 콜백 입력과 반환값을 추적하고 원본과 같은 길이의 새 Array를 만들 수 있다.

### 변환이란?

```javascript
const measurements = [94.2, 101.3, 96.0];
const deviations = measurements.map((value) => value - 95.0);
```

`map`은 원소마다 콜백을 한 번 호출하고 그 반환값을 같은 위치의 새 Array에 넣는다.

| 회차 | 입력 `value` | 콜백 계산 | 결과 셀 |
|---:|---:|---:|---:|
| 1 | 94.2 | `94.2 - 95` | -0.8에 가까운 값 |
| 2 | 101.3 | `101.3 - 95` | 6.3에 가까운 값 |
| 3 | 96.0 | `96 - 95` | 1 |

부동소수점 표현 때문에 화면에 아주 긴 근삿값이 보일 수 있다.

### 콜백의 추가 인수

```javascript
const labels = measurements.map((value, index) => `M${index}:${value}`);
```

콜백은 현재 값뿐 아니라 인덱스도 받을 수 있다. 결과 Array 길이는 입력과 같다.

### 먼저 예상해 보기

`[1, 2, 3].map((value) => value * 10)`의 콜백 호출 횟수와 결과를 적는다.

### 자주 하는 실수

```javascript
const result = values.map((value) => {
  value * 2;
});
```

중괄호 본문에 `return`이 없어 결과는 `[undefined, ...]`가 된다.

`map`은 원본을 직접 바꾸지 않는다. 또 결과 Array가 필요하지 않고 출력 같은 부수 효과만 한다면 `for...of`가 의도를 더 잘 보여 줄 수 있다.

### 직접 해보기

문자열 Array `["94.2", "101.3", "N/A"]`를 Number Array로 변환한다. `N/A`가 `NaN`이 되는 것을 확인하고 다음 레슨의 필터 대상으로 표시한다.

### 확인 문제

1. 입력 길이가 4이면 map 결과 길이는 얼마인가?
2. 결과 Array의 각 원소는 어디에서 오는가?
3. 콜백에서 `return`을 빠뜨리면 어떤 값이 들어가는가?

<details><summary>정답과 해설</summary>

1. 4다.
2. 각 입력 원소에 대한 콜백 반환값이다.
3. `undefined`가 들어간다.
4. 예상 문제는 3회 호출, 결과 `[10, 20, 30]`이다.

</details>

---

## J13. filter와 find

### 이번 레슨이 끝나면

`filter()`로 조건에 맞는 모든 원소를 선택하고 `find()`로 첫 번째 원소 하나를 찾을 수 있다. 찾지 못한 `undefined`도 처리할 수 있다.

### 같은 조건, 다른 결과

```javascript
const values = [94.2, 101.3, 96.0, 88.7];

const passed = values.filter(
  (value) => value >= 90 && value <= 100,
);
const firstHigh = values.find((value) => value > 100);
```

`filter`의 콜백은 원소를 새 값으로 바꾸지 않는다. 참이면 **원본 원소**를 결과 Array에 포함한다. 결과는 `[94.2, 96.0]`이다.

`find`는 처음 참인 원소 101.3을 반환하고 뒤의 원소는 검사하지 않는다. 하나도 찾지 못하면 `undefined`다.

### 실행 비교

| 원소 | PASS 조건 | HIGH 조건 | filter 동작 | find 동작 |
|---:|---|---|---|---|
| 94.2 | 참 | 거짓 | 포함 | 계속 |
| 101.3 | 거짓 | 참 | 제외 | 101.3 반환 후 종료 |
| 96.0 | 참 | 검사 안 함 | 포함 | 이미 종료 |
| 88.7 | 거짓 | 검사 안 함 | 제외 | 이미 종료 |

두 메서드는 별도로 실행되므로 filter는 모든 원소를 검사한다.

### 먼저 예상해 보기

조건 `value < 0`으로 `filter`와 `find`를 실행했을 때 결과 타입과 값을 각각 적는다.

### 자주 하는 실수

- `filter` 결과를 `[true, false, ...]`라고 생각한다. 실제 결과는 선택된 원본 값이다.
- `find`를 결과 Array라고 생각해 `.length`로 개수를 센다.
- 찾지 못한 `undefined`에서 바로 속성을 읽어 오류를 만든다.

### 직접 해보기

Wafer Object Array에서 첫 HIGH 레코드와 모든 PASS 레코드를 찾는다. HIGH가 없을 때 기본 메시지를 출력한다.

### 확인 문제

1. 모든 일치 항목이 필요할 때 어떤 메서드를 쓰는가?
2. 첫 일치 항목만 필요할 때 어떤 메서드를 쓰는가?
3. `find()`가 아무것도 찾지 못하면 무엇을 반환하는가?

<details><summary>정답과 해설</summary>

1. `filter()`다.
2. `find()`다.
3. `undefined`다.
4. 예상 결과는 filter의 빈 Array `[]`, find의 `undefined`다.

</details>

---

## J14. reduce

### 이번 레슨이 끝나면

누적값과 현재값의 변화를 추적해 Array를 합계나 요약 Object 하나로 줄일 수 있다. 초기값이 왜 필요한지도 설명할 수 있다.

### 합계 만들기

```javascript
const values = [94.2, 101.3, 96.0];
const total = values.reduce(
  (accumulator, value) => accumulator + value,
  0,
);
```

마지막 `0`은 accumulator의 초깃값이다.

| 회차 | 이전 accumulator | value | 반환한 새 accumulator |
|---:|---:|---:|---:|
| 1 | 0 | 94.2 | 94.2 |
| 2 | 94.2 | 101.3 | 195.5 |
| 3 | 195.5 | 96.0 | 291.5 |

콜백의 반환값이 다음 회차 accumulator가 된다. 마지막 반환값이 `reduce()` 전체 결과다.

### 초기값이 중요한 이유

초기값을 생략하면 첫 원소가 초기 accumulator가 되고 콜백은 두 번째 원소부터 시작한다. 빈 Array에서는 초기값이 없으면 오류가 발생한다. 결과 타입과 시작 상태가 분명하도록 초기값을 주는 습관이 안전하다.

### 먼저 예상해 보기

`[1, 2, 3].reduce((total, value) => total + value, 10)`의 회차별 total과 최종 결과를 적는다.

### 자주 하는 실수

```javascript
values.reduce((total, value) => {
  total + value; // return 없음
}, 0);
```

첫 회차 반환값이 `undefined`가 되어 다음 계산이 망가진다. 누적한 새 상태를 반드시 반환한다.

또 단순 반복문보다 훨씬 복잡한 하나의 reduce에 변환·필터·집계를 모두 넣으면 읽기 어려울 수 있다. 중간 결과 이름이 이해를 돕는다면 메서드를 나누거나 `for...of`를 사용한다.

### 직접 해보기

`["PASS", "FAIL", "PASS"]`를 `{ PASS: 2, FAIL: 1 }`로 집계한다. accumulator의 초기 Object와 매 회차 반환값을 적는다.

### 확인 문제

1. 다음 회차 accumulator는 어디에서 오는가?
2. 빈 Array에서도 안전하게 합계 0을 얻으려면 무엇을 제공해야 하는가?
3. 콜백에서 반환을 빠뜨리면 왜 문제가 되는가?

<details><summary>정답과 해설</summary>

1. 직전 콜백의 반환값이다.
2. 숫자 초기값 0을 제공한다.
3. 다음 회차에 넘길 누적값이 `undefined`가 되기 때문이다.
4. 예상 문제는 10→11→13→16이며 최종 16이다.

</details>

---

## J15. 구조 분해 할당

### 이번 레슨이 끝나면

Array 위치와 Object 키를 기준으로 값을 여러 변수에 나누어 담을 수 있다. Object 속성 이름 변경과 기본값도 사용할 수 있다.

### Array는 위치로 분해한다

```javascript
const limits = [90.0, 100.0];
const [lower, upper] = limits;
```

첫 원소가 `lower`, 두 번째 원소가 `upper`에 들어간다. 변수 이름이 원본과 같을 필요는 없고 위치가 중요하다.

### Object는 키로 분해한다

```javascript
const wafer = { id: "W01", measurement: 94.2 };
const {
  id: waferId,
  measurement,
  status = "UNKNOWN",
} = wafer;
```

- `id: waferId`는 원래 키 `id`의 값을 새 변수 `waferId`에 저장한다.
- `measurement`는 키와 변수명이 같다.
- `status`가 `undefined`이므로 기본값 `"UNKNOWN"`을 쓴다.

속성값이 `null`이면 “값이 있음”으로 보아 기본값을 적용하지 않는다.

### 함수 매개변수에서 사용하기

```javascript
function label({ id, measurement }) {
  return `${id}:${measurement}`;
}
```

Object 전체를 받은 뒤 함수에서 필요한 두 속성만 바로 이름으로 꺼낸다.

### 먼저 예상해 보기

`const { note = "-" } = { note: null };`과 `{}`에서 각각 `note`가 무엇인지 적는다.

### 자주 하는 실수

- Object 구조 분해가 속성 순서대로 연결된다고 생각한다. 키 이름으로 연결된다.
- `id: waferId`에서 `waferId`가 원래 키라고 반대로 읽는다.
- 기본값이 `null`, 0, 빈 문자열에도 적용된다고 생각한다. 오직 `undefined`일 때 적용된다.

### 직접 해보기

Wafer Object에서 ID는 `waferId`로 이름을 바꾸고 measurement와 기본 status를 꺼낸다. 속성 순서를 바꿔도 결과가 같은지 확인한다.

### 확인 문제

1. Array 구조 분해는 무엇을 기준으로 연결되는가?
2. Object 구조 분해는 무엇을 기준으로 연결되는가?
3. 기본값은 원본 값이 `null`일 때 적용되는가?

<details><summary>정답과 해설</summary>

1. 원소 위치다.
2. 속성 키다.
3. 적용되지 않는다. `undefined`일 때만 적용된다.
4. 예상 문제는 `null`, `"-"`다.

</details>

---

## J16. Spread와 Rest

### 이번 레슨이 끝나면

`...`를 펼치기와 모으기 두 역할로 구분하고, Array·Object를 얕게 복사·결합하거나 여러 인수를 하나의 Array로 받을 수 있다.

### Spread: 컨테이너 안의 항목 펼치기

```javascript
const first = ["W01", "W02"];
const second = ["W03"];
const all = [...first, ...second];
```

Array 안에서 `...first`는 원소를 하나씩 펼쳐 새 Array에 넣는다. `all`은 새 Array이고 원본 두 개는 그대로다.

```javascript
const original = { id: "W01", measurement: 94.2 };
const updated = { ...original, measurement: 95.1 };
```

Object 속성은 왼쪽부터 들어가며 뒤의 같은 키가 앞의 값을 덮어쓴다. 순서를 바꿔 `{ measurement: 95.1, ...original }`로 쓰면 원본의 94.2가 마지막에 덮어쓴다.

### Rest: 남은 값을 하나로 모으기

```javascript
function average(...values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}
```

함수 매개변수 자리의 `...values`는 전달된 여러 인수를 하나의 Array로 모은다. Rest 매개변수는 마지막에 하나만 둘 수 있다.

### 얕은 복사

```javascript
const source = { meta: { status: "PASS" } };
const copy = { ...source };
copy.meta.status = "REVIEW";
```

바깥 Object는 새로 만들지만 `meta`는 같은 중첩 Object를 가리킨다. 따라서 `source.meta.status`도 바뀐다. 한 단계만 복사하는 것을 얕은 복사라고 한다.

### 먼저 예상해 보기

`const result = { value: 1, ...{ value: 2 } };`의 최종 value와 위 얕은 복사 예제의 source 상태를 적는다.

### 자주 하는 실수

- 같은 `...`를 항상 같은 방향으로 읽는다. 값을 사용하는 자리에서는 펼치고, 받는 자리에서는 모은다.
- Object 병합에서 뒤 속성이 이긴다는 점을 놓친다.
- 중첩 Object도 모두 새로 복사된다고 생각한다.

### 직접 해보기

원본 Wafer를 유지하며 measurement와 status를 바꾼 새 Object를 만든다. 중첩 `details` 속성도 수정해야 한다면 어느 단계가 공유되는지 먼저 화살표로 그린다.

### 확인 문제

1. 함수 매개변수의 `...args`는 펼치는가, 모으는가?
2. `{ ...a, value: 3 }`에서 a에도 value가 있으면 어느 값이 남는가?
3. Object spread는 기본적으로 깊은 복사인가?

<details><summary>정답과 해설</summary>

1. 여러 인수를 Array 하나로 모은다.
2. 뒤에 쓴 3이 남는다.
3. 아니다. 한 단계 얕은 복사다.
4. 예상 결과는 value 2, source의 status도 REVIEW다.

</details>

### 다음 레슨

이제 데이터 변환 도구를 갖췄다. J17에서는 외부에서 받은 JSON 텍스트를 Object와 Array로 바꾼다.
