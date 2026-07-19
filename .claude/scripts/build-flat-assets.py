"""Flatten the metallic logo crops to solid monochrome (#25211E) using their
alpha masks, then rebuild favicons / apple-touch-icon / OG image from the flat
version. Metallic originals stay in logo-sources/ for packaging contexts only.
Run build-logo-assets.py first if the source artwork changed."""
from PIL import Image

SOURCES_DIR = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\.claude\scripts\logo-sources"
PUBLIC_IMAGES = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images"
PUBLIC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public"

INK = (37, 33, 30)  # #25211E per spec
BG_FLOUR = (243, 239, 232, 255)  # --flour-white #F3EFE8


def flatten(src_im, color=INK):
    src_im = src_im.convert("RGBA")
    solid = Image.new("RGBA", src_im.size, color + (255,))
    solid.putalpha(src_im.getchannel("A"))
    return solid


# flower mark (metallic crop lives in public/images from round 1; re-derive from it)
flower_metal = Image.open(f"{PUBLIC_IMAGES}/logo-flower.png")
flower = flatten(flower_metal)
flower.save(f"{PUBLIC_IMAGES}/logo-flower-ink.png")
print("logo-flower-ink.png", flower.size)

# horizontal lockup: flat flower + flat wordmark
wordmark = flatten(Image.open(f"{SOURCES_DIR}/logo-wordmark-primary.png"))
target_h = 160
f_w = int(flower.width * (target_h / flower.height))
flower_r = flower.resize((f_w, target_h), Image.LANCZOS)
wm_h = int(target_h * 0.58)
wm_w = int(wordmark.width * (wm_h / wordmark.height))
wordmark_r = wordmark.resize((wm_w, wm_h), Image.LANCZOS)
gap = int(target_h * 0.22)
lockup = Image.new("RGBA", (f_w + gap + wm_w, target_h), (0, 0, 0, 0))
lockup.alpha_composite(flower_r, (0, 0))
lockup.alpha_composite(wordmark_r, (f_w + gap, (target_h - wm_h) // 2 + int(target_h * 0.04)))
lockup.save(f"{PUBLIC_IMAGES}/logo-horizontal-ink.png")
print("logo-horizontal-ink.png", lockup.size)


def on_bg(im, size, bg, pad_ratio=0.14):
    canvas = Image.new("RGBA", size, bg)
    scaled = im.copy()
    scaled.thumbnail((int(size[0] * (1 - pad_ratio * 2)), int(size[1] * (1 - pad_ratio * 2))), Image.LANCZOS)
    canvas.alpha_composite(scaled, ((size[0] - scaled.width) // 2, (size[1] - scaled.height) // 2))
    return canvas


for size in [16, 32, 48, 192, 512]:
    on_bg(flower, (size, size), BG_FLOUR, 0.12).convert("RGB").save(f"{PUBLIC}/favicon-{size}.png")
on_bg(flower, (256, 256), BG_FLOUR, 0.12).convert("RGB").save(
    f"{PUBLIC}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
)
on_bg(flower, (180, 180), BG_FLOUR, 0.14).convert("RGB").save(f"{PUBLIC}/apple-touch-icon.png")
print("favicons + apple-touch-icon rebuilt (flat)")

# OG image: flat full lockup (flower above wordmark) on flour white
full = flatten(Image.open(f"{SOURCES_DIR}/logo-full.png"))
og = Image.new("RGBA", (1200, 630), BG_FLOUR)
fit = full.copy()
fit.thumbnail((760, 460), Image.LANCZOS)
og.alpha_composite(fit, ((1200 - fit.width) // 2, (630 - fit.height) // 2))
og.convert("RGB").save(f"{PUBLIC}/og-image.png")
print("og-image.png rebuilt (flat)")
