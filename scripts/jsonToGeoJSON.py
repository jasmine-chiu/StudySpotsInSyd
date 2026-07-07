import json
import sys
import time
import os
import requests

API_KEY = 'AIzaSyDO8a5nZ8HG4GdaOXQID42KBC4xX-6Tx-E'

DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

def fmt_time(t):
    """Convert '0900' -> '9:00 AM', '1730' -> '5:30 PM'"""
    h, m = int(t[:2]), int(t[2:])
    suffix = 'AM' if h < 12 else 'PM'
    h12 = h % 12 or 12
    return f"{h12}:{m:02d} {suffix}"

def parse_hours(opening_hours):
    """Return a clean dict of day -> 'open – close' or 'Closed'."""
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

def get_coords_and_address(place_id):
    """Fetch lat, lng, address, suburb from place_id."""
    res = requests.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        params={
            'place_id': place_id,
            'fields': 'geometry,formatted_address,address_components',
            'key': API_KEY
        }
    )
    result = res.json().get('result', {})
    if not result:
        return None, None, '', ''

    location = result.get('geometry', {}).get('location', {})
    lat = location.get('lat')
    lng = location.get('lng')
    address = result.get('formatted_address', '')

    suburb = ''
    for component in result.get('address_components', []):
        if 'locality' in component.get('types', []):
            suburb = component['long_name']
            break

    return lat, lng, address, suburb

def convert(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    features = []
    skipped  = []

    for i, place in enumerate(data):
        name     = place.get('name', f'Place {i}')
        place_id = place.get('place_id', '')

        # coordinates
        lat = place.get('lat')
        lng = place.get('lng')

        address = place.get('address') or place.get('formatted_address', '')
        suburb  = place.get('suburb', '')

        if (not lat or not lng) and place_id:
            print(f"  Fetching coords for {name}...")
            lat, lng, address, suburb = get_coords_and_address(place_id)
            time.sleep(0.1)

        if not lat or not lng:
            print(f"  ✗ Skipping {name} — no coordinates found")
            skipped.append(name)
            continue

        # opening hours
        raw_hours = place.get('opening_hours', {})
        hours     = parse_hours(raw_hours)

        # summary 
        summary = place.get('editorial_summary', {}).get('overview', '')

        # reviews
        raw_reviews = place.get('reviews', [])
        reviews = []
        for r in raw_reviews[:3]:
            text = r.get('text', '')
            if text:
                reviews.append({
                    'author': r.get('author_name', ''),
                    'rating': r.get('rating'),
                    'text':   text
                })

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat] 
            },
            "properties": {
                "name":         name,
                "place_id":     place_id,
                "address":      address,
                "suburb":       suburb,
                "rating":       place.get('rating'),
                "rating_count": place.get('user_ratings_total'),
                "hours":        hours,       
                "summary":      summary,
                "reviews":      reviews,
            }
        }
        features.append(feature)
        print(f"  ✓ {name}")

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    print(f"\ncomplete, {len(features)} features written to {output_path}")
    if skipped:
        print(f"Skipped ({len(skipped)}): {', '.join(skipped)}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 toGeoJSON.py <input.json> [output.geojson]")
        sys.exit(1)

    input_path = sys.argv[1]

    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        base = os.path.splitext(input_path)[0]
        output_path = base + '.geojson'

    if not os.path.exists(input_path):
        print(f"Error: file not found — {input_path}")
        sys.exit(1)

    print(f"Converting {input_path} → {output_path}\n")
    convert(input_path, output_path)