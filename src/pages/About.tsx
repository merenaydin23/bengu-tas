import React from 'react'
import aboutData from '../content/about.json'
import { StoneCard } from '../components/common/StoneCard'
import { TamgaMotif } from '../components/motifs/TurkishMotifs'
import { BookOpen, ExternalLink, Info } from 'lucide-react'

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Başlık */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-navy border border-gold/30 text-gold text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Eski Türk Dili ve Kültürü</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-sand">
          {aboutData.title}
        </h1>
        <p className="text-stone-medium text-sm sm:text-base max-w-xl mx-auto">
          Atalarımızın 1300 yıl önce diktiği ebedî taşların ve Türk yazısının büyüleyici hikâyesi.
        </p>
      </div>

      {/* Sorumluluk Reddi / Eğitsel Not (FR-NAV / 5.8) */}
      <div className="p-4 rounded-xl bg-sky-navy/80 border border-gold/30 flex items-start gap-3 text-xs text-stone-medium">
        <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <p className="leading-relaxed">{aboutData.disclaimer}</p>
      </div>

      {/* Ünlü Uyumu Görsel Şeması (Özel İnteraktif Kart) */}
      <StoneCard variant="gold" className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">
            Alfabenin En İlginç Sırrı
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-sand">
            Neden İki Çeşit 'B', 'D', 'T', 'K' Var?
          </h3>
          <p className="text-sm text-stone-medium max-w-lg mx-auto">
            Göktürkler, kelimenin kalın mı yoksa ince mi okunduğunu harfin kendi şeklinden anlıyorlardı!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Kalın Seri */}
          <div className="p-5 rounded-xl bg-sky-dark/90 border border-gold/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-gold/20 text-gold font-bold text-xs uppercase">
                Kalın Seri (a, ı, o, u)
              </span>
              <span className="text-xs text-stone-medium">Art Damaksıl</span>
            </div>
            <div className="flex items-center justify-around py-3">
              <div className="text-center">
                <span className="font-gokturk text-4xl text-gold-light block">𐱃</span>
                <span className="text-xs text-stone-sand mt-1 block">T (Kalın)</span>
                <span className="text-[11px] text-stone-medium">ör. Taş</span>
              </div>
              <div className="text-center">
                <span className="font-gokturk text-4xl text-gold-light block">𐰴</span>
                <span className="text-xs text-stone-sand mt-1 block">K (Kalın)</span>
                <span className="text-[11px] text-stone-medium">ör. Kağan</span>
              </div>
              <div className="text-center">
                <span className="font-gokturk text-4xl text-gold-light block">𐰉</span>
                <span className="text-xs text-stone-sand mt-1 block">B (Kalın)</span>
                <span className="text-[11px] text-stone-medium">ör. Balık</span>
              </div>
            </div>
          </div>

          {/* İnce Seri */}
          <div className="p-5 rounded-xl bg-sky-dark/90 border border-sky-light/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-sky-light/20 text-sky-light font-bold text-xs uppercase">
                İnce Seri (e, i, ö, ü)
              </span>
              <span className="text-xs text-stone-medium">Ön Damaksıl</span>
            </div>
            <div className="flex items-center justify-around py-3">
              <div className="text-center">
                <span className="font-gokturk text-4xl text-sky-light block">𐱅</span>
                <span className="text-xs text-stone-sand mt-1 block">T (İnce)</span>
                <span className="text-[11px] text-stone-medium">ör. Tengri</span>
              </div>
              <div className="text-center">
                <span className="font-gokturk text-4xl text-sky-light block">𐰚</span>
                <span className="text-xs text-stone-sand mt-1 block">K (İnce)</span>
                <span className="text-[11px] text-stone-medium">ör. Kül</span>
              </div>
              <div className="text-center">
                <span className="font-gokturk text-4xl text-sky-light block">𐰋</span>
                <span className="text-xs text-stone-sand mt-1 block">B (İnce)</span>
                <span className="text-[11px] text-stone-medium">ör. Bilge</span>
              </div>
            </div>
          </div>

        </div>
      </StoneCard>

      {/* Bölümler */}
      <div className="space-y-6">
        {aboutData.sections.map((sec) => (
          <StoneCard key={sec.id} variant="sky" className="space-y-3">
            <div className="flex items-center gap-2.5">
              <TamgaMotif size={24} color="#D4A017" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-sand">
                {sec.title}
              </h2>
            </div>
            <p className="text-xs text-gold font-medium">{sec.summary}</p>
            <div className="text-stone-medium text-sm leading-relaxed whitespace-pre-line pt-1">
              {sec.content}
            </div>
          </StoneCard>
        ))}
      </div>

      {/* Kaynakça (FR-NAV / 5.8) */}
      <StoneCard variant="default" className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-stone-sand flex items-center gap-2">
          <span>Kaynakça & Bilimsel Referanslar</span>
        </h3>
        <p className="text-xs text-stone-medium">
          Bengü Taş uygulamasında yer alan dil ve tarih bilgileri aşağıdaki güvenilir kurumların ve standartların yayınları esas alınarak derlenmiştir:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {aboutData.sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-sky-dark hover:bg-sky-navy border border-gold/20 hover:border-gold/50 transition-all block group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-stone-sand group-hover:text-gold mb-1">
                <span>{src.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-medium group-hover:text-gold" />
              </div>
              <p className="text-[11px] text-stone-medium leading-normal">{src.desc}</p>
            </a>
          ))}
        </div>
      </StoneCard>

    </div>
  )
}
