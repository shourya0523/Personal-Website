// Personal facts printed by src/components/Terminal.jsx's built-in commands
// (not the command engine itself — just the text). Reproduced verbatim from the
// template literals in that file.
//
// IMPORTANT DISCREPANCY: Terminal.jsx's `linkedin` / `github` / `email` commands
// (lines ~671-682) print contact details that disagree with every other source
// in the repo (src/pages/Contact.jsx, src/pages/Resume.jsx, Contact.txt,
// Resume.txt, and src/content/profile.js, which all agree on
// yadav.sho@northeastern.edu / github.com/shourya0523 / linkedin.com/in/shouryadav):
//   - linkedin command -> "https://linkedin.com/in/shouryayadav" (extra "ya")
//   - github command   -> "https://github.com/shouryayadav" (wrong handle entirely;
//                          the real GitHub is github.com/shourya0523)
//   - email command    -> "shourya.yadav@northeastern.edu" (dot instead of the
//                          real yadav.sho@northeastern.edu)
// These look like stale/copy-paste values in the terminal easter egg. They are
// captured below as `staleLinkedin` / `staleGithub` / `staleEmail` exactly as
// printed, for reference only — use `profile.links` for the correct values.

export const terminalFacts = {
  whoami: 'guest', // Terminal.jsx falls back to the string "guest" when no userName is set (there is no hardcoded username).

  about: [
    'Shourya Yadav',
    'JRA @ M3 | Software Lead @ ACM',
    "Northeastern University | D'Amore-McKim School of Business",
    '',
    '📍 Location: Boston, MA',
    '🎓 Concentration: Fintech',
    '🔬 Minor: Interdisciplinary AI',
    "⭐ GPA: 3.71 | Honors Program | 5x Dean's List",
    '',
    'Passionate about building at the intersection of',
    'technology and business strategy.'
  ],

  recruiterInfo: [
    '🎓 Education:',
    '  • Computer Science & Business, Northeastern University',
    '  • Concentration: Fintech | Minor: Interdisciplinary AI',
    "  • GPA: 3.71 | Honors Program | 5x Dean's List",
    '  • Location: Greater Boston',
    '',
    '💼 Current Role:',
    '  • Junior Healthcare Research Associate - M3',
    '  • Software Tech Lead - ACM at Northeastern',
    '',
    '🔧 Key Skills:',
    '  • Languages: Python, JavaScript, SQL, Java, HTML/CSS',
    '  • Frameworks: React.js, FastAPI, Flask, Express.js, LangChain',
    '  • Cloud: AWS (EC2, RDS, S3), Docker',
    '  • Databases: MySQL, PostgreSQL, MongoDB',
    '  • AI/ML: NLP pipelines, semantic matching, LLM optimization'
  ],

  skills: [
    'Languages & Frameworks:',
    '  • Python, JavaScript, SQL, Java, HTML, CSS',
    '  • Flask, FastAPI, React.js, Express.js, LangChain, Selenium',
    '',
    'Cloud & Infrastructure:',
    '  • AWS (EC2, RDS, S3, Lambda), Docker, CI/CD Pipelines',
    '  • Database Architecture, API Design',
    '',
    'Databases:',
    '  • MySQL, PostgreSQL, MongoDB, Redis',
    '',
    'AI/ML & Data:',
    '  • NLP Pipeline Architecture',
    '  • Semantic Matching Algorithms',
    '  • LLM Cost Optimization',
    '  • ETL Pipeline Development',
    '  • Data Processing (150k+ patents, 500k+ clinical trials)',
    '',
    'Tools & Technologies:',
    '  • Git, Jira, Agile Methodologies',
    '  • Apollo.io, LinkedIn Automation',
    '  • Python Automation Scripts'
  ],

  experience: [
    'Current:',
    '  • Junior Healthcare Research Associate | M3',
    '    Aug 2026 - Present | North America',
    '    → Healthcare research associate at M3',
    '',
    '  • Software Tech Lead | ACM at Northeastern',
    '    Aug 2026 - Present | Boston, MA',
    '    → Lead software for ACM @ Northeastern (neu.acm.org)',
    '',
    'Recent:',
    '  • Data Engineering Intern | Kroll',
    '    Jun 2026 - Aug 2026 | New York, NY (Hybrid)',
    '    → Built internal AI and data tools for risk and financial advisory teams',
    '    → Geographic AI intelligence engine; 70% Databricks cost-attribution coverage',
    '',
    '  • Undergraduate Teaching Assistant | Khoury College',
    '    Jan 2026 - Apr 2026',
    '    → Taught Advanced Programming with Data to 100+ students',
    '    → Streamlined grading workflows, reduced turnaround by 30%',
    '',
    '  • AI Engineer Co-op | SNAP Life Sciences',
    '    May 2025 - Dec 2025',
    '    → NLP ETL pipelines (150k+ patents, 500k+ trials, BioBERT/SciSpacy)',
    '    → Migrated ChEMBL (2.8M molecules) onto PostgreSQL/RDS',
    '    → AWS-native stack (RDS, S3, Lambda) for pharma dealmaking',
    '',
    '  • Sales & Business Development | Attentions AI',
    '    July 2024 - Sept 2024',
    '    → Built inbound/outbound sales pipelines',
    '    → Generated 500+ qualified leads via automation',
    '',
    'Leadership:',
    '  • AI Advisory Board Member | Northeastern SGA',
    '    Apr 2026 - Present',
    '',
    '  • Advisory Board Member | Northeastern AI Club',
    '    Jun 2025 - Present',
    '    → Co-authored DMSB AI classroom policy for 3,000+ students',
    '',
    '  • Co-Founder & Vice President | Claude Builder Club',
    '    Dec 2025 - Mar 2026',
    '    → Scaled to 200+ members, secured $30k+ sponsorships',
    '',
    '  • Software Product Lab Lead | Forge Program',
    '    Aug 2025 - Dec 2025',
    '    → Directed 8-developer team, accelerated timeline by 4 weeks'
  ],

  education: [
    'Northeastern University',
    "D'Amore-McKim School of Business",
    '',
    'Degree: Computer Science & Business',
    'Concentration: Fintech',
    'Minor: Interdisciplinary AI',
    '',
    'Academic Performance:',
    '  • GPA: 3.71',
    '  • John Martinson Honors Program',
    "  • 5x Dean's List Recognition",
    '',
    'Location: Boston, MA'
  ],

  summary: [
    'Shourya Yadav is a Computer Science & Business student at',
    'Northeastern University with a 3.71 GPA, pursuing Fintech',
    'concentration and Interdisciplinary AI minor.',
    '',
    'Key Strengths:',
    '  • AI/ML Research: Built NLP pipelines processing 150k+',
    '    documents, reduced LLM costs by 70%',
    '  • Full-Stack Development: Python, JavaScript, React,',
    '    FastAPI, AWS',
    '  • Leadership: Co-founded organizations reaching 200+',
    '    members, directed 8-developer teams',
    '  • Business Acumen: Investment analysis, GTM strategy,',
    '    secured $30k+ sponsorships',
    '',
    'Currently: Junior Healthcare Research Associate at M3 and',
    'Software Tech Lead at ACM @ Northeastern.'
  ],

  // See the discrepancy note at the top of this file — these do not match
  // profile.links / Contact.jsx / Resume.jsx.
  staleLinkedin: 'https://linkedin.com/in/shouryayadav',
  staleGithub: 'https://github.com/shouryayadav',
  staleEmail: 'shourya.yadav@northeastern.edu'
}

export default terminalFacts
