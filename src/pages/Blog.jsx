import { Link } from 'react-router-dom'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'

function Blog() {
  const [{ blogPosts, pageContent }] = useSiteContent()
  const page = pageContent.blog
  const categories = ['Todos', ...Array.from(new Set(blogPosts.map((post) => post.tag).filter(Boolean)))]

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Blog" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="blog-cats">
          <span className="blog-cats__label">Categorías:</span>
          {categories.map((category, index) => (
            <button key={category} className={`blog-cat-btn ${index === 0 ? 'active' : ''}`}>{category}</button>
          ))}
        </div>

        <div className="blog-layout">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-card__img">
                  <span className="blog-card__tag">{post.tag}</span>
                  {post.image ? <img src={post.image} alt={post.title} /> : <div className="blog-ph">Foto pendiente</div>}
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__date">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <a href="#" className="blog-card__more">Leer más &rarr;</a>
                </div>
              </article>
            ))}
          </div>

          <aside className="blog-sidebar">
            <div className="blog-sidebar__box">
              <h4>{page.sidebarTitle}</h4>
              {blogPosts.slice(0, 3).map((post) => (
                <div className="blog-sidebar__art" key={post.id}>
                  {post.image ? <img className="blog-sidebar__ph" src={post.image} alt="" /> : <div className="blog-sidebar__ph" />}
                  <div>
                    <div className="blog-sidebar__title">{post.title}</div>
                    <div className="blog-sidebar__date">{post.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="blog-sidebar__cta">
              <h4>{page.ctaTitle}</h4>
              <p>{page.ctaText}</p>
              <Link to="/contacto" className="button button--primary" style={{ width: '100%' }}>Cotizar ahora &rarr;</Link>
            </div>
            <div className="blog-sidebar__box">
              <h4>Recibe inspiración en tu correo</h4>
              <input type="email" placeholder="tu@correo.com" className="blog-newsletter-input" />
              <button className="button button--primary" style={{ width: '100%' }}>Suscribirme</button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Blog
