import { useEffect, useState } from 'react'
import { Doc, DocHeader, Section, Toggle, Field, Kv } from '../ui'
import { useOS } from '../os/OSContext'
import { sceneList } from '../wallpapers'
import './Settings.css'

const descriptions = {
  swell: 'A woodblock sea at dusk. Ripples answer clicks and drags.',
  survey: 'A topographic map. The cursor is a survey lamp; clicks plant flags.',
  circuit: 'A star chart of projects wired as circuits. Click a constellation to open it.',
}

export default function Settings() {
  const { wallpaper, setWallpaper, settings, setSetting, userName, setUserName } = useOS()
  const [name, setName] = useState(userName)
  useEffect(() => { setName(userName) }, [userName])

  const commitName = () => { if (name.trim() !== userName) setUserName(name.trim()) }

  return (
    <Doc>
      <DocHeader title="Settings" />

      <Section title="Wallpaper">
        <div className="grid-cards">
          {sceneList.map(scene => {
            const active = wallpaper === scene.id
            return (
              <button key={scene.id} type="button" className={`card card--link settings-wp ${active ? 'settings-wp--active' : ''}`}
                aria-pressed={active} onClick={() => setWallpaper(scene.id)}>
                <h3>{scene.label}</h3>
                <p>{descriptions[scene.id]}</p>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Sound & motion">
        <Toggle label="Sounds" checked={settings.sound} onChange={v => setSetting('sound', v)} />
        <Toggle label="Effects" hint="Liquid glass chrome and wallpaper motion" checked={settings.effects} onChange={v => setSetting('effects', v)} />
      </Section>

      <Section title="You">
        <Field label="Name" id="settings-name">
          <input id="settings-name" className="input" value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') { commitName(); e.currentTarget.blur() } }} />
        </Field>
      </Section>

      <Section title="About this OS">
        <Kv items={[
          ['Version', '2.0'],
          ['Type', 'Erode · Chillax · Sono'],
          ['Glass', 'ybouane/liquidglass'],
          ['Source', <a key="source" href="https://github.com/shourya0523/personal-website" target="_blank" rel="noreferrer">github.com/shourya0523/personal-website</a>],
        ]} />
      </Section>
    </Doc>
  )
}
