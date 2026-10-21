import React, { useState } from 'react'
import alphabetData from '../content/alphabet.json'
import { StoneCard } from '../components/common/StoneCard'
import { Layers, Trophy, Check, X } from 'lucide-react'
import confetti from 'canvas-confetti'

export const Alphabet: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'vowel' | 'back' | 'front' | 'compound'>('all')
  const [selectedRune, setSelectedRune] = useState<(typeof alphabetData)[0] | null>(null)

  // Mini Quiz Durumu
  const [quizScore, setQuizScore] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)

  const quizQuestions = [
    { question: '«Tengri» kelimesindeki ince T sesi hangi Göktürk işaretidir?', targetChar: '𐱅' },
    { question: '«Kağan» kelimesindeki gırtlaksı kalın K sesi hangi Göktürk işaretidir?', targetChar: '𐰴' },
    { question: '«Türk» kelimesindeki ö/ü yanı ince K sesi hangisidir?', targetChar: '𐰜' },
    { question: '«Balık» (şehir) kelimesindeki kalın B sesi hangisidir?', targetChar: '𐰉' },
    { question: '«Teŋri» kelimesindeki genizsi sağır nun (ŋ / ng) sesi hangisidir?', targetChar: '𐰭' }
  ]

  const currentQ = quizQuestions[quizIndex % quizQuestions.length]

  const handleQuizAnswer = (char: string) => {
    if (char === currentQ.targetChar) {
      setQuizFeedback('correct')
      setQuizScore((s) => s + 1)
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      })
      setTimeout(() => {
        setQuizFeedback(null)
        setQuizIndex((i) => i + 1)
      }, 1200)
    } else {
      setQuizFeedback('wrong')
      setTimeout(() => setQuizFeedback(null), 1200)
    }
  }

  // Filtreleme
  const filteredRunes = alphabetData.filter((r) => {
    if (filter === 'vowel') return r.type === 'vowel'
    if (filter === 'back') return r.harmony === 'back'
    if (filter === 'front') return r.harmony === 'front'
    if (filter === 'compound') return r.type === 'compound'
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Sayfa Başlığı */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-navy border border-gold/30 text-gold text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>38 İşaretlik Ebedî Alfabe</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-sand">
          Göktürk Alfabesi Tablosu
        </h1>
        <p className="text-stone-medium text-sm sm:text-base max-w-xl mx-auto">
          İşaretlerin üzerine dokunarak sesletimlerini, Latin karşılıklarını ve örnek kelimelerini keşfet.
        </p>
      </div>

      {/* Mini Oyun: "Bu Harfi Bul!" Sınaması */}
      <StoneCard variant="gold" className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold/20 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            <span className="font-serif font-bold text-stone-sand text-lg">
              Mini Oyun: Bu Harfi Bul!
            </span>
          </div>
          <div className="text-xs text-stone-medium flex items-center gap-2">
            <span>Doğru Sayısı:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold text-sm">
              {quizScore}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-stone-sand text-sm sm:text-base font-semibold">
            {currentQ.question}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {alphabetData
              .filter((r) => ['𐱅', '𐰴', '𐰜', '𐰉', '𐰭', '𐱃', '𐰚', '𐰋'].includes(r.char))
              .map((r) => (
                <button
                  key={r.char}
                  onClick={() => handleQuizAnswer(r.char)}
                  className="w-12 h-12 rounded-xl bg-sky-dark hover:bg-sky-deep border border-gold/30 hover:border-gold font-gokturk text-2xl text-gold-light flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow"
                >
                  {r.char}
                </button>
              ))}
          </div>

          {quizFeedback === 'correct' && (
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Harika! Doğru işareti buldun.</span>
            </div>
          )}

          {quizFeedback === 'wrong' && (
            <div className="inline-flex items-center gap-2 text-xs text-crimson-light font-bold bg-crimson/20 px-3 py-1.5 rounded-lg animate-fade-in">
              <X className="w-4 h-4" />
              <span>Tekrar dene! İpucu: Kalınlık ve incelik uyumuna dikkat et.</span>
            </div>
          )}
        </div>
      </StoneCard>

      {/* Filtreleme Düğmeleri */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all', label: 'Tüm Harfler' },
          { id: 'vowel', label: 'Ünlüler' },
          { id: 'back', label: 'Kalın Ünsüzler' },
          { id: 'front', label: 'İnce Ünsüzler' },
          { id: 'compound', label: 'Birleşik Harfler' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === btn.id
                ? 'bg-gold text-sky-dark font-bold shadow-md shadow-gold/20'
                : 'bg-sky-navy border border-gold/20 text-stone-medium hover:text-stone-sand hover:border-gold/40'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Harf Kartları Izgarası */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredRunes.map((r) => {
          const isSelected = selectedRune?.char === r.char
          return (
            <button
              key={r.char}
              onClick={() => setSelectedRune(r)}
              className={`p-4 rounded-2xl text-center space-y-2 transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-navy to-sky-deep border-2 border-gold shadow-lg shadow-gold/20 scale-105'
                  : 'bg-sky-navy/70 hover:bg-sky-navy border border-gold/20 hover:border-gold/50'
              }`}
            >
              <div className="font-gokturk text-4xl sm:text-5xl text-gold-light group-hover:scale-110 transition-transform my-2">
                {r.char}
              </div>
              <div className="text-sm font-bold text-stone-sand truncate">{r.latin}</div>
              <div className="text-[10px] text-stone-medium uppercase tracking-wider">{r.code}</div>
            </button>
          )
        })}
      </div>

      {/* Seçilen Harfin Detay Kartı */}
      {selectedRune && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <StoneCard variant="gold" className="max-w-md w-full space-y-4 animate-stone-reveal">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="font-gokturk text-6xl text-gold-light p-2 bg-sky-dark rounded-xl border border-gold/40">
                  {selectedRune.char}
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-sand">{selectedRune.latin}</h3>
                  <span className="text-xs text-sky-light">{selectedRune.name}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRune(null)}
                className="p-1.5 rounded-lg bg-sky-dark border border-gold/30 text-stone-medium hover:text-stone-sand"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="p-3 rounded-lg bg-sky-dark border border-gold/20 space-y-1">
                <span className="text-gold font-bold block">Sesletim İpucu:</span>
                <p className="text-stone-sand leading-relaxed">{selectedRune.tip}</p>
              </div>

              <div className="p-3 rounded-lg bg-sky-dark border border-gold/20 space-y-1">
                <span className="text-sky-light font-bold block">Örnek Kelime:</span>
                <p className="text-stone-sand font-medium">{selectedRune.sample}</p>
              </div>

              <div className="flex items-center justify-between text-stone-medium pt-1">
                <span>Unicode Kod Noktası:</span>
                <code className="text-gold font-mono">{selectedRune.code}</code>
              </div>
            </div>
          </StoneCard>
        </div>
      )}

    </div>
  )
}
