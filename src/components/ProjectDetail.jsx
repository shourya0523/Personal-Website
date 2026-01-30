import { ExternalLink, Github, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWallpaper } from '../contexts/WallpaperContext'

export default function ProjectDetail({ project, onClose, onFileClick }) {
  const { particleColors } = useWallpaper()
  
  // Get a color from particle colors based on project index
  const accentColor = particleColors[project.id % particleColors.length]

  const handleFileClick = (fileName) => {
    if (onFileClick) {
      onFileClick(fileName, project.title)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 
                className="text-4xl font-bold mb-2 text-white"
                style={{ 
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}40`
                }}
              >
                {project.title}
              </h1>
              {project.period && (
                <p className="text-sm text-gray-200">{project.period}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-200" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-white">Description</h2>
            <p className="text-gray-100 leading-relaxed text-lg">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-white">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => {
                const techColor = particleColors[(project.id + index) % particleColors.length]
                return (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: techColor + '20',
                      color: techColor,
                      border: `1px solid ${techColor}40`,
                      boxShadow: `0 0 10px ${techColor}20`
                    }}
                  >
                    {tech}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: accentColor + '20',
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                  boxShadow: `0 0 15px ${accentColor}20`
                }}
              >
                <Github size={18} />
                View Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: accentColor + '20',
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                  boxShadow: `0 0 15px ${accentColor}20`
                }}
              >
                <ExternalLink size={18} />
                {project.demo.includes('insync') ? 'Visit Website' : 'View Demo'}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
