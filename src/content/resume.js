// Merged from src/pages/Resume.jsx, src/pages/Awards.jsx, src/pages/Leadership.jsx,
// Resume.txt, Awards.txt and Leadership.txt. Resume.jsx (synced most recently,
// see git log "Sync August portfolio content") is treated as canonical wherever
// sources disagree; discrepancies are called out inline and in the report.

export const resume = {
  education: [
    {
      school: "Northeastern University, D'Amore-McKim School of Business",
      degree: 'B.S. in Computer Science and Business',
      period: 'Expected May 2027',
      details: [
        'GPA: 3.71',
        'Concentration: Fintech',
        'Minor: Interdisciplinary AI',
        'John Martinson Honors Program',
        "Dean's List: 5x Recipient"
      ]
    }
  ],

  // Order matches Resume.jsx (most recent first).
  experience: [
    {
      org: 'M3',
      role: 'Junior Healthcare Research Associate',
      period: 'August 2026 – Present',
      location: 'North America',
      bullets: [
        'Healthcare research associate supporting studies and research operations at M3'
      ]
    },
    {
      org: 'Kroll',
      role: 'Data Engineering Intern',
      period: 'June 2026 – August 2026',
      location: 'New York, NY · Hybrid',
      bullets: [
        'Built a geographic AI intelligence engine with Azure OpenAI, Llama, Databricks, knowledge graphs, WebGL, and a custom projection',
        'Reached 70% cost-attribution coverage on Databricks through semantic and ML asset tagging',
        'Migrated Chainsys-Databricks ETL workflows to improve turnaround time and uptime',
        "Presented AI design tools through Kroll's enterprise knowledge-sharing program"
      ]
    },
    {
      org: 'Northeastern University, Khoury College of Computer Sciences',
      role: 'Undergraduate Teaching Assistant – Advanced Programming with Data',
      period: 'January 2026 – April 2026',
      location: 'Boston, MA',
      bullets: [
        'Taught advanced programming with data to 100+ students',
        'Diagnose and resolve complex programming issues, translating technical concepts clearly',
        'Lead review sessions and create comprehensive training materials, improving student comprehension outcomes',
        'Streamlined grading workflows and documentation processes, reducing turnaround time by 30%'
      ]
    },
    {
      org: 'SNAP Life Sciences',
      role: 'AI Engineer Co-op',
      period: 'May 2025 – December 2025',
      location: 'Remote',
      bullets: [
        'Engineered NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials using BioBERT and SciSpacy for biomedical named entity recognition',
        'Migrated the ChEMBL chemistry database (2.8M molecules) onto PostgreSQL/RDS via dblink, with batch processing and idempotent upserts',
        'Built on an AWS-native stack (RDS, S3, Lambda) to support dealmaking workflows across pharma and biotech',
        'Developed semantic-matching algorithms achieving 100% recall and F1 score > 0.45 for healthcare data',
        'Contributed 40% of proprietary drug and patent database; recruited and onboarded 10+ ML/engineering hires'
      ]
    },
    {
      org: 'Attentions AI',
      role: 'Sales & Business Development',
      period: 'July 2024 – September 2024',
      location: 'Pune, India',
      bullets: [
        'Built inbound and outbound sales pipelines',
        'Executed market and competitive research to support outbound GTM strategies in AI SaaS environment',
        'Launched 4+ multi-channel marketing campaigns, including automated email and social workflows',
        'Generated 500+ qualified leads leveraging Apollo.io, LinkedIn, and Python-based automation tools'
      ]
    }
  ],

  awards: [
    {
      title: '1st Place at Husky Healthcare Innovation Challenge',
      org: 'ViTAL at Northeastern University',
      year: '2026',
      description: 'First place for SiMSai, an SMS-based agentic AI prototype for remote patient monitoring, pitched with a live demo'
    },
    {
      title: 'FinHacks AI/ML Track Winner',
      org: 'Disrupt at Northeastern',
      year: '2025',
      description: 'First place in AI/ML category for Spendr, a financial compatibility app using bank data analysis'
    },
    {
      title: 'John Martinson Honors Program',
      org: 'Northeastern University',
      year: '2024 - Present',
      description: 'Selected for prestigious honors program recognizing academic excellence'
    },
    {
      title: "Dean's List",
      org: 'Northeastern University',
      year: '5x Recipient',
      description: 'Recognized for outstanding academic achievement across five semesters'
    }
  ],

  // Resume.jsx's `leadership` array (10 roles) is used here as canonical: it is a
  // .jsx page synced most recently and is a strict superset of Leadership.jsx /
  // Leadership.txt, which both list only 7 roles and omit Treasurer @ Northeastern
  // Quantum Community, Investment Analyst @ Pathway Investment Fund, and Analyst @
  // Global Equity Management. See report for the full discrepancy note.
  leadership: [
    {
      org: 'ACM at Northeastern University',
      role: 'Software Tech Lead',
      period: 'August 2026 – Present',
      location: 'Boston, MA',
      bullets: [
        'Lead software for ACM @ Northeastern, a student chapter running workshops, hackathons, and technical community programs'
      ]
    },
    {
      org: 'Student Government Association of Northeastern University',
      role: 'AI Advisory Board Member',
      period: 'April 2026 – Present',
      location: 'Boston, MA',
      bullets: [
        'Advise student government on AI policy, education, and student-facing AI initiatives'
      ]
    },
    {
      org: 'The AI Collective',
      role: 'University Program',
      period: 'April 2026 – Present',
      location: 'Boston, MA',
      bullets: [
        "Represent Northeastern in The AI Collective's university program"
      ]
    },
    {
      org: 'Northeastern AI Club',
      role: 'Advisory Board Member',
      period: 'June 2025 – August 2026',
      location: 'Boston, MA',
      bullets: [
        "Co-authored D'Amore-McKim's official AI policy, establishing ethical guidelines for 3,000+ students",
        'Led collaboration between D\'Amore-McKim and AINU on classroom AI use',
        'Drove programming and operations for 500+ member organization, increasing event attendance by 40%'
      ]
    },
    {
      org: 'rev',
      role: 'Cohort 5',
      period: 'January 2026 – April 2026',
      location: 'Boston, MA',
      bullets: [
        'Built InSync (insync-rg.com) and Authly as part of rev Cohort 5'
      ]
    },
    {
      org: 'Claude Builder Club Northeastern',
      role: 'Co-Founder & Vice President',
      period: 'December 2025 – March 2026',
      location: 'Boston, MA',
      bullets: [
        'Grew the club from zero to 200+ members across engineering, business, and design',
        'Secured $30k+ in sponsorships',
        'Ran workshops, hackathons, and a creatathon; delivered a Claude Code workshop on agent development',
        'Organized a fireside chat with a Senior PM from Alacriti (former Block), attended by 32 students',
        "Designed personalized project sprints tailored to members' submitted ideas"
      ]
    },
    {
      org: 'Forge – A Sherman Center Program',
      role: 'Software Product Lab Lead',
      period: 'August 2025 – December 2025',
      location: 'Boston, MA',
      bullets: [
        'Directed 8-developer team building mobile application using agile practices and structured product workflows',
        'Authored PRDs, defined API architecture, implemented CI/CD pipelines, and managed Jira for coordination',
        'Accelerated development timeline by 4 weeks through low-fi wireframing and database schema redesign',
        'Architected cloud infrastructure using AWS EC2 and S3, implementing CI/CD pipelines for deployment',
        'Delivered live product demonstrations showcasing mobile application features and technical capabilities'
      ]
    },
    {
      org: 'Northeastern Quantum Community',
      role: 'Treasurer',
      period: 'April 2025 – December 2025',
      location: 'Boston, MA',
      bullets: [
        'Handled treasury operations for the campus quantum community'
      ]
    },
    {
      org: 'Pathway Investment Fund',
      role: 'Investment Analyst',
      period: 'March 2025 – August 2025',
      location: 'Boston, MA',
      bullets: [
        'Performed industry analysis in the consumer sector, compiling tri-semesterly reports for investments team',
        'Added 4 companies to mock portfolio, yielding 18% simulated growth over 6 months'
      ]
    },
    {
      org: 'Global Equity Management',
      role: 'Analyst',
      period: 'September 2024 – November 2024',
      location: 'Remote',
      bullets: [
        'Evaluated 5 years of SEC filings, assessing fundamentals, financial health, and competitive positioning',
        'Synthesized industry trends and presented acquisition-focused investment theses to senior analysts'
      ]
    }
  ],

  // Not a distinct "certifications" section in any source; the only credential-like
  // item is "Alteryx (Foundations Certified)", listed inside the Tools skill group
  // in About.jsx / Resume.jsx / About.txt / Resume.txt. Surfaced here too since the
  // schema calls for a certifications list — year is not stated anywhere.
  certifications: [
    {
      name: 'Alteryx Foundations Certified',
      issuer: 'Alteryx',
      year: null
    }
  ]
}

export default resume
