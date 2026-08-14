import { motion } from 'framer-motion'
import { Users, Target, TrendingUp, Building2, ExternalLink } from 'lucide-react'

const leadershipRoles = [
  {
    id: 1,
    title: 'Software Tech Lead',
    organization: 'ACM at Northeastern University',
    period: 'Aug 2026 – Present',
    website: 'https://neu.acm.org',
    description: 'Software Tech Lead for ACM at Northeastern, the student chapter of the Association for Computing Machinery.',
    achievements: [
      'Lead software for ACM @ Northeastern, a student chapter running workshops, hackathons, and technical community programs'
    ],
    icon: Users,
    color: 'text-green-400'
  },
  {
    id: 2,
    title: 'AI Advisory Board Member',
    organization: 'Student Government Association of Northeastern University',
    period: 'Apr 2026 – Present',
    website: 'https://www.northeastern.edu',
    description: 'Serving on Northeastern SGA\'s AI Advisory Board, representing undergraduate student interests around AI policy, education, and campus life.',
    achievements: [
      'Advise student government on AI policy, education, and student-facing AI initiatives'
    ],
    icon: Building2,
    color: 'text-blue-400'
  },
  {
    id: 3,
    title: 'University Program',
    organization: 'The AI Collective',
    period: 'Apr 2026 – Present',
    website: 'https://www.genaicollective.ai',
    description: 'University program member of The AI Collective, connecting with founders, researchers, operators, and investors in the broader AI community.',
    achievements: [
      'Represent Northeastern in The AI Collective\'s university program'
    ],
    icon: Target,
    color: 'text-purple-400'
  },
  {
    id: 4,
    title: 'Advisory Board Member',
    organization: 'Northeastern AI Club',
    period: 'June 2025 – Aug 2026',
    website: 'https://aineu.org',
    description: 'Led collaboration between D\'Amore-McKim and AINU, co-authoring the policy on AI use in the classroom for 3,000+ students and driving programming for a 500+ member organization.',
    achievements: [
      'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
      'Led collaboration between D\'Amore-McKim and AINU on classroom AI use',
      'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
    ],
    icon: Target,
    color: 'text-cyan-400'
  },
  {
    id: 5,
    title: 'Co-Founder & Vice President',
    organization: 'Claude Builder Club Northeastern',
    period: 'Dec 2025 – Mar 2026',
    website: 'https://www.linkedin.com/company/northeastern-anthropic-builders-club',
    description: 'Co-founded Northeastern\'s Anthropic-sponsored Claude Builder Club. Grew it from zero to 200+ members, secured $30k+ in sponsorships, and ran workshops, hackathons, and a creatathon.',
    achievements: [
      'Grew the club from zero to 200+ members across engineering, business, and design',
      'Secured $30,000+ in sponsorships',
      'Ran workshops, hackathons, and a creatathon; delivered a Claude Code workshop on agent development',
      'Organized a fireside chat with a Senior PM from Alacriti (former Block), attended by 32 students',
      'Designed personalized project sprints tailored to members\' submitted ideas'
    ],
    icon: Building2,
    color: 'text-pink-400'
  },
  {
    id: 6,
    title: 'Software Product Lab Lead',
    organization: 'Forge – A Sherman Center Program',
    period: 'Aug 2025 – Dec 2025',
    website: 'https://shermancenter.northeastern.edu',
    description: 'Built and led an 8-person software team, developing end-to-end products. Managed agile workflows, authored PRDs, designed system architecture.',
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
    id: 7,
    title: 'Cohort 5',
    organization: 'rev',
    period: 'Jan 2026 – Apr 2026',
    website: 'https://www.linkedin.com/company/revschool',
    description: 'Building products inside Boston\'s rev community — including InSync and Authly.',
    achievements: [
      'Built InSync (insync-rg.com) and Authly as part of rev Cohort 5'
    ],
    icon: TrendingUp,
    color: 'text-yellow-400'
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
