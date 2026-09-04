value = 10.8

if value < 9.5 or value > 10.5:
    status = "FAIL"
elif value < 9.7 or value > 10.3:
    status = "REVIEW"
else:
    status = "PASS"

print(status)  # FAIL
