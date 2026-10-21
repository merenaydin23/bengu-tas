import React, { useState } from 'react'
import { Eye, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Layers, Cpu } from 'lucide-react'
import { analyzeGokturkConversion } from '../../lib/gokturk/analysis'
import { ConversionMode } from '../../lib/gokturk/convert'
import { OcrResult } from '../../lib/ocr/tesseract-client'

export interface TransparencyPanelProps {
  inputText: string
  mode: ConversionMode
  ocrResult: OcrResult | null
  capturedImage: string | null
  engineName: string
  processingTimeMs?: number
}

export const TransparencyPanel: React.FC<TransparencyPanelProps> = ({
  inputText,
  mode,
  ocrResult,
  capturedImage,
  engineName,
  processingTimeMs
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [showFullImage, setShowFullImage] = useState(false)

  if (!inputText.trim()) return null

  const wordAnalyses = analyzeGokturkConversion(inputText, mode)

  return (
    <div className="w-full rounded-2xl bg-sky-dark/95 border border-gold/30 shadow-xl overflow-hidden transition-all animate-fade-in">
      
      {/* Başlık ve Aç/Kapa Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-sky-navy via-sky-dark to-sky-navy border-b border-gold/20 text-left hover:bg-sky-navy/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-sand flex items-center gap-2">
              <span>Şeffaf Çözümleme & Ses Kuralları</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold font-sans font-semibold border border-gold/40">
                Açık & Net
              </span>
            </h3>
            <p className="text-xs text-stone-medium">
              Kameradan ne okundu ve Göktürkçeye harf harf nasıl çevrildi?
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg bg-sky-navy text-stone-medium">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* İçerik */}
      {isOpen && (
        <div className="p-4 sm:p-6 space-y-5">

          {/* 1. Üst Özet Kartları: Kamera Karesi & OCR Bilgisi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Kamera Görüntüsü Önizlemesi */}
            {capturedImage && (
              <div className="sm:col-span-1 rounded-xl bg-sky-navy/70 border border-gold/20 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-stone-sand font-semibold mb-2">
                  <span>📸 Çekilen Kare</span>
                  <button
                    onClick={() => setShowFullImage(!showFullImage)}
                    className="text-gold text-[11px] hover:underline"
                  >
                    {showFullImage ? 'Küçült' : 'Büyüt'}
                  </button>
                </div>
                <div
                  onClick={() => setShowFullImage(!showFullImage)}
                  className={`relative rounded-lg overflow-hidden border border-gold/30 bg-black cursor-pointer group ${
                    showFullImage ? 'h-48' : 'h-24'
                  } transition-all`}
                >
                  <img
                    src={capturedImage}
                    alt="Kameradan çekilen el yazısı karesi"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-sky-dark/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-stone-sand font-medium">
                    Tıkla ve İncele
                  </div>
                </div>
              </div>
            )}

            {/* OCR Telemetrisi (Doğruluk ve Motor) */}
            <div className={`${capturedImage ? 'sm:col-span-2' : 'sm:col-span-3'} rounded-xl bg-sky-navy/70 border border-gold/20 p-3 space-y-2`}>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-sand">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-gold" />
                  <span>Kullanılan Motor: {engineName}</span>
                </span>
                {processingTimeMs && (
                  <span className="text-stone-medium font-mono text-[11px]">
                    ⏱️ {processingTimeMs} ms
                  </span>
                )}
              </div>

              {ocrResult && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Güven Skoru: %{ocrResult.confidence}</span>
                  </div>

                  {ocrResult.lowConfidence && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Kâğıdı yaklaştırarak doğruluğu artırabilirsin</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-stone-medium pt-1">
                <span className="text-stone-sand font-medium">Taranan Metin: </span>
                <span className="font-mono text-gold bg-sky-dark/80 px-2 py-0.5 rounded border border-gold/30">
                  {inputText}
                </span>
              </div>
            </div>

          </div>

          {/* 2. Harf Harf Göktürkçe Ses Analizi (Nasıl Çevrildi?) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-sand uppercase tracking-wider">
              <Layers className="w-4 h-4 text-gold" />
              <span>Harf Harf Damga Seçimi ve Ses Kuralları</span>
            </div>

            {wordAnalyses.map((wa, wIdx) => (
              <div
                key={wIdx}
                className="rounded-xl bg-sky-navy/40 border border-gold/20 p-3 sm:p-4 space-y-3"
              >
                {/* Kelime Başlığı */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-sand text-sm">{wa.word}</span>
                    <span className="text-stone-medium">➔</span>
                    <span className="font-gokturk text-gold text-lg font-bold">{wa.gokturkWord}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-dark border border-gold/30 text-stone-sand">
                    {wa.harmony === 'back' ? 'Kalın Hece (a, ı, o, u)' : 'İnce Hece (e, i, ö, ü)'}
                  </span>
                </div>

                {/* Harf Kartları Izgarası (Mobilde ve Masaüstünde Akıcı) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {wa.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-3 rounded-xl bg-sky-dark/80 border border-gold/25 hover:border-gold/50 transition-all flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-sky-navy border border-gold/40 flex items-center justify-center font-bold text-stone-sand text-xs">
                            {item.latin}
                          </span>
                          <span className="text-stone-medium text-xs">➔</span>
                          <span className="font-gokturk text-xl text-gold font-bold">
                            {item.rune}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold/15 text-gold-light border border-gold/30 font-semibold">
                          {item.ruleTitle}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-sand font-medium">
                        {item.runeName}
                      </div>

                      <p className="text-[11px] text-stone-medium leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}
