import { motion } from 'framer-motion'
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react'

export default function Resume({ onFileClick }) {
  const experiences = [
    {
      title: 'Undergraduate Teaching Assistant – Advanced Programming with Data',
      company: 'Northeastern University, Khoury College of Computer Sciences',
      period: 'Jan 2026 – Present',
      description: 'Supported 50+ students weekly in Python-based data programming course. Led review sessions, created training materials, and streamlined grading processes.',
      accomplishments: [
        'Diagnose and resolve complex programming issues for 50+ students weekly, translating technical concepts clearly',
        'Lead review sessions and create comprehensive training materials, improving student comprehension outcomes',
        'Streamlined grading workflows and documentation processes, reducing turnaround time by 30%'
      ]
    },
    {
      title: 'AI/ML Researcher Co-op',
      company: 'SNAP Life Sciences',
      period: 'May 2025 – Dec 2025',
      description: 'Built NLP pipelines for pharmaceutical data processing. Developed semantic matching algorithms for healthcare data. Contributed significantly to proprietary database.',
      accomplishments: [
        'Architected NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials, cutting 70% of LLM costs',
        'Developed semantic-matching algorithms achieving 100% recall and F1 score > 0.45 for healthcare data',
        'Contributed 40% of proprietary drug and patent database through deep pharmaceutical dataset analysis',
        'Recruited and onboarded 10+ ML/engineering hires, strengthening technical operations'
      ]
    },
    {
      title: 'Sales & Business Development Intern',
      company: 'Attentions AI',
      period: 'Jul 2024 – Sep 2024',
      description: 'Supported go-to-market strategies for AI SaaS startup. Built marketing campaigns and generated qualified leads through multi-channel outreach.',
      accomplishments: [
        'Executed market and competitive research to support outbound GTM strategies in AI SaaS environment',
        'Launched 4+ multi-channel marketing campaigns, including automated email and social workflows',
        'Generated 500+ qualified leads leveraging Apollo.io, LinkedIn, and Python-based automation tools'
      ]
    },
    {
      title: 'Software Product Lab Lead',
      company: 'Forge – A Sherman Center Program',
      period: 'Aug 2025 – Dec 2025',
      description: 'Led 8-developer team through full product lifecycle building a mobile application. Managed agile workflows, authored PRDs, designed system architecture.',
      accomplishments: [
        'Directed 8-developer team building mobile application using agile practices and structured product workflows',
        'Accelerated development timeline by 4 weeks through low-fi wireframing and database schema redesign',
        'Architected cloud infrastructure using AWS EC2 and S3, implementing CI/CD pipelines for deployment'
      ]
    },
    {
      title: 'Director of Operations, Co-Founder',
      company: 'Claude Builders Club @ Northeastern',
      period: 'Aug 2025 – Present',
      description: 'Co-founded and scaled AI-focused student organization. Secured major sponsorships, organized events, and launched product incubator program.',
      accomplishments: [
        'Scaled organization to 200+ members and 12-person executive team, facilitating hands-on AI product building',
        'Orchestrated hackathons, workshops, and speaker events; secured $30,000+ in sponsorships',
        'Founded AI product incubator guiding 30 students through ideation, prototyping, and deployment'
      ]
    },
    {
      title: 'Executive Board Member',
      company: 'AI Club @ Northeastern',
      period: 'Dates TBD',
      description: 'Co-authored official AI policy for business school. Drove programming and operations for large student organization.',
      accomplishments: [
        'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
        'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
      ]
    },
    {
      title: 'Analyst',
      company: 'Pathway Investment Fund',
      period: 'Mar 2025 – Aug 2025',
      description: 'Conducted consumer sector analysis and contributed to investment portfolio decisions.',
      accomplishments: [
        'Performed industry analysis in the consumer sector, compiling tri-semesterly reports for investments team',
        'Added 4 companies to mock portfolio, yielding 18% simulated growth over 6 months'
      ]
    },
    {
      title: 'Analyst',
      company: 'Global Equity Management',
      period: 'Sep 2024 – Nov 2024',
      description: 'Analyzed SEC filings and presented investment theses to senior analysts.',
      accomplishments: [
        'Evaluated 5 years of SEC filings, assessing fundamentals, financial health, and competitive positioning',
        'Synthesized industry trends and presented acquisition-focused investment theses to senior analysts'
      ]
    }
  ]

  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Resume</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download size={20} />
            Download PDF
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* Education */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Education</h2>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
              <h3 className="text-xl font-bold">B.S. in Computer Science and Business</h3>
              <p className="text-blue-400">Northeastern University, D'Amore McKim School of Business</p>
              <p className="text-gray-400 text-sm mb-2">Expected May 2027 | GPA: 3.71</p>
              <p className="text-gray-300 text-sm">Concentration: Fintech | Minor: Interdisciplinary AI</p>
              <p className="text-gray-300 text-sm mt-2">Awards: John Martinson Honors Program, 4x Dean's List</p>
            </div>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-blue-400">{exp.company}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{exp.description}</p>
                  {exp.accomplishments && exp.accomplishments.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {exp.accomplishments.map((acc, idx) => (
                        <li key={idx} className="text-sm text-gray-300">{acc}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  )
}
