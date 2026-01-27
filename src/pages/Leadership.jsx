import { motion } from 'framer-motion'
import { Users, Target, TrendingUp } from 'lucide-react'

const leadershipRoles = [
  {
    id: 1,
    title: 'Tech Lead',
    organization: 'Engineering Team',
    period: '2023 - Present',
    description: 'Leading a team of 8 engineers, setting technical direction and mentoring junior developers',
    achievements: [
      'Increased team productivity by 40%',
      'Implemented agile practices',
      'Mentored 5+ junior developers'
    ],
    icon: Users,
    color: 'text-blue-400'
  },
  {
    id: 2,
    title: 'Open Source Maintainer',
    organization: 'Community Project',
    period: '2022 - Present',
    description: 'Maintaining and contributing to open source projects with 10k+ stars',
    achievements: [
      'Managed 50+ contributors',
      'Released 10+ major versions',
      'Organized community events'
    ],
    icon: Target,
    color: 'text-green-400'
  },
  {
    id: 3,
    title: 'Conference Speaker',
    organization: 'Tech Conferences',
    period: '2021 - Present',
    description: 'Speaking at various tech conferences about software engineering and best practices',
    achievements: [
      'Presented at 5+ conferences',
      'Reached 1000+ developers',
      'Published technical articles'
    ],
    icon: TrendingUp,
    color: 'text-purple-400'
  },
]

export default function Leadership({ onFileClick }) {
  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Leadership & Impact</h1>
        <div className="space-y-6">
          {leadershipRoles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-12 h-12 ${role.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-2xl font-bold">{role.title}</h2>
                        <p className="text-blue-400">{role.organization}</p>
                      </div>
                      <span className="text-gray-400 text-sm">{role.period}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{role.description}</p>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 mb-2">Key Achievements:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {role.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-300">{achievement}</li>
                        ))}
                      </ul>
                    </div>
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
