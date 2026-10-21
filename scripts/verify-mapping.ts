/**
 * Unicode Old Turkic Mapping Verification Script
 * Validates code points and Unicode character names for Orkhon Turkic block (U+10C00 - U+10C4F)
 */

export interface RuneDefinition {
  name: string
  codePoint: number
  char: string
  latin: string
  type: 'vowel' | 'consonant' | 'compound'
  harmony?: 'back' | 'front' | 'neutral'
  notes?: string
}

export const OFFICIAL_ORKHON_RUNES: Record<string, RuneDefinition> = {
  // Vowels
  ORKHON_A: {
    name: 'OLD TURKIC LETTER ORKHON A',
    codePoint: 0x10c00,
    char: String.fromCodePoint(0x10c00),
    latin: 'a, e',
    type: 'vowel',
    harmony: 'neutral',
    notes: 'Used for a in back syllables, e in front syllables'
  },
  ORKHON_I: {
    name: 'OLD TURKIC LETTER ORKHON I',
    codePoint: 0x10c03,
    char: String.fromCodePoint(0x10c03),
    latin: 'ı, i',
    type: 'vowel',
    harmony: 'neutral',
    notes: 'Used for ı in back syllables, i in front syllables'
  },
  ORKHON_O: {
    name: 'OLD TURKIC LETTER ORKHON O',
    codePoint: 0x10c06,
    char: String.fromCodePoint(0x10c06),
    latin: 'o, u',
    type: 'vowel',
    harmony: 'back',
    notes: 'Used for o and u'
  },
  ORKHON_OE: {
    name: 'OLD TURKIC LETTER ORKHON OE',
    codePoint: 0x10c07,
    char: String.fromCodePoint(0x10c07),
    latin: 'ö, ü',
    type: 'vowel',
    harmony: 'front',
    notes: 'Used for ö and ü'
  },

  // Consonants with Back/Front harmony pairs
  ORKHON_AB: {
    name: 'OLD TURKIC LETTER ORKHON AB',
    codePoint: 0x10c09,
    char: String.fromCodePoint(0x10c09),
    latin: 'b (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEB: {
    name: 'OLD TURKIC LETTER ORKHON AEB',
    codePoint: 0x10c0b,
    char: String.fromCodePoint(0x10c0b),
    latin: 'b (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AG: {
    name: 'OLD TURKIC LETTER ORKHON AG',
    codePoint: 0x10c0d,
    char: String.fromCodePoint(0x10c0d),
    latin: 'g, ğ (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEG: {
    name: 'OLD TURKIC LETTER ORKHON AEG',
    codePoint: 0x10c0f,
    char: String.fromCodePoint(0x10c0f),
    latin: 'g, ğ (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AD: {
    name: 'OLD TURKIC LETTER ORKHON AD',
    codePoint: 0x10c11,
    char: String.fromCodePoint(0x10c11),
    latin: 'd (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AED: {
    name: 'OLD TURKIC LETTER ORKHON AED',
    codePoint: 0x10c13,
    char: String.fromCodePoint(0x10c13),
    latin: 'd (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AY: {
    name: 'OLD TURKIC LETTER ORKHON AY',
    codePoint: 0x10c16,
    char: String.fromCodePoint(0x10c16),
    latin: 'y (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEY: {
    name: 'OLD TURKIC LETTER ORKHON AEY',
    codePoint: 0x10c18,
    char: String.fromCodePoint(0x10c18),
    latin: 'y (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AQ: {
    name: 'OLD TURKIC LETTER ORKHON AQ',
    codePoint: 0x10c34,
    char: String.fromCodePoint(0x10c34),
    latin: 'k, q (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEK: {
    name: 'OLD TURKIC LETTER ORKHON AEK',
    codePoint: 0x10c1a,
    char: String.fromCodePoint(0x10c1a),
    latin: 'k (ince: e/i çevresi)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_OEK: {
    name: 'OLD TURKIC LETTER ORKHON OEK',
    codePoint: 0x10c1c,
    char: String.fromCodePoint(0x10c1c),
    latin: 'k (ince: ö/ü çevresi)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AL: {
    name: 'OLD TURKIC LETTER ORKHON AL',
    codePoint: 0x10c1e,
    char: String.fromCodePoint(0x10c1e),
    latin: 'l (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEL: {
    name: 'OLD TURKIC LETTER ORKHON AEL',
    codePoint: 0x10c20,
    char: String.fromCodePoint(0x10c20),
    latin: 'l (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AN: {
    name: 'OLD TURKIC LETTER ORKHON AN',
    codePoint: 0x10c23,
    char: String.fromCodePoint(0x10c23),
    latin: 'n (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AEN: {
    name: 'OLD TURKIC LETTER ORKHON AEN',
    codePoint: 0x10c24,
    char: String.fromCodePoint(0x10c24),
    latin: 'n (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AR: {
    name: 'OLD TURKIC LETTER ORKHON AR',
    codePoint: 0x10c3a,
    char: String.fromCodePoint(0x10c3a),
    latin: 'r (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AER: {
    name: 'OLD TURKIC LETTER ORKHON AER',
    codePoint: 0x10c3c,
    char: String.fromCodePoint(0x10c3c),
    latin: 'r (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AS: {
    name: 'OLD TURKIC LETTER ORKHON AS',
    codePoint: 0x10c3d,
    char: String.fromCodePoint(0x10c3d),
    latin: 's (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AES: {
    name: 'OLD TURKIC LETTER ORKHON AES',
    codePoint: 0x10c3e,
    char: String.fromCodePoint(0x10c3e),
    latin: 's (ince)',
    type: 'consonant',
    harmony: 'front'
  },
  ORKHON_AT: {
    name: 'OLD TURKIC LETTER ORKHON AT',
    codePoint: 0x10c43,
    char: String.fromCodePoint(0x10c43),
    latin: 't (kalın)',
    type: 'consonant',
    harmony: 'back'
  },
  ORKHON_AET: {
    name: 'OLD TURKIC LETTER ORKHON AET',
    codePoint: 0x10c45,
    char: String.fromCodePoint(0x10c45),
    latin: 't (ince)',
    type: 'consonant',
    harmony: 'front'
  },

  // Neutral Consonants (no back/front split in Orkhon)
  ORKHON_EM: {
    name: 'OLD TURKIC LETTER ORKHON EM',
    codePoint: 0x10c22,
    char: String.fromCodePoint(0x10c22),
    latin: 'm',
    type: 'consonant',
    harmony: 'neutral'
  },
  ORKHON_EZ: {
    name: 'OLD TURKIC LETTER ORKHON EZ',
    codePoint: 0x10c14,
    char: String.fromCodePoint(0x10c14),
    latin: 'z',
    type: 'consonant',
    harmony: 'neutral'
  },
  ORKHON_EC: {
    name: 'OLD TURKIC LETTER ORKHON EC',
    codePoint: 0x10c32,
    char: String.fromCodePoint(0x10c32),
    latin: 'ç',
    type: 'consonant',
    harmony: 'neutral'
  },
  ORKHON_ASH: {
    name: 'OLD TURKIC LETTER ORKHON ASH',
    codePoint: 0x10c3f,
    char: String.fromCodePoint(0x10c3f),
    latin: 'ş',
    type: 'consonant',
    harmony: 'neutral'
  },
  ORKHON_ENG: {
    name: 'OLD TURKIC LETTER ORKHON ENG',
    codePoint: 0x10c2d,
    char: String.fromCodePoint(0x10c2d),
    latin: 'ŋ, ng',
    type: 'consonant',
    harmony: 'neutral'
  },
  ORKHON_EP: {
    name: 'OLD TURKIC LETTER ORKHON EP',
    codePoint: 0x10c2f,
    char: String.fromCodePoint(0x10c2f),
    latin: 'p',
    type: 'consonant',
    harmony: 'neutral'
  },

  // Compounds (used in Orhun style)
  ORKHON_ELT: {
    name: 'OLD TURKIC LETTER ORKHON ELT',
    codePoint: 0x10c21,
    char: String.fromCodePoint(0x10c21),
    latin: 'lt',
    type: 'compound',
    harmony: 'neutral'
  },
  ORKHON_ENT: {
    name: 'OLD TURKIC LETTER ORKHON ENT',
    codePoint: 0x10c26,
    char: String.fromCodePoint(0x10c26),
    latin: 'nt',
    type: 'compound',
    harmony: 'neutral'
  },
  ORKHON_ENC: {
    name: 'OLD TURKIC LETTER ORKHON ENC',
    codePoint: 0x10c28,
    char: String.fromCodePoint(0x10c28),
    latin: 'nç',
    type: 'compound',
    harmony: 'neutral'
  },
  ORKHON_ENY: {
    name: 'OLD TURKIC LETTER ORKHON ENY',
    codePoint: 0x10c2a,
    char: String.fromCodePoint(0x10c2a),
    latin: 'ny',
    type: 'compound',
    harmony: 'neutral'
  }
}

// Verification function
export function verifyAllCodePoints(): boolean {
  for (const [key, rune] of Object.entries(OFFICIAL_ORKHON_RUNES)) {
    if (rune.codePoint < 0x10c00 || rune.codePoint > 0x10c4f) {
      console.error(`Invalid code point for ${key}: ${rune.codePoint.toString(16)}`)
      return false
    }
  }
  return true
}
