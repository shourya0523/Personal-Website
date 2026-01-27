// Export file structure for use in App.jsx
export const fileStructure = {
  'Files': {
    type: 'folder',
    color: '#3B82F6',
    children: {
      'About': { 
        type: 'folder', 
        color: '#3B82F6',
        children: { 
          'README.md': { 
            type: 'file', 
            content: `# About Me

I'm **Shourya** — a CS and Business student at Northeastern who'd rather be building something than talking about building something.

I like solving problems that sit at the intersection of tech and business, whether that's architecting NLP pipelines processing half a million clinical trials, scaling a student org from zero to 200+ members, or figuring out how to match VCs with startups algorithmically.

I get restless when I'm not working on something, which is why I'm usually juggling a co-op, a couple side projects, and at least one organization that probably needs more of my attention.

I'm drawn to roles where I can build real things and lead teams doing the same. Not interested in busywork or meetings that could've been emails.

When I'm not coding, I'm producing music, playing poker, hunting for good food in random cities, or binge-watching shows I've already seen three times.

## Skills

### Languages & Frameworks
- Python, JavaScript, SQL, Java, HTML, CSS
- Flask, FastAPI, React.js, Express.js, LangChain, Selenium

### Cloud & Databases
- AWS (EC2, RDS, S3), MySQL, PostgreSQL, MongoDB, Docker

### Data Science & ML
- Pandas, Scikit-Learn, HuggingFace, TensorFlow, NumPy, Plotly, PowerBI, ETL Pipelines

### Tools
- Git, Jira, REST APIs, Agile/Scrum, N8N, Alteryx (Foundations Certified)
` 
          }
        } 
      },
      'Projects': { 
        type: 'folder', 
        color: '#8B5CF6',
        children: { 
          'README.md': {
            type: 'file',
            content: `# Projects

A collection of projects I've built, from hackathon winners to full-stack platforms.

## Featured Projects

### InSync
**Status:** Active Development  
**Tech Stack:** Python, PostgreSQL, FastAPI, Scikit-Learn  
**Description:** An algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets. Designing database schemas and matching algorithms to analyze venture capital financial data at scale.  
**Website:** [insync-rg.com](https://insync-rg.com)

### DawnPa
**Status:** Work in Progress  
**Tech Stack:** Full-Stack Healthcare Tooling Platform  
**Description:** A comprehensive full-stack platform for healthcare tooling, currently under active development.

### Pact
**Status:** Completed (December 2025)  
**Tech Stack:** FastAPI, React Native, AWS EC2/S3, MongoDB  
**Description:** A mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.  
**GitHub:** [github.com/shourya0523/Pact](https://github.com/shourya0523/Pact)

### Claude Code Demo
**Status:** Completed (October 2025 – November 2025)  
**Tech Stack:** Claude Code, React, Python  
**Description:** A comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations delivered to 50+ attendees.  
**GitHub:** [github.com/shourya0523/Claude_Code_Demo](https://github.com/shourya0523/Claude_Code_Demo)

### Spendr
**Status:** Completed (January 2025)  
**Tech Stack:** JavaScript, Python, React  
**Description:** A hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.  
**Award:** 🏆 FinHacks AI/ML Winner  
**Devpost:** [devpost.com/software/spendr](https://devpost.com/software/spendr)

### CapTuring
**Status:** Completed (April 2025 – May 2025)  
**Tech Stack:** NumPy, Plotly, Scikit-Learn  
**Description:** An NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.

### ClubWorks
**Status:** Completed (March 2025 – May 2025)  
**Tech Stack:** Flask, MySQL, Streamlit, Docker  
**Description:** A full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.  
**GitHub:** [github.com/shourya0523/Clubworks_CS3200](https://github.com/shourya0523/Clubworks_CS3200)
`
          },
          'Pact': { 
            type: 'folder', 
            color: '#3B82F6', 
            children: { 
              'README.md': { 
                type: 'file', 
                content: `# Pact

A mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.

## Tech Stack

- **Backend:** FastAPI, AWS EC2/S3, MongoDB
- **Frontend:** React Native
- **Architecture:** Scalable cloud infrastructure

## Key Features

- Mobile-first accountability tracking
- Scalable backend architecture
- Cloud-hosted on AWS

**GitHub:** [github.com/shourya0523/Pact](https://github.com/shourya0523/Pact)
` 
              } 
            } 
          },
          'Claude Code Demo': { 
            type: 'folder', 
            color: '#8B5CF6', 
            children: { 
              'README.md': { 
                type: 'file', 
                content: `# Claude Code Demo

A comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs.

## Overview

- **Duration:** October 2025 – November 2025
- **Audience:** 50+ attendees
- **Content:** 30+ examples, templates, and live demonstrations

## Topics Covered

- Rapid MVP prototyping techniques
- Using Claude Code for development
- React and Python fundamentals
- Real-world examples and templates

**GitHub:** [github.com/shourya0523/Claude_Code_Demo](https://github.com/shourya0523/Claude_Code_Demo)
` 
              } 
            } 
          },
          'CapTuring': { 
            type: 'folder', 
            color: '#10B981', 
            children: { 
              'README.md': { 
                type: 'file', 
                content: `# CapTuring

An NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity.

## Tech Stack

- NumPy
- Plotly
- Scikit-Learn

## Features

- TF-IDF vectorization
- Cosine similarity analysis
- Extensible architecture for text classification
- Visualization with Plotly

## Use Case

Detecting AI-generated content through advanced NLP techniques.
` 
              } 
            } 
          },
          'ClubWorks': { 
            type: 'folder', 
            color: '#F59E0B', 
            children: { 
              'README.md': { 
                type: 'file', 
                content: `# ClubWorks

A full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.

## Tech Stack

- Flask
- MySQL
- Streamlit
- Docker

## Features

- Role-based access control
- Analytics dashboards
- Event management workflows
- Full-stack architecture

**GitHub:** [github.com/shourya0523/Clubworks_CS3200](https://github.com/shourya0523/Clubworks_CS3200)
` 
              } 
            } 
          },
          'Spendr': { 
            type: 'folder', 
            color: '#EC4899', 
            children: { 
              'README.md': { 
                type: 'file', 
                content: `# Spendr

🏆 **FinHacks AI/ML Winner 2025**

A hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.

## Tech Stack

- JavaScript
- Python
- React

## Features

- Bank data analysis
- Spending pattern matching
- Tinder-style swipe interface
- Financial compatibility scoring

**Devpost:** [devpost.com/software/spendr](https://devpost.com/software/spendr)
` 
              } 
            } 
          }
        } 
      },
      'Resume': { 
        type: 'folder', 
        color: '#10B981',
        children: { 
          'README.md': {
            type: 'file',
            content: `# Resume

## Education

**B.S. in Computer Science and Business**  
Northeastern University, D'Amore-McKim School of Business  
*Expected May 2027*

- **GPA:** 3.71
- **Concentration:** Fintech
- **Minor:** Interdisciplinary AI
- **Honors:** John Martinson Honors Program, 4x Dean's List

## Professional Experience

### Undergraduate Teaching Assistant – Advanced Programming with Data
**Northeastern University, Khoury College** | January 2026 – Present

- Support 50+ students weekly in Advanced Programming with Data
- Lead review sessions and create training materials
- Streamline grading workflows, reducing turnaround time by 30%

### AI/ML Researcher Co-op
**SNAP Life Sciences** | May 2025 – December 2025

- Architected NLP ETL pipelines processing 150k+ patents and 500k+ clinical trials
- Reduced LLM costs by 70%
- Developed semantic-matching algorithms achieving 100% recall
- Contributed 40% of company's proprietary drug and patent database
- Recruited and onboarded 10+ ML/engineering hires

### Sales & Business Development Intern
**Attentions AI** | July 2024 – September 2024

- Executed market research supporting outbound GTM strategies
- Launched multi-channel marketing campaigns
- Generated 500+ qualified leads through Apollo.io, LinkedIn, and Python automation

## Leadership

### Director of Operations, Co-Founder
**Claude Builders Club @ Northeastern** | August 2025 – Present

- Co-founded and scaled organization to 200+ members with 12-person executive team
- Secured $30,000+ in sponsorships
- Founded AI product incubator guiding 30 students through ideation to deployment

### Executive Board Member
**AI Club @ Northeastern** | June 2025 – Present

- Co-authored D'Amore-McKim's official AI policy for 3,000+ students
- Drove programming for 500+ member organization, increasing event attendance by 40%

### Software Product Lab Lead
**Forge – A Sherman Center Program** | August 2025 – December 2025

- Directed 8-developer team building mobile application
- Authored PRDs, designed API architecture
- Accelerated development timeline by 4 weeks

[Download PDF Resume](/Shourya_Yadav_Gusto.pdf)
`
          },
          'Resume.pdf': { type: 'file', content: 'B.S. Computer Science and Business, Northeastern University. Expected May 2027. GPA: 3.71' }
        } 
      },
      'Contact': { 
        type: 'folder', 
        color: '#F59E0B',
        children: { 
          'README.md': {
            type: 'file',
            content: `# Contact

Let's connect! I'm always open to discussing new opportunities, collaborations, or just chatting about tech and business.

## Get in Touch

- **Email:** [yadav.sho@northeastern.edu](mailto:yadav.sho@northeastern.edu)
- **Phone:** (510) 326-7626
- **LinkedIn:** [linkedin.com/in/shouryadav](https://linkedin.com/in/shouryadav)
- **GitHub:** [github.com/shourya0523](https://github.com/shourya0523)

## What I'm Looking For

- Roles where I can build real things and lead teams
- Opportunities at the intersection of tech and business
- Co-ops and internships in AI/ML, full-stack development, or product leadership
- Collaborations on interesting projects

Not interested in busywork or meetings that could've been emails.
`
          },
          'Email.txt': { type: 'file', content: 'yadav.sho@northeastern.edu' },
          'Phone.txt': { type: 'file', content: '(510) 326-7626' },
          'Social Links.json': { type: 'file', content: JSON.stringify({ linkedin: 'linkedin.com/in/shouryadav', github: 'github.com/shourya0523' }, null, 2) }
        } 
      },
      'Awards': { 
        type: 'folder', 
        color: '#EF4444',
        children: { 
          'README.md': {
            type: 'file',
            content: `# Awards & Recognition

## 2025

### 🏆 FinHacks AI/ML Winner
**Category:** AI/ML  
**Project:** Spendr - Financial compatibility app using bank data analysis

## 2024

### 🎓 John Martinson Honors Program
Northeastern University's prestigious honors program recognizing academic excellence and leadership potential.

### 📚 Dean's List
Multiple semesters of academic excellence (4x total)
`
          },
          '2025': { 
            type: 'folder', 
            color: '#EF4444', 
            children: { 
              'README.md': {
                type: 'file',
                content: `# 2025 Awards

## 🏆 FinHacks AI/ML Winner

**Category:** AI/ML  
**Project:** Spendr  
**Description:** Won first place in the AI/ML category at FinHacks 2025 with a financial compatibility app using bank data analysis and spending pattern matching.
`
              }
            } 
          },
          '2024': { 
            type: 'folder', 
            color: '#EF4444', 
            children: { 
              'README.md': {
                type: 'file',
                content: `# 2024 Awards

## 🎓 John Martinson Honors Program

Northeastern University's prestigious honors program recognizing academic excellence and leadership potential.

## 📚 Dean's List

Achieved Dean's List recognition for multiple semesters, demonstrating consistent academic excellence.
`
              },
              'Honors Program': { type: 'file', content: 'John Martinson Honors Program' },
              'Deans List': { type: 'file', content: 'Multiple semesters' }
            } 
          }
        } 
      },
      'Leadership': { 
        type: 'folder', 
        color: '#EC4899',
        children: { 
          'README.md': {
            type: 'file',
            content: `# Leadership

## Current Roles

### Director of Operations, Co-Founder
**Claude Builders Club @ Northeastern** | August 2025 – Present

- Co-founded and scaled organization to 200+ members
- Built 12-person executive team
- Secured $30,000+ in sponsorships
- Founded AI product incubator guiding 30 students

### Executive Board Member
**AI Club @ Northeastern** | June 2025 – Present

- Co-authored D'Amore-McKim's official AI policy for 3,000+ students
- Drove programming for 500+ member organization
- Increased event attendance by 40%

## Past Roles

### Software Product Lab Lead
**Forge – A Sherman Center Program** | August 2025 – December 2025

- Directed 8-developer team building mobile application
- Authored PRDs and designed API architecture
- Accelerated development timeline by 4 weeks
`
          },
          'Claude Builders Club': { 
            type: 'folder', 
            color: '#EC4899', 
            children: { 
              'README.md': {
                type: 'file',
                content: `# Claude Builders Club @ Northeastern

## Role: Director of Operations, Co-Founder
**Duration:** August 2025 – Present

## About

AI-focused organization at Northeastern University focused on hands-on AI product building.

## Achievements

- Scaled organization to **200+ members**
- Built **12-person executive team**
- Secured **$30,000+ in sponsorships**
- Founded **AI product incubator** guiding 30 students through ideation to deployment
- Orchestrated hackathons, workshops, and speaker events

## Impact

Facilitating hands-on AI product building and creating opportunities for students to build, learn, and deploy AI applications.
`
              }
            } 
          },
          'Forge': { 
            type: 'folder', 
            color: '#EC4899', 
            children: { 
              'README.md': {
                type: 'file',
                content: `# Forge – A Sherman Center Program

## Role: Software Product Lab Lead
**Duration:** August 2025 – December 2025

## About

Forge is Northeastern's student-led product development program focused on building real-world applications.

## Responsibilities

- Directed **8-developer team** building mobile application
- Authored PRDs and designed API architecture
- Implemented CI/CD pipelines
- Managed Jira for coordination
- Accelerated development timeline by **4 weeks** through strategic wireframing and database redesign

## Impact

Delivered live product demonstrations showcasing mobile application features and technical capabilities.
`
              }
            } 
          },
          'AI Club': { 
            type: 'folder', 
            color: '#EC4899', 
            children: { 
              'README.md': {
                type: 'file',
                content: `# AI Club @ Northeastern

## Role: Executive Board Member
**Duration:** June 2025 – Present

## About

AI Club is Northeastern's largest AI-focused student organization with 500+ members.

## Responsibilities

- Co-authored **D'Amore-McKim's official AI policy** establishing ethical guidelines for 3,000+ students
- Drove programming and operations for 500+ member organization
- Increased event attendance by **40%**

## Website

[aineu.org](https://aineu.org)
`
              }
            } 
          }
        } 
      },
      'Media': {
        type: 'folder',
        color: '#8B5CF6',
        children: {
          'README.md': {
            type: 'file',
            content: `# Media

Collection of images, videos, and other media assets.

## Contents

- Profile pictures
- Project screenshots
- Presentation materials
- Event photos
- Other media assets

*Media files are stored in the public directory.*
`
          }
        }
      }
    }
  }
}

// Default export for window component
export default function FileExplorer({ onFileClick, onOpenFolder }) {
  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-xl p-6">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="text-gray-400">
        Use the Files folder on the desktop to browse files.
      </div>
    </div>
  )
}
