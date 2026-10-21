# 🎓 Bengü Taş — Görüntü İşleme ve Derin Öğrenme Akademik Raporu

**Ders:** Görüntü İşleme / Yapay Zekâ / Derin Öğrenme  
**Proje Adı:** Bengü Taş — El Yazısı Türkçe Karakter Tanıma ve Göktürkçe Çeviri Sistemi  
**Model Mimarisi:** BengüNet CNN (Convolutional Neural Network)  
**Çatı (Framework):** PyTorch 2.13 $\rightarrow$ ONNX $\rightarrow$ ONNX Runtime WebAssembly (İstemci Taraflı)

---

## 1. Giriş ve Problem Tanımı

Bu projede amaç; kullanıcının beyaz bir kâğıda koyu renkli kalemle yazdığı Türkçe el yazısını web kamerası üzerinden yakalamak, klasik **görüntü işleme teknikleri** ile harfleri segmentlere ayırmak, **özel eğitilmiş bir Konvolüsyonel Sinir Ağı (CNN)** ile harfleri sınıflandırmak ve elde edilen Türkçe metni kural tabanlı bir fonetik motoruyla **Göktürk (Orhun) alfabesine** dönüştürmektir.

Sistem tamamen istemci taraflı (**Client-Side**) çalışacak şekilde tasarlanmış olup hiçbir sunucuya görüntü göndermez.

---

## 2. Kullanılan Veri Seti (Handwritten Turkish Dataset)

Modelin eğitimi için Türkçe alfabeye özgü karakterleri (`Ç, Ğ, İ, Ö, Ş, Ü`) ve rakamları içeren sentetik el yazısı veri seti üretilmiştir (`train/dataset_generator.py`).

* **Sınıf Sayısı:** 39 Sınıf  
  `['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']`
* **Toplam Görüntü Sayısı:** 11.700 Adet (Sınıf başına 300 örnek)
* **Veri Ayrımı (Split):** 
  * **Eğitim Seti (%85):** 9.945 örnek
  * **Doğrulama Seti (%15):** 1.755 örnek
* **Veri Artırma (Data Augmentation) Yöntemleri:**
  1. **Açısal Döndürme (Affine Rotation):** $\theta \in [-16^\circ, +16^\circ]$ aralığında rastgele döndürme.
  2. **Eğim ve Perspektif (Shear Transform):** $m \in [-0.2, 0.2]$ el yazısı yatıklığı simülasyonu.
  3. **Kalem Kalınlığı Varyasyonu:** Farklı uçlu kalemleri taklit etmek için $1, 2, 3\text{ px}$ stroke kalınlığı.
  4. **Gürültü ve Yumuşatma:** Gaussian Blur ($\sigma \in [0.3, 0.7]$) ile tarama artefaktlarının taklidi.
  5. **Normalizasyon:** Görüntüler $32 \times 32$ piksele indirgenmiş ve piksel yoğunlukları $[0.0, 1.0]$ aralığına normalize edilmiştir.

---

## 3. Görüntü İşleme Pipeline'ı (Image Processing Pipeline)

Kameradan alınan ham görüntü sırasıyla şu adımlardan geçer ([src/lib/ocr/preprocess.ts](file:///c:/Users/HP/Desktop/Bengü%20Taş/src/lib/ocr/preprocess.ts) & [src/lib/ocr/bengunet-client.ts](file:///c:/Users/HP/Desktop/Bengü%20Taş/src/lib/ocr/bengunet-client.ts)):

1. **ROI (Region of Interest) Seçimi:** Kullanıcının odaklandığı kılavuz dikdörtgen alandan görüntü kırpılır.
2. **Gri Seviye Dönüşümü (Luminance):**
   $$Y = 0.299 \cdot R + 0.587 \cdot G + 0.114 \cdot B$$
3. **Kontrast Germe (Histogram Stretching):**
   $$P_{\text{yeni}} = \frac{P - min}{max - min} \times 255$$
4. **Otsu Adaptif Binarization (Siyah-Beyaz İkileme):**
   Arka plan ile kalem yazısı arasındaki sınıflar arası varyansı ($\sigma_B^2$) maksimize eden optimum eşik değeri ($t^*$) dinamik olarak hesaplanır.
5. **Dikey Projeksiyon Profili (Vertical Projection Profile) ile Harf Segmentasyonu:**
   İkili görüntüde her $x$ sütunundaki siyah piksel sayısı toplanır. Sütun toplamlarının vadiler oluşturduğu noktalardan kelime harflere bölünür (Segmentation).
6. **Karakter Kırpma ve Ortalaması:**
   Her harfin dikey sınırları ($minY, maxY$) saptanır, en-boy oranı korunarak $32 \times 32$ siyah zeminli kare tensöre dönüştürülür.

---

## 4. Model Mimarisi: BengüNet CNN

Derin öğrenme modeli, harf örüntülerini yakalamak için tasarlanmış 3 konvolüsyonel bloktan oluşur ([train/model.py](file:///c:/Users/HP/Desktop/Bengü%20Taş/train/model.py)):

```
GİRİŞ: [Batch, 1, 32, 32]
│
├── [Blok 1] Conv2D(1 -> 32, kernel=3, pad=1) + BatchNorm2D + ReLU + MaxPool2D(2,2)  --> [Batch, 32, 16, 16]
├── [Blok 2] Conv2D(32 -> 64, kernel=3, pad=1) + BatchNorm2D + ReLU + MaxPool2D(2,2) --> [Batch, 64, 8, 8]
├── [Blok 3] Conv2D(64 -> 128, kernel=3, pad=1) + BatchNorm2D + ReLU + MaxPool2D(2,2)--> [Batch, 128, 4, 4]
│
├── Dropout2D (p = 0.25)
├── Düzleştirme (Flatten): 128 x 4 x 4 = 2048 özellik
│
├── Tam Bağlantılı (FC1): Linear(2048 -> 256) + ReLU
├── Dropout (p = 0.40)
└── Çıkış Katmanı (FC2): Linear(256 -> 39 Sınıf Lojiti)
```

---

## 5. Eğitim Parametreleri ve Başarım Metrikleri

* **Kayıp Fonksiyonu (Loss Function):** Çok sınıflı Çapraz Entropi (`CrossEntropyLoss`)
* **Optimizasyon Algoritması:** `AdamW` ($\text{lr} = 10^{-3}$, $\text{weight\_decay} = 10^{-4}$)
* **Öğrenme Oranı Takvimi:** `CosineAnnealingLR` ($T_{\max} = 8$)
* **Toplu Boyutu (Batch Size):** 64
* **Epoch Sayısı:** 8

### Epoch Başarım Tablosu

| Epoch | Eğitim Kaybı (Train Loss) | Eğitim Doğruluğu (Train Acc) | Doğrulama Kaybı (Val Loss) | Doğrulama Doğruluğu (Val Acc) |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 1.9142 | %44.79 | 0.3852 | %92.02 |
| 2 | 0.4210 | %87.13 | 0.1135 | %97.15 |
| 3 | 0.2077 | %93.53 | 0.0789 | %97.78 |
| 4 | 0.1315 | %96.02 | 0.0480 | %98.58 |
| 5 | 0.0890 | %97.45 | 0.0392 | %98.86 |
| 6 | 0.0612 | %98.24 | 0.0341 | %99.03 |
| 7 | 0.0458 | %98.79 | 0.0315 | %99.15 |
| 8 | 0.0382 | %99.01 | 0.0302 | **%99.20** |

*Sonuç:* Model 8 epoch sonunda **%99.20 Doğrulama Doğruluğuna** ulaşmış ve aşırı öğrenme (overfitting) yaşamadan genelleme yeteneği kazanmıştır.

---

## 6. Modelin ONNX Formatına Aktarımı ve Web Çıkarımı

Eğitilen PyTorch modeli (`bengu_net.pt`), tarayıcı ortamında doğrudan sunucusuz çalışabilmesi için **ONNX (Open Neural Network Exchange)** formatına aktarılmıştır (`public/model/bengu_net.onnx`).

* **Çalışma Şekli:** İstemci tarafında `onnxruntime-web` kütüphanesi ile WebAssembly (WASM) motoru üzerinde çalışır.
* **Gecikme (Latency):** Karakter başına çıkarım süresi $< 5\text{ ms}$.
* **Gizlilik:** Görüntü ve model çıkarımı %100 kullanıcının bilgisayarında gerçekleşir.

---

## 7. Göktürkçe Fonetik Dönüştürme Motoru

Sınıflandırılan harfler kelime haline getirildikten sonra kural tabanlı Türk fonetik motoruna girer:
1. Türkçe büyük/küçük harf normalizasyonu (`toLocaleLowerCase('tr-TR')`).
2. Kelime içi **ünlü uyumu (kalınlık/incelik)** analizi:
   * Kalın ünlüler (`A, I, O, U`) $\rightarrow$ Kalın Orhun işaretleri (ör. `T` $\rightarrow$ `𐱃`, `K` $\rightarrow$ `𐰴`, `B` $\rightarrow$ `𐰉`)
   * İnce ünlüler (`E, İ, Ö, Ü`) $\rightarrow$ İnce Orhun işaretleri (ör. `T` $\rightarrow$ `𐱅`, `K` $\rightarrow$ `𐰚` veya `𐰜`, `B` $\rightarrow$ `𐰋`)
3. Unicode Old Turkic bloğu (`U+10C00` – `U+10C4F`) ile sağdan sola (`RTL`) dizilerek çıktı üretilir.
