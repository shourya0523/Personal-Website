import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoffeeCalendarCard from '../components/CoffeeCalendarCard.jsx'
import WillowFrameIntro from '../components/WillowFrameIntro/WillowFrameIntro'
import './CoffeeChat.css'

const BloodFluidBackground = lazy(
  () => import('../components/BloodFluidBackground/BloodFluidBackground'),
)

const memeEase = [0.22, 1, 0.36, 1]

export default function CoffeeChat() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="coffee-chat" data-testid="coffee-chat" data-revealed={revealed}>
      <AnimatePresence>
        {!revealed && (
          <WillowFrameIntro key="intro" onComplete={() => setRevealed(true)} />
        )}
      </AnimatePresence>

      {revealed && (
        <>
          <Suspense fallback={<div className="coffee-chat__blood-fallback" aria-hidden="true" />}>
            <BloodFluidBackground />
          </Suspense>

          <div className="coffee-chat__grain" aria-hidden="true" />
          <div className="coffee-chat__vignette" aria-hidden="true" />

          <main className="coffee-chat__main">
            <div className="coffee-chat__hero">
              <div className="coffee-chat__hero-copy">
                <motion.p
                  className="coffee-chat__brand"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Shourya · Coffee Chat
                </motion.p>

                <motion.h1
                  className="coffee-chat__headline"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.75, ease: memeEase }}
                >
                  <span className="coffee-chat__no" data-text="No no no no no…" aria-label="No no no no no">
                    No no no no no…
                  </span>
                  <span className="coffee-chat__line">
                    Don’t do that! We were having such a nice{' '}
                    <span className="coffee-chat__strike">date</span> coffee chat
                  </span>
                </motion.h1>

                <motion.p
                  className="coffee-chat__support"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Wish granted. Pick a time before the glow fades — Notion Calendar, one click out.
                </motion.p>
              </div>

              {/* Sibling of copy so mobile can place booking above meme stills. */}
              <div className="coffee-chat__hero-cal">
                <CoffeeCalendarCard />
              </div>

              <aside className="coffee-chat__memes" aria-label="Obsession reaction stills">
                <motion.figure
                  className="coffee-chat__still"
                  initial={{ opacity: 0, y: 48, rotate: -4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.75, ease: memeEase }}
                >
                  <img
                    src="/assets/coffee/nikki-frown.jpg"
                    alt="Nikki’s iconic frown — how she looks when you reschedule"
                    width={420}
                    height={480}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <figcaption>How your calendar looks when you tap “maybe later”</figcaption>
                </motion.figure>

                <motion.figure
                  className="coffee-chat__still coffee-chat__still--bear"
                  initial={{ opacity: 0, y: 56, rotate: 5, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
                  transition={{ delay: 0.62, duration: 0.8, ease: memeEase }}
                >
                  <img
                    src="/assets/coffee/bear-terror.jpg"
                    alt="Bear recoiling in bed — the correct reaction to missing coffee"
                    width={420}
                    height={300}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <figcaption>Why don’t you love… this time slot?</figcaption>
                </motion.figure>

                <motion.p
                  className="coffee-chat__tagline"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.55 }}
                >
                  Wishes can’t be cancelled.
                </motion.p>
              </aside>
            </div>
          </main>
        </>
      )}
    </div>
  )
}
