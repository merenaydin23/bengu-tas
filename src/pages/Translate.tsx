import React, { useState, useCallback } from 'react'
import { CameraCapture } from '../components/camera/CameraCapture'
import { OcrPanel } from '../components/translator/OcrPanel'
import { GokturkOutput } from '../components/translator/GokturkOutput'
import { preprocessImage } from '../lib/ocr/preprocess'
import { performOcr, OcrProgressUpdate, OcrResult } from '../lib/ocr/tesseract-client'
import { runBenguNetOcr } from '../lib/ocr/bengunet-client'
import { convertToGokturk, ConversionMode, WritingDirection, SeparatorStyle } from '../lib/gokturk/convert'
import { Camera, Keyboard, Image as ImageIcon, Cpu, Sparkles } from 'lucide-react'

export const Translate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text'>('camera')
  const [engineType, setEngineType] = useState<'bengunet' | 'tesseract'>('bengunet')
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
      progress: 20,
      message: 'Görüntü işleme: ROI kırpma, gri tonlama ve Otsu eşikleme uygulanıyor...'
    })

    try {
      // 1. Görüntü Ön İşleme (Kırpma, Gri Tonlama, Kontrast, Otsu Binarization)
      const { processedCanvas, dataUrl } = await preprocessImage(canvas, {
        crop: { x: 0.1, y: 0.25, width: 0.8, height: 0.5 }, // Kılavuz çerçeve alanı
        maxDimension: 1600,
        applyThreshold: true
      })

      setPreviewImage(dataUrl)

      if (engineType === 'bengunet') {
        // 2. Kendi Eğittiğimiz PyTorch ONNX Modeli (BengüNet)
        setOcrProgress({
          status: 'segmenting',
          progress: 50,
          message: 'Dikey projeksiyon ile harf segmentasyonu ve BengüNet CNN çıkarımı yapılıyor...'
        })

        const pred = await runBenguNetOcr(processedCanvas)

        setInputText(pred.text)
        setOcrResult({
          text: pred.text,
          confidence: pred.confidence,
          lowConfidence: pred.confidence < 60,
          words: pred.text.split(' ').map(w => ({ text: w, confidence: pred.confidence }))
        })

        setOcrProgress({
          status: 'done',
          progress: 100,
          message: `BengüNet ile ${pred.charCount} karakter başarıyla tanındı!`
        })
      } else {
        // 3. Tesseract OCR (Yedek/Hibrit Motor)
        const result = await performOcr(processedCanvas, (update) => {
          setOcrProgress(update)
        })

        setOcrResult(result)
        setInputText(result.text || '')
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
  }, [engineType])

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

      {/* Model ve Giriş Seçenekleri Çubuğu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-sky-navy/80 border border-gold/30">
        
        {/* Giriş Yolu Sekmeleri */}
        <div className="inline-flex p-1 rounded-xl bg-sky-dark border border-gold/20 shadow-inner">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark shadow-md'
                : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Yazarak Dene</span>
          </button>
        </div>

        {/* OCR Motoru Seçimi (Hoca için Çift Motor Desteği) */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-medium hidden sm:inline">Model:</span>
          <div className="inline-flex p-1 rounded-xl bg-sky-dark border border-gold/20">
            <button
              onClick={() => setEngineType('bengunet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                engineType === 'bengunet'
                  ? 'bg-gold text-sky-dark shadow'
                  : 'text-stone-medium hover:text-stone-sand'
              }`}
              title="Özel eğitilmiş PyTorch CNN Modeli + ONNX Web Çıkarımı"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>BengüNet (PyTorch CNN)</span>
              <Sparkles className="w-3 h-3 text-crimson" />
            </button>

            <button
              onClick={() => setEngineType('tesseract')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                engineType === 'tesseract'
                  ? 'bg-gold text-sky-dark font-bold shadow'
                  : 'text-stone-medium hover:text-stone-sand'
              }`}
              title="Tesseract LSTM Türkçe OCR"
            >
              <span>Tesseract.js</span>
            </button>
          </div>
        </div>

      </div>

      {/* Model Bilgilendirme Rozeti */}
      {engineType === 'bengunet' && (
        <div className="p-3 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-between text-xs text-stone-sand">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gold shrink-0" />
            <span>
              <strong>Aktif Model:</strong> BengüNet CNN — PyTorch ile özel üretilen Türkçe el yazısı veri seti üzerinde eğitilmiş, ONNX WebAssembly ile %100 istemci tarafında çalışan derin öğrenme modeli.
            </span>
          </div>
        </div>
      )}

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
                <span>Görüntü İşleme: ROI kırpıldı, Otsu binarization ve dikey projeksiyon harf segmentasyonu uygulandı.</span>
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
