#!/usr/bin/env python3
"""
Prépare les images du site à partir des originaux fournis par le client.

Les originaux (planches de photos + logo) sont dans `assets-source/` et ne sont
pas servis par le site. Ce script les découpe en photos individuelles dans
`public/cars/`, détoure le monogramme du logo et génère l'image Open Graph.

    python3 scripts/prepare-assets.py

Dépendance : Pillow (`pip install Pillow`).
"""
from PIL import Image, ImageChops, ImageDraw, ImageFont
import os

SRC = 'assets-source'
CARS = 'public/cars'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


def trim_studio_background(t):
    """
    Rogne le fond studio uniforme autour du sujet pour que la voiture
    remplisse la vignette. Sans effet sur les photos d'intérieur, dont le
    sujet touche déjà les bords.
    """
    bg = t.convert('RGB').getpixel((1, 1))
    diff = ImageChops.difference(t.convert('RGB'), Image.new('RGB', t.size, bg))
    mask = diff.convert('L').point(lambda p: 255 if p > 20 else 0)
    box = mask.getbbox()
    if not box:
        return t
    mx, my = int(t.width * 0.02), int(t.height * 0.04)
    return t.crop((max(0, box[0] - mx), max(0, box[1] - my),
                   min(t.width, box[2] + mx), min(t.height, box[3] + my)))


def tile(im, box, name, quality=86):
    """Découpe une vignette de la planche et l'enregistre en JPEG optimisé."""
    t = im.crop(box)
    w, h = t.size
    t = t.crop((2, 2, w - 2, h - 2))  # marge : évite les lignes de séparation
    t = trim_studio_background(t)
    t.thumbnail((1400, 1400), Image.LANCZOS)
    t.convert('RGB').save(f'{CARS}/{name}.jpg', 'JPEG', quality=quality, optimize=True, progressive=True)
    print(f'{CARS}/{name}.jpg', t.size)


def split_fleet():
    os.makedirs(CARS, exist_ok=True)

    # Toyota Avensis boîte automatique — planche 2x2
    a = Image.open(f'{SRC}/avensis-auto.jpeg')
    W, H = a.size
    xm, ym = 447, 597
    tile(a, (0, 0, xm, ym), 'avensis-auto-1')       # 3/4 avant, portes ouvertes
    tile(a, (0, ym, xm, H), 'avensis-auto-2')       # 3/4 arrière
    tile(a, (xm, 0, W, ym), 'avensis-auto-3')       # tableau de bord, boîte auto
    tile(a, (xm, ym, W, H), 'avensis-auto-4')       # sièges arrière

    # Toyota Avensis boîte manuelle — 2 en haut, 2 au milieu, 1 en bas
    m = Image.open(f'{SRC}/avensis-manuelle.jpeg')
    W, H = m.size
    r1, r2, xm = 390, 800, 447
    tile(m, (0, 0, xm, r1), 'avensis-manuelle-1')   # profil
    tile(m, (xm, 0, W, r1), 'avensis-manuelle-2')   # face avant, portes ouvertes
    tile(m, (0, r2, W, H), 'avensis-manuelle-3')    # coffre ouvert
    tile(m, (0, r1, xm, r2), 'avensis-manuelle-4')  # poste de conduite
    tile(m, (xm, r1, W, r2), 'avensis-manuelle-5')  # sièges avant

    # Toyota RAV4 gris — planche 2 colonnes x 3 rangées, fond blanc
    g = Image.open(f'{SRC}/rav4-grise.jpeg')
    gx = [(21, 437), (460, 876)]
    gy = [(20, 335), (425, 735), (812, 1128)]
    tile(g, (gx[0][0], gy[0][0], gx[0][1], gy[0][1]), 'rav4-1')  # 3/4 avant
    tile(g, (gx[1][0], gy[1][0], gx[1][1], gy[1][1]), 'rav4-2')  # profil avant
    tile(g, (gx[1][0], gy[0][0], gx[1][1], gy[0][1]), 'rav4-3')  # 3/4 arrière
    tile(g, (gx[1][0], gy[2][0], gx[1][1], gy[2][1]), 'rav4-4')  # arrière
    tile(g, (gx[0][0], gy[1][0], gx[0][1], gy[1][1]), 'rav4-5')  # tableau de bord
    tile(g, (gx[0][0], gy[2][0], gx[0][1], gy[2][1]), 'rav4-6')  # sièges arrière

    # Toyota Hilux — photo unique, pas de planche à découper
    h = Image.open(f'{SRC}/hilux.jpeg')
    tile(h, (0, 0, h.width, h.height), 'hilux-1')

    # La planche du RAV4 rouge reste dans assets-source/ mais n'est plus publiée :
    # le véhicule de l'agence est le RAV4 gris ci-dessus.


def extract_mark():
    """Détoure le monogramme « R » du logo client sur fond transparent."""
    src = Image.open(f'{SRC}/logo.jpeg').convert('RGB')
    W, _ = src.size
    TOP = 700  # le monogramme est au-dessus du texte du logo
    px = src.load()
    minx, miny, maxx, maxy = W, TOP, 0, 0
    for y in range(0, TOP, 2):
        for x in range(0, W, 2):
            r, g, b = px[x, y]
            if 0.299 * r + 0.587 * g + 0.114 * b < 200:  # encre noire ou rouge
                minx, maxx = min(minx, x), max(maxx, x)
                miny, maxy = min(miny, y), max(maxy, y)

    pad = 12
    mark = src.crop((max(0, minx - pad), max(0, miny - pad),
                     min(W, maxx + pad), min(TOP, maxy + pad))).convert('RGBA')
    mp = mark.load()
    for y in range(mark.height):
        for x in range(mark.width):
            r, g, b, _ = mp[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            # le fond du logo est un gris très clair : alpha dérivé de la luminance
            a = 0 if lum >= 238 else 255 if lum <= 205 else int(255 * (238 - lum) / 33)
            mp[x, y] = (r, g, b, a)
    return mark


def write_brand(mark):
    os.makedirs('public/brand', exist_ok=True)
    side = max(mark.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
    square.resize((512, 512), Image.LANCZOS).save('public/brand/mark.png')
    square.resize((512, 512), Image.LANCZOS).save('public/icon.png')
    square.resize((180, 180), Image.LANCZOS).save('public/apple-icon.png')

    # Logo horizontal (utilisé par les données structurées Schema.org)
    logo = Image.new('RGBA', (1040, 320), (255, 255, 255, 0))
    m = mark.copy()
    m.thumbnail((260, 260), Image.LANCZOS)
    logo.paste(m, (20, (320 - m.height) // 2), m)
    d = ImageDraw.Draw(logo)
    d.text((300, 100), 'RODRIGO', font=ImageFont.truetype(BOLD, 76), fill=(21, 21, 23, 255))
    d.text((303, 186), 'AUTO SERVICES', font=ImageFont.truetype(BOLD, 46), fill=(209, 38, 48, 255))
    logo.save('public/brand/logo.png')
    print('public/brand/mark.png, logo.png, icônes OK')


def write_og(mark):
    """Carte de partage 1200x630 : identité à gauche, vraie photo à droite."""
    photo = Image.open(f'{CARS}/rav4-2.jpg').convert('RGB')
    pp = photo.load()
    bx0, by0, bx1, by1 = photo.width, photo.height, 0, 0
    for y in range(photo.height):
        for x in range(photo.width):
            r, g, b = pp[x, y]
            if max(r, g, b) - min(r, g, b) > 22 or 0.299 * r + 0.587 * g + 0.114 * b < 120:
                bx0, bx1 = min(bx0, x), max(bx1, x)
                by0, by1 = min(by0, y), max(by1, y)
    car = photo.crop((bx0, by0, bx1, by1))
    car = car.resize((int(car.width * 1.55), int(car.height * 1.55)), Image.LANCZOS)

    og = Image.new('RGB', (1200, 630), (237, 237, 240))
    og.paste(car, (470 + (730 - car.width) // 2, (630 - car.height) // 2))
    d = ImageDraw.Draw(og)
    d.rectangle((0, 0, 470, 630), fill=(255, 255, 255))
    m = mark.copy()
    m.thumbnail((110, 110), Image.LANCZOS)
    og.paste(m, (56, 60), m)
    d.text((56, 205), 'RODRIGO', font=ImageFont.truetype(BOLD, 62), fill=(21, 21, 23))
    d.text((58, 277), 'AUTO SERVICES', font=ImageFont.truetype(BOLD, 36), fill=(209, 38, 48))
    f = ImageFont.truetype(REG, 27)
    for i, line in enumerate(['Location de voiture', 'à Douala, avec ou', 'sans chauffeur']):
        d.text((56, 370 + i * 38), line, font=f, fill=(91, 96, 105))
    badge, bf = 'Orange Money & MTN MoMo', ImageFont.truetype(BOLD, 21)
    d.rounded_rectangle((56, 505, 56 + d.textlength(badge, font=bf) + 64, 570), radius=32, fill=(209, 38, 48))
    d.text((88, 526), badge, font=bf, fill=(255, 255, 255))
    og.save('public/og.jpg', quality=88, optimize=True, progressive=True)
    print('public/og.jpg OK')


if __name__ == '__main__':
    split_fleet()
    mark = extract_mark()
    write_brand(mark)
    write_og(mark)
