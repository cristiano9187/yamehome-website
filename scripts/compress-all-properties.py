"""Compresse les photos de tous les logements Yaoundé pour le site web."""
from pathlib import Path
from PIL import Image

MAX_WIDTH = 1600
QUALITY = 82
BASE = Path(r"C:\Users\chris\OneDrive\Documents\yamehome-website_production\public\images")

# (source_dir, relative_src, output_subdir, output_name)
JOBS: list[tuple[Path, str, str, str]] = []

def add(src_dir: str, items: list[tuple[str, str, str]]):
    root = Path(src_dir)
    for rel_src, subdir, dst_name in items:
        JOBS.append((root, rel_src, subdir, dst_name))

def compress(src: Path, dst: Path) -> float:
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as img:
        img = img.convert("RGB")
        w, h = img.size
        if w > MAX_WIDTH:
            new_h = int(h * MAX_WIDTH / w)
            img = img.resize((MAX_WIDTH, new_h), Image.Resampling.LANCZOS)
        img.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return dst.stat().st_size / 1024

# --- Emeraude (f202) ---
F202 = r"C:\Users\chris\OneDrive\Pictures\f202"
add(F202, [
    ("e_salon.jpeg", "emeraude", "salon.jpg"),
    ("f_chambre.jpeg", "emeraude", "chambre_principale.jpg"),
    ("dcuisine.jpeg", "emeraude", "cuisine.jpg"),
    ("aceuil.jpeg", "emeraude", "aceuil.jpg"),
    ("e_sale_manger.jpeg", "emeraude", "salle_manger.jpg"),
    ("f_chambre2.jpeg", "emeraude", "chambre_2.jpg"),
    ("h_salle_bain.jpeg", "emeraude", "sdb.jpg"),
    ("g_couloir.jpeg", "emeraude", "entree.jpg"),
    ("e_salon_.jpeg", "emeraude", "salon_detail.jpg"),
    ("bb_route.jpg", "emeraude", "exterieur.jpg"),
])

# --- Haut Standing / Brigade ---
BRIGADE = r"C:\Users\chris\OneDrive\Pictures\Brigade"
add(BRIGADE, [
    ("area1_vue_salle_manger.jpg", "brigade", "salon.jpg"),
    ("chrambre1_lit_clim.jpg", "brigade", "chambre_principale.jpg"),
    ("cuisine.jpg", "brigade", "cuisine.jpg"),
    ("chambre2_vue_chevet.jpg", "brigade", "chambre_2.jpg"),
    ("balcon.jpg", "brigade", "balcon.jpg"),
    ("area1_vue_tv.jpg", "brigade", "salon_tv.jpg"),
    ("chambre1_douchevulavabo.jpg", "brigade", "sdb.jpg"),
    ("area1_vue_arriere.jpg", "brigade", "entree.jpg"),
    ("cuisine_machinecaffe.jpg", "brigade", "cuisine_detail.jpg"),
])

# --- Deluxe (201B10) ---
B201 = r"C:\Users\chris\OneDrive\Pictures\201B10"
add(B201, [
    ("a_main.jpg", "deluxe", "salon.jpg"),
    ("PHOTO-2023-07-09-14-27-29.jpg", "deluxe", "salle_manger.jpg"),
    ("PHOTO-2023-07-09-14-27-26_1.jpg", "deluxe", "chambre_principale.jpg"),
    ("n_entrance.jpg", "deluxe", "entree.jpg"),
    ("PHOTO-2023-07-09-14-27-31.jpg", "deluxe", "cuisine.jpg"),
    ("PHOTO-2023-07-09-14-27-56.jpg", "deluxe", "chambre_2.jpg"),
    ("PHOTO-2023-07-09-14-27-38.jpg", "deluxe", "sdb.jpg"),
    ("PHOTO-2023-07-09-14-27-52.jpg", "deluxe", "detail.jpg"),
    ("park.jpg", "deluxe", "exterieur.jpg"),
])

# --- Studio Américain (203B10) ---
B203 = r"C:\Users\chris\OneDrive\Pictures\203B10"
add(B203, [
    ("main.jpg", "americain", "salon.jpg"),
    ("PHOTO-2023-07-09-14-26-08.jpg", "americain", "cuisine.jpg"),
    ("PHOTO-2023-07-09-14-26-28.jpg", "americain", "chambre.jpg"),
    ("PHOTO-2023-07-09-14-26-19.jpg", "americain", "sejour_wide.jpg"),
    ("PHOTO-2023-07-09-14-26-00.jpg", "americain", "cuisine_detail.jpg"),
    ("n_entrance.jpg", "americain", "entree.jpg"),
    ("PHOTO-2023-07-09-14-25-44.jpg", "americain", "sdb.jpg"),
])

# --- Studio Superior (103B10) ---
B103 = r"C:\Users\chris\OneDrive\Pictures\103B10"
add(B103, [
    ("a_bsalon.jpg", "superior", "sejour.jpg"),
    ("schambre.jpg", "superior", "chambre.jpg"),
    ("cuisine.jpg", "superior", "cuisine.jpg"),
    ("a_amain.jpg", "superior", "salon.jpg"),
    ("schambre2.jpg", "superior", "chambre_detail.jpg"),
    ("cuisine2.jpg", "superior", "cuisine_detail.jpg"),
    ("n_entrance.jpg", "superior", "entree.jpg"),
    ("image00002_bis.jpg", "superior", "sejour_2.jpg"),
])

# --- Chambre A ---
CHA = r"C:\Users\chris\OneDrive\Pictures\chambre 104A"
add(CHA, [
    ("image00003.jpeg", "chambrea", "vue_lit.jpg"),
    ("image00004.jpeg", "chambrea", "vue_tv.jpg"),
    ("image00008.jpeg", "chambrea", "vue_fenetre.jpg"),
    ("image00014.jpeg", "chambrea", "lit_detail.jpg"),
    ("image00011.jpeg", "chambrea", "douche.jpg"),
])

# --- Chambre B ---
CHB = r"C:\Users\chris\OneDrive\Pictures\chambre104B"
add(CHB, [
    ("image00002.jpeg", "chambreb", "lit_frigo.jpg"),
    ("image00001.jpeg", "chambreb", "tv_frigo.jpg"),
    ("image00005.jpeg", "chambreb", "placard.jpg"),
    ("a_vue_fenetre.jpeg", "chambreb", "fenetre.jpg"),
    ("image00004.jpeg", "chambreb", "lit_detail.jpg"),
    ("a_vvDouche.jpeg", "chambreb", "douche.jpg"),
])

if __name__ == "__main__":
    current_subdir = ""
    for src_root, rel_src, subdir, dst_name in JOBS:
        if subdir != current_subdir:
            current_subdir = subdir
            print(f"\n=== {subdir} ===")
        src = src_root / rel_src
        dst = BASE / subdir / dst_name
        if not src.exists():
            print(f"MISSING: {src}")
            continue
        kb = compress(src, dst)
        print(f"{dst_name}: {kb:.0f} KB")
