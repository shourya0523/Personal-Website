import { motion } from 'framer-motion'
import { Trophy, Award, Star } from 'lucide-react'

const awards = [
  {
    id: 1,
    title: 'Best Innovation Award',
    organization: 'Tech Conference 2024',
    year: '2024',
    description: 'Recognized for innovative approach to solving complex problems',
    icon: Trophy,
    color: 'text-yellow-400'
  },
  {
    id: 2,
    title: 'Outstanding Developer',
    organization: 'Company Excellence Awards',
    year: '2023',
    description: 'Awarded for exceptional contributions to key projects',
    icon: Award,
    color: 'text-blue-400'
  },
  {
    id: 3,
    title: 'Hackathon Winner',
    organization: 'CodeFest 2023',
    year: '2023',
    description: 'First place in 48-hour hackathon competition',
    icon: Star,
    color: 'text-purple-400'
  },
  {
    id: 4,
    title: 'Open Source Contributor',
    organization: 'GitHub',
    year: '2022',
    description: 'Recognized for significant contributions to open source projects',
    icon: Star,
    color: 'text-green-400'
  },
]

export default function Awards({ onFileClick }) {
  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Awards & Recognition</h1>
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
