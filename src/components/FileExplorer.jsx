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
          'Bio.txt': { type: 'file', content: 'Personal biography and background information.' },
          'Skills.json': { type: 'file', content: 'Technical skills and expertise.' }
        } 
      },
      'Projects': { 
        type: 'folder', 
        color: '#8B5CF6',
        children: { 
          'Web Apps': { type: 'folder', color: '#8B5CF6', children: {} },
          'Mobile Apps': { type: 'folder', color: '#8B5CF6', children: {} },
          'Open Source': { type: 'folder', color: '#8B5CF6', children: {} }
        } 
      },
      'Resume': { 
        type: 'folder', 
        color: '#10B981',
        children: { 
          'Resume.pdf': { type: 'file', content: 'Professional resume document.' },
          'Cover Letter.pdf': { type: 'file', content: 'Cover letter template.' }
        } 
      },
      'Contact': { 
        type: 'folder', 
        color: '#F59E0B',
        children: { 
          'Email.txt': { type: 'file', content: 'Contact email information.' },
          'Social Links.json': { type: 'file', content: 'Social media profiles and links.' }
        } 
      },
      'Awards': { 
        type: 'folder', 
        color: '#EF4444',
        children: { 
          '2024': { type: 'folder', color: '#EF4444', children: {} },
          '2023': { type: 'folder', color: '#EF4444', children: {} }
        } 
      },
      'Leadership': { 
        type: 'folder', 
        color: '#EC4899',
        children: { 
          'Roles.json': { type: 'file', content: 'Leadership roles and positions.' },
          'Experience.md': { type: 'file', content: 'Leadership experience and achievements.' }
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
