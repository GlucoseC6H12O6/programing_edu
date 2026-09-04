class Measurement:
    def __init__(self, wafer_id, value):
        self.wafer_id = wafer_id
        self.value = value

    def is_in_range(self, low, high):
        return low <= self.value <= high

m = Measurement("W03", 10.2)
print(m.is_in_range(9.5, 10.5))  # True
