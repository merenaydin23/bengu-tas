import React, { useState, useEffect } from 'react'
import { RotateCcw, Trash2, Sparkles } from 'lucide-react'
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
  isProcessing,
  onReset
}) => {
  const [localText, setLocalText] = useState(inputText)

  useEffect(() => {
    setLocalText(inputText)
  }, [inputText])

  // Debounced metin güncelleme (~150 ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localText !== inputText) {
        onTextChange(localText)
      }
    }, 150)

    return () => clearTimeout(handler)
  }, [localText, inputText, onTextChange])

  return (
    <div className="w-full space-y-2">
      
      {/* İlerleme Durumu */}
      {isProcessing && ocrProgress && (
        <div className="p-3 rounded-xl bg-sky-navy/90 border border-gold/30 flex items-center justify-between text-xs animate-fade-in">
          <span className="text-gold font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-gold" />
            {ocrProgress.message}
          </span>
          <span className="text-stone-sand font-bold">%{ocrProgress.progress}</span>
        </div>
      )}

      {/* Metin Düzenleme Alanı */}
      <div className="relative">
        <textarea
          id="ocr-text-input"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Yazını buraya yaz veya kameradan tara (ör. TÜRK, TENGRİ, BİLGE KAĞAN)..."
          rows={2}
          className="w-full rounded-2xl bg-sky-dark/95 border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 p-4 pr-24 text-stone-sand placeholder-stone-medium/60 text-base resize-none transition-all outline-none shadow-inner"
        />

        {/* Hızlı Temizle / Sıfırla Butonu */}
        {localText && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <button
              onClick={() => {
                setLocalText('')
                onTextChange('')
              }}
              className="p-1.5 rounded-lg bg-sky-navy/80 hover:bg-crimson/80 text-stone-medium hover:text-stone-sand transition-colors"
              title="Temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-sky-navy/80 hover:bg-sky-deep text-stone-medium hover:text-gold transition-colors"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
