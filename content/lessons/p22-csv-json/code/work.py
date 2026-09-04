def clean_row(row):
    raw_value = row["value"].strip()
    value = None if raw_value in {"", "N/A"} else float(raw_value)
    return {
        "lot": row["lot"].strip(),
        "wafer": row["wafer"].strip(),
        "value": value,
    }
