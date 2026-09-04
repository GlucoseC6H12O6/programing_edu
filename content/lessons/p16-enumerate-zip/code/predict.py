names = ["A", "B", "C"]
values = [10, 20]

for index, (name, value) in enumerate(zip(names, values), start=1):
    print(index, name, value)
