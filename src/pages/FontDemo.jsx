import { motion } from 'framer-motion'
import { useState } from 'react'

const sfFonts = [
  {
    name: 'SF Pro Display',
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    description: 'Apple\'s primary display font - optimized for large sizes and headlines',
    category: 'display'
  },
  {
    name: 'SF Pro Text',
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    description: 'Apple\'s text font - optimized for readability at small sizes',
    category: 'text'
  },
  {
    name: 'SF Mono',
    family: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    description: 'Apple\'s monospace font - perfect for code and technical content',
    category: 'monospace'
  },
  {
    name: 'SF Pro Rounded',
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
    description: 'Rounded variant of SF Pro - friendly and approachable',
    category: 'display'
  }
]

const sampleTexts = {
  heading: 'Shourya Yadav',
  subheading: 'Software Engineer & Creative Developer',
  body: 'Welcome to my personal website. This is a mock operating system interface where you can explore my projects, experience, and achievements.',
  code: 'const create = () => { return "amazing"; }'
}

export default function FontDemo() {
  const [selectedFont, setSelectedFont] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2">SF Font Family Demo</h1>
        <p className="text-gray-400 mb-2">SF Mono is now the default font across the website</p>
        <p className="text-gray-500 text-sm mb-4">Explore alternative SF font variants for specific use cases</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500 rounded-full text-xs">Display</span>
          <span className="px-3 py-1 bg-purple-600/20 border border-purple-500 rounded-full text-xs">Text</span>
          <span className="px-3 py-1 bg-green-600/20 border border-green-500 rounded-full text-xs">Monospace</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sfFonts.map((font, index) => (
            <motion.div
              key={font.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedFont(font.family)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedFont === font.family
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ fontFamily: font.family }}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{font.name}</h2>
                  {font.category && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      font.category === 'display' ? 'bg-blue-600/20 text-blue-400 border border-blue-500' :
                      font.category === 'text' ? 'bg-purple-600/20 text-purple-400 border border-purple-500' :
                      'bg-green-600/20 text-green-400 border border-green-500'
                    }`}>
                      {font.category}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{font.description}</p>
                
                <div className="space-y-2 mt-4">
                  <div className="text-3xl font-bold" style={{ fontFamily: font.family }}>
                    {sampleTexts.heading}
                  </div>
                  <div className="text-lg text-gray-300" style={{ fontFamily: font.family }}>
                    {sampleTexts.subheading}
                  </div>
                  <div className="text-sm text-gray-400 mt-3" style={{ fontFamily: font.family }}>
                    {sampleTexts.body}
                  </div>
                  {font.category === 'monospace' && (
                    <div className="text-xs bg-gray-900 p-3 rounded mt-3" style={{ fontFamily: font.family }}>
                      {sampleTexts.code}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedFont && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-2xl"
          >
            <p className="text-sm text-gray-300 mb-2">
              Selected: <span className="font-bold" style={{ fontFamily: selectedFont }}>
                {sfFonts.find(f => f.family === selectedFont)?.name}
              </span>
            </p>
            <button
              onClick={() => {
                document.body.style.fontFamily = selectedFont
                localStorage.setItem('selectedFont', selectedFont)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Apply to Website
            </button>
          </motion.div>
        )}

        <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">About SF Font Family</h3>
          <p className="text-gray-300 mb-4">
            <strong>SF Mono</strong> is now the default font across your entire website, giving it a modern, technical aesthetic. 
            San Francisco (SF) is Apple's system font family, designed for optimal readability and consistency across Apple devices.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>SF Mono (Default):</strong> Monospace variant perfect for code and technical content - used site-wide</li>
            <li><strong>SF Pro Display:</strong> Optimized for headlines and large text (18pt+) - alternative option</li>
            <li><strong>SF Pro Text:</strong> Optimized for body text and small sizes (below 18pt) - alternative option</li>
            <li><strong>SF Pro Rounded:</strong> Rounded variant with a friendlier appearance - alternative option</li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            Note: The Terminal component uses SF Mono by default. You can apply different SF variants to specific components if needed.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
