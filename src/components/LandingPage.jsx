import { motion } from 'framer-motion'
import { useMemo } from 'react'
import Shuffle from './Shuffle/Shuffle'

// Helper to convert HSL to hex for GSAP color animations
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

export default function LandingPage({ onComplete }) {
  // Create a gradient color effect using theme colors
  // Start with light gold/cream, transition to bright emerald
  const colorFrom = useMemo(() => hslToHex(45, 25, 88), []) // Light gold/cream
  const colorTo = useMemo(() => hslToHex(170, 80, 50), []) // Bright emerald

  const handleShuffleComplete = () => {
    // Transition to login page after shuffle animation completes
    setTimeout(() => {
      onComplete()
    }, 500) // Small delay after animation completes
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-background z-50"
    >
      <div className="text-center">
        <Shuffle
          text="Shourya Yadav"
          shuffleDirection="right"
          duration={0.5}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.05}
          threshold={0}
          rootMargin="0px"
          triggerOnce={true}
          triggerOnHover={false}
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
          onShuffleComplete={handleShuffleComplete}
          colorFrom={colorFrom}
          colorTo={colorTo}
          className="text-foreground shuffle-glow"
        />
      </div>
    </motion.div>
  )
}
