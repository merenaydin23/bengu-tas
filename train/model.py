"""
BengüNet — El Yazısı Türkçe Karakter Tanıma CNN Modeli
Görüntü İşleme & Derin Öğrenme Mimarisi
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

# Türkçe Büyük Harfler ve Rakamlar (39 Sınıf)
CLASSES = [
    'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
    'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
    'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

NUM_CLASSES = len(CLASSES)

class BenguNet(nn.Module):
    """
    3 Bloklu Konvolüsyonel Sinir Ağı (CNN)
    Giriş: 1 x 32 x 32 (Normalize Edilmiş Gri Tonlama Karakter)
    Çıkış: 39 Sınıf Lojit Değerleri
    """
    def __init__(self, num_classes=NUM_CLASSES):
        super(BenguNet, self).__init__()
        
        # Blok 1: 1 -> 32 kanal (32x32 -> 16x16)
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Blok 2: 32 -> 64 kanal (16x16 -> 8x8)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Blok 3: 64 -> 128 kanal (8x8 -> 4x4)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.pool3 = nn.MaxPool2d(2, 2)
        
        self.dropout_conv = nn.Dropout2d(0.25)
        
        # Tam Bağlantılı (Fully Connected) Sınıflandırıcı
        self.fc1 = nn.Linear(128 * 4 * 4, 256)
        self.dropout_fc = nn.Dropout(0.4)
        self.fc2 = nn.Linear(256, num_classes)
        
    def forward(self, x):
        # x: [B, 1, 32, 32]
        x = self.pool1(F.relu(self.bn1(self.conv1(x))))
        x = self.pool2(F.relu(self.bn2(self.conv2(x))))
        x = self.pool3(F.relu(self.bn3(self.conv3(x))))
        x = self.dropout_conv(x)
        
        x = x.view(x.size(0), -1) # Düzleştirme (Flatten) [B, 2048]
        x = F.relu(self.fc1(x))
        x = self.dropout_fc(x)
        logits = self.fc2(x) # [B, 39]
        return logits

def get_model():
    return BenguNet()
