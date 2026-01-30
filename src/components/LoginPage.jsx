import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, lazy, Suspense } from 'react'
import NameInputPage from './NameInputPage'

// Lazy load heavy 3D component
const LiquidEther = lazy(() => import('./LiquidEther/LiquidEther'))


// Helper function to convert HSL to hex
function hslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export default function LoginPage({ onLogin }) {
  const [showCard, setShowCard] = useState(false)
  
  // Use theme colors - light gold/cream and emerald green
  const liquidEtherColors = useMemo(() => {
    return [
      hslToHex(45, 25, 88),  // Light gold/cream
      hslToHex(170, 80, 50), // Bright emerald
      hslToHex(45, 30, 85),  // Slightly deeper gold
    ]
  }, [])

  const handleLoginClick = () => {
    setShowCard(true)
  }

  const handleNameComplete = () => {
    onLogin()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-40 overflow-hidden"
    >
      {/* LiquidEther Background */}
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />}>
          <LiquidEther
            colors={liquidEtherColors}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </Suspense>
      </div>

      {/* Login Button / Card Morph */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!showCard ? (
            <motion.button
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' }
              }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              onClick={handleLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 font-bold rounded-xl transition-all duration-300 text-2xl backdrop-blur-sm border-2"
              style={{ 
                minWidth: '200px',
                background: 'linear-gradient(135deg, hsl(45, 25%, 88%), hsl(45, 30%, 85%))',
                color: 'hsl(195, 70%, 8%)',
                boxShadow: '0 0 20px rgba(255, 235, 180, 0.6), 0 0 40px rgba(255, 235, 180, 0.4), 0 0 60px rgba(255, 235, 180, 0.2)',
                borderColor: 'rgba(255, 235, 180, 0.3)'
              }}
            >
              Login
            </motion.button>
          ) : (
            <motion.div
              key="card"
              initial={{ 
                opacity: 0, 
                scale: 0.3,
                borderRadius: '12px'
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                borderRadius: '20px'
              }}
              transition={{ 
                duration: 1.4, 
                ease: [0.34, 1.56, 0.64, 1],
                opacity: { duration: 0.6 }
              }}
              style={{ 
                width: '700px',
                height: '900px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformOrigin: 'center center'
              }}
            >
              <NameInputPage onComplete={handleNameComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
