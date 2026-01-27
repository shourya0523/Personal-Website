import { motion, useScroll, useTransform } from 'framer-motion'
import { Code, Palette, Rocket, Heart, GraduationCap, Music, UtensilsCrossed, Brain, Sparkles, Zap, Target, TrendingUp } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import ProfileCard from '../components/ProfileCard'
import { useRef } from 'react'

export default function About({ onFileClick }) {
  const { userName } = useUser()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.3, 0.3])

  const skills = {
    languages: ['Python', 'JavaScript', 'SQL', 'Java', 'HTML', 'CSS', 'Flask', 'FastAPI', 'React.js', 'Express.js', 'LangChain', 'Selenium'],
    cloud: ['AWS (EC2, RDS, S3)', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Database Architecture'],
    ml: ['Pandas', 'Scikit-Learn', 'HuggingFace', 'TensorFlow', 'NumPy', 'Plotly', 'PowerBI', 'ETL Pipelines'],
    tools: ['Git', 'Jira', 'REST APIs', 'Agile/Scrum', 'N8N', 'Alteryx (Foundations Certified)']
  }

  const interests = ['Music Production', 'Poker', 'Food Tourism', 'Global Travel', 'Binge-Watching TV Shows']

  return (
    <div ref={containerRef} className="relative text-white h-full overflow-auto">
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </motion.div>

      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section with Split Layout */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16 items-center min-h-[60vh]"
            style={{ opacity }}
          >
            {/* Left: Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="flex justify-center md:justify-start"
            >
              <ProfileCard
                name={userName || "Shourya Yadav"}
                title="Computer Science & Business Student"
                handle="shouryayadav"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/profile-picture.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => {
                  if (onFileClick) {
                    onFileClick('Email.txt')
                  }
                }}
                showIcon={true}
                showBehindGlow={true}
                behindGlowColor="rgba(180, 180, 200, 0.25)"
                customInnerGradient="linear-gradient(145deg, rgba(100, 100, 120, 0.3) 0%, rgba(120, 140, 160, 0.2) 100%)"
              />
            </motion.div>

            {/* Right: Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="space-y-6"
            >
              <div className="relative">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  About Me
                </motion.h1>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </div>

              <motion.div
                className="space-y-4 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-300">
                  I'm a <span className="text-blue-400 font-bold">Computer Science and Business</span> student at Northeastern University's D'Amore-McKim School of Business, pursuing a concentration in <span className="text-purple-400 font-semibold">Fintech</span> and a minor in <span className="text-green-400 font-semibold">Interdisciplinary AI</span>.
                </p>
                {userName && (
                  <motion.p 
                    className="text-gray-400 text-xl font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    Welcome, {userName}! 👋
                  </motion.p>
                )}
                <p className="text-gray-300">
                  With a <span className="text-yellow-400 font-semibold">3.71 GPA</span> and recognition through the <span className="text-blue-400 font-semibold">John Martinson Honors Program</span> and <span className="text-green-400 font-semibold">4x Dean's List</span>, I'm passionate about building at the intersection of technology and business strategy.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Journey Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold">My Journey</h2>
            </div>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />
              
              <div className="space-y-8">
                {[
                  { icon: Brain, color: "purple", title: "AI/ML Research", desc: "Architecting NLP pipelines processing hundreds of thousands of pharmaceutical documents" },
                  { icon: Code, color: "blue", title: "Full-Stack Development", desc: "Building scalable applications with modern tech stacks" },
                  { icon: Rocket, color: "green", title: "Leadership", desc: "Co-founding organizations reaching 200+ members" },
                  { icon: Target, color: "yellow", title: "Investment Analysis", desc: "Contributing to analysis across consumer and equity markets" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    <div className={`absolute left-0 w-16 h-16 rounded-full bg-${item.color}-500/20 border-2 border-${item.color}-500 flex items-center justify-center backdrop-blur-sm`}>
                      <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                      <h3 className={`text-xl font-bold mb-2 text-${item.color}-400`}>{item.title}</h3>
                      <p className="text-gray-300">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Role Cards with Hover Effects */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold">What I Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Code, color: "blue", title: "Full-Stack Developer", desc: "Building scalable applications with Python, JavaScript, React, FastAPI, and AWS", gradient: "from-blue-500/20 to-blue-600/10" },
                { icon: Brain, color: "purple", title: "AI/ML Researcher", desc: "Architecting NLP pipelines and semantic matching algorithms for healthcare data", gradient: "from-purple-500/20 to-purple-600/10" },
                { icon: Rocket, color: "green", title: "Entrepreneur & Leader", desc: "Co-founding organizations, leading teams, and building products at startups", gradient: "from-green-500/20 to-green-600/10" },
                { icon: Music, color: "red", title: "Creative & Explorer", desc: "Music production, poker, food tourism, global travel, and cat photography", gradient: "from-red-500/20 to-red-600/10" }
              ].map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`relative group bg-gradient-to-br ${role.gradient} backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 overflow-hidden cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <role.icon className={`w-12 h-12 text-${role.color}-400 mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{role.desc}</p>
                  </div>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${role.color}-500/10 rounded-full blur-2xl group-hover:opacity-50 transition-opacity`} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Interactive Skills Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <Code className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold">Technical Skills</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skills).map(([category, items], catIndex) => {
                const colors = {
                  languages: { bg: "bg-blue-600/20", border: "border-blue-500", text: "text-blue-400", icon: Code },
                  cloud: { bg: "bg-green-600/20", border: "border-green-500", text: "text-green-400", icon: Rocket },
                  ml: { bg: "bg-purple-600/20", border: "border-purple-500", text: "text-purple-400", icon: Brain },
                  tools: { bg: "bg-yellow-600/20", border: "border-yellow-500", text: "text-yellow-400", icon: Zap }
                }
                const config = colors[category]
                const Icon = config.icon

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-6 h-6 ${config.text}`} />
                      <h3 className={`text-lg font-semibold ${config.text} capitalize`}>
                        {category === 'ml' ? 'Data Science & ML' : category === 'cloud' ? 'Cloud & Databases' : category === 'tools' ? 'Tools & Practices' : 'Languages & Frameworks'}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (catIndex * 0.1) + (index * 0.03) }}
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          className={`px-4 py-2 ${config.bg} ${config.border} border rounded-lg text-sm cursor-pointer hover:shadow-lg transition-all`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Personal Interests with Visual Cards */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <Heart className="w-8 h-8 text-red-400" />
              <h2 className="text-3xl font-bold">Personal Interests</h2>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-green-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                When I'm not coding or building organizations, you'll find me producing music, playing poker, exploring food scenes around the world, or binge-watching TV shows. I'm fluent in <span className="text-blue-400 font-semibold">English</span> and <span className="text-green-400 font-semibold">Hindi</span>, with fundamental knowledge of <span className="text-purple-400 font-semibold">German</span> and <span className="text-yellow-400 font-semibold">Marathi</span>.
              </p>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className="px-6 py-3 bg-purple-600/20 border border-purple-500 rounded-full text-sm font-medium cursor-pointer hover:bg-purple-600/30 transition-all hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    {interest}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}