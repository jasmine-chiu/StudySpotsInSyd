import sys
import os
from supabase import create_client

SUPABASE_URL = "https://pzljqdmrvkkcoiccnoad.supabase.co"
SUPABASE_KEY = ""

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
BUCKET_NAME = "spots-icons"

def upload_entire_folder(folder_path):
    if not os.path.exists(folder_path):
        print(f"err: folder path '{folder_path}' does not exist.")
        return

    valid_extensions = (".png", ".jpg", ".jpeg")
    files = os.listdir(folder_path)
    uploaded_count = 0

    print(f"scanning folder: {folder_path} ...")

    for filename in files:
        if filename.lower().endswith(valid_extensions):
            local_path = os.path.join(folder_path, filename)
            
            ext = os.path.splitext(filename)[1].lower()
            if ext in ('.jpg', '.jpeg'):
                content_type = 'image/jpeg'
            elif ext == '.png':
                content_type = 'image/png'

            try:
                with open(local_path, 'rb') as f:
                    file_data = f.read()

                clean_filename = str(filename).strip()
                print(f"uploading {clean_filename}...")
                
                supabase.storage.from_(BUCKET_NAME).upload(
                    path=clean_filename,
                    file=file_data,
                    file_options={
                        "content-type": content_type, 
                        "upsert": True
                    }
                )
                uploaded_count += 1
                print(f"  + success!")

            except Exception as e:
                print(f"  x failed to upload {filename}: {e}")

    print("\n--- upload complete ---")
    print(f"+ uploaded {uploaded_count} images to the '{BUCKET_NAME}' bucket.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python3 pushImgToDB.py <images_folder_path>")
        sys.exit(1)

    target_folder = sys.argv[1]
    upload_entire_folder(target_folder)