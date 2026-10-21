import React, { useState, useEffect } from 'react'
import { Edit3, RotateCcw, Trash2, AlertTriangle, Sparkles } from 'lucide-react'
import { OcrProgressUpdate, OcrResult } from '../../lib/ocr/tesseract-client'

export interface OcrPanelProps {
  inputText: string
  onTextChange: (newText: string) => void
  ocrProgress: OcrProgressUpdate | null
  ocrResult: OcrResult | null
  isProcessing: boolean
  onReset: () => void
}

export const OcrPanel: React.FC<OcrPanelProps> = ({
  inputText,
  onTextChange,
  ocrProgress,
  ocrResult,
  isProcessing,
  onReset
}) => {
  const [localText, setLocalText] = useState(inputText)

  // Girdi değiştiğinde yerel durumu senkronize et
  useEffect(() => {
    setLocalText(inputText)
  }, [inputText])

  // Debounced metin güncelleme (~150 ms) (FR-EDIT)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localText !== inputText) {
        onTextChange(localText)
      }
    }, 150)

    return () => clearTimeout(handler)
  }, [localText, inputText, onTextChange])

  return (
    <div className="w-full space-y-3">
      
      {/* Üst Bilgi Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-gold" />
          <label htmlFor="ocr-text-input" className="text-sm font-semibold text-stone-sand">
            Okunan / Girilen Türkçe Metin
          </label>
        </div>

        {/* Aksiyonlar: Temizle */}
        <div className="flex items-center gap-2">
          {localText && (
            <button
              onClick={() => {
                setLocalText('')
                onTextChange('')
              }}
              className="inline-flex items-center gap-1 text-xs text-stone-medium hover:text-crimson-light transition-colors px-2 py-1 rounded"
              title="Metni Temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-stone-medium hover:text-gold transition-colors px-2 py-1 rounded"
            title="Yeniden Çek veya Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeniden Başla</span>
          </button>
        </div>
      </div>

      {/* OCR İlerleme Durumu Çubuğu */}
      {isProcessing && ocrProgress && (
        <div className="p-3.5 rounded-xl bg-sky-navy border border-gold/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              {ocrProgress.message}
            </span>
            <span className="text-stone-sand font-bold">%{ocrProgress.progress}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sky-dark overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-crimson transition-all duration-300"
              style={{ width: `${ocrProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Düşük Güven (Confidence) Uyarısı (FR-OCR) */}
      {!isProcessing && ocrResult?.lowConfidence && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">El yazısı kontrol uyarısı:</span> Bazı harfler tam net okunamamış olabilir (Doğruluk: %{ocrResult.confidence}). Lütfen kutudaki metni kontrol edip düzeltiniz.
          </div>
        </div>
      )}

      {/* Metin Düzenleme Kutusu (Textarea) */}
      <div className="relative">
        <textarea
          id="ocr-text-input"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Kameradan çekilen yazı burada görünür veya doğrudan buraya yazabilirsin (ör. TÜRK, TENGRİ, BİLGE KAĞAN)..."
          rows={3}
          className="w-full rounded-xl bg-sky-dark/90 border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 p-4 text-stone-sand placeholder-stone-medium text-base resize-y transition-all outline-none"
        />
        {localText && (
          <div className="absolute bottom-2.5 right-3 text-[11px] text-stone-medium">
            {localText.length} karakter
          </div>
        )}
      </div>

    </div>
  )
}
