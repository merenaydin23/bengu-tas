import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, RefreshCw, Upload, AlertCircle, Info, Sparkles } from 'lucide-react'

export interface CameraCaptureProps {
  onCapture: (capturedCanvas: HTMLCanvasElement, previewDataUrl?: string) => void
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
      const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85)
      onCapture(canvas, previewDataUrl)
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
          const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          onCapture(canvas, previewDataUrl)
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-sky-dark font-bold hover:bg-gold-light transition-all shadow-lg active:scale-95 min-h-[44px]"
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

            {/* Geniş ve Rahat Hizalama Çerçevesi */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-8">
              <div className="relative w-[92%] max-w-lg aspect-[5/2] sm:aspect-[3/1] border-2 border-dashed border-gold/75 rounded-2xl flex items-center justify-center bg-sky-dark/20 backdrop-brightness-105">
                {/* Köşe Süsleri */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-gold rounded-br-lg" />

                <span className="text-[11px] sm:text-xs font-semibold text-stone-sand bg-sky-dark/90 px-3 py-1 rounded-full border border-gold/40 shadow-sm backdrop-blur-sm">
                  Yazıyı buraya tutunuz
                </span>
              </div>
            </div>

            {/* Kamera Değiştir Butonu (Mobil için büyük dokunma alanı) */}
            <button
              onClick={toggleFacingMode}
              className="absolute top-3 right-3 p-3 rounded-full bg-sky-dark/80 hover:bg-sky-dark text-gold border border-gold/40 backdrop-blur-md transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
              title="Kamerayı Değiştir (Ön / Arka)"
              aria-label="Kamera Değiştir"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dokunmatik Dostu Mobil Alt Kumanda Çubuğu */}
      <div className="p-3 sm:p-5 bg-gradient-to-t from-sky-dark to-sky-navy border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* İpucu Kutusu */}
        <div className="flex items-start gap-2 text-xs text-stone-medium max-w-md w-full sm:w-auto">
          <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <span>
            Koyu kalemle, beyaz kâğıda <strong className="text-gold">BÜYÜK HARFLERLE</strong> yazınız.
          </span>
        </div>

        {/* Eylem Butonları: Mobilde ortalanmış deklanşör */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Fotoğraf Yükle Butonu */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-navy hover:bg-sky-deep text-stone-sand border border-gold/30 text-xs sm:text-sm font-semibold transition-all active:scale-95 min-h-[48px]"
            title="Galeriden Fotoğraf Seç"
          >
            <Upload className="w-4 h-4 text-gold" />
            <span>Yükle</span>
          </button>

          {/* Ana Deklanşör Butonu (Yazıyı Oku) */}
          {!cameraError && (
            <button
              onClick={handleCapture}
              disabled={disabled || isLoading}
              className="flex-2 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark text-sm sm:text-base font-bold shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all active:scale-95 disabled:opacity-50 min-h-[48px]"
            >
              <Camera className="w-5 h-5 text-sky-dark" />
              <span>Yazıyı Oku</span>
              <Sparkles className="w-4 h-4 text-sky-dark animate-pulse" />
            </button>
          )}
        </div>

      </div>

    </div>
  )
}
