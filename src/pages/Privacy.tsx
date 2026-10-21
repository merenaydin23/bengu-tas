import React from 'react'
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react'
import { StoneCard } from '../components/common/StoneCard'

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Başlık */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Kişisel Veri ve Gizlilik Manifestosu</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-sand">
          Gizlilik & Açık Kaynak Lisansları
        </h1>
        <p className="text-stone-medium text-sm sm:text-base max-w-xl mx-auto">
          Bengü Taş, sıfır sunucu mimarisiyle cihazınızın içinde çalışır. Hiçbir görüntünüz veya metniniz dışarı çıkmaz.
        </p>
      </div>

      {/* 3 Temel Gizlilik İlkesi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StoneCard variant="gold" className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-stone-sand text-base">Sıfır Sunucu</h3>
          <p className="text-xs text-stone-medium leading-relaxed">
            Arka planda çalışan bir veritabanı veya API sunucusu yoktur. Tüm işlemler tarayıcınızın içinde WebAssembly ile yürütülür.
          </p>
        </StoneCard>

        <StoneCard variant="sky" className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-light/10 border border-sky-light/30 text-sky-light flex items-center justify-center mx-auto">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-stone-sand text-base">Sıfır İzleme</h3>
          <p className="text-xs text-stone-medium leading-relaxed">
            Reklam, izleme çerezi veya üçüncü taraf analitik betikleri barındırmaz. Çocuklar ve öğrenciler için %100 güvenlidir.
          </p>
        </StoneCard>

        <StoneCard variant="crimson" className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 text-crimson-light flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-stone-sand text-base">%100 Cihaz İçi</h3>
          <p className="text-xs text-stone-medium leading-relaxed">
            Kamera görüntüsü ve OCR ile taranan metinler yalnızca cihazınızın geçici belleğinde işlenir ve sayfayı kapattığınızda silinir.
          </p>
        </StoneCard>
      </div>

      {/* Lisans Bildirimleri (PRD 8.1 / Kısıt 6) */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-stone-sand flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold" />
          <span>Açık Kaynak Lisansları</span>
        </h2>

        {/* MIT License */}
        <StoneCard variant="default" className="space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2">
            <span className="font-bold text-stone-sand text-sm">Bengü Taş (Uygulama Kaynak Kodu)</span>
            <span className="px-2 py-0.5 rounded bg-sky-navy text-gold font-mono">MIT License</span>
          </div>
          <p className="text-stone-medium leading-relaxed">
            Copyright (c) 2026 Bengü Taş Projesi.
            Herhangi bir kısıtlama olmaksızın yazılımın kopyalanması, değiştirilmesi, dağıtılması ve ticari veya gayriticari kullanımı ücretsiz olarak serbest bırakılmıştır.
          </p>
        </StoneCard>

        {/* Noto Sans Old Turkic */}
        <StoneCard variant="default" className="space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2">
            <span className="font-bold text-stone-sand text-sm">Noto Sans Old Turkic (Yazı Tipi)</span>
            <span className="px-2 py-0.5 rounded bg-sky-navy text-gold font-mono">SIL OFL 1.1</span>
          </div>
          <p className="text-stone-medium leading-relaxed">
            Copyright 2022 The Noto Project Authors (https://github.com/notofonts/old-turkic).
            This Font Software is licensed under the SIL Open Font License, Version 1.1.
            Yazı tipi dosyaları projenin kendi <code className="text-gold">public/fonts/</code> klasöründe self-host edilmektedir; harici Google Fonts CDN sunucularına bağlanılmaz.
          </p>
        </StoneCard>

        {/* Tesseract.js */}
        <StoneCard variant="default" className="space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2">
            <span className="font-bold text-stone-sand text-sm">Tesseract.js & Tesseract OCR Core</span>
            <span className="px-2 py-0.5 rounded bg-sky-navy text-gold font-mono">Apache License 2.0</span>
          </div>
          <p className="text-stone-medium leading-relaxed">
            Copyright (c) 2019 Jerome Wu, Guillermo Webster, Naptha, and contributors.
            Licensed under the Apache License, Version 2.0.
            Tesseract WebAssembly çekirdeği ve Türkçe dil verisi projenin kendi <code className="text-gold">public/tesseract/</code> klasöründe yerel olarak barındırılmaktadır.
          </p>
        </StoneCard>
      </div>

    </div>
  )
}
