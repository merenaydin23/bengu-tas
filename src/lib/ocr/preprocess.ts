/**
 * Bengü Taş — Görüntü Ön İşleme Motoru (FR-IMG)
 * İstemci tarafında çalışan yüksek kaliteli Canvas görüntü işleme:
 * 1. Çerçeve kırpma ve maksimum boyut ölçekleme (≤ 1600px)
 * 2. Gri tonlama (Luminance)
 * 3. Kontrast germe (Histogram Min-Max Stretching)
 * 4. Otsu Binarization (Otomatik Eşikleme ile Siyah-Beyaz Belge)
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
}

/**
 * Otsu Algoritması: Optimum binarization eşik değerini hesaplar.
 */
function calculateOtsuThreshold(grayData: Uint8ClampedArray): number {
  const histogram = new Array(256).fill(0)
  const totalPixels = grayData.length / 4

  for (let i = 0; i < grayData.length; i += 4) {
    histogram[grayData[i]]++
  }

  let sum = 0
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i]
  }

  let sumB = 0
  let wB = 0
  let wF = 0
  let varMax = 0
  let threshold = 128

  for (let t = 0; t < 256; t++) {
    wB += histogram[t]
    if (wB === 0) continue
    wF = totalPixels - wB
    if (wF === 0) break

    sumB += t * histogram[t]
    const mB = sumB / wB
    const mF = (sum - sumB) / wF

    const varBetween = wB * wF * (mB - mF) * (mB - mF)
    if (varBetween > varMax) {
      varMax = varBetween
      threshold = t
    }
  }

  return threshold
}

/**
 * Görüntüyü kırpar, ölçekler, grileştirir ve kontrast/eşikleme uygular.
 */
export async function preprocessImage(
  source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  options: PreprocessOptions = {}
): Promise<{ processedCanvas: HTMLCanvasElement; dataUrl: string }> {
  const maxDim = options.maxDimension || 1600
  const applyThreshold = options.applyThreshold !== false

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

  // Ölçekleme faktörü (uzun kenar <= maxDim)
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
    // Luminance standardı: 0.299 R + 0.587 G + 0.114 B
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray

    if (gray < minVal) minVal = gray
    if (gray > maxVal) maxVal = gray
  }

  // 4. Kontrast Germe (Histogram stretching)
  const range = maxVal - minVal
  if (range > 10) {
    for (let i = 0; i < data.length; i += 4) {
      const stretched = Math.round(((data[i] - minVal) / range) * 255)
      data[i] = stretched
      data[i + 1] = stretched
      data[i + 2] = stretched
    }
  }

  // 5. Adaptif Eşikleme (Otsu Binarization)
  if (applyThreshold) {
    const threshold = calculateOtsuThreshold(data)
    for (let i = 0; i < data.length; i += 4) {
      const val = data[i] >= threshold ? 255 : 0
      data[i] = val
      data[i + 1] = val
      data[i + 2] = val
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  return {
    processedCanvas: canvas,
    dataUrl
  }
}
