attempt = 0
max_attempts = 3
ready_on = 2

while attempt < max_attempts:
    attempt += 1
    print(f"attempt {attempt}")
    if attempt == ready_on:
        print("READY")
        break
else:
    print("NOT READY")
