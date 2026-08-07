#!/usr/bin/env python3
"""
Ajoute une voiture au site, photos comprises.

    npm run voiture:ajouter

Le script pose les questions une par une, prépare les photos (redimensionnement,
compression, rognage du fond studio, renommage) et écrit la fiche dans
content/vehicles/. Il ne commite rien : tu relis, puis tu pousses.

Dépendance : Pillow (`pip install Pillow`).
"""
import json
import os
import re
import subprocess
import sys
import unicodedata

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit('Pillow est nécessaire pour préparer les photos : pip install Pillow')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'content/vehicles')
CARS = os.path.join(ROOT, 'public/cars')

TYPES = ['Berline', 'SUV', 'Pick-up 4x4']
TRANSMISSIONS = ['Manuelle', 'Automatique']
PHOTO_EXT = ('.jpg', '.jpeg', '.png', '.webp', '.heic')

BOLD, DIM, RED, GREEN, RESET = '\033[1m', '\033[2m', '\033[31m', '\033[32m', '\033[0m'


def slugify(value):
    text = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', text.lower())).strip('-')


def ask(label, default=None, hint=None):
    suffix = f' {DIM}[{default}]{RESET}' if default else ''
    if hint:
        print(f'{DIM}   {hint}{RESET}')
    while True:
        answer = input(f'{BOLD}{label}{RESET}{suffix} : ').strip()
        if answer:
            return answer
        if default is not None:
            return default
        print(f'{RED}   Cette réponse est obligatoire.{RESET}')


def ask_choice(label, choices, default=None):
    print(f'{BOLD}{label}{RESET}')
    for i, choice in enumerate(choices, 1):
        print(f'   {i}. {choice}')
    while True:
        raw = input(f'   Numéro{f" {DIM}[{default}]{RESET}" if default else ""} : ').strip()
        if not raw and default:
            return default
        if raw.isdigit() and 1 <= int(raw) <= len(choices):
            return choices[int(raw) - 1]
        print(f'{RED}   Choisis un numéro entre 1 et {len(choices)}.{RESET}')


def ask_int(label, default=None, minimum=1):
    while True:
        raw = ask(label, str(default) if default is not None else None)
        digits = re.sub(r'[^\d]', '', raw)
        if digits and int(digits) >= minimum:
            return int(digits)
        print(f'{RED}   Entre un nombre (supérieur ou égal à {minimum}).{RESET}')


def ask_yes(label, default=True):
    suffix = 'O/n' if default else 'o/N'
    raw = input(f'{BOLD}{label}{RESET} {DIM}[{suffix}]{RESET} : ').strip().lower()
    return default if not raw else raw.startswith('o')


def ask_list(label, hint):
    print(f'{BOLD}{label}{RESET}')
    print(f'{DIM}   {hint} — ligne vide pour terminer.{RESET}')
    items = []
    while True:
        item = input('   • ').strip()
        if not item:
            return items
        items.append(item)


def trim_studio_background(im):
    """Rogne le fond uniforme autour du sujet (sans effet sur les intérieurs)."""
    rgb = im.convert('RGB')
    bg = rgb.getpixel((1, 1))
    mask = ImageChops.difference(rgb, Image.new('RGB', im.size, bg)).convert('L')
    box = mask.point(lambda p: 255 if p > 20 else 0).getbbox()
    if not box:
        return im
    mx, my = int(im.width * 0.02), int(im.height * 0.04)
    return im.crop((max(0, box[0] - mx), max(0, box[1] - my),
                    min(im.width, box[2] + mx), min(im.height, box[3] + my)))


def prepare_photos(folder, slug, trim):
    """Prépare les photos d'un dossier vers public/cars/<slug>-N.jpg."""
    if not os.path.isdir(folder):
        print(f'{RED}   Dossier introuvable : {folder}{RESET}')
        return None

    names = sorted(f for f in os.listdir(folder) if f.lower().endswith(PHOTO_EXT))
    if not names:
        print(f'{RED}   Aucune photo ({", ".join(PHOTO_EXT)}) dans ce dossier.{RESET}')
        return None

    os.makedirs(CARS, exist_ok=True)
    gallery = []
    for i, name in enumerate(names, 1):
        try:
            im = Image.open(os.path.join(folder, name))
        except Exception as e:                                    # photo illisible
            print(f'{RED}   {name} ignorée ({e}){RESET}')
            continue
        if trim:
            im = trim_studio_background(im)
        im.thumbnail((1400, 1400), Image.LANCZOS)
        out = f'{slug}-{i}.jpg'
        im.convert('RGB').save(os.path.join(CARS, out), 'JPEG',
                               quality=86, optimize=True, progressive=True)
        size = os.path.getsize(os.path.join(CARS, out)) // 1024
        print(f'   {GREEN}✓{RESET} {name} → public/cars/{out} {DIM}({im.width}×{im.height}, {size} Ko){RESET}')
        gallery.append(f'/cars/{out}')
    return gallery


def main():
    print(f'\n{BOLD}Ajouter une voiture au site{RESET}')
    print(f'{DIM}Réponds aux questions ; rien n\'est publié tant que tu n\'as pas poussé.{RESET}\n')

    name = ask('Modèle', hint='Le nom de la voiture, sans la boîte de vitesses. Ex. Toyota Corolla')
    variant = ask('Précision (facultatif)', default='',
                  hint='Sert à distinguer deux voitures identiques. Ex. Boîte automatique')

    default_slug = slugify(f'{name} {variant}' if variant else name)
    slug = slugify(ask('Identifiant (adresse web)', default=default_slug))
    path = os.path.join(CONTENT, f'{slug}.json')
    if os.path.exists(path) and not ask_yes(f'La fiche {slug}.json existe déjà. La remplacer ?', False):
        sys.exit('Annulé.')

    print()
    vtype = ask_choice('Type de véhicule', TYPES, default='Berline')
    transmission = ask_choice('Boîte de vitesses', TRANSMISSIONS, default='Manuelle')
    fuel = ask('Carburant', default='Essence')
    price = ask_int('Prix par jour en FCFA, sans chauffeur', minimum=1000)
    seats = ask_int('Nombre de places', default=5)
    doors = ask_int('Nombre de portes', default=5)
    clim = ask_yes('Climatisation ?', True)

    print()
    best_for = ask('Phrase qui aide à choisir',
                   hint='Affichée sur la carte. Ex. Routes dégradées, familles et bagages')
    description = ask('Description', hint='Deux ou trois phrases, affichées sur la fiche.')
    features = ask_list('Points forts', 'Ex. Climatisation, 5 places, Grand coffre')

    print()
    available = ask_yes('Disponible à la location dès maintenant ?', True)
    coming_soon = False if available else ask_yes('L\'annoncer comme « bientôt disponible » ?', True)

    print()
    gallery = []
    if ask_yes('Ajouter des photos maintenant ?', True):
        folder = os.path.expanduser(ask('Dossier contenant les photos',
                                        hint='Chemin du dossier, ex. ~/Images/corolla'))
        trim = ask_yes('Photos prises sur fond uni (studio) ? Le fond sera rogné', False)
        gallery = prepare_photos(folder, slug, trim) or []

    if available and not gallery:
        print(f'\n{RED}Une voiture proposée à la location doit avoir au moins une photo.{RESET}')
        print(f'{DIM}Ajoute les photos dans public/cars/ puis complète « gallery » dans la fiche.{RESET}')

    orders = []
    for f in os.listdir(CONTENT):
        if f.endswith('.json'):
            with open(os.path.join(CONTENT, f), encoding='utf-8') as fh:
                orders.append(json.load(fh).get('order', 0))

    vehicle = {
        'id': slug,
        'order': max(orders, default=0) + 1,
        'name': name,
        **({'variant': variant} if variant else {}),
        'type': vtype,
        'pricePerDay': price,
        'seats': seats,
        'doors': doors,
        'transmission': transmission,
        'fuel': fuel,
        'airConditioning': clim,
        'gallery': gallery,
        'bestFor': best_for,
        'description': description,
        'features': features,
        'available': available,
        **({'comingSoon': True} if coming_soon else {})
    }

    os.makedirs(CONTENT, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(vehicle, fh, ensure_ascii=False, indent=2)
        fh.write('\n')
    print(f'\n{GREEN}✓{RESET} Fiche écrite : content/vehicles/{slug}.json')

    print(f'\n{DIM}Vérification de la fiche…{RESET}')
    sys.stdout.flush()  # sinon la sortie du script Node s'intercale plus haut
    check = subprocess.run(['node', os.path.join(ROOT, 'scripts/build-vehicles.mjs')], cwd=ROOT)

    print(f'\n{BOLD}Et maintenant :{RESET}')
    if check.returncode != 0:
        print(f'   1. Corrige les points signalés ci-dessus dans content/vehicles/{slug}.json')
    print('   1. npm run dev   → vérifie la voiture sur http://localhost:3000/vehicles')
    print('   2. npm test      → vérifie que le parcours de réservation marche toujours')
    print(f'   3. git add -A && git commit -m "flotte: ajoute {name}" && git push\n')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit('\nAnnulé.')
