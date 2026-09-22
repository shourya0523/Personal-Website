import { useCallback, useState } from 'react'
import { Doc, DocHeader, Section, Row, Rows, Kv, Tags, Split, SideItem, ButtonRow, Button } from '../ui'
import { useOS } from '../os/OSContext'
import { profile, resume } from '../content'

const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'awards', label: 'Awards' },
  { id: 'skills', label: 'Skills' },
]

const skillLabels = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  cloudAndData: 'Cloud & Data',
  mlAndAi: 'ML & AI',
  tools: 'Tools',
}

export default function Resume() {
  const { openApp } = useOS()
  const [active, setActive] = useState('experience')

  const goto = useCallback((id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const skillItems = Object.entries(profile.skills)
    .filter(([, list]) => list && list.length)
    .map(([key, list]) => [skillLabels[key] || key, <Tags key={key} items={list} />])

  return (
    <Split side={sections.map(s => (
      <SideItem key={s.id} active={active === s.id} onClick={() => goto(s.id)}>{s.label}</SideItem>
    ))}>
      <Doc>
        <DocHeader title="Resume" lede={`${profile.school.degree} · ${profile.school.name} · Expected ${profile.school.expectedGraduation}`} />
        <Section title="Experience" id="experience">
          <Rows>
            {resume.experience.map((e, i) => (
              <Row key={i} title={e.role} sub={`${e.org} · ${e.location}`} meta={e.period}>
                <ul>{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              </Row>
            ))}
          </Rows>
        </Section>
        <Section title="Education" id="education">
          <Rows>
            {resume.education.map((ed, i) => (
              <Row key={i} title={ed.degree} sub={ed.school} meta={ed.period}>
                <ul>{ed.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
              </Row>
            ))}
          </Rows>
        </Section>
        <Section title="Leadership" id="leadership">
          <Rows>
            {resume.leadership.map((l, i) => (
              <Row key={i} title={l.role} sub={`${l.org} · ${l.location}`} meta={l.period}>
                <ul>{l.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              </Row>
            ))}
          </Rows>
        </Section>
        <Section title="Awards" id="awards">
          <Rows>
            {resume.awards.map((a, i) => (
              <Row key={i} title={a.title} sub={a.org} meta={a.year}>
                <p>{a.description}</p>
              </Row>
            ))}
          </Rows>
        </Section>
        <Section title="Skills" id="skills">
          <Kv items={skillItems} />
        </Section>
        <ButtonRow>
          <Button variant="primary" onClick={() => openApp('contact')}>Get in touch</Button>
        </ButtonRow>
      </Doc>
    </Split>
  )
}
