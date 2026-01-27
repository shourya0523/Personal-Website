import { useEffect, useRef, useState } from 'react'
import './ProfileCard.css'

export default function ProfileCard({
  name = "Shourya Yadav",
  title = "Software Engineer",
  handle = "shouryayadav",
  status = "Online",
  contactText = "Contact Me",
  avatarUrl = "",
  showUserInfo = false,
  enableTilt = true,
  enableMobileTilt = false,
  onContactClick = () => {},
  showIcon = true,
  showBehindGlow = true,
  behindGlowColor = "rgba(125, 190, 255, 0.67)",
  customInnerGradient = "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
}) {
  const cardRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!enableTilt || (!enableMobileTilt && window.innerWidth < 768)) return

    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const pointerX = (x / rect.width) * 100
      const pointerY = (y / rect.height) * 100
      const pointerFromCenter = Math.sqrt(
        Math.pow((x - centerX) / centerX, 2) + Math.pow((y - centerY) / centerY, 2)
      )
      const pointerFromTop = y / rect.height
      const pointerFromLeft = x / rect.width

      const rotateX = ((pointerY - 50) / 50) * -10
      const rotateY = ((pointerX - 50) / 50) * 10

      card.style.setProperty('--pointer-x', `${pointerX}%`)
      card.style.setProperty('--pointer-y', `${pointerY}%`)
      card.style.setProperty('--pointer-from-center', pointerFromCenter)
      card.style.setProperty('--pointer-from-top', pointerFromTop)
      card.style.setProperty('--pointer-from-left', pointerFromLeft)
      card.style.setProperty('--rotate-x', `${rotateX}deg`)
      card.style.setProperty('--rotate-y', `${rotateY}deg`)
      card.style.setProperty('--background-x', `${pointerX}%`)
      card.style.setProperty('--background-y', `${pointerY}%`)
      setIsActive(true)
    }

    const handleMouseLeave = () => {
      setIsActive(false)
      const card = cardRef.current
      if (card) {
        card.style.setProperty('--rotate-x', '0deg')
        card.style.setProperty('--rotate-y', '0deg')
      }
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enableTilt, enableMobileTilt])

  return (
    <div 
      ref={cardRef}
      className={`pc-card-wrapper ${isActive ? 'active' : ''}`}
      style={{
        '--behind-glow-color': behindGlowColor,
        '--inner-gradient': customInnerGradient,
      }}
    >
      {showBehindGlow && <div className="pc-behind" />}
      <div className="pc-card-shell">
        <div className={`pc-card ${isActive ? 'active' : ''}`}>
          <div className="pc-inside" />
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            {avatarUrl && (
              <img 
                src={avatarUrl} 
                alt={name}
                className="avatar"
              />
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </div>
      {showUserInfo && (
        <div className="pc-user-info">
          <div className="pc-user-details">
            {avatarUrl && (
              <div className="pc-mini-avatar">
                <img src={avatarUrl} alt={name} />
              </div>
            )}
            <div className="pc-user-text">
              <div className="pc-handle">{handle}</div>
              <div className="pc-status">{status}</div>
            </div>
          </div>
          <button className="pc-contact-btn" onClick={onContactClick}>
            {contactText}
          </button>
        </div>
      )}
    </div>
  )
}
