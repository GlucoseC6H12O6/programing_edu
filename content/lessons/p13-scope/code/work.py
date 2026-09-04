def classify(value, lower_limit, upper_limit):
    if lower_limit <= value <= upper_limit:
        return "PASS"
    return "REVIEW"

status = classify(10.2, 9.5, 10.5)
