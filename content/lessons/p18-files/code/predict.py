with open("report.txt", "w", encoding="utf-8") as file:
    file.write("A")
    file.write("B\n")

with open("report.txt", "a", encoding="utf-8") as file:
    file.write("C\n")
