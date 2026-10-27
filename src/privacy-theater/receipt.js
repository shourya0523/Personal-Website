// The visitor's receipt, drawn once here so the paper on stage and the downloaded PNG match.
const TYPE = '"Courier Prime", "Courier New", monospace'

/** Draw the receipt into a w-wide canvas context. Returns the height the receipt needs. */
export function drawReceipt(ctx, w, h, lines = []) {
  ctx.fillStyle = '#F5F4EF'; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#1D1B19'; ctx.textAlign = 'center'
  ctx.font = `400 26px ${TYPE}`; ctx.fillText('PRIVACY THEATER', w / 2, 60)
  ctx.font = `400 18px ${TYPE}`; ctx.fillText('ADMIT ONE · GENERAL SEATING', w / 2, 92)
  ctx.fillText('- - - - - - - - - - - - - - - -', w / 2, 122)
  ctx.textAlign = 'left'; ctx.font = `400 17px ${TYPE}`
  let y = 160
  ctx.fillText('PAID WITH:', 26, y); y += 36
  for (const [k, v] of lines) {
    ctx.fillText(k.toUpperCase(), 26, y); y += 24
    ctx.textAlign = 'right'; ctx.fillText(String(v).slice(0, 34), w - 26, y); ctx.textAlign = 'left'; y += 34
  }
  ctx.textAlign = 'center'; ctx.fillText('- - - - - - - - - - - - - - - -', w / 2, y + 6)
  ctx.font = `400 24px ${TYPE}`; ctx.fillText('TOTAL CHARGED  $0.00', w / 2, y + 50)
  ctx.font = `400 15px ${TYPE}`; ctx.fillText('YOU PAID IN DATA, NOT DOLLARS', w / 2, y + 84)
  ctx.fillText('ILLUSTRATIVE · NOTHING WAS SAVED', w / 2, y + 108)
  ctx.fillText('SHOURYADAV.INFO/BLOG/PRIVACY-THEATER', w / 2, y + 140)
  return y + 176
}

/** A 2x PNG of the receipt, made in the browser. Nothing is uploaded. */
export async function receiptBlob(lines) {
  await document.fonts?.ready
  const scale = 2, w = 400
  const probe = document.createElement('canvas').getContext('2d')
  const h = drawReceipt(probe, w, 1200, lines)
  const canvas = document.createElement('canvas')
  canvas.width = w * scale; canvas.height = h * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  drawReceipt(ctx, w, h, lines)
  return new Promise(res => canvas.toBlob(res, 'image/png'))
}
