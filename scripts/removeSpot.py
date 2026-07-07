# removes a spot from a given geojson file based on name matching

# e.g. python3 removeSpot.py starbucksSpots.geojson "Werrington"
# removes "Starbucks Werrington" from that file.

import json
import sys
import os
 
def normalise(name):
    return name.lower().strip()
 
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 removeSpot.py <file.geojson> <name>")
        sys.exit(1)
 
    path  = sys.argv[1]
    query = normalise(' '.join(sys.argv[2:]))
 
    if not os.path.exists(path):
        print(f"Error: file not found — {path}")
        sys.exit(1)
 
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
 
    before   = len(data['features'])
    kept     = []
    removed  = []
 
    for feature in data['features']:
        name = normalise(feature['properties'].get('name', ''))
        if query in name:
            removed.append(feature['properties'].get('name', ''))
        else:
            kept.append(feature)
 
    if not removed:
        print(f"No spots found matching '{query}' — nothing changed.")
        sys.exit(0)
 
    # confirm if multiple matches
    if len(removed) > 1:
        print(f"Found {len(removed)} matches:")
        for i, name in enumerate(removed):
            print(f"  [{i}] {name}")
        confirm = input("Remove all? (y/n): ").strip().lower()
        if confirm != 'y':
            print("Aborted.")
            sys.exit(0)
 
    data['features'] = kept
 
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
 
    for name in removed:
        print(f"+ removed {name}")
    print(f"{before} → {len(kept)} features in {path}")
 