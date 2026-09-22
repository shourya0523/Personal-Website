import { useState } from 'react'
import { Doc, DocHeader, Rows, Row, ButtonRow, Button } from '../ui'
import { profile } from '../content'

const stripProtocol = (url) => url.replace(/^https?:\/\//, '')

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const email = profile.links.email

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable in this context; silently ignore
    }
  }

  return (
    <Doc>
      <DocHeader title="Contact" lede={`Based in ${profile.location}.`} />
      <Rows>
        <Row title="Email" sub={email} meta="↗" href={`mailto:${email}`} />
        <Row title="GitHub" sub={stripProtocol(profile.links.github)} meta="↗" href={profile.links.github} />
        <Row title="LinkedIn" sub={stripProtocol(profile.links.linkedin)} meta="↗" href={profile.links.linkedin} />
      </Rows>
      <ButtonRow>
        <Button variant="primary" href={`mailto:${email}`}>Email me</Button>
        <Button onClick={copyEmail}>{copied ? 'Copied' : 'Copy email'}</Button>
      </ButtonRow>
    </Doc>
  )
}
