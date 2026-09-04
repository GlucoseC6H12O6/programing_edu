values = [10.1, 10.2, 10.8, 9.9]
needs_review = any(value < 9.5 or value > 10.5 for value in values)
print(needs_review)  # True
