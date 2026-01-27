import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Phone } from 'lucide-react'

export default function Contact({ onFileClick }) {
  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:yadav.sho@northeastern.edu', color: 'text-red-400' },
    { icon: Phone, label: 'Phone', href: 'tel:+15103267626', color: 'text-green-400' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/shouryadav', color: 'text-blue-400' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/shourya0523', color: 'text-gray-400' },
  ]

  return (
    <div className="p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Get In Touch</h1>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Connect With Me</h2>
          <div className="space-y-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <Icon className={`w-6 h-6 ${social.color}`} />
                  <span className="font-medium">{social.label}</span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
