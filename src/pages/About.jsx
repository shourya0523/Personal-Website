import { motion } from 'framer-motion'
import { Code, Palette, Rocket, Heart } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

export default function About({ onFileClick }) {
  const { userName } = useUser()
  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 leading-relaxed"
          >
            Hi, I'm <span className="text-blue-400 font-bold">Shourya Yadav</span> - a passionate software engineer
            {userName && (
              <span className="block mt-2 text-gray-400">
                Welcome, {userName}!
              </span>
            )} 
            and creative developer who loves building innovative digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
          >
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Code className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Full-Stack Developer</h3>
              <p className="text-gray-300">Building scalable web applications with modern technologies</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Palette className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">UI/UX Enthusiast</h3>
              <p className="text-gray-300">Creating beautiful and intuitive user interfaces</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Rocket className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Innovation Driven</h3>
              <p className="text-gray-300">Always exploring new technologies and frameworks</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Heart className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Open Source</h3>
              <p className="text-gray-300">Contributing to projects that make a difference</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL'].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-lg text-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
