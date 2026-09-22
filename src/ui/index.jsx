// UI kit: small, role-based primitives. Import { Doc, DocHeader, Section, Rows, Row, Tags, Tag, Button, Kv, Split, SideItem, Field, Toggle, Empty, Card } from '../ui'
import AppIcon from '../brand/AppIcon'
import './ui.css'

export function Doc({ wide, children, className = '', ...rest }) { return <div className={`doc ${wide ? 'doc--wide' : ''} ${className}`} {...rest}><div className="doc__inner">{children}</div></div> }
export function DocHeader({ eyebrow, title, lede, children }) { return <header className="doc-header">{eyebrow && <div className="label">{eyebrow}</div>}<h1>{title}</h1>{lede && <p className="lede">{lede}</p>}{children}</header> }
export function Section({ title, sub, id, children }) { return <section className="section" id={id}>{title && <h2>{title}</h2>}{sub && <h3>{sub}</h3>}{children}</section> }
export function Prose({ children }) { return <div className="prose">{children}</div> }
export function Rows({ children }) { return <div className="rows">{children}</div> }
export function Row({ title, sub, meta, children, onClick, href }) {
  const Tag = href ? 'a' : onClick ? 'button' : 'div'
  return <Tag className={`row ${onClick || href ? 'row--link' : ''}`} onClick={onClick} href={href} target={href ? '_blank' : undefined} rel={href ? 'noreferrer' : undefined}>
    <div><div className="row__title">{title}</div>{sub && <div className="row__sub">{sub}</div>}</div>
    {meta && <div className="row__meta">{meta}</div>}
    {children && <div className="row__body">{children}</div>}
  </Tag>
}
export function Tags({ items = [], accent }) { return <div className="tags">{items.map(t => <Tag key={t} accent={accent}>{t}</Tag>)}</div> }
export function Tag({ children, accent }) { return <span className={`tag ${accent ? 'tag--accent' : ''}`}>{children}</span> }
export function Button({ children, variant = 'default', size, href, icon, ...rest }) {
  const cls = `btn ${variant === 'primary' ? 'btn--primary' : variant === 'quiet' ? 'btn--quiet' : ''} ${size === 'sm' ? 'btn--sm' : ''}`
  if (href) return <a className={cls} href={href} target="_blank" rel="noreferrer" {...rest}>{icon && <AppIcon name={icon} flat size={14} />}{children}</a>
  return <button type="button" className={cls} {...rest}>{icon && <AppIcon name={icon} flat size={14} />}{children}</button>
}
export function ButtonRow({ children }) { return <div className="btn-row">{children}</div> }
export function Kv({ items }) { return <dl className="kv">{items.filter(([, v]) => v).map(([k, v]) => <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl> }
export function Split({ side, children }) { return <div className="split"><aside className="split__side">{side}</aside><div className="split__main">{children}</div></div> }
export function SideItem({ active, icon, children, onClick }) { return <button type="button" className="side-item" aria-current={active ? 'true' : undefined} onClick={onClick}>{icon && <AppIcon name={icon} flat size={16} />}<span>{children}</span></button> }
export function SideGroup({ children }) { return <div className="side-group label">{children}</div> }
export function Field({ label, id, children }) { return <div className="field"><label htmlFor={id}>{label}</label>{children}</div> }
export function Toggle({ label, hint, checked, onChange }) { return <div className="toggle"><div className="toggle__label"><span>{label}</span>{hint && <small>{hint}</small>}</div><button type="button" role="switch" aria-checked={checked} className="switch" aria-label={label} onClick={() => onChange(!checked)} /></div> }
export function Empty({ children }) { return <div className="empty">{children}</div> }
export function Card({ title, children, onClick, accent }) { const T = onClick ? 'button' : 'div'; return <T type={onClick ? 'button' : undefined} className={`card ${onClick ? 'card--link' : ''}`} onClick={onClick}>{accent && <span className="accent-bar" style={{ background: accent }} />}{title && <h3>{title}</h3>}{children}</T> }
export { AppIcon }
