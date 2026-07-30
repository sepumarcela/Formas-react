import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, Eye } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage, preloadImage } from '../utils/images'

function BlogHeroImage({ post }) {
  const imageSrc = post.image ? optimizeImage(post.image, { width: 1100 }) : ''

  useEffect(() => {
    preloadImage(imageSrc)
  }, [imageSrc])

  return post.image ? (
    <img src={imageSrc} alt={post.title} loading="eager" decoding="async" fetchPriority="high" />
  ) : (
    <div className="blog-ph">Foto pendiente</div>
  )
}

function BlogPostLink({ post, className, children }) {
  return (
    <Link className={className} to={`/blog/${post.id}`}>
      {children}
    </Link>
  )
}

function safeLink(url) {
  const value = String(url || '').trim()
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value) ? value : '#'
}

function inlineMarkdown(text, keyPrefix) {
  const source = String(text || '')
  const pattern = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\))/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) parts.push(source.slice(lastIndex, match.index))
    if (match[2]) parts.push(<code key={`${keyPrefix}-code-${match.index}`}>{match[2]}</code>)
    else if (match[4] || match[6]) parts.push(<strong key={`${keyPrefix}-strong-${match.index}`}>{match[4] || match[6]}</strong>)
    else if (match[8] || match[10]) parts.push(<em key={`${keyPrefix}-em-${match.index}`}>{match[8] || match[10]}</em>)
    else if (match[12] && match[13]) {
      const href = safeLink(match[13])
      const external = /^https?:\/\//i.test(href)
      parts.push(<a href={href} key={`${keyPrefix}-link-${match.index}`} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{match[12]}</a>)
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < source.length) parts.push(source.slice(lastIndex))
  return parts.length ? parts : source
}

function articleBlocks(post) {
  const lines = String(post.body || post.desc || '').split(/\r?\n/)
  const blocks = []
  let paragraph = []
  let listItems = []
  let listType = null
  const flushParagraph = () => {
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim()
    if (text) blocks.push({ type: 'paragraph', text })
    paragraph = []
  }
  const flushList = () => {
    if (listItems.length) blocks.push({ type: listType, items: listItems })
    listItems = []
    listType = null
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) {
      flushParagraph()
      flushList()
      return
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      return
    }
    const unordered = line.match(/^[-*+]\s+(.+)$/)
    const ordered = line.match(/^\d+[.)]\s+(.+)$/)
    if (unordered || ordered) {
      flushParagraph()
      const nextType = ordered ? 'ol' : 'ul'
      if (listType && listType !== nextType) flushList()
      listType = nextType
      listItems.push((unordered || ordered)[1])
      return
    }
    const quote = line.match(/^>\s?(.+)$/)
    if (quote) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'quote', text: quote[1] })
      return
    }
    if (/^([-*_])\1{2,}$/.test(line)) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'divider' })
      return
    }
    flushList()
    paragraph.push(line)
  })
  flushParagraph()
  flushList()
  return blocks.map((block, index) => ({ ...block, id: `section-${index + 1}` }))
}

function ArticleBlock({ block }) {
  const content = block.text ? inlineMarkdown(block.text, block.id) : null
  if (block.type === 'heading') {
    const Heading = block.level >= 3 ? 'h3' : 'h2'
    return <Heading id={block.id}>{content}</Heading>
  }
  if (block.type === 'ul' || block.type === 'ol') {
    const List = block.type
    return <List>{block.items.map((item, index) => <li key={`${block.id}-${index}`}>{inlineMarkdown(item, `${block.id}-${index}`)}</li>)}</List>
  }
  if (block.type === 'quote') return <blockquote>{content}</blockquote>
  if (block.type === 'divider') return <hr />
  return <p>{content}</p>
}

function sidebarHeadingText(text) {
  return text.replace(/^\d+\.\s*/, '')
}

function sourceUrlsFrom(post) {
  return (post.originalUrl || '')
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean)
}

function sourceLinkLabel(url, index) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return `Fuente ${index + 1}`
  }
}

function BlogPostDetail() {
  const { postId } = useParams()
  const [{ blogPosts }] = useSiteContent()
  const post = blogPosts.find((item) => item.id === postId && item.active !== false)
  const relatedPosts = blogPosts.filter((item) => item.id !== postId && item.active !== false).slice(0, 2)

  if (!post) {
    return (
      <main className="page blog-post-page">
        <section className="blog-post-not-found">
          <p className="admin-kicker">Blog</p>
          <h1>Artículo no encontrado</h1>
          <Link to="/blog" className="button button--primary">Volver al blog</Link>
        </section>
      </main>
    )
  }

  const blocks = articleBlocks(post)
  const headings = blocks.filter((block) => block.type === 'heading').slice(0, 6)
  const sourceUrls = sourceUrlsFrom(post)

  return (
    <main className="page blog-post-page">
      <section className="blog-post-hero">
        <div className="blog-post-hero__content">
          <div className="blog-post-hero__eyebrow">
            <Link to="/blog" className="blog-post-back"><ArrowLeft size={16} /> Volver al blog</Link>
            <div className="blog-post-meta">
              {post.date && <time><CalendarDays size={13} /> {post.date}</time>}
              <span><Clock size={13} /> 5 min de lectura</span>
              <span><Eye size={13} /> Blog Formas Interiores</span>
            </div>
          </div>
          <h1>{post.title}</h1>
          {post.desc && <p>{post.desc}</p>}
        </div>
        <div className="blog-post-hero__media">
          <BlogHeroImage post={post} />
        </div>
      </section>

      <section className="blog-post-content-section">
        <article className="blog-post-article">
          {blocks.length ? blocks.map((block) => (
            <ArticleBlock block={block} key={block.id} />
          )) : (
            <p>Muy pronto ampliaremos este artículo con más inspiración, recomendaciones y detalles para tu proyecto.</p>
          )}

          {sourceUrls.length > 0 && (
            <div className="blog-post-source">
              <span>{sourceUrls.length === 1 ? 'Fuente original' : 'Fuentes originales'}</span>
              <div className="blog-post-source__links">
                {sourceUrls.map((url, index) => (
                  <a href={url} target="_blank" rel="noreferrer" key={`${url}-${index}`}>
                    {sourceLinkLabel(url, index)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="blog-post-sidebar">
          {relatedPosts.length > 0 && (
            <div className="blog-post-sidebar__box">
              <h3>Te recomendamos</h3>
              {relatedPosts.map((item) => (
                <BlogPostLink post={item} className="blog-post-sidebar__item" key={item.id}>
                  {item.image ? <img src={optimizeImage(item.image, { width: 220 })} alt="" loading="lazy" /> : <div className="blog-ph" />}
                  {item.trending && <span>Tendencia</span>}
                  <strong>{item.title}</strong>
                </BlogPostLink>
              ))}
            </div>
          )}

          {headings.length > 0 && (
            <div className="blog-post-sidebar__box blog-post-sidebar__box--outline">
              <h3>En este artículo</h3>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id}><a href={`#${heading.id}`}>{sidebarHeadingText(heading.text)}</a></li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

export default BlogPostDetail

