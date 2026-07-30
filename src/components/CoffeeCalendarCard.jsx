import { motion } from 'framer-motion'

const NOTION_COFFEE_URL = 'https://calendar.notion.so/meet/shourya0523/coffee'

export { NOTION_COFFEE_URL }

export default function CoffeeCalendarCard() {
  return (
    <motion.a
      href={NOTION_COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="coffee-calendar-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid="coffee-calendar-card"
    >
      <div className="coffee-calendar-card__preview" aria-hidden="true">
        <span className="coffee-calendar-card__dot" />
        <span className="coffee-calendar-card__dot" />
        <span className="coffee-calendar-card__dot" />
        <div className="coffee-calendar-card__grid">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={i % 5 === 0 ? 'is-busy' : undefined} />
          ))}
        </div>
      </div>
      <div className="coffee-calendar-card__body">
        <p className="coffee-calendar-card__eyebrow">Notion Calendar</p>
        <h2 className="coffee-calendar-card__title">Coffee with Shourya</h2>
        <p className="coffee-calendar-card__copy">
          Pick a slot. Wishes can&apos;t be cancelled — meetings can.
        </p>
        <span className="coffee-calendar-card__cta">Book the chat →</span>
      </div>
    </motion.a>
  )
}
