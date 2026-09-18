import { useMemo, useState } from 'react'
import { AnimatePresence, /* eslint-disable-line no-unused-vars */ motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, BookOpenText, CalendarDays, Clock3, Sparkles } from 'lucide-react'
import ClickSpark from '../components/ClickSpark'
import GlassSurface from '../components/GlassSurface'
import ReflectiveCard from '../components/ReflectiveCard/ReflectiveCard'
import { blogPosts, blogTags } from '../data/blogPosts'
import './Blog.css'

const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(`${date}T12:00:00`))

const inlineMarkdown = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g

function InlineMarkdown({ text }) {
  const nodes = []
  let lastIndex = 0

  for (const match of text.matchAll(inlineMarkdown)) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))

    if (match[2]) {
      nodes.push(
        <a key={`${match[3]}-${match.index}`} href={match[3]} target="_blank" rel="noopener noreferrer">
          <InlineMarkdown text={match[2]} />
        </a>,
      )
    } else if (match[4]) {
      nodes.push(<strong key={match.index}>{match[4]}</strong>)
    } else {
      nodes.push(<em key={match.index}>{match[5]}</em>)
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function MarkdownBody({ markdown }) {
  return markdown.split(/\n{2,}/).map((block, index) => {
    if (block.startsWith('## ')) return <h2 key={block}>{block.slice(3)}</h2>

    const lines = block.split('\n')
    if (lines.every(line => /^\s*\* /.test(line))) {
      const items = []
      lines.forEach(line => {
        const nested = line.startsWith('  * ')
        const text = line.replace(/^\s*\* /, '')
        if (nested && items.length) {
          items[items.length - 1].children.push(text)
        } else {
          items.push({ text, children: [] })
        }
      })

      return (
        <ul key={`list-${index}`}>
          {items.map(item => (
            <li key={item.text}>
              <InlineMarkdown text={item.text} />
              {item.children.length > 0 && (
                <ul>
                  {item.children.map(child => <li key={child}><InlineMarkdown text={child} /></li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )
    }

    return <p key={`paragraph-${index}`}><InlineMarkdown text={block} /></p>
  })
}

export default function Blog() {
  const [activeTag, setActiveTag] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)

  const posts = useMemo(
    () => activeTag === 'All' ? blogPosts : blogPosts.filter(post => post.tags.includes(activeTag)),
    [activeTag],
  )

  return (
    <div className="blog-app">
      <div className="blog-app__noise" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {selectedPost ? (
          <Article post={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <BlogIndex
            activeTag={activeTag}
            posts={posts}
            onTagChange={setActiveTag}
            onOpenPost={setSelectedPost}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function BlogIndex({ activeTag, posts, onTagChange, onOpenPost }) {
  const featured = blogPosts[0]

  return (
    <motion.main
      key="blog-index"
      className="blog-app__content"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <header className="blog-app__header">
        <div>
          <p className="blog-app__eyebrow"><Sparkles size={13} /> SHOURYA.LOG</p>
          <h1>Field notes from the build.</h1>
          <p className="blog-app__subhead">AI, healthcare, finance, and the messy middle of making things.</p>
        </div>
        <GlassSurface width="auto" height="auto" borderRadius={20} className="blog-app__status">
          <span className="blog-app__status-dot" />
          {blogPosts.length} transmissions archived
        </GlassSurface>
      </header>

      {featured ? (
        <section className="blog-app__featured blog-app__featured--single" aria-label="Featured post">
          <div className="blog-app__section-label">
            <span>NOW READING</span>
            <span className="blog-app__line" />
          </div>
          <ClickSpark className="blog-app__featured-spark" sparkColor={featured.accent} sparkSize={8} sparkRadius={22} sparkCount={6} duration={350}>
            <button className="blog-app__featured-button" onClick={() => onOpenPost(featured)}>
              <PostCard post={featured} compact reflective />
            </button>
          </ClickSpark>
        </section>
      ) : <EmptyArchive />}

      <nav className="blog-app__filters" aria-label="Filter posts">
        {blogTags.map(tag => (
          <button
            key={tag}
            className={activeTag === tag ? 'is-active' : ''}
            onClick={() => onTagChange(tag)}
          >
            {tag}
          </button>
        ))}
      </nav>

      <section className="blog-app__grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: index * 0.045 }}
            >
              <ClickSpark className="blog-app__post-spark" sparkColor={post.accent} sparkSize={8} sparkRadius={22} sparkCount={6} duration={350}>
                <button className="blog-app__post-button" onClick={() => onOpenPost(post)}>
                  <PostCard post={post} />
                </button>
              </ClickSpark>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>
    </motion.main>
  )
}

function EmptyArchive() {
  return (
    <section className="blog-empty" aria-label="Empty blog archive">
      <div className="blog-empty__orb blog-empty__orb--one" />
      <div className="blog-empty__orb blog-empty__orb--two" />
      <GlassSurface width="100%" height="auto" borderRadius={24} className="blog-empty__glass">
        <BookOpenText size={30} />
        <p className="blog-app__eyebrow">ARCHIVE / STANDBY</p>
        <h2>The page is ready.<br />The thoughts are still loading.</h2>
        <p>New field notes will surface here when they are worth keeping.</p>
      </GlassSurface>
    </section>
  )
}

function PostCard({ post, compact = false, reflective = false }) {
  const card = (
    <div className={`blog-post-card ${compact ? 'blog-post-card--compact' : ''}`} style={{ '--post-accent': post.accent }}>
      <div className="blog-post-card__glow" aria-hidden="true" />
      <div className="blog-post-card__topline">
        <span>{post.tags[0]}</span>
        <ArrowUpRight size={17} />
      </div>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <footer>
        <span><CalendarDays size={13} /> {formatDate(post.date)}</span>
        <span><Clock3 size={13} /> {post.readTime}</span>
      </footer>
    </div>
  )

  return reflective ? (
    <ReflectiveCard
      className="blog-post-card__reflective"
      color="#f5f3ff"
      overlayColor="rgba(15, 23, 42, 0.62)"
      roughness={0.22}
    >
      {card}
    </ReflectiveCard>
  ) : card
}

function Article({ post, onBack }) {
  return (
    <motion.article
      key={post.id}
      className="blog-article"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="blog-article__chrome">
        <button onClick={onBack} className="blog-article__back"><ArrowLeft size={17} /> Library</button>
        <span><BookOpenText size={15} /> reading mode</span>
      </div>
      <GlassSurface width="100%" height="auto" borderRadius={26} className="blog-article__glass">
        <div className="blog-article__inner" style={{ '--post-accent': post.accent }}>
          <div className="blog-article__meta">
            <span>{post.tags.join(' · ')}</span>
            <span>{formatDate(post.date)} · {post.readTime}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="blog-article__deck">{post.excerpt}</p>
          <div className="blog-article__rule" />
          <MarkdownBody markdown={post.bodyMarkdown} />
          <footer>— Shourya</footer>
        </div>
      </GlassSurface>
    </motion.article>
  )
}
