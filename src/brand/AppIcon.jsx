import { glyphs } from './glyphs'
import './AppIcon.css'

/** Paper-cut squircle app icon. `size` in px. `flat` drops the tile (for menus/lists). */
export default function AppIcon({ name, size = 52, flat = false, className = '', style, title }) {
  const inner = glyphs[name] || glyphs.doc
  if (flat) {
    return (
      <svg className={`glyph ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={style}
        dangerouslySetInnerHTML={{ __html: inner }} />
    )
  }
  return (
    <span className={`app-icon ${className}`} style={{ width: size, height: size, ...style }} title={title} aria-hidden="true">
      <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: inner }} />
    </span>
  )
}
