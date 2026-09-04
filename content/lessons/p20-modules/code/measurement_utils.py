# measurement_utils.py
def parse_value(raw):
    if raw is None or raw == "N/A":
        return None
    return float(raw)
