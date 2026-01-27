import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Folder from '../components/Folder'

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: '#',
    demo: '#',
    color: '#3B82F6',
    files: ['Frontend', 'Backend', 'Database']
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    tech: ['React', 'Firebase', 'TypeScript'],
    github: '#',
    demo: '#',
    color: '#8B5CF6',
    files: ['Components', 'API', 'Config']
  },
  {
    id: 3,
    title: 'AI Image Generator',
    description: 'Web application for generating images using AI',
    tech: ['Next.js', 'OpenAI API', 'Tailwind CSS'],
    github: '#',
    demo: '#',
    color: '#10B981',
    files: ['Generator', 'Gallery', 'Settings']
  },
  {
    id: 4,
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media metrics',
    tech: ['React', 'D3.js', 'Python', 'FastAPI'],
    github: '#',
    demo: '#',
    color: '#F59E0B',
    files: ['Dashboard', 'Analytics', 'Reports']
  },
]

export default function Projects({ onFileClick, onOpenFolder }) {
  const handleFolderClick = (project) => {
    if (onOpenFolder) {
      const folderData = {
        type: 'folder',
        color: project.color,
        children: project.files.reduce((acc, file) => {
          acc[file] = { type: 'file', content: `${project.title} - ${file}` }
          return acc
        }, {})
      }
      onOpenFolder(project.title, folderData)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6 text-white">Projects</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {projects.map((project, index) => {
              const paperItems = project.files.slice(0, 3).map((file) => (
                <div key={file} className="text-[9px] text-gray-600 truncate px-1 font-medium leading-tight">
                  📄 {file}
                </div>
              ))

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center group w-full"
                >
                  <div
                    onClick={() => handleFolderClick(project)}
                    className="cursor-pointer mb-3 w-full flex justify-center"
                  >
                    <Folder
                      color={project.color}
                      size={1}
                      items={paperItems}
                      onClick={() => handleFolderClick(project)}
                    />
                  </div>
                  <h2 className="text-sm font-semibold mb-1 text-white text-center w-full truncate px-2">
                    {project.title}
                  </h2>
                  <p className="text-xs text-gray-400 text-center mb-2 w-full line-clamp-2 px-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2 justify-center w-full px-2">
                    {project.tech.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-gray-800/50 rounded text-[10px] text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={project.github}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded transition-colors text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={12} />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600 rounded transition-colors text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} />
                      Demo
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
