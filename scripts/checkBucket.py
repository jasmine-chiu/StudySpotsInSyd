from supabase import create_client

SUPABASE_URL = ""
SUPABASE_KEY = ""

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    buckets = supabase.storage.list_buckets()
    print("successfully connected!")
    print("buckets visible to this script:")
    for b in buckets:
        print(f" - {b.name}")
except Exception as e:
    print(f"connection failed: {e}")