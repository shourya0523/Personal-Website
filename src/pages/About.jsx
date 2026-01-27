import { motion } from 'framer-motion'
import { Code, Palette, Rocket, Heart, GraduationCap, Music, UtensilsCrossed } from 'lucide-react'
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
            Hi, I'm <span className="text-blue-400 font-bold">Shourya Yadav</span> - a 3rd year Computer Science, Fintech, AI and Physics student from Pune, India.
            {userName && (
              <span className="block mt-2 text-gray-400">
                Welcome, {userName}!
              </span>
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-gray-300 leading-relaxed"
          >
            I'm an artist, builder, and entrepreneur currently building out 3 products and gathering together a collective of international builders, investors, and founders. I lead Claude Builders Club and a few startups. In my free time, I work on my music, enjoy food tourism, play poker, and will definitely spam you with pictures of my cats.
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
              <p className="text-gray-300">Building scalable applications with Python, JavaScript, React, FastAPI, and AWS</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <GraduationCap className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">AI/ML Researcher</h3>
              <p className="text-gray-300">Architecting NLP pipelines and semantic matching algorithms for healthcare data</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Rocket className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Entrepreneur</h3>
              <p className="text-gray-300">Building products and leading teams at startups and student organizations</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <Music className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Creative</h3>
              <p className="text-gray-300">Music production, food tourism, poker, and cat photography enthusiast</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['Python', 'JavaScript', 'SQL', 'Java', 'HTML', 'CSS', 'Flask', 'FastAPI', 'React.js', 'Express.js', 'N8N', 'LangChain', 'Selenium', 'Git', 'MySQL', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'NumPy'].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-lg text-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {['Music Production', 'Poker', 'Food Tourism', 'Global Travel', 'Binge-Watching TV Shows'].map((interest, index) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500 rounded-lg text-sm"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
