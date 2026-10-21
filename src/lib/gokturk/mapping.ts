/**
 * Bengü Taş — Göktürk Alfabesi Resmi Unicode Eşleme Tablosu
 * Unicode Bloğu: Old Turkic (U+10C00 - U+10C4F)
 * Kaynak: Unicode Standard & Orkhon Inscriptions
 */

export interface RuneInfo {
  codePoint: number
  char: string
  unicodeName: string
  latin: string
  description: string
  harmony?: 'back' | 'front' | 'neutral'
}

export const RUNES = {
  // Ünlüler
  ORKHON_A: {
    codePoint: 0x10c00,
    char: '\u{10C00}',
    unicodeName: 'OLD TURKIC LETTER ORKHON A',
    latin: 'a / e',
    description: 'Kalın hecede "a", ince hecede "e" okunur.',
    harmony: 'neutral'
  },
  ORKHON_I: {
    codePoint: 0x10c03,
    char: '\u{10C03}',
    unicodeName: 'OLD TURKIC LETTER ORKHON I',
    latin: 'ı / i',
    description: 'Kalın hecede "ı", ince hecede "i" okunur.',
    harmony: 'neutral'
  },
  ORKHON_O: {
    codePoint: 0x10c06,
    char: '\u{10C06}',
    unicodeName: 'OLD TURKIC LETTER ORKHON O',
    latin: 'o / u',
    description: 'Kalın ünlüler o ve u için kullanılır.',
    harmony: 'back'
  },
  ORKHON_OE: {
    codePoint: 0x10c07,
    char: '\u{10C07}',
    unicodeName: 'OLD TURKIC LETTER ORKHON OE',
    latin: 'ö / ü',
    description: 'İnce ünlüler ö ve ü için kullanılır.',
    harmony: 'front'
  },

  // Ünsüzler - Kalın / İnce Çiftleri
  ORKHON_AB: {
    codePoint: 0x10c09,
    char: '\u{10C09}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AB',
    latin: 'b (kalın)',
    description: 'Kalın ünlülü hecelerdeki b sesi.',
    harmony: 'back'
  },
  ORKHON_AEB: {
    codePoint: 0x10c0b,
    char: '\u{10C0B}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEB',
    latin: 'b (ince)',
    description: 'İnce ünlülü hecelerdeki b sesi.',
    harmony: 'front'
  },
  ORKHON_AG: {
    codePoint: 0x10c0d,
    char: '\u{10C0D}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AG',
    latin: 'g / ğ (kalın)',
    description: 'Kalın ünlülü hecelerdeki g/ğ (artdamaksıl g) sesi.',
    harmony: 'back'
  },
  ORKHON_AEG: {
    codePoint: 0x10c0f,
    char: '\u{10C0F}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEG',
    latin: 'g / ğ (ince)',
    description: 'İnce ünlülü hecelerdeki g/ğ sesi.',
    harmony: 'front'
  },
  ORKHON_AD: {
    codePoint: 0x10c11,
    char: '\u{10C11}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AD',
    latin: 'd (kalın)',
    description: 'Kalın ünlülü hecelerdeki d sesi.',
    harmony: 'back'
  },
  ORKHON_AED: {
    codePoint: 0x10c13,
    char: '\u{10C13}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AED',
    latin: 'd (ince)',
    description: 'İnce ünlülü hecelerdeki d sesi.',
    harmony: 'front'
  },
  ORKHON_AY: {
    codePoint: 0x10c16,
    char: '\u{10C16}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AY',
    latin: 'y (kalın)',
    description: 'Kalın ünlülü hecelerdeki y sesi.',
    harmony: 'back'
  },
  ORKHON_AEY: {
    codePoint: 0x10c18,
    char: '\u{10C18}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEY',
    latin: 'y (ince)',
    description: 'İnce ünlülü hecelerdeki y sesi.',
    harmony: 'front'
  },
  ORKHON_AQ: {
    codePoint: 0x10c34,
    char: '\u{10C34}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AQ',
    latin: 'k / q (kalın)',
    description: 'Kalın ünlülü hecelerdeki k/q sesi (ör. Kağan).',
    harmony: 'back'
  },
  ORKHON_AEK: {
    codePoint: 0x10c1a,
    char: '\u{10C1A}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEK',
    latin: 'k (ince)',
    description: 'İnce ünlülü (e, i) hecelerdeki k sesi.',
    harmony: 'front'
  },
  ORKHON_OEK: {
    codePoint: 0x10c1c,
    char: '\u{10C1C}',
    unicodeName: 'OLD TURKIC LETTER ORKHON OEK',
    latin: 'k (ö/ü yanı)',
    description: 'Ö ve ü ünlüleriyle birlikte kullanılan k işareti (ör. Türk).',
    harmony: 'front'
  },
  ORKHON_AL: {
    codePoint: 0x10c1e,
    char: '\u{10C1E}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AL',
    latin: 'l (kalın)',
    description: 'Kalın ünlülü hecelerdeki l sesi.',
    harmony: 'back'
  },
  ORKHON_AEL: {
    codePoint: 0x10c20,
    char: '\u{10C20}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEL',
    latin: 'l (ince)',
    description: 'İnce ünlülü hecelerdeki l sesi.',
    harmony: 'front'
  },
  ORKHON_AN: {
    codePoint: 0x10c23,
    char: '\u{10C23}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AN',
    latin: 'n (kalın)',
    description: 'Kalın ünlülü hecelerdeki n sesi.',
    harmony: 'back'
  },
  ORKHON_AEN: {
    codePoint: 0x10c24,
    char: '\u{10C24}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AEN',
    latin: 'n (ince)',
    description: 'İnce ünlülü hecelerdeki n sesi.',
    harmony: 'front'
  },
  ORKHON_AR: {
    codePoint: 0x10c3a,
    char: '\u{10C3A}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AR',
    latin: 'r (kalın)',
    description: 'Kalın ünlülü hecelerdeki r sesi.',
    harmony: 'back'
  },
  ORKHON_AER: {
    codePoint: 0x10c3c,
    char: '\u{10C3C}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AER',
    latin: 'r (ince)',
    description: 'İnce ünlülü hecelerdeki r sesi (ör. Tengri, Türk).',
    harmony: 'front'
  },
  ORKHON_AS: {
    codePoint: 0x10c3d,
    char: '\u{10C3D}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AS',
    latin: 's (kalın)',
    description: 'Kalın ünlülü hecelerdeki s sesi.',
    harmony: 'back'
  },
  ORKHON_AES: {
    codePoint: 0x10c3e,
    char: '\u{10C3E}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AES',
    latin: 's (ince)',
    description: 'İnce ünlülü hecelerdeki s sesi.',
    harmony: 'front'
  },
  ORKHON_AT: {
    codePoint: 0x10c43,
    char: '\u{10C43}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AT',
    latin: 't (kalın)',
    description: 'Kalın ünlülü hecelerdeki t sesi (ör. Taş).',
    harmony: 'back'
  },
  ORKHON_AET: {
    codePoint: 0x10c45,
    char: '\u{10C45}',
    unicodeName: 'OLD TURKIC LETTER ORKHON AET',
    latin: 't (ince)',
    description: 'İnce ünlülü hecelerdeki t sesi (ör. Tengri, Türk).',
    harmony: 'front'
  },

  // Tekil Ünsüzler (Kalın/İnce Ayrımı Olmayanlar)
  ORKHON_EM: {
    codePoint: 0x10c22,
    char: '\u{10C22}',
    unicodeName: 'OLD TURKIC LETTER ORKHON EM',
    latin: 'm',
    description: 'm sesi için kullanılan tek işaret.',
    harmony: 'neutral'
  },
  ORKHON_EZ: {
    codePoint: 0x10c14,
    char: '\u{10C14}',
    unicodeName: 'OLD TURKIC LETTER ORKHON EZ',
    latin: 'z',
    description: 'z sesi için kullanılan işaret.',
    harmony: 'neutral'
  },
  ORKHON_EC: {
    codePoint: 0x10c32,
    char: '\u{10C32}',
    unicodeName: 'OLD TURKIC LETTER ORKHON EC',
    latin: 'ç',
    description: 'ç sesi için kullanılan genel işaret.',
    harmony: 'neutral'
  },
  ORKHON_ASH: {
    codePoint: 0x10c3f,
    char: '\u{10C3F}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ASH',
    latin: 'ş',
    description: 'ş sesi için kullanılan işaret.',
    harmony: 'neutral'
  },
  ORKHON_ENG: {
    codePoint: 0x10c2d,
    char: '\u{10C2D}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ENG',
    latin: 'ŋ / ng',
    description: 'Genizsi n (sağır nun / ŋ / ng) sesi (ör. Teŋri, Bengü).',
    harmony: 'neutral'
  },
  ORKHON_EP: {
    codePoint: 0x10c2f,
    char: '\u{10C2F}',
    unicodeName: 'OLD TURKIC LETTER ORKHON EP',
    latin: 'p',
    description: 'p sesi için kullanılan işaret.',
    harmony: 'neutral'
  },

  // Birleşik İşaretler (Orhun Usulü Hece / Çift Sesler)
  ORKHON_ELT: {
    codePoint: 0x10c21,
    char: '\u{10C21}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ELT',
    latin: 'lt',
    description: 'lt çift sesi için özel birleşik işaret (ör. altı, ilteber).',
    harmony: 'neutral'
  },
  ORKHON_ENT: {
    codePoint: 0x10c26,
    char: '\u{10C26}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ENT',
    latin: 'nt',
    description: 'nt çift sesi için özel birleşik işaret (ör. ant).',
    harmony: 'neutral'
  },
  ORKHON_ENC: {
    codePoint: 0x10c28,
    char: '\u{10C28}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ENC',
    latin: 'nç',
    description: 'nç çift sesi için özel birleşik işaret (ör. inçü).',
    harmony: 'neutral'
  },
  ORKHON_ENY: {
    codePoint: 0x10c2a,
    char: '\u{10C2A}',
    unicodeName: 'OLD TURKIC LETTER ORKHON ENY',
    latin: 'ny',
    description: 'ny çift sesi için özel birleşik işaret (ör. koyn).',
    harmony: 'neutral'
  }
} as const

// Kelime Ayırıcılar
export const WORD_SEPARATORS = {
  TWO_DOT: '\u205A', // ⁚ Two dot punctuation (Yazıt standardı)
  COLON: ':',         // Standart iki nokta yedeği
  SPACE: ' '          // Boşluk seçeneği
} as const
