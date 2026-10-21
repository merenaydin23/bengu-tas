"""
Bengü Taş — Türkçe El Yazısı Veri Seti Üreticisi (Handwritten Turkish Dataset Generator)
Görüntü İşleme Dersi için Veri Üretimi ve Veri Artırma (Data Augmentation)
"""

import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import torch
from torch.utils.data import Dataset
from model import CLASSES

# Windows sistem fontları (Çeşitlilik için)
FONT_CANDIDATES = [
    "C:/Windows/Fonts/calibri.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/comic.ttf",
    "C:/Windows/Fonts/tahoma.ttf",
    "C:/Windows/Fonts/verdana.ttf",
    "C:/Windows/Fonts/georgia.ttf",
    "C:/Windows/Fonts/trebuc.ttf"
]

VALID_FONTS = [f for f in FONT_CANDIDATES if os.path.exists(f)]
if not VALID_FONTS:
    VALID_FONTS = [None] # Varsayılan font

def render_character_image(char: str, size=32) -> np.ndarray:
    """
    Tek bir karakteri el yazısı benzeri varyasyonlarla 32x32 gri görüntüye dönüştürür.
    """
    # 64x64 büyük tuvalde çizip küçülteceğiz (Anti-aliasing ve esneklik)
    canvas_size = 64
    img = Image.new("L", (canvas_size, canvas_size), color=0) # Siyah zemin
    draw = ImageDraw.Draw(img)

    # Yazı tipi ve boyutu
    font_path = random.choice(VALID_FONTS)
    font_size = random.randint(34, 46)
    try:
        font = ImageFont.truetype(font_path, font_size) if font_path else ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    # Karakteri ortala
    bbox = draw.textbbox((0, 0), char, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    pos_x = (canvas_size - text_w) // 2 - bbox[0] + random.randint(-4, 4)
    pos_y = (canvas_size - text_h) // 2 - bbox[1] + random.randint(-4, 4)

    # Kalem kalınlığı ve parlaklık
    stroke_width = random.choice([0, 1, 2])
    draw.text((pos_x, pos_y), char, fill=255, font=font, stroke_width=stroke_width)

    # Veri Artırma (Data Augmentation)
    # 1. Döndürme (-16 ile +16 derece)
    angle = random.uniform(-16, 16)
    img = img.rotate(angle, resample=Image.Resampling.BILINEAR, expand=False)

    # 2. Perspektif veya Eğim (Shear)
    if random.random() > 0.5:
        m = random.uniform(-0.2, 0.2)
        img = img.transform((canvas_size, canvas_size), Image.Transform.AFFINE, (1, m, 0, 0, 1, 0))

    # 3. Hafif Bulanıklık / Gürültü
    if random.random() > 0.6:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.7)))

    # 32x32 boyutuna indir
    img = img.resize((size, size), Image.Resampling.LANCZOS)

    arr = np.array(img, dtype=np.float32) / 255.0 # [0, 1] aralığına normalize et
    return arr

class TurkishHandwrittenDataset(Dataset):
    """
    PyTorch Dataset Sınıfı
    """
    def __init__(self, samples_per_class=400, transform=None):
        self.samples_per_class = samples_per_class
        self.transform = transform
        self.classes = CLASSES
        self.data = []
        self.labels = []
        
        print(f"Toplam {len(self.classes)} sınıf için sentetik veri üretiliyor ({samples_per_class} örnek/sınıf)...")
        for idx, char in enumerate(self.classes):
            for _ in range(samples_per_class):
                img_arr = render_character_image(char, size=32)
                self.data.append(img_arr)
                self.labels.append(idx)
        
        self.data = np.array(self.data, dtype=np.float32)
        self.labels = np.array(self.labels, dtype=np.int64)
        print(f"Veri seti hazır: Toplam {len(self.data)} örnek.")

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        # 1 x 32 x 32 tensör
        img = torch.from_numpy(self.data[idx]).unsqueeze(0)
        label = self.labels[idx]
        return img, label
