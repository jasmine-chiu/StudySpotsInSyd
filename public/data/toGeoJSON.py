import csv
import json
import re
import sys

# as long as col title is "link",
# google maps link is parsed &
# formats geoJSON w/ coord = [lat, lng]

def csv_to_geojson(input_file):
    output_file = input_file.replace('.csv', '.geojson')
    link_col = 'link'
    features = []

    with open(input_file, newline='') as f:
        reader = csv.DictReader(f)
        
        for i, row in enumerate(reader):
            url = row[link_col]
            print(repr(url))
            print(coords_from_url(url))
            coords = coords_from_url(url)
            if coords is None:
                print(f" Could not find coordinates.")
                continue
            address = address_from_url(url)
            
            lat, lng = coords

            properties = {k: v for k, v in row.items() if k != link_col}
            properties["src"] = url
            properties["address"] = address

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "properties": properties
            }
            features.append(feature)

    geojson = {
    "type": "FeatureCollection",
    "features": features
    }

    with open(output_file, 'w') as f:
        json.dump(geojson, f, indent=2)

    print(f" Completed")

def coords_from_url(url:str):
    match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', url)
    if match:
        return float(match.group(1)), float(match.group(2))

    match = re.search(r'll=(-?\d+\.\d+),(-?\d+\.\d+)', url)
    if match:
        return float(match.group(1)), float(match.group(2))

    return None

def get_address_from_coords(lat, lng):
    try:

        location = geolocator.reverse(f"{lat}, {lng}")
        if location:
            return location.address
    except Exception as e:
        print(f"Error geocoding: {e}")
    return "Address not found"

def address_from_url(url: str):
    try:
        match = re.search(r'/place/(.*?)/@', url)
        if match:
            slug = match.group(1)
            decoded = unquote(slug).replace('+', ' ')
            return decoded
    except Exception:
        pass
    return "Address not found"

csv_to_geojson(sys.argv[1])