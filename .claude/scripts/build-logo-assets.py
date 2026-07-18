"""Regenerate logo crops from the source Gemini-generated logo image.
Run this first, then build-derived-assets.py, whenever Image/*.png is replaced."""
from PIL import Image

SRC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\Image\Gemini_Generated_Image_wdk687wdk687wdk6.png"
SOURCES_DIR = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\.claude\scripts\logo-sources"
PUBLIC_IMAGES = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images"

im = Image.open(SRC).convert("RGBA")
w, h = im.size

LOW, HIGH = 22, 70  # warmth (R-B) thresholds: background/white-glow vs copper linework


def cutout(src_im):
    src_im = src_im.convert("RGBA")
    px = src_im.load()
    ww, hh = src_im.size
    for y in range(hh):
        for x in range(ww):
            r, g, b, a = px[x, y]
            warmth = r - b
            if warmth <= LOW:
                px[x, y] = (r, g, b, 0)
            elif warmth >= HIGH:
                px[x, y] = (r, g, b, 255)
            else:
                alpha = int(255 * (warmth - LOW) / (HIGH - LOW))
                px[x, y] = (r, g, b, alpha)
    return src_im


def autotrim(src_im, pad=6):
    bbox = src_im.getbbox()
    if not bbox:
        return src_im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(src_im.width, x1 + pad)
    y1 = min(src_im.height, y1 + pad)
    return src_im.crop((x0, y0, x1, y1))


# brand flower mark alone — used directly on-site (public/images/, referenced by pages)
flower_box = (int(w * 0.145), int(h * 0.095), int(w * 0.565), int(h * 0.605))
flower = autotrim(cutout(im.crop(flower_box)))
flower.save(f"{PUBLIC_IMAGES}/logo-flower.png")
print("public/images/logo-flower.png", flower.size)

# "flour flour" wordmark line only — intermediate source, combined into logo-horizontal.png
primary_box = (0, int(h * 0.605), w, int(h * 0.775))
primary = autotrim(cutout(im.crop(primary_box)))
primary.save(f"{SOURCES_DIR}/logo-wordmark-primary.png")
print("logo-sources/logo-wordmark-primary.png", primary.size)

# full vertical lockup (flower + full wordmark block) — intermediate source for og-image.png
full = autotrim(cutout(im))
full.save(f"{SOURCES_DIR}/logo-full.png")
print("logo-sources/logo-full.png", full.size)
