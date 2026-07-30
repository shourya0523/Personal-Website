import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoffeeCalendarCard from '../components/CoffeeCalendarCard.jsx'
import WillowFrameIntro from '../components/WillowFrameIntro/WillowFrameIntro'
import './CoffeeChat.css'

const BloodFluidBackground = lazy(
  () => import('../components/BloodFluidBackground/BloodFluidBackground'),
)

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
              transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
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
              Wish granted. The calendar is friendlier than customer service for cursed toys.
              Book a slot — no returns, no refunds, excellent coffee.
            </motion.p>

            <div className="coffee-chat__stage">
              <CoffeeCalendarCard />

              <motion.aside
                className="coffee-chat__memes"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <figure className="coffee-chat__still">
                  <img
                    src="/assets/coffee/nikki-frown.jpg"
                    alt="Nikki’s iconic frown — how she looks when you reschedule"
                    width={280}
                    height={320}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <figcaption>How your calendar looks when you tap “maybe later”</figcaption>
                </figure>
                <figure className="coffee-chat__still coffee-chat__still--bear">
                  <img
                    src="/assets/coffee/bear-terror.jpg"
                    alt="Bear recoiling in bed — the correct reaction to missing coffee"
                    width={280}
                    height={200}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <figcaption>Why don’t you love… this time slot?</figcaption>
                </figure>
                <p className="coffee-chat__freaky">“I’m your freaky coffee buddy.”</p>
              </motion.aside>
            </div>
          </main>
        </>
      )}
    </div>
  )
}
