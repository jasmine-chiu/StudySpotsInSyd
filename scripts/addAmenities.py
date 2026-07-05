import json
import csv
import sys
import os

AMENITY_FIELDS = ['has-wifi', 'has-outlets', 'has-toilets']

def normalise(name):
    return name.lower().strip()

def load_geojson(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_csv(path):
    amenity_map = {}
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = normalise(row.get('name', ''))
            if not name:
                continue
            amenity_map[name] = {
                field: row.get(field, '').strip() for field in AMENITY_FIELDS
            }
    return amenity_map

def save(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def merge(target_path, csv_path, output_path):
    target      = load_geojson(target_path)
    amenity_map = load_csv(csv_path)

    matched   = []
    unmatched = []

    for feature in target['features']:
        props = feature['properties']
        name  = props.get('name', '')
        key   = normalise(name)

        if key in amenity_map:
            props.update(amenity_map[key])
            matched.append(name)
        else:
            for field in AMENITY_FIELDS:
                props.setdefault(field, '')
            unmatched.append(name)

    save(target, output_path)

    print(f"Done! {len(matched)} matched, {len(unmatched)} unmatched.")
    print(f"Output written to: {output_path}")

    if unmatched:
        print(f"\nUnmatched spots (amenities left blank):")
        for name in unmatched:
            print(f"  - {name}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 addAmenities.py <target.geojson> <source.csv> [output.geojson]")
        sys.exit(1)

    target_path = sys.argv[1]
    csv_path    = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) >= 4 else target_path

    for path in [target_path, csv_path]:
        if not os.path.exists(path):
            print(f"Error: file not found — {path}")
            sys.exit(1)

    print(f"Merging amenities from '{csv_path}' into '{target_path}'...\n")
    merge(target_path, csv_path, output_path)