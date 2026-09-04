import json

text = '[{"id": "W01", "value": 10.2}, {"id": "W02", "value": null}]'
data = json.loads(text)
print(type(data).__name__)
print(type(data[0]).__name__)
print(data[1]["value"] is None)
