records = [
    {"wafer": "W01", "value": 10.1},
    {"wafer": "W02", "value": 10.8},
    {"wafer": "W03", "value": 9.7},
]
highest_first = sorted(records, key=lambda r: r["value"], reverse=True)
