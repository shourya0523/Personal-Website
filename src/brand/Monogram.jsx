import './Monogram.css'
/** M2: bare Erode initials, the Y kicked eight degrees off axis. */
export default function Monogram({ size = 18, className = '' }) {
  return (
    <span className={`monogram ${className}`} style={{ fontSize: size }} aria-label="Shourya Yadav">
      <b>S</b><span>Y</span>
    </span>
  )
}
