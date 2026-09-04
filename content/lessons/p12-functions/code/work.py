def correct_value(raw_value, offset):
    corrected = raw_value + offset
    return corrected

measurement = correct_value(10.2, 0.3)
print(measurement)  # 10.5
