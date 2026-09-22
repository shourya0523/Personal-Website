// Extracted from src/pages/About.jsx, src/pages/Resume.jsx, src/pages/Contact.jsx,
// src/components/Terminal.jsx ("about" command), About.txt, Contact.txt, Resume.txt.
// Plain data only — no React/JSX. See src/content/terminal.js for the (stale)
// contact details Terminal.jsx's easter-egg `linkedin`/`github`/`email` commands
// print, which disagree with every other source (see report/discrepancies).

export const profile = {
  name: 'Shourya Yadav',
  firstName: 'Shourya',
  // From About.jsx ProfileCard `title` prop (src/pages/About.jsx:57).
  // Terminal.jsx's `about` command prints the same line with a "|" instead of "·".
  headline: 'JRA @ M3 · Software Lead @ ACM',
  tagline: "CS and Business student at Northeastern (fintech + AI) who'd rather be building something than talking about building something.",
  bio: [
    "I'm Shourya — a CS and Business student at Northeastern (fintech + AI) who'd rather be building something than talking about building something.",
    "Right now I'm a Junior Healthcare Research Associate at M3 and Software Tech Lead at ACM, working on problems at the intersection of AI, healthcare, and finance.",
    "That looks like Concord for IB interview prep, SiMSai (1st at HHIC), InSync matching VCs with startups, or federated imaging search that keeps PHI at the hospital.",
    "I'm drawn to roles where I can build real things and lead teams doing the same.",
    "When I'm not coding, I'm producing music, playing poker, hunting for good food in random cities, or binge-watching shows I've already seen three times."
  ],
  // Additional bio line used only in About.txt (not present in About.jsx's hero text):
  extraBioNote: "I get restless when I'm not working on something, which is why I'm usually juggling a role, a couple side projects, and at least one organization that probably needs more of my attention. Not interested in busywork or meetings that could've been emails.",
  // Not stated as a discrete profile field anywhere; taken from Terminal.jsx's
  // `about` command output ("📍 Location: Boston, MA") since every work/leadership
  // entry with a location is also Boston, MA.
  location: 'Boston, MA',
  school: {
    name: "Northeastern University, D'Amore-McKim School of Business",
    degree: 'B.S. in Computer Science and Business',
    concentration: 'Fintech',
    minor: 'Interdisciplinary AI',
    expectedGraduation: 'May 2027',
    gpa: '3.71',
    honors: [
      'John Martinson Honors Program',
      "Dean's List (5x Recipient)"
    ]
  },
  // Grouped exactly as About.jsx / Resume.jsx group them. The source only ever
  // splits skills into 4 buckets (languages+frameworks combined, cloud, ml, tools),
  // so `frameworks` is left empty rather than invented by re-splitting `languages`.
  skills: {
    languages: [
      'Python', 'JavaScript', 'SQL', 'Java', 'HTML', 'CSS',
      'Flask', 'FastAPI', 'React.js', 'Express.js', 'Node.js', 'LangChain', 'Selenium'
    ],
    frameworks: [],
    cloudAndData: [
      'AWS (EC2, RDS, S3, Lambda)', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Database Architecture'
    ],
    mlAndAi: [
      'Pandas', 'Scikit-Learn', 'HuggingFace', 'TensorFlow', 'NumPy', 'Plotly', 'PowerBI', 'BioBERT', 'SciSpacy', 'ETL Pipelines'
    ],
    tools: [
      'Git', 'Jira', 'REST APIs', 'Agile/Scrum', 'N8N', 'Alteryx (Foundations Certified)'
    ]
  },
  interests: [
    'Music Production',
    'Poker',
    'Food Tourism',
    'Global Travel',
    'Binge-Watching TV Shows'
  ],
  // Only in About.txt, not in About.jsx's rendered text:
  languagesSpoken: [
    { language: 'English', level: 'Fluent' },
    { language: 'Hindi', level: 'Fluent' },
    { language: 'German', level: 'Fundamental knowledge' },
    { language: 'Marathi', level: 'Fundamental knowledge' }
  ],
  links: {
    email: 'yadav.sho@northeastern.edu',
    github: 'https://github.com/shourya0523',
    linkedin: 'https://linkedin.com/in/shouryadav',
    // Referenced by Resume.jsx's "Download PDF" button and FileExplorer.jsx's
    // Resume README, but no matching file exists under public/ — see report.
    resumePdf: '/Shourya_Yadav_Gusto.pdf',
    other: {
      phone: '(510) 326-7626'
    }
  }
}

export default profile
