import React, { useState } from 'react'
import { Copy, Check, Download, Share2, ArrowRightLeft } from 'lucide-react'
import { ConversionResult, ConversionMode, WritingDirection, SeparatorStyle } from '../../lib/gokturk/convert'
import { copyToClipboard, shareOrCopy } from '../../lib/export/share'
import { downloadStelePng } from '../../lib/export/png'
import confetti from 'canvas-confetti'

export interface GokturkOutputProps {
  conversion: ConversionResult
  latinText: string
  mode: ConversionMode
  direction: WritingDirection
  separator: SeparatorStyle
  onModeChange: (mode: ConversionMode) => void
  onDirectionChange: (dir: WritingDirection) => void
  onSeparatorChange: (sep: SeparatorStyle) => void
}

export const GokturkOutput: React.FC<GokturkOutputProps> = ({
  conversion,
  latinText,
  mode,
  direction,
  onModeChange,
  onDirectionChange
}) => {
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Kopyalama
  const handleCopy = async () => {
    if (!conversion.gokturkText) return
    const success = await copyToClipboard(conversion.gokturkText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // PNG İndirme
  const handleDownload = async () => {
    if (!conversion.gokturkText) return
    setIsExporting(true)
    try {
      await downloadStelePng({
        gokturkText: conversion.gokturkText,
        latinText,
        direction,
        authorNote: 'Bengü Taş'
      })
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4A017', '#4A90C2', '#9E1B1B']
      })
    } catch (err) {
      console.error('İndirme hatası:', err)
    } finally {
      setIsExporting(false)
    }
  }

  // Paylaşma
  const handleShare = async () => {
    if (!conversion.gokturkText) return
    await shareOrCopy({
      gokturkText: conversion.gokturkText,
      latinText,
      direction
    })
  }

  return (
    <div className="w-full space-y-4">
      
      {/* Zarif Seçenek Çubuğu */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="inline-flex rounded-xl p-0.5 bg-sky-navy/80 border border-gold/20">
          <button
            onClick={() => onModeChange('student')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'student' ? 'bg-gold text-sky-dark font-bold' : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            Öğrenci Modu
          </button>
          <button
            onClick={() => onModeChange('orkhon')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'orkhon' ? 'bg-gold text-sky-dark font-bold' : 'text-stone-medium hover:text-stone-sand'
            }`}
          >
            Orhun Usulü
          </button>
        </div>

        <button
          onClick={() => onDirectionChange(direction === 'rtl' ? 'ltr' : 'rtl')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-navy/80 hover:bg-sky-deep border border-gold/20 text-stone-sand font-medium transition-colors"
          title="Yazım Yönünü Değiştir"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-gold" />
          <span>{direction === 'rtl' ? 'Sağdan Sola' : 'Soldan Sağa'}</span>
        </button>
      </div>

      {/* Ana Göktürk Taş Yazıt Kartı (Göz Alıcı Odak Noktası) */}
      <div className="relative stone-texture rounded-3xl p-8 sm:p-14 border-2 border-gold/50 shadow-2xl overflow-hidden min-h-[240px] flex flex-col justify-between group">
        
        {/* Yazıt Köşe Süsleri */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gold/60 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gold/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gold/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gold/60 pointer-events-none" />

        {/* Göktürk Metin */}
        <div className="my-auto py-6">
          {conversion.gokturkText ? (
            <div
              dir={direction}
              aria-label={`Göktürkçe çeviri: ${latinText}`}
              className="font-gokturk text-4xl sm:text-6xl lg:text-7xl text-gold-light leading-relaxed tracking-wider select-all break-words animate-stone-reveal text-center drop-shadow-lg"
              style={{
                fontFamily: '"Noto Sans Old Turkic", monospace',
                textShadow: '0 4px 20px rgba(212,160,23,0.35)'
              }}
            >
              {conversion.gokturkText}
            </div>
          ) : (
            <div className="text-center py-6 text-stone-medium/70 text-sm font-medium">
              Kameraya yazını göster veya yukarıya yaz; Orhun harfleri burada belirecek...
            </div>
          )}
        </div>

        {/* Eylem Butonları */}
        {conversion.gokturkText && (
          <div className="pt-4 border-t border-gold/20 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-navy/90 hover:bg-sky-deep border border-gold/30 text-stone-sand text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-navy/90 hover:bg-sky-deep border border-gold/30 text-stone-sand text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow"
            >
              <Download className="w-4 h-4 text-gold" />
              <span>{isExporting ? 'Hazırlanıyor...' : 'Yazıtı İndir'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold hover:opacity-95 text-sky-dark text-xs sm:text-sm font-bold shadow-lg shadow-gold/20 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </div>
        )}

      </div>

    </div>
  )
}
