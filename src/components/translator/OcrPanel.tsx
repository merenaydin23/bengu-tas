import React, { useState, useEffect } from 'react'
import { RotateCcw, Trash2, Sparkles, Edit3 } from 'lucide-react'
import { OcrProgressUpdate, OcrResult } from '../../lib/ocr/tesseract-client'

export interface OcrPanelProps {
  inputText: string
  onTextChange: (newText: string) => void
  ocrProgress: OcrProgressUpdate | null
  ocrResult: OcrResult | null
  isProcessing: boolean
  onReset: () => void
}

const QUICK_SUGGESTIONS = [
  'TÜRK',
  'TENGRİ',
  'BİLGE KAĞAN',
  'KÜL TİGİN',
  'BENGÜ TAŞ',
  'TÜRKİYE',
  'BOZKURT',
  'İLTERİŞ'
]

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
    <div className="w-full space-y-2.5">
      
      {/* İlerleme Durumu */}
      {isProcessing && ocrProgress && (
        <div className="p-3 rounded-xl bg-sky-navy/95 border border-gold/40 flex items-center justify-between text-xs animate-fade-in shadow-md">
          <span className="text-gold font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-gold" />
            {ocrProgress.message}
          </span>
          <span className="text-stone-sand font-bold">%{ocrProgress.progress}</span>
        </div>
      )}

      {/* Düzenleme Alanı */}
      <div className="relative">
        <div className="flex items-center justify-between text-xs text-stone-medium mb-1.5 px-1">
          <span className="flex items-center gap-1.5 text-stone-sand font-medium">
            <Edit3 className="w-3.5 h-3.5 text-gold" />
            <span>Okunan Metin (Gerekirse dokunup düzeltebilirsin):</span>
          </span>
          {localText && (
            <span className="text-[11px] text-gold-light">
              {localText.length} karakter
            </span>
          )}
        </div>

        <textarea
          id="ocr-text-input"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Yazını buraya yaz veya kameradan tara (ör. TÜRK, TENGRİ, BİLGE KAĞAN)..."
          rows={2}
          className="w-full rounded-2xl bg-sky-dark/95 border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 p-4 pr-24 text-stone-sand placeholder-stone-medium/60 text-base font-medium resize-none transition-all outline-none shadow-inner"
        />

        {/* Hızlı Temizle / Sıfırla Butonu */}
        {localText && (
          <div className="absolute right-3 top-9 flex items-center gap-1.5">
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

      {/* Hızlı Örnek Kelimeler (1 Dokunuşla Test & Düzeltme) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] text-stone-medium shrink-0 font-medium mr-1">
          Örnek Kelimeler:
        </span>
        {QUICK_SUGGESTIONS.map((word) => (
          <button
            key={word}
            onClick={() => {
              setLocalText(word)
              onTextChange(word)
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-sky-navy/70 hover:bg-sky-deep border border-gold/25 hover:border-gold/50 text-stone-sand hover:text-gold text-[11px] font-semibold transition-all active:scale-95"
          >
            {word}
          </button>
        ))}
      </div>

    </div>
  )
}
