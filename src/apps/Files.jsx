import { useEffect, useState } from 'react'
import { Split, SideGroup, SideItem, Rows, Row, Empty, Button, ButtonRow, AppIcon } from '../ui'
import { useOS } from '../os/OSContext'
import { files, projects } from '../content'
import './Files.css'

function kindGlyph(kind) {
  if (kind === 'md' || kind === 'txt' || kind === 'json' || kind === 'pdf' || kind === 'link') return kind
  return 'doc'
}

function resolvePath(path) {
  let node = files
  const valid = []
  for (const seg of path) {
    const next = node.children?.find(c => c.name === seg && c.type === 'folder')
    if (!next) break
    node = next
    valid.push(seg)
  }
  return { node, path: valid }
}

function matchProjectId(folderName) {
  if (!folderName) return null
  const lower = folderName.toLowerCase()
  const hit = projects.find(p => p.title.toLowerCase() === lower)
  return hit ? hit.id : null
}

// Tiny markdown-ish renderer: #/##/### headings, "- " bullets, paragraphs, **bold**.
function toBlocks(text) {
  const blocks = []
  let list = null
  let para = []
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = [] } }
  const flushList = () => { if (list) { blocks.push(list); list = null } }
  for (const raw of (text || '').split('\n')) {
    const line = raw.trim()
    if (!line) { flushPara(); flushList(); continue }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) { flushPara(); flushList(); blocks.push({ type: `h${Math.min(h[1].length, 3)}`, text: h[2] }); continue }
    const b = line.match(/^[-*]\s+(.*)$/)
    if (b) { flushPara(); if (!list) list = { type: 'ul', items: [] }; list.items.push(b[1]); continue }
    flushList(); para.push(line)
  }
  flushPara(); flushList()
  return blocks
}
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  ))
}
function MarkdownPreview({ text }) {
  return <div className="finder-preview-body">
    {toBlocks(text).map((b, i) => {
      if (b.type === 'ul') return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>
      if (b.type === 'h1') return <h1 key={i}>{inline(b.text)}</h1>
      if (b.type === 'h2') return <h2 key={i}>{inline(b.text)}</h2>
      if (b.type === 'h3') return <h3 key={i}>{inline(b.text)}</h3>
      return <p key={i}>{inline(b.text)}</p>
    })}
  </div>
}

export default function Files({ windowId, path: initialPath }) {
  const os = useOS()
  const [path, setPath] = useState(initialPath || [])
  const [selectedFile, setSelectedFile] = useState(null)
  const [prevInitialPath, setPrevInitialPath] = useState(initialPath)
  if (initialPath !== prevInitialPath) {
    setPrevInitialPath(initialPath)
    setPath(initialPath || [])
    setSelectedFile(null)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== 'Backspace' || os.focusId !== windowId) return
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      e.preventDefault()
      if (selectedFile) setSelectedFile(null)
      else setPath(p => p.slice(0, -1))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [os.focusId, windowId, selectedFile])

  const { node, path: resolvedPath } = resolvePath(path)
  const go = (p) => { setPath(p); setSelectedFile(null) }
  const items = [...(node.children || [])].sort((a, b) => (a.type === b.type ? 0 : a.type === 'folder' ? -1 : 1))

  const handleOpenIn = () => {
    const projectId = matchProjectId(node.name)
    os.openApp(selectedFile.opens, projectId ? { props: { projectId } } : undefined)
  }

  return (
    <Split side={<>
      <SideGroup>Places</SideGroup>
      {files.children.map(f => (
        <SideItem key={f.name} icon="folder" active={resolvedPath[0] === f.name} onClick={() => go([f.name])}>{f.name}</SideItem>
      ))}
    </>}>
      <div className="finder">
        <div className="finder-crumbs">
          <button type="button" className="finder-crumb" onClick={() => go([])}>Files</button>
          {resolvedPath.map((seg, i) => (
            <span key={seg}>
              <span className="finder-crumb-sep">/</span>
              <button type="button" className="finder-crumb" onClick={() => go(resolvedPath.slice(0, i + 1))}>{seg}</button>
            </span>
          ))}
        </div>

        {!(os.isMobile && selectedFile) && (
          <div className="finder-list">
            {items.length === 0 ? <Empty>Empty folder</Empty> : (
              <Rows>
                {items.map(item => (
                  <Row key={item.name}
                    title={<span className="finder-item-title"><AppIcon flat size={16} name={item.type === 'folder' ? 'folder' : kindGlyph(item.kind)} />{item.name}</span>}
                    meta={item.type === 'folder' ? `${(item.children || []).length} item${(item.children || []).length === 1 ? '' : 's'}` : item.kind}
                    onClick={() => item.type === 'folder' ? go([...resolvedPath, item.name]) : setSelectedFile(item)}
                  />
                ))}
              </Rows>
            )}
          </div>
        )}

        {selectedFile && (
          <div className="finder-preview">
            {os.isMobile && <Button variant="quiet" size="sm" onClick={() => setSelectedFile(null)}>← Back to list</Button>}
            <div className="finder-preview-name">{selectedFile.name}</div>
            <MarkdownPreview text={selectedFile.content} />
            {selectedFile.opens && (
              <ButtonRow>
                <Button variant="primary" onClick={handleOpenIn}>Open in {os.appById[selectedFile.opens]?.label || selectedFile.opens}</Button>
              </ButtonRow>
            )}
          </div>
        )}
      </div>
    </Split>
  )
}
