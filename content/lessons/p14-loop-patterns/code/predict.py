values = [1, 2, 3, 4]
selected = []
total = 0

for value in values:
    doubled = value * 2
    if doubled > 4:
        selected.append(doubled)
        total += doubled

print(selected, total)
