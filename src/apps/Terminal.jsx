// Terminal app — a small shell over the portfolio's content: a virtual file
// tree (src/content/files.js) plus a handful of info/print commands sourced
// from src/content/profile.js, projects.js and terminal.js. Ported from the
// legacy src/components/Terminal.jsx onto the new design system (see
// src/apps/README.md for the app contract).
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOS } from '../os/OSContext'
import { useSounds } from '../contexts/SoundContext'
import profile from '../content/profile'
import projects from '../content/projects'
import files from '../content/files'
import './Terminal.css'

const APP_IDS = ['about', 'projects', 'resume', 'contact', 'files', 'terminal', 'music', 'settings']

// --- virtual filesystem helpers -------------------------------------------------
const ROOT = files
const findChild = (node, name) => (node.children || []).find(c => c.name.toLowerCase() === name.toLowerCase())

function resolve(cwd, raw) {
  if (!raw) return { path: cwd, node: walk(cwd) }
  if (raw === '~' || raw === '/') return { path: [], node: ROOT }
  const segs = raw.startsWith('/') ? raw.slice(1).split('/') : [...cwd]
  if (!raw.startsWith('/')) segs.push(...raw.split('/'))
  const out = []
  let node = ROOT
  for (const seg of segs.filter(Boolean)) {
    if (seg === '.') continue
    if (seg === '..') { out.pop(); node = walk(out); continue }
    const child = findChild(node, seg)
    if (!child) return { path: null, node: null }
    node = child
    out.push(child.name)
  }
  return { path: out, node }
}
function walk(path) { return path.reduce((n, seg) => findChild(n, seg) || n, ROOT) }
const dirOf = path => (path.length ? '~/' + path.join('/') : '~')

// --- command implementations -----------------------------------------------------
function buildCommands(ctx) {
  const { os, print, cwd, setCwd, cmdLogRef, exit } = ctx

  const help = () => {
    print('Commands')
    print('  help              this list')
    print('  about                       who I am')
    print('  projects [name]             portfolio projects')
    print('  contact                     how to reach me')
    print('  skills                      technical skills')
    print('  ls, cd, cat, pwd            browse the virtual file tree')
    print('  open <app>                  ' + APP_IDS.join(', '))
    print('  whoami, history, echo, date')
    print('  neofetch                    system summary')
    print('  clear                       clear the screen')
    print('  exit                        close this window')
    print('')
    print('Try: random', 'dim')
  }

  const about = () => {
    print(profile.name)
    print(profile.headline, 'dim')
    print(profile.school.name, 'dim')
    print('')
    profile.bio.forEach(l => print(l))
    print('')
    print(`Location: ${profile.location}`)
    print(`Concentration: ${profile.school.concentration} · Minor: ${profile.school.minor}`)
    print(`GPA: ${profile.school.gpa} · ${profile.school.honors.join(' · ')}`)
  }

  const listProjects = args => {
    const query = args.join(' ').toLowerCase()
    if (query) {
      const p = projects.find(p => p.id === query || p.title.toLowerCase() === query)
      if (!p) return print(`No project matches "${query}". Try "projects" with no argument.`, 'err')
      print(p.title)
      print(p.period, 'dim')
      p.description.forEach(l => print(l))
      print(`Tech: ${p.tech.join(', ')}`, 'dim')
      if (p.github) print(`GitHub: ${p.github}`, 'link')
      if (p.demo) print(`${p.demoLabel || 'Link'}: ${p.demo}`, 'link')
      return
    }
    projects.forEach(p => {
      print(`${p.title}${p.featured ? '  *' : ''}`)
      print(`  ${p.blurb}`, 'dim')
    })
    print('')
    print('projects <name>   for details', 'dim')
  }

  const contact = () => {
    print('Contact')
    print(`  Email     ${profile.links.email}`, 'link')
    print(`  GitHub    ${profile.links.github}`, 'link')
    print(`  LinkedIn  ${profile.links.linkedin}`, 'link')
    print(`  Phone     ${profile.links.other.phone}`)
  }

  const skills = () => {
    const s = profile.skills
    print('Languages & Frameworks', 'dim'); print('  ' + s.languages.join(', '))
    print('Cloud & Data', 'dim'); print('  ' + s.cloudAndData.join(', '))
    print('ML & AI', 'dim'); print('  ' + s.mlAndAi.join(', '))
    print('Tools', 'dim'); print('  ' + s.tools.join(', '))
  }

  const ls = args => {
    const target = args.join(' ')
    const { node } = resolve(cwd, target)
    if (!node) return print(`ls: ${target}: no such file or directory`, 'err')
    if (node.type !== 'folder') return print(node.name)
    const kids = node.children || []
    if (!kids.length) return print('(empty)', 'dim')
    print(kids.map(c => c.type === 'folder' ? `${c.name}/` : c.name).join('   '))
  }

  const cd = args => {
    const target = args.join(' ') || '/'
    const { path, node } = resolve(cwd, target)
    if (!node) return print(`cd: ${target}: no such file or directory`, 'err')
    if (node.type !== 'folder') return print(`cd: ${target}: not a directory`, 'err')
    setCwd(path)
  }

  const cat = args => {
    const target = args.join(' ')
    if (!target) return print('usage: cat <file>', 'err')
    const { node } = resolve(cwd, target)
    if (!node) return print(`cat: ${target}: no such file or directory`, 'err')
    if (node.type !== 'file') return print(`cat: ${target}: is a directory`, 'err')
    node.content.split('\n').forEach(l => print(l))
    if (node.opens) print(`\n[ open ${node.opens} ] to view this in its own window`, 'dim')
  }

  const pwd = () => print(dirOf(cwd))

  const openCmd = args => {
    const id = (args[0] || '').toLowerCase()
    if (!id) return print(`usage: open <app>\napps: ${APP_IDS.join(', ')}`, 'err')
    if (!APP_IDS.includes(id)) return print(`open: unknown app "${id}"\napps: ${APP_IDS.join(', ')}`, 'err')
    os.openApp(id)
    print(`opening ${id}...`, 'ok')
  }

  const whoami = () => print(os.userName || 'guest')

  const historyCmd = () => {
    const log = cmdLogRef.current
    if (!log.length) return print('(no history yet)', 'dim')
    log.forEach((c, i) => print(`  ${i + 1}  ${c}`))
  }

  const echo = args => print(args.join(' '))

  const date = () => print(new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
  }))

  const neofetch = () => {
    const art = ['   ___', '  /o o\\', ' |  ^  |', '  \\___/', '  /   \\']
    const info = [
      `shourya@os`,
      `------------`,
      `OS: ShouryaOS 2.0`,
      `Host: personal-website`,
      `Shell: shourya-sh`,
      `Uptime: ${Math.max(1, Math.round((Date.now() - ctx.bootTime) / 1000))}s`,
      `Concentration: ${profile.school.concentration} / ${profile.school.minor}`,
      `GPA: ${profile.school.gpa}`,
      `Skills: ${profile.skills.languages.slice(0, 5).join(', ')}...`,
    ]
    const rows = Math.max(art.length, info.length)
    for (let i = 0; i < rows; i++) print(`${(art[i] || '').padEnd(9)} ${info[i] || ''}`)
  }

  const clear = () => ctx.clearHistory()

  const QUOTES = [
    "I have no idea what I'm doing, but I know I'm doing it really well. - Andy Dwyer",
    'Every pizza is a personal pizza if you believe in yourself.',
    'The only thing we have to fear is running out of snacks.',
    'My code works and I have no idea why.',
    'Sleep is just a free trial of death.',
  ]
  const ART = [
    ['  /\\_/\\', ' ( o.o )', '  > ^ <'],
    ['  .--.', ' |o_o |', ' |:_/ |', '//   \\ \\'],
    ['   *', '  ***', ' *****', '  ***', '   *'],
  ]
  const random = () => {
    const r = Math.random()
    if (r < 0.25) return print(QUOTES[Math.floor(Math.random() * QUOTES.length)], 'ok')
    if (r < 0.5) return ART[Math.floor(Math.random() * ART.length)].forEach(l => print(l, 'ok'))
    if (r < 0.75) return print('sudo: shourya is not in the sudoers file. this incident will be reported.', 'err')
    print(`code: SHOURYA-${Math.random().toString(36).slice(2, 8).toUpperCase()} — found a secret. nice.`, 'ok')
  }

  return {
    help, about, projects: listProjects, contact, skills, ls, cd, cat, pwd,
    open: openCmd, whoami, history: historyCmd, echo, date, neofetch, clear,
    exit, random,
    resume: () => { os.openApp('resume'); print('opening resume...', 'ok') },
    files: () => { os.openApp('files'); print('opening files...', 'ok') },
    music: () => { os.openApp('music'); print('opening music...', 'ok') },
    settings: () => { os.openApp('settings'); print('opening settings...', 'ok') },
  }
}

const COMMAND_NAMES = ['help', 'about', 'projects', 'contact', 'skills', 'ls', 'cd', 'cat', 'pwd',
  'open', 'whoami', 'history', 'echo', 'date', 'neofetch', 'clear', 'exit', 'random',
  'resume', 'files', 'music', 'settings']

export default function Terminal({ windowId }) {
  const os = useOS()
  const sounds = useSounds()
  const [cwd, setCwd] = useState([])
  const [lines, setLines] = useState(() => [
    { id: 0, kind: 'ok', text: 'ShouryaOS terminal — type "help" to get started.' },
  ])
  const [input, setInput] = useState('')
  const [histIdx, setHistIdx] = useState(-1)
  const cmdLogRef = useRef([])
  const [bootTime] = useState(() => Date.now())
  const nextId = useRef(1)
  const outRef = useRef(null)
  const inputRef = useRef(null)

  const print = useCallback((text = '', kind = 'out') => {
    setLines(prev => [...prev, { id: nextId.current++, kind, text: String(text) }])
  }, [])
  const printPrompt = useCallback((prompt, cmd) => {
    setLines(prev => [...prev, { id: nextId.current++, kind: 'prompt', prompt, text: cmd }])
  }, [])
  const clearHistory = useCallback(() => setLines([]), [])
  const exit = useCallback(() => { sounds.close?.(); os.closeWindow(windowId) }, [os, windowId, sounds])

  useEffect(() => { outRef.current?.scrollTo(0, outRef.current.scrollHeight) }, [lines])

  // Built fresh per submit (an event handler, not render) so it is safe to
  // read cmdLogRef.current here.
  const run = useCallback(raw => {
    const trimmed = raw.trim()
    printPrompt(`shourya@os ${dirOf(cwd)} %`, raw)
    if (!trimmed) return
    cmdLogRef.current.push(trimmed)
    const ctx = { os, print, cwd, setCwd, cmdLogRef, bootTime, exit, clearHistory }
    const commands = buildCommands(ctx)
    const [cmd, ...args] = trimmed.split(/\s+/)
    const name = cmd.toLowerCase()
    const fn = commands[name]
    sounds.click?.()
    if (fn) fn(args)
    else print(`command not found: ${name} (try "help")`, 'err')
  }, [os, cwd, bootTime, exit, clearHistory, print, printPrompt, sounds])

  const onSubmit = e => {
    e.preventDefault()
    run(input)
    setInput('')
    setHistIdx(-1)
  }

  const onKeyDown = e => {
    const log = cmdLogRef.current
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!log.length) return
      const i = histIdx === -1 ? log.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(i); setInput(log[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const i = histIdx + 1
      if (i >= log.length) { setHistIdx(-1); setInput('') } else { setHistIdx(i); setInput(log[i]) }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [cmd, ...rest] = input.split(/\s+/)
      if (!rest.length && !input.endsWith(' ')) {
        const matches = COMMAND_NAMES.filter(c => c.startsWith(cmd.toLowerCase()))
        if (matches.length === 1) setInput(matches[0] + ' ')
        else if (matches.length > 1) print(matches.join('   '), 'dim')
        return
      }
      if (['cd', 'ls', 'cat'].includes(cmd?.toLowerCase())) {
        const prefix = rest.join(' ')
        const { node } = resolve(cwd, '')
        const kids = (node.children || []).filter(c => c.name.toLowerCase().startsWith(prefix.toLowerCase()))
        if (kids.length === 1) setInput(`${cmd} ${kids[0].name}`)
        else if (kids.length > 1) print(kids.map(c => c.name).join('   '), 'dim')
      } else if (cmd?.toLowerCase() === 'open') {
        const matches = APP_IDS.filter(a => a.startsWith((rest[0] || '').toLowerCase()))
        if (matches.length === 1) setInput(`open ${matches[0]}`)
        else if (matches.length > 1) print(matches.join('   '), 'dim')
      }
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term__out" ref={outRef}>
        {lines.map(l => l.kind === 'prompt' ? (
          <pre key={l.id} className="term__line term__line--prompt">
            <span className="term__promptTag">{l.prompt}</span> {l.text}
          </pre>
        ) : (
          <pre key={l.id} className={`term__line term__line--${l.kind}`}>{l.text}</pre>
        ))}
        <form className="term__row" onSubmit={onSubmit}>
          <span className="term__prompt">shourya@os {dirOf(cwd)} %</span>
          <input
            ref={inputRef}
            className="term__input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Terminal input"
          />
          <span className="term__caret" aria-hidden="true" />
        </form>
      </div>
    </div>
  )
}
