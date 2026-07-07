import json
import time
import requests

# API_KEY

def search_places(query, location, radius, page_token=None):
    params = {
        'query': query,
        'location': location,
        'radius': radius,
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

seen = set()
candidates = []

page_token = None

while True:
    data = search_places(
        query='Starbucks',
        location='-33.8688,151.2093',  # Sydney CBD
        radius=50000,                   # 50km covers greater Sydney
        page_token=page_token
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

    time.sleep(2)  # required before using next_page_token

print(f"Found {len(candidates)} Starbucks locations, fetching details...")

results = []

for place in candidates:
    details = get_details(place['place_id'])
    if details:
        results.append({ **place, **details })
    print(f"✓ {place['name']} — {place['address']}")
    time.sleep(0.1)

with open('./starbucks_sydney.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"Done! {len(results)} locations saved.")