import json
import time
import requests

API_KEY = 'AIzaSyDO8a5nZ8HG4GdaOXQID42KBC4xX-6Tx-E'

with open('./studySpotsCafe.geojson', 'r') as f:
    spots = json.load(f)

def get_place_id(name, suburb):
    query = f"{name} {suburb} Sydney"
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
        params={
            'input': query,
            'inputtype': 'textquery',
            'fields': 'place_id,name',
            'key': API_KEY
        }
    )
    data = res.json()
    candidates = data.get('candidates', [])
    return candidates[0]['place_id'] if candidates else None

def get_details(place_id):
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        params={
            'place_id': place_id,
            'fields': 'opening_hours,rating,user_ratings_total,editorial_summary,reviews',
            'key': API_KEY
        }
    )
    data = res.json()
    return data.get('result', None)

results = []

for feature in spots['features']:
    name = feature['properties']['name']
    suburb = feature['properties'].get('suburb', '')

    place_id = get_place_id(name, suburb)
    if not place_id:
        print(f"✗ Not found: {name}")
        continue

    details = get_details(place_id)
    if details:
        results.append({ 'name': name, 'place_id': place_id, **details })

    print(f"✓ {name}")
    time.sleep(0.1)

with open('./enriched.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Done!")