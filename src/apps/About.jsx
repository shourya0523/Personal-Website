import { Doc, DocHeader, Section, Prose, Kv, Tags, ButtonRow, Button } from '../ui'
import { useOS } from '../os/OSContext'
import { profile } from '../content'
import './About.css'

const skillLabels = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  cloudAndData: 'Cloud & Data',
  mlAndAi: 'ML & AI',
  tools: 'Tools',
}

export default function About() {
  const { openApp } = useOS()
  const bio = profile.bio.filter(p => p !== profile.tagline)
  const skillItems = Object.entries(profile.skills)
    .filter(([, list]) => list && list.length)
    .map(([key, list]) => [skillLabels[key] || key, <Tags key={key} items={list} />])

  return (
    <Doc>
      <div className="about-head">
        <img className="about-portrait" src="/profile-picture.png" alt={profile.name} />
        <DocHeader eyebrow={profile.headline} title={profile.name} lede={profile.tagline} />
      </div>
      <Prose>
        {bio.map((p, i) => <p key={i}>{p}</p>)}
      </Prose>
      <Section title="Skills">
        <Kv items={skillItems} />
      </Section>
      <Section title="Interests">
        <Tags items={profile.interests} />
      </Section>
      <ButtonRow>
        <Button variant="primary" onClick={() => openApp('contact', { source: 'about' })}>Get in touch</Button>
        <Button onClick={() => openApp('resume', { source: 'about' })}>Resume</Button>
      </ButtonRow>
    </Doc>
  )
}
