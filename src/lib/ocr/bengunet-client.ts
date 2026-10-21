/**
 * BengüNet — Özel Eğitilmiş PyTorch CNN Modeli ONNX Web Çıkarım Motoru
 * Görüntü İşleme Tabanlı Karakter Segmentasyonu + Derin Öğrenme Sınıflandırması
 */

import * as ort from 'onnxruntime-web'
import { getAppRootUrl } from '../utils/url'

export interface CharacterBox {
  x: number
  y: number
  w: number
  h: number
  tensorData: Float32Array // 1 x 32 x 32
}

export interface BenguNetPrediction {
  text: string
  confidence: number
  charCount: number
}

// Türkçe 39 Sınıf
export const BENGUNET_CLASSES = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

let cachedSession: ort.InferenceSession | null = null

/**
 * ONNX Oturumunu Başlatır (Lazy Singleton)
 */
export async function getBenguNetSession(): Promise<ort.InferenceSession> {
  if (cachedSession) return cachedSession

  // Her barındırma ortamında (GitHub Pages alt klasörü, Vercel, localhost) hatasız mutlak yol
  const rootUrl = getAppRootUrl()

  const modelUrl = `${rootUrl}model/bengu_net.onnx`

  // Yerel WASM motoru (CDN bağımlılığı yok)
  ort.env.wasm.wasmPaths = `${rootUrl}ort/`
  ort.env.wasm.numThreads = 1

  // WebAssembly tabanlı yüksek performanslı yürütme
  cachedSession = await ort.InferenceSession.create(modelUrl, {
    executionProviders: ['wasm']
  })

  return cachedSession
}

/**
 * GÖRÜNTÜ İŞLEME ADIMI: Harf Segmentasyonu (Connected Component / Projection)
 * Kâğıttaki yazıyı siyah-beyaz ikili matriste tarar ve bağımsız harf kutularını çıkarır.
 */
export function segmentCharacters(canvas: HTMLCanvasElement): CharacterBox[] {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  const width = canvas.width
  const height = canvas.height
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  // Adaptif mürekkep eşiği (Işık değişimlerini telafi eder)
  let sumL = 0
  let sampleCount = 0
  for (let i = 0; i < data.length; i += 16) {
    sumL += data[i]
    sampleCount++
  }
  const avgBrightness = sampleCount > 0 ? sumL / sampleCount : 128
  // Yazı pikselleri ortalama parlaklığın %70'inden daha koyu olmalıdır
  const inkThreshold = Math.min(140, Math.max(60, Math.floor(avgBrightness * 0.72)))

  // 1. Dikey Projeksiyon Profili (Vertical Projection Profile)
  const verticalProjection = new Array(width).fill(0)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4
      if (data[idx] < inkThreshold) {
        verticalProjection[x]++
      }
    }
  }

  // 2. Harf Sütun Aralıklarını (Segments) Tespit Et
  const segments: { startX: number; endX: number }[] = []
  let inChar = false
  let startX = 0
  const noiseThreshold = Math.max(2, Math.floor(height * 0.015))

  for (let x = 0; x < width; x++) {
    if (verticalProjection[x] > noiseThreshold) {
      if (!inChar) {
        inChar = true
        startX = x
      }
    } else {
      if (inChar) {
        inChar = false
        const segWidth = x - startX
        // Çok geniş (tüm sayfa/kenarlık) veya çok dar (gürültü) alanları filtrele
        if (segWidth >= 4 && segWidth < width * 0.5) {
          segments.push({ startX, endX: x })
        }
      }
    }
  }

  if (inChar) {
    const segWidth = width - startX
    if (segWidth >= 4 && segWidth < width * 0.5) {
      segments.push({ startX, endX: width })
    }
  }

  // 3. Her segment için dikey (y) sınırları bul ve 32x32 tensör üret
  const charBoxes: CharacterBox[] = []

  for (const seg of segments) {
    let minY = height
    let maxY = 0

    for (let y = 0; y < height; y++) {
      for (let x = seg.startX; x < seg.endX; x++) {
        const idx = (y * width + x) * 4
        if (data[idx] < 128) {
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }

    if (maxY <= minY || maxY - minY < 4) continue // Boş veya gürültü

    const charW = seg.endX - seg.startX
    const charH = maxY - minY + 1

    // 32x32 Normalize Karakter Tensörü Üret
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 32
    tempCanvas.height = 32
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) continue

    // Siyah zemin
    tempCtx.fillStyle = '#000000'
    tempCtx.fillRect(0, 0, 32, 32)

    // En-boy oranını koruyarak 32x32 içine ortala
    const maxSide = Math.max(charW, charH)
    const scale = 24 / maxSide // 24 piksele sığdır, kenarlarda 4 piksel boşluk
    const drawW = charW * scale
    const drawH = charH * scale
    const destX = (32 - drawW) / 2
    const destY = (32 - drawH) / 2

    // Karakteri çiz
    tempCtx.drawImage(
      canvas,
      seg.startX, minY, charW, charH,
      destX, destY, drawW, drawH
    )

    // 32x32 Gri Tonlama Float32Array verisi (0..1)
    const charData = tempCtx.getImageData(0, 0, 32, 32).data
    const floatArr = new Float32Array(32 * 32)
    for (let i = 0; i < 32 * 32; i++) {
      // Orijinalde yazı siyah zemin beyazdı, model için zemin siyah yazı beyaz (MNIST standardı)
      const r = charData[i * 4]
      floatArr[i] = (255 - r) / 255.0
    }

    charBoxes.push({
      x: seg.startX,
      y: minY,
      w: charW,
      h: charH,
      tensorData: floatArr
    })
  }

  return charBoxes
}

/**
 * Segmentlere Ayrılmış Karakterleri BengüNet ONNX Modeli ile Tahmin Eder
 */
export async function runBenguNetOcr(canvas: HTMLCanvasElement): Promise<BenguNetPrediction> {
  const session = await getBenguNetSession()
  const charBoxes = segmentCharacters(canvas)

  if (charBoxes.length === 0) {
    return { text: '', confidence: 0, charCount: 0 }
  }

  let fullText = ''
  let totalConfidence = 0

  // Ortalama karakter genişliği (Kelime boşluklarını tespit etmek için)
  const avgWidth = charBoxes.reduce((acc, c) => acc + c.w, 0) / charBoxes.length

  for (let i = 0; i < charBoxes.length; i++) {
    const box = charBoxes[i]

    // Önceki harfle aradaki boşluk fazlaysa kelime boşluğu (' ') ekle
    if (i > 0) {
      const prevBox = charBoxes[i - 1]
      const gap = box.x - (prevBox.x + prevBox.w)
      if (gap > avgWidth * 0.9) {
        fullText += ' '
      }
    }

    // ONNX Tensor oluştur: shape = [1, 1, 32, 32]
    const tensor = new ort.Tensor('float32', box.tensorData, [1, 1, 32, 32])
    const feeds = { input: tensor }
    const results = await session.run(feeds)
    const output = results.output.data as Float32Array

    // Softmax ve Argmax ile en yüksek olasılıklı sınıfı bul
    let maxVal = -Infinity
    let maxIdx = 0
    let expSum = 0
    const exps = new Float32Array(output.length)

    for (let j = 0; j < output.length; j++) {
      exps[j] = Math.exp(output[j])
      expSum += exps[j]
    }

    for (let j = 0; j < output.length; j++) {
      const prob = exps[j] / expSum
      if (prob > maxVal) {
        maxVal = prob
        maxIdx = j
      }
    }

    const predictedChar = BENGUNET_CLASSES[maxIdx] || ''
    fullText += predictedChar
    totalConfidence += maxVal
  }

  const avgConfidence = Math.round((totalConfidence / charBoxes.length) * 100)

  return {
    text: fullText,
    confidence: avgConfidence,
    charCount: charBoxes.length
  }
}
