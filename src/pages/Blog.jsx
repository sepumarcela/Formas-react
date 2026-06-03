import { Link } from 'react-router-dom'

const articulos = [
  { tag: 'TENDENCIAS', date: '20 de mayo, 2024', title: 'Cocinas modernas: 5 tendencias que seguirán marcando el 2024', desc: 'Descubre los estilos, colores y materiales que transformarán tu cocina en el corazón de tu hogar.' },
  { tag: 'TIPS Y CONSEJOS', date: '8 de mayo, 2024', title: 'Cómo elegir el centro de entretenimiento perfecto para tu sala', desc: 'Te compartimos claves para lograr un diseño funcional, estético y a la medida de tu espacio.' },
  { tag: 'DISEÑO DE INTERIORES', date: '25 de abril, 2024', title: 'Clósets que enamoran: organización con estilo', desc: 'Ideas y soluciones para mantener todo en orden sin sacrificar el diseño.' },
  { tag: 'MATERIALES', date: '15 de mayo, 2024', title: 'Materiales en tendencia para muebles duraderos y elegantes', desc: 'Conoce los materiales más usados en el diseño de interiores moderno.' },
  { tag: 'TIPS Y CONSEJOS', date: '3 de mayo, 2024', title: 'Baños pequeños: ideas para aprovechar cada centímetro', desc: 'Soluciones inteligentes para transformar un baño pequeño en un espacio funcional.' },
  { tag: 'TENDENCIAS', date: '18 de abril, 2024', title: 'Iluminación: el detalle que transforma tus espacios', desc: 'Aprende a usar la luz para potenciar cada rincón de tu hogar.' },
]

const categorias = ['Todos', 'Diseño de interiores', 'Tips y consejos', 'Materiales', 'Tendencias', 'Proyectos']

function Blog() {
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
          {categorias.map((c, i) => (
            <button key={c} className={`blog-cat-btn ${i === 0 ? 'active' : ''}`}>{c}</button>
          ))}
        </div>

        <div className="blog-layout">
          <div className="blog-grid">
            {articulos.map((a) => (
              <article className="blog-card" key={a.title}>
                <div className="blog-card__img">
                  <span className="blog-card__tag">{a.tag}</span>
                  <div className="blog-ph">Foto pendiente</div>
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__date">{a.date}</span>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <a href="#" className="blog-card__more">Leer más →</a>
                </div>
              </article>
            ))}
          </div>

          <aside className="blog-sidebar">
            <div className="blog-sidebar__box">
              <h4>Artículos populares</h4>
              {articulos.slice(0, 3).map((a) => (
                <div className="blog-sidebar__art" key={a.title}>
                  <div className="blog-sidebar__ph" />
                  <div>
                    <div className="blog-sidebar__title">{a.title}</div>
                    <div className="blog-sidebar__date">{a.date}</div>
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