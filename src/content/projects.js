// Extracted from src/pages/Projects.jsx (canonical order, tech, links, period,
// color), enriched with paragraph descriptions from src/components/FileExplorer.jsx
// README content where a project has one, and with extra detail sentences from
// src/pages/Resume.jsx's `projects` array where it adds information Projects.jsx
// doesn't have. No content invented — see report for exactly which source fed
// which field per project.

export const projects = [
  {
    id: 'concord',
    title: 'Concord',
    blurb: 'AI-assisted IB interview prep with thousands of real-world questions. Target firms, learn concepts, and build your own roadmaps.',
    description: [
      'AI-assisted IB interview preparation with thousands of real-world interview questions. Target firms, learn concepts, and build your own roadmaps.',
      // Extra detail only present in Resume.jsx's project entry:
      'Heat matrix for what firms actually ask, plus module roadmaps and interviewer-cast mocks.'
    ],
    tech: ['IB Prep', 'Product', 'Software'],
    github: 'https://github.com/shourya0523/concord',
    demo: 'https://concord.courses',
    demoLabel: 'Website',
    period: 'May 2026 – Present',
    featured: true,
    accent: '#F59E0B',
    highlights: [],
    files: ['Heat', 'Modules', 'Mocks']
  },
  {
    id: 'rubber-duck',
    title: 'Rubber Duck',
    blurb: "Portable agent skill for rubber-duck debugging: index a repo, talk to a duck in the browser, and stream an agent's replies live.",
    description: [
      "Portable agent skill for rubber-duck debugging: index a repo, talk to a duck in the browser, and stream an agent's replies live."
    ],
    tech: ['Agent Skills', 'Node.js', 'MCP', 'SSE'],
    github: 'https://github.com/shourya0523/rubberduck',
    demo: null,
    demoLabel: null,
    period: 'August 2026',
    featured: true,
    accent: '#06B6D4',
    highlights: [],
    files: ['Skill', 'Bridge', 'Duck UI']
  },
  {
    id: 'por-kit',
    title: 'Por-Kit',
    blurb: 'Hosted portfolio CMS for developers to import career data, sync selected GitHub projects, and embed live portfolio content through an SDK, API, or widgets.',
    description: [
      'Hosted portfolio CMS for developers to import career data, sync selected GitHub projects, and embed live portfolio content through an SDK, API, or widgets.'
    ],
    tech: ['Next.js', 'TypeScript', 'React', 'PostgreSQL'],
    github: 'https://github.com/shourya0523/PorKit',
    demo: null,
    demoLabel: null,
    period: 'May 2026 – Present',
    featured: true,
    accent: '#F59E0B',
    highlights: [],
    files: ['CMS', 'SDK', 'Widgets']
  },
  {
    id: 'simsai',
    title: 'SiMSai',
    blurb: 'SMS-based agentic AI for remote patient monitoring. Works over basic text so patients without smartphones or reliable internet can still be reached.',
    description: [
      'SMS-based agentic AI for remote patient monitoring. Works over basic text messaging so patients without smartphones or reliable internet can still be reached.',
      'Tracks symptoms, monitors medication adherence, and escalates critical alerts to care teams. Designed around RPM billing codes (CPT 99453–99458).',
      'Won 1st place at the Husky Healthcare Innovation Challenge.'
    ],
    tech: ['Node.js', 'Twilio', 'Gemini', 'Redis'],
    github: 'https://github.com/shourya0523/SimisAI',
    demo: 'https://www.linkedin.com/posts/shouryadav_can-ai-help-save-lives-a-few-weeks-ago-activity-7441862829197983744-_DRt',
    demoLabel: 'Writeup',
    period: 'February 2026 – Present',
    featured: true,
    accent: '#22C55E',
    highlights: [
      'Symptom tracking and medication adherence over SMS',
      'Critical alert escalation to care teams',
      'Multilingual semantic intent detection',
      'Designed around RPM billing codes (CPT 99453–99458)',
      '1st Place · Husky Healthcare Innovation Challenge 2026'
    ],
    files: ['Messaging', 'Agent', 'Alerts']
  },
  {
    id: 'federated-dicom-search',
    title: 'Federated DICOM Search',
    blurb: 'Hospital-controlled imaging discovery for research. PHI stays at the hospital; the edge returns de-identified Clinical Evidence Records, count bands, and opaque study tokens.',
    description: [
      // FileExplorer.jsx's README adds "(TOA Healthcare Hack)", which does not
      // appear in Projects.jsx, Resume.jsx or Projects.txt — see report.
      'Hospital-controlled imaging discovery for research (TOA Healthcare Hack).',
      'Researchers search across sites from one portal; source PHI stays at the hospital. What leaves the edge is de-identified Clinical Evidence Records (CERs), count bands, and opaque study tokens — not patient names, MRNs, or DICOM UIDs.'
    ],
    tech: ['Healthcare', 'Data Engineering', 'Privacy'],
    github: 'https://github.com/shourya0523/DICOM',
    demo: null,
    demoLabel: null,
    period: 'July 2026 – August 2026',
    featured: false,
    accent: '#6366F1',
    highlights: [],
    files: ['Search', 'Edge', 'CERs']
  },
  {
    id: 'insync',
    title: 'InSync',
    blurb: 'Algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets.',
    description: [
      'An algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets.',
      // Extra detail only present in Resume.jsx's project entry:
      "Designing database schemas and matching algorithms to analyze venture capital financial data at scale."
    ],
    tech: ['Python', 'PostgreSQL', 'FastAPI', 'Scikit-Learn'],
    github: null,
    demo: 'https://insync-rg.com',
    demoLabel: 'Website',
    period: 'January 2026 – Present',
    featured: false,
    accent: '#3B82F6',
    highlights: [],
    files: ['Database', 'Matching', 'Pipelines']
  },
  {
    id: 'dawnpa',
    title: 'DawnPa',
    blurb: 'Comprehensive full-stack platform for healthcare tooling, currently under active development.',
    description: [
      'A comprehensive full-stack platform for healthcare tooling, currently under active development.'
    ],
    tech: ['Full-Stack', 'Healthcare', 'Tooling'],
    github: null,
    demo: null,
    demoLabel: null,
    period: 'Work in Progress',
    featured: false,
    accent: '#8B5CF6',
    highlights: [],
    files: ['Platform', 'Healthcare', 'Tooling']
  },
  {
    id: 'pact',
    title: 'Pact',
    blurb: 'Mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.',
    description: [
      'A mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.'
    ],
    tech: ['FastAPI', 'React Native', 'AWS EC2/S3', 'MongoDB'],
    github: 'https://github.com/shourya0523/Pact',
    demo: null,
    demoLabel: null,
    period: 'December 2025',
    featured: false,
    accent: '#10B981',
    highlights: [
      'Mobile-first accountability tracking',
      'Scalable backend architecture',
      'Cloud-hosted on AWS'
    ],
    files: ['Backend', 'Frontend', 'Database']
  },
  {
    id: 'claude-code-demo',
    title: 'Claude Code Demo',
    blurb: 'Comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations.',
    description: [
      'A comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations delivered to 50+ attendees.'
    ],
    tech: ['Claude Code', 'React', 'Python'],
    github: 'https://github.com/shourya0523/Claude_Code_Demo',
    demo: null,
    demoLabel: null,
    period: 'October 2025 – November 2025',
    featured: false,
    accent: '#F59E0B',
    highlights: [
      'Rapid MVP prototyping techniques',
      'Using Claude Code for development',
      'React and Python fundamentals',
      'Real-world examples and templates'
    ],
    files: ['Examples', 'Templates', 'Demos']
  },
  {
    id: 'spendr',
    title: 'Spendr',
    blurb: 'Hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.',
    description: [
      'A hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.'
    ],
    tech: ['JavaScript', 'Python', 'React'],
    github: null,
    demo: 'https://devpost.com/software/spendr',
    demoLabel: 'Demo',
    period: 'January 2025',
    featured: false,
    accent: '#EC4899',
    highlights: [
      'Bank data analysis',
      'Spending pattern matching',
      'Tinder-style swipe interface',
      'Financial compatibility scoring',
      'FinHacks AI/ML Track Winner (2025)'
    ],
    files: ['Algorithm', 'UI', 'Data']
  },
  {
    id: 'capturing',
    title: 'CapTuring',
    blurb: 'NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.',
    description: [
      'An NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.'
    ],
    tech: ['NumPy', 'Plotly', 'Scikit-Learn'],
    // Projects.jsx links this project to the GitHub profile root, not a specific
    // repo (unlike every other project here) — reproduced verbatim from source.
    github: 'https://github.com/shourya0523',
    demo: null,
    demoLabel: null,
    period: 'April 2025 – May 2025',
    featured: false,
    accent: '#06B6D4',
    highlights: [
      'TF-IDF vectorization',
      'Cosine similarity analysis',
      'Extensible architecture for text classification',
      'Visualization with Plotly'
    ],
    files: ['Pipeline', 'Features', 'Analysis']
  },
  {
    id: 'clubworks',
    title: 'ClubWorks',
    blurb: 'Full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.',
    description: [
      'A full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.'
    ],
    tech: ['Flask', 'MySQL', 'Streamlit', 'Docker'],
    github: 'https://github.com/shourya0523/Clubworks_CS3200',
    demo: null,
    demoLabel: null,
    period: 'March 2025 – May 2025',
    featured: false,
    accent: '#A855F7',
    highlights: [
      'Role-based access control',
      'Analytics dashboards',
      'Event management workflows',
      'Full-stack architecture'
    ],
    files: ['API', 'Dashboard', 'Config']
  }
]

export default projects
