import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://napqykmcsbaklwzcpsne.supabase.co")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "products")


def public_image_url(filepath: str) -> str:
    """filepath is e.g. 'Himesh/cardigan/img_00000001.jpg' from products.filepath."""
    return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{filepath}"