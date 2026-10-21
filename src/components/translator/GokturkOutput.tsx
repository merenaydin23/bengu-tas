import React, { useState } from 'react'
import { Copy, Check, Download, Share2, HelpCircle, ArrowRightLeft, SlidersHorizontal } from 'lucide-react'
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
  separator,
  onModeChange,
  onDirectionChange,
  onSeparatorChange
}) => {
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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
        authorNote: 'Bengü Taş ile yazıldı'
      })
      confetti({
        particleCount: 40,
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
      
      {/* Ayarlar ve Kontrol Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-sky-navy/80 rounded-xl border border-gold/20 text-xs">
        
        {/* Mod & Yön Seçimi */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Öğrenci Modu / Orhun Usulü */}
          <div className="inline-flex rounded-lg p-0.5 bg-sky-dark border border-gold/20">
            <button
              onClick={() => onModeChange('student')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mode === 'student' ? 'bg-gold text-sky-dark font-bold' : 'text-stone-medium hover:text-stone-sand'
              }`}
            >
              Öğrenci Modu
            </button>
            <button
              onClick={() => onModeChange('orkhon')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mode === 'orkhon' ? 'bg-gold text-sky-dark font-bold' : 'text-stone-medium hover:text-stone-sand'
              }`}
            >
              Orhun Usulü
            </button>
          </div>

          {/* Yön Değiştirici */}
          <button
            onClick={() => onDirectionChange(direction === 'rtl' ? 'ltr' : 'rtl')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-dark hover:bg-sky-deep border border-gold/20 text-stone-sand font-medium transition-colors"
            title="Yazım Yönünü Değiştir"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-gold" />
            <span>{direction === 'rtl' ? 'Sağdan Sola (RTL)' : 'Soldan Sağa (LTR)'}</span>
          </button>
        </div>

        {/* Ayırıcı ve Gelişmiş Ayarlar Butonu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg bg-sky-dark hover:bg-sky-deep border border-gold/20 text-gold"
            title="Kelime Ayracı ve İnce Ayarlar"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Ekstra Seçenek Paneli (Açılır/Kapanır) */}
      {showSettings && (
        <div className="p-3 bg-sky-navy/60 rounded-xl border border-gold/20 text-xs flex flex-wrap items-center gap-4 animate-fade-in">
          <span className="text-stone-medium">Kelime Ayracı:</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'two_dot', label: 'İki Nokta (⁚ Yazıt)' },
              { id: 'colon', label: 'Kolon (:)' },
              { id: 'space', label: 'Boşluk ( )' }
            ].map((sep) => (
              <button
                key={sep.id}
                onClick={() => onSeparatorChange(sep.id as SeparatorStyle)}
                className={`px-2.5 py-1 rounded-md border transition-colors ${
                  separator === sep.id
                    ? 'border-gold bg-gold/20 text-gold font-bold'
                    : 'border-transparent text-stone-medium hover:text-stone-sand'
                }`}
              >
                {sep.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ana Göktürk Yazıt Alanı (Stele Card) */}
      <div className="relative stone-texture rounded-2xl p-6 sm:p-10 border-2 border-gold/40 shadow-2xl overflow-hidden min-h-[220px] flex flex-col justify-between">
        
        {/* Yazıt Köşe Süsleri */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold pointer-events-none" />

        {/* Göktürk Metin Gösterimi */}
        <div className="my-auto py-4">
          {conversion.gokturkText ? (
            <div
              dir={direction}
              aria-label={`Göktürkçe çeviri: ${latinText}`}
              className="font-gokturk text-3xl sm:text-5xl lg:text-6xl text-gold-light leading-relaxed tracking-wider select-all break-words animate-stone-reveal"
              style={{
                fontFamily: '"Noto Sans Old Turkic", monospace',
                textShadow: '0 2px 10px rgba(212,160,23,0.2)'
              }}
            >
              {conversion.gokturkText}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-medium italic">
              Yazını gösterdiğinde veya kutuya yazdığında Göktürkçe karşılığı burada belirecek...
            </div>
          )}
        </div>

        {/* Kart Altı Bilgi & Eylemler */}
        <div className="pt-4 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Yazıt Bilgisi */}
          <div className="text-stone-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-subtle" />
            <span>Noto Sans Old Turkic · {direction === 'rtl' ? 'Sağdan Sola' : 'Soldan Sağa'}</span>
          </div>

          {/* Eylem Butonları */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              disabled={!conversion.gokturkText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-navy hover:bg-sky-deep border border-gold/30 text-stone-sand font-medium transition-all active:scale-95 disabled:opacity-40"
              title="Göktürk Metnini Panoya Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
              <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!conversion.gokturkText || isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-navy hover:bg-sky-deep border border-gold/30 text-stone-sand font-medium transition-all active:scale-95 disabled:opacity-40"
              title="Yazıt Görseli Olarak PNG İndir"
            >
              <Download className="w-4 h-4 text-gold" />
              <span>{isExporting ? 'Hazırlanıyor...' : 'PNG İndir'}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={!conversion.gokturkText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold hover:bg-gold-light text-sky-dark font-bold transition-all active:scale-95 disabled:opacity-40"
              title="Paylaş veya Gönder"
            >
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </div>

        </div>

      </div>

      {/* Yaklaşık Çeviri Bildirim Rozetleri (FR-CONV) */}
      {conversion.hasApproximations && (
        <div className="p-3.5 rounded-xl bg-crimson/15 border border-crimson/40 text-xs text-stone-sand space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 font-semibold text-crimson-light">
            <HelpCircle className="w-4 h-4" />
            <span>Yaklaşık Harf Eşleme Bilgisi</span>
          </div>
          <div className="space-y-1 pl-6 text-stone-medium">
            {conversion.approximations.map((app, idx) => (
              <p key={idx}>
                • <strong className="text-gold uppercase">{app.latinChar}</strong>: {app.reason}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Orhun Usulü Notu */}
      {mode === 'orkhon' && (
        <p className="text-[11px] text-stone-medium italic px-2">
          * Orhun Usulü: Tarihî yazıtlardaki gibi orta hece ses düşmeleri ve birleşik harfler eğitsel amaçla modellenmiştir; akademik transkripsiyon değildir.
        </p>
      )}

    </div>
  )
}
