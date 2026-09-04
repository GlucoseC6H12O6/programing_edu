n = 0
total = 0

while n < 5:
    n += 1
    if n == 2:
        continue
    if n == 4:
        break
    total += n

print(n, total)
