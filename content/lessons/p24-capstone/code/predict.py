raw_measurements = [
    10.2,     # 이미 숫자
    "9.8",    # 숫자로 바꿀 수 있는 문자열
    "N/A",    # 명시적 결측
    None,     # 값 없음
    "bad",    # 변환할 수 없는 문자열
    10.7,     # 숫자지만 가상 범위 밖
    "10.0",   # 범위 안 숫자 문자열
]

import math


def parse_value(raw: object) -> float | None:
    """지원하는 입력을 유한한 float로 정규화하고, 실패하면 None을 반환한다."""
    if raw is None or isinstance(raw, bool):
        return None

    if isinstance(raw, str):
        text = raw.strip()
        if text == "" or text.upper() == "N/A":
            return None
    else:
        text = raw

    try:
        value = float(text)
    except (TypeError, ValueError):
        return None

    if not math.isfinite(value):
        return None

    return value

def classify_value(value: float, low: float, high: float) -> str:
    """유효 숫자를 학습용 범위에 따라 PASS 또는 REVIEW로 판정한다."""
    if low <= value <= high:
        return "PASS"
    return "REVIEW"

def summarize(
    raw_values: list[object],
    low: float = 9.5,
    high: float = 10.5,
) -> dict[str, object]:
    if low > high:
        raise ValueError("low must be less than or equal to high")

    valid_values: list[float] = []
    invalid_count = 0
    pass_count = 0
    review_count = 0
    review_indices: list[int] = []

    for index, raw in enumerate(raw_values):
        value = parse_value(raw)

        if value is None:
            invalid_count += 1
            continue

        valid_values.append(value)
        status = classify_value(value, low, high)

        if status == "PASS":
            pass_count += 1
        else:
            review_count += 1
            review_indices.append(index)

    valid_count = len(valid_values)

    if valid_count == 0:
        average = None
        minimum = None
        maximum = None
    else:
        average = sum(valid_values) / valid_count
        minimum = min(valid_values)
        maximum = max(valid_values)

    return {
        "valid_count": valid_count,
        "invalid_count": invalid_count,
        "pass_count": pass_count,
        "review_count": review_count,
        "average": average,
        "minimum": minimum,
        "maximum": maximum,
        "review_indices": review_indices,
    }

summary = summarize(raw_measurements)

print(f"valid_count={summary['valid_count']}")
print(f"invalid_count={summary['invalid_count']}")
print(f"pass_count={summary['pass_count']}")
print(f"review_count={summary['review_count']}")

if summary["average"] is None:
    print("average=N/A")
    print("minimum=N/A")
    print("maximum=N/A")
else:
    print(f"average={summary['average']:.2f}")
    print(f"minimum={summary['minimum']:.2f}")
    print(f"maximum={summary['maximum']:.2f}")

print(f"review_indices={summary['review_indices']}")
