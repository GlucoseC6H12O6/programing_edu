values = [10.1, "N/A", 10.8]
review_indices = []

for index, value in enumerate(values):
    if value == "N/A" or value > 10.5:
        review_indices.append(index)

print(review_indices)  # [1, 2]
