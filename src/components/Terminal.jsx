import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, ChevronRight, AlertCircle, CheckCircle2, Info, Sparkles, Music, Play, Pause, Volume2, Image as ImageIcon, Folder, FileText } from 'lucide-react'
import { useWindows } from '../contexts/WindowContext'
import { useMusic } from '../contexts/MusicContext'
import { useWallpaper } from '../contexts/WallpaperContext'
import { useUser } from '../contexts/UserContext'
import { extractColorsFromImage } from '../utils/colorExtractor'

const ASCII_ART = `
    ╔═══════════════════════════════════════════════════════════════╗
    ║  ╔═══╗                                                       ║
    ║  ║ ⚡ ║     ███████╗██╗  ██╗ ██████╗ ██╗   ██╗██████╗       ║
    ║  ╚═══╝     ██╔════╝██║  ██║██╔═══██╗██║   ██║██╔══██╗      ║
    ║            ███████╗███████║██║   ██║██║   ██║██████╔╝      ║
    ║            ╚════██║██╔══██║██║   ██║██║   ██║██╔══██╗      ║
    ║            ███████║██║  ██║╚██████╔╝╚██████╔╝██║  ██║      ║
    ║            ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝      ║
    ║                                                               ║
    ║            ██████╗ ███████╗                                   ║
    ║            ██╔══██╗██╔════╝                                   ║
    ║            ██████╔╝███████╗                                   ║
    ║            ██╔══██╗╚════██║                                   ║
    ║            ██║  ██║███████║                                   ║
    ║            ╚═╝  ╚═╝╚════════╝                                   ║
    ║                                                               ║
    ║  ┌─────────────────────────────────────────────────────┐    ║
    ║  │                                                     │    ║
    ║  │         ██████╗ ███████╗                           │    ║
    ║  │         ██╔═══██╗██╔════╝                           │    ║
    ║  │         ██║   ██║███████╗                           │    ║
    ║  │         ██║   ██║╚════██║                           │    ║
    ║  │         ╚██████╔╝███████║                           │    ║
    ║  │          ╚═════╝ ╚════════╝                           │    ║
    ║  │                                                     │    ║
    ║  └─────────────────────────────────────────────────────┘    ║
    ║                                                               ║
    ║  ════════════════════════════════════════════════════════    ║
    ║                                                               ║
    ║     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        ║
    ║     ░░  ╔═══╗  ╔═══╗  ╔═══╗  ╔═══╗  ╔═══╗  ░░        ║
    ║     ░░  ║   ║  ║   ║  ║   ║  ║   ║  ║   ║  ░░        ║
    ║     ░░  ╚═══╝  ╚═══╝  ╚═══╝  ╚═══╝  ╚═══╝  ░░        ║
    ║     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        ║
    ║                                                               ║
    ║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    ║
    ║  ┃  ⚡ v2.0  │  🚀 React  │  💻 CLI  │  🎨 Modern  ┃    ║
    ║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
`

const appCommands = {
  'about': { name: 'About', icon: '👤' },
  'projects': { name: 'Projects', icon: '💼' },
  'resume': { name: 'Resume', icon: '📄' },
  'contact': { name: 'Contact', icon: '📧' },
  'awards': { name: 'Awards', icon: '🏆' },
  'leadership': { name: 'Leadership', icon: '👥' },
  'explorer': { name: 'File Explorer', icon: '📁' },
  'music': { name: 'Music Player', icon: '🎵' },
  'wallpaper': { name: 'Wallpaper', icon: '🖼️' },
  'terminal': { name: 'Terminal', icon: '💻' },
}

export default function Terminal({ onFileClick, onOpenApp, apps: appsList }) {
  const { windows, openWindow } = useWindows()
  const { currentSong, isPlaying, togglePlayPause, stop, setVolume, volume, playSong } = useMusic()
  const { wallpaperUrl, updateWallpaper } = useWallpaper()
  const { userName } = useUser()

  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  // Initialize with ASCII art and welcome message
  useEffect(() => {
    const welcomeMessages = [
      { 
        type: 'output', 
        text: ASCII_ART,
        outputType: 'info',
        isAscii: true
      },
      { 
        type: 'output', 
        text: `Welcome to Shourya OS v2.0`,
        icon: <Sparkles size={14} className="text-yellow-400" />,
        outputType: 'info'
      },
      { 
        type: 'output', 
        text: `Logged in as: ${userName || 'guest'}`,
        outputType: 'success'
      },
      { 
        type: 'output', 
        text: `Type "help" for available commands.`,
        outputType: 'info'
      },
      { 
        type: 'output', 
        text: `💼 Recruiters: Type "recruiter" or "info" for quick overview.`,
        outputType: 'success'
      },
    ]
    setHistory(welcomeMessages)
  }, [userName])

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight)
  }, [history])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1)
            setInput('')
          } else {
            setHistoryIndex(newIndex)
            setInput(commandHistory[newIndex])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, commandHistory])

  // Search and play song directly
  const searchAndPlaySong = async (query) => {
    setIsLoading(true)
    setHistory(prev => [...prev, {
      type: 'output',
      text: `🔍 Searching for: "${query}"...`,
      outputType: 'info'
    }])

    try {
      const deezerApiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`
      const proxyServices = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(deezerApiUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(deezerApiUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(deezerApiUrl)}`,
      ]

      let result = null
      for (const proxyUrl of proxyServices) {
        try {
          const response = await fetch(proxyUrl)
          if (response.ok) {
            const data = await response.json()
            if (data.data && data.data.length > 0) {
              result = data.data[0]
              break
            }
          }
        } catch (err) {
          continue
        }
      }

      if (result && result.preview) {
        const song = {
          id: result.id.toString(),
          title: result.title,
          artist: result.artist.name,
          album: result.album.title,
          duration: result.duration,
          preview: result.preview,
          cover: result.album.cover_medium || result.album.cover
        }
        
        playSong(song)
        setHistory(prev => [...prev, {
          type: 'output',
          text: `✓ Now Playing:\n  Title: ${song.title}\n  Artist: ${song.artist}\n  Album: ${song.album}\n  Duration: ${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}`,
          outputType: 'success'
        }])
      } else {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `✗ No results found for "${query}"`,
          outputType: 'error'
        }])
      }
    } catch (error) {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `✗ Error searching for song: ${error.message}`,
        outputType: 'error'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Search and set wallpaper directly
  const searchAndSetWallpaper = async (query, randomIndex = null) => {
    setIsLoading(true)
    setHistory(prev => [...prev, {
      type: 'output',
      text: `🖼️  Searching wallpaper: "${query}"...`,
      outputType: 'info'
    }])

    try {
      const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
      if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
        setHistory(prev => [...prev, {
          type: 'output',
          text: '✗ Unsplash API key not configured. Please set VITE_UNSPLASH_ACCESS_KEY in .env',
          outputType: 'error'
        }])
        setIsLoading(false)
        return
      }

      // Fetch more results for random selection (up to 30)
      const perPage = randomIndex !== null ? 30 : 1
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch wallpaper')
      }

      const data = await response.json()
      if (data.results && data.results.length > 0) {
        // If randomIndex is provided, use it; otherwise use first result
        const imageIndex = randomIndex !== null 
          ? Math.min(randomIndex, data.results.length - 1)
          : 0
        const image = data.results[imageIndex]
        const imageUrl = image.urls.regular || image.urls.full
        
        // Extract colors
        try {
          const colors = await extractColorsFromImage(imageUrl, 10)
          updateWallpaper(imageUrl, colors)
          
          setHistory(prev => [...prev, {
            type: 'output',
            text: `✓ Wallpaper set successfully!\n  Query: "${query}"\n  URL: ${imageUrl.substring(0, 60)}...\n  Colors extracted: ${colors.length} colors`,
            outputType: 'success'
          }])
        } catch (err) {
          updateWallpaper(imageUrl, [])
          setHistory(prev => [...prev, {
            type: 'output',
            text: `✓ Wallpaper set (color extraction failed)\n  Query: "${query}"\n  URL: ${imageUrl.substring(0, 60)}...`,
            outputType: 'success'
          }])
        }
      } else {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `✗ No wallpapers found for "${query}"`,
          outputType: 'error'
        }])
      }
    } catch (error) {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `✗ Error setting wallpaper: ${error.message}`,
        outputType: 'error'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const openApp = (appId) => {
    const app = appCommands[appId]
    if (!app) return false

    const existingWindow = windows.find(w => w.type === appId)
    if (existingWindow) {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `${app.name} is already open.`,
        outputType: 'info'
      }])
      return true
    }

    if (onOpenApp && appsList) {
      const appToOpen = appsList.find(a => a.id === appId || a.type === appId)
      if (appToOpen) {
        onOpenApp(appToOpen)
        setHistory(prev => [...prev, {
          type: 'output',
          text: `✓ Opened ${app.name}`,
          outputType: 'success'
        }])
        return true
      }
    }

    const componentMap = {
      'about': () => import('../pages/About').then(m => ({ default: m.default })),
      'projects': () => import('../pages/Projects').then(m => ({ default: m.default })),
      'resume': () => import('../pages/Resume').then(m => ({ default: m.default })),
      'contact': () => import('../pages/Contact').then(m => ({ default: m.default })),
      'awards': () => import('../pages/Awards').then(m => ({ default: m.default })),
      'leadership': () => import('../pages/Leadership').then(m => ({ default: m.default })),
      'explorer': () => import('../components/FileExplorer').then(m => ({ default: m.default })),
      'music': () => import('../pages/MusicPlayer').then(m => ({ default: m.default })),
      'wallpaper': () => import('../pages/WallpaperSelector').then(m => ({ default: m.default })),
    }

    const loadComponent = componentMap[appId]
    if (loadComponent) {
      loadComponent().then(module => {
        const Component = module.default
        openWindow({
          type: appId,
          title: app.name,
          icon: app.icon,
          content: <Component onFileClick={onFileClick} />,
          size: { width: 900, height: 700 },
        })
        setHistory(prev => [...prev, {
          type: 'output',
          text: `✓ Opened ${app.name}`,
          outputType: 'success'
        }])
      }).catch(err => {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Error opening ${app.name}: ${err.message}`,
          outputType: 'error'
        }])
      })
      return true
    }
    return false
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const commandParts = input.trim().split(' ')
    const command = commandParts[0].toLowerCase()
    const args = commandParts.slice(1)

    setCommandHistory(prev => [...prev, input.trim()])
    setHistoryIndex(-1)
    setHistory(prev => [...prev, { type: 'input', text: input }])

    if (command === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    // Play song command - searches and plays directly
    if (command === 'play') {
      const query = args.join(' ')
      if (!query) {
        if (currentSong) {
          togglePlayPause()
          setHistory(prev => [...prev, {
            type: 'output',
            text: isPlaying ? '⏸ Music paused' : '▶ Music playing',
            outputType: 'success'
          }])
        } else {
          setHistory(prev => [...prev, {
            type: 'output',
            text: 'Usage: play <song name>\nExample: play "freefall rainbow kitten"',
            outputType: 'error'
          }])
        }
      } else {
        searchAndPlaySong(query)
      }
    }
    // Wallpaper command - searches and sets directly
    else if (command === 'wallpaper' || command === 'wp') {
      const query = args.join(' ')
      if (!query) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Current wallpaper: ${wallpaperUrl.substring(0, 60)}...\nUsage: wallpaper <search term>\nExample: wallpaper "nature landscape"`,
          outputType: 'info'
        }])
      } else {
        searchAndSetWallpaper(query)
      }
    }
    // Open app command
    else if (command === 'open') {
      const appId = args[0]?.toLowerCase()
      if (!appId) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: 'Usage: open <app>\nAvailable apps: about, projects, resume, contact, awards, leadership, explorer, music, wallpaper',
          outputType: 'error'
        }])
      } else if (appCommands[appId]) {
        openApp(appId)
      } else {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `App not found: ${appId}\nType "apps" to see available apps.`,
          outputType: 'error'
        }])
      }
    }
    // Music control commands
    else if (command === 'music') {
      if (args[0] === 'play' || args.length === 0) {
        if (!currentSong) {
          setHistory(prev => [...prev, {
            type: 'output',
            text: 'No song loaded. Use "play <song name>" to search and play.',
            outputType: 'info'
          }])
        } else {
          togglePlayPause()
          setHistory(prev => [...prev, {
            type: 'output',
            text: isPlaying ? '⏸ Music paused' : '▶ Music playing',
            outputType: 'success'
          }])
        }
      } else if (args[0] === 'stop') {
        stop()
        setHistory(prev => [...prev, {
          type: 'output',
          text: '⏹ Music stopped',
          outputType: 'success'
        }])
      } else if (args[0] === 'status') {
        if (currentSong) {
          setHistory(prev => [...prev, {
            type: 'output',
            text: `Now Playing: ${currentSong.title}\nArtist: ${currentSong.artist}\nStatus: ${isPlaying ? '▶ Playing' : '⏸ Paused'}\nVolume: ${Math.round(volume * 100)}%`,
            outputType: 'info'
          }])
        } else {
          setHistory(prev => [...prev, {
            type: 'output',
            text: 'No music playing. Use "play <song name>" to search and play.',
            outputType: 'info'
          }])
        }
      } else {
        openApp('music')
      }
    }
    // List commands
    else if (command === 'ls' || command === 'list') {
      if (args[0] === 'apps' || args[0] === '--apps') {
        const appList = Object.entries(appCommands).map(([id, app]) => 
          `  ${app.icon} ${id.padEnd(12)} - ${app.name}`
        ).join('\n')
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Available Apps:\n${appList}`,
          outputType: 'success'
        }])
      } else {
        const appList = Object.keys(appCommands).join('  ')
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Available commands:\n${appList}\n\nType "ls --apps" to see all apps.`,
          outputType: 'success'
        }])
      }
    }
    // Windows command
    else if (command === 'windows' || command === 'win') {
      if (windows.length === 0) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: 'No windows open.',
          outputType: 'info'
        }])
    } else {
        const windowList = windows.map((w, i) => 
          `  ${i + 1}. ${w.title} (${w.minimized ? 'minimized' : 'active'})`
        ).join('\n')
        setHistory(prev => [...prev, {
          type: 'output',
          text: `Open Windows:\n${windowList}`,
          outputType: 'info'
        }])
      }
    }
    // Recruiter commands
    else if (command === 'recruiter' || command === 'info') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `📋 Quick Recruiter Info - Shourya Yadav
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 Education:
  • Computer Science & Business, Northeastern University
  • Concentration: Fintech | Minor: Interdisciplinary AI
  • GPA: 3.71 | Honors Program | 4x Dean's List
  • Location: Boston, MA

💼 Current Role:
  • Undergraduate Teaching Assistant - Advanced Programming with Data
  • Northeastern University, Khoury College

🔧 Key Skills:
  • Languages: Python, JavaScript, SQL, Java, HTML/CSS
  • Frameworks: React.js, FastAPI, Flask, Express.js, LangChain
  • Cloud: AWS (EC2, RDS, S3), Docker
  • Databases: MySQL, PostgreSQL, MongoDB
  • AI/ML: NLP pipelines, semantic matching, LLM optimization

💡 Quick Commands:
  skills       - View detailed technical skills
  experience   - View work experience
  education    - View education details
  contact      - Get contact information
  summary      - Professional summary

📄 Full Details:
  open resume  - View complete resume
  open about   - View full profile
  open projects - View portfolio projects`,
        outputType: 'info'
      }])
    }
    else if (command === 'skills') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `🔧 Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages & Frameworks:
  • Python, JavaScript, SQL, Java, HTML, CSS
  • Flask, FastAPI, React.js, Express.js, LangChain, Selenium

Cloud & Infrastructure:
  • AWS (EC2, RDS, S3), Docker, CI/CD Pipelines
  • Database Architecture, API Design

Databases:
  • MySQL, PostgreSQL, MongoDB

AI/ML & Data:
  • NLP Pipeline Architecture
  • Semantic Matching Algorithms
  • LLM Cost Optimization
  • ETL Pipeline Development
  • Data Processing (150k+ patents, 500k+ clinical trials)

Tools & Technologies:
  • Git, Jira, Agile Methodologies
  • Apollo.io, LinkedIn Automation
  • Python Automation Scripts`,
        outputType: 'success'
      }])
    }
    else if (command === 'experience') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `💼 Work Experience Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current:
  • Undergraduate Teaching Assistant - Advanced Programming with Data
    Northeastern University | Jan 2026 - Present
    → Support 50+ students weekly, lead review sessions
    → Streamlined grading workflows, reduced turnaround by 30%

Recent:
  • AI/ML Researcher Co-op | SNAP Life Sciences
    May 2025 - Dec 2025
    → Architected NLP ETL pipelines (150k+ patents, 500k+ trials)
    → Reduced LLM costs by 70%
    → Achieved 100% recall for healthcare data classification
    → Contributed 40% of proprietary drug/patent database

  • Sales & Business Development Intern | Attentions AI
    July 2024 - Sept 2024
    → Generated 500+ qualified leads via automation
    → Launched 4+ multi-channel marketing campaigns

Leadership:
  • Software Product Lab Lead | Forge Program
    Aug 2025 - Dec 2025
    → Directed 8-developer team, accelerated timeline by 4 weeks

  • Director of Operations, Co-Founder | Claude Builders Club
    Aug 2025 - Present
    → Scaled to 200+ members, secured $30k+ sponsorships
    → Founded AI product incubator (30 students)

Type "open resume" for complete details.`,
        outputType: 'info'
      }])
    }
    else if (command === 'education') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `🎓 Education
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Northeastern University
D'Amore-McKim School of Business

Degree: Computer Science & Business
Concentration: Fintech
Minor: Interdisciplinary AI

Academic Performance:
  • GPA: 3.71
  • John Martinson Honors Program
  • 4x Dean's List Recognition

Location: Boston, MA

Type "open resume" for complete education details.`,
        outputType: 'success'
      }])
    }
    else if (command === 'summary') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `📝 Professional Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shourya Yadav is a Computer Science & Business student at 
Northeastern University with a 3.71 GPA, pursuing Fintech 
concentration and Interdisciplinary AI minor.

Key Strengths:
  • AI/ML Research: Built NLP pipelines processing 150k+ 
    documents, reduced LLM costs by 70%
  • Full-Stack Development: Python, JavaScript, React, 
    FastAPI, AWS
  • Leadership: Co-founded organizations reaching 200+ 
    members, directed 8-developer teams
  • Business Acumen: Investment analysis, GTM strategy, 
    secured $30k+ sponsorships

Currently: Teaching Assistant supporting 50+ students in 
Advanced Programming with Data at Northeastern.

Type "recruiter" for quick info or "open resume" for details.`,
        outputType: 'info'
      }])
    }
    else if (command === 'linkedin' || command === 'github' || command === 'email') {
      const contactInfo = {
        linkedin: 'LinkedIn: https://linkedin.com/in/shouryadav\nType "open contact" for full social links.',
        github: 'GitHub: https://github.com/shourya0523\nType "open contact" for full social links.',
        email: 'Email: yadav.sho@northeastern.edu\nType "open contact" for full contact information.'
      }
      setHistory(prev => [...prev, {
        type: 'output',
        text: contactInfo[command] || 'Type "open contact" for contact information.',
        outputType: 'success'
      }])
    }
    // Help command
    else if (command === 'help') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Recruiter Commands:
  recruiter      Quick info for recruiters
  info           Alias for recruiter
  skills         View technical skills
  experience     View work experience summary
  education      View education details
  summary        Professional summary
  linkedin       LinkedIn profile
  github         GitHub profile
  email          Contact email

🎵 Music Control:
  play <song>       Search and play a song
  music [play|stop|status]  Control music player

🖼️  Wallpaper:
  wallpaper <term>  Search and set wallpaper
  wp <term>         Shortcut for wallpaper

📂 Navigation & Apps:
  open <app>        Open an application window
  apps              List all available apps
  windows           Show open windows
  ls [--apps]       List commands or apps

⚙️  System:
  whoami            Display current user
  date              Show current date/time
  echo [text]       Echo text back
  theme             Show terminal theme info
  clear             Clear terminal screen
  help              Show this help message

🎲 Easter Eggs:
  random            Try your luck! (Terminal only)

Examples:
  recruiter                    Quick recruiter info
  skills                       View technical skills
  play "freefall rainbow kitten"  Search and play song
  wallpaper "nature"              Set wallpaper
  open resume                     Open Resume window`,
        outputType: 'success'
      }])
    }
    // About command
    else if (command === 'about') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `Shourya Yadav
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Computer Science & Business Student
Northeastern University | D'Amore-McKim School of Business

📍 Location: Boston, MA
🎓 Concentration: Fintech
🔬 Minor: Interdisciplinary AI
⭐ GPA: 3.71 | Honors Program | 4x Dean's List

Passionate about building at the intersection of 
technology and business strategy.

Type "open about" to view full profile.`,
        outputType: 'info'
      }])
    }
    // Direct app commands
    else if (appCommands[command]) {
      openApp(command)
    }
    // Echo command
    else if (command === 'echo') {
      const echoText = args.join(' ') || ''
      setHistory(prev => [...prev, {
        type: 'output',
        text: echoText,
        outputType: 'success'
      }])
    }
    // Date command
    else if (command === 'date') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        outputType: 'success'
      }])
    }
    // Whoami command
    else if (command === 'whoami') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: userName || 'guest',
        outputType: 'success'
      }])
    }
    // Apps command
    else if (command === 'apps') {
      const appList = Object.entries(appCommands).map(([id, app]) => 
        `  ${app.icon} ${id.padEnd(12)} - ${app.name}`
      ).join('\n')
      setHistory(prev => [...prev, {
        type: 'output',
        text: `Available Apps:\n${appList}\n\nUsage: open <app-name>`,
        outputType: 'success'
      }])
    }
    // Theme command
    else if (command === 'theme') {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `Shourya OS Terminal v2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Theme: Modern CLI
Colors: Dark theme with syntax highlighting
Font: SF Mono / Cascadia Code
Style: Inspired by Claude Code
User: ${userName || 'guest'}`,
        outputType: 'info'
      }])
    }
    // Projects, resume, contact, awards, leadership - open apps
    else if (['projects', 'resume', 'contact', 'awards', 'leadership', 'explorer'].includes(command)) {
      openApp(command)
    }
    // Random easter egg command
    else if (command === 'random') {
      const randomValue = Math.random()
      
      // 5% chance - Secret code easter egg (moved to top for priority)
      if (randomValue < 0.05) {
        // Generate a unique code based on timestamp and random
        const code = `SHOURYA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        const asciiArt = `
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   ╔═══╗                                      ║
    ║   ║🎲 ║   SECRET EASTER EGG DISCOVERED!     ║
    ║   ╚═══╝                                      ║
    ║                                               ║
    ║   🎉 Congratulations! You found a secret!   ║
    ║                                               ║
    ║   Your Secret Code:                          ║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
    ║   ${code.padEnd(45)}║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
    ║                                               ║
    ║   📝 Instructions:                           ║
    ║   Send this code to Shourya for a            ║
    ║   shoutout on LinkedIn!                      ║
    ║                                               ║
    ║   LinkedIn: linkedin.com/in/shouryadav     ║
    ║                                               ║
    ║   (╯°□°）╯︵ ┻━┻                              ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
        `
        setHistory(prev => [...prev, {
          type: 'output',
          text: asciiArt,
          outputType: 'success',
          isAscii: true
        }])
      }
      // 10% chance - Pac-Man game
      else if (randomValue < 0.15) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🎮 PAC-MAN EASTER EGG ACTIVATED! 🎮\n\nOpening Pac-Man game...`,
          outputType: 'success'
        }])
        setTimeout(() => {
          window.open('https://www.google.com/search?q=pacman+game', '_blank')
        }, 1000)
      }
      // 10% chance - Cat meme wallpaper (random result each time)
      else if (randomValue < 0.20) {
        const randomCatIndex = Math.floor(Math.random() * 30) // Random index from 0-29
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🐱 MEOW! Setting random cat meme wallpaper...`,
          outputType: 'info'
        }])
        searchAndSetWallpaper('cat meme', randomCatIndex)
      }
      // 10% chance - Never Gonna Give You Up
      else if (randomValue < 0.30) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🎵 You've been rickrolled! 🎵\n\nPlaying Never Gonna Give You Up...`,
          outputType: 'success'
        }])
        searchAndPlaySong('never gonna give you up rick astley')
      }
      // 10% chance - Doge meme wallpaper
      else if (randomValue < 0.40) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🐕 Much wow! Very random! 🐕\n\nSetting Doge wallpaper...`,
          outputType: 'success'
        }])
        searchAndSetWallpaper('doge meme')
      }
      // 5% chance - Secret code easter egg
      else if (randomValue < 0.45) {
        // Generate a unique code based on timestamp and random
        const code = `SHOURYA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        const asciiArt = `
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   ╔═══╗                                       ║
    ║   ║🎲 ║   SECRET EASTER EGG DISCOVERED!       ║
    ║   ╚═══╝                                       ║
    ║                                               ║
    ║   🎉 Congratulations! You found a secret!     ║
    ║                                               ║
    ║   Your Secret Code:                           ║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
    ║   ${code.padEnd(45)}║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
    ║                                               ║
    ║   📝 Instructions:                            ║
    ║   Send this code to Shourya for a             ║
    ║   shoutout on LinkedIn!                       ║
    ║                                               ║
    ║   LinkedIn: linkedin.com/in/shouryayadav      ║
    ║                                               ║
    ║   (╯°□°）╯︵ ┻━┻                               ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
        `
        setHistory(prev => [...prev, {
          type: 'output',
          text: asciiArt,
          outputType: 'success',
          isAscii: true
        }])
      }
      // 10% chance - Play All Star by Smash Mouth
      else if (randomValue < 0.6) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🌟 Somebody once told me... 🌟\n\nPlaying All Star by Smash Mouth...`,
          outputType: 'success'
        }])
        searchAndPlaySong('all star smash mouth')
      }
      // 10% chance - Open a funny website
      else if (randomValue < 0.65) {
        const funnySites = [
          { url: 'https://www.theuselessweb.com/', name: 'The Useless Web' },
          { url: 'https://www.staggeringbeauty.com/', name: 'Staggering Beauty' },
          { url: 'https://www.pointerpointer.com/', name: 'Pointer Pointer' },
          { url: 'https://www.bouncingdvdlogo.com/', name: 'Bouncing DVD Logo' },
        ]
        const site = funnySites[Math.floor(Math.random() * funnySites.length)]
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🌐 Opening ${site.name}...\n\nEnjoy the randomness! 🎉`,
          outputType: 'info'
        }])
        setTimeout(() => {
          window.open(site.url, '_blank')
        }, 1000)
      }
      // 10% chance - Motivational quote
      else if (randomValue < 0.75) {
        const quotes = [
          "The only way to do great work is to love what you do. - Steve Jobs",
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
          "The best error message is the one that never appears. - Thomas Fuchs",
          "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
        ]
        const quote = quotes[Math.floor(Math.random() * quotes.length)]
        setHistory(prev => [...prev, {
          type: 'output',
          text: `💡 Random Quote of the Day:\n\n"${quote}"\n\nKeep coding! 💻`,
          outputType: 'info'
        }])
      }
      // 10% chance - Play Never Gonna Give You Up (alternative)
      else if (randomValue < 0.85) {
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🎭 The Matrix has you...\n\nWait, wrong reference.\n\nPlaying Never Gonna Give You Up anyway! 🎵`,
          outputType: 'success'
        }])
        searchAndPlaySong('never gonna give you up rick astley')
      }
      // 10% chance - Random ASCII art drop
      else if (randomValue < 0.95) {
        const art = ASCII_ART_VARIANTS[Math.floor(Math.random() * ASCII_ART_VARIANTS.length)]
        setHistory(prev => [...prev, {
          type: 'output',
          text: `🎲 Random ASCII Art Drop!\n` + art,
          outputType: 'success',
          isAscii: true
        }])
      }
      // 5% chance - Funny error message
      else {
        const errors = [
          "Error 418: I'm a teapot",
          "Error 451: Unavailable For Legal Reasons",
          "Error 509: Bandwidth Limit Exceeded (You've been too random!)",
          "Error 420: Enhance Your Calm",
          "Error 666: The server is possessed",
        ]
        const error = errors[Math.floor(Math.random() * errors.length)]
        setHistory(prev => [...prev, {
          type: 'output',
          text: `⚠️  ${error}\n\nJust kidding! This is an easter egg, not a real error. 😄`,
          outputType: 'error'
        }])
      }
    }
    // Unknown command
    else {
      setHistory(prev => [...prev, {
        type: 'output',
        text: `Command not found: ${command}\nType "help" for available commands.`,
        outputType: 'error'
      }])
    }

    setInput('')
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={14} className="text-emerald-400" />
      case 'error':
        return <AlertCircle size={14} className="text-red-400" />
      case 'info':
        return <Info size={14} className="text-blue-400" />
      default:
        return <ChevronRight size={14} className="text-gray-400" />
    }
  }

  const getPrompt = () => {
    return (
      <span className="flex items-center gap-1">
        <span className="text-emerald-400 font-semibold">{userName || 'guest'}</span>
        <span className="text-gray-500">@</span>
        <span className="text-blue-400 font-semibold">shourya-os</span>
        <span className="text-gray-600">:</span>
        <span className="text-purple-400">~</span>
        <span className="text-gray-500">$</span>
      </span>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-[#e4e4e4] relative overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-[#888]" />
          <span className="text-xs text-[#888] font-medium">Terminal - Shourya OS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#444]"></div>
          <div className="w-2 h-2 rounded-full bg-[#444]"></div>
          <div className="w-2 h-2 rounded-full bg-[#444]"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef} 
        className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed"
        style={{ 
          fontFamily: '"SF Mono", "Cascadia Code", "JetBrains Mono", Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.6'
        }}
      >
        <AnimatePresence>
        {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-2"
            >
            {item.type === 'input' ? (
                <div className="flex items-start gap-2">
                  {getPrompt()}
                  <span className="text-[#e4e4e4] flex-1 break-words">
                    {item.text}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  {item.icon && <span className="mt-0.5 flex-shrink-0">{item.icon}</span>}
                  <pre className={`flex-1 whitespace-pre-wrap break-words ${
                    item.isAscii ? 'text-emerald-400' :
                    item.outputType === 'error' ? 'text-red-400' :
                    item.outputType === 'info' ? 'text-blue-300' :
                    item.outputType === 'success' ? 'text-emerald-300' :
                    'text-[#e4e4e4]'
                  }`}>
                    {item.text}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-blue-400"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ⏳
            </motion.span>
            <span>Processing...</span>
          </motion.div>
        )}

        {/* Cursor Blink Animation */}
        <motion.div
          className="flex items-start gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getPrompt()}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-[#e4e4e4] caret-[#00ff88] disabled:opacity-50"
          autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-[8px] h-[16px] bg-[#00ff88] ml-1"
        />
      </form>
        </motion.div>
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-[#1a1a1a] border-t border-[#2a2a2a] text-xs text-[#666]">
        <div className="flex items-center justify-between">
          <span>Press ↑↓ to navigate history | Type "help" for commands</span>
          <span>{history.length} lines | {windows.length} windows</span>
        </div>
      </div>
    </div>
  )
}

const ASCII_ART_VARIANTS = [
  `
   ╔══════════════════════════════════╗
   ║  SPACE INVADER                   ║
   ║                                  ║
   ║      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄        ║
   ║      ▀█▀▀▀▀█▀▀▀▀█▀▀▀▀█▀        ║
   ║       █     █    █    █         ║
   ║      ██▄  ▄██  ▄██  ▄██        ║
   ║       ██████    ██████          ║
   ║       ▀████      ████▀          ║
   ║        ▀██        ██▀           ║
   ║                                  ║
   ╚══════════════════════════════════╝
  `,
  `
   ╔══════════════════════════════════╗
   ║  CUTE CAT                        ║
   ║                                  ║
   ║      /\\_/\\                     ║
   ║     ( o . o )                    ║
   ║      >  ^  <                     ║
   ║     /  /_\\  \\                  ║
   ║    (  /   \\  )                 ║
   ║     \\|  _  |/                  ║
   ║       | |_| |                    ║
   ║       |_   _|                    ║
   ║         |_|                      ║
   ║                                  ║
   ╚══════════════════════════════════╝
  `,
  `
   ╔══════════════════════════════════╗
   ║  RETRO ROBOT                     ║
   ║                                  ║
   ║        .-"""-.                   ║
   ║       / .___. \\                 ║
   ║       \\ (o o) /                 ║
   ║        |  ^  |                   ║
   ║       /|=====|\\                 ║
   ║      /_|_____|_\\                ║
   ║        /  | |  \\                ║
   ║       /___| |___\\               ║
   ║          /___\\                   ║
   ║                                  ║
   ╚══════════════════════════════════╝
  `,
  `
   ╔══════════════════════════════════╗
   ║  TERMINAL WINDOW                 ║
   ║                                  ║
   ║  ┌────────────────────────────┐  ║
   ║  │ $ echo "Hello, ASCII!"    │  ║
   ║  │ Hello, ASCII!             │  ║
   ║  │                            │  ║
   ║  │ $ npm run dev             │  ║
   ║  │ > Vite server up 🔥       │  ║
   ║  └────────────────────────────┘  ║
   ║                                  ║
   ╚══════════════════════════════════╝
  `,
  `
   ╔══════════════════════════════════╗
   ║  ROCKET                          ║
   ║                                  ║
   ║         /\\                      ║
   ║        /  \\                     ║
   ║       /____\\                    ║
   ║        |  |                      ║
   ║        |  |                      ║
   ║        |  |                      ║
   ║       /|  |\\                     ║
   ║      /_|__|_\\                    ║
   ║        /\_/\                      ║
   ║       /_/ \_\\                     ║
   ║      ~~~~~~~~~~                   ║
   ║                                  ║
   ╚══════════════════════════════════╝
  `
]
