import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, BookOpen, Layers, History, Shield, Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { SunPattern } from '../motifs/TurkishMotifs'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const location = useLocation()

  // Tema yönetimi
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [isDark])

  // Rota değişince mobil menüyü kapat
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'Ana Sayfa', icon: SunPattern },
    { to: '/cevir', label: 'Çevirmen', icon: Camera, highlight: true },
    { to: '/hakkinda', label: 'Göktürkçe Hakkında', icon: BookOpen },
    { to: '/alfabe', label: 'Alfabe & Kartlar', icon: Layers },
    { to: '/devletler', label: 'Türk Devletleri', icon: History },
    { to: '/gizlilik', label: 'Gizlilik', icon: Shield }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-sky-dark/95 backdrop-blur-md border-b border-gold/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo ve Başlık */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-gold rounded-lg p-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gold/30 via-crimson/30 to-sky-deep flex items-center justify-center border border-gold/50 group-hover:scale-105 transition-transform">
              <span className="font-gokturk text-xl sm:text-2xl text-gold rune-glow">𐱅𐰇𐰼𐰜</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-wider text-stone-sand group-hover:text-gold transition-colors">
                  BENGÜ TAŞ
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-crimson/30 text-gold border border-crimson/60 font-semibold tracking-wide">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-sky-light hidden sm:block">
                Elinle yaz, atalarının yazısıyla oku.
              </p>
            </div>
          </Link>

          {/* Masaüstü Menü */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`ml-2 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-sky-dark font-bold shadow-gold/20'
                        : 'bg-crimson hover:bg-crimson-light text-stone-sand border border-gold/30 hover:shadow-crimson/20'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Yazını Göster</span>
                    <Sparkles className="w-3.5 h-3.5 text-gold-shimmer" />
                  </Link>
                )
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-gold bg-sky-navy border border-gold/30'
                      : 'text-stone-medium hover:text-stone-sand hover:bg-sky-navy/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Tema Butonu */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="ml-3 p-2.5 rounded-xl bg-sky-navy border border-gold/20 text-gold hover:text-gold-light hover:border-gold/50 transition-all focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
              title={isDark ? 'Açık tema' : 'Koyu tema'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobil Menü Butonları */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-sky-navy border border-gold/20 text-gold"
              aria-label="Tema Değiştir"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-sky-navy border border-gold/20 text-stone-sand hover:text-gold focus:outline-none"
              aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {isOpen && (
        <div className="lg:hidden border-b border-gold/20 bg-sky-dark/98 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[48px] ${
                  isActive
                    ? 'bg-sky-navy text-gold border border-gold/40'
                    : 'text-stone-sand hover:bg-sky-navy/60'
                }`}
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-crimson text-stone-sand font-bold">
                    Kamera
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
