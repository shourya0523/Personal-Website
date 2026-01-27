import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const commands = {
  help: 'Available commands: help, about, projects, resume, contact, awards, leadership, clear',
  about: 'I am Shourya Yadav, a software engineer passionate about creating amazing digital experiences.',
  projects: 'Check out my projects folder or visit the Projects window!',
  resume: 'Open the Resume window to view my professional experience.',
  contact: 'Feel free to reach out! Open the Contact window for details.',
  awards: 'View my achievements in the Awards window.',
  leadership: 'Learn about my leadership experience in the Leadership window.',
}

export default function Terminal({ onFileClick }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Shourya\'s Terminal!' },
    { type: 'output', text: 'Type "help" for available commands.' },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight)
  }, [history])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const command = input.trim().toLowerCase()
    setHistory([...history, { type: 'input', text: input }])

    if (command === 'clear') {
      setHistory([])
    } else if (commands[command]) {
      setHistory([...history, { type: 'input', text: input }, { type: 'output', text: commands[command] }])
    } else {
      setHistory([...history, { type: 'input', text: input }, { type: 'output', text: `Command not found: ${command}. Type "help" for available commands.` }])
    }

    setInput('')
  }

  return (
    <div className="h-full flex flex-col bg-black text-green-400 p-4" style={{ fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace' }}>
      <div ref={terminalRef} className="flex-1 overflow-auto mb-2">
        {history.map((item, index) => (
          <div key={index} className="mb-1">
            {item.type === 'input' ? (
              <span className="text-blue-400">$ {item.text}</span>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-blue-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400"
          autoFocus
        />
      </form>
    </div>
  )
}
