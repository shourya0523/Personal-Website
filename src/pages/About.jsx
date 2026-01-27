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

  const skills = {
    languages: ['Python', 'JavaScript', 'SQL', 'Java', 'HTML', 'CSS', 'Flask', 'FastAPI', 'React.js', 'Express.js', 'LangChain', 'Selenium'],
    cloud: ['AWS (EC2, RDS, S3)', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Database Architecture'],
    ml: ['Pandas', 'Scikit-Learn', 'HuggingFace', 'TensorFlow', 'NumPy', 'Plotly', 'PowerBI', 'ETL Pipelines'],
    tools: ['Git', 'Jira', 'REST APIs', 'Agile/Scrum', 'N8N', 'Alteryx (Foundations Certified)']
  }

  const interests = ['Music Production', 'Poker', 'Food Tourism', 'Global Travel', 'Binge-Watching TV Shows']

  return (
    <div ref={containerRef} className="relative h-full overflow-auto" style={{ color: 'hsl(var(--foreground))' }}>
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'hsl(170, 80%, 50%, 0.1)' }} />
        <div className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: 'hsl(50, 90%, 65%, 0.1)' }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-2000" style={{ backgroundColor: 'hsl(180, 70%, 45%, 0.1)' }} />
      </motion.div>

      <div className="relative z-10 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section with Split Layout */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16 items-center min-h-[60vh]"
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
                  className="text-5xl md:text-6xl font-bold mb-4"
                  style={{ 
                    background: 'linear-gradient(to right, hsl(170, 80%, 50%), hsl(50, 90%, 65%), hsl(180, 70%, 45%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
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
                  <Sparkles className="w-8 h-8" style={{ color: 'hsl(var(--accent))' }} />
                </motion.div>
              </div>

              <motion.div
                className="space-y-4 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white" style={{ opacity: 1 }}>
                  I'm <span className="font-bold" style={{ color: 'hsl(170, 80%, 50%)' }}>Shourya</span> — a <span className="font-semibold" style={{ color: 'hsl(170, 80%, 50%)' }}>CS and Business</span> student at Northeastern who'd rather be <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>building something</span> than talking about building something.
                </p>
                <p className="text-white" style={{ opacity: 1 }}>
                  I like solving problems that sit at the intersection of <span className="font-semibold" style={{ color: 'hsl(170, 80%, 50%)' }}>tech and business</span>, whether that's architecting <span className="font-semibold" style={{ color: 'hsl(180, 70%, 45%)' }}>NLP pipelines</span> processing half a million clinical trials, scaling a student org from zero to <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>200+ members</span>, or figuring out how to <span className="font-semibold" style={{ color: 'hsl(50, 90%, 65%)' }}>match VCs with startups algorithmically</span>.
                </p>
                <p className="text-white" style={{ opacity: 1 }}>
                  I get restless when I'm not working on something, which is why I'm usually juggling a <span className="font-semibold" style={{ color: 'hsl(180, 70%, 45%)' }}>co-op</span>, a couple <span className="font-semibold" style={{ color: 'hsl(170, 80%, 50%)' }}>side projects</span>, and at least one <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>organization</span> that probably needs more of my attention.
                </p>
                <p className="text-white" style={{ opacity: 1 }}>
                  I'm drawn to roles where I can <span className="font-semibold" style={{ color: 'hsl(170, 80%, 50%)' }}>build real things</span> and <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>lead teams</span> doing the same. Not interested in busywork or meetings that could've been emails.
                </p>
                <p className="text-white" style={{ opacity: 1 }}>
                  When I'm not coding, I'm <span className="font-semibold" style={{ color: 'hsl(50, 90%, 65%)' }}>producing music</span>, playing poker, hunting for good food in random cities, or binge-watching shows I've already seen three times.
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
              <TrendingUp className="w-8 h-8" style={{ color: 'hsl(180, 70%, 45%)' }} />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>My Journey</h2>
            </div>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, hsl(170, 80%, 50%), hsl(180, 70%, 45%), hsl(50, 90%, 65%))' }} />
              
              <div className="space-y-8">
                {[
                  { icon: Brain, color: 'hsl(180, 70%, 45%)', bgColor: 'hsl(180, 70%, 45%, 0.2)', borderColor: 'hsl(180, 70%, 45%, 0.5)', title: "AI/ML Research", desc: "Architecting NLP pipelines processing hundreds of thousands of pharmaceutical documents" },
                  { icon: Code, color: 'hsl(170, 80%, 50%)', bgColor: 'hsl(170, 80%, 50%, 0.2)', borderColor: 'hsl(170, 80%, 50%, 0.5)', title: "Full-Stack Development", desc: "Building scalable applications with modern tech stacks" },
                  { icon: Rocket, color: 'hsl(var(--accent))', bgColor: 'hsl(var(--accent) / 0.2)', borderColor: 'hsl(var(--accent) / 0.5)', title: "Leadership", desc: "Co-founding organizations reaching 200+ members" },
                  { icon: Target, color: 'hsl(50, 90%, 65%)', bgColor: 'hsl(50, 90%, 65%, 0.2)', borderColor: 'hsl(50, 90%, 65%, 0.5)', title: "Investment Analysis", desc: "Contributing to analysis across consumer and equity markets" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    <div 
                      className="absolute left-0 w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
                    >
                      <item.icon className="w-8 h-8" style={{ color: item.color }} />
                    </div>
                    <div 
                      className="backdrop-blur-xl rounded-xl p-6 border transition-all hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'hsl(var(--card) / 0.8)',
                        borderColor: item.borderColor
                      }}
                    >
                      <h3 className="text-xl font-bold mb-2" style={{ color: item.color }}>{item.title}</h3>
                      <p style={{ color: 'hsl(var(--foreground))' }}>{item.desc}</p>
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
              <Zap className="w-8 h-8" style={{ color: 'hsl(var(--accent))' }} />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>What I Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Code, color: 'hsl(170, 80%, 50%)', bgColor: 'hsl(170, 80%, 50%, 0.1)', borderColor: 'hsl(170, 80%, 50%, 0.5)', title: "Full-Stack Developer", desc: "Building scalable applications with Python, JavaScript, React, FastAPI, and AWS" },
                { icon: Brain, color: 'hsl(180, 70%, 45%)', bgColor: 'hsl(180, 70%, 45%, 0.1)', borderColor: 'hsl(180, 70%, 45%, 0.5)', title: "AI/ML Researcher", desc: "Architecting NLP pipelines and semantic matching algorithms for healthcare data" },
                { icon: Rocket, color: 'hsl(var(--accent))', bgColor: 'hsl(var(--accent) / 0.1)', borderColor: 'hsl(var(--accent) / 0.5)', title: "Entrepreneur & Leader", desc: "Co-founding organizations, leading teams, and building products at startups" },
                { icon: Music, color: 'hsl(50, 90%, 65%)', bgColor: 'hsl(50, 90%, 65%, 0.1)', borderColor: 'hsl(50, 90%, 65%, 0.5)', title: "Creative & Explorer", desc: "Music production, poker, food tourism, global travel, and cat photography" }
              ].map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group backdrop-blur-xl rounded-2xl p-8 border overflow-hidden cursor-pointer"
                  style={{ 
                    backgroundColor: 'hsl(var(--card) / 0.8)',
                    borderColor: role.borderColor
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to bottom right, transparent, ${role.bgColor})` }} />
                  <div className="relative z-10">
                    <role.icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" style={{ color: role.color }} />
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'hsl(var(--foreground))' }}>{role.title}</h3>
                    <p style={{ color: 'hsl(var(--foreground))' }} className="leading-relaxed">{role.desc}</p>
                  </div>
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl group-hover:opacity-50 transition-opacity"
                    style={{ backgroundColor: role.bgColor }}
                  />
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
              <Code className="w-8 h-8" style={{ color: 'hsl(170, 80%, 50%)' }} />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Technical Skills</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skills).map(([category, items], catIndex) => {
                const colors = {
                  languages: { color: 'hsl(170, 80%, 50%)', bg: 'hsl(170, 80%, 50%, 0.2)', border: 'hsl(170, 80%, 50%, 0.5)', icon: Code },
                  cloud: { color: 'hsl(var(--accent))', bg: 'hsl(var(--accent) / 0.2)', border: 'hsl(var(--accent) / 0.5)', icon: Rocket },
                  ml: { color: 'hsl(180, 70%, 45%)', bg: 'hsl(180, 70%, 45%, 0.2)', border: 'hsl(180, 70%, 45%, 0.5)', icon: Brain },
                  tools: { color: 'hsl(50, 90%, 65%)', bg: 'hsl(50, 90%, 65%, 0.2)', border: 'hsl(50, 90%, 65%, 0.5)', icon: Zap }
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
                    className="backdrop-blur-xl rounded-xl p-6 border"
                    style={{ 
                      backgroundColor: 'hsl(var(--card) / 0.8)',
                      borderColor: config.border
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-6 h-6" style={{ color: config.color }} />
                      <h3 className="text-lg font-semibold capitalize" style={{ color: config.color }}>
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
                          className="px-4 py-2 rounded-lg text-sm cursor-pointer transition-all"
                          style={{ 
                            backgroundColor: config.bg,
                            borderColor: config.border,
                            borderWidth: '1px',
                            color: config.color
                          }}
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
              <Heart className="w-8 h-8" style={{ color: 'hsl(50, 90%, 65%)' }} />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Personal Interests</h2>
            </div>
            <div 
              className="backdrop-blur-xl rounded-2xl p-8 border"
              style={{ 
                backgroundColor: 'hsl(var(--card) / 0.8)',
                borderColor: 'hsl(180, 70%, 45%, 0.5)'
              }}
            >
              <p className="mb-6 text-lg leading-relaxed" style={{ color: 'hsl(var(--foreground))' }}>
                When I'm not coding or building organizations, you'll find me producing music, playing poker, exploring food scenes around the world, or binge-watching TV shows. I'm fluent in <span className="font-semibold" style={{ color: 'hsl(170, 80%, 50%)' }}>English</span> and <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>Hindi</span>, with fundamental knowledge of <span className="font-semibold" style={{ color: 'hsl(180, 70%, 45%)' }}>German</span> and <span className="font-semibold" style={{ color: 'hsl(50, 90%, 65%)' }}>Marathi</span>.
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
                    className="px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all"
                    style={{ 
                      backgroundColor: 'hsl(180, 70%, 45%, 0.2)',
                      borderColor: 'hsl(180, 70%, 45%, 0.5)',
                      borderWidth: '1px',
                      color: 'hsl(180, 70%, 45%)'
                    }}
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
