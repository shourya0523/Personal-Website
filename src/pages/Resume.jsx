import { motion } from 'framer-motion'
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react'

export default function Resume({ onFileClick }) {
  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Resume</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download size={20} />
            Download PDF
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'Senior Software Engineer',
                  company: 'Tech Company Inc.',
                  period: '2022 - Present',
                  description: 'Leading development of scalable web applications...'
                },
                {
                  title: 'Software Engineer',
                  company: 'Startup XYZ',
                  period: '2020 - 2022',
                  description: 'Developed full-stack applications using React and Node.js...'
                }
              ].map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-blue-400">{exp.company}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Education</h2>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
              <h3 className="text-xl font-bold">Bachelor of Science in Computer Science</h3>
              <p className="text-blue-400">University Name</p>
              <p className="text-gray-400 text-sm">2016 - 2020</p>
            </div>
          </motion.section>

          {/* Certifications */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['AWS Certified Solutions Architect', 'Google Cloud Professional', 'Kubernetes Administrator'].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                >
                  <h3 className="font-bold">{cert}</h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  )
}
