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
  const [engineType, setEngineType] = useState<'bengunet' | 'tesseract'>('bengunet')
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
      progress: 30,
      message: 'Yazı taranıyor...'
    })

    try {
      const { processedCanvas } = await preprocessImage(canvas, {
        crop: { x: 0.1, y: 0.25, width: 0.8, height: 0.5 },
        maxDimension: 1600,
        applyThreshold: true
      })

      if (engineType === 'bengunet') {
        setOcrProgress({
          status: 'recognizing',
          progress: 70,
          message: 'Yapay zekâ harfleri çözümlüyor...'
        })

        const pred = await runBenguNetOcr(processedCanvas)

        setInputText(pred.text)
        setOcrResult({
          text: pred.text,
          confidence: pred.confidence,
          lowConfidence: pred.confidence < 50,
          words: pred.text.split(' ').map(w => ({ text: w, confidence: pred.confidence }))
        })
      } else {
        const result = await performOcr(processedCanvas, (update) => {
          setOcrProgress(update)
        })

        setOcrResult(result)
        setInputText(result.text || '')
      }
    } catch (err) {
      console.error('OCR Hatası:', err)
      setOcrProgress({
        status: 'error',
        progress: 0,
        message: 'Okunamadı, lütfen tekrar dene veya yazarak gir.'
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
