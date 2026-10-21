/**
 * Bengü Taş — Tesseract.js Çevrimdışı İstemcisi (FR-OCR)
 * %100 yerel varlıklarla (public/tesseract/) çalışır; hiçbir CDN veya dış sunucuya bağlanmaz.
 */

import { createWorker, Worker, PSM } from 'tesseract.js'
import { getAppRootUrl } from '../utils/url'

export { PSM }

export interface OcrProgressUpdate {
  status: string
  progress: number // 0 - 100
  message: string
}

export interface OcrResult {
  text: string
  confidence: number // 0 - 100
  lowConfidence: boolean
  words: {
    text: string
    confidence: number
  }[]
}

let cachedWorker: Worker | null = null
let isInitializing = false

/**
 * OCR çıktısını Türkçe kurallarına göre temizler ve normalize eder.
 */
export function cleanOcrText(raw: string): string {
  if (!raw) return ''

  let text = raw
    // Garip özel karakterleri ve OCR kalıntılarını ayıkla
    .replace(/[~`^_{|}[\]\\<>=+*#@$%]/g, '')
    // Harfler arasındaki tekil noktaları/tireleri kaldır (Ör. T.Ü.R.K -> TÜRK, T-E-N-G-R-I -> TENGRI)
    .replace(/([A-Za-zÇĞİÖŞÜçğıöşü])[\.\-_/]+(?=[A-Za-zÇĞİÖŞÜçğıöşü])/g, '$1')
    .replace(/([A-Za-zÇĞİÖŞÜçğıöşü])[\.\-_/]+(?=[A-Za-zÇĞİÖŞÜçğıöşü])/g, '$1')

  // Kelimeler içindeki rakam karışıklıklarını gider (örn. B1LGE -> BİLGE, T0RUN -> TORUN)
  text = text.split(/\s+/).map(word => {
    if (/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(word) && /\d/.test(word)) {
      return word
        .replace(/1/g, 'İ')
        .replace(/0/g, 'O')
        .replace(/5/g, 'S')
        .replace(/8/g, 'B')
    }
    return word
  }).join(' ')

  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
}

/**
 * Tesseract Worker'ı yerel varlıklarla başlatır (Lazy Singleton).
 */
export async function getOcrWorker(
  onProgress?: (update: OcrProgressUpdate) => void
): Promise<Worker> {
  if (cachedWorker) {
    return cachedWorker
  }

  if (isInitializing) {
    // Halihazırda başlatılıyorsa bekle
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100))
    }
    if (cachedWorker) return cachedWorker
  }

  isInitializing = true

  try {
    onProgress?.({
      status: 'loading',
      progress: 10,
      message: 'Okuma motoru ve Türkçe dil paketi hazırlanıyor...'
    })

    // Her barındırma ortamında (GitHub Pages alt klasörü, Vercel, localhost) hatasız mutlak yol
    const rootUrl = getAppRootUrl()

    const workerPath = `${rootUrl}tesseract/worker.min.js`
    const corePath = `${rootUrl}tesseract`
    const langPath = `${rootUrl}tesseract`

    const worker = await createWorker('tur', 1, {
      workerPath,
      corePath,
      langPath,
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.min(100, Math.round((m.progress || 0) * 100))
          onProgress?.({
            status: 'recognizing',
            progress: 30 + Math.floor(pct * 0.7),
            message: `Yazı taranıyor: %${pct}`
          })
        } else if (m.status === 'loading tesseract core') {
          onProgress?.({
            status: 'loading_core',
            progress: 25,
            message: 'WebAssembly çekirdeği yükleniyor...'
          })
        } else if (m.status === 'loading language traineddata') {
          onProgress?.({
            status: 'loading_lang',
            progress: 40,
            message: 'Türkçe dil verisi yükleniyor...'
          })
        }
      }
    })

    // El yazısı ve seyrek metin için en yüksek doğruluk parametreleri
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // SINGLE_BLOCK (Seyrek el yazısı için en stabil mod)
      tessedit_char_whitelist: 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789 ',
      preserve_interword_spaces: '1'
    })

    cachedWorker = worker
    return worker
  } finally {
    isInitializing = false
  }
}

/**
 * Görüntüyü OCR motoruna vererek Türkçe metni okur.
 */
export async function performOcr(
  imageSource: string | HTMLCanvasElement,
  onProgress?: (update: OcrProgressUpdate) => void,
  psmMode?: PSM
): Promise<OcrResult> {
  const worker = await getOcrWorker(onProgress)

  if (psmMode) {
    await worker.setParameters({
      tessedit_pageseg_mode: psmMode
    })
  }

  onProgress?.({
    status: 'recognizing',
    progress: 50,
    message: 'Yazı taranıyor ve harfler çözülüyor...'
  })

  const { data } = await worker.recognize(imageSource)

  const cleaned = cleanOcrText(data.text)
  const confidence = Math.round(data.confidence || 0)
  const lowConfidence = confidence < 65

  const words = (data.words || []).map(w => ({
    text: cleanOcrText(w.text),
    confidence: Math.round(w.confidence || 0)
  })).filter(w => w.text.length > 0)

  onProgress?.({
    status: 'done',
    progress: 100,
    message: 'Okuma tamamlandı.'
  })

  return {
    text: cleaned,
    confidence,
    lowConfidence,
    words
  }
}

/**
 * Sayfadan çıkıldığında veya ihtiyaç kalmadığında belleği serbest bırakır.
 */
export async function terminateOcrWorker(): Promise<void> {
  if (cachedWorker) {
    try {
      await cachedWorker.terminate()
    } catch (e) {
      console.warn('Worker termination warning:', e)
    }
    cachedWorker = null
  }
}
