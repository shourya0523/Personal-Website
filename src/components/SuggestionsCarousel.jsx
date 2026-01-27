import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Rocket } from 'lucide-react'
import GlassSurface from './GlassSurface'
import { useSounds } from '../contexts/SoundContext'
import './SuggestionsCarousel.css'

const suggestions = [
  {
    id: 'terminal',
    title: 'Try the Terminal',
    description: 'Interactive command-line experience',
    icon: '💻',
    action: 'terminal',
    color: 'red'
  },
  {
    id: 'about',
    title: 'Learn About Me',
    description: 'Discover my background, skills, and interests',
    icon: '👤',
    action: 'about',
    color: 'blue'
  },
  {
    id: 'projects',
    title: 'Explore Projects',
    description: 'Check out my latest work and creations',
    icon: '💼',
    action: 'projects',
    color: 'purple'
  },
  {
    id: 'music',
    title: 'Listen to Music',
    description: 'Play my favorite songs',
    icon: '🎵',
    action: 'music',
    color: 'purple'
  },
  {
    id: 'wallpaper',
    title: 'Change Wallpaper',
    description: 'Customize your desktop background',
    icon: '🖼️',
    action: 'wallpaper',
    color: 'pink'
  },
  {
    id: 'explorer',
    title: 'Browse Files',
    description: 'Navigate through my file system',
    icon: '📁',
    action: 'explorer',
    color: 'indigo'
  }
]

export default function SuggestionsCarousel({ apps, onSuggestionClick, isMobile = false }) {
  const sounds = useSounds()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)
  
  const x = useMotionValue(0)
  const dragConstraints = { left: 0, right: 0 }

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % suggestions.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleNext = () => {
    if (currentIndex === suggestions.length - 1) return
    sounds.click()
    setDirection(1)
    setCurrentIndex((prev) => prev + 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handlePrev = () => {
    if (currentIndex === 0) return
    sounds.click()
    setDirection(-1)
    setCurrentIndex((prev) => prev - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleSuggestionClick = (suggestion) => {
    sounds.click()
    if (onSuggestionClick) {
      const app = apps?.find(a => a.id === suggestion.action)
      if (app) {
        onSuggestionClick(app)
      }
    }
  }

  const handleDragEnd = (event, info) => {
    const threshold = 50
    if (info.offset.x > threshold && currentIndex > 0) {
      handlePrev()
    } else if (info.offset.x < -threshold && currentIndex < suggestions.length - 1) {
      handleNext()
    }
  }

  const currentSuggestion = suggestions[currentIndex]
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  if (isMobile) {
    return (
      <div className="suggestions-carousel-mobile">
        <div className="suggestions-carousel-mobile-header">
          <Sparkles size={20} style={{ color: 'hsl(var(--primary))' }} />
          <h2>Suggestions</h2>
        </div>
        <div className="suggestions-carousel-mobile-content">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="suggestion-card-mobile"
            >
              <div className="suggestion-icon-mobile">{currentSuggestion.icon}</div>
              <h3 className="suggestion-title-mobile">{currentSuggestion.title}</h3>
              <p className="suggestion-description-mobile">{currentSuggestion.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(currentSuggestion)}
                className="suggestion-button-mobile"
              >
                <Rocket size={18} />
                Try It Now
              </motion.button>
            </motion.div>
          </AnimatePresence>
          
          <div className="carousel-controls-mobile">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="carousel-button-mobile"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="carousel-dots-mobile">
              {suggestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 10000)
                  }}
                  className={`carousel-dot-mobile ${index === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to suggestion ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === suggestions.length - 1}
              className="carousel-button-mobile"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={carouselRef}
      className="suggestions-carousel-desktop"
      drag="x"
      dragConstraints={dragConstraints}
      onDragEnd={handleDragEnd}
      style={{ x }}
    >
      <GlassSurface
        borderRadius={24}
        opacity={0.9}
        brightness={110}
        displace={0.3}
        distortionScale={-120}
        width="100%"
        className="suggestions-carousel-glass"
        style={{ height: 'auto !important', minHeight: 'fit-content' }}
      >
        <div className="suggestions-carousel-header">
          <div className="suggestions-carousel-title">
            <Sparkles size={22} style={{ color: 'hsl(var(--primary))' }} />
            <h3>Try This First</h3>
          </div>
        </div>

        <div className="suggestions-carousel-content">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="suggestion-card-desktop"
            >
              <div className="suggestion-icon-desktop">{currentSuggestion.icon}</div>
              <h4 className="suggestion-title-desktop">{currentSuggestion.title}</h4>
              <p className="suggestion-description-desktop">{currentSuggestion.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(currentSuggestion)}
                className="suggestion-button-desktop"
              >
                <Rocket size={18} />
                Try It Now
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div className="carousel-controls-desktop">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="carousel-button-desktop"
              aria-label="Previous suggestion"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="carousel-dots-desktop">
              {suggestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 10000)
                  }}
                  className={`carousel-dot-desktop ${index === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to suggestion ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === suggestions.length - 1}
              className="carousel-button-desktop"
              aria-label="Next suggestion"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </GlassSurface>
    </motion.div>
  )
}
