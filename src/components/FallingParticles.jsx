import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallpaper } from '../contexts/WallpaperContext'

const Particle = ({ x, delay, duration, size, color }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.6, // Increased opacity for better visibility
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}, 0 0 ${size * 9}px ${color}`,
        filter: `drop-shadow(0 0 ${size * 2}px ${color})`,
        transform: 'rotate(45deg)', // Square rotated 45 degrees for diamond effect
      }}
      initial={{ y: -50, opacity: 0 }}
      animate={{
        y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
        opacity: [0, 0.6, 0.6, 0], // Increased opacity for better glow visibility
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default function FallingParticles() {
  const { particleColors } = useWallpaper()
  const [particles, setParticles] = useState([])
  const particleCount = 35 // More particles

  useEffect(() => {
    // Create particles with random properties using colors from context
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 10, // 10-20 seconds for slow fall
      size: 4 + Math.random() * 5, // 4-9px (larger than before)
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }))
    setParticles(newParticles)
  }, [particleColors]) // Recreate particles when colors change

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          color={particle.color}
        />
      ))}
    </div>
  )
}
