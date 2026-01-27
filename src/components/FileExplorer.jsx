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
          'Bio.txt': { type: 'file', content: '3rd Year CS, Fintech, AI and Physics student from Pune, India. Artist, builder, and entrepreneur building 3 products and gathering a collective of international builders, investors, and founders.' },
          'Skills.json': { type: 'file', content: JSON.stringify({ languages: ['Python', 'JavaScript', 'SQL', 'Java'], frameworks: ['React.js', 'FastAPI', 'Flask', 'Express.js'], tools: ['AWS', 'Docker', 'MongoDB', 'PostgreSQL'], ai_ml: ['Pandas', 'Scikit-Learn', 'TensorFlow', 'LangChain'] }, null, 2) }
        } 
      },
      'Projects': { 
        type: 'folder', 
        color: '#8B5CF6',
        children: { 
          'Pact': { type: 'folder', color: '#3B82F6', children: { 'Backend': { type: 'file', content: 'FastAPI backend with AWS EC2/S3' }, 'Frontend': { type: 'file', content: 'React Native mobile app' } } },
          'Claude Code Demo': { type: 'folder', color: '#8B5CF6', children: { 'Workshop': { type: 'file', content: 'Rapid MVP prototyping workshop' }, 'Examples': { type: 'file', content: '30+ demo examples' } } },
          'CapTuring': { type: 'folder', color: '#10B981', children: { 'NLP Pipeline': { type: 'file', content: 'TF-IDF and cosine similarity' } } },
          'ClubWorks': { type: 'folder', color: '#F59E0B', children: { 'Platform': { type: 'file', content: 'Full-stack club operations platform' } } },
          'Spendr': { type: 'folder', color: '#EC4899', children: { 'Hackathon Winner': { type: 'file', content: 'FinHacks AI/ML Winner 2025' } } }
        } 
      },
      'Resume': { 
        type: 'folder', 
        color: '#10B981',
        children: { 
          'Resume.pdf': { type: 'file', content: 'B.S. Computer Science and Business, Northeastern University. Expected May 2027. GPA: 3.71' },
          'Experience.md': { type: 'file', content: 'AI/ML Researcher at SNAP Life Sciences, Teaching Assistant at Northeastern, Software Product Lab Lead at Forge' }
        } 
      },
      'Contact': { 
        type: 'folder', 
        color: '#F59E0B',
        children: { 
          'Email.txt': { type: 'file', content: 'yadav.sho@northeastern.edu' },
          'Phone.txt': { type: 'file', content: '(510) 326-7626' },
          'Social Links.json': { type: 'file', content: JSON.stringify({ linkedin: 'linkedin.com/in/shouryadav', github: 'github.com/shourya0523' }, null, 2) }
        } 
      },
      'Awards': { 
        type: 'folder', 
        color: '#EF4444',
        children: { 
          '2025': { type: 'folder', color: '#EF4444', children: { 'FinHacks Winner': { type: 'file', content: 'AI/ML Category Winner' } } },
          '2024': { type: 'folder', color: '#EF4444', children: { 'Honors Program': { type: 'file', content: 'John Martinson Honors Program' }, 'Deans List': { type: 'file', content: 'Multiple semesters' } } }
        } 
      },
      'Leadership': { 
        type: 'folder', 
        color: '#EC4899',
        children: { 
          'Claude Builders Club': { type: 'folder', color: '#EC4899', children: { 'Director of Operations': { type: 'file', content: 'Co-founder, 200+ members, $30k+ sponsorships' } } },
          'Forge': { type: 'folder', color: '#EC4899', children: { 'Product Lab Lead': { type: 'file', content: 'Led 8-developer team' } } },
          'AI Club': { type: 'folder', color: '#EC4899', children: { 'Executive Board': { type: 'file', content: 'Co-authored AI policy for 3000+ students' } } }
        } 
      },
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
