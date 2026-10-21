import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, RefreshCw, Upload, AlertCircle, Info, Sparkles } from 'lucide-react'

export interface CameraCaptureProps {
  onCapture: (capturedCanvas: HTMLCanvasElement) => void
  onError?: (err: Error) => void
  disabled?: boolean
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onError,
  disabled = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Kamera akışını durdurma yardımcı fonksiyonu
  const stopStream = useCallback((mediaStream: MediaStream | null) => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // Kamera başlatma
  const startCamera = useCallback(async () => {
    setIsLoading(true)
    setCameraError(null)

    // Önceki akışı kapat
    if (stream) {
      stopStream(stream)
      setStream(null)
    }

    // HTTPS veya localhost kontrolü (FR-CAM-6)
    const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (!isSecure) {
      setCameraError('Kamera erişimi için güvenli bağlantı (HTTPS) gereklidir. Lütfen dosya yükleme yedeğini kullanınız.')
      setIsLoading(false)
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Tarayıcınız kamera akışını desteklemiyor. Lütfen fotoğraf yükleyerek devam ediniz.')
      setIsLoading(false)
      return
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        },
        audio: false
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(newStream)

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        await videoRef.current.play()
      }
      setIsLoading(false)
    } catch (err) {
      console.warn('Kamera açma hatası:', err)
      const errorMsg =
        (err as Error).name === 'NotAllowedError'
          ? 'Kamera izni verilmedi. Aşağıdaki butonla kâğıttaki yazının fotoğrafını yükleyebilirsiniz.'
          : 'Kamera açılamadı. Cihazınızda kamera meşgul olabilir veya desteklenmiyor olabilir.'
      setCameraError(errorMsg)
      setIsLoading(false)
      onError?.(err as Error)
    }
  }, [facingMode, stopStream, onError])

  // Bileşen yüklendiğinde kamerayı aç, ayrılınca durdur (FR-CAM-5)
  useEffect(() => {
    startCamera()

    return () => {
      if (stream) {
        stopStream(stream)
      }
    }
  }, [facingMode])

  // Sekme gizlenince kamera akışını durdur (FR-CAM-5)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stream) {
        stopStream(stream)
        setStream(null)
      } else if (!document.hidden && !stream && !cameraError) {
        startCamera()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [stream, cameraError, startCamera, stopStream])

  // Ön/arka kamera değiştir (FR-CAM-2)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  // Fotoğraf Çek / Yakala (FR-CAM-3)
  const handleCapture = () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      onCapture(canvas)
    }
  }

  // Dosya Yükleme Yedeği (FR-CAM-4)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          onCapture(canvas)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-sky-dark border-2 border-gold/30 shadow-2xl">
      
      {/* Gizli Dosya Seçici */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Video Akışı */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-stone-sand leading-relaxed">{cameraError}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-sky-dark font-bold hover:bg-gold-light transition-all shadow-lg active:scale-95"
            >
              <Upload className="w-5 h-5" />
              <span>Fotoğraf Yükle</span>
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Hizalama Çerçevesi (Kılavuz) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-12">
              <div className="relative w-full max-w-lg aspect-[3/1] border-2 border-dashed border-gold/80 rounded-2xl shadow-[0_0_0_9999px_rgba(14,27,43,0.55)] flex items-center justify-center">
                {/* Köşe Süsleri */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-gold rounded-br-lg" />

                <span className="text-xs sm:text-sm font-medium text-stone-sand bg-sky-dark/80 px-3 py-1 rounded-full border border-gold/40 shadow-sm backdrop-blur-sm">
                  Yazıyı bu çerçevenin içine hizala
                </span>
              </div>
            </div>

            {/* Kamera Değiştir Butonu */}
            <button
              onClick={toggleFacingMode}
              className="absolute top-4 right-4 p-3 rounded-full bg-sky-dark/70 hover:bg-sky-dark text-gold border border-gold/30 backdrop-blur-md transition-all active:scale-95"
              title="Kamerayı Değiştir (Ön / Arka)"
              aria-label="Kamera Değiştir"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* İpucu ve Alt Buton Çubuğu */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-sky-dark to-sky-navy border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* İpucu Kutusu (FR-OCR) */}
        <div className="flex items-start gap-2.5 text-xs text-stone-medium max-w-md">
          <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <span>
            <strong className="text-stone-sand">İpucu:</strong> Koyu renkli kalemle, beyaz kâğıda,{' '}
            <strong className="text-gold">BÜYÜK HARFLERLE</strong> ve aralıklı yazarsan en doğru sonucu alırsın.
          </span>
        </div>

        {/* Eylem Butonları */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-navy hover:bg-sky-deep text-stone-sand border border-gold/30 text-sm font-semibold transition-all active:scale-95 min-h-[44px]"
            title="Galeriden veya Dosyalardan Seç"
          >
            <Upload className="w-4 h-4 text-gold" />
            <span>Yükle</span>
          </button>

          {!cameraError && (
            <button
              onClick={handleCapture}
              disabled={disabled || isLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark text-sm font-bold shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all active:scale-95 disabled:opacity-50 min-h-[44px]"
            >
              <Camera className="w-5 h-5" />
              <span>Yazıyı Oku</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  )
}
