# /// script
# dependencies = ["numpy", "pillow"]
# ///
"""The backdrop behind nebaz's clips on neboto.dev/nebaz/: a muted take on
nebaz's demo/backdrop.py. The same navy sky, horizon and grid, but close to
the page's own navy (static/css/nebaz.css), with one soft flag-blue glow and
no cyan, violet or dots, so the clips sit on the page instead of glowing on
it. scripts/nebaz-media.sh runs it.

    uv run scripts/nebaz-backdrop.py <out.png>

The size is nebaz's tapes' Width × Height plus their margin, as upstream.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 1296, 796
out = sys.argv[1]
y, x = np.mgrid[0:H, 0:W].astype(np.float32)

def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255

def glow(cx, cy, r, color, strength):
    d = ((x - cx) ** 2 + (y - cy) ** 2) / (r * r)
    return np.exp(-d)[..., None] * hexc(color) * strength

t = (y / H)[..., None]
img = hexc("#06101b") * (1 - t) + hexc("#0a1828") * t
img += glow(180, 120, 560, "#006aa7", 0.10)

hz = H * 0.62
grid = np.zeros((H, W), np.float32)
below = y > hz
depth = (y - hz) / (H - hz)
with np.errstate(divide="ignore", invalid="ignore"):
    z = 1.0 / np.maximum(depth, 1e-3)
    hl = np.abs(((z * 1.6) % 1.0) - 0.5)
    hline = np.clip(1 - hl / (0.03 * z + 0.02), 0, 1)
    u = (x - W / 2) / np.maximum(depth, 1e-3) / 90
    vl = np.abs((u % 1.0) - 0.5)
    vline = np.clip(1 - vl / (0.02 / np.maximum(depth, 0.05) + 0.015), 0, 1)
grid[below] = np.maximum(hline, vline)[below] * np.clip(depth[below] * 1.6, 0, 1) ** 1.8
soft = np.asarray(Image.fromarray((grid * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), np.float32) / 255
img += grid[..., None] * hexc("#2d5f86") * 0.22 + soft[..., None] * hexc("#006aa7") * 0.12

hzd = np.exp(-((y - hz) ** 2) / (2 * 8 ** 2)) * np.exp(-((x - W / 2) ** 2) / (2 * 380 ** 2))
img += hzd[..., None] * hexc("#5d9fcf") * 0.18

img = np.clip(img, 0, 1)
Image.fromarray((img * 255).astype(np.uint8)).save(out)
