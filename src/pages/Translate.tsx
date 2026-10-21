import React, { useState, useCallback } from 'react'
import { CameraCapture } from '../components/camera/CameraCapture'
import { OcrPanel } from '../components/translator/OcrPanel'
import { GokturkOutput } from '../components/translator/GokturkOutput'
import { preprocessImage } from '../lib/ocr/preprocess'
import { performOcr, OcrProgressUpdate, OcrResult } from '../lib/ocr/tesseract-client'
import { runBenguNetOcr } from '../lib/ocr/bengunet-client'
import { convertToGokturk, ConversionMode, WritingDirection, SeparatorStyle } from '../lib/gokturk/convert'
import { Camera, Keyboard, Sparkles } from 'lucide-react'

export const Translate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text'>('camera')
  const [engineType, setEngineType] = useState<'bengunet' | 'tesseract'>('tesseract')
  const [inputText, setInputText] = useState('')
  const [ocrProgress, setOcrProgress] = useState<OcrProgressUpdate | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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
      status: 'processing',
      progress: 20,
      message: 'Görüntü taranıyor ve optimize ediliyor...'
    })

    try {
      // 1. Görüntüyü ölçekle ve kontrastı artır
      const { processedCanvas } = await preprocessImage(canvas, {
        crop: { x: 0.01, y: 0.02, width: 0.98, height: 0.96 },
        maxDimension: 1800,
        applyThreshold: false
      })

      let recognizedText = ''
      let confidenceScore = 0

      // BengüNet AI seçildiyse önce BengüNet dene
      if (engineType === 'bengunet') {
        setOcrProgress({
          status: 'recognizing',
          progress: 50,
          message: 'BengüNet yapay zekâsı harfleri çözümlüyor...'
        })
        try {
          const pred = await runBenguNetOcr(processedCanvas)
          if (pred.text && pred.text.trim().length > 0) {
            recognizedText = pred.text
            confidenceScore = pred.confidence
          }
        } catch (netErr) {
          console.warn('BengüNet hatası, Tesseract yedeğine geçiliyor:', netErr)
        }
      }

      // Tesseract ile ana veya yedek okuma
      if (!recognizedText || engineType === 'tesseract') {
        setOcrProgress({
          status: 'recognizing',
          progress: 60,
          message: 'Türkçe yazı taranıyor ve okunuyor...'
        })
        const tessResult = await performOcr(processedCanvas, (update) => {
          setOcrProgress(update)
        })
        if (tessResult.text && tessResult.text.trim().length > 0) {
          recognizedText = tessResult.text
          confidenceScore = tessResult.confidence
        }
      }

      // 2. Geçiş: Ham görüntü ile Leptonica adaptif okuma dene
      if (!recognizedText) {
        setOcrProgress({
          status: 'recognizing',
          progress: 80,
          message: 'Gelişmiş adaptif filtreleme ile tekrar okunuyor...'
        })
        const rawResult = await performOcr(canvas)
        if (rawResult.text && rawResult.text.trim().length > 0) {
          recognizedText = rawResult.text
          confidenceScore = rawResult.confidence
        }
      }

      // 3. Geçiş: Yüksek kontrastlı Otsu binarize görüntü ile son şans dene
      if (!recognizedText) {
        const { processedCanvas: binarizedCanvas } = await preprocessImage(canvas, {
          crop: { x: 0.01, y: 0.02, width: 0.98, height: 0.96 },
          maxDimension: 1800,
          applyThreshold: true
        })
        const retryResult = await performOcr(binarizedCanvas)
        if (retryResult.text && retryResult.text.trim().length > 0) {
          recognizedText = retryResult.text
          confidenceScore = retryResult.confidence
        }
      }

      if (recognizedText) {
        setInputText(recognizedText)
        setOcrResult({
          text: recognizedText,
          confidence: confidenceScore,
          lowConfidence: confidenceScore < 50,
          words: recognizedText.split(' ').map(w => ({ text: w, confidence: confidenceScore }))
        })
        setOcrProgress({
          status: 'done',
          progress: 100,
          message: 'Yazı başarıyla okundu!'
        })
      } else {
        setOcrProgress({
          status: 'done',
          progress: 100,
          message: 'Yazı okunamadı. Lütfen kâğıdı yaklaştır ve büyük harflerle tekrar dene.'
        })
      }
    } catch (err) {
      console.error('OCR Hatası:', err)
      setOcrProgress({
        status: 'error',
        progress: 0,
        message: 'Kamera görüntüsü işlenemedi. Lütfen kâğıdı iyi aydınlatılmış bir yerde tutunuz.'
      })
    } finally {
      setIsProcessing(false)
    }
  }, [engineType])

  const handleReset = () => {
    setInputText('')
    setOcrResult(null)
    setOcrProgress(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Sade & Şık Üst Çubuk */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Giriş Sekmeleri */}
        <div className="inline-flex p-1 rounded-2xl bg-sky-navy/80 border border-gold/30 shadow-md">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'camera'
                ? 'bg-gold text-sky-dark shadow-md font-bold'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'text'
                ? 'bg-gold text-sky-dark shadow-md font-bold'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Yazarak Dene</span>
          </button>
        </div>

        {/* Minimalist Model Seçici */}
        <div className="inline-flex items-center p-1 rounded-xl bg-sky-navy/60 border border-gold/20 text-xs">
          <button
            onClick={() => setEngineType('bengunet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              engineType === 'bengunet'
                ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>BengüNet AI</span>
          </button>

          <button
            onClick={() => setEngineType('tesseract')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              engineType === 'tesseract'
                ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <span>Klasik OCR</span>
          </button>
        </div>
      </div>

      {/* Kamera Alanı */}
      {activeTab === 'camera' && (
        <CameraCapture
          onCapture={handleCapture}
          disabled={isProcessing}
        />
      )}

      {/* Sade Düzenleme Kutusu */}
      <OcrPanel
        inputText={inputText}
        onTextChange={setInputText}
        ocrProgress={ocrProgress}
        ocrResult={ocrResult}
        isProcessing={isProcessing}
        onReset={handleReset}
      />

      {/* Büyüleyici Göktürk Yazıt Çıktısı */}
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
