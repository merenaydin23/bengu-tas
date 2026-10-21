<div align="center">

# 🏛️ Bengü Taş (Orhun OCR & Göktürkçe Çeviri Sistemi)

<p align="center">
  <strong>«Elinle yaz, atalarının yazısıyla oku.»</strong><br>
  <em>Kâğıda yazdığınız Türkçe el yazısını kamerayla tarayıp anında Göktürk (Orhun) alfabesine dönüştüren, sunucusuz ve derin öğrenme tabanlı web uygulaması.</em>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.13-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-WebAssembly-005CED?style=for-the-badge&logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Accuracy](https://img.shields.io/badge/BengüNet_Accuracy-%2599.26-success?style=for-the-badge)](AKADEMIK_RAPOR.md)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Ready-0E1B2B?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

<br/>

[🌟 Canlı Demo](#-canlı-demo--ekranlar) •
[🧠 BengüNet CNN Mimarisi](#-derin-öğrenme-mimarisi-bengünet-cnn) •
[🔬 Görüntü İşleme Pipeline](#-görüntü-işleme-pipelineı) •
[🚀 Hızlı Kurulum](#-hızlı-kurulum-ve-çalıştırma) •
[📜 Akademik Rapor](AKADEMIK_RAPOR.md)

</div>

---

## 📌 Proje Hakkında

**Bengü Taş**, çocukların ve öğrencilerin el yazısı yazarak Türk tarihinin ilk yazılı belgeleri olan **Orhun Yazıtları**'nı keşfetmelerini sağlayan yenilikçi bir eğitim ve görüntü işleme projesidir.

* **🔒 Sıfır Sunucu, %100 Cihaz İçi Gizlilik:** Kamera görüntüsü ve çıkarım işlemleri hiçbir sunucuya iletilmez. Tüm yapay zekâ ve görüntü işleme algoritmaları doğrudan tarayıcı belleğinde (**WebAssembly**) çalışır.
* **🧠 Çift Motor Desteği (Dual OCR Engine):**
  1. **BengüNet CNN (Özel Eğitilmiş Model):** PyTorch ile 11.700 sentetik Türkçe el yazısı varyasyonu üzerinde eğitilmiş, **%99.26 doğrulama başarımı** elde etmiş ve ONNX ile web ortamına aktarılmış evrişimli sinir ağı.
  2. **Tesseract.js (Hibrit/Yedek Motor):** Google/Tesseract LSTM Türkçe dil modeli ile metin tanıma.
* **✍️ Kural Tabanlı Göktürk Fonetik Motoru:**
  - Resmi **Unicode Old Turkic** standardı (`U+10C00` – `U+10C4F`) ve *Noto Sans Old Turkic* yazı tipi.
  - **Ünlü Uyumu Analizi:** Kalın ünlülü kelimelerde (`a, ı, o, u`) kalın Orhun harfleri; ince ünlülü kelimelerde (`e, i, ö, ü`) ince Orhun harfleri.
  - **İki Yazım Modu:** *Öğrenci Modu* (tüm ünlüler gösterilir) ve *Orhun Usulü* (orta hece ünlü düşmesi ve `lt, nt, nç, ny` birleşik işaretleri).
  - **Yazım Yönü:** Orhun Yazıtlarındaki gibi Sağdan Sola (**RTL**) ve modern Soldan Sağa (**LTR**) desteği.
* **📜 Yazıt Formatında PNG Kartı:** Çevrilen metni altın ve bordo süslemeli taş kitabe formatında yüksek çözünürlüklü indirme ve paylaşma.

---

## 🧠 Derin Öğrenme Mimarisi: BengüNet CNN

Türkçe alfabeye özgü `Ç, Ğ, İ, Ö, Ş, Ü` karakterlerini ve rakamları tanımak için sıfırdan tasarlanan mimari:

```
KAMERA GÖRÜNTÜSÜ
       │
       ▼
[Ön İşleme: Kırpma, Grayscale, Kontrast Germe, Otsu Binarization]
       │
       ▼
[Dikey Projeksiyon Profili ile Harf Segmentasyonu]
       │
       ▼ (Her harf için 1x32x32 normalize tensör)
┌─────────────────────────────────────────────────────────────┐
│                       BengüNet CNN                          │
├─────────────────────────────────────────────────────────────┤
│ • Blok 1: Conv2D(1->32, 3x3) + BatchNorm + ReLU + MaxPool(2x2)│
│ • Blok 2: Conv2D(32->64, 3x3) + BatchNorm + ReLU + MaxPool(2x2)│
│ • Blok 3: Conv2D(64->128, 3x3) + BatchNorm + ReLU + MaxPool(2x2)│
│ • Dropout2D(p = 0.25)                                       │
│ • Düzleştirme (Flatten): 128 x 4 x 4 = 2048 Nöron          │
│ • FC1: Linear(2048 -> 256) + ReLU + Dropout(p = 0.40)      │
│ • FC2: Linear(256 -> 39 Sınıf Lojiti)                      │
└─────────────────────────────────────────────────────────────┘
       │
       ▼ (ONNX WebAssembly Çıkarımı: < 5 ms/karakter)
TÜRKÇE METİN ("TÜRK")
       │
       ▼ (Fonetik Analiz & Ünlü Uyumu: t-ince, ü, r-ince, k-ince)
GÖKTÜRK YAZISI ("𐱅𐰇𐰼𐰜")
```

### 📊 Model Başarım Metrikleri

| Metrik | Değer |
|---|---|
| **Eğitim Seti Boyutu** | 9.945 Görüntü (%85) |
| **Doğrulama Seti Boyutu** | 1.755 Görüntü (%15) |
| **Toplam Sınıf Sayısı** | 39 Sınıf (A-Z, Ç, Ğ, İ, Ö, Ş, Ü, 0-9) |
| **Optimizer & Loss** | AdamW ($\text{lr}=10^{-3}$) + CrossEntropyLoss |
| **Eğitim Süresi** | 8 Epoch (~80 saniye, CPU) |
| **Nihai Validation Accuracy** | **%99.26** 🎯 |

*(Ayrıntılı formüller, epoch tabloları ve confusion matrix detayları için [AKADEMIK_RAPOR.md](AKADEMIK_RAPOR.md) belgesine bakınız.)*

---

## 🔬 Görüntü İşleme Pipeline'ı

Klasik görüntü işleme aşamaları [src/lib/ocr/preprocess.ts](src/lib/ocr/preprocess.ts) ve [src/lib/ocr/bengunet-client.ts](src/lib/ocr/bengunet-client.ts) içinde uygulanmıştır:

1. **ROI Kırpma:** Canlı videodaki odaklama çerçevesi en-boy oranı korunarak kırpılır.
2. **Gri Seviye Dönüşümü:** $Y = 0.299 \cdot R + 0.587 \cdot G + 0.114 \cdot B$
3. **Kontrast Germe (Histogram Stretching):** En koyu ve en açık piksel değerleri $[0, 255]$ aralığına normalize edilir.
4. **Otsu Adaptif Binarization:** Sınıflar arası varyansı maksimize eden optimum eşik değeri hesaplanarak gölgeler temizlenir.
5. **Dikey Projeksiyon Profili (Vertical Projection Profile):** İkili matriste her sütundaki siyah pikseller toplanarak vadilerden harf sınırları belirlenir.
6. **Karakter Normalizasyonu:** Her harf karesi $32 \times 32$ tensöre ölçeklenip ONNX motoruna beslenir.

---

## 🏛️ Sayfalar ve Bölümler

* **Ana Sayfa (`#/`):** Hero, slogan, 3 adımda nasıl çalışır, interaktif canlı deneme ve Türk devletleri şeridi.
* **Çevirmen Stüdyosu (`#/cevir`):** Kamera ile çekim, dosya yükleme ve klavyeyle yazarak deneme; model seçimi (BengüNet / Tesseract), düzenleme kutusu, canlı yazıt önizlemesi ve PNG indirme.
* **Göktürkçe Hakkında (`#/hakkinda`):** Orhun Yazıtları (Kül Tigin, Bilge Kağan, Tonyukuk), Vilhelm Thomsen'in 1893 keşfi, ünlü uyumu görsel şeması ve güvenilir kurum kaynakçası.
* **Alfabe Tablosu (`#/alfabe`):** 38 Göktürk harfinin sesletim ipuçları, örnek kelimeleri ve çocuklar için *"Bu Harfi Bul!"* mini oyunu.
* **Türk Devletleri Zaman Çizelgesi (`#/devletler`):** Asya Hun'dan Türkiye Cumhuriyeti'ne kronolojik devletler, coğrafyaları ve sembolleri.
* **Gizlilik & Lisanslar (`#/gizlilik`):** %100 cihaz içi işleme garantisi ve açık kaynak lisans metinleri.

---

## 🚀 Hızlı Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+) ve npm
- Python (v3.10+) *(Yalnızca modeli baştan eğitmek isterseniz)*

### 1. Projeyi Klonlayın ve Çalıştırın
```bash
# Bağımlılıkları yükleyin
npm install

# Birim testleri çalıştırın
npm run test

# Geliştirme sunucusunu başlatın
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresini açarak uygulamayı kullanabilirsiniz.

### 2. Modeli Baştan Eğitmek İsterseniz (Opsiyonel)
```bash
# Veri seti oluşturma ve CNN eğitimini başlatma
python train/train.py

# Ağırlıkları ONNX modeline dışa aktarma
python train/export_onnx.py
```

### 3. Statik Üretim Derlemesi (Build)
```bash
npm run build
npm run preview
```

---

## 📁 Proje Dosya Ağacı

```
bengu-tas/
├─ .github/workflows/deploy.yml      # Otomatik GitHub Pages dağıtımı
├─ AKADEMIK_RAPOR.md                 # Görüntü işleme & CNN akademik raporu
├─ public/
│  ├─ fonts/NotoSansOldTurkic.woff2  # Self-host Göktürk yazı tipi
│  ├─ model/
│  │  ├─ bengu_net.onnx              # Eğitilmiş PyTorch ONNX modeli
│  │  └─ classes.json                # Sınıf etiketleri (39 sınıf)
│  ├─ ort/                           # ONNX Runtime WebAssembly motoru
│  ├─ tesseract/                     # Çevrimdışı Tesseract OCR dosyaları
│  └─ icons/                         # PWA ikonları ve motifler
├─ src/
│  ├─ components/
│  │  ├─ camera/CameraCapture.tsx    # Kamera, kılavuz ve galeri yedeği
│  │  ├─ common/StoneCard.tsx        # Yazıt taşı kart bileşeni
│  │  ├─ motifs/TurkishMotifs.tsx    # Özgün SVG Türk motifleri (Bozkurt, Güneş, Tamga)
│  │  └─ translator/
│  │     ├─ GokturkOutput.tsx        # Göktürkçe çıktı, RTL/LTR ve PNG indirme
│  │     └─ OcrPanel.tsx             # Metin düzenleme ve OCR ilerleme paneli
│  ├─ content/                       # Tarih, alfabe ve devlet verileri (JSON)
│  ├─ lib/
│  │  ├─ export/png.ts & share.ts    # Canvas yazıt kartı üretici
│  │  ├─ gokturk/                    # Göktürk dönüştürücü ve fonetik testler
│  │  └─ ocr/
│  │     ├─ bengunet-client.ts       # ONNX harf segmentasyonu ve çıkarım istemcisi
│  │     ├─ preprocess.ts            # Otsu binarization ve kontrast germe
│  │     └─ tesseract-client.ts      # Tesseract Web Worker sarmalayıcısı
│  └─ pages/                         # Sayfa bileşenleri
├─ train/
│  ├─ dataset_generator.py           # Sentetik el yazısı veri seti üreticisi
│  ├─ model.py                       # PyTorch BenguNet CNN mimarisi
│  ├─ train.py                       # Model eğitim scripti
│  └─ export_onnx.py                 # ONNX export scripti
├─ LICENSE
├─ README.md
└─ vite.config.ts
```

---

## 📜 Lisans ve Telif

* **Uygulama ve Model Kodu:** [MIT License](LICENSE) — Telif Hakkı (c) 2026 Bengü Taş Projesi.
* **Yazı Tipi:** **Noto Sans Old Turkic** — SIL Open Font License, Version 1.1.
* **OCR Motorları:**
  * **BengüNet:** Özel geliştirilmiş PyTorch CNN modeli (MIT).
  * **Tesseract.js & Core:** Apache License 2.0.
