import { useState } from 'react'
import { Doc, DocHeader, Section, Prose, Rows, Row, Tags, Button, ButtonRow, Card } from '../ui'
import { projects } from '../content'

export default function Projects({ projectId }) {
  const [selectedId, setSelectedId] = useState(projectId ?? null)
  const [prevProjectId, setPrevProjectId] = useState(projectId)
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId)
    setSelectedId(projectId ?? null)
  }

  const selected = selectedId ? projects.find(p => p.id === selectedId) : null
  if (selected) return <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />
  return <ProjectList onSelect={setSelectedId} />
}

function ProjectList({ onSelect }) {
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)
  return (
    <Doc wide>
      <DocHeader eyebrow="Portfolio" title="Projects" lede="A running list of things I've built, from hackathon winners to full-stack platforms." />
      <Section title="Featured">
        <div className="grid-cards">
          {featured.map(p => (
            <Card key={p.id} title={p.title} accent={p.accent} onClick={() => onSelect(p.id)}>
              <p>{p.blurb}</p>
              <p className="dim">{p.period}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="More projects">
        <Rows>
          {rest.map(p => (
            <Row key={p.id} title={p.title} sub={p.blurb} meta={p.period} onClick={() => onSelect(p.id)} />
          ))}
        </Rows>
      </Section>
    </Doc>
  )
}

function ProjectDetail({ project, onBack }) {
  return (
    <Doc>
      <ButtonRow>
        <Button variant="quiet" onClick={onBack}>← All projects</Button>
      </ButtonRow>
      <DocHeader eyebrow={project.period} title={project.title} />
      <Prose>
        {project.description.map((p, i) => <p key={i}>{p}</p>)}
      </Prose>
      <Tags items={project.tech} />
      <ButtonRow>
        {project.github && <Button href={project.github}>GitHub</Button>}
        {project.demo && <Button variant="primary" href={project.demo}>{project.demoLabel || 'Demo'}</Button>}
      </ButtonRow>
    </Doc>
  )
}
