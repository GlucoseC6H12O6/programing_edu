class Device:
    def __init__(self, name):
        self.name = name
        self.count = 0

    def run(self):
        self.count += 1

a = Device("A")
b = Device("B")
a.run()
a.run()
b.run()
print(a.count, b.count)
