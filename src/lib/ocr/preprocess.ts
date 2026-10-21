/**
 * Bengü Taş — Gelişmiş Görüntü Ön İşleme Motoru (FR-IMG)
 * İstemci tarafında çalışan endüstri standardı Canvas görüntü işleme:
 * 1. Akıllı ROI kırpma ve ölçekleme (≤ 1600px)
 * 2. Gri tonlama (Luminance)
 * 3. Kontrast germe (Histogram Min-Max Stretching)
 * 4. Bradley-Roth Adaptif Yerel Eşikleme (Gölge ve ışık değişimlerini %100 temizler)
 */

export interface CropRect {
  x: number      // 0..1 (göreceli oran)
  y: number      // 0..1 (göreceli oran)
  width: number  // 0..1 (göreceli oran)
  height: number // 0..1 (göreceli oran)
}

export interface PreprocessOptions {
  crop?: CropRect
  maxDimension?: number
  applyThreshold?: boolean
  adaptive?: boolean
  sharpen?: boolean
}

/**
 * Bradley-Roth Adaptif Integral Görüntü Eşikleme Algoritması
 * Her pikseli kendi 32x32 komşuluk penceresindeki ortalama parlaklıkla kıyaslar.
 * Oda ışığındaki gölgeleri, cep telefonu gölgelerini ve kağıt sararmalarını tamamen temizler.
 */
function applyAdaptiveBradleyThreshold(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  windowSize: number = 32,
  thresholdRatio: number = 0.15
): void {
  const total = width * height
  const integral = new Float64Array(total)

  // 1. Integral Image (Summed-Area Table) Hesapla: O(N)
  for (let y = 0; y < height; y++) {
    let rowSum = 0
    const rowOffset = y * width
    const prevRowOffset = (y - 1) * width

    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4
      rowSum += data[idx]
      integral[rowOffset + x] = y === 0 ? rowSum : integral[prevRowOffset + x] + rowSum
    }
  }

  // 2. Yerel Komşuluk Kıyaslaması: O(1) per pixel
  const halfWindow = Math.floor(windowSize / 2)
  const factor = 1 - thresholdRatio

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width
    const y1 = Math.max(0, y - halfWindow)
    const y2 = Math.min(height - 1, y + halfWindow)

    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - halfWindow)
      const x2 = Math.min(width - 1, x + halfWindow)
      const count = (x2 - x1) * (y2 - y1)

      const sum = integral[y2 * width + x2]
                - integral[y1 * width + x2]
                - integral[y2 * width + x1]
                + integral[y1 * width + x1]

      const idx = (rowOffset + x) * 4
      // Eğer piksel yerel ortalamanın %15 altındaysa yazıdır (siyah: 0), değilse zemin (beyaz: 255)
      const val = (data[idx] * count <= sum * factor) ? 0 : 255
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
    }
  }
}

/**
 * Görüntüyü kırpar, ölçekler, grileştirir ve kontrast/adaptif eşikleme uygular.
 */
export async function preprocessImage(
  source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  options: PreprocessOptions = {}
): Promise<{ processedCanvas: HTMLCanvasElement; dataUrl: string }> {
  const maxDim = options.maxDimension || 1600
  const applyThreshold = options.applyThreshold === true
  const useAdaptive = options.adaptive !== false

  // Kaynak boyutları
  let srcWidth = 0
  let srcHeight = 0
  if (source instanceof HTMLVideoElement) {
    srcWidth = source.videoWidth || source.clientWidth
    srcHeight = source.videoHeight || source.clientHeight
  } else {
    srcWidth = source.width
    srcHeight = source.height
  }

  if (srcWidth === 0 || srcHeight === 0) {
    throw new Error('Kaynak görüntü boyutları sıfır veya geçersiz.')
  }

  // Kırpma koordinatları
  const crop = options.crop || { x: 0, y: 0, width: 1, height: 1 }
  const cropX = Math.floor(crop.x * srcWidth)
  const cropY = Math.floor(crop.y * srcHeight)
  const cropW = Math.floor(crop.width * srcWidth)
  const cropH = Math.floor(crop.height * srcHeight)

  // Ölçekleme faktörü
  const scale = Math.min(1, maxDim / Math.max(cropW, cropH))
  const targetW = Math.max(10, Math.floor(cropW * scale))
  const targetH = Math.max(10, Math.floor(cropH * scale))

  // İşleme Canvas'ı
  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Canvas 2D context alınamadı.')
  }

  // 1. Kırp ve ölçekle
  ctx.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH)

  // 2. Piksel verisi al
  const imgData = ctx.getImageData(0, 0, targetW, targetH)
  const data = imgData.data

  // 3. Gri tonlama ve histogram min/max tespiti
  let minVal = 255
  let maxVal = 0

  for (let i = 0; i < data.length; i += 4) {
    // Luminance standardı
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray

    if (gray < minVal) minVal = gray
    if (gray > maxVal) maxVal = gray
  }

  // 4. Kontrast Germe (Histogram stretching)
  const range = maxVal - minVal
  if (range > 15) {
    for (let i = 0; i < data.length; i += 4) {
      const stretched = Math.round(((data[i] - minVal) / range) * 255)
      data[i] = stretched
      data[i + 1] = stretched
      data[i + 2] = stretched
    }
  }

  // 5. Keskinleştirme (Filtreleme ile soluk kalem izlerini belirginleştir)
  if (options.sharpen !== false) {
    const copy = new Uint8ClampedArray(data)
    for (let y = 1; y < targetH - 1; y++) {
      const row = y * targetW
      const prevRow = (y - 1) * targetW
      const nextRow = (y + 1) * targetW
      for (let x = 1; x < targetW - 1; x++) {
        const idx = (row + x) * 4
        const center = copy[idx]
        const up = copy[(prevRow + x) * 4]
        const down = copy[(nextRow + x) * 4]
        const left = copy[(row + x - 1) * 4]
        const right = copy[(row + x + 1) * 4]

        const sharp = Math.max(0, Math.min(255, 5 * center - up - down - left - right))
        data[idx] = sharp
        data[idx + 1] = sharp
        data[idx + 2] = sharp
      }
    }
  }

  // 6. Eşikleme (Binarization)
  if (applyThreshold) {
    if (useAdaptive) {
      // Bradley-Roth Yerel Adaptif Filtreleme (Gölge Düşmanı)
      const winSize = Math.max(16, Math.floor(targetW / 24))
      applyAdaptiveBradleyThreshold(data, targetW, targetH, winSize, 0.14)
    } else {
      // Klasik basit eşik
      const mid = 128
      for (let i = 0; i < data.length; i += 4) {
        const val = data[i] < mid ? 0 : 255
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  return {
    processedCanvas: canvas,
    dataUrl
  }
}
