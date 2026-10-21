# 🏛️ Bengü Taş

> **«Elinle yaz, atalarının yazısıyla oku.»**

[![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-Offline-D4A017)](https://tesseract.projectnaptha.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Çevrimdışı_Hazır-0E1B2B)](#-pwa-ve-çevrimdışı-destek)

Bengü Taş, kâğıda yazdığınız el yazısı veya basılı Türkçe metinleri web kameranız aracılığıyla doğrudan tarayıcı içinde okuyup (**OCR**) anında **Göktürk (Orhun) alfabesine** çeviren, tamamen istemci taraflı (sunucusuz), modern ve eğitsel bir web uygulamasıdır.

Çocuklar, öğrenciler ve Türk tarihine ilgi duyan herkes için tasarlanmıştır.

---

## ✨ Temel Özellikler

- **🔒 %100 Cihaz İçi ve Gizli (Sıfır Sunucu):** Kamera görüntüleriniz ve yazdığınız metinler asla bir sunucuya gitmez; tüm OCR ve dönüştürme işlemleri tarayıcınızın belleğinde (WebAssembly) çalışır.
- **📸 Akıllı Kamera ve Kılavuz Çerçeve:** Arka kamera öncelikli tarama, ön/arka kamera değişimi, hizalama çerçevesi ve kamera erişimi olmayan durumlar için dosya yükleme yedeği.
- **⚡ Tesseract.js Yerel OCR:** Türkçe (`tur`) dil paketi, Web Worker mimarisi ve lazy yükleme ile donmayan akıcı arayüz.
- **✍️ Saf Göktürk Dönüştürme Motoru:**
  - Resmi **Unicode Old Turkic** bloğu (`U+10C00` – `U+10C4F`) ve *Noto Sans Old Turkic* yazı tipi.
  - **Ünlü Uyumu Analizi:** Kalın heceler için kalın işaretler (`a, ı, o, u`), ince heceler için ince işaretler (`e, i, ö, ü`).
  - **İki Yazım Modu:** *Öğrenci Modu* (tüm sesler gösterilir) ve *Orhun Usulü* (orta hece ünlü düşmesi ve `lt, nt, nç, ny` birleşik işaretleri).
  - **Yön Seçimi:** Orhun yazıtlarındaki gibi Sağdan Sola (**RTL**) veya Soldan Sağa (**LTR**).
- **🎨 Bozkır ve Yazıt Estetiği:** Gök mavisi (`#1F4E79`), kızıl/bordo (`#9E1B1B`), altın sarısı (`#D4A017`) ve taş dokusu ile harmanlanmış şık kitabe görünümü.
- **📜 Yazıt Görünümlü PNG İndirme:** Çeviriyi taş kitabe hatıra kartı olarak dışa aktarma, panoya kopyalama ve Web Share API ile paylaşma.
- **📚 Zengin Kültür Bölümleri:**
  - *Göktürkçe Hakkında:* Orhun Yazıtları, Vilhelm Thomsen'in 1893 keşfi, ünlü uyumu görsel şeması ve kaynakça.
  - *Alfabe Tablosu:* 38 işaretlik interaktif harf kartları ve eğlenceli "Bu Harfi Bul!" mini oyunu.
  - *Türk Devletleri:* Hunlardan günümüze interaktif tarih şeridi.

---

## 🚀 Kurulum ve Yerel Çalıştırma

Bilgisayarınızda Node.js (v18+) kurulu olmalıdır.

```bash
# 1. Proje dizinine gidin
cd "c:/Users/HP/Desktop/Bengü Taş"

# 2. Bağımlılıkları yükleyin
npm install

# 3. Birim testleri çalıştırın
npm run test

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Geliştirici sunucusu başladıktan sonra tarayıcınızda `http://localhost:3000` adresini açarak uygulamayı test edebilirsiniz.

---

## 🧪 Birim Testler ve Doğrulama

Dönüştürme motorunun fonetik kuralları, ünlü uyumu, Türkçe `I/İ` dönüşümü ve resmi Unicode kod noktaları Vitest ile otomatik test edilir:

```bash
npm run test
```

Test kapsamı:
- Unicode Old Turkic bloğu aralık kontrolü (`U+10C00` – `U+10C4F`)
- Referans kelimeler: `Türk` (`𐱅𐰇𐰼𐰜`), `Tengri` (`𐱅𐰀𐰭𐰼𐰃`)
- Kalın/ince ünsüz ayrımı: `Taş` (`𐱃𐰀𐰿`) vs `Tek` (`𐱅𐰀𐰚`)
- Birleşik işaretler: `ant` (`𐰀𐰦`), `alt` (`𐰀𐰡`)
- Sayılar, noktalama ve boşluk toleransı

---

## 📦 Üretim Derlemesi (Build)

Uygulama statik çıktısını `dist/` klasörüne oluşturmak için:

```bash
npm run build
npm run preview
```

---

## 🌐 GitHub'a Yükleme

GitHub reposunu oluşturmak kullanıcı hesabına aittir. Boş bir depo oluşturduktan sonra aşağıdaki adımları terminalde çalıştırınız:

```bash
# 1. Uzak depoyu bağlayın (<KULLANICI_ADI> yerine kendi GitHub kullanıcı adınızı yazın)
git remote add origin https://github.com/<KULLANICI_ADI>/bengu-tas.git

# 2. Ana dalı main yapın
git branch -M main

# 3. Kodları GitHub'a gönderin
git push -u origin main
```

---

## ☁️ Ücretsiz Yayına Alma (0 TL, Sunucusuz)

Bengü Taş tamamen istemci taraflı statik bir site olduğu için hiçbir sunucu veya veritabanı maliyeti gerektirmez.

### 1. Cloudflare Pages (Önerilen)
1. [Cloudflare Dashboard](https://dash.cloudflare.com/)'a ücretsiz giriş yapın.
2. **Workers & Pages** > **Create application** > **Pages** sekmesine gelin.
3. **Connect to Git** seçeneğiyle `bengu-tas` reposunu seçin.
4. Yapılandırma ayarları:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Save and Deploy** butonuna tıklayın. Siteniz saniyeler içinde HTTPS ile yayına girer.

### 2. GitHub Pages (Otomatik İş Akışı)
Projede `.github/workflows/deploy.yml` dosyası hazırdır:
1. GitHub reponuzda **Settings** > **Pages** menüsüne gidin.
2. **Build and deployment** > **Source** alanında **GitHub Actions** seçeneğini seçin.
3. Kodu her `main` dalına push ettiğinizde otomatik olarak derlenip yayınlanacaktır.

### 3. Netlify
1. [Netlify](https://www.netlify.com/)'e giriş yapıp **Add new site** > **Import an existing project** deyin.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Dağıtıma başlayın.

### 4. Vercel
1. [Vercel](https://vercel.com/)'e giriş yapıp **Add New...** > **Project** diyerek repoyu içe aktarın.
2. Otomatik Vite şablonu tanınacaktır, **Deploy** butonuna basın.

---

## 📁 Proje Dosya Ağacı

```
bengu-tas/
├─ .github/workflows/deploy.yml      # GitHub Pages otomatik dağıtım iş akışı
├─ public/
│  ├─ fonts/
│  │  └─ NotoSansOldTurkic.woff2     # Self-host Göktürk yazı tipi
│  ├─ icons/                         # PWA ikonları (SVG, PNG)
│  ├─ tesseract/                     # Çevrimdışı OCR dosyaları (worker, core WASM, tur.traineddata)
│  ├─ _headers                       # Cloudflare/Netlify CSP güvenlik başlıkları
│  └─ favicon.ico
├─ src/
│  ├─ components/
│  │  ├─ camera/CameraCapture.tsx    # Kamera akışı, kılavuz ve dosya yükleme yedeği
│  │  ├─ common/StoneCard.tsx        # Yazıt taşı kart bileşeni
│  │  ├─ layout/Navbar.tsx & Footer.tsx
│  │  ├─ motifs/TurkishMotifs.tsx    # Özgün SVG Türk motifleri (Bozkurt, Güneş, Tamga)
│  │  └─ translator/
│  │     ├─ GokturkOutput.tsx        # Canlı Göktürkçe çıktı ve PNG indirme
│  │     └─ OcrPanel.tsx             # Metin düzenleme ve OCR ilerleme paneli
│  ├─ content/
│  │  ├─ about.json                  # Göktürk tarihi, yazıtlar ve kaynakça
│  │  ├─ alphabet.json               # 38 işaretlik harf veri tabanı
│  │  └─ states.json                 # Türk devletleri zaman çizelgesi verisi
│  ├─ lib/
│  │  ├─ export/png.ts & share.ts    # Canvas tabanlı yazıt kartı ve Web Share API
│  │  ├─ gokturk/
│  │  │  ├─ convert.ts & convert.test.ts # Göktürk dönüştürme motoru & testler
│  │  │  ├─ harmony.ts               # Ünlü uyumu ve fonetik çözümleyici
│  │  │  └─ mapping.ts               # Unicode Old Turkic resmi eşleme tablosu
│  │  └─ ocr/
│  │     ├─ preprocess.ts            # Kırpma, gri tonlama, kontrast ve Otsu binarization
│  │     └─ tesseract-client.ts      # %100 yerel Tesseract.js Web Worker sarmalayıcısı
│  ├─ pages/
│  │  ├─ Home.tsx                    # Ana sayfa
│  │  ├─ Translate.tsx               # Çevirmen stüdyosu
│  │  ├─ About.tsx                   # Göktürkçe hakkında
│  │  ├─ Alphabet.tsx                # İnteraktif alfabe & mini oyun
│  │  ├─ States.tsx                  # Türk devletleri zaman çizelgesi
│  │  └─ Privacy.tsx                 # Gizlilik ve açık kaynak lisansları
│  ├─ App.tsx & main.tsx
│  └─ index.css
├─ index.html
├─ LICENSE
├─ package.json
├─ tailwind.config.js
└─ vite.config.ts
```

---

## 📝 İçerik Düzenleme Rehberi

Projedeki tarihsel ve kültürel metinler koddan bağımsız olarak JSON dosyalarında tutulur:
- **Tarih & Yazıt Bilgileri:** `src/content/about.json` dosyasından düzenlenebilir.
- **Türk Devletleri Listesi:** `src/content/states.json` dosyasından yeni devlet eklenebilir veya dönemler güncellenebilir.
- **Harf Tablosu:** `src/content/alphabet.json` dosyasından harf ipuçları ve örnek kelimeler güncellenebilir.

---

## ⚠️ Bilinen Sınırlamalar ve Tavsiyeler

1. **El Yazısı OCR Başarımı:** Tarayıcı içinde çalışan Tesseract.js, basılı metinlerde çok yüksek başarı gösterirken el yazısında karakter ayrımında zorlanabilir. Bu nedenle ekranda kullanıcının el yazısını anında düzeltebileceği **düzenleme kutusu** bulunmaktadır.
2. **Fotoğraf Kalitesi Tavsiyesi:** Koyu renkli tükenmez veya keçeli kalemle, beyaz kâğıda, **BÜYÜK HARFLERLE** ve kelimeler arasında belirgin boşluk bırakılarak yazıldığında en yüksek doğruluk elde edilir.
3. **Kamera İzni:** Tarayıcı güvenlik kuralları gereği kamera yalnızca `HTTPS` protokolü veya `localhost` üzerinde çalışır. İzin verilmeyen durumlarda dosya yükleme seçeneği otomatik devreye girer.

---

## 📜 Lisans

- Uygulama Kodu: **MIT License** — Telif Hakkı (c) 2026 Bengü Taş Projesi.
- Yazı Tipi: **Noto Sans Old Turkic** — SIL Open Font License 1.1.
- OCR Motoru: **Tesseract.js** — Apache License 2.0.
