import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import CardSwap, { Card } from '../components/CardSwap/CardSwap'
import { useWallpaper } from '../contexts/WallpaperContext'
import ProjectDetail from '../components/ProjectDetail'

const projects = [
  {
    id: 1,
    title: 'InSync',
    description: 'Algorithmic VC-to-startup matching platform with data pipelines processing investor preference datasets.',
    tech: ['Python', 'PostgreSQL', 'FastAPI', 'Scikit-Learn'],
    github: null,
    demo: 'https://insync-rg.com',
    period: 'January 2026 – Present',
    color: '#3B82F6',
    files: ['Database', 'Matching', 'Pipelines']
  },
  {
    id: 2,
    title: 'DawnPa',
    description: 'Comprehensive full-stack platform for healthcare tooling, currently under active development.',
    tech: ['Full-Stack', 'Healthcare', 'Tooling'],
    github: null,
    demo: null,
    period: 'Work in Progress',
    color: '#8B5CF6',
    files: ['Platform', 'Healthcare', 'Tooling']
  },
  {
    id: 3,
    title: 'Pact',
    description: 'Mobile accountability app where I led product and architecture decisions, designing a scalable backend on AWS with MongoDB.',
    tech: ['FastAPI', 'React Native', 'AWS EC2/S3', 'MongoDB'],
    github: 'https://github.com/shourya0523/Pact',
    demo: null,
    period: 'December 2025',
    color: '#10B981',
    files: ['Backend', 'Frontend', 'Database']
  },
  {
    id: 4,
    title: 'Claude Code Demo',
    description: 'Comprehensive workshop on rapid MVP prototyping for non-technical entrepreneurs, featuring 30+ examples, templates, and live demonstrations.',
    tech: ['Claude Code', 'React', 'Python'],
    github: 'https://github.com/shourya0523/Claude_Code_Demo',
    demo: null,
    period: 'October 2025 – November 2025',
    color: '#F59E0B',
    files: ['Examples', 'Templates', 'Demos']
  },
  {
    id: 5,
    title: 'Spendr',
    description: 'Hackathon-winning financial compatibility app using bank data analysis and spending pattern matching with a Tinder-style interface.',
    tech: ['JavaScript', 'Python', 'React'],
    github: null,
    demo: 'https://devpost.com/software/spendr',
    period: 'January 2025',
    color: '#EC4899',
    files: ['Algorithm', 'UI', 'Data']
  },
  {
    id: 6,
    title: 'CapTuring',
    description: 'NLP pipeline for detecting AI-generated text using TF-IDF and cosine similarity with extensible architecture.',
    tech: ['NumPy', 'Plotly', 'Scikit-Learn'],
    github: 'https://github.com/shourya0523',
    demo: null,
    period: 'April 2025 – May 2025',
    color: '#06B6D4',
    files: ['Pipeline', 'Features', 'Analysis']
  },
  {
    id: 7,
    title: 'ClubWorks',
    description: 'Full-stack platform for college club operations featuring role-based access, analytics dashboards, and event workflows.',
    tech: ['Flask', 'MySQL', 'Streamlit', 'Docker'],
    github: 'https://github.com/shourya0523/Clubworks_CS3200',
    demo: null,
    period: 'March 2025 – May 2025',
    color: '#A855F7',
    files: ['API', 'Dashboard', 'Config']
  },
]

export default function Projects({ onFileClick, onOpenFolder, onOpenWindow }) {
  const { particleColors } = useWallpaper()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSmallMobile(window.innerWidth < 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCardClick = (project) => {
    if (onOpenWindow) {
      const windowId = `project-${project.id}-${Date.now()}`
      onOpenWindow({
        id: windowId,
        type: 'project-detail',
        title: project.title,
        icon: '📁',
        content: <ProjectDetail project={project} />,
        size: { width: 900, height: 700 },
      })
    }
  }

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

  // Get accent color from particle colors
  const getAccentColor = (index) => {
    return particleColors[index % particleColors.length]
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* CardSwap Section */}
          <div className="p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Projects</h1>
            <div className="relative flex justify-center items-center" style={{ minHeight: '400px', height: 'auto' }}>
            <CardSwap
              width={isSmallMobile ? 280 : isMobile ? 350 : 500}
              height={isSmallMobile ? 320 : isMobile ? 360 : 400}
              cardDistance={isSmallMobile ? 30 : isMobile ? 40 : 60}
              verticalDistance={isSmallMobile ? 40 : isMobile ? 50 : 70}
              delay={5000}
              pauseOnHover={true}
            >
              {projects.map((project, index) => {
                  const accentColor = getAccentColor(index)
                  return (
                    <Card
                      key={project.id}
                      className="bg-gray-800/90 backdrop-blur-sm p-6 flex flex-col text-white cursor-pointer transition-all hover:scale-105"
                      style={{
                        borderColor: accentColor,
                        borderWidth: '2px',
                        borderRadius: '12px',
                        boxShadow: `0 0 20px ${accentColor}20, inset 0 0 20px ${accentColor}10`
                      }}
                      onClick={() => handleCardClick(project)}
                    >
                      <h3 
                        className="text-2xl font-bold mb-3"
                        style={{ 
                          color: accentColor,
                          textShadow: `0 0 10px ${accentColor}40`
                        }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-gray-100 mb-4 flex-1 line-clamp-3">
                        {project.description}
                      </p>
                      {project.period && (
                        <p className="text-sm text-gray-200 mb-3">
                          {project.period}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 3).map((tech, techIndex) => {
                          const techColor = getAccentColor(index + techIndex + 1)
                          return (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                              style={{
                                backgroundColor: techColor + '20',
                                color: techColor,
                                border: `1px solid ${techColor}40`
                              }}
                            >
                              {tech}
                            </span>
                          )
                        })}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-4 py-2 rounded transition-all hover:scale-105 text-sm font-medium"
                            style={{
                              backgroundColor: accentColor + '20',
                              color: accentColor,
                              border: `1px solid ${accentColor}40`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={14} />
                            Code
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-4 py-2 rounded transition-all hover:scale-105 text-sm font-medium"
                            style={{
                              backgroundColor: accentColor + '20',
                              color: accentColor,
                              border: `1px solid ${accentColor}40`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            {project.demo.includes('insync') ? 'Website' : 'Demo'}
                          </a>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </CardSwap>
            </div>
          </div>

          {/* Scrollable Project List */}
          <div className="px-4 md:px-6 pb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => {
                const accentColor = getAccentColor(index)
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-lg cursor-pointer transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      border: `1px solid ${accentColor}30`,
                      boxShadow: `0 0 15px ${accentColor}10`
                    }}
                    onClick={() => handleCardClick(project)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accentColor
                      e.currentTarget.style.boxShadow = `0 0 25px ${accentColor}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = accentColor + '30'
                      e.currentTarget.style.boxShadow = `0 0 15px ${accentColor}10`
                    }}
                  >
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        color: accentColor,
                        textShadow: `0 0 8px ${accentColor}30`
                      }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-100 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    {project.period && (
                      <p className="text-xs text-gray-200 mb-3">{project.period}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech.slice(0, 3).map((tech, techIndex) => {
                        const techColor = getAccentColor(index + techIndex + 1)
                        return (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              backgroundColor: techColor + '20',
                              color: techColor
                            }}
                          >
                            {tech}
                          </span>
                        )
                      })}
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all hover:scale-105"
                          style={{
                            backgroundColor: accentColor + '20',
                            color: accentColor
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={12} />
                          Code
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all hover:scale-105"
                          style={{
                            backgroundColor: accentColor + '20',
                            color: accentColor
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={12} />
                          {project.demo.includes('insync') ? 'Website' : 'Demo'}
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
