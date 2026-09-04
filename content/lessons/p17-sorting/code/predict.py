items = [
    {"name": "C", "score": 2},
    {"name": "A", "score": 1},
    {"name": "B", "score": 2},
]
result = sorted(items, key=lambda x: (x["score"], x["name"]))
print([item["name"] for item in result])
