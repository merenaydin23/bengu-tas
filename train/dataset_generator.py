"""
Bengü Taş — Türkçe El Yazısı Veri Seti Üreticisi (Handwritten Turkish Dataset Generator v2)
Gerçek el yazısı fontları, rastgele kalem kalınlığı, harf eğimleri ve elastik bozulmalarla
eğitim veri seti üretir. Hem büyük hem küçük el yazısı harflerini destekler.
"""

import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import torch
from torch.utils.data import Dataset
from model import CLASSES

# Gerçek El Yazısı ve Sistem Fontları (Windows)
FONT_CANDIDATES = [
    "C:/Windows/Fonts/Inkfree.ttf",     # Gerçek El Yazısı
    "C:/Windows/Fonts/segoepr.ttf",     # Segoe Print
    "C:/Windows/Fonts/segoeprb.ttf",    # Segoe Print Bold
    "C:/Windows/Fonts/segoesc.ttf",     # Segoe Script
    "C:/Windows/Fonts/segoescb.ttf",    # Segoe Script Bold
    "C:/Windows/Fonts/comic.ttf",       # Comic Sans
    "C:/Windows/Fonts/comicbd.ttf",     # Comic Sans Bold
    "C:/Windows/Fonts/calibri.ttf",     # Calibri
    "C:/Windows/Fonts/calibrib.ttf",    # Calibri Bold
    "C:/Windows/Fonts/arial.ttf",       # Arial
    "C:/Windows/Fonts/tahoma.ttf",      # Tahoma
    "C:/Windows/Fonts/verdana.ttf"      # Verdana
]

VALID_FONTS = [f for f in FONT_CANDIDATES if os.path.exists(f)]
if not VALID_FONTS:
    VALID_FONTS = [None]

# Harflerin hem büyük hem küçük el yazısı eşlemesi
LOWER_MAP = {
    'A': 'a', 'B': 'b', 'C': 'c', 'Ç': 'ç', 'D': 'd', 'E': 'e',
    'F': 'f', 'G': 'g', 'Ğ': 'ğ', 'H': 'h', 'I': 'ı', 'İ': 'i',
    'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o',
    'Ö': 'ö', 'P': 'p', 'R': 'r', 'S': 's', 'Ş': 'ş', 'T': 't',
    'U': 'u', 'Ü': 'ü', 'V': 'v', 'Y': 'y', 'Z': 'z'
}

def render_character_image(char: str, size=32) -> np.ndarray:
    """
    Karakteri el yazısı varyasyonlarıyla (büyük/küçük harf, rotasyon, kalem kalınlığı)
    32x32 boyutunda normalize edilmiş gri görüntü olarak üretir.
    """
    canvas_size = 64
    img = Image.new("L", (canvas_size, canvas_size), color=0) # Siyah zemin (MNIST / PyTorch standardı)
    draw = ImageDraw.Draw(img)

    # %50 ihtimalle büyük harf, %50 ihtimalle küçük el yazısı harfi çiz
    draw_char = char
    if char in LOWER_MAP and random.random() > 0.45:
        draw_char = LOWER_MAP[char]

    font_path = random.choice(VALID_FONTS)
    font_size = random.randint(32, 46)
    try:
        font = ImageFont.truetype(font_path, font_size) if font_path else ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), draw_char, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    pos_x = (canvas_size - text_w) // 2 - bbox[0] + random.randint(-4, 4)
    pos_y = (canvas_size - text_h) // 2 - bbox[1] + random.randint(-4, 4)

    # Kalem kalınlığı: İnce tükenmez (0), orta (1), kalın keçeli (2)
    stroke_width = random.choice([0, 0, 1, 1, 2])
    draw.text((pos_x, pos_y), draw_char, fill=random.randint(220, 255), font=font, stroke_width=stroke_width)

    # 1. Döndürme (-18 ile +18 derece arası doğal el yazısı eğimi)
    angle = random.uniform(-18, 18)
    img = img.rotate(angle, resample=Image.Resampling.BILINEAR, expand=False)

    # 2. Eğim / İtalikleşme (Shear)
    if random.random() > 0.4:
        m = random.uniform(-0.25, 0.25)
        img = img.transform((canvas_size, canvas_size), Image.Transform.AFFINE, (1, m, 0, 0, 1, 0))

    # 3. Hafif bulanıklık veya kalem pürüzü
    if random.random() > 0.5:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.6)))

    # 32x32 boyutuna indir
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0

    # Rastgele hafif sensör gürültüsü
    if random.random() > 0.5:
        noise = np.random.normal(0, 0.03, arr.shape).astype(np.float32)
        arr = np.clip(arr + noise, 0.0, 1.0)

    return arr

class TurkishHandwrittenDataset(Dataset):
    """
    Zenginleştirilmiş Türkçe El Yazısı Veri Seti
    """
    def __init__(self, samples_per_class=400):
        self.classes = CLASSES
        self.data = []
        self.labels = []
        
        print(f"Toplam {len(self.classes)} sınıf için sentetik el yazısı üretiliyor ({samples_per_class} örnek/sınıf)...")
        for idx, char in enumerate(self.classes):
            for _ in range(samples_per_class):
                img_arr = render_character_image(char, size=32)
                self.data.append(img_arr)
                self.labels.append(idx)
        
        # [N, 1, 32, 32] Tensör formatı
        self.data = np.expand_dims(np.array(self.data, dtype=np.float32), axis=1)
        self.labels = np.array(self.labels, dtype=np.int64)
        print(f"Veri seti hazır: Toplam {len(self.data)} zenginleştirilmiş örnek.")

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return torch.from_numpy(self.data[idx]), torch.tensor(self.labels[idx], dtype=torch.long)
