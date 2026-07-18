"""Build favicon/apple-touch-icon/header-lockup/og-image from the crops
produced by build-logo-assets.py. Run build-logo-assets.py first."""
from PIL import Image

SOURCES_DIR = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\.claude\scripts\logo-sources"
PUBLIC_IMAGES = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images"
PUBLIC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public"

flower = Image.open(f"{PUBLIC_IMAGES}/logo-flower.png").convert("RGBA")
wordmark_primary = Image.open(f"{SOURCES_DIR}/logo-wordmark-primary.png").convert("RGBA")

BG_CREAM = (247, 239, 227, 255)  # --color-bg #F7EFE3


def on_bg(im, size, bg, pad_ratio=0.16):
    canvas = Image.new("RGBA", size, bg)
    inner_w = int(size[0] * (1 - pad_ratio * 2))
    inner_h = int(size[1] * (1 - pad_ratio * 2))
    scaled = im.copy()
    scaled.thumbnail((inner_w, inner_h), Image.LANCZOS)
    x = (size[0] - scaled.width) // 2
    y = (size[1] - scaled.height) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas


# --- favicon family (flower mark, solid cream bg so it reads on any browser chrome) ---
for size in [16, 32, 48, 192, 512]:
    icon = on_bg(flower, (size, size), BG_CREAM, pad_ratio=0.12)
    icon.convert("RGB").save(f"{PUBLIC}/favicon-{size}.png")

ico_base = on_bg(flower, (256, 256), BG_CREAM, pad_ratio=0.12).convert("RGB")
ico_base.save(f"{PUBLIC}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

apple = on_bg(flower, (180, 180), BG_CREAM, pad_ratio=0.14)
apple.convert("RGB").save(f"{PUBLIC}/apple-touch-icon.png")

# --- horizontal header lockup: flower (left) + "flour flour" wordmark (right), transparent ---
target_h = 160
f_h = target_h
f_w = int(flower.width * (f_h / flower.height))
flower_r = flower.resize((f_w, f_h), Image.LANCZOS)

wm_h = int(target_h * 0.62)
wm_w = int(wordmark_primary.width * (wm_h / wordmark_primary.height))
wordmark_r = wordmark_primary.resize((wm_w, wm_h), Image.LANCZOS)

gap = int(target_h * 0.22)
total_w = f_w + gap + wm_w
canvas = Image.new("RGBA", (total_w, target_h), (0, 0, 0, 0))
canvas.alpha_composite(flower_r, (0, 0))
wm_y = (target_h - wm_h) // 2 + int(target_h * 0.04)
canvas.alpha_composite(wordmark_r, (f_w + gap, wm_y))
canvas.save(f"{PUBLIC_IMAGES}/logo-horizontal.png")
print("public/images/logo-horizontal.png", canvas.size)

# --- OG image 1200x630: full lockup centered on cream bg ---
full = Image.open(f"{SOURCES_DIR}/logo-full.png").convert("RGBA")
og = Image.new("RGBA", (1200, 630), BG_CREAM)
full_fit = full.copy()
full_fit.thumbnail((900, 520), Image.LANCZOS)
x = (1200 - full_fit.width) // 2
y = (630 - full_fit.height) // 2
og.alpha_composite(full_fit, (x, y))
og.convert("RGB").save(f"{PUBLIC}/og-image.png")
print("public/og-image.png", og.size)

print("done")
