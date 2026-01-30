import { useState, useMemo, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../contexts/UserContext'
import { Lock, Activity } from 'lucide-react'

// Lazy load heavy 3D component
const ReflectiveCard = lazy(() => import('./ReflectiveCard/ReflectiveCard'))

// Helper to convert HSL to rgba
function hslToRgba(h, s, l, a = 1) {
  l /= 100
  const a_val = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a_val * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }
  return `rgba(${f(0)}, ${f(8)}, ${f(4)}, ${a})`
}

export default function NameInputPage({ onComplete }) {
  const [name, setName] = useState('')
  const { updateUserName } = useUser()

  // Theme color tint - light gold/cream with transparency
  const themeTint = useMemo(() => {
    return hslToRgba(45, 25, 88, 0.2) // Light gold/cream with 20% opacity
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      updateUserName(name.trim())
      onComplete()
    }
  }

  return (
    <div style={{ 
      height: '900px', 
      width: '700px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-white/50">Loading...</div></div>}>
          <ReflectiveCard
        overlayColor={themeTint}
        blurStrength={8}
        glassDistortion={10}
        metalness={1}
        roughness={0.5}
        displacementStrength={8}
        noiseScale={1}
        specularConstant={3}
        grayscale={0.1}
        color="#ffffff"
      >
          <div className="card-header">
            <div className="security-badge">
              <Lock size={14} className="security-icon" />
              <span>SECURE ACCESS</span>
            </div>
            <Activity className="status-icon" size={20} />
          </div>

          <div className="card-body" style={{ justifyContent: 'center', gap: '32px' }}>
            <div className="user-info" style={{ width: '100%' }}>
              <h2 className="user-name" style={{ marginBottom: '24px', fontSize: '20px' }}>
                ENTER YOUR NAME
              </h2>
              <form onSubmit={handleSubmit} className="w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name here..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    textAlign: 'center',
                  }}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 px-6 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45, 25%, 88%), hsl(45, 30%, 85%))',
                    color: 'hsl(195, 70%, 8%)',
                    boxShadow: '0 0 20px rgba(255, 235, 180, 0.6), 0 0 40px rgba(255, 235, 180, 0.4)',
                  }}
                  disabled={!name.trim()}
                >
                  CONTINUE
                </motion.button>
              </form>
            </div>
          </div>

          <div className="card-footer">
            <div className="id-section">
              <span className="label">USER ID</span>
              <span className="value">{name || '--------'}</span>
            </div>
          </div>
          </ReflectiveCard>
        </Suspense>
      </div>
    </div>
  )
}
