import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Translate } from './pages/Translate'
import { About } from './pages/About'
import { Alphabet } from './pages/Alphabet'
import { States } from './pages/States'
import { Privacy } from './pages/Privacy'

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-sky-dark text-stone-sand selection:bg-gold selection:text-sky-dark">
        {/* Üst Navigasyon */}
        <Navbar />

        {/* Ana İçerik Alanı */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cevir" element={<Translate />} />
            <Route path="/hakkinda" element={<About />} />
            <Route path="/alfabe" element={<Alphabet />} />
            <Route path="/devletler" element={<States />} />
            <Route path="/gizlilik" element={<Privacy />} />
            {/* Bilinmeyen rotaları ana sayfaya yönlendir */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Alt Bilgi */}
        <Footer />
      </div>
    </Router>
  )
}
