from PIL import Image

SRC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\Image\S__78364709.png"
OUT_DIR = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images"

im = Image.open(SRC)
w, h = im.size
print("source size", w, h)

# crop out the baked-in headline/body text (top ~35%), keep the styled tray/cup shot below,
# center-crop horizontally to a 4:5 portrait ratio matching the Signature Product slot
top = 520
bottom = h
crop_h = bottom - top
crop_w = int(crop_h * 4 / 5)
left = (w - crop_w) // 2
right = left + crop_w

cropped = im.crop((left, top, right, bottom))
print("cropped size", cropped.size, "ratio", cropped.size[0] / cropped.size[1])

cropped.convert("RGB").save(f"{OUT_DIR}/signature-danish-youtiao.jpg", quality=90)
print("saved (overwrote existing signature-danish-youtiao.jpg)")
