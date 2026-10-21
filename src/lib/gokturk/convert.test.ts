import { describe, it, expect } from 'vitest'
import { convertToGokturk } from './convert'
import { RUNES } from './mapping'
import { detectWordHarmony, normalizeTurkish } from './harmony'
import { verifyAllCodePoints } from '../../../scripts/verify-mapping'

describe('Unicode Mapping & Verification', () => {
  it('all defined code points fall into Old Turkic Unicode block (U+10C00 - U+10C4F)', () => {
    expect(verifyAllCodePoints()).toBe(true)
  })
})

describe('Turkish Normalization & Vowel Harmony', () => {
  it('correctly handles Turkish I and İ uppercase-to-lowercase conversion', () => {
    expect(normalizeTurkish('IŞIK')).toBe('ışık')
    expect(normalizeTurkish('İSTANBUL')).toBe('istanbul')
    expect(normalizeTurkish('TÜRK')).toBe('türk')
  })

  it('detects back (kalın) vowel harmony', () => {
    expect(detectWordHarmony('taş')).toBe('back')
    expect(detectWordHarmony('kağan')).toBe('back')
    expect(detectWordHarmony('balık')).toBe('back')
    expect(detectWordHarmony('kutlu')).toBe('back')
  })

  it('detects front (ince) vowel harmony', () => {
    expect(detectWordHarmony('tengri')).toBe('front')
    expect(detectWordHarmony('türk')).toBe('front')
    expect(detectWordHarmony('bilge')).toBe('front')
    expect(detectWordHarmony('kül')).toBe('front')
  })
})

describe('Göktürk Conversion Engine', () => {
  it('converts reference word "Türk" accurately', () => {
    const result = convertToGokturk('Türk')
    // t(ince: 𐱅) + ü(𐰇) + r(ince: 𐰼) + k(ö/ü yanı ince: 𐰜)
    expect(result.gokturkText).toBe(
      RUNES.ORKHON_AET.char +
      RUNES.ORKHON_OE.char +
      RUNES.ORKHON_AER.char +
      RUNES.ORKHON_OEK.char
    )
  })

  it('converts reference word "Tengri" / "Teŋri" accurately', () => {
    const result = convertToGokturk('Tengri')
    // t(ince: 𐱅) + e(𐰀) + ng(𐰭) + r(ince: 𐰼) + i(𐰃) in student mode
    expect(result.gokturkText).toBe(
      RUNES.ORKHON_AET.char +
      RUNES.ORKHON_A.char +
      RUNES.ORKHON_ENG.char +
      RUNES.ORKHON_AER.char +
      RUNES.ORKHON_I.char
    )
  })

  it('distinguishes back and front consonants (e.g., taş vs tek)', () => {
    const resTas = convertToGokturk('taş')
    // t(kalın: 𐱃) + a(𐰀) + ş(𐰿)
    expect(resTas.gokturkText).toContain(RUNES.ORKHON_AT.char)

    const resTek = convertToGokturk('tek')
    // t(ince: 𐱅) + e(𐰀) + k(ince: 𐰚)
    expect(resTek.gokturkText).toContain(RUNES.ORKHON_AET.char)
    expect(resTek.gokturkText).toContain(RUNES.ORKHON_AEK.char)
  })

  it('handles compound runes in Orhun mode (lt, nt, nç, ny)', () => {
    const resOrkhon = convertToGokturk('ant', { mode: 'orkhon' })
    expect(resOrkhon.gokturkText).toContain(RUNES.ORKHON_ENT.char)

    const resAlt = convertToGokturk('alt', { mode: 'orkhon' })
    expect(resAlt.gokturkText).toContain(RUNES.ORKHON_ELT.char)
  })

  it('gracefully handles empty input', () => {
    const res = convertToGokturk('')
    expect(res.gokturkText).toBe('')
    expect(res.hasApproximations).toBe(false)
  })

  it('handles numbers and punctuation without crashing', () => {
    const res = convertToGokturk('Yıl 732!')
    expect(res.gokturkText).toContain('732!')
  })

  it('flags approximations for missing letters (v, f, j, c, h)', () => {
    const res = convertToGokturk('hava cam faik')
    expect(res.hasApproximations).toBe(true)
    expect(res.approximations.some(a => a.latinChar === 'v')).toBe(true)
    expect(res.approximations.some(a => a.latinChar === 'c')).toBe(true)
    expect(res.approximations.some(a => a.latinChar === 'f')).toBe(true)
  })

  it('handles very long text without memory issues', () => {
    const longInput = 'Türk milleti işitin üstte mavi gök basmadıkça altta yağız yer delinmedikçe '.repeat(50)
    const res = convertToGokturk(longInput)
    expect(res.gokturkText.length).toBeGreaterThan(500)
  })
})
