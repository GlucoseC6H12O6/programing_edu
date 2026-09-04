values = [9.8, 10.2, 10.7, 9.4]
out_count = 0

for value in values:
    if value < 9.5 or value > 10.5:
        out_count += 1

print(out_count)  # 2
