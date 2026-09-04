micrometers = [0.010, 0.012, -0.001]
nanometers = []

for value in micrometers:
    converted = value * 1000
    if converted >= 0:
        nanometers.append(converted)

print(nanometers)  # [10.0, 12.0]
