import React, { useState, useCallback } from 'react'
import { CameraCapture } from '../components/camera/CameraCapture'
import { OcrPanel } from '../components/translator/OcrPanel'
import { GokturkOutput } from '../components/translator/GokturkOutput'
import { TransparencyPanel } from '../components/translator/TransparencyPanel'
import { preprocessImage } from '../lib/ocr/preprocess'
import { performOcr, OcrProgressUpdate, OcrResult, PSM } from '../lib/ocr/tesseract-client'
import { runBenguNetOcr } from '../lib/ocr/bengunet-client'
import { convertToGokturk, ConversionMode, WritingDirection, SeparatorStyle } from '../lib/gokturk/convert'
import { Camera, Keyboard, Sparkles, Cpu } from 'lucide-react'

export const Translate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text'>('camera')
  const [engineType, setEngineType] = useState<'bengunet' | 'tesseract'>('tesseract')
  const [inputText, setInputText] = useState('')
  const [ocrProgress, setOcrProgress] = useState<OcrProgressUpdate | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [processingTimeMs, setProcessingTimeMs] = useState<number | undefined>(undefined)
  const [engineUsedName, setEngineUsedName] = useState<string>('Tesseract v5.1 (Türkçe Sözlük)')

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
  const handleCapture = useCallback(async (canvas: HTMLCanvasElement, previewDataUrl?: string) => {
    const startTime = performance.now()
    setIsProcessing(true)
    setCapturedImage(previewDataUrl || canvas.toDataURL('image/jpeg', 0.85))

    setOcrProgress({
      status: 'processing',
      progress: 20,
      message: 'Görüntü taranıyor ve optimize ediliyor...'
    })

    try {
      let recognizedText = ''
      let confidenceScore = 0
      let activeEngine = 'Tesseract v5.1 (Türkçe Sözlük)'

      // BengüNet AI seçildiyse önce BengüNet dene
      if (engineType === 'bengunet') {
        activeEngine = 'BengüNet AI (Özel PyTorch CNN)'
        setOcrProgress({
          status: 'recognizing',
          progress: 40,
          message: 'BengüNet yapay zekâsı harfleri çözümlüyor...'
        })
        try {
          const { processedCanvas: benguCanvas } = await preprocessImage(canvas, {
            crop: { x: 0.06, y: 0.15, width: 0.88, height: 0.70 },
            maxDimension: 1600,
            applyThreshold: false
          })
          const pred = await runBenguNetOcr(benguCanvas)
          if (pred.text && pred.text.trim().length > 0) {
            recognizedText = pred.text
            confidenceScore = pred.confidence
          }
        } catch (netErr) {
          console.warn('BengüNet hatası:', netErr)
        }
      }

      // Tesseract Çok Aşamalı Akıllı Okuma (El Yazısı ve Türkçe için En Yüksek Doğruluk)
      if (!recognizedText || engineType === 'tesseract') {
        activeEngine = 'Tesseract v5.1 (Türkçe Sözlük)'

        // AŞAMA 1: Odaklanmış Merkez Alan (ROI) + Bradley-Roth Yerel Adaptif Filtreleme (Gölge ve Işık Düşmanı)
        setOcrProgress({
          status: 'recognizing',
          progress: 45,
          message: 'El yazısı taranıyor (Gölge filtreleme)...'
        })

        const { processedCanvas: adaptiveRoiCanvas } = await preprocessImage(canvas, {
          crop: { x: 0.05, y: 0.14, width: 0.90, height: 0.72 },
          maxDimension: 1800,
          applyThreshold: true,
          adaptive: true
        })

        const pass1 = await performOcr(adaptiveRoiCanvas, (update) => setOcrProgress(update), PSM.SINGLE_BLOCK)

        if (pass1.text && pass1.text.trim().length > 0 && pass1.confidence >= 50) {
          recognizedText = pass1.text
          confidenceScore = pass1.confidence
        }

        // AŞAMA 2: Eğer Aşama 1 yetersiz kaldıysa, Yüksek Kontrastlı Gri Tonlama ile Dene
        if (!recognizedText || confidenceScore < 60) {
          setOcrProgress({
            status: 'recognizing',
            progress: 65,
            message: 'Yüksek kontrast analizi uygulanıyor...'
          })

          const { processedCanvas: grayRoiCanvas } = await preprocessImage(canvas, {
            crop: { x: 0.05, y: 0.14, width: 0.90, height: 0.72 },
            maxDimension: 1800,
            applyThreshold: false
          })

          const pass2 = await performOcr(grayRoiCanvas, undefined, PSM.SINGLE_BLOCK)

          if (pass2.text && pass2.text.trim().length > 0 && pass2.confidence > confidenceScore) {
            recognizedText = pass2.text
            confidenceScore = pass2.confidence
          }
        }

        // AŞAMA 3: Tek Satır Modu (PSM 7) — Özellikle "TÜRK", "BİLGE" gibi tek satırlık kelimeler için
        if (!recognizedText || confidenceScore < 50) {
          const pass3 = await performOcr(adaptiveRoiCanvas, undefined, PSM.SINGLE_LINE)
          if (pass3.text && pass3.text.trim().length > 0 && pass3.confidence > confidenceScore) {
            recognizedText = pass3.text
            confidenceScore = pass3.confidence
          }
        }

        // AŞAMA 4: Geniş Açı / Tam Kare Yedekleme (Kullanıcı kâğıdı kenarda tuttuysa)
        if (!recognizedText) {
          setOcrProgress({
            status: 'recognizing',
            progress: 85,
            message: 'Geniş açı ile son tarama yapılıyor...'
          })
          const { processedCanvas: fullAdaptiveCanvas } = await preprocessImage(canvas, {
            crop: { x: 0, y: 0, width: 1, height: 1 },
            maxDimension: 1800,
            applyThreshold: true,
            adaptive: true
          })
          const pass4 = await performOcr(fullAdaptiveCanvas, undefined, PSM.SINGLE_BLOCK)
          if (pass4.text && pass4.text.trim().length > 0) {
            recognizedText = pass4.text
            confidenceScore = pass4.confidence
          }
        }
      }

      const duration = Math.round(performance.now() - startTime)
      setProcessingTimeMs(duration)
      setEngineUsedName(activeEngine)

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
    setCapturedImage(null)
    setProcessingTimeMs(undefined)
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Sade & Şık Üst Çubuk (Mobilde ve Masaüstünde Mükemmel Uyum) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Giriş Sekmeleri */}
        <div className="inline-flex p-1 rounded-2xl bg-sky-navy/90 border border-gold/30 shadow-md justify-center">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all min-h-[44px] ${
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
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all min-h-[44px] ${
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
        <div className="inline-flex items-center p-1 rounded-xl bg-sky-navy/70 border border-gold/25 text-xs justify-center">
          <button
            onClick={() => setEngineType('tesseract')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all min-h-[40px] ${
              engineType === 'tesseract'
                ? 'bg-gold/25 text-gold font-bold border border-gold/50 shadow-sm'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-gold" />
            <span>Tesseract (Sözlük)</span>
          </button>

          <button
            onClick={() => setEngineType('bengunet')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all min-h-[40px] ${
              engineType === 'bengunet'
                ? 'bg-gold/25 text-gold font-bold border border-gold/50 shadow-sm'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>BengüNet AI</span>
          </button>
        </div>
      </div>

      {/* 3 Aşamalı Akış Kartları */}
      <div className="space-y-6">

        {/* 1. AŞAMA: KAMERA / YAZI GİRİŞİ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold text-sky-dark text-xs font-black flex items-center justify-center shadow-md">
                1
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-stone-sand uppercase tracking-wider">
                {activeTab === 'camera' ? 'Kamera ile El Yazını Çek' : 'Türkçe Metni Yaz'}
              </h2>
            </div>
            {isProcessing && (
              <span className="text-xs text-gold font-medium animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>İşleniyor...</span>
              </span>
            )}
          </div>

          {activeTab === 'camera' && (
            <CameraCapture
              onCapture={handleCapture}
              disabled={isProcessing}
            />
          )}
        </section>

        {/* 2. AŞAMA: OKUNAN TÜRKÇE METİN (AÇIK & ŞEFFAF) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold/90 text-sky-dark text-xs font-black flex items-center justify-center shadow-md">
                2
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-stone-sand uppercase tracking-wider">
                Okunan Metin (1. Olarak Çıkarılan Yazı)
              </h2>
            </div>
            {ocrResult && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-semibold">
                %{ocrResult.confidence} Doğruluk
              </span>
            )}
          </div>

          <OcrPanel
            inputText={inputText}
            onTextChange={setInputText}
            ocrProgress={ocrProgress}
            ocrResult={ocrResult}
            isProcessing={isProcessing}
            onReset={handleReset}
          />
        </section>

        {/* 3. AŞAMA: GÖKTÜRKÇE ANIT YAZITI */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-light text-sky-dark text-xs font-black flex items-center justify-center shadow-md">
                3
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-stone-sand uppercase tracking-wider">
                Göktürkçe (Orhun) Bengü Taş Yazıtı
              </h2>
            </div>
          </div>

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
        </section>

        {/* 4. AŞAMA: ŞEFFAF HARF HARF SES KURALLARI */}
        <section className="pt-2">
          <TransparencyPanel
            inputText={inputText}
            mode={mode}
            ocrResult={ocrResult}
            capturedImage={capturedImage}
            engineName={engineUsedName}
            processingTimeMs={processingTimeMs}
          />
        </section>

      </div>

    </div>
  )
}
