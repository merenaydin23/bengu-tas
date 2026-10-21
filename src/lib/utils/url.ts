/**
 * Bengü Taş — Güvenilir Kök Dizin URL Çözücü
 * GitHub Pages (/bengu-tas/), Vercel, özel alan adları ve localhost ortamlarında
 * static assets (tesseract worker, model onnx, ort wasm) için mutlak taban URL döndürür.
 */
export function getAppRootUrl(): string {
  try {
    const parsed = new URL(window.location.href)
    let p = parsed.pathname
    if (!p.endsWith('/')) {
      if (!p.includes('.')) {
        p = p + '/'
      } else {
        p = p.substring(0, p.lastIndexOf('/') + 1)
      }
    }
    return parsed.origin + p
  } catch {
    return window.location.origin + '/'
  }
}
