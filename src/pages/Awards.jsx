import { motion } from 'framer-motion'
import { Trophy, Award, Star, GraduationCap } from 'lucide-react'

const awards = [
  {
    id: 1,
    title: 'FinHacks AI/ML Winner',
    organization: 'FinHacks Hackathon',
    year: '2025',
    description: 'First place in AI/ML category for Spendr financial compatibility app',
    icon: Trophy,
    color: 'text-yellow-400'
  },
  {
    id: 2,
    title: 'John Martinson Honors Program',
    organization: 'Northeastern University',
    year: '2024 - Present',
    description: 'Selected for prestigious honors program recognizing academic excellence',
    icon: GraduationCap,
    color: 'text-blue-400'
  },
  {
    id: 3,
    title: 'Dean\'s List',
    organization: 'Northeastern University',
    year: '4x Recipient',
    description: 'Recognized for outstanding academic achievement multiple semesters',
    icon: Award,
    color: 'text-purple-400'
  },
]

export default function Awards({ onFileClick }) {
  return (
    <div className="p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Awards & Recognition</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awards.map((award, index) => {
            const Icon = award.icon
            return (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-12 h-12 ${award.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold">{award.title}</h2>
                      <span className="text-gray-400 text-sm">{award.year}</span>
                    </div>
                    <p className="text-blue-400 mb-2">{award.organization}</p>
                    <p className="text-gray-300 text-sm">{award.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
