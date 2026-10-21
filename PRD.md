# PRD — BENGÜ TAŞ
**Elinle yaz, atalarının yazısıyla oku.**

Sürüm: 1.0 · Tarih: 21.10.2026 · Dil: Türkçe (arayüz) · Maliyet hedefi: 0 TL (sunucusuz)

> "Bengü" = ebedî, sonsuz; "Taş" = yazıt taşı (Orhun Yazıtları'na verilen "Bengü Taş" adından esinlenilmiştir). Ad değiştirilebilir; kodda tek bir `APP_NAME` sabitinden okunmalıdır.

---

## 1. Özet

Bengü Taş, kullanıcının kamerayla gösterdiği (veya yüklediği) el yazısını / basılı Türkçe metni tarayıcı içinde okuyup (OCR), metni Göktürk (Orhun, Eski Türk) alfabesine çeviren **tamamen istemci taraflı** bir web uygulamasıdır. Sunucu, veritabanı, API anahtarı ve aylık ücret yoktur. Görüntü cihazdan dışarı çıkmaz.

Uygulama ayrıca Göktürk yazısı ve Türk devletleri hakkında bilgi veren, çocukların ve öğrencilerin keşfederek öğrenebileceği bir "Göktürkçe Hakkında" bölümü içerir.

## 2. Hedef Kitle

- Birincil: 8–16 yaş çocuklar ve öğrenciler (okul, kütüphane, ev).
- İkincil: Öğretmenler, Türk tarihi/kültürü meraklıları, sergi/etkinlik ziyaretçileri.
- Cihaz: Telefon (öncelikli), tablet, bilgisayar. Mobil Chrome/Safari, masaüstü Chrome/Edge/Firefox.

## 3. Hedefler ve Hedef Dışı

### Hedefler
1. Kameradan yazı → düzenlenebilir Türkçe metin → Göktürk yazısı akışı 10 saniyeden kısa sürede, 3 dokunuşta çalışmalı.
2. Sunucu gerektirmeyen statik site olarak ücretsiz barındırmada (Cloudflare Pages / Netlify / GitHub Pages / Vercel) yayınlanabilmeli.
3. İnternet bağlantısı olmadan (ilk yüklemeden sonra) çalışmalı (PWA).
4. Türk kültürünü temsil eden, çocuklara hitap eden, özgün ve şık bir tasarım.
5. Göktürk alfabesi hakkında doğru, kaynaklı ve anlaşılır bilgi sayfası.

### Hedef Dışı (v1'de yapılmayacak)
- Kullanıcı hesabı, giriş, veritabanı, sunucu tarafı işlem.
- Bulut OCR API'leri (ücretli/anahtar gerektirir).
- Metni Göktürk'ten Latin'e geri çevirme (v2 fikri).
- Taş yazıt fotoğrafından Göktürk işareti okuma (v2 fikri).

## 4. Temel Kullanıcı Akışı

1. Ana sayfa → **"Yazını Göster"** butonu.
2. Kamera izni istenir; arka kamera açılır, ekranda hizalama çerçevesi görünür.
3. Kullanıcı **"Yakala"**ya dokunur (alternatif: galeriden/dosyadan yükleme).
4. Görüntü ön işlemden geçer, OCR çalışır (ilerleme çubuğu).
5. Okunan Türkçe metin **düzenlenebilir kutuda** gösterilir (kullanıcı OCR hatalarını düzeltir).
6. Göktürk çıktısı canlı olarak altında/yanında güncellenir.
7. Kullanıcı: kopyala, PNG olarak indir, paylaş, yeniden çek.

Ek giriş yolu: **"Yazarak dene"** sekmesi (kamera olmadan metin yaz → Göktürk).

## 5. Fonksiyonel Gereksinimler

### 5.1 Kamera (FR-CAM)
- FR-CAM-1: `navigator.mediaDevices.getUserMedia` ile `facingMode: { ideal: "environment" }`, mümkünse 1280×720 veya üstü.
- FR-CAM-2: Ön/arka kamera değiştirme butonu.
- FR-CAM-3: Canlı önizleme üzerinde hizalama çerçevesi; çerçeve içi kırpılarak OCR'a verilir.
- FR-CAM-4: İzin reddedilirse anlaşılır Türkçe hata ve **dosya yükleme / `<input type="file" accept="image/*" capture="environment">` yedeği** sunulmalı.
- FR-CAM-5: Sayfadan çıkınca veya sekme gizlenince kamera akışı (`track.stop()`) mutlaka kapatılmalı.
- FR-CAM-6: Kamera yalnızca HTTPS veya localhost'ta çalışır; bu durum README'de belirtilmeli.
- FR-CAM-7: iOS Safari için `playsinline` ve `muted` zorunlu.

### 5.2 Görüntü Ön İşleme (FR-IMG)
Canvas üzerinde, istemci tarafında:
1. Çerçeve içini kırp, uzun kenarı en fazla ~1600 px'e ölçekle.
2. Gri tonlama.
3. Kontrast germe (histogram) ve adaptif eşikleme (Otsu veya Sauvola) ile siyah-beyaz.
4. İsteğe bağlı: küçük eğim düzeltme, gürültü temizleme.
5. Ön işleme önizlemesi gelişmiş ayar olarak gösterilebilir ("Okuma kalitesi").

### 5.3 OCR (FR-OCR)
- Motor: **Tesseract.js** (WebAssembly, tarayıcıda çalışır), dil: **`tur`** (Türkçe; ç ğ ı İ ö ş ü karakterleri desteklenmeli).
- **Dil verisi, çekirdek (core WASM) ve worker dosyaları CDN'den değil, projenin kendi `public/` klasöründen** servis edilmeli (çevrimdışı çalışma + üçüncü taraf bağımlılığı yok). `tessdata_fast` türü tercih edilir (küçük boyut).
- OCR bir **Web Worker** içinde çalışmalı; arayüz donmamalı. İlerleme yüzdesi gösterilmeli.
- Worker uygulama açılışında değil, ilk OCR isteğinde (lazy) yüklenmeli; yükleme sırasında "Okuma motoru hazırlanıyor" bilgisi verilmeli.
- Dürüst beklenti yönetimi: el yazısı tanıma tarayıcıda baskıdan zayıftır. Bu yüzden:
  - Çerçeve yanında ipucu: "Koyu kalemle, beyaz kâğıda, **büyük harflerle** ve net yaz."
  - Sonuç **her zaman düzenlenebilir** olmalı (FR-EDIT).
  - Düşük güven (confidence) durumunda uyarı: "Bazı harfleri emin okuyamadım, kontrol eder misin?" Düşük güvenli kelimeler vurgulanabilir.
- OCR çıktısı normalize edilmeli: gereksiz satır sonları, tekrar eden boşluklar, tanınamayan semboller temizlenmeli; Türkçe büyük/küçük harf dönüşümü `toLocaleLowerCase('tr-TR')` ile yapılmalı (I→ı, İ→i).

### 5.4 Düzenleme (FR-EDIT)
- OCR sonucu `textarea` içinde düzenlenebilir; her tuş vuruşunda (debounce ~150 ms) Göktürk çıktısı güncellenir.
- "Temizle" ve "Yeniden oku" butonları.

### 5.5 Göktürk Dönüştürme Motoru (FR-CONV)
Saf (pure) TypeScript fonksiyonu; arayüzden ve OCR'dan bağımsız, **birim testli** olmalı.

**Çıktı:** Unicode "Old Turkic" bloğu (**U+10C00–U+10C4F**) karakterleri.
**Font:** *Noto Sans Old Turkic* (SIL OFL lisanslı) projeye `woff2` olarak gömülür, `@font-face` ile yüklenir; sistem fontuna güvenilmez. Font yüklenemezse okunabilir uyarı gösterilir.

**Yazım yönü:** Orhun yazıtlarındaki gibi **sağdan sola** (varsayılan). Kullanıcı "Soldan sağa" seçeneğine geçebilir. Metin `dir="rtl"` ile gösterilir; PNG dışa aktarımı da aynı yönü korur.

**Kelime ayırıcı:** Yazıtlardaki gibi iki nokta (`:`) — Unicode karşılığı olarak U+205A (TWO DOT PUNCTUATION) tercih edilir, fontta yoksa `:` kullanılır. Ayarlardan "boşluk / iki nokta" seçilebilir.

**İki yazım modu (kullanıcı seçer):**
1. **Öğrenci Modu (varsayılan):** Tüm ünlüler yazılır. Öğrenmeyi ve okumayı kolaylaştırır.
2. **Orhun Usulü:** Yazıtlardaki gibi, bazı orta/son hecelerdeki ünlüler düşürülebilir (aşağıda "Kural Notu").

**Ünlü uyumuna göre işaret seçimi (kalın/ince):**
Göktürk alfabesinde bazı ünsüzlerin kalın ve ince ünlülü kelimeler için ayrı işaretleri vardır. Bir kelime işlenirken:
- Kelimedeki ünlüler **a, ı, o, u** ise → **kalın (back)** işaret serisi.
- Kelimedeki ünlüler **e, i, ö, ü** ise → **ince (front)** işaret serisi.
- Karışık ünlü içeren kelimelerde (alıntı/birleşik) ilk ünlüye göre karar verilir; kuralın sezgisel olduğu kodda yorumlanır.
- Kalın/ince çifti olan ünsüzler: **b, d, g, k, l, n, r, s, t, y** (ve k için kalın "q" biçimi). Çifti olmayan: **m, z, ç, ş, ŋ (ng)** vb.

**Eşleme tablosu (mantıksal düzey):**

| Latin (Türkçe) | Göktürk işareti (Unicode adı) |
|---|---|
| a, e (Öğrenci Modu) | ORKHON A (kalın: a / ince: e için de A kullanılır; ayrım ünlü uyumundan okunur) |
| ı, i | ORKHON I |
| o, u | ORKHON O |
| ö, ü | ORKHON OE |
| b | ORKHON AB (kalın) / ORKHON AEB (ince) |
| g (ğ dahil) | ORKHON AG (kalın) / ORKHON AEG (ince) |
| d | ORKHON AD (kalın) / ORKHON AED (ince) |
| z | ORKHON EZ |
| y | ORKHON AY (kalın) / ORKHON AEY (ince) |
| k | ORKHON AQ (kalın) / ORKHON AEK veya OEK (ince; ö-ü çevresinde OEK) |
| l | ORKHON AL (kalın) / ORKHON AEL (ince) |
| m | ORKHON EM |
| n | ORKHON AN (kalın) / ORKHON AEN (ince) |
| ç | ORKHON EC |
| ş | ORKHON ASH |
| s | ORKHON AS (kalın) / ORKHON AES (ince) |
| t | ORKHON AT (kalın) / ORKHON AET (ince) |
| r | ORKHON AR (kalın) / ORKHON AER (ince) |
| ng (ŋ) | ORKHON ENG |
| lt, nt, nç, ny (birleşik işaretler) | ORKHON ELT, ENT, ENC, ENY (Orhun Usulü'nde kullanılabilir) |
| h | Türkçede karşılığı yok; yakın ses (k/g) yerine yazılır, kullanıcıya not gösterilir |
| v, f, j, c, p | Orijinal alfabede yok; yakın sese eşlenir (v→b, f→p'ye yakın b, j→ş/z, c→ç/y vb.), arayüzde "yaklaşık çeviri" notu gösterilir |

> **ÖNEMLİ DOĞRULAMA ZORUNLULUĞU:** Yukarıdaki tablo **işaret adlarıyla** verilmiştir. Kod yazılırken her adın kod noktası **Unicode Old Turkic tablosundan (U+10C00–U+10C4F) birebir doğrulanmalı**, tahminle yazılmamalıdır. Her eşleme için birim test yazılmalı ve görsel olarak Noto Sans Old Turkic ile kontrol edilmelidir. Emin olunmayan işaret için tahmin yerine `// TODO: doğrula` notu bırakılmalı ve kullanıcıya raporlanmalıdır.

**Kural Notu (Orhun Usulü):** Orijinal yazıtlarda yazım standardı tek değildir; yazıt, dönem ve yazıcıya göre değişir. Bu yüzden Orhun Usulü "eğitsel yaklaşım"dır, akademik transkripsiyon iddiası taşımaz. Arayüzde bu not kısaca belirtilmelidir.

**Referans test örnekleri (kabul testinde kullanılacak):**
- "Tengri / Tanrı" kelimesi Eski Türkçe yazımıyla *teŋri* → t(ince) + ng + r(ince) + i.
- "Türk" → t(ince) + ö/ü + r(ince) + k(ince).
- Türkçe büyük-küçük harf: "IŞIK" → "ışık", "İSTANBUL" → "istanbul" doğru dönüşmeli.
- Sayılar, noktalama ve tanımsız karakterler: sayılar olduğu gibi (Latin rakam) bırakılır, noktalama basit eşlenir veya atlanır, çökme olmaz.

### 5.6 Çıktı İşlemleri (FR-OUT)
- Göktürk metnini **kopyala** (Clipboard API, yedek: seçim).
- **PNG indir:** Canvas'a çizilmiş, bordo/altın çerçeveli "yazıt" görünümlü görsel; altında küçük Latin metin ve uygulama adı/filigranı.
- **Paylaş:** Web Share API varsa görsel + metin paylaşımı.
- Çıktıların hiçbiri sunucuya gönderilmez.

### 5.7 Sayfalar ve Gezinme (FR-NAV)
Statik barındırmada 404 sorunu yaşamamak için **HashRouter** (`/#/rota`) veya statik çok sayfalı yapı kullanılmalı.

1. **Ana Sayfa (`/`)**: Hero (slogan, "Yazını Göster" CTA), nasıl çalışır (3 adım), Türk devletleri şeridi, kısa Göktürk tanıtımı.
2. **Çevirmen (`/cevir`)**: Kamera / yükleme / yazarak giriş, sonuç alanı.
3. **Göktürkçe Hakkında (`/hakkinda`)**: Aşağıdaki içerik bölümleri.
4. **Alfabe (`/alfabe`)**: Etkileşimli işaret tablosu (işarete dokun → Latin karşılığı, kalın/ince bilgisi, telaffuz notu). Basit "Bu harfi bul" mini sınamasi (opsiyonel).
5. **Türk Devletleri (`/devletler`)**: Zaman çizgisi.
6. **Gizlilik & Sürüm (`/gizlilik`)**: "Görüntülerin cihazdan çıkmaz" bilgisi, kullanılan açık kaynak lisansları (Tesseract.js – Apache 2.0, Noto Sans Old Turkic – OFL).

### 5.8 "Göktürkçe Hakkında" İçerik Gereksinimleri
Çocuğa uygun, sade, kısa paragraflar ve görseller; içerik `content/` altında JSON/Markdown olarak tutulur (kolay düzenlenir). Başlıklar:
1. **Göktürk yazısı nedir?** — Eski Türk yazısı, Orhun alfabesi; yaklaşık 38 işaretlik, çoğunlukla sağdan sola yazılan bir yazı sistemi.
2. **Orhun Yazıtları** — Kül Tigin (MS 732) ve Bilge Kağan (MS 735) yazıtları, Tonyukuk yazıtı; Moğolistan'daki Orhun Vadisi.
3. **Nasıl çözüldü?** — 1893'te Danimarkalı dilbilimci Vilhelm Thomsen tarafından çözüldü (anlatım sade tutulur).
4. **Ünlü uyumu ve kalın/ince işaretler** — Uygulamanın neden iki çeşit işaret kullandığını anlatan kısa, görselli açıklama.
5. **İlk Türkçe metinler / ünlü sözler** — Kısa alıntı niteliğinde, kaynak belirtilmiş, telif sorunu olmayacak (kamu malı çeviriler veya özgün anlatım); uzun metin kopyalanmaz.
6. **Türk devletleri ve yazı** — Hun'dan Osmanlı'ya Türk devletlerine kısa geçiş (bkz. 5.9).
7. **Kaynakça** — Güvenilir kaynaklar (TDK, Türk Tarih Kurumu, UNESCO, üniversite yayınları, Wikipedia gibi genel referans bağlantıları). Tarih ve rakamlar yayınlanmadan önce insan tarafından doğrulanmalıdır; içerikte "Bilgiler eğitim amaçlıdır" notu bulunmalıdır.

### 5.9 Türk Devletleri Temsili
- Zaman çizgisi bileşeni; veri `content/states.json` dosyasında (ad, yaklaşık dönem, bölge, kısa 1–2 cümlelik açıklama, sembol).
- Tarihî tartışmalı noktalarda (hangi devletin listeye girdiği, kesin tarihler) kesin hüküm cümlesi kurulmaz; "yaklaşık" ifadesi kullanılır, liste kolayca değiştirilebilir. **Yayından önce içerik tarihçi/öğretmen tarafından gözden geçirilmelidir.**
- Görsel temsil: stilize güneş, bozkurt silueti, tamga/geometrik motifler, 16 köşeli yıldız gibi **özgün (kendi çizdiğin) SVG** motifler. Telifli resim, logo ve bayrak görselleri doğrudan kopyalanmaz; kullanılacak her görsel ya kamu malı, ya CC0 ya da kod ile üretilmiş SVG olmalıdır.

## 6. Tasarım ve Marka

- **Ad:** Bengü Taş · **Slogan:** "Elinle yaz, atalarının yazısıyla oku."
- **Duygu:** Bozkırın genişliği, gökyüzü, destansı ama çocuk dostu; bir yazıt/kitabe estetiği.
- **Renk paleti (öneri, CSS değişkeni):**
  - Gök Mavisi `#1F4E79` / açık ton `#4A90C2`
  - Kızıl / Bordo `#9E1B1B`
  - Altın / Sarı `#D4A017`
  - Taş / Kum `#F3E9D2`
  - Koyu Zemin `#0E1B2B`
- **Tipografi:** Başlıkta karakterli bir serif/display font (ör. *Cinzel*, *Cormorant*, *Alegreya SC*; Türkçe karakter desteği doğrulanmalı), gövdede okunaklı sans (*Inter*, *Nunito*). Göktürk işaretleri için Noto Sans Old Turkic. Tüm fontlar **self-host** edilir (Google Fonts CDN'ine bağımlılık olmaz).
- **Motifler:** Güneş/kurt/tamga SVG'leri, yazıt taşı dokusu (CSS gradient/SVG noise ile, görsel dosyasız), sınır süsleri (geometrik Türk bezemeleri).
- **Koyu/açık tema** desteği; varsayılan koyu gök teması.
- **Hareket:** Yumuşak geçişler, sonuç belirirken harflerin tek tek "yazılma" animasyonu; `prefers-reduced-motion` saygı görmeli.
- **Mobil öncelikli**, dokunma hedefleri ≥ 44 px.
- **Erişilebilirlik:** WCAG AA kontrast, klavye gezinmesi, anlamlı `aria-label`, Göktürk çıktısına ekran okuyucu için Latin metin `aria-label`/gizli etiket.
- **Dil:** Tüm arayüz Türkçe. İçerik sade, çocuk dilinde; İngilizce arayüz v2.

## 7. Teknik Mimari

### 7.1 Yığın (stack)
- **Vite + React + TypeScript**, **Tailwind CSS**, **React Router (HashRouter)**.
- **Tesseract.js** (self-host edilmiş worker/core/lang verisi).
- **vite-plugin-pwa** (Service Worker, manifest, çevrimdışı önbellek; OCR dil verisi ve font önbelleğe alınır).
- Test: **Vitest** (dönüştürme motoru birim testleri), isteğe bağlı Playwright duman testi.
- Sunucu, backend, veritabanı, ortam değişkeni anahtarı **yoktur**.

### 7.2 Klasör Yapısı (öneri)
```
bengu-tas/
├─ public/
│  ├─ tesseract/ (worker.min.js, tesseract-core*.wasm(.js), tur.traineddata.gz)
│  ├─ fonts/ (NotoSansOldTurkic.woff2, başlık/gövde fontları)
│  ├─ icons/ (PWA ikonları)
│  └─ og-image.png
├─ src/
│  ├─ components/ (CameraCapture, CropFrame, OcrPanel, GokturkOutput, ...)
│  ├─ pages/ (Home, Translate, About, Alphabet, States, Privacy)
│  ├─ lib/
│  │  ├─ gokturk/ (mapping.ts, convert.ts, harmony.ts, convert.test.ts)
│  │  ├─ ocr/ (worker.ts, preprocess.ts)
│  │  └─ export/ (png.ts, share.ts)
│  ├─ content/ (about.md|json, states.json, alphabet.json)
│  └─ styles/
├─ README.md
└─ vite.config.ts
```

### 7.3 Performans Hedefleri
- İlk yükleme (OCR hariç) 3G hızında ≤ 4 sn; ana paket (JS) ≤ ~250 KB gzip (OCR/worker/dil verisi lazy).
- Lighthouse (mobil): Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90, PWA kurulabilir.
- OCR süresi (orta seviye telefon, 1–3 satır): hedef ≤ 8 sn.

### 7.4 Gizlilik ve Güvenlik
- Görüntüler ve metin **hiçbir sunucuya gönderilmez**, analitik/izleme çerezi yoktur (veya yalnızca çerezsiz, gizlilik dostu, isteğe bağlı sayaç).
- Kamera akışı sayfa dışında asla açık kalmaz.
- Üçüncü taraf script/CDN kullanılmaz.
- CSP başlığı önerisi `_headers` dosyasıyla (Cloudflare/Netlify) eklenir: `default-src 'self'; img-src 'self' data: blob:; worker-src 'self' blob:; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; media-src 'self' blob:`.
- Çocuklara yönelik olduğundan kişisel veri toplanmaz; bu açıkça Gizlilik sayfasında yazılır.

## 8. Yayına Alma (0 TL, sunucusuz)

Üretim çıktısı `npm run build` ile **statik `dist/` klasörü**dür. Aşağıdakilerden biri yeterlidir:
1. **Cloudflare Pages** (önerilen: sınırsız bant genişliği, ücretsiz, HTTPS otomatik).
2. **Netlify** (ücretsiz plan, sürükle-bırak yayın).
3. **GitHub Pages** (`vite.config.ts` içinde `base` ayarı ve HashRouter ile).
4. **Vercel** (Hobby plan).

HTTPS zorunludur (kamera için); bu hizmetlerin hepsi otomatik sağlar. Özel alan adı sonradan eklenebilir. Render gibi çalışan sunucu (web service) **gerekmez**; yalnızca statik site yeterlidir.

README'de her biri için adım adım "yayına alma" bölümü bulunmalıdır.

### 8.1 GitHub Hesabı ve Proje Adlandırma

**Adlandırma:**
- Uygulama adı: **Bengü Taş**
- GitHub repo adı: **`bengu-tas`** (küçük harf, Türkçe karaktersiz, tire ile)
- `package.json` adı: `bengu-tas`
- Repo açıklaması: "Elinle yaz, atalarının yazısıyla oku — el yazısını Göktürk alfabesine çeviren, sunucusuz web uygulaması."
- Repo konuları (topics): `gokturk`, `old-turkic`, `ocr`, `tesseract-js`, `pwa`, `turkish`, `education`
- Lisans: kod için **MIT**; Noto Sans Old Turkic için OFL, Tesseract.js için Apache-2.0 notları `LICENSE` ve Gizlilik sayfasında belirtilir.

**Kullanıcının (senin) yapacağı adımlar** (bunlar bir yapay zekâ tarafından yapılamaz, hesap sahibi olarak sen yapmalısın):
1. https://github.com adresinde ücretsiz hesap aç (e-posta doğrulaması dahil). Kullanıcı adı önerisi: `bengutas`, `bengu-tas` veya şahsi adın.
2. Hesapta **boş** bir repo oluştur: ad `bengu-tas`, README/lisans/gitignore **ekleme** (proje bunları kendisi üretecek).
3. Bilgisayarında Git kurulu olsun ve GitHub'a giriş yap (GitHub Desktop veya `gh auth login`).

**Projenin (Anti-gravity'nin) yapacağı adımlar:**
- `git init`, uygun `.gitignore` (`node_modules`, `dist`, `.env`, `.DS_Store`), anlamlı ilk commit: `feat: Bengü Taş ilk sürüm`.
- Uzak depo hazır olduğunda: `git remote add origin https://github.com/<KULLANICI_ADI>/bengu-tas.git`, `git branch -M main`, `git push -u origin main`.
- `README.md` başlığı, rozetler (build, lisans) ve canlı site bağlantısı yer tutucusu.
- Cloudflare Pages / Netlify / Vercel'e GitHub reposundan otomatik dağıtım için adımlar README'de yazılır (her `main` push'unda otomatik yayın). GitHub Pages seçilirse `.github/workflows/deploy.yml` ile otomatik dağıtım iş akışı eklenir.
- Hiçbir token, parola veya anahtar koda, commit'e veya README'ye yazılmaz.

## 9. Kabul Kriterleri (Definition of Done)

1. `npm install && npm run dev` komutlarıyla yerelde açılıyor; `npm run build` hatasız statik çıktı üretiyor, `npm run preview` ile çalışıyor.
2. Telefon ve masaüstü tarayıcıda kamera açılıyor; izin reddedilince yükleme yedeği çalışıyor.
3. Beyaz kâğıda büyük harflerle yazılmış kısa bir Türkçe kelime/cümle (ör. "TÜRK", "GÖK TENGRİ") makul oranda okunuyor ve düzenlenebiliyor.
4. Dönüştürme motoru testleri geçiyor (en az: tüm harfler, ünlü uyumu, Türkçe I/İ, bilinmeyen karakterler, boş giriş, çok uzun metin).
5. Çıktı Noto Sans Old Turkic ile doğru sağdan sola gösteriliyor; yazım modu ve yön değiştirilebiliyor.
6. PNG indirme ve kopyalama çalışıyor.
7. Çevrimdışı (uçak modu) ilk ziyaretten sonra uygulama açılıyor, OCR dahil çalışıyor.
8. "Hakkında", "Alfabe", "Türk Devletleri", "Gizlilik" sayfaları dolu, görsel olarak tutarlı ve mobilde sorunsuz.
9. Konsolda hata yok, harici ağ isteği yok (yalnızca kendi alan adı).
10. README: kurulum, geliştirme, yayına alma, içerik düzenleme, ad değiştirme, bilinen sınırlamalar.

## 10. Riskler ve Önlemler

| Risk | Önlem |
|---|---|
| El yazısı OCR doğruluğu düşük (özellikle bitişik yazı) | Ön işleme, "büyük harfle yaz" ipucu, düzenlenebilir sonuç, güven uyarısı; v2'de TrOCR/transformers.js (WebGPU) denemesi |
| Unicode kod noktası / eşleme hatası | Kod noktaları resmî tablodan doğrulanır, birim test + görsel kontrol |
| iOS Safari kamera/PWA kısıtları | `playsinline`, dosya yükleme yedeği, gerçek cihazda test |
| Büyük dil verisi / WASM boyutu | `tessdata_fast`, lazy yükleme, Service Worker önbelleği |
| Tarihî içerikte yanlış bilgi | Kaynakça, "yaklaşık" ifadeleri, yayından önce insan gözden geçirmesi |
| Telif (görsel/yazı tipi/metin) | Yalnızca özgün SVG, OFL/CC0 kaynaklar, uzun alıntı yok |
| Göktürk yazım kuralları yazıta göre değişir | "Eğitsel yaklaşım" notu, iki mod |

## 11. Gelecek Sürümler (v2+)

- Göktürk → Latin çeviri; Göktürk klavyesi.
- Yazıt fotoğrafından işaret tanıma.
- Mini oyunlar: "Adını yaz", "Kelime avı", sertifika/rozet sistemi.
- Öğretmen modu: sınıf için baskıya hazır çalışma yaprağı (PDF).
- Diğer eski Türk yazıları (Uygur, Yenisey varyantları) ve İngilizce arayüz.
- Gelişmiş tarayıcı içi el yazısı modeli (ONNX/WebGPU).
