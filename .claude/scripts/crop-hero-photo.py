from PIL import Image

SRC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\Image\Hero2.png"
OUT = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images\hero-tamsui-bridge.jpg"

im = Image.open(SRC)
w, h = im.size
print("source", w, h)

# trim excess flat sky from the top only (bridge sits lower in this frame than Hero.jpg),
# keep full water at the bottom for grounding/reflection; same 2:1 cinematic ratio as before
top = 256
bottom = h
cropped = im.crop((0, top, w, bottom))
print("cropped", cropped.size, cropped.size[0] / cropped.size[1])

cropped.convert("RGB").save(OUT, quality=90)
print("saved", OUT)
