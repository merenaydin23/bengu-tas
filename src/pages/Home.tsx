import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react'
import { StoneCard } from '../components/common/StoneCard'
import { Star16, TamgaMotif } from '../components/motifs/TurkishMotifs'
import { convertToGokturk } from '../lib/gokturk/convert'

export const Home: React.FC = () => {
  const [sampleWord, setSampleWord] = useState('Türk')
  const convertedSample = convertToGokturk(sampleWord)

  const quickSamples = ['Türk', 'Tengri', 'Bilge Kağan', 'Bengü Taş', 'Kut']

  const steps = [
    {
      num: '1',
      title: 'Kâğıda Yaz',
      desc: 'Beyaz bir kâğıda koyu bir kalemle büyük harflerle Türkçe bir sözcük veya cümle yaz.',
      icon: '✍️'
    },
    {
      num: '2',
      title: 'Kameranı Göster',
      desc: 'Uygulamayı aç ve kameranı kâğıdın üzerine tut; tarayıcın yazıyı anında tanısın.',
      icon: '📸'
    },
    {
      num: '3',
      title: 'Atalarının Yazısıyla Oku',
      desc: 'Yazın 1300 yıllık Orhun harflerine dönüşsün; yazıt kartı olarak indir ve paylaş!',
      icon: '🏛️'
    }
  ]

  return (
    <div className="space-y-24 py-8">
      
      {/* 1. Hero Bölümü */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Dekoratif Arka Plan Işıkları */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-sky-light/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-navy/80 border border-gold/30 text-gold text-xs sm:text-sm font-semibold shadow-inner">
          <Star16 size={18} color="#D4A017" />
          <span>Bin Üç Yüz Yıllık Miras Şimdi Ekranında</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-sand tracking-tight leading-tight">
            Elinle yaz,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-crimson-light">
              atalarının yazısıyla
            </span>{' '}
            oku.
          </h1>
          <p className="text-stone-medium text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Kâğıda yazdığın Türkçe sözcükleri kameranla göster; tarayıcın okusun ve anında Göktürk (Orhun) alfabesine dönüştürsün.
          </p>
        </div>

        {/* CTA Butonları */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/cevir"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark font-bold text-lg shadow-xl shadow-gold/20 hover:shadow-gold/40 hover:scale-105 transition-all active:scale-95 min-h-[56px]"
          >
            <Camera className="w-6 h-6" />
            <span>Yazını Göster (Kamera)</span>
            <Sparkles className="w-5 h-5 text-crimson" />
          </Link>

          <Link
            to="/hakkinda"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-sky-navy/90 hover:bg-sky-deep text-stone-sand border border-gold/30 font-semibold text-base transition-all active:scale-95 min-h-[56px]"
          >
            <BookOpen className="w-5 h-5 text-sky-light" />
            <span>Göktürkçe Nedir?</span>
          </Link>
        </div>

        {/* Canlı İnteraktif Mini Deneme Şeridi */}
        <div className="pt-10 max-w-2xl mx-auto">
          <StoneCard variant="gold" className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-medium">
              <span>Hızlı Canlı Önizleme:</span>
              <span className="text-gold font-medium">Dokun ve Değiştir</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickSamples.map((word) => (
                <button
                  key={word}
                  onClick={() => setSampleWord(word)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sampleWord === word
                      ? 'bg-gold text-sky-dark shadow-md shadow-gold/30 scale-105'
                      : 'bg-sky-dark border border-gold/20 text-stone-sand hover:border-gold'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sky-dark/80 border border-gold/30 flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-sky-light block">Türkçe:</span>
                <span className="text-xl font-bold text-stone-sand">{sampleWord}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gold shrink-0" />
              <div className="text-right">
                <span className="text-xs text-sky-light block">Göktürkçe:</span>
                <span className="font-gokturk text-3xl sm:text-4xl text-gold-light rune-glow">
                  {convertedSample.gokturkText}
                </span>
              </div>
            </div>
          </StoneCard>
        </div>

      </section>

      {/* 2. Üç Adımda Nasıl Çalışır? */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-gold tracking-widest uppercase">
            <TamgaMotif size={20} />
            <span>Basit ve Eğlenceli</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-sand">
            Üç Adımda Göktürkçe Yazıtını Çıkar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => (
            <StoneCard key={st.num} variant="sky" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{st.icon}</span>
                <span className="w-8 h-8 rounded-full bg-gold/20 border border-gold text-gold font-bold flex items-center justify-center text-sm">
                  {st.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-sand">{st.title}</h3>
              <p className="text-sm text-stone-medium leading-relaxed">{st.desc}</p>
            </StoneCard>
          ))}
        </div>
      </section>

      {/* 3. Türk Devletleri Şeridi & Kültür Mirası */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <span className="text-xs font-bold text-gold tracking-widest uppercase block mb-1">
              Tarih Şeridi
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-sand">
              Tarihten Geleceğe Türk Devletleri
            </h2>
          </div>
          <Link
            to="/devletler"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
          >
            <span>Tüm Devletleri Gör</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Asya Hun', period: 'MÖ 220', icon: '🐉' },
            { name: 'Göktürk Kağanlığı', period: 'MS 552', icon: '🐺' },
            { name: 'Uygur Devleti', period: 'MS 744', icon: '☀️' },
            { name: 'Karahanlılar', period: 'MS 840', icon: '🌙' },
            { name: 'Büyük Selçuklu', period: 'MS 1037', icon: '🦅' },
            { name: 'Osmanlı Devleti', period: 'MS 1299', icon: '⭐' }
          ].map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-sky-navy/60 border border-gold/20 text-center space-y-2 hover:border-gold/60 transition-all hover:-translate-y-1"
            >
              <div className="text-2xl">{st.icon}</div>
              <h4 className="font-serif text-sm font-bold text-stone-sand">{st.name}</h4>
              <p className="text-[11px] text-sky-light">{st.period}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Güven ve Sıfır Sunucu Bildirimi */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <StoneCard variant="gold" className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-sand">
            Görüntülerin Cihazından Asla Çıkmaz
          </h3>
          <p className="text-stone-medium text-sm leading-relaxed max-w-xl mx-auto">
            Bengü Taş, tamamen web tarayıcın içinde çalışan yapay zekâ ve OCR motoru kullanır. Kameranla çektiğin kâğıtlar, fotoğraflar ve yazdığın hiçbir metin bir sunucuya yüklenmez, depolanmaz veya izlenmez.
          </p>
          <div className="pt-2">
            <Link
              to="/gizlilik"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold"
            >
              <span>Gizlilik & Açık Kaynak Lisansları</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </StoneCard>
      </section>

    </div>
  )
}
