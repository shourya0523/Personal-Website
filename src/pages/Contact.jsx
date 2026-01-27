import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Phone } from 'lucide-react'
import BounceCards from '@/components/ui/BounceCards/BounceCards'

export default function Contact({ onFileClick }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSmallMobile(window.innerWidth < 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:yadav.sho@northeastern.edu', color: 'text-red-400', bgColor: 'bg-red-500/20' },
    { icon: Phone, label: 'Phone', href: 'tel:+15103267626', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/shouryadav', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/shourya0523', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
  ]

  // Generate card images for each contact method with icons and labels
  const contactCardImages = socialLinks.map((social, index) => {
    const Icon = social.icon
    // Create SVG with icon representation
    const iconColors = {
      'Email': '#ef4444',
      'Phone': '#22c55e', 
      'LinkedIn': '#3b82f6',
      'GitHub': '#6b7280'
    }
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#grad${index})" rx="25" />
        <rect x="5" y="5" width="390" height="390" fill="none" stroke="#ffffff" stroke-width="10" rx="20" />
        <circle cx="200" cy="150" r="60" fill="${iconColors[social.label] || '#ffffff'}" opacity="0.2" />
        <text x="200" y="160" font-family="Arial, sans-serif" font-size="72" fill="${iconColors[social.label] || '#ffffff'}" text-anchor="middle">${social.label === 'Email' ? '✉' : social.label === 'Phone' ? '📞' : social.label === 'LinkedIn' ? '💼' : '💻'}</text>
        <text x="200" y="280" font-family="Arial, sans-serif" font-size="36" fill="#ffffff" text-anchor="middle" font-weight="bold">${social.label}</text>
        <text x="200" y="320" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Click to connect</text>
      </svg>
    `)}`
  })

  const containerWidth = isSmallMobile ? 280 : isMobile ? 400 : 600
  const containerHeight = isSmallMobile ? 350 : isMobile ? 450 : 500
  
  const getTransformStyles = () => {
    if (isSmallMobile) {
      return [
        'rotate(8deg) translate(-100px, -10px)',
        'rotate(4deg) translate(-50px, -5px)',
        'rotate(-2deg) translate(0px, 0px)',
        'rotate(-6deg) translate(50px, 5px)'
      ]
    } else if (isMobile) {
      return [
        'rotate(8deg) translate(-150px, -15px)',
        'rotate(4deg) translate(-75px, -8px)',
        'rotate(-2deg) translate(0px, 0px)',
        'rotate(-6deg) translate(75px, 8px)'
      ]
    }
    return [
      'rotate(8deg) translate(-200px, -20px)',
      'rotate(4deg) translate(-100px, -10px)',
      'rotate(-2deg) translate(0px, 0px)',
      'rotate(-6deg) translate(100px, 10px)'
    ]
  }

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Get In Touch</h1>

        {/* Bounce Cards for Contact */}
        <div className="flex justify-center items-center my-8 md:my-12">
          <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px`, maxWidth: '100%' }}>
            <BounceCards
              images={contactCardImages}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              animationDelay={0.3}
              animationStagger={0.1}
              transformStyles={getTransformStyles()}
            />
            {/* Overlay clickable links positioned over each card */}
            {socialLinks.map((social, index) => {
              const cardSize = isSmallMobile ? 120 : isMobile ? 150 : 200
              const getCardPositions = () => {
                if (isSmallMobile) {
                  return [
                    { left: `calc(50% - ${cardSize/2}px - 100px)`, top: `calc(50% - ${cardSize/2}px - 10px)`, transform: 'rotate(8deg)' },
                    { left: `calc(50% - ${cardSize/2}px - 50px)`, top: `calc(50% - ${cardSize/2}px - 5px)`, transform: 'rotate(4deg)' },
                    { left: `calc(50% - ${cardSize/2}px)`, top: `calc(50% - ${cardSize/2}px)`, transform: 'rotate(-2deg)' },
                    { left: `calc(50% - ${cardSize/2}px + 50px)`, top: `calc(50% - ${cardSize/2}px + 5px)`, transform: 'rotate(-6deg)' }
                  ]
                } else if (isMobile) {
                  return [
                    { left: `calc(50% - ${cardSize/2}px - 150px)`, top: `calc(50% - ${cardSize/2}px - 15px)`, transform: 'rotate(8deg)' },
                    { left: `calc(50% - ${cardSize/2}px - 75px)`, top: `calc(50% - ${cardSize/2}px - 8px)`, transform: 'rotate(4deg)' },
                    { left: `calc(50% - ${cardSize/2}px)`, top: `calc(50% - ${cardSize/2}px)`, transform: 'rotate(-2deg)' },
                    { left: `calc(50% - ${cardSize/2}px + 75px)`, top: `calc(50% - ${cardSize/2}px + 8px)`, transform: 'rotate(-6deg)' }
                  ]
                }
                return [
                  { left: `calc(50% - ${cardSize/2}px - 200px)`, top: `calc(50% - ${cardSize/2}px - 20px)`, transform: 'rotate(8deg)' },
                  { left: `calc(50% - ${cardSize/2}px - 100px)`, top: `calc(50% - ${cardSize/2}px - 10px)`, transform: 'rotate(4deg)' },
                  { left: `calc(50% - ${cardSize/2}px)`, top: `calc(50% - ${cardSize/2}px)`, transform: 'rotate(-2deg)' },
                  { left: `calc(50% - ${cardSize/2}px + 100px)`, top: `calc(50% - ${cardSize/2}px + 10px)`, transform: 'rotate(-6deg)' }
                ]
              }
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="absolute cursor-pointer z-10"
                  style={{ width: `${cardSize}px`, height: `${cardSize}px`, ...getCardPositions()[index] }}
                  onClick={(e) => {
                    // Ensure click works
                    if (social.href.startsWith('http')) {
                      window.open(social.href, '_blank', 'noopener,noreferrer')
                    } else {
                      window.location.href = social.href
                    }
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Fallback Social Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 space-y-4"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Connect With Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`flex items-center gap-4 p-4 ${social.bgColor} border-2 border-gray-600 rounded-lg hover:border-blue-500 transition-all`}
                >
                  <Icon className={`w-6 h-6 ${social.color}`} />
                  <span className="font-medium">{social.label}</span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
