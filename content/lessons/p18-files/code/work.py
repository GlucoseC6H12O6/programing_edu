values = []
with open("measurements.txt", encoding="utf-8") as file:
    for line in file:
        text = line.strip()
        if text:
            values.append(float(text))
