"""Visuels produit Carrure (python3 generate.py <dossier de sortie> [slug...]) : vêtement seul sur cintre, décliné en couleur et motif.
Bases Pexels : 32427323 (veste droite), 37987847 (veste croisée), 9558723 (chemise, nettoyée par shirt-cutout.py).
Attend dans le dossier courant big/<id>.jpg (téléchargés sur images.pexels.com) et cut/<id>.png (détourés par rembg)."""
import os
import sys
import numpy as np
from PIL import Image, ImageFilter

OUT = sys.argv[1]
W, H = 1000, 1250
BG = np.array([232, 236, 240], np.float32) / 255  # --color-muted du MASTER
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def lum(rgb):
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def load(path, box=None, denoise=False):
    im = Image.open(path).convert("RGBA")
    if box:
        im = im.crop(box)
    if denoise:
        rgb = im.convert("RGB").filter(ImageFilter.MedianFilter(5))
        im = Image.merge("RGBA", (*rgb.split(), im.split()[3]))
    return im


# --- bases -------------------------------------------------------------------
jacket = load("cut/32427323.png")
jacket = jacket.crop(jacket.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox())
db = load("cut/37987847.png", (700, 232, 1290, 1010), denoise=True)  # veste croisée blanche, sans la patère
db = db.crop(db.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox())
shirt = load("cut/shirt_full.png")  # 9558723, nettoyée par shirt-cutout.py


def fit(base, mode):
    """Place la base dans le cadre 1000×1250 et renvoie rgb, alpha."""
    if mode == "shirt":  # gros plan : la chemise remplit le cadre, coupée en bas
        s = W / base.width
        im = base.resize((W, round(base.height * s)), Image.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.paste(im, (0, H - im.height), im)
    else:  # silhouette entière, centrée
        im = base.copy()
        im.thumbnail((int(W * 0.8), int(H * 0.86)), Image.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2), im)
    a = np.asarray(canvas).astype(np.float32) / 255
    rgb, al = a[..., :3], a[..., 3].copy()
    if mode == "shirt":  # la manche du pull qui tient le cintre
        al[(lum(rgb) > 0.7) & (xx > W * 0.6) & (yy < H * 0.3)] = 0
    return rgb, al


# --- motifs (en pixels du cadre) ----------------------------------------------


def solid(c):
    return np.broadcast_to(hexc(c), (H, W, 3)).copy()


def noise(base, amount, scale=1.0):
    n = rng.normal(0, 1, (H, W)).astype(np.float32)
    if scale > 1:
        n = np.asarray(Image.fromarray(n).resize((int(W / scale), int(H / scale))).resize((W, H), Image.BILINEAR))
    return np.clip(base * (1 + amount * n[..., None]), 0, 1)


def stripes(bg, line, period, width):
    m = (xx % period) < width
    out = solid(bg)
    out[m] = hexc(line)
    return out


def check(c1, c2, period, mix=None):
    """Vichy : deux couleurs, la case de croisement plus foncée."""
    a = (xx % period) < period / 2
    b = (yy % period) < period / 2
    out = solid(c1)
    one = hexc(mix or c2) if mix else (hexc(c1) + hexc(c2)) / 2
    out[a ^ b] = one
    out[a & b] = hexc(c2)
    return out


def tartan(bg, bands):
    """Bandes horizontales et verticales superposées (flanelle, surchemise)."""
    out = solid(bg)
    for color, period, width, offset in bands:
        c = hexc(color)
        v = ((xx + offset) % period) < width
        h = ((yy + offset) % period) < width
        out[v] = out[v] * 0.45 + c * 0.55
        out[h] = out[h] * 0.45 + c * 0.55
    return out


def glen(bg, line, accent):
    """Prince-de-galles vu à un mètre : fond gris chiné, carreaux fins plus clairs, fil bleu en surcarreau."""
    out = noise(solid(bg), 0.18)
    P = 44
    out[((xx % P) < 3) | ((yy % P) < 3)] = hexc(line)
    out[(((xx + P // 2) % (P * 2)) < 2) | (((yy + P // 2) % (P * 2)) < 2)] = hexc(accent)
    out = np.asarray(Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
    return out


# --- rendu ----------------------------------------------------------------------
def render(base, mode, pattern, keep_light=0.0):
    rgb, al = fit(base, mode)
    L = lum(rgb)
    m = al > 0.5
    mean = max(np.median(L[m]), 1e-3)  # la médiane : le cintre et la doublure sombres ne faussent pas la référence
    # Éclairage : on garde les plis (hautes fréquences) et on aplatit les taches de lumière (basses fréquences).
    Lm = np.where(m, L, mean)
    low = np.asarray(Image.fromarray((Lm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(45))).astype(np.float32) / 255
    detail = (Lm - low) / mean
    shade = np.clip((low / mean) ** 0.35 * (1 + 1.5 * detail), 0.05, None)[..., None]
    tone = lum(pattern)[..., None]
    # Tissus foncés : on multiplie. Tissus clairs : les plis assombrissent, la lumière ne brûle pas.
    dark = pattern * shade ** 1.3
    light = pattern * (0.96 + 0.75 * (shade - 1))
    out = np.where(tone < 0.5, dark, light)
    # La teinte moyenne du vêtement doit rester celle du tissu annoncé.
    out *= np.median(lum(pattern)[m]) / max(np.median(lum(out)[m]), 1e-3)
    if keep_light:  # bois du cintre et étiquette : couleurs d'origine
        wood = (rgb[..., 0] - rgb[..., 2] > 0.12) & (yy < H * 0.45)
        out[wood] = rgb[wood]
    out = np.clip(out, 0, 1)
    # Ombre portée très douce, puis composition sur le fond.
    shadow = Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))
    sh = np.roll(np.asarray(shadow).astype(np.float32) / 255, (18, 8), (0, 1)) * 0.14
    bg = BG[None, None, :] * (1 - sh[..., None])
    comp = out * al[..., None] + bg * (1 - al[..., None])
    return Image.fromarray((comp * 255).astype(np.uint8)), cutout(out, al)


def cutout(rgb, al):
    """Vêtement seul sur fond transparent, pour l'essayage caméra."""
    return Image.fromarray((np.dstack([rgb, al]) * 255).astype(np.uint8), "RGBA")


J, D, S = (jacket, "jacket"), (db, "jacket"), (shirt, "jacket")
PRODUCTS = {
    # Costumes
    "costume-laine-marine": (J, lambda: noise(solid("#1f2b45"), 0.03)),
    "costume-gris-anthracite": (J, lambda: noise(solid("#3d4046"), 0.04)),
    "costume-ajuste-noir": (J, lambda: noise(solid("#1b1b1e"), 0.03)),
    "costume-flanelle-gris-chine": (J, lambda: noise(solid("#7d7f84"), 0.16, 1.5)),
    "costume-lin-beige": (J, None),  # la photo d'origine : lin beige
    "costume-prince-de-galles": (J, lambda: glen("#6c6f75", "#9a9da2", "#5577aa")),
    "costume-croise-gris-bleu": (D, lambda: noise(solid("#5f6d7d"), 0.03)),
    "smoking-noir-revers-satin": (D, lambda: solid("#161618")),
    "costume-tweed-marron": (J, lambda: noise(noise(solid("#5a3e2c"), 0.22, 2), 0.14)),
    "costume-trois-pieces-bleu-nuit": (J, lambda: noise(solid("#18213a"), 0.03)),
    "costume-vert-sapin": (J, lambda: noise(solid("#213d30"), 0.04)),
    "costume-rayure-tennis": (J, lambda: noise(stripes("#1f2b45", "#8f9ab0", 18, 2), 0.03)),
    # Chemises
    "chemise-oxford-blanche": (S, lambda: noise(solid("#f6f6f3"), 0.02)),
    "chemise-oxford-bleu-ciel": (S, lambda: noise(solid("#b9cde3"), 0.03)),
    "chemise-popeline-blanche-ajustee": (S, lambda: solid("#f8f8f6")),
    "chemise-popeline-rayee-bleue": (S, lambda: stripes("#f6f7f9", "#5f86bd", 22, 5)),
    "chemise-lin-bleu-ciel": (S, lambda: noise(solid("#a9c2dc"), 0.07, 2)),
    "chemise-lin-blanche": (S, lambda: noise(solid("#f3f1ea"), 0.05, 2)),
    "chemise-flanelle-carreaux": (S, lambda: noise(tartan("#3f5f8f", [("#1b2440", 90, 34, 0), ("#7fa0c8", 90, 6, 52), ("#1b2440", 30, 4, 10)]), 0.05, 1.5)),
    "chemise-denim-indigo": (S, lambda: noise(solid("#2c3f66"), 0.12, 1.2)),
    "chemise-twill-rose-pale": (S, lambda: noise(solid("#efd3d3"), 0.02)),
    "chemise-noire-stretch": (S, lambda: solid("#1c1c1f")),
    "chemise-vichy-bleue": (S, lambda: check("#f6f7f9", "#3e66a8", 26)),
    "chemise-petits-carreaux": (S, lambda: check("#f3f5f8", "#6f8db8", 10)),
    "chemise-smoking-blanche": (S, lambda: solid("#fafaf8")),
    "chemise-chambray": (S, lambda: noise(solid("#7f9bbd"), 0.10, 1.2)),
    "surchemise-carreaux-ecrus": (S, lambda: noise(tartan("#e6dfcf", [("#1e1e1e", 150, 60, 0), ("#1e1e1e", 150, 8, 100)]), 0.06, 2)),
    "chemise-fil-a-fil-bleue": (S, lambda: noise(solid("#7d9cc6"), 0.14)),
    "chemise-maille-marine": (S, lambda: noise(solid("#1f2a44"), 0.10)),
    "chemise-carreaux-noir-blanc": (S, lambda: check("#f2f2f0", "#1b1b1b", 70, mix="#7a7a7a")),
}

# Points d'épaule (gauche, droite) de chaque base dans le cadre 1000×1250, relevés à l'œil.
SHOULDERS = {"jacket": ((255, 372), (732, 372)), "db": ((290, 398), (690, 398)), "shirt": ((370, 190), (700, 215))}
TW, TH, TS = 600, 900, 300  # cadre de sortie, écart entre les épaules en sortie


def tryon(cut, kind):
    """Recadre le vêtement pour l'essayage : épaules à l'horizontale, en (150, 150) et (450, 150), cintre retiré."""
    (lx, ly), (rx, ry) = SHOULDERS[kind]
    if kind != "shirt":  # le cintre et le dos du col : là où passera le cou
        hole = Image.new("L", cut.size, 0)
        cx = (lx + rx) // 2
        hole.paste(255, (cx - 80, 0, cx + 80, min(ly, ry) - 60))
        hole = np.asarray(hole.filter(ImageFilter.GaussianBlur(14))).astype(np.float32) / 255
        a = np.asarray(cut).astype(np.float32)
        a[..., 3] *= 1 - hole
        cut = Image.fromarray(a.astype(np.uint8), "RGBA")
    angle = np.arctan2(ry - ly, rx - lx)
    scale = TS / np.hypot(rx - lx, ry - ly)
    # Rotation autour de l'épaule gauche, mise à l'échelle, puis l'épaule gauche va en (150, 150).
    cos, sin = np.cos(angle) / scale, np.sin(angle) / scale
    a, b, c, d = cos, -sin, sin, cos
    ox, oy = 150, 150
    return cut.transform((TW, TH), Image.AFFINE, (a, b, lx - a * ox - b * oy, c, d, ly - c * ox - d * oy), Image.BICUBIC)


KIND = {id(jacket): "jacket", id(db): "db", id(shirt): "shirt"}
TRYON = os.environ.get("TRYON_OUT")  # dossier des vêtements détourés pour l'essayage caméra
only = set(sys.argv[2:])
for slug, ((base, mode), make) in PRODUCTS.items():
    if only and slug not in only:
        continue
    if make is None:
        rgb, al = fit(base, mode)
        bg = BG[None, None, :]
        img = Image.fromarray(((rgb * al[..., None] + bg * (1 - al[..., None])) * 255).astype(np.uint8))
        cut = cutout(rgb, al)
    else:
        img, cut = render(base, mode, make())
    img.save(f"{OUT}/{slug}.jpg", quality=84, progressive=True, optimize=True)
    if TRYON:
        tryon(cut, KIND[id(base)]).save(f"{TRYON}/{slug}.webp", quality=82, method=6)
    print(slug)
