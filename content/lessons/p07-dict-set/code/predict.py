data = {"A": 1, "B": 2}
data["A"] = 3
value = data.get("C", 0)
keys = set(["A", "A", "C"])
print(data, value, len(keys))
