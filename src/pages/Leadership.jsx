import { motion } from 'framer-motion'
import { Users, Target, TrendingUp, Building2, ExternalLink } from 'lucide-react'

const leadershipRoles = [
  {
    id: 1,
    title: 'Director of Operations, Co-Founder',
    organization: 'Claude Builders Club @ Northeastern',
    period: 'Aug 2025 – Present',
    description: 'Co-founded and scaled AI-focused student organization. Secured major sponsorships, organized events, and launched product incubator program.',
    achievements: [
      'Scaled organization to 200+ members and 12-person executive team, facilitating hands-on AI product building',
      'Orchestrated hackathons, workshops, and speaker events; secured $30,000+ in sponsorships',
      'Founded AI product incubator guiding 30 students through ideation, prototyping, and deployment',
      'Deliver presentations to large audiences at workshops and events'
    ],
    icon: Building2,
    color: 'text-blue-400'
  },
  {
    id: 2,
    title: 'Software Product Lab Lead',
    organization: 'Forge – A Sherman Center Program',
    period: 'Aug 2025 – Dec 2025',
    description: 'Led 8-developer team through full product lifecycle building a mobile application. Managed agile workflows, authored PRDs, designed system architecture.',
    achievements: [
      'Directed 8-developer team building mobile application using agile practices and structured product workflows',
      'Authored PRDs, defined API architecture, implemented CI/CD pipelines, and managed Jira for coordination',
      'Accelerated development timeline by 4 weeks through low-fi wireframing and database schema redesign',
      'Delivered live product demonstrations showcasing mobile application features and technical capabilities'
    ],
    icon: Users,
    color: 'text-green-400'
  },
  {
    id: 3,
    title: 'Executive Board Member',
    organization: 'AI Club @ Northeastern',
    period: 'June 2025 – Present',
    website: 'https://aineu.org',
    description: 'I co-authored D\'Amore-McKim\'s official AI policy establishing ethical guidelines for 3,000+ students and drove programming for a 500+ member organization, increasing event attendance by 40%.',
    achievements: [
      'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
      'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
    ],
    icon: Target,
    color: 'text-purple-400'
  },
]

export default function Leadership({ onFileClick }) {
  return (
    <div className="p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Leadership & Impact</h1>
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
                        <div className="flex items-center gap-2">
                          <p className="text-blue-400">{role.organization}</p>
                          {role.website && (
                            <a
                              href={role.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-400 text-sm underline"
                            >
                              Website
                            </a>
                          )}
                        </div>
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
