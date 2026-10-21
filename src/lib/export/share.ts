/**
 * Bengü Taş — Web Paylaşım ve Pano Modülü (FR-OUT)
 */

import { generateStelePng, ExportCardOptions } from './png'

export interface ShareOptions extends ExportCardOptions {
  title?: string
}

/**
 * Göktürk metnini panoya kopyalar.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Geriye dönük yedek: Gizli textarea ile kopyalama
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }
  } catch (err) {
    console.error('Panoya kopyalama hatası:', err)
    return false
  }
}

/**
 * Web Share API ile paylaşır; desteklenmiyorsa PNG indirir ve panoya kopyalar.
 */
export async function shareOrCopy(options: ShareOptions): Promise<{ shared: boolean; method: 'native' | 'fallback' }> {
  const shareTitle = options.title || 'Bengü Taş — Göktürkçe Yazıtım'
  const shareText = `${options.gokturkText}\n\n"${options.latinText}"\n(Bengü Taş ile yazıldı)`

  if (navigator.share) {
    try {
      // Mümkünse üretilen PNG dosyası ile birlikte paylaş
      let filesToShare: File[] = []
      try {
        const blob = await generateStelePng(options)
        const file = new File([blob], 'bengu-tas.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          filesToShare = [file]
        }
      } catch (e) {
        console.warn('Görsel dosyası paylaşım listesine eklenemedi:', e)
      }

      if (filesToShare.length > 0) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: filesToShare
        })
      } else {
        await navigator.share({
          title: shareTitle,
          text: shareText
        })
      }
      return { shared: true, method: 'native' }
    } catch (err) {
      // Kullanıcı iptal ettiyse veya hata verdiyse
      if ((err as Error).name !== 'AbortError') {
        console.warn('Web Share başarısız oldu, kopyalamaya geçiliyor:', err)
      }
    }
  }

  // Fallback: Panoya kopyala
  await copyToClipboard(options.gokturkText)
  return { shared: true, method: 'fallback' }
}
