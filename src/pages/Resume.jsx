import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, Briefcase, GraduationCap, Award, ExternalLink, Calendar, MapPin, TrendingUp, Code, Users, Target, Zap } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Resume({ onFileClick }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const [expandedIndex, setExpandedIndex] = useState(null)

  const experiences = [
    {
      title: 'Undergraduate Teaching Assistant – Advanced Programming with Data',
      company: 'Northeastern University, Khoury College of Computer Sciences',
      companyUrl: 'https://khoury.northeastern.edu',
      period: 'January 2026 – Present',
      location: 'Boston, MA',
      icon: GraduationCap,
      color: 'blue',
      description: 'I support 50+ students weekly in Advanced Programming with Data, leading review sessions, creating training materials, and streamlining grading workflows to reduce turnaround time by 30%.',
      accomplishments: [
        'Diagnose and resolve complex programming issues for 50+ students weekly, translating technical concepts clearly',
        'Lead review sessions and create comprehensive training materials, improving student comprehension outcomes',
        'Streamlined grading workflows and documentation processes, reducing turnaround time by 30%',
        'Translate complex technical concepts into clear documentation and guidance'
      ],
      metrics: ['50+', '30%']
    },
    {
      title: 'AI/ML Researcher Co-op',
      company: 'SNAP Life Sciences',
      companyUrl: null,
      period: 'May 2025 – December 2025',
      location: 'Remote',
      icon: Code,
      color: 'purple',
      description: 'At SNAP Life Sciences, I architected NLP ETL pipelines that processed over 150,000 patents and 500,000 clinical trials, reducing LLM costs by 70%. I developed semantic-matching algorithms achieving 100% recall for healthcare data classification and contributed 40% of the company\'s proprietary drug and patent database.',
      accomplishments: [
        'Architected NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials, cutting 70% of LLM costs',
        'Developed semantic-matching algorithms achieving 100% recall and F1 score > 0.45 for healthcare data',
        'Contributed 40% of proprietary drug and patent database through deep pharmaceutical dataset analysis',
        'Recruited and onboarded 10+ ML/engineering hires, strengthening technical operations',
        'Delivered technical demonstrations of NLP pipeline capabilities to prospective enterprise clients'
      ],
      metrics: ['150k+', '70%', '100%']
    },
    {
      title: 'Sales & Business Development Intern',
      company: 'Attentions AI',
      companyUrl: null,
      period: 'July 2024 – September 2024',
      location: 'Remote',
      icon: Target,
      color: 'green',
      description: 'I executed market research supporting outbound GTM strategies, launched multi-channel marketing campaigns, and generated 500+ qualified leads through Apollo.io, LinkedIn, and Python automation.',
      accomplishments: [
        'Executed market and competitive research to support outbound GTM strategies in AI SaaS environment',
        'Launched 4+ multi-channel marketing campaigns, including automated email and social workflows',
        'Generated 500+ qualified leads leveraging Apollo.io, LinkedIn, and Python-based automation tools',
        'Collaborated with sales teams to develop prospect outreach materials and product positioning content'
      ],
      metrics: ['500+', '4+']
    },
    {
      title: 'Software Product Lab Lead',
      company: 'Forge – A Sherman Center Program',
      companyUrl: 'https://shermancenter.northeastern.edu',
      period: 'August 2025 – December 2025',
      location: 'Boston, MA',
      icon: Zap,
      color: 'yellow',
      description: 'I directed an 8-developer team building a mobile application, authored PRDs, designed API architecture, and accelerated the development timeline by 4 weeks through strategic wireframing and database redesign.',
      accomplishments: [
        'Directed 8-developer team building mobile application using agile practices and structured product workflows',
        'Authored PRDs, defined API architecture, implemented CI/CD pipelines, and managed Jira for coordination',
        'Accelerated development timeline by 4 weeks through low-fi wireframing and database schema redesign',
        'Architected cloud infrastructure using AWS EC2 and S3, implementing CI/CD pipelines for deployment',
        'Delivered live product demonstrations showcasing mobile application features and technical capabilities'
      ],
      metrics: ['8', '4 weeks']
    },
    {
      title: 'Director of Operations, Co-Founder',
      company: 'Claude Builders Club @ Northeastern',
      companyUrl: null,
      period: 'August 2025 – Present',
      location: 'Boston, MA',
      icon: Users,
      color: 'pink',
      description: 'I co-founded and scaled this AI-focused organization to 200+ members with a 12-person executive team. We\'ve secured $30,000+ in sponsorships and I founded an AI product incubator guiding 30 students through ideation to deployment.',
      accomplishments: [
        'Scaled organization to 200+ members and 12-person executive team, facilitating hands-on AI product building',
        'Orchestrated hackathons, workshops, and speaker events; secured $30,000+ in sponsorships',
        'Founded AI product incubator guiding 30 students through ideation, prototyping, and deployment',
        'Deliver presentations to large audiences at workshops and events',
        'Secured sponsorships through client-facing pitches and strategic relationship management'
      ],
      metrics: ['200+', '$30k+', '30']
    },
    {
      title: 'Executive Board Member',
      company: 'AI Club @ Northeastern',
      companyUrl: 'https://aineu.org',
      period: 'June 2025 – Present',
      location: 'Boston, MA',
      icon: Users,
      color: 'cyan',
      description: 'I co-authored D\'Amore-McKim\'s official AI policy establishing ethical guidelines for 3,000+ students and drove programming for a 500+ member organization, increasing event attendance by 40%.',
      accomplishments: [
        'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
        'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
      ],
      metrics: ['3,000+', '500+', '40%']
    },
    {
      title: 'Analyst',
      company: 'Pathway Investment Fund',
      companyUrl: null,
      period: 'March 2025 – August 2025',
      location: 'Boston, MA',
      icon: TrendingUp,
      color: 'emerald',
      description: 'Conducted consumer sector analysis and contributed to investment portfolio decisions.',
      accomplishments: [
        'Performed industry analysis in the consumer sector, compiling tri-semesterly reports for investments team',
        'Added 4 companies to mock portfolio, yielding 18% simulated growth over 6 months'
      ],
      metrics: ['18%', '4']
    },
    {
      title: 'Analyst',
      company: 'Global Equity Management',
      companyUrl: null,
      period: 'September 2024 – November 2024',
      location: 'Boston, MA',
      icon: TrendingUp,
      color: 'indigo',
      description: 'Analyzed SEC filings and presented investment theses to senior analysts.',
      accomplishments: [
        'Evaluated 5 years of SEC filings, assessing fundamentals, financial health, and competitive positioning',
        'Synthesized industry trends and presented acquisition-focused investment theses to senior analysts'
      ],
      metrics: ['5 years']
    }
  ]

  const renderTextWithLinks = (text) => {
    if (!text) return text
    
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = urlPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      
      const url = match[0].startsWith('http') ? match[0] : `https://${match[0]}`
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
        >
          {match[0]}
          <ExternalLink size={12} className="inline" />
        </a>
      )
      lastIndex = match.index + match[0].length
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }
    
    return parts.length > 0 ? parts : text
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', iconBg: 'bg-blue-500/20', glow: 'shadow-blue-500/20' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', iconBg: 'bg-purple-500/20', glow: 'shadow-purple-500/20' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', iconBg: 'bg-green-500/20', glow: 'shadow-green-500/20' },
      yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', iconBg: 'bg-yellow-500/20', glow: 'shadow-yellow-500/20' },
      pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/50', text: 'text-pink-400', iconBg: 'bg-pink-500/20', glow: 'shadow-pink-500/20' },
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20', glow: 'shadow-cyan-500/20' },
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20', glow: 'shadow-emerald-500/20' },
      indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', iconBg: 'bg-indigo-500/20', glow: 'shadow-indigo-500/20' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div ref={containerRef} className="relative text-white h-full overflow-auto">
      {/* Sticky Header */}
      <motion.div 
        className="sticky top-0 z-20 backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50"
        style={{ opacity: headerOpacity }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Resume
              </h1>
              <p className="text-gray-400 mt-1">Professional Experience & Education</p>
            </div>
            <motion.a
              href="/Shourya_Yadav_Gusto.pdf"
              download="Shourya_Yadav_Gusto.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all cursor-pointer shadow-lg shadow-blue-500/30"
            >
              <Download size={20} />
              Download PDF
            </motion.a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Education Section - Magazine Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/50">
              <GraduationCap className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold">Education</h2>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-2">B.S. in Computer Science and Business</h3>
                  <a
                    href="https://damore-mckim.northeastern.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 text-lg mb-4"
                  >
                    Northeastern University, D'Amore McKim School of Business
                    <ExternalLink size={14} />
                  </a>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span>Expected May 2027</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span>Concentration: Fintech | Minor: Interdisciplinary AI</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/50">
                    <div className="text-4xl font-bold text-green-400 mb-1">3.71</div>
                    <div className="text-sm text-gray-300">GPA</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/50">
                    <div className="text-2xl font-bold text-blue-400 mb-1">4x</div>
                    <div className="text-sm text-gray-300">Dean's List</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/50">
                    <div className="text-sm font-semibold text-purple-400 mb-1">John Martinson</div>
                    <div className="text-sm text-gray-300">Honors Program</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Experience Section - Timeline Style */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/50">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold">Experience</h2>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-30" />
            
            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const colors = getColorClasses(exp.color)
                const Icon = exp.icon
                const isExpanded = expandedIndex === index

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-16 h-16 ${colors.iconBg} rounded-full border-2 ${colors.border} flex items-center justify-center backdrop-blur-sm shadow-lg ${colors.glow}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    {/* Experience Card */}
                    <motion.div
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className={`group cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} transition-all hover:shadow-2xl ${colors.glow} ${isExpanded ? 'shadow-2xl' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                            {exp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {exp.companyUrl ? (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${colors.text} hover:underline inline-flex items-center gap-1 font-semibold`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {exp.company}
                                <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className={`${colors.text} font-semibold`}>{exp.company}</span>
                            )}
                            {exp.location && (
                              <div className="flex items-center gap-1 text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      {/* Metrics Badges */}
                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {exp.metrics.map((metric, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 ${colors.bg} ${colors.border} border rounded-full text-xs font-semibold ${colors.text}`}
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {renderTextWithLinks(exp.description)}
                      </p>

                      {/* Accomplishments - Expandable */}
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {exp.accomplishments && exp.accomplishments.length > 0 && (
                          <div className="pt-4 border-t border-gray-700/50">
                            <h4 className={`text-sm font-semibold mb-3 ${colors.text} uppercase tracking-wide`}>
                              Key Accomplishments
                            </h4>
                            <ul className="space-y-2">
                              {exp.accomplishments.map((acc, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className={`${colors.text} mt-1.5`}>▸</span>
                                  <span>{renderTextWithLinks(acc)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>

                      {/* Expand Indicator */}
                      <div className="mt-4 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className={`text-xs ${colors.text} font-semibold`}
                        >
                          {isExpanded ? '▲ Less' : '▼ More'}
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}