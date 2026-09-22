// Normalized file tree extracted verbatim from src/components/FileExplorer.jsx's
// `fileStructure` export. Markdown/plain-text content strings are reproduced
// exactly as authored there. `opens` reflects src/App.jsx's `handleFileClick`
// folder-name -> app mapping, translated into this task's app-id vocabulary
// ('about' | 'projects' | 'resume' | 'contact' | 'files' | 'terminal' | 'music').
// The Awards and Leadership folders map to their own pages in the current site
// (App.jsx opens an 'awards' / 'leadership' app for them) but those ids are not
// part of the requested vocabulary, so their folders/files carry opens: null here
// — see report.

export const files = {
  "name": "Files",
  "type": "folder",
  "opens": null,
  "children": [
    {
      "name": "About",
      "type": "folder",
      "opens": "about",
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# About Me\n\nI'm **Shourya** — a CS and Business student at Northeastern (fintech + AI), Junior Healthcare Research Associate at M3, and Software Tech Lead at ACM.\n\nI like solving problems at the intersection of AI, healthcare, and finance — Concord for IB interview prep, SiMSai (1st at HHIC), InSync matching VCs with startups, or federated imaging search that keeps PHI at the hospital.\n\nI get restless when I'm not working on something, which is why I'm usually juggling a role, a couple side projects, and at least one organization that probably needs more of my attention.\n\nI'm drawn to roles where I can build real things and lead teams doing the same. Not interested in busywork or meetings that could've been emails.\n\nWhen I'm not coding, I'm producing music, playing poker, hunting for good food in random cities, or binge-watching shows I've already seen three times.\n\n## Skills\n\n### Languages & Frameworks\n- Python, JavaScript, SQL, Java, HTML, CSS\n- Flask, FastAPI, React.js, Express.js, Node.js, LangChain, Selenium\n\n### Cloud & Databases\n- AWS (EC2, RDS, S3, Lambda), MySQL, PostgreSQL, MongoDB, Redis, Docker\n\n### Data Science & ML\n- Pandas, Scikit-Learn, HuggingFace, TensorFlow, NumPy, Plotly, PowerBI, BioBERT, SciSpacy, ETL Pipelines\n\n### Tools\n- Git, Jira, REST APIs, Agile/Scrum, N8N, Alteryx (Foundations Certified)\n",
          "opens": "about"
        }
      ]
    },
    {
      "name": "Projects",
      "type": "folder",
      "opens": "projects",
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Projects\n\nA collection of projects I've built, from hackathon winners to full-stack platforms.\n\n## Featured Projects\n\n### Concord\n**Status:** Active  \n**Tech Stack:** Software Development, Product Management  \n**Description:** AI-assisted IB interview prep with thousands of real-world questions. Target firms, learn concepts, and build your own roadmaps.  \n**Website:** [concord.courses](https://concord.courses)  \n**GitHub:** [github.com/shourya0523/concord](https://github.com/shourya0523/concord)\n\n### Rubber Duck\n**Status:** Completed (August 2026)\n**Tech Stack:** Agent Skills, Node.js, MCP, SSE\n**Description:** Portable agent skill for rubber-duck debugging: index a repo, talk to a duck in the browser, and stream an agent's replies live.\n**GitHub:** [github.com/shourya0523/rubberduck](https://github.com/shourya0523/rubberduck)\n\n### Por-Kit\n**Status:** Active Development\n**Tech Stack:** Next.js, TypeScript, React, PostgreSQL\n**Description:** Hosted portfolio CMS for developers to import career data, sync selected GitHub projects, and embed live portfolio content through an SDK, API, or widgets.\n**GitHub:** [github.com/shourya0523/PorKit](https://github.com/shourya0523/PorKit)\n\n### SiMSai\n**Status:** Active · 1st Place HHIC 2026  \n**Tech Stack:** Node.js, Twilio, Gemini, Redis, WhatsApp  \n**Description:** SMS-based agentic AI for remote patient monitoring. Works over basic text so patients without smartphones or reliable internet can still be reached.  \n**GitHub:** [github.com/shourya0523/SimisAI](https://github.com/shourya0523/SimisAI)  \n**Writeup:** [LinkedIn](https://www.linkedin.com/posts/shouryadav_can-ai-help-save-lives-a-few-weeks-ago-activity-7441862829197983744-_DRt)\n\n### Federated DICOM Search\n**Status:** Completed (July 2026 – August 2026)  \n**Tech Stack:** Healthcare, Data Engineering  \n**Description:** Hospital-controlled imaging discovery for research. PHI stays at the hospital; the edge returns de-identified Clinical Evidence Records, count bands, and opaque study tokens.  \n**GitHub:** [github.com/shourya0523/DICOM](https://github.com/shourya0523/DICOM)\n\n### InSync\n**Status:** Active Development  \n**Tech Stack:** Python, PostgreSQL, FastAPI, Scikit-Learn  \n**Description:** An algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets. Designing database schemas and matching algorithms to analyze venture capital financial data at scale.  \n**Website:** [insync-rg.com](https://insync-rg.com)\n\n### DawnPa\n**Status:** Work in Progress  \n**Tech Stack:** Full-Stack Healthcare Tooling Platform  \n**Description:** A comprehensive full-stack platform for healthcare tooling, currently under active development.\n\n### Pact\n**Status:** Completed (December 2025)  \n**Tech Stack:** FastAPI, React Native, AWS EC2/S3, MongoDB  \n**Description:** A mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.  \n**GitHub:** [github.com/shourya0523/Pact](https://github.com/shourya0523/Pact)\n\n### Claude Code Demo\n**Status:** Completed (October 2025 – November 2025)  \n**Tech Stack:** Claude Code, React, Python  \n**Description:** A comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations delivered to 50+ attendees.  \n**GitHub:** [github.com/shourya0523/Claude_Code_Demo](https://github.com/shourya0523/Claude_Code_Demo)\n\n### Spendr\n**Status:** Completed (January 2025)  \n**Tech Stack:** JavaScript, Python, React  \n**Description:** A hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.  \n**Award:** 🏆 FinHacks AI/ML Winner  \n**Devpost:** [devpost.com/software/spendr](https://devpost.com/software/spendr)\n\n### CapTuring\n**Status:** Completed (April 2025 – May 2025)  \n**Tech Stack:** NumPy, Plotly, Scikit-Learn  \n**Description:** An NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.\n\n### ClubWorks\n**Status:** Completed (March 2025 – May 2025)  \n**Tech Stack:** Flask, MySQL, Streamlit, Docker  \n**Description:** A full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.  \n**GitHub:** [github.com/shourya0523/Clubworks_CS3200](https://github.com/shourya0523/Clubworks_CS3200)\n",
          "opens": "projects"
        },
        {
          "name": "Concord",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Concord\n\nAI-assisted IB interview preparation with thousands of real-world interview questions. Target firms, learn concepts, and build your own roadmaps.\n\n## Links\n\n- **Website:** [concord.courses](https://concord.courses)\n- **GitHub:** [github.com/shourya0523/concord](https://github.com/shourya0523/concord)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "Federated DICOM Search",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Federated DICOM Search\n\nHospital-controlled imaging discovery for research (TOA Healthcare Hack).\n\nResearchers search across sites from one portal; source PHI stays at the hospital. What leaves the edge is de-identified Clinical Evidence Records (CERs), count bands, and opaque study tokens — not patient names, MRNs, or DICOM UIDs.\n\n**GitHub:** [github.com/shourya0523/DICOM](https://github.com/shourya0523/DICOM)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "SiMSai",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# SiMSai\n\n🏆 **1st Place · Husky Healthcare Innovation Challenge 2026**\n\nSMS-based agentic AI for remote patient monitoring. Works over basic text messaging so patients without smartphones or reliable internet can still be reached.\n\n## Tech Stack\n\n- Node.js, Twilio, Gemini, Redis, WhatsApp\n\n## Key Features\n\n- Symptom tracking and medication adherence over SMS\n- Critical alert escalation to care teams\n- Multilingual semantic intent detection\n- Designed around RPM billing codes (CPT 99453–99458)\n\n**GitHub:** [github.com/shourya0523/SimisAI](https://github.com/shourya0523/SimisAI)\n**Writeup:** [LinkedIn post](https://www.linkedin.com/posts/shouryadav_can-ai-help-save-lives-a-few-weeks-ago-activity-7441862829197983744-_DRt)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "Pact",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Pact\n\nA mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.\n\n## Tech Stack\n\n- **Backend:** FastAPI, AWS EC2/S3, MongoDB\n- **Frontend:** React Native\n- **Architecture:** Scalable cloud infrastructure\n\n## Key Features\n\n- Mobile-first accountability tracking\n- Scalable backend architecture\n- Cloud-hosted on AWS\n\n**GitHub:** [github.com/shourya0523/Pact](https://github.com/shourya0523/Pact)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "Claude Code Demo",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Claude Code Demo\n\nA comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs.\n\n## Overview\n\n- **Duration:** October 2025 – November 2025\n- **Audience:** 50+ attendees\n- **Content:** 30+ examples, templates, and live demonstrations\n\n## Topics Covered\n\n- Rapid MVP prototyping techniques\n- Using Claude Code for development\n- React and Python fundamentals\n- Real-world examples and templates\n\n**GitHub:** [github.com/shourya0523/Claude_Code_Demo](https://github.com/shourya0523/Claude_Code_Demo)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "CapTuring",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# CapTuring\n\nAn NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity.\n\n## Tech Stack\n\n- NumPy\n- Plotly\n- Scikit-Learn\n\n## Features\n\n- TF-IDF vectorization\n- Cosine similarity analysis\n- Extensible architecture for text classification\n- Visualization with Plotly\n\n## Use Case\n\nDetecting AI-generated content through advanced NLP techniques.\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "ClubWorks",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# ClubWorks\n\nA full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.\n\n## Tech Stack\n\n- Flask\n- MySQL\n- Streamlit\n- Docker\n\n## Features\n\n- Role-based access control\n- Analytics dashboards\n- Event management workflows\n- Full-stack architecture\n\n**GitHub:** [github.com/shourya0523/Clubworks_CS3200](https://github.com/shourya0523/Clubworks_CS3200)\n",
              "opens": "projects"
            }
          ]
        },
        {
          "name": "Spendr",
          "type": "folder",
          "opens": "projects",
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Spendr\n\n🏆 **FinHacks AI/ML Winner 2025**\n\nA hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.\n\n## Tech Stack\n\n- JavaScript\n- Python\n- React\n\n## Features\n\n- Bank data analysis\n- Spending pattern matching\n- Tinder-style swipe interface\n- Financial compatibility scoring\n\n**Devpost:** [devpost.com/software/spendr](https://devpost.com/software/spendr)\n",
              "opens": "projects"
            }
          ]
        }
      ]
    },
    {
      "name": "Resume",
      "type": "folder",
      "opens": "resume",
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Resume\n\n## Education\n\n**B.S. in Computer Science and Business**  \nNortheastern University, D'Amore-McKim School of Business  \n*Expected May 2027*\n\n- **GPA:** 3.71\n- **Concentration:** Fintech\n- **Minor:** Interdisciplinary AI\n- **Honors:** John Martinson Honors Program, 5x Dean's List\n\n## Professional Experience\n\n### Junior Healthcare Research Associate\n**M3** | August 2026 – Present | North America\n[m3.com](https://www.m3.com)\n\n- Healthcare research associate supporting studies and research operations at M3\n\n### Data Engineering Intern\n**Kroll** | June 2026 – August 2026 | New York, NY · Hybrid\n[kroll.com](https://www.kroll.com)\n\n- Built a geographic AI intelligence engine with Azure OpenAI, Llama, Databricks, knowledge graphs, WebGL, and a custom projection\n- Reached 70% cost-attribution coverage on Databricks through semantic and ML asset tagging\n- Migrated Chainsys-Databricks ETL workflows to improve turnaround time and uptime\n- Presented AI design tools through Kroll's enterprise knowledge-sharing program\n\n### Undergraduate Teaching Assistant – Advanced Programming with Data\n**Northeastern University, Khoury College** | January 2026 – April 2026\n[khoury.northeastern.edu](https://khoury.northeastern.edu)\n\n- Taught advanced programming with data to 100+ students\n- Lead review sessions and create training materials\n- Streamline grading workflows, reducing turnaround time by 30%\n\n### AI Engineer Co-op\n**SNAP Life Sciences** | May 2025 – December 2025\n[LinkedIn](https://www.linkedin.com/company/snap-lifesciences)\n\n- Engineered NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials with BioBERT and SciSpacy\n- Migrated ChEMBL (2.8M molecules) onto PostgreSQL/RDS\n- Built AWS-native stack (RDS, S3, Lambda) for pharma dealmaking workflows\n- Recruited and onboarded 10+ ML/engineering hires\n\n### Sales & Business Development\n**Attentions AI** | July 2024 – September 2024 | Pune, India\n[LinkedIn](https://www.linkedin.com/company/attentions)\n\n- Built inbound and outbound sales pipelines\n- Generated 500+ qualified leads through Apollo.io, LinkedIn, and Python automation\n\n## Leadership\n\n### Software Tech Lead\n**ACM at Northeastern University** | August 2026 – Present\n[neu.acm.org](https://neu.acm.org)\n\n- Lead software for ACM @ Northeastern\n\n### AI Advisory Board Member\n**Student Government Association of Northeastern University** | April 2026 – Present\n[northeastern.edu](https://www.northeastern.edu)\n\n- Advise student government on AI policy, education, and student-facing AI initiatives\n\n### Advisory Board Member\n**Northeastern AI Club** | June 2025 – August 2026\n[aineu.org](https://aineu.org)\n\n- Co-authored D'Amore-McKim's official AI policy for 3,000+ students\n- Drove programming for 500+ member organization, increasing event attendance by 40%\n\n### Co-Founder & Vice President\n**Claude Builder Club Northeastern** | December 2025 – March 2026\n[LinkedIn](https://www.linkedin.com/company/northeastern-anthropic-builders-club)\n\n- Co-founded Anthropic-sponsored chapter; grew from zero to 200+ members\n- Secured $30,000+ in sponsorships\n- Ran workshops, hackathons, a creatathon, and a Claude Code agent workshop\n\n### Software Product Lab Lead\n**Forge – A Sherman Center Program** | August 2025 – December 2025\n[shermancenter.northeastern.edu](https://shermancenter.northeastern.edu)\n\n- Directed 8-developer team building mobile application\n- Authored PRDs, designed API architecture\n- Accelerated development timeline by 4 weeks\n\n[Download PDF Resume](/Shourya_Yadav_Gusto.pdf)\n",
          "opens": "resume"
        },
        {
          "name": "Resume.pdf",
          "type": "file",
          "kind": "pdf",
          "content": "B.S. Computer Science and Business, Northeastern University. Expected May 2027. GPA: 3.71",
          "opens": "resume"
        }
      ]
    },
    {
      "name": "Contact",
      "type": "folder",
      "opens": "contact",
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Contact\n\nLet's connect! I'm always open to discussing new opportunities, collaborations, or just chatting about tech and business.\n\n## Get in Touch\n\n- **Email:** [yadav.sho@northeastern.edu](mailto:yadav.sho@northeastern.edu)\n- **Phone:** (510) 326-7626\n- **LinkedIn:** [linkedin.com/in/shouryadav](https://linkedin.com/in/shouryadav)\n- **GitHub:** [github.com/shourya0523](https://github.com/shourya0523)\n\n## What I'm Looking For\n\n- Roles where I can build real things and lead teams\n- Opportunities at the intersection of tech and business\n- Co-ops and internships in data engineering, AI/ML, healthcare, or product leadership\n- Collaborations on interesting projects\n\nNot interested in busywork or meetings that could've been emails.\n",
          "opens": "contact"
        },
        {
          "name": "Email.txt",
          "type": "file",
          "kind": "txt",
          "content": "yadav.sho@northeastern.edu",
          "opens": "contact"
        },
        {
          "name": "Phone.txt",
          "type": "file",
          "kind": "txt",
          "content": "(510) 326-7626",
          "opens": "contact"
        },
        {
          "name": "Social Links.json",
          "type": "file",
          "kind": "json",
          "content": "{\n  \"linkedin\": \"linkedin.com/in/shouryadav\",\n  \"github\": \"github.com/shourya0523\"\n}",
          "opens": "contact"
        }
      ]
    },
    {
      "name": "Awards",
      "type": "folder",
      "opens": null,
      "children": [
        {
          "name": "2024",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# 2024 Awards\n\n## 🎓 John Martinson Honors Program\n\nNortheastern University's prestigious honors program recognizing academic excellence and leadership potential.\n\n## 📚 Dean's List\n\nAchieved Dean's List recognition for multiple semesters, demonstrating consistent academic excellence.\n",
              "opens": null
            },
            {
              "name": "Honors Program",
              "type": "file",
              "kind": "txt",
              "content": "John Martinson Honors Program",
              "opens": null
            },
            {
              "name": "Deans List",
              "type": "file",
              "kind": "txt",
              "content": "Multiple semesters",
              "opens": null
            }
          ]
        },
        {
          "name": "2025",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# 2025 Awards\n\n## 🏆 FinHacks AI/ML Winner\n\n**Category:** AI/ML  \n**Project:** Spendr  \n**Description:** Won first place in the AI/ML category at FinHacks 2025 with a financial compatibility app using bank data analysis and spending pattern matching.\n",
              "opens": null
            }
          ]
        },
        {
          "name": "2026",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# 2026 Awards\n\n## 🏆 1st Place at Husky Healthcare Innovation Challenge\n\n**Issued by:** ViTAL at Northeastern University  \n**Project:** SiMSai  \n**Description:** First place for an SMS-based agentic AI prototype for remote patient monitoring, pitched with a 12-minute live demo.\n",
              "opens": null
            }
          ]
        },
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Awards & Recognition\n\n## 2026\n\n### 🏆 1st Place at Husky Healthcare Innovation Challenge\n**Issued by:** ViTAL at Northeastern University  \n**Project:** SiMSai — SMS-based agentic AI for remote patient monitoring\n\n## 2025\n\n### 🏆 FinHacks AI/ML Track Winner\n**Issued by:** Disrupt at Northeastern  \n**Project:** Spendr - Financial compatibility app using bank data analysis\n\n## 2024\n\n### 🎓 John Martinson Honors Program\nNortheastern University's prestigious honors program recognizing academic excellence and leadership potential.\n\n### 📚 Dean's List\nMultiple semesters of academic excellence (5x total)\n",
          "opens": null
        }
      ]
    },
    {
      "name": "Leadership",
      "type": "folder",
      "opens": null,
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Leadership\n\n## Current Roles\n\n### Software Tech Lead\n**ACM at Northeastern University** | August 2026 – Present\n[neu.acm.org](https://neu.acm.org)\n\n- Lead software for ACM @ Northeastern\n\n### AI Advisory Board Member\n**Student Government Association of Northeastern University** | April 2026 – Present\n[northeastern.edu](https://www.northeastern.edu)\n\n- Advise student government on AI policy, education, and student-facing AI initiatives\n\n### University Program\n**The AI Collective** | April 2026 – Present\n[genaicollective.ai](https://www.genaicollective.ai)\n\n- Represent Northeastern in The AI Collective's university program\n\n### Advisory Board Member\n**Northeastern AI Club** | June 2025 – August 2026\n[aineu.org](https://aineu.org)\n\n- Co-authored D'Amore-McKim's official AI policy for 3,000+ students\n- Drove programming for 500+ member organization\n- Increased event attendance by 40%\n\n## Past Roles\n\n### Co-Founder & Vice President\n**Claude Builder Club Northeastern** | December 2025 – March 2026\n[LinkedIn](https://www.linkedin.com/company/northeastern-anthropic-builders-club)\n\n- Grew the club from zero to 200+ members\n- Secured $30,000+ in sponsorships\n- Ran workshops, hackathons, a creatathon, and a Claude Code workshop\n\n### Software Product Lab Lead\n**Forge – A Sherman Center Program** | August 2025 – December 2025\n[shermancenter.northeastern.edu](https://shermancenter.northeastern.edu)\n\n- Directed 8-developer team building mobile application\n- Authored PRDs and designed API architecture\n- Accelerated development timeline by 4 weeks\n",
          "opens": null
        },
        {
          "name": "Claude Builders Club",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Claude Builders Club @ Northeastern\n\n## Role: Co-Founder & Vice President\n**Duration:** December 2025 – March 2026\n\n## About\n\nAI-focused organization at Northeastern University focused on hands-on AI product building.\n\n## Achievements\n\n- Scaled organization to **200+ members**\n- Built **12-person executive team**\n- Secured **$30,000+ in sponsorships**\n- Founded **AI product incubator** guiding 30 students through ideation to deployment\n- Orchestrated hackathons, workshops, and speaker events\n\n## Impact\n\nFacilitating hands-on AI product building and creating opportunities for students to build, learn, and deploy AI applications.\n",
              "opens": null
            }
          ]
        },
        {
          "name": "Forge",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# Forge – A Sherman Center Program\n\n## Role: Software Product Lab Lead\n**Duration:** August 2025 – December 2025\n\n## About\n\nForge is Northeastern's student-led product development program focused on building real-world applications.\n\n## Responsibilities\n\n- Directed **8-developer team** building mobile application\n- Authored PRDs and designed API architecture\n- Implemented CI/CD pipelines\n- Managed Jira for coordination\n- Accelerated development timeline by **4 weeks** through strategic wireframing and database redesign\n\n## Impact\n\nDelivered live product demonstrations showcasing mobile application features and technical capabilities.\n",
              "opens": null
            }
          ]
        },
        {
          "name": "AI Club",
          "type": "folder",
          "opens": null,
          "children": [
            {
              "name": "README.md",
              "type": "file",
              "kind": "md",
              "content": "# AI Club @ Northeastern\n\n## Role: Advisory Board Member\n**Duration:** June 2025 – August 2026\n\n## About\n\nAI Club is Northeastern's largest AI-focused student organization with 500+ members.\n\n## Responsibilities\n\n- Co-authored **D'Amore-McKim's official AI policy** establishing ethical guidelines for 3,000+ students\n- Drove programming and operations for 500+ member organization\n- Increased event attendance by **40%**\n\n## Website\n\n[aineu.org](https://aineu.org)\n",
              "opens": null
            }
          ]
        }
      ]
    },
    {
      "name": "Media",
      "type": "folder",
      "opens": "files",
      "children": [
        {
          "name": "README.md",
          "type": "file",
          "kind": "md",
          "content": "# Media\n\nCollection of images, videos, and other media assets.\n\n## Contents\n\n- Profile pictures\n- Project screenshots\n- Presentation materials\n- Event photos\n- Other media assets\n\n*Media files are stored in the public directory.*\n",
          "opens": "files"
        }
      ]
    }
  ]
}

export default files
