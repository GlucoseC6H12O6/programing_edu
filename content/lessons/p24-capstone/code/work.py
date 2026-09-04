records = [
    {"wafer": "W01", "value": 10.2},
    {"wafer": "W02", "value": "N/A"},
    {"wafer": "W03", "value": 10.8},
]

review_wafer_ids = []
invalid_wafer_ids = []

for record in records:
    value = parse_value(record["value"])
    if value is None:
        invalid_wafer_ids.append(record["wafer"])
        continue
    if classify_value(value, 9.5, 10.5) == "REVIEW":
        review_wafer_ids.append(record["wafer"])
