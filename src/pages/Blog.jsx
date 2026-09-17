import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, BookOpenText, CalendarDays, Clock3, Sparkles } from 'lucide-react'
import CardSwap, { Card } from '../components/CardSwap/CardSwap'
import ClickSpark from '../components/ClickSpark'
import GlassSurface from '../components/GlassSurface'
import LiquidEther from '../components/LiquidEther/LiquidEther'
import { blogPosts, blogTags } from '../data/blogPosts'
import './Blog.css'

const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(`${date}T12:00:00`))

export default function Blog() {
  const [activeTag, setActiveTag] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)

  const posts = useMemo(
    () => activeTag === 'All' ? blogPosts : blogPosts.filter(post => post.tags.includes(activeTag)),
    [activeTag],
  )

  return (
    <div className="blog-app">
      <LiquidEther
        className="blog-app__ether"
        colors={['#1d4ed8', '#7c3aed', '#ec4899']}
        resolution={0.35}
        mouseForce={14}
        cursorSize={70}
        autoIntensity={1.4}
      />
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
  const featured = blogPosts.slice(0, 3)

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

      {featured.length > 0 ? (
        <section className="blog-app__featured" aria-label="Featured posts">
          <div className="blog-app__section-label">
            <span>NOW READING</span>
            <span className="blog-app__line" />
          </div>
          <div className="blog-app__swap-wrap">
            <CardSwap width={330} height={208} cardDistance={23} verticalDistance={14} delay={6500} pauseOnHover easing="power1">
              {featured.map((post) => (
                <Card key={post.id} className="blog-app__swap-card" onClick={() => onOpenPost(post)}>
                  <PostCard post={post} compact />
                </Card>
              ))}
            </CardSwap>
          </div>
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
              <ClickSpark sparkColor={post.accent} sparkSize={8} sparkRadius={22} sparkCount={6} duration={350}>
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

function PostCard({ post, compact = false }) {
  return (
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
          {post.body.map((section, index) => (
            <motion.section
              key={section.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
            >
              <h2>{section.heading}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </motion.section>
          ))}
          <footer>— Shourya</footer>
        </div>
      </GlassSurface>
    </motion.article>
  )
}
