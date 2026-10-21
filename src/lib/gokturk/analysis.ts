/**
 * Bengü Taş — Şeffaf Göktürkçe Dönüşüm & Ses Analizi Motoru
 * Kullanıcıya ve öğrencilere kameradan okunan metnin harf harf nasıl ve hangi
 * kuralla Göktürkçeye dönüştürüldüğünü tüm şeffaflığıyla açıklar.
 */

import { ConversionMode } from './convert'
import { detectWordHarmony, normalizeTurkish, getPositionHarmony } from './harmony'
import { RUNES } from './mapping'

export interface RuneAnalysisItem {
  latin: string
  rune: string
  runeName: string
  ruleTitle: string
  explanation: string
  harmonyType: 'back' | 'front' | 'neutral' | 'compound' | 'approximated'
}

export interface WordAnalysis {
  word: string
  gokturkWord: string
  harmony: 'back' | 'front'
  items: RuneAnalysisItem[]
}

export function analyzeGokturkConversion(
  text: string,
  mode: ConversionMode = 'student'
): WordAnalysis[] {
  if (!text || !text.trim()) return []

  const words = text.trim().split(/\s+/)
  const results: WordAnalysis[] = []

  for (const rawWord of words) {
    const norm = normalizeTurkish(rawWord)
    if (!norm) continue

    const wordHarmony = detectWordHarmony(norm)
    const items: RuneAnalysisItem[] = []
    let gokturkWord = ''
    let i = 0

    while (i < norm.length) {
      const char = norm[i]
      const nextChar = norm[i + 1] || ''
      const twoChars = char + nextChar
      const currentHarmony = getPositionHarmony(norm, i, wordHarmony)

      // 1. Bileşik damgalar (ng, lt, nt, nç, ny)
      if (twoChars === 'ng' || char === 'ŋ') {
        const rune = RUNES.ORKHON_ENG.char
        gokturkWord += rune
        items.push({
          latin: char === 'ŋ' ? 'ŋ' : 'ng',
          rune,
          runeName: 'Genizsi N (Eñ Damgası)',
          ruleTitle: 'Bileşik Ses Kuralı',
          explanation: 'Eski Türkçeye özgü nazal n (sağır kef / eñ) sesi tek bir damgayla yazılır.',
          harmonyType: 'compound'
        })
        i += (char === 'ŋ' ? 1 : 2)
        continue
      }

      if (mode === 'orkhon') {
        if (twoChars === 'lt') {
          const rune = RUNES.ORKHON_ELT.char
          gokturkWord += rune
          items.push({
            latin: 'lt',
            rune,
            runeName: 'Elt Bileşik Damgası',
            ruleTitle: 'Orhun Yazıt Kuralı',
            explanation: '"L" ve "T" ünsüzleri yan yana geldiğinde özel tek damga kullanılır.',
            harmonyType: 'compound'
          })
          i += 2
          continue
        }
        if (twoChars === 'nt') {
          const rune = RUNES.ORKHON_ENT.char
          gokturkWord += rune
          items.push({
            latin: 'nt',
            rune,
            runeName: 'Ent Bileşik Damgası',
            ruleTitle: 'Orhun Yazıt Kuralı',
            explanation: '"N" ve "T" ünsüzleri Orhun yazıtlarında birleşik damgayla gösterilir.',
            harmonyType: 'compound'
          })
          i += 2
          continue
        }
      }

      // 2. Ünlüler (a/e, ı/i, o/u, ö/ü)
      if (char === 'a' || char === 'e') {
        const rune = RUNES.ORKHON_A.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: 'A / E Damgası (𐰀)',
          ruleTitle: char === 'a' ? 'Kalın Düz Ünlü' : 'İnce Düz Ünlü',
          explanation: `Göktürkçede 'a' ve 'e' sesleri aynı damgayla gösterilir; kelimedeki ünsüz damgalarının kalınlığına göre okunur.`,
          harmonyType: char === 'a' ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'ı' || char === 'i') {
        const rune = RUNES.ORKHON_I.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: 'I / İ Damgası (𐰃)',
          ruleTitle: char === 'ı' ? 'Kalın Dar Ünlü' : 'İnce Dar Ünlü',
          explanation: `Göktürkçede 'ı' ve 'i' sesleri ortak damgayla yazılır.`,
          harmonyType: char === 'ı' ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'o' || char === 'u') {
        const rune = RUNES.ORKHON_O.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: 'O / U Damgası (𐰆)',
          ruleTitle: 'Kalın Yuvarlak Ünlü',
          explanation: `'O' ve 'u' ünlüleri tek bir yuvarlak ünlü damgasıyla karşılanır.`,
          harmonyType: 'back'
        })
        i++
        continue
      }

      if (char === 'ö' || char === 'ü') {
        const rune = RUNES.ORKHON_OE.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: 'Ö / Ü Damgası (𐰇)',
          ruleTitle: 'İnce Yuvarlak Ünlü',
          explanation: `'Ö' ve 'ü' ünlüleri Göktürkçede ince yuvarlak damgasıyla yazılır.`,
          harmonyType: 'front'
        })
        i++
        continue
      }

      // 3. Kalın / İnce Çifti Olan Ünsüzler
      const isBack = currentHarmony === 'back'

      if (char === 'b') {
        const rune = isBack ? RUNES.ORKHON_AB.char : RUNES.ORKHON_AEB.char
        gokturkWord += rune
        items.push({
          latin: 'B',
          rune,
          runeName: isBack ? 'Kalın Eb (𐰉)' : 'İnce Eb (𐰋)',
          ruleTitle: isBack ? 'Kalın Ünlü Uyumu' : 'İnce Ünlü Uyumu',
          explanation: `Hece ${isBack ? 'kalın (a,ı,o,u)' : 'ince (e,i,ö,ü)'} olduğu için ${isBack ? 'kalın B (𐰉)' : 'ince B (𐰋)'} damgası seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'd' || char === 't') {
        const rune = isBack ? RUNES.ORKHON_AT.char : RUNES.ORKHON_AET.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: isBack ? 'Kalın At (𐱃)' : 'İnce Et (𐱅)',
          ruleTitle: isBack ? 'Kalın Ünlü Uyumu' : 'İnce Ünlü Uyumu',
          explanation: `Hece ${isBack ? 'kalın' : 'ince'} ses taşıdığı için ${isBack ? 'kalın T/D (𐱃)' : 'ince T/D (𐱅)'} damgası kullanıldı.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'k' || char === 'q') {
        const rune = isBack ? RUNES.ORKHON_AQ.char : RUNES.ORKHON_AEK.char
        gokturkWord += rune
        items.push({
          latin: 'K',
          rune,
          runeName: isBack ? 'Kalın Aq/Qaf (𐰴)' : 'İnce Ek/Kef (𐰚)',
          ruleTitle: isBack ? 'Kalın K (Qaf)' : 'İnce K (Kef)',
          explanation: `Hece ${isBack ? 'kalın' : 'ince'} olduğu için ${isBack ? 'gırtlaksı kalın Q (𐰴)' : 'damaksı ince K (𐰚)'} damgası seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'g' || char === 'ğ') {
        const rune = isBack ? RUNES.ORKHON_AG.char : RUNES.ORKHON_AEG.char
        gokturkWord += rune
        items.push({
          latin: char.toUpperCase(),
          rune,
          runeName: isBack ? 'Kalın Ag (𐰍)' : 'İnce Eg (𐰏)',
          ruleTitle: isBack ? 'Kalın G / Ğ' : 'İnce G / Ğ',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın G (𐰍)' : 'ince G (𐰏)'} damgası yazıldı.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'l') {
        const rune = isBack ? RUNES.ORKHON_AL.char : RUNES.ORKHON_AEL.char
        gokturkWord += rune
        items.push({
          latin: 'L',
          rune,
          runeName: isBack ? 'Kalın Al (𐰞)' : 'İnce El (𐰠)',
          ruleTitle: isBack ? 'Kalın L Damgası' : 'İnce L Damgası',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın L (𐰞)' : 'ince L (𐰠)'} seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'n') {
        const rune = isBack ? RUNES.ORKHON_AN.char : RUNES.ORKHON_AEN.char
        gokturkWord += rune
        items.push({
          latin: 'N',
          rune,
          runeName: isBack ? 'Kalın An (𐰣)' : 'İnce En (𐰤)',
          ruleTitle: isBack ? 'Kalın N Damgası' : 'İnce N Damgası',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın N (𐰣)' : 'ince N (𐰤)'} seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'r') {
        const rune = isBack ? RUNES.ORKHON_AR.char : RUNES.ORKHON_AER.char
        gokturkWord += rune
        items.push({
          latin: 'R',
          rune,
          runeName: isBack ? 'Kalın Ar (𐰺)' : 'İnce Er (𐰼)',
          ruleTitle: isBack ? 'Kalın R Damgası' : 'İnce R Damgası',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın R (𐰺)' : 'ince R (𐰼)'} seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 's') {
        const rune = isBack ? RUNES.ORKHON_AS.char : RUNES.ORKHON_AES.char
        gokturkWord += rune
        items.push({
          latin: 'S',
          rune,
          runeName: isBack ? 'Kalın As (𐰽)' : 'İnce Es (𐰾)',
          ruleTitle: isBack ? 'Kalın S Damgası' : 'İnce S Damgası',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın S (𐰽)' : 'ince S (𐰾)'} seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      if (char === 'y') {
        const rune = isBack ? RUNES.ORKHON_AY.char : RUNES.ORKHON_AEY.char
        gokturkWord += rune
        items.push({
          latin: 'Y',
          rune,
          runeName: isBack ? 'Kalın Ay (𐰖)' : 'İnce Ey (𐰘)',
          ruleTitle: isBack ? 'Kalın Y Damgası' : 'İnce Y Damgası',
          explanation: `Ünlü uyumuna göre ${isBack ? 'kalın Y (𐰖)' : 'ince Y (𐰘)'} seçildi.`,
          harmonyType: isBack ? 'back' : 'front'
        })
        i++
        continue
      }

      // 4. Tek Damgalı Nötr Ünsüzler
      if (char === 'm') {
        const rune = RUNES.ORKHON_EM.char
        gokturkWord += rune
        items.push({
          latin: 'M',
          rune,
          runeName: 'Em Damgası (𐰢)',
          ruleTitle: 'Nötr Ünsüz',
          explanation: 'Göktürkçede M sesi için kalın/ince ayrımı yoktur, tek damga kullanılır.',
          harmonyType: 'neutral'
        })
        i++
        continue
      }

      if (char === 'p') {
        const rune = RUNES.ORKHON_EP.char
        gokturkWord += rune
        items.push({
          latin: 'P',
          rune,
          runeName: 'Ep Damgası (𐰯)',
          ruleTitle: 'Nötr Ünsüz',
          explanation: 'P sesi için tek damga kullanılır.',
          harmonyType: 'neutral'
        })
        i++
        continue
      }

      if (char === 'ş') {
        const rune = RUNES.ORKHON_ASH.char
        gokturkWord += rune
        items.push({
          latin: 'Ş',
          rune,
          runeName: 'Eş Damgası (𐱁)',
          ruleTitle: 'Nötr Ünsüz',
          explanation: 'Ş sesi hem kalın hem ince hecelerde bu damgayla gösterilir.',
          harmonyType: 'neutral'
        })
        i++
        continue
      }

      if (char === 'z') {
        const rune = RUNES.ORKHON_EZ.char
        gokturkWord += rune
        items.push({
          latin: 'Z',
          rune,
          runeName: 'Ez Damgası (𐰕)',
          ruleTitle: 'Nötr Ünsüz',
          explanation: 'Z sesi hem kalın hem ince hecelerde tek damgayla yazılır.',
          harmonyType: 'neutral'
        })
        i++
        continue
      }

      if (char === 'ç') {
        const rune = RUNES.ORKHON_EC.char
        gokturkWord += rune
        items.push({
          latin: 'Ç',
          rune,
          runeName: 'Eç Damgası (𐰲)',
          ruleTitle: 'Nötr Ünsüz',
          explanation: 'Ç sesi için ortak damga kullanılır.',
          harmonyType: 'neutral'
        })
        i++
        continue
      }

      // 5. Eski Türkçede Olmayan Sesler (Yaklaşık Eşlemeler)
      if (char === 'h') {
        const rune = isBack ? RUNES.ORKHON_AQ.char : RUNES.ORKHON_AEK.char
        gokturkWord += rune
        items.push({
          latin: 'H',
          rune,
          runeName: isBack ? 'Kalın Q (𐰴)' : 'İnce K (𐰚)',
          ruleTitle: 'Yaklaşık Ses Eşlemesi',
          explanation: 'Eski Türkçede "H" sesi yoktur. En yakın gırtlak sesi olan K/Q ile eşlendi.',
          harmonyType: 'approximated'
        })
        i++
        continue
      }

      if (char === 'v') {
        const rune = isBack ? RUNES.ORKHON_AB.char : RUNES.ORKHON_AEB.char
        gokturkWord += rune
        items.push({
          latin: 'V',
          rune,
          runeName: isBack ? 'Kalın B (𐰉)' : 'İnce B (𐰋)',
          ruleTitle: 'Yaklaşık Ses Eşlemesi',
          explanation: 'Eski Türkçede "V" sesi yoktur. Kelimeler "B" sesiyle yazılır (Örn: Var -> Bar).',
          harmonyType: 'approximated'
        })
        i++
        continue
      }

      if (char === 'f') {
        const rune = RUNES.ORKHON_EP.char
        gokturkWord += rune
        items.push({
          latin: 'F',
          rune,
          runeName: 'Ep Damgası (𐰯)',
          ruleTitle: 'Yaklaşık Ses Eşlemesi',
          explanation: 'Eski Türkçede "F" sesi yoktur; en yakın dudak sesi olan P damgası kullanıldı.',
          harmonyType: 'approximated'
        })
        i++
        continue
      }

      if (char === 'c') {
        const rune = RUNES.ORKHON_EC.char
        gokturkWord += rune
        items.push({
          latin: 'C',
          rune,
          runeName: 'Eç Damgası (𐰲)',
          ruleTitle: 'Yaklaşık Ses Eşlemesi',
          explanation: 'Eski Türkçede "C" sesi bulunmaz; en yakın sert karşılığı olan Ç damgası kullanıldı.',
          harmonyType: 'approximated'
        })
        i++
        continue
      }

      if (char === 'j') {
        const rune = RUNES.ORKHON_ASH.char
        gokturkWord += rune
        items.push({
          latin: 'J',
          rune,
          runeName: 'Eş Damgası (𐱁)',
          ruleTitle: 'Yaklaşık Ses Eşlemesi',
          explanation: 'Eski Türkçede "J" sesi yoktur; en yakın sızıcı ses olan Ş damgası seçildi.',
          harmonyType: 'approximated'
        })
        i++
        continue
      }

      // Diğer sembol veya harfler
      items.push({
        latin: char,
        rune: char,
        runeName: 'İşaretsiz',
        ruleTitle: 'Doğrudan Aktarım',
        explanation: 'Göktürk alfabesinde karşılığı olmayan noktalama işareti.',
        harmonyType: 'neutral'
      })
      gokturkWord += char
      i++
    }

    results.push({
      word: rawWord,
      gokturkWord,
      harmony: wordHarmony,
      items
    })
  }

  return results
}
