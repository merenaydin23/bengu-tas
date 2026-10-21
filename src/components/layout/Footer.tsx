import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { SunPattern, Star16 } from '../motifs/TurkishMotifs'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gold/20 bg-sky-dark text-stone-medium text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Marka & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SunPattern size={32} color="#D4A017" />
              <span className="font-serif text-xl font-bold text-stone-sand tracking-wider">
                BENGÜ TAŞ
              </span>
            </div>
            <p className="text-stone-medium text-sm leading-relaxed max-w-md">
              «Elinle yaz, atalarının yazısıyla oku.» — Çocuklar ve öğrenciler için geliştirilmiş,
              tamamen istemci taraflı, sunucusuz ve açık kaynaklı Göktürkçe çeviri ve kültür portalı.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-navy border border-gold/20 text-xs text-gold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>%100 Cihaz İçi · Sıfır Sunucu · Sıfır İzleme</span>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h4 className="font-serif font-bold text-stone-sand text-sm uppercase tracking-wider mb-3">
              Keşfet
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cevir" className="hover:text-gold transition-colors">
                  Yazını Göster (Kamera / OCR)
                </Link>
              </li>
              <li>
                <Link to="/alfabe" className="hover:text-gold transition-colors">
                  Göktürk Alfabesi Tablosu
                </Link>
              </li>
              <li>
                <Link to="/devletler" className="hover:text-gold transition-colors">
                  Türk Devletleri Zaman Çizelgesi
                </Link>
              </li>
              <li>
                <Link to="/hakkinda" className="hover:text-gold transition-colors">
                  Orhun Yazıtları Tarihi
                </Link>
              </li>
            </ul>
          </div>

          {/* Açık Kaynak ve Lisanslar */}
          <div>
            <h4 className="font-serif font-bold text-stone-sand text-sm uppercase tracking-wider mb-3">
              Lisanslar & Güven
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-stone-sand font-medium">Kod Lisansı:</span> MIT License
              </li>
              <li>
                <span className="text-stone-sand font-medium">Yazı Tipi:</span> Noto Sans Old Turkic (SIL OFL)
              </li>
              <li>
                <span className="text-stone-sand font-medium">OCR Motoru:</span> Tesseract.js (Apache-2.0)
              </li>
              <li className="pt-2">
                <Link to="/gizlilik" className="text-sky-light hover:text-gold underline transition-colors">
                  Gizlilik & Lisans Metnini Oku →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Alt Çizgi */}
        <div className="pt-8 border-t border-sky-navy flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Star16 size={18} color="#D4A017" />
            <span>Bengü Taş Projesi · Türk kültürüne ve geleceğin bilginlerine armağandır.</span>
          </div>
          <div className="flex items-center gap-1 text-stone-medium">
            <span>Eğitim amaçlı geliştirilmiştir.</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
