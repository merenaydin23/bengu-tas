/**
 * Bengü Taş — Göktürk Alfabesi Dönüştürme Motoru
 * Pure TypeScript, UI-bağımsız, yüksek performanslı dönüştürücü.
 */

import { RUNES, WORD_SEPARATORS } from './mapping'
import { detectWordHarmony, normalizeTurkish, getPositionHarmony } from './harmony'

export type ConversionMode = 'student' | 'orkhon'
export type WritingDirection = 'rtl' | 'ltr'
export type SeparatorStyle = 'two_dot' | 'colon' | 'space'

export interface ConvertOptions {
  mode?: ConversionMode
  direction?: WritingDirection
  separator?: SeparatorStyle
}

export interface ApproximationNotice {
  latinChar: string
  mappedRune: string
  reason: string
}

export interface ConversionResult {
  originalText: string
  gokturkText: string
  mode: ConversionMode
  direction: WritingDirection
  hasApproximations: boolean
  approximations: ApproximationNotice[]
  notes: string[]
}

// Alfabede birebir karşılığı olmayan harfler için yaklaşık ses eşlemesi
const APPROXIMATIONS: Record<string, { runeBack: string; runeFront: string; description: string }> = {
  h: {
    runeBack: RUNES.ORKHON_AQ.char,
    runeFront: RUNES.ORKHON_AEK.char,
    description: 'Eski Türkçede "h" sesi yoktur; yerine k/q sesi kullanıldı.'
  },
  v: {
    runeBack: RUNES.ORKHON_AB.char,
    runeFront: RUNES.ORKHON_AEB.char,
    description: 'Eski Türkçede "v" sesi yoktur; yerine b sesi kullanıldı.'
  },
  f: {
    runeBack: RUNES.ORKHON_EP.char,
    runeFront: RUNES.ORKHON_EP.char,
    description: 'Eski Türkçede "f" sesi yoktur; en yakın p/b sesi kullanıldı.'
  },
  j: {
    runeBack: RUNES.ORKHON_ASH.char,
    runeFront: RUNES.ORKHON_ASH.char,
    description: 'Eski Türkçede "j" sesi yoktur; en yakın ş/z sesi kullanıldı.'
  },
  c: {
    runeBack: RUNES.ORKHON_EC.char,
    runeFront: RUNES.ORKHON_EC.char,
    description: 'Eski Türkçede "c" sesi yoktur; ç sesi kullanıldı.'
  }
}

/**
 * Tek bir kelimeyi Göktürkçeye dönüştürür.
 */
function convertWord(
  word: string,
  mode: ConversionMode,
  approximations: ApproximationNotice[]
): string {
  const norm = normalizeTurkish(word)
  if (!norm) return ''

  // Kelime düzeyinde ünlü uyumu
  const wordHarmony = detectWordHarmony(norm)
  let result = ''
  let i = 0

  while (i < norm.length) {
    const char = norm[i]
    const nextChar = norm[i + 1] || ''
    const twoChars = char + nextChar
    const currentHarmony = getPositionHarmony(norm, i, wordHarmony)

    // 1. Orhun Usulü Birleşik İşaretler (Compounds) Kontrolü
    if (mode === 'orkhon') {
      if (twoChars === 'ng' || char === 'ŋ') {
        result += RUNES.ORKHON_ENG.char
        i += (char === 'ŋ' ? 1 : 2)
        continue
      }
      if (twoChars === 'lt') {
        result += RUNES.ORKHON_ELT.char
        i += 2
        continue
      }
      if (twoChars === 'nt') {
        result += RUNES.ORKHON_ENT.char
        i += 2
        continue
      }
      if (twoChars === 'nç' || twoChars === 'nc') {
        result += RUNES.ORKHON_ENC.char
        i += 2
        continue
      }
      if (twoChars === 'ny') {
        result += RUNES.ORKHON_ENY.char
        i += 2
        continue
      }
    } else {
      // Öğrenci modunda da 'ng' veya 'ŋ' birleşik kabul edilir (genizsi n)
      if (twoChars === 'ng' || char === 'ŋ') {
        result += RUNES.ORKHON_ENG.char
        i += (char === 'ŋ' ? 1 : 2)
        continue
      }
    }

    // 2. Ünlüler
    if (char === 'a' || char === 'e') {
      if (mode === 'orkhon' && i > 0 && i < norm.length - 1) {
        // Orhun Usulü: Orta hecedeki a/e genelde yazılmaz, atlanır
        i++
        continue
      }
      result += RUNES.ORKHON_A.char
      i++
      continue
    }

    if (char === 'ı' || char === 'i') {
      if (mode === 'orkhon' && i > 1 && i === norm.length - 1 && norm.length > 3) {
        // İsteğe bağlı son ünlü koruması hariç
      }
      result += RUNES.ORKHON_I.char
      i++
      continue
    }

    if (char === 'o' || char === 'u') {
      result += RUNES.ORKHON_O.char
      i++
      continue
    }

    if (char === 'ö' || char === 'ü') {
      result += RUNES.ORKHON_OE.char
      i++
      continue
    }

    // 3. Kalın / İnce Çifti Olan Ünsüzler
    if (char === 'b') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AB.char : RUNES.ORKHON_AEB.char
      i++
      continue
    }

    if (char === 'd') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AD.char : RUNES.ORKHON_AED.char
      i++
      continue
    }

    if (char === 'g' || char === 'ğ') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AG.char : RUNES.ORKHON_AEG.char
      i++
      continue
    }

    if (char === 'k' || char === 'q') {
      if (currentHarmony === 'back') {
        result += RUNES.ORKHON_AQ.char
      } else {
        // İnce: ö veya ü çevresi (kelimede veya yakın hecede ö/ü varsa OEK, yoksa e/i için AEK)
        const hasOe = norm.includes('ö') || norm.includes('ü')
        if (hasOe) {
          result += RUNES.ORKHON_OEK.char
        } else {
          result += RUNES.ORKHON_AEK.char
        }
      }
      i++
      continue
    }

    if (char === 'l') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AL.char : RUNES.ORKHON_AEL.char
      i++
      continue
    }

    if (char === 'n') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AN.char : RUNES.ORKHON_AEN.char
      i++
      continue
    }

    if (char === 'r') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AR.char : RUNES.ORKHON_AER.char
      i++
      continue
    }

    if (char === 's') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AS.char : RUNES.ORKHON_AES.char
      i++
      continue
    }

    if (char === 't') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AT.char : RUNES.ORKHON_AET.char
      i++
      continue
    }

    if (char === 'y') {
      result += currentHarmony === 'back' ? RUNES.ORKHON_AY.char : RUNES.ORKHON_AEY.char
      i++
      continue
    }

    // 4. Çifti Olmayan Tekil Ünsüzler
    if (char === 'm') {
      result += RUNES.ORKHON_EM.char
      i++
      continue
    }

    if (char === 'z') {
      result += RUNES.ORKHON_EZ.char
      i++
      continue
    }

    if (char === 'ç') {
      result += RUNES.ORKHON_EC.char
      i++
      continue
    }

    if (char === 'ş') {
      result += RUNES.ORKHON_ASH.char
      i++
      continue
    }

    if (char === 'p') {
      result += RUNES.ORKHON_EP.char
      i++
      continue
    }

    // 5. Yaklaşık Eşlemeler (h, v, f, j, c)
    if (APPROXIMATIONS[char]) {
      const approx = APPROXIMATIONS[char]
      const chosenRune = currentHarmony === 'back' ? approx.runeBack : approx.runeFront
      result += chosenRune
      approximations.push({
        latinChar: char,
        mappedRune: chosenRune,
        reason: approx.description
      })
      i++
      continue
    }

    // 6. Latin Rakamları ve Diğer Karakterler
    // Latin rakamları ve tanınmayan simgeler çökmeyi engellemek için doğrudan korunur
    result += char
    i++
  }

  return result
}

/**
 * Ana Metin Dönüştürücü Fonksiyonu
 */
export function convertToGokturk(
  inputText: string,
  options: ConvertOptions = {}
): ConversionResult {
  const mode = options.mode || 'student'
  const direction = options.direction || 'rtl'
  const separator = options.separator || 'two_dot'

  if (!inputText || !inputText.trim()) {
    return {
      originalText: inputText || '',
      gokturkText: '',
      mode,
      direction,
      hasApproximations: false,
      approximations: [],
      notes: []
    }
  }

  // Seçilen kelime ayırıcı karakteri
  let sepChar: string = WORD_SEPARATORS.TWO_DOT
  if (separator === 'colon') sepChar = WORD_SEPARATORS.COLON
  if (separator === 'space') sepChar = WORD_SEPARATORS.SPACE

  const approximations: ApproximationNotice[] = []
  const notes: string[] = []

  if (mode === 'orkhon') {
    notes.push('Orhun Usulü: Orta hece ünlüleri ve birleşik işaretler (lt, nt, nç, ny) eğitsel yaklaşımla uygulanmıştır.')
  }

  // Satır bazında bölerek satır sonlarını koru
  const lines = inputText.split(/\r?\n/)
  const convertedLines = lines.map(line => {
    // Kelimeleri boşluklara göre ayır
    const words = line.trim().split(/\s+/)
    if (words.length === 0 || (words.length === 1 && words[0] === '')) {
      return ''
    }

    const convertedWords = words.map(w => convertWord(w, mode, approximations))
    return convertedWords.join(sepChar)
  })

  let finalGokturkText = convertedLines.join('\n')

  // Benzersiz yaklaşık eşlemeler
  const uniqueApproximations = Array.from(
    new Map(approximations.map(a => [a.latinChar, a])).values()
  )

  return {
    originalText: inputText,
    gokturkText: finalGokturkText,
    mode,
    direction,
    hasApproximations: uniqueApproximations.length > 0,
    approximations: uniqueApproximations,
    notes
  }
}
