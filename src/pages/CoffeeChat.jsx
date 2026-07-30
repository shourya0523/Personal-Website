import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import CoffeeCalendarCard from '../components/CoffeeCalendarCard'
import './CoffeeChat.css'

const BloodFluidBackground = lazy(
  () => import('../components/BloodFluidBackground/BloodFluidBackground'),
)
const WillowScene = lazy(() => import('../components/WillowScene'))

export default function CoffeeChat() {
  return (
    <div className="coffee-chat" data-testid="coffee-chat">
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
          <span className="coffee-chat__no">No no no no no…</span>
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
          One Wish Willow says wishes stick forever. This calendar link is friendlier.
          Book a slot — no cursed novelty toys required.
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

        <Suspense fallback={null}>
          <div className="coffee-chat__willow">
            <WillowScene />
          </div>
        </Suspense>
      </main>
    </div>
  )
}
