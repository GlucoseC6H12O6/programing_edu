def checks():
    print("A")
    yield True
    print("B")
    yield False

result = all(checks())
print("result", result)
