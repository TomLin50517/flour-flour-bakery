from PIL import Image

SRC = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\Image\Hero.jpg"
OUT = r"C:\Users\bh062\OneDrive\文件\Claude\Projects\Bakery_Website\public\images\hero-tamsui-bridge.jpg"

im = Image.open(SRC)
w, h = im.size
print("source", w, h)

# trim excess flat sky (top) and excess foreground water (bottom) to a wide 2:1
# cinematic crop that keeps the bridge silhouette + sun centered; full width kept
top = 90
bottom = 900
cropped = im.crop((0, top, w, bottom))
print("cropped", cropped.size, cropped.size[0] / cropped.size[1])

cropped.convert("RGB").save(OUT, quality=90)
print("saved", OUT)
