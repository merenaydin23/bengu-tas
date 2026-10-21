import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Sparkles, ArrowRight } from 'lucide-react'
import { StoneCard } from '../components/common/StoneCard'
import { convertToGokturk } from '../lib/gokturk/convert'

export const Home: React.FC = () => {
  const [sampleWord, setSampleWord] = useState('Türk')
  const convertedSample = convertToGokturk(sampleWord)

  const quickSamples = ['Türk', 'Tengri', 'Bilge Kağan', 'Bengü Taş', 'Kut']

  const steps = [
    { num: '1', title: 'Yaz', desc: 'Kâğıda koyu bir kalemle büyük harflerle Türkçe bir kelime yaz.', icon: '✍️' },
    { num: '2', title: 'Göster', desc: 'Kamerayı kâğıda tut veya doğrudan klavyenle yaz.', icon: '📸' },
    { num: '3', title: 'Oku', desc: '1300 yıllık Orhun harfleriyle oku, yazıt kartı olarak indir.', icon: '🏛️' }
  ]

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      
      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Dekoratif Işıklar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-sand tracking-tight leading-tight">
            Elinle yaz,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-crimson-light">
              atalarının yazısıyla
            </span>{' '}
            oku.
          </h1>
          <p className="text-stone-medium text-base sm:text-lg max-w-xl mx-auto">
            Kâğıda yazdığın Türkçe kelimeleri kameranla göster; anında Göktürk (Orhun) alfabesine dönüşsün.
          </p>
        </div>

        {/* Kocaman Tek CTA Butonu */}
        <div className="pt-2">
          <Link
            to="/cevir"
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark font-extrabold text-lg sm:text-xl shadow-2xl shadow-gold/30 hover:scale-105 transition-all active:scale-95 min-h-[56px]"
          >
            <Camera className="w-6 h-6" />
            <span>Kamerayı Aç</span>
            <Sparkles className="w-5 h-5 text-crimson" />
          </Link>
        </div>

        {/* Canlı Tek Dokunuş Önizleme */}
        <div className="pt-6 max-w-xl mx-auto">
          <StoneCard variant="gold" className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickSamples.map((word) => (
                <button
                  key={word}
                  onClick={() => setSampleWord(word)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    sampleWord === word
                      ? 'bg-gold text-sky-dark shadow-md scale-105'
                      : 'bg-sky-dark/80 border border-gold/20 text-stone-sand hover:border-gold'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-dark/90 border border-gold/30 flex items-center justify-between gap-4">
              <span className="text-xl sm:text-2xl font-bold text-stone-sand">{sampleWord}</span>
              <ArrowRight className="w-5 h-5 text-gold shrink-0" />
              <span className="font-gokturk text-3xl sm:text-5xl text-gold-light rune-glow">
                {convertedSample.gokturkText}
              </span>
            </div>
          </StoneCard>
        </div>

      </section>

      {/* 3 Adım */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <StoneCard key={st.num} variant="sky" className="space-y-2 text-center p-6">
              <span className="text-4xl block mb-2">{st.icon}</span>
              <h3 className="font-serif text-xl font-bold text-stone-sand">{st.title}</h3>
              <p className="text-xs text-stone-medium leading-relaxed">{st.desc}</p>
            </StoneCard>
          ))}
        </div>
      </section>

      {/* Türk Devletleri Hızlı Şeridi */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
          <h2 className="font-serif text-xl font-bold text-stone-sand">
            Tarihteki Türk Devletleri
          </h2>
          <Link to="/devletler" className="text-xs font-semibold text-gold hover:underline">
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { name: 'Asya Hun', period: 'MÖ 220', icon: '🐉' },
            { name: 'Göktürk', period: 'MS 552', icon: '🐺' },
            { name: 'Uygur', period: 'MS 744', icon: '☀️' },
            { name: 'Karahanlı', period: 'MS 840', icon: '🌙' },
            { name: 'Selçuklu', period: 'MS 1037', icon: '🦅' },
            { name: 'Osmanlı', period: 'MS 1299', icon: '🇹🇷' }
          ].map((st, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-sky-navy/60 border border-gold/20 text-center space-y-1 hover:border-gold/50 transition-all"
            >
              <div className="text-xl">{st.icon}</div>
              <h4 className="font-serif text-xs font-bold text-stone-sand truncate">{st.name}</h4>
              <p className="text-[10px] text-sky-light">{st.period}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
