events = []

try:
    events.append("try-start")
    number = int("x")
    events.append("try-end")
except ValueError:
    events.append("except")
else:
    events.append("else")
finally:
    events.append("finally")

print(events)
