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
        
        for row in reader:
            url = row[link_col]
            
            coords = coords_from_url(url)
            if coords is None:
                print(f" Could not find coordinates.")
                continue
            
            lat, lng = coords

            properties = {k: v for k, v in row.items() if k != link_col}
            properties["src"] = url

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

csv_to_geojson(sys.argv[1])