# adds amenity to all features of a given .geojson file

# e.g. python3 addAllAmenities.py libSpots.geojson has-toilets TRUE
# sets all libSpots's "has-toilets" to TRUE

import json
import sys
import os

VALID_FIELDS = ['has-wifi', 'has-outlets', 'has-toilets']

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python3 setAmenity.py <file.geojson> <field> <value>")
        sys.exit(1)

    path  = sys.argv[1]
    field = sys.argv[2]
    value = sys.argv[3]

    if not os.path.exists(path):
        print(f"Error: file not found — {path}")
        sys.exit(1)

    if field not in VALID_FIELDS:
        print(f"Error: field must be one of {VALID_FIELDS}")
        sys.exit(1)

    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for feature in data['features']:
        feature['properties'][field] = value

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    count = len(data['features'])
    print(f"+ set {field} = {value} on {count} spots in {path}")