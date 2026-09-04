lots = ["L01", "L02"]
wafers = ["W01", "W02", "W03"]

for lot in lots:
    print(f"[{lot} start]")
    for wafer in wafers:
        print(f"check {lot}-{wafer}")
    print(f"[{lot} complete]")
