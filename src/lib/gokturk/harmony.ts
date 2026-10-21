/**
 * Bengü Taş — Türkçe Ünlü Uyumu ve Fonetik Çözümleyici
 * Türkçe ses uyumunu (kalınlık / incelik) belirler.
 */

export type VowelHarmony = 'back' | 'front'

export const BACK_VOWELS = new Set(['a', 'ı', 'o', 'u'])
export const FRONT_VOWELS = new Set(['e', 'i', 'ö', 'ü'])

/**
 * Türkçe metni tr-TR yerel kuralına göre küçük harfe çevirir.
 * "IŞIK" -> "ışık", "İSTANBUL" -> "istanbul"
 */
export function normalizeTurkish(text: string): string {
  if (!text) return ''
  return text.toLocaleLowerCase('tr-TR').trim()
}

/**
 * Bir kelimenin kalın mı (back) yoksa ince mi (front) ünlü uyumuna sahip olduğunu tespit eder.
 * PRD Kuralı:
 * - a, ı, o, u -> kalın (back)
 * - e, i, ö, ü -> ince (front)
 * - Karışık ünlü içeren kelimelerde ilk ünlüye göre karar verilir (sezgisel yaklaşım).
 * - Kelimede hiç ünlü yoksa varsayılan 'front' kabul edilir (eski Türkçe kök eğilimi).
 */
export function detectWordHarmony(word: string): VowelHarmony {
  const normalized = normalizeTurkish(word)
  for (const char of normalized) {
    if (BACK_VOWELS.has(char)) {
      return 'back'
    }
    if (FRONT_VOWELS.has(char)) {
      return 'front'
    }
  }
  // Ünlü yoksa varsayılan ince
  return 'front'
}

/**
 * Kelime içindeki her bir pozisyon için en yakın geçerli ünlü uyumunu belirler.
 * Bu sayede uzun veya birleşik kelimelerde hece geçişleri daha hassas tespit edilebilir.
 */
export function getPositionHarmony(word: string, index: number, defaultHarmony: VowelHarmony): VowelHarmony {
  const normalized = normalizeTurkish(word)
  
  // Önce sağa doğru (aynı hece veya sonraki ünlü) bak
  for (let i = index; i < normalized.length; i++) {
    const char = normalized[i]
    if (BACK_VOWELS.has(char)) return 'back'
    if (FRONT_VOWELS.has(char)) return 'front'
  }

  // Sonra sola doğru (önceki ünlü) bak
  for (let i = index; i >= 0; i--) {
    const char = normalized[i]
    if (BACK_VOWELS.has(char)) return 'back'
    if (FRONT_VOWELS.has(char)) return 'front'
  }

  return defaultHarmony
}
