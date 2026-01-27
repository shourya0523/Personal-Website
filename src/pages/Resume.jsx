import { motion } from 'framer-motion'
import { Download, Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react'

export default function Resume({ onFileClick }) {
  const experiences = [
    {
      title: 'Undergraduate Teaching Assistant – Advanced Programming with Data',
      company: 'Northeastern University, Khoury College of Computer Sciences',
      companyUrl: 'https://khoury.northeastern.edu',
      period: 'January 2026 – Present',
      description: 'I support 50+ students weekly in Advanced Programming with Data, leading review sessions, creating training materials, and streamlining grading workflows to reduce turnaround time by 30%.',
      accomplishments: [
        'Diagnose and resolve complex programming issues for 50+ students weekly, translating technical concepts clearly',
        'Lead review sessions and create comprehensive training materials, improving student comprehension outcomes',
        'Streamlined grading workflows and documentation processes, reducing turnaround time by 30%',
        'Translate complex technical concepts into clear documentation and guidance'
      ]
    },
    {
      title: 'AI/ML Researcher Co-op',
      company: 'SNAP Life Sciences',
      companyUrl: null,
      period: 'May 2025 – December 2025',
      description: 'At SNAP Life Sciences, I architected NLP ETL pipelines that processed over 150,000 patents and 500,000 clinical trials, reducing LLM costs by 70%. I developed semantic-matching algorithms achieving 100% recall for healthcare data classification and contributed 40% of the company\'s proprietary drug and patent database.',
      accomplishments: [
        'Architected NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials, cutting 70% of LLM costs',
        'Developed semantic-matching algorithms achieving 100% recall and F1 score > 0.45 for healthcare data',
        'Contributed 40% of proprietary drug and patent database through deep pharmaceutical dataset analysis',
        'Recruited and onboarded 10+ ML/engineering hires, strengthening technical operations',
        'Delivered technical demonstrations of NLP pipeline capabilities to prospective enterprise clients'
      ]
    },
    {
      title: 'Sales & Business Development Intern',
      company: 'Attentions AI',
      companyUrl: null,
      period: 'July 2024 – September 2024',
      description: 'I executed market research supporting outbound GTM strategies, launched multi-channel marketing campaigns, and generated 500+ qualified leads through Apollo.io, LinkedIn, and Python automation.',
      accomplishments: [
        'Executed market and competitive research to support outbound GTM strategies in AI SaaS environment',
        'Launched 4+ multi-channel marketing campaigns, including automated email and social workflows',
        'Generated 500+ qualified leads leveraging Apollo.io, LinkedIn, and Python-based automation tools',
        'Collaborated with sales teams to develop prospect outreach materials and product positioning content'
      ]
    },
    {
      title: 'Software Product Lab Lead',
      company: 'Forge – A Sherman Center Program',
      companyUrl: 'https://shermancenter.northeastern.edu',
      period: 'August 2025 – December 2025',
      description: 'I directed an 8-developer team building a mobile application, authored PRDs, designed API architecture, and accelerated the development timeline by 4 weeks through strategic wireframing and database redesign.',
      accomplishments: [
        'Directed 8-developer team building mobile application using agile practices and structured product workflows',
        'Authored PRDs, defined API architecture, implemented CI/CD pipelines, and managed Jira for coordination',
        'Accelerated development timeline by 4 weeks through low-fi wireframing and database schema redesign',
        'Architected cloud infrastructure using AWS EC2 and S3, implementing CI/CD pipelines for deployment',
        'Delivered live product demonstrations showcasing mobile application features and technical capabilities'
      ]
    },
    {
      title: 'Director of Operations, Co-Founder',
      company: 'Claude Builders Club @ Northeastern',
      companyUrl: null,
      period: 'August 2025 – Present',
      description: 'I co-founded and scaled this AI-focused organization to 200+ members with a 12-person executive team. We\'ve secured $30,000+ in sponsorships and I founded an AI product incubator guiding 30 students through ideation to deployment.',
      accomplishments: [
        'Scaled organization to 200+ members and 12-person executive team, facilitating hands-on AI product building',
        'Orchestrated hackathons, workshops, and speaker events; secured $30,000+ in sponsorships',
        'Founded AI product incubator guiding 30 students through ideation, prototyping, and deployment',
        'Deliver presentations to large audiences at workshops and events',
        'Secured sponsorships through client-facing pitches and strategic relationship management'
      ]
    },
    {
      title: 'Executive Board Member',
      company: 'AI Club @ Northeastern',
      companyUrl: 'https://aineu.org',
      period: 'June 2025 – Present',
      description: 'I co-authored D\'Amore-McKim\'s official AI policy establishing ethical guidelines for 3,000+ students and drove programming for a 500+ member organization, increasing event attendance by 40%.',
      accomplishments: [
        'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
        'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
      ]
    },
    {
      title: 'Analyst',
      company: 'Pathway Investment Fund',
      companyUrl: null,
      period: 'March 2025 – August 2025',
      description: 'Conducted consumer sector analysis and contributed to investment portfolio decisions.',
      accomplishments: [
        'Performed industry analysis in the consumer sector, compiling tri-semesterly reports for investments team',
        'Added 4 companies to mock portfolio, yielding 18% simulated growth over 6 months'
      ]
    },
    {
      title: 'Analyst',
      company: 'Global Equity Management',
      companyUrl: null,
      period: 'September 2024 – November 2024',
      description: 'Analyzed SEC filings and presented investment theses to senior analysts.',
      accomplishments: [
        'Evaluated 5 years of SEC filings, assessing fundamentals, financial health, and competitive positioning',
        'Synthesized industry trends and presented acquisition-focused investment theses to senior analysts'
      ]
    }
  ]

  // Helper to render text with clickable links - only actual URLs, not tools
  const renderTextWithLinks = (text) => {
    if (!text) return text
    
    // Only match actual URLs (http/https/www.domain.com), not tool names
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = urlPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      
      // Add the link
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
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }
    
    return parts.length > 0 ? parts : text
  }

  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Resume</h1>
          <motion.a
            href="/Shourya_Yadav_Gusto.pdf"
            download="Shourya_Yadav_Gusto.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download size={20} />
            Download PDF
          </motion.a>
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
              <a
                href="https://damore-mckim.northeastern.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
              >
                Northeastern University, D'Amore McKim School of Business
                <ExternalLink size={12} />
              </a>
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
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                        >
                          {exp.company}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <p className="text-blue-400">{exp.company}</p>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{renderTextWithLinks(exp.description)}</p>
                  {exp.accomplishments && exp.accomplishments.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {exp.accomplishments.map((acc, idx) => (
                        <li key={idx} className="text-sm text-gray-300">
                          {renderTextWithLinks(acc)}
                        </li>
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
