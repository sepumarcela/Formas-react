import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/sections/PageHero'
import { subscribeNewsletter } from '../api/cmsApi'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'

function BlogPostLink({ post, className, children }) {
  return (
    <Link className={className} to={`/blog/${post.id}`}>
      {children}
    </Link>
  )
}

function renderCardMarkdown(text, keyPrefix) {
  const source = String(text || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  const pattern = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) parts.push(source.slice(lastIndex, match.index))
    if (match[2]) parts.push(<code key={`${keyPrefix}-code-${match.index}`}>{match[2]}</code>)
    else if (match[4] || match[6]) parts.push(<strong key={`${keyPrefix}-strong-${match.index}`}>{match[4] || match[6]}</strong>)
    else if (match[8] || match[10]) parts.push(<em key={`${keyPrefix}-em-${match.index}`}>{match[8] || match[10]}</em>)
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < source.length) parts.push(source.slice(lastIndex))
  return parts.length ? parts : source
}

function blogCardSummary(post) {
  const lines = String(post.desc || '').split(/\r?\n/)
  const firstContentLine = lines.findIndex((line) => line.trim())

  if (firstContentLine >= 0 && /^#{1,4}\s+/.test(lines[firstContentLine].trim())) {
    lines.splice(firstContentLine, 1)
  }

  const summary = lines.join(' ').replace(/\s+/g, ' ').trim()
  return renderCardMarkdown(summary, `blog-card-${post.id}`)
}

function Blog() {
  const [{ blogPosts, pageContent }] = useSiteContent()
  const page = pageContent.blog
  const activePosts = blogPosts.filter((post) => post.active !== false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  async function handleNewsletterSubmit(event) {
    event.preventDefault()
    setSubscribing(true)
    setNewsletterMessage('')

    try {
      await subscribeNewsletter(newsletterEmail)
      setNewsletterEmail('')
      setNewsletterMessage('Gracias por suscribirte. Pronto recibirás inspiración, novedades y contenido de Formas Interiores en tu correo.')
    } catch {
      setNewsletterMessage('No se pudo guardar el correo. Inténtalo de nuevo.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Blog" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="blog-layout">
          <div className="blog-grid">
            {activePosts.map((post) => (
              <BlogPostLink className="blog-card" post={post} key={post.id}>
                <div className="blog-card__img">
                  {post.trending && <span className="blog-card__tag">Tendencia</span>}
                  {post.image ? <img src={optimizeImage(post.image, { width: 1000 })} alt={post.title} loading="lazy" /> : <div className="blog-ph">Foto pendiente</div>}
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__date">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{blogCardSummary(post)}</p>
                  <span className="blog-card__more">Leer mas &rarr;</span>
                </div>
              </BlogPostLink>
            ))}
          </div>

          <aside className="blog-sidebar">
            <div className="blog-sidebar__box">
              <h4>{page.sidebarTitle}</h4>
              {activePosts.slice(0, 3).map((post) => (
                <BlogPostLink className="blog-sidebar__art" post={post} key={post.id}>
                  {post.image ? <img className="blog-sidebar__ph" src={optimizeImage(post.image, { width: 360 })} alt="" loading="lazy" /> : <div className="blog-sidebar__ph" />}
                  <div>
                    <div className="blog-sidebar__title">{post.title}</div>
                    <div className="blog-sidebar__date">{post.date}</div>
                  </div>
                </BlogPostLink>
              ))}
            </div>
            <div className="blog-sidebar__cta">
              <h4>{page.ctaTitle}</h4>
              <p>{page.ctaText}</p>
              <Link to="/contacto" className="button button--primary" style={{ width: '100%' }}>Cotizar ahora &rarr;</Link>
            </div>
            <form className="blog-sidebar__box" onSubmit={handleNewsletterSubmit}>
              <h4>Recibe inspiración en tu correo</h4>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="blog-newsletter-input"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
              />
              <button className="button button--primary" style={{ width: '100%' }} disabled={subscribing}>
                {subscribing ? 'Guardando...' : 'Suscribirme'}
              </button>
              {newsletterMessage && <p className="blog-newsletter-message">{newsletterMessage}</p>}
            </form>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Blog
