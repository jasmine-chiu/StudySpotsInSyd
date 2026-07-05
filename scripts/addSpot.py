# adds a spot based on a search through Google Places API

# e.g. python3 addSpot.py "Hornsby Library" libSpots.geojson
# adds a spot, "Hornsby Library", to libSpots.geojson

import json
import sys
import os
import requests
 
API_KEY = 'AIzaSyDO8a5nZ8HG4GdaOXQID42KBC4xX-6Tx-E'
 
DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
 
def fmt_time(t):
    h, m = int(t[:2]), int(t[2:])
    suffix = 'AM' if h < 12 else 'PM'
    h12 = h % 12 or 12
    return f"{h12}:{m:02d} {suffix}"
 
def parse_hours(opening_hours):
    if not opening_hours:
        return {}
    weekday_text = opening_hours.get('weekday_text', [])
    if weekday_text:
        hours = {}
        for entry in weekday_text:
            day, _, times = entry.partition(': ')
            hours[day] = times.strip()
        return hours
    periods = opening_hours.get('periods', [])
    hours = {day: 'Closed' for day in DAYS}
    for p in periods:
        day_name = DAYS[p['open']['day']]
        open_t   = fmt_time(p['open']['time'])
        close_t  = fmt_time(p['close']['time'])
        hours[day_name] = f"{open_t} – {close_t}"
    return hours
 
def search(query):
    """Find place candidates by text query."""
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
        params={
            'input':     f"{query} Sydney",
            'inputtype': 'textquery',
            'fields':    'place_id,name,formatted_address,geometry',
            'key':       API_KEY
        }
    )
    return res.json().get('candidates', [])
 
def get_details(place_id):
    """Fetch full details for a place_id."""
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        params={
            'place_id': place_id,
            'fields':   'name,formatted_address,geometry,address_components,opening_hours,rating,user_ratings_total,editorial_summary,reviews',
            'key':      API_KEY
        }
    )
    return res.json().get('result', {})
 
def extract_suburb(address_components):
    for component in address_components:
        if 'locality' in component.get('types', []):
            return component['long_name']
    return ''
 
def to_feature(place_id, details):
    location = details.get('geometry', {}).get('location', {})
    lat = location.get('lat')
    lng = location.get('lng')
 
    hours   = parse_hours(details.get('opening_hours', {}))
    summary = details.get('editorial_summary', {}).get('overview', '')
    suburb  = extract_suburb(details.get('address_components', []))
 
    raw_reviews = details.get('reviews', [])
    reviews = []
    for r in raw_reviews[:3]:
        text = r.get('text', '')
        if text:
            reviews.append({
                'author': r.get('author_name', ''),
                'rating': r.get('rating'),
                'text':   text
            })
 
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lng, lat]
        },
        "properties": {
            "name":         details.get('name', ''),
            "place_id":     place_id,
            "address":      details.get('formatted_address', ''),
            "suburb":       suburb,
            "rating":       details.get('rating'),
            "rating_count": details.get('user_ratings_total'),
            "hours":        hours,
            "summary":      summary,
            "reviews":      reviews,
            "has-wifi":     "",
            "has-outlets":  "",
            "has-toilets":  ""
        }
    }
 
def load_or_empty():
    return {"type": "FeatureCollection", "features": []}
 
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 findSpot.py <name> [output.geojson]")
        sys.exit(1)
 
    query       = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) >= 3 else f"{query.lower().replace(' ', '_')}.geojson"
 
    print(f"Searching for '{query}'...\n")
    candidates = search(query)
 
    if not candidates:
        print("No results found.")
        sys.exit(0)
 
    # show candidates and let user pick
    print(f"Found {len(candidates)} result(s):\n")
    for i, c in enumerate(candidates):
        print(f"  [{i}] {c['name']} — {c.get('formatted_address', '')}")
 
    print()
    if len(candidates) == 1:
        choice = 0
    else:
        raw = input("Select a result (or press Enter for [0]): ").strip()
        choice = int(raw) if raw.isdigit() else 0
 
    selected   = candidates[choice]
    place_id   = selected['place_id']
 
    print(f"\nFetching details for '{selected['name']}'...")
    details = get_details(place_id)
 
    if not details:
        print("Failed to fetch details.")
        sys.exit(1)
 
    feature = to_feature(place_id, details)
 
    # load existing file or start fresh
    if os.path.exists(output_path):
        with open(output_path, 'r', encoding='utf-8') as f:
            geojson = json.load(f)
 
        # check for duplicate
        existing_ids = {f['properties'].get('place_id') for f in geojson['features']}
        if place_id in existing_ids:
            print(f"'{details['name']}' already exists in {output_path} — skipping.")
            sys.exit(0)
 
        geojson['features'].append(feature)
        print(f"Appended to existing file.")
    else:
        geojson = {"type": "FeatureCollection", "features": [feature]}
        print(f"Created new file.")
 
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
 
    print(f"\n+ '{details['name']}' saved to {output_path}")
 