import { useState } from 'react'
import { motion } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import './CoffeeCalendarCard.css'

const NOTION_COFFEE_URL = 'https://calendar.notion.so/meet/shourya0523/coffee'

export { NOTION_COFFEE_URL }

export default function CoffeeCalendarCard() {
  const [selected, setSelected] = useState(undefined)
  const today = new Date()

  return (
    <motion.div
      className="coffee-calendar-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid="coffee-calendar-card"
      role="region"
      aria-label="Book a coffee chat"
    >
      <p className="coffee-calendar-card__eyebrow">Notion Calendar</p>
      <h2 className="coffee-calendar-card__title">Coffee with Shourya</h2>
      <p className="coffee-calendar-card__copy">
        Pick a day, then finish booking on Notion. Wishes can&apos;t be cancelled — meetings can.
      </p>

      <div className="coffee-calendar-card__picker" data-testid="coffee-day-picker">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={{ before: today }}
          startMonth={today}
          animate
        />
      </div>

      <a
        href={NOTION_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="coffee-calendar-card__cta"
        data-testid="coffee-calendar-cta"
      >
        {selected
          ? `Book ${selected.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} on Notion →`
          : 'Book the chat on Notion →'}
      </a>
    </motion.div>
  )
}
