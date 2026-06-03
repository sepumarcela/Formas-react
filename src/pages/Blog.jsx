import { Link } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'

function Blog() {
  const [{ blogPosts }] = useSiteContent()
  const categories = ['Todos', ...Array.from(new Set(blogPosts.map((post) => post.tag).filter(Boolean)))]

  return (
    <main className="page">
      <section className="page-hero">
        <div className="page-hero__bg-ph" />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> › Blog</div>
          <h1>Blog</h1>
          <div className="page-hero__line" />
          <p>Ideas, inspiración y consejos para diseñar espacios que reflejen tu estilo y mejoren tu día a día.</p>
        </div>
      </section>

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
                  <a href="#" className="blog-card__more">Leer más →</a>
                </div>
              </article>
            ))}
          </div>

          <aside className="blog-sidebar">
            <div className="blog-sidebar__box">
              <h4>Artículos populares</h4>
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
              <h4>¿Tienes un proyecto en mente?</h4>
              <p>Te ayudamos a diseñar y hacer realidad el espacio que sueñas.</p>
              <Link to="/contacto" className="button button--primary" style={{ width: '100%' }}>Cotizar ahora →</Link>
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
