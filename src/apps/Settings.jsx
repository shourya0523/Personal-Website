import { useEffect, useState } from 'react'
import { Doc, DocHeader, Section, Toggle, Field, Kv, AppIcon } from '../ui'
import { USER_TYPES } from '../analytics'
import { useOS } from '../os/OSContext'
import { sceneList } from '../wallpapers'
import './Settings.css'

const descriptions = {
  swell: 'A woodblock sea at dusk. Ripples answer clicks and drags.',
  survey: 'A topographic map. The cursor is a survey lamp; clicks plant flags.',
  circuit: 'A star chart of projects wired as circuits. Click a constellation to open it.',
}

export default function Settings() {
  const { wallpaper, setWallpaper, settings, setSetting, userName, setUserName, userType, setUserType } = useOS()
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
        <Toggle label="Effects" hint="Liquid glass and wallpaper motion" checked={settings.effects} onChange={v => setSetting('effects', v)} />
        <Toggle label="Glass on windows" hint="Real refraction on every window and menu, not only the dock and menu bar. Turns itself off if the frame rate drops." checked={settings.glass !== 'chrome'} onChange={v => setSetting('glass', v ? 'full' : 'chrome')} />
      </Section>

      <Section title="You">
        <div className="field"><label>I'm visiting as</label>
          <div className="settings__types" role="group" aria-label="Visitor type">
            {USER_TYPES.map(t => <button key={t.id} type="button" className="settings__type" aria-pressed={userType === t.id} onClick={() => setUserType(t.id)}><AppIcon name={t.glyph} flat size={16} /><span>{t.label}</span></button>)}
          </div>
        </div>
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
