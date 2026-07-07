import json
import sys
import os
from supabase import create_client

SUPABASE_URL = ""
SUPABASE_KEY = "INSERT_SERVICE_ROLE_KEY"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def convert(feature, category):
    props = feature["properties"]
    lng, lat = feature["geometry"]["coordinates"]
    return {
        "place_id":     props.get("place_id"),
        "name":         props.get("name"),
        "category":     category,
        "lat":          lat,
        "lng":          lng,
        "address":      props.get("address", ""),
        "suburb":       props.get("suburb", ""),
        "rating":       props.get("rating"),
        "rating_count": props.get("rating_count"),
        "hours":        props.get("hours", {}),
        "summary":      props.get("summary", ""),
        "reviews":      props.get("reviews", []),
        "has_wifi":     props.get("has-wifi", ""),
        "has_outlets":  props.get("has-outlets", ""),
        "has_toilets":  props.get("has-toilets", ""),
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: python3 pushGeoJSONToDB.py <file.geojson> <category>")
        sys.exit(1)

    path, category = sys.argv[1], sys.argv[2]

    with open(path, "r") as f:
        data = json.load(f)

    rows = [convert(f, category) for f in data["features"]]
    result = supabase.table("spots").upsert(rows, on_conflict="place_id").execute()
    print(f"+ {len(rows)} spots pushed for category '{category}'")