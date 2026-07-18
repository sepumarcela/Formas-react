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
                  <p>{post.desc}</p>
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
