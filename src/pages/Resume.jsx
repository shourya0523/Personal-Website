import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, Briefcase, GraduationCap, Award, ExternalLink, Calendar, MapPin, TrendingUp, Code, Users, Target, Zap, Github, Linkedin, Mail, Phone, Globe, Rocket, Brain, Database, BookOpen } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Resume({ onFileClick }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const [expandedIndex, setExpandedIndex] = useState(null)

  // Professional Experience - Most recent first
  const experiences = [
    {
      title: 'Junior Healthcare Research Associate',
      company: 'M3',
      companyUrl: 'https://www.m3.com',
      period: 'August 2026 – Present',
      location: 'North America',
      icon: Brain,
      color: 'cyan',
      description: 'Junior Healthcare Research Associate at M3, supporting healthcare research across North America.',
      accomplishments: [
        'Healthcare research associate supporting studies and research operations at M3'
      ],
      metrics: []
    },
    {
      title: 'Data Engineering Intern',
      company: 'Kroll',
      companyUrl: 'https://www.kroll.com',
      period: 'June 2026 – August 2026',
      location: 'New York, NY · Hybrid',
      icon: Database,
      color: 'blue',
      description: 'Built AI tools for internal teams at Kroll in New York.',
      accomplishments: [
        'Built AI tools for internal teams'
      ],
      metrics: []
    },
    {
      title: 'Undergraduate Teaching Assistant – Advanced Programming with Data',
      company: 'Northeastern University, Khoury College of Computer Sciences',
      companyUrl: 'https://khoury.northeastern.edu',
      period: 'January 2026 – April 2026',
      location: 'Boston, MA',
      icon: GraduationCap,
      color: 'indigo',
      description: 'Taught Advanced Programming with Data to 100+ students, leading review sessions, creating training materials, and streamlining grading workflows to reduce turnaround time by 30%.',
      accomplishments: [
        'Taught advanced programming with data to 100+ students',
        'Diagnose and resolve complex programming issues, translating technical concepts clearly',
        'Lead review sessions and create comprehensive training materials, improving student comprehension outcomes',
        'Streamlined grading workflows and documentation processes, reducing turnaround time by 30%'
      ],
      metrics: ['100+', '30%']
    },
    {
      title: 'AI Engineer Co-op',
      company: 'SNAP Life Sciences',
      companyUrl: 'https://www.linkedin.com/company/snap-lifesciences',
      period: 'May 2025 – December 2025',
      location: 'Remote',
      icon: Code,
      color: 'purple',
      description: 'Engineered NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials with BioBERT and SciSpacy for biomedical NER. Migrated the ChEMBL chemistry database (2.8M molecules) onto PostgreSQL/RDS and built an AWS-native stack (RDS, S3, Lambda) for pharma dealmaking workflows.',
      accomplishments: [
        'Engineered NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials using BioBERT and SciSpacy for biomedical named entity recognition',
        'Migrated the ChEMBL chemistry database (2.8M molecules) onto PostgreSQL/RDS via dblink, with batch processing and idempotent upserts',
        'Built on an AWS-native stack (RDS, S3, Lambda) to support dealmaking workflows across pharma and biotech',
        'Developed semantic-matching algorithms achieving 100% recall and F1 score > 0.45 for healthcare data',
        'Contributed 40% of proprietary drug and patent database; recruited and onboarded 10+ ML/engineering hires'
      ],
      metrics: ['150k+', '2.8M', '100%']
    },
    {
      title: 'Sales & Business Development',
      company: 'Attentions AI',
      companyUrl: 'https://www.linkedin.com/company/attentions',
      period: 'July 2024 – September 2024',
      location: 'Pune, India',
      icon: Target,
      color: 'green',
      description: 'Built inbound and outbound sales pipelines. Executed market research supporting outbound GTM strategies, launched multi-channel marketing campaigns, and generated 500+ qualified leads through Apollo.io, LinkedIn, and Python automation.',
      accomplishments: [
        'Built inbound and outbound sales pipelines',
        'Executed market and competitive research to support outbound GTM strategies in AI SaaS environment',
        'Launched 4+ multi-channel marketing campaigns, including automated email and social workflows',
        'Generated 500+ qualified leads leveraging Apollo.io, LinkedIn, and Python-based automation tools'
      ],
      metrics: ['500+', '4+']
    }
  ]

  // Leadership - Most recent first
  const leadership = [
    {
      title: 'Software Tech Lead',
      company: 'ACM at Northeastern University',
      companyUrl: 'https://neu.acm.org',
      period: 'August 2026 – Present',
      location: 'Boston, MA',
      icon: Code,
      color: 'green',
      description: 'Software Tech Lead for ACM at Northeastern, the student chapter of the Association for Computing Machinery.',
      accomplishments: [
        'Lead software for ACM @ Northeastern, a student chapter running workshops, hackathons, and technical community programs'
      ],
      metrics: []
    },
    {
      title: 'AI Advisory Board Member',
      company: 'Student Government Association of Northeastern University',
      companyUrl: 'https://www.northeastern.edu',
      period: 'April 2026 – Present',
      location: 'Boston, MA',
      icon: Users,
      color: 'blue',
      description: 'Serving on Northeastern SGA\'s AI Advisory Board, representing undergraduate student interests around AI policy, education, and campus life.',
      accomplishments: [
        'Advise student government on AI policy, education, and student-facing AI initiatives'
      ],
      metrics: []
    },
    {
      title: 'University Program',
      company: 'The AI Collective',
      companyUrl: 'https://www.genaicollective.ai',
      period: 'April 2026 – Present',
      location: 'Boston, MA',
      icon: Rocket,
      color: 'purple',
      description: 'University program member of The AI Collective, connecting with founders, researchers, operators, and investors in the broader AI community.',
      accomplishments: [
        'Represent Northeastern in The AI Collective\'s university program'
      ],
      metrics: []
    },
    {
      title: 'Advisory Board Member',
      company: 'Northeastern AI Club',
      companyUrl: 'https://aineu.org',
      period: 'June 2025 – August 2026',
      location: 'Boston, MA',
      icon: Users,
      color: 'cyan',
      description: 'Led collaboration between D\'Amore-McKim and AINU, co-authoring the policy on AI use in the classroom for 3,000+ students and driving programming for a 500+ member organization.',
      accomplishments: [
        'Co-authored D\'Amore-McKim\'s official AI policy, establishing ethical guidelines for 3,000+ students',
        'Led collaboration between D\'Amore-McKim and AINU on classroom AI use',
        'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
      ],
      metrics: ['3,000+', '500+', '40%']
    },
    {
      title: 'Cohort 5',
      company: 'rev',
      companyUrl: 'https://www.linkedin.com/company/revschool',
      period: 'January 2026 – April 2026',
      location: 'Boston, MA',
      icon: Zap,
      color: 'yellow',
      description: 'Building products inside Boston\'s rev community of builders, founders, creatives, and researchers — including InSync and Authly.',
      accomplishments: [
        'Built InSync (insync-rg.com) and Authly as part of rev Cohort 5'
      ],
      metrics: ['3']
    },
    {
      title: 'Co-Founder & Vice President',
      company: 'Claude Builder Club Northeastern',
      companyUrl: 'https://www.linkedin.com/company/northeastern-anthropic-builders-club',
      period: 'December 2025 – March 2026',
      location: 'Boston, MA',
      icon: Users,
      color: 'pink',
      description: 'Co-founded Northeastern\'s Anthropic-sponsored Claude Builder Club, growing it from zero to 200+ members across engineering, business, and design. Secured $30k+ in sponsorships and ran workshops, hackathons, and a creatathon.',
      accomplishments: [
        'Grew the club from zero to 200+ members across engineering, business, and design',
        'Secured $30k+ in sponsorships',
        'Ran workshops, hackathons, and a creatathon; delivered a Claude Code workshop on agent development',
        'Organized a fireside chat with a Senior PM from Alacriti (former Block), attended by 32 students',
        'Designed personalized project sprints tailored to members\' submitted ideas'
      ],
      metrics: ['200+', '$30k+', '32']
    },
    {
      title: 'Software Product Lab Lead',
      company: 'Forge – A Sherman Center Program',
      companyUrl: 'https://shermancenter.northeastern.edu',
      period: 'August 2025 – December 2025',
      location: 'Boston, MA',
      icon: Zap,
      color: 'yellow',
      description: 'Built and led an 8-person software team, developing end-to-end products. Authored PRDs, designed API architecture, and accelerated the development timeline by 4 weeks through strategic wireframing and database redesign.',
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
      title: 'Treasurer',
      company: 'Northeastern Quantum Community',
      companyUrl: 'https://www.linkedin.com/company/qnu',
      period: 'April 2025 – December 2025',
      location: 'Boston, MA',
      icon: Target,
      color: 'indigo',
      description: 'Managed finances for Northeastern\'s Quantum Community, supporting campus engagement around quantum science and technology.',
      accomplishments: [
        'Handled treasury operations for the campus quantum community'
      ],
      metrics: []
    },
    {
      title: 'Investment Analyst',
      company: 'Pathway Investment Fund',
      companyUrl: 'https://www.linkedin.com/company/pathwayinvestmentfund',
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
      companyUrl: 'https://www.linkedin.com/company/global-equity-management',
      period: 'September 2024 – November 2024',
      location: 'Remote',
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

  // Projects - Most recent first
  const projects = [
    {
      name: 'Concord',
      period: 'May 2026 – Present',
      tech: 'Software Development, Product Management',
      description: 'AI-assisted IB interview preparation with thousands of real-world interview questions. Target firms, learn concepts, and build your own roadmaps. Heat matrix for what firms actually ask, plus module roadmaps and interviewer-cast mocks.',
      url: 'https://concord.courses',
      github: 'https://github.com/shourya0523/concord',
      icon: BookOpen,
      color: 'yellow'
    },
    {
      name: 'Federated DICOM Search',
      period: 'July 2026 – August 2026',
      tech: 'Healthcare, Data Engineering',
      description: 'Hospital-controlled imaging discovery for research. Researchers search across sites from one portal; source PHI stays at the hospital. What leaves the edge is de-identified Clinical Evidence Records (CERs), count bands, and opaque study tokens — not patient names, MRNs, or DICOM UIDs.',
      url: null,
      github: 'https://github.com/shourya0523/DICOM',
      icon: Database,
      color: 'indigo'
    },
    {
      name: 'SiMSai',
      period: 'February 2026 – Present',
      tech: 'Node.js, Twilio, Gemini, Redis, WhatsApp',
      description: 'SMS-based agentic AI for remote patient monitoring. Works over basic text messaging so patients without smartphones or reliable internet can still be reached. Tracks symptoms, monitors medication adherence, and escalates critical alerts to care teams. Designed around RPM billing codes (CPT 99453–99458).',
      url: 'https://www.linkedin.com/posts/shouryadav_can-ai-help-save-lives-a-few-weeks-ago-activity-7441862829197983744-_DRt',
      github: 'https://github.com/shourya0523/SimisAI',
      icon: Brain,
      color: 'green',
      award: '1st Place · Husky Healthcare Innovation Challenge 2026'
    },
    {
      name: 'InSync',
      period: 'January 2026 – Present',
      tech: 'Python, PostgreSQL, FastAPI, Scikit-Learn',
      description: 'An algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets. I\'m designing database schemas and matching algorithms to analyze venture capital financial data at scale.',
      url: 'https://insync-rg.com',
      github: null,
      icon: Rocket,
      color: 'blue'
    },
    {
      name: 'DawnPa',
      period: 'Work in Progress',
      tech: 'Full-Stack Healthcare Tooling Platform',
      description: 'A comprehensive full-stack platform for healthcare tooling, currently under active development.',
      url: null,
      github: null,
      icon: Brain,
      color: 'purple'
    },
    {
      name: 'Pact',
      period: 'December 2025',
      tech: 'FastAPI, React Native, AWS EC2/S3, MongoDB',
      description: 'A mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.',
      url: null,
      github: 'https://github.com/shourya0523/Pact',
      icon: Code,
      color: 'green'
    },
    {
      name: 'Claude Code Demo',
      period: 'October 2025 – November 2025',
      tech: 'Claude Code, React, Python',
      description: 'A comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations delivered to 50+ attendees.',
      url: null,
      github: 'https://github.com/shourya0523/Claude_Code_Demo',
      icon: Zap,
      color: 'yellow'
    },
    {
      name: 'Spendr',
      period: 'January 2025',
      tech: 'JavaScript, Python, React',
      description: 'A hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.',
      url: 'https://devpost.com/software/spendr',
      github: null,
      icon: Award,
      color: 'pink',
      award: 'FinHacks AI/ML Winner'
    },
    {
      name: 'CapTuring',
      period: 'April 2025 – May 2025',
      tech: 'NumPy, Plotly, Scikit-Learn',
      description: 'An NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.',
      url: null,
      github: null,
      icon: Brain,
      color: 'cyan'
    },
    {
      name: 'ClubWorks',
      period: 'March 2025 – May 2025',
      tech: 'Flask, MySQL, Streamlit, Docker',
      description: 'A full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.',
      url: null,
      github: 'https://github.com/shourya0523/Clubworks_CS3200',
      icon: Users,
      color: 'emerald'
    }
  ]

  const technicalSkills = {
    'Languages & Frameworks': ['Python', 'JavaScript', 'SQL', 'Java', 'HTML', 'CSS', 'Flask', 'FastAPI', 'React.js', 'Express.js', 'Node.js', 'LangChain', 'Selenium'],
    'Cloud & Databases': ['AWS (EC2, RDS, S3, Lambda)', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Database Architecture'],
    'Data Science & ML': ['Pandas', 'Scikit-Learn', 'HuggingFace', 'TensorFlow', 'NumPy', 'Plotly', 'PowerBI', 'BioBERT', 'SciSpacy', 'ETL Pipelines'],
    'Tools': ['Git', 'Jira', 'REST APIs', 'Agile/Scrum', 'N8N', 'Alteryx (Foundations Certified)']
  }

  const contactInfo = {
    email: 'yadav.sho@northeastern.edu',
    linkedin: 'https://linkedin.com/in/shouryadav',
    github: 'https://github.com/shourya0523',
    phone: '(510) 326-7626'
  }

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
    <div ref={containerRef} className="relative text-white h-full overflow-auto bg-gray-900/50">
      {/* Sticky Header */}
      <motion.div 
        className="sticky top-0 z-20 backdrop-blur-xl bg-gray-900/90 border-b border-gray-700/50"
        style={{ opacity: headerOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Resume
              </h1>
              <p className="text-gray-400 mt-1 text-sm md:text-base">Professional Experience & Education</p>
            </div>
            <motion.a
              href="/Shourya_Yadav_Gusto.pdf"
              download="Shourya_Yadav_Gusto.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all cursor-pointer shadow-lg shadow-blue-500/30"
            >
              <Download size={18} className="md:w-5 md:h-5" />
              Download PDF
            </motion.a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Education Section */}
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
                    <div className="text-2xl font-bold text-blue-400 mb-1">5x</div>
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

        {/* Professional Experience Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/50">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold">Professional Experience</h2>
          </div>

          <div className="relative">
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
                    <div className={`absolute left-0 w-16 h-16 ${colors.iconBg} rounded-full border-2 ${colors.border} flex items-center justify-center backdrop-blur-sm shadow-lg ${colors.glow}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    <motion.div
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className={`group cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} transition-all hover:shadow-2xl ${colors.glow} ${isExpanded ? 'shadow-2xl' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
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

                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {renderTextWithLinks(exp.description)}
                      </p>

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

        {/* Leadership Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/50">
              <Users className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold">Leadership</h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500 opacity-30" />
            
            <div className="space-y-8">
              {leadership.map((exp, index) => {
                const colors = getColorClasses(exp.color)
                const Icon = exp.icon
                const isExpanded = expandedIndex === `leadership-${index}`

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    <div className={`absolute left-0 w-16 h-16 ${colors.iconBg} rounded-full border-2 ${colors.border} flex items-center justify-center backdrop-blur-sm shadow-lg ${colors.glow}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    <motion.div
                      onClick={() => setExpandedIndex(isExpanded ? null : `leadership-${index}`)}
                      className={`group cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} transition-all hover:shadow-2xl ${colors.glow} ${isExpanded ? 'shadow-2xl' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
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

                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {renderTextWithLinks(exp.description)}
                      </p>

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

        {/* Projects Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/50">
              <Rocket className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => {
              const colors = getColorClasses(project.color)
              const Icon = project.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} transition-all hover:shadow-2xl ${colors.glow}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                        {project.award && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/50">
                            {project.award}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{project.period}</span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {renderTextWithLinks(project.description)}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.split(', ').map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 ${colors.bg} ${colors.border} border rounded text-xs ${colors.text}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-sm ${colors.text} hover:underline`}
                      >
                        <Globe size={14} />
                        Website
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-sm ${colors.text} hover:underline`}
                      >
                        <Github size={14} />
                        GitHub
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Technical Skills Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/50">
              <Code className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(technicalSkills).map(([category, skills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold mb-4 text-blue-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/50 rounded-lg text-sm text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/50">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold">Connect With Me</h2>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Mail className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-white group-hover:text-green-400 transition-colors">{contactInfo.email}</div>
                </div>
              </a>
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-400">LinkedIn</div>
                  <div className="text-white group-hover:text-blue-400 transition-colors">linkedin.com/in/shouryadav</div>
                </div>
                <ExternalLink size={14} className="ml-auto text-gray-400" />
              </a>
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Github className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-gray-400">GitHub</div>
                  <div className="text-white group-hover:text-purple-400 transition-colors">github.com/shourya0523</div>
                </div>
                <ExternalLink size={14} className="ml-auto text-gray-400" />
              </a>
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-xs text-gray-400">Phone</div>
                  <div className="text-white group-hover:text-yellow-400 transition-colors">{contactInfo.phone}</div>
                </div>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Personal Interests */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/50">
              <Award className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold">Personal Interests</h2>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <p className="text-gray-300 leading-relaxed">
              When I'm not coding or building organizations, you'll find me producing music, playing poker, exploring food scenes around the world, or binge-watching TV shows. I'm fluent in English and Hindi, with fundamental knowledge of German and Marathi.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
