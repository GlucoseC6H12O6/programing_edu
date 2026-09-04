def parse_measurement(raw):
    if raw is None or raw == "N/A":
        return None
    try:
        return float(raw)
    except (TypeError, ValueError):
        return None
