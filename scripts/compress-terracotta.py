"""Compresse les photos Terracotta pour le site web."""
from pathlib import Path
from PIL import Image

SRC = Path(r"C:\Users\chris\OneDrive\Pictures\F201\tri_201")
DST = Path(r"C:\Users\chris\OneDrive\Documents\yamehome-website_production\public\images\terracotta")

SELECTION = [
    ("image00002.jpeg", "entree.jpg"),
    ("image00003.jpeg", "cuisine.jpg"),
    ("image00004.jpeg", "cuisine_fenetre.jpg"),
    ("image00021.jpeg", "salon.jpg"),
    ("a_main.jpeg", "salon_tv.jpg"),
    ("a_main2.jpeg", "chambre_principale.jpg"),
    ("image00044.jpeg", "chambre_2.jpg"),
    ("image00038.jpeg", "chambre_detail.jpg"),
    ("image00031.jpeg", "sdb.jpg"),
    ("image00026.jpeg", "balcon.jpg"),
]

MAX_WIDTH = 1600
QUALITY = 82

DST.mkdir(parents=True, exist_ok=True)

for src_name, dst_name in SELECTION:
    src = SRC / src_name
    dst = DST / dst_name
    if not src.exists():
        print(f"MISSING: {src}")
        continue
    with Image.open(src) as img:
        img = img.convert("RGB")
        w, h = img.size
        if w > MAX_WIDTH:
            new_h = int(h * MAX_WIDTH / w)
            img = img.resize((MAX_WIDTH, new_h), Image.Resampling.LANCZOS)
        img.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb = dst.stat().st_size / 1024
    print(f"{dst_name}: {kb:.0f} KB")
