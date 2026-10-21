import React, { useState, useCallback } from 'react'
import { CameraCapture } from '../components/camera/CameraCapture'
import { OcrPanel } from '../components/translator/OcrPanel'
import { GokturkOutput } from '../components/translator/GokturkOutput'
import { preprocessImage } from '../lib/ocr/preprocess'
import { performOcr, OcrProgressUpdate, OcrResult } from '../lib/ocr/tesseract-client'
import { convertToGokturk, ConversionMode, WritingDirection, SeparatorStyle } from '../lib/gokturk/convert'
import { Camera, Keyboard, Image as ImageIcon } from 'lucide-react'

export const Translate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text'>('camera')
  const [inputText, setInputText] = useState('')
  const [ocrProgress, setOcrProgress] = useState<OcrProgressUpdate | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Çeviri Ayarları
  const [mode, setMode] = useState<ConversionMode>('student')
  const [direction, setDirection] = useState<WritingDirection>('rtl')
  const [separator, setSeparator] = useState<SeparatorStyle>('two_dot')

  // Canlı Göktürk Çevirisi
  const conversion = convertToGokturk(inputText, {
    mode,
    direction,
    separator
  })

  // Kameradan / Dosyadan Görüntü Alındığında
  const handleCapture = useCallback(async (canvas: HTMLCanvasElement) => {
    setIsProcessing(true)
    setOcrProgress({
      status: 'preprocessing',
      progress: 15,
      message: 'Görüntü netleştiriliyor ve kontrast ayarlanıyor...'
    })

    try {
      // 1. Görüntü Ön İşleme (Kırpma, Gri Tonlama, Kontrast, Otsu Binarization)
      const { processedCanvas, dataUrl } = await preprocessImage(canvas, {
        crop: { x: 0.1, y: 0.25, width: 0.8, height: 0.5 }, // Kılavuz çerçeve alanı
        maxDimension: 1600,
        applyThreshold: true
      })

      setPreviewImage(dataUrl)

      // 2. OCR Tesseract.js (Yerel Web Worker)
      const result = await performOcr(processedCanvas, (update) => {
        setOcrProgress(update)
      })

      setOcrResult(result)
      if (result.text) {
        setInputText(result.text)
      } else {
        setInputText('')
      }
    } catch (err) {
      console.error('OCR İşleme Hatası:', err)
      setOcrProgress({
        status: 'error',
        progress: 0,
        message: 'Okuma sırasında bir sorun oluştu. Lütfen tekrar deneyiniz veya yazarak giriniz.'
      })
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleReset = () => {
    setInputText('')
    setOcrResult(null)
    setOcrProgress(null)
    setPreviewImage(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Sayfa Başlığı */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-sand">
          Göktürkçe Çeviri Stüdyosu
        </h1>
        <p className="text-stone-medium text-sm sm:text-base max-w-xl mx-auto">
          Kameranla kâğıttaki yazıyı tara veya klavyenle yaz; anında 1300 yıllık Orhun yazıtı harflerine dönüştür.
        </p>
      </div>

      {/* Giriş Yolu Sekmeleri */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-sky-navy border border-gold/30 shadow-lg">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'camera'
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark shadow-md'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera ile Oku</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark shadow-md'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Yazarak Dene</span>
          </button>
        </div>
      </div>

      {/* Kamera Giriş Alanı */}
      {activeTab === 'camera' && (
        <div className="space-y-4">
          <CameraCapture
            onCapture={handleCapture}
            disabled={isProcessing}
          />

          {/* İsteğe Bağlı İşlenmiş Önizleme */}
          {previewImage && (
            <div className="p-3 bg-sky-navy/60 rounded-xl border border-gold/20 flex items-center justify-between text-xs text-stone-medium">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-gold" />
                <span>Netleştirilmiş ve eşiklenmiş siyah-beyaz yazı karesi OCR motoruna verildi.</span>
              </span>
              <img src={previewImage} alt="İşlenmiş Kare" className="h-8 rounded border border-gold/30 object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Düzenlenebilir Metin Paneli (FR-EDIT) */}
      <OcrPanel
        inputText={inputText}
        onTextChange={setInputText}
        ocrProgress={ocrProgress}
        ocrResult={ocrResult}
        isProcessing={isProcessing}
        onReset={handleReset}
      />

      {/* Canlı Göktürk Çıktısı (FR-CONV / FR-OUT) */}
      <GokturkOutput
        conversion={conversion}
        latinText={inputText}
        mode={mode}
        direction={direction}
        separator={separator}
        onModeChange={setMode}
        onDirectionChange={setDirection}
        onSeparatorChange={setSeparator}
      />

    </div>
  )
}
