/**
 * Bengü Taş — Yazıt Görünümlü PNG Üretim Motoru (FR-OUT)
 * Göktürk metnini bozkır ve taş yazıt estetiğinde (bordo, altın ve taş dokulu)
 * yüksek çözünürlüklü bir hatıra kartı olarak Canvas'a çizer ve indirir.
 */

export interface ExportCardOptions {
  gokturkText: string
  latinText: string
  direction?: 'rtl' | 'ltr'
  authorNote?: string
}

export async function generateStelePng(options: ExportCardOptions): Promise<Blob> {
  const { gokturkText, latinText, direction = 'rtl', authorNote } = options

  // Fontun yüklendiğinden emin ol
  if ('fonts' in document) {
    try {
      await document.fonts.load('48px "Noto Sans Old Turkic"')
      await document.fonts.load('24px "Cinzel"')
    } catch (e) {
      console.warn('Font loading check:', e)
    }
  }

  const canvas = document.createElement('canvas')
  const width = 1200
  const height = 1500
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 2D context oluşturulamadı.')
  }

  // 1. Zemin: Derin Bozkır Gece / Yazıt Taşı Dokusu
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#0E1B2B')
  grad.addColorStop(0.5, '#15263B')
  grad.addColorStop(1, '#08101A')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // 2. Taş Yazıt Monolit Gövdesi
  const pad = 60
  const steleX = pad
  const steleY = pad
  const steleW = width - pad * 2
  const steleH = height - pad * 2

  // İç degrade ve taş dokusu
  const steleGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7)
  steleGrad.addColorStop(0, '#1E354F')
  steleGrad.addColorStop(1, '#112133')
  ctx.fillStyle = steleGrad
  ctx.roundRect(steleX, steleY, steleW, steleH, 32)
  ctx.fill()

  // 3. Altın & Bordo İşlemeli Çift Çerçeve
  // Dış altın çerçeve
  ctx.strokeStyle = '#D4A017'
  ctx.lineWidth = 6
  ctx.stroke()

  // İç bordo çerçeve
  ctx.strokeStyle = '#9E1B1B'
  ctx.lineWidth = 3
  ctx.roundRect(steleX + 16, steleY + 16, steleW - 32, steleH - 32, 24)
  ctx.stroke()

  // Köşe süsleri (Dört köşede Orhun tamga üçgeni)
  const cornerSize = 40
  ctx.fillStyle = '#D4A017'
  // Sol üst
  ctx.beginPath()
  ctx.moveTo(steleX + 24, steleY + 24)
  ctx.lineTo(steleX + 24 + cornerSize, steleY + 24)
  ctx.lineTo(steleX + 24, steleY + 24 + cornerSize)
  ctx.fill()
  // Sağ üst
  ctx.beginPath()
  ctx.moveTo(steleX + steleW - 24, steleY + 24)
  ctx.lineTo(steleX + steleW - 24 - cornerSize, steleY + 24)
  ctx.lineTo(steleX + steleW - 24, steleY + 24 + cornerSize)
  ctx.fill()
  // Sol alt
  ctx.beginPath()
  ctx.moveTo(steleX + 24, steleY + steleH - 24)
  ctx.lineTo(steleX + 24 + cornerSize, steleY + steleH - 24)
  ctx.lineTo(steleX + 24, steleY + steleH - 24 - cornerSize)
  ctx.fill()
  // Sağ alt
  ctx.beginPath()
  ctx.moveTo(steleX + steleW - 24, steleY + steleH - 24)
  ctx.lineTo(steleX + steleW - 24 - cornerSize, steleY + steleH - 24)
  ctx.lineTo(steleX + steleW - 24, steleY + steleH - 24 - cornerSize)
  ctx.fill()

  // 4. Tepe Başlığı: Bengü Taş & Güneş Motifi
  // Stilize güneş
  ctx.beginPath()
  ctx.arc(width / 2, steleY + 110, 36, 0, Math.PI * 2)
  ctx.fillStyle = '#D4A017'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(width / 2, steleY + 110, 20, 0, Math.PI * 2)
  ctx.fillStyle = '#112133'
  ctx.fill()

  // "BENGÜ TAŞ" Başlığı
  ctx.font = '700 36px "Cinzel", Georgia, serif'
  ctx.fillStyle = '#F3E9D2'
  ctx.textAlign = 'center'
  ctx.fillText('BENGÜ TAŞ', width / 2, steleY + 190)

  // Slogan
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#4A90C2'
  ctx.fillText('Elinle yaz, atalarının yazısıyla oku', width / 2, steleY + 225)

  // Altın Ayırıcı Çizgi
  ctx.strokeStyle = '#D4A017'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width / 2 - 200, steleY + 250)
  ctx.lineTo(width / 2 + 200, steleY + 250)
  ctx.stroke()

  // 5. Ana Göktürk Metni (Gövde)
  ctx.font = '64px "Noto Sans Old Turkic", monospace'
  ctx.fillStyle = '#D4A017'
  ctx.textAlign = direction === 'rtl' ? 'right' : 'left'

  // Çok satırlı metni sığdırma
  const maxTextWidth = steleW - 160
  const startX = direction === 'rtl' ? width - steleX - 80 : steleX + 80
  let currentY = steleY + 360

  const lines = gokturkText.split('\n')
  for (const line of lines) {
    // Kelimelere göre satır sarma
    const words = line.split('\u205A')
    let lineBuffer = ''

    for (let w = 0; w < words.length; w++) {
      const testBuffer = lineBuffer ? `${lineBuffer}\u205A${words[w]}` : words[w]
      const metrics = ctx.measureText(testBuffer)

      if (metrics.width > maxTextWidth && lineBuffer !== '') {
        ctx.fillText(lineBuffer, startX, currentY)
        currentY += 80
        lineBuffer = words[w]
      } else {
        lineBuffer = testBuffer
      }
    }

    if (lineBuffer) {
      ctx.fillText(lineBuffer, startX, currentY)
      currentY += 80
    }
  }

  // 6. Latin Karşılık Alanı (Açıklama Kutusu)
  const latinBoxY = Math.max(currentY + 40, height - 360)
  ctx.fillStyle = '#0E1B2B'
  ctx.roundRect(steleX + 48, latinBoxY, steleW - 96, 180, 16)
  ctx.fill()
  ctx.strokeStyle = '#1F4E79'
  ctx.lineWidth = 2
  ctx.stroke()

  // Latin Metin
  ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#F3E9D2'
  ctx.textAlign = 'center'
  
  // Latin metni kırp/sar
  const latinWords = (latinText || '').split(' ')
  let latinLine = ''
  let latinY = latinBoxY + 50
  for (const word of latinWords) {
    const test = latinLine ? `${latinLine} ${word}` : word
    if (ctx.measureText(test).width > steleW - 160 && latinLine) {
      ctx.fillText(latinLine, width / 2, latinY)
      latinY += 34
      latinLine = word
    } else {
      latinLine = test
    }
  }
  if (latinLine) {
    ctx.fillText(latinLine, width / 2, latinY)
  }

  if (authorNote) {
    ctx.font = '16px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#8C929D'
    ctx.fillText(authorNote, width / 2, latinBoxY + 150)
  }

  // 7. Alt Bilgi / Filigran
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#4A90C2'
  ctx.textAlign = 'center'
  ctx.fillText('Bengü Taş Projesi · Hiçbir veri sunucuya gönderilmez', width / 2, height - steleY - 20)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('PNG oluşturulamadı.'))
    }, 'image/png')
  })
}

/**
 * Üretilen PNG dosyasını tarayıcıdan indirir.
 */
export async function downloadStelePng(options: ExportCardOptions, filename = 'bengu-tas-yazit.png'): Promise<void> {
  const blob = await generateStelePng(options)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
