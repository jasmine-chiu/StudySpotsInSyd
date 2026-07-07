import json
import time
import requests
import os

API_KEY = 'AIzaSyDO8a5nZ8HG4GdaOXQID42KBC4xX-6Tx-E'

def search_places(query, location, radius, place_type, page_token=None):
    params = {
        'query': query,
        'location': location,
        'radius': radius,
        'type': place_type,
        'key': API_KEY
    }
    if page_token:
        params = {'pagetoken': page_token, 'key': API_KEY}
    
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        params=params
    )
    return res.json()

def get_details(place_id):
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        params={
            'place_id': place_id,
            'fields': 'name,formatted_address,geometry,opening_hours,rating,user_ratings_total,editorial_summary,reviews',
            'key': API_KEY
        }
    )
    return res.json().get('result', None)

grid_points = [
    # ('-33.8688, 151.2093', 'Sydney CBD'),
    # ('-33.7688, 151.1793', 'North Sydney'),
    # ('-33.9688, 151.1593', 'South Sydney'),
    # ('-33.8688, 151.0593', 'Western Sydney'),
    ('-33.8688, 151.3593', 'Eastern Sydney'),
    ('-33.7200, 151.0800', 'Hills District'),
    # ('-34.0500, 150.9500', 'Campbelltown'),
    # ('-33.8600, 150.8700', 'Parramatta'),
    # ('-33.9500, 151.1000', 'Bankstown'),
    # ('-33.9700, 151.2400', 'Sutherland'),
    # second iteration
    # ('-33.7900, 151.2850', 'Manly'),
    # ('-33.7500, 151.2900', 'Dee Why'),
    # ('-33.6800, 151.3000', 'Mona Vale'),
    # ('-33.8950, 151.1750', 'Newtown'),
    ('-33.8600, 151.1600', 'Balmain'),
    # third iteration
    # {'-33.7319, 151.0783', 'Thornleigh'}
]

if os.path.exists('./libSpots.json'):
    with open('./libSpots.json', 'r') as f:
        existing = json.load(f)
    seen = set(r['place_id'] for r in existing)
    results = existing
    print(f"Loaded {len(existing)} existing libraries")
else:
    seen = set()
    results = []

candidates = []

for coords, area_name in grid_points:
    print(f"Searching {area_name}...")
    page_token = None

    while True:
        data = search_places(
            query = 'library',
            location = coords,
            radius = 15000,
            place_type = 'library',
            page_token = page_token
        )

        for place in data.get('results', []):
            pid = place['place_id']
            if pid not in seen:
                seen.add(pid)
                candidates.append({
                    'place_id': pid,
                    'name': place['name'],
                    'address': place.get('formatted_address', ''),
                    'lat': place['geometry']['location']['lat'],
                    'lng': place['geometry']['location']['lng'],
                })

        page_token = data.get('next_page_token')
        if not page_token:
            break

        time.sleep(2)

    time.sleep(0.5)

print(f"\nFound {len(candidates)} unique libraries, fetching details...")

results = []

for place in candidates:
    details = get_details(place['place_id'])
    if details:
        results.append({ **place, **details })
    print(f"✓ {place['name']} — {place['address']}")
    time.sleep(0.1)

with open('./libSpots.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"Done! {len(results)} libraries saved.")

print(data.get('status'), data.get('error_message', ''))
