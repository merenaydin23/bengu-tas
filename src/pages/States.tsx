import React from 'react'
import statesData from '../content/states.json'
import { StoneCard } from '../components/common/StoneCard'
import { History, MapPin, Calendar, Info } from 'lucide-react'

export const States: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Başlık */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-navy border border-gold/30 text-gold text-xs font-semibold">
          <History className="w-4 h-4" />
          <span>Tarihin Derinliklerinden Bugüne</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-sand">
          Tarihteki Türk Devletleri
        </h1>
        <p className="text-stone-medium text-sm sm:text-base max-w-xl mx-auto">
          Asya bozkırlarından üç kıtaya uzanan medeniyetler ve kurulan büyük teşkilatlar.
        </p>
      </div>

      {/* Tarihî Bilgilendirme Notu (PRD 5.9) */}
      <div className="p-4 rounded-xl bg-sky-navy/80 border border-gold/30 flex items-start gap-3 text-xs text-stone-medium">
        <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tarih boyunca kurulan devletlerin kesin başlangıç ve bitiş tarihleri hakkında farklı kaynaklarda farklı görüşler yer alabildiğinden tarihler <strong>«yaklaşık»</strong> olarak verilmiştir. Bu liste eğitim amaçlı hazırlanmış olup <code className="text-gold font-mono">src/content/states.json</code> dosyası üzerinden kolayca düzenlenebilir.
        </p>
      </div>

      {/* Zaman Çizgisi (Timeline) */}
      <div className="relative border-l-2 border-gold/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
        {statesData.map((st) => (
          <div key={st.id} className="relative group">
            
            {/* Zaman Çizgisi Noktası */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-sky-dark border-2 border-gold flex items-center justify-center group-hover:scale-125 transition-transform">
              <div className="w-2 h-2 rounded-full bg-gold" />
            </div>

            <StoneCard variant="sky" className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {st.symbolType === 'wolf' ? '🐺' : st.symbolType === 'sun' ? '☀️' : st.symbolType === 'dragon' ? '🐉' : st.symbolType === 'crescent' ? '🌙' : st.symbolType === 'falcon' ? '🦅' : st.symbolType === 'star16' ? '🇹🇷' : '🏛️'}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-sand">
                    {st.name}
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-sky-dark/80 px-2.5 py-1 rounded-lg border border-gold/20 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{st.period}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-sky-light">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{st.region}</span>
              </div>

              <p className="text-stone-medium text-xs sm:text-sm leading-relaxed">
                {st.description}
              </p>
            </StoneCard>

          </div>
        ))}
      </div>

    </div>
  )
}
