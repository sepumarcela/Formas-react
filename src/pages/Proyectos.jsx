import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, ShieldCheck, Users, Camera } from 'lucide-react'

const proyectos = [
  { id: 1, cat: 'hogar', label: 'Hogar', title: 'Sala Moderna', location: 'Bogotá, Colombia' },
  { id: 2, cat: 'cocina', label: 'Cocina', title: 'Cocina Contemporánea', location: 'Medellín, Colombia' },
  { id: 3, cat: 'closet', label: 'Closet', title: 'Vestier Abierto', location: 'Cali, Colombia' },
  { id: 4, cat: 'bano', label: 'Baño', title: 'Baño Minimalista', location: 'Barranquilla, Colombia' },
  { id: 5, cat: 'oficina', label: 'Oficina', title: 'Oficina en Casa', location: 'Bucaramanga, Colombia' },
  { id: 6, cat: 'comercial', label: 'Comercial', title: 'Local Comercial', location: 'Cartagena, Colombia' },
]

const filtros = [
  { id: 'all', label: 'Todos' },
  { id: 'hogar', label: 'Hogares' },
  { id: 'cocina', label: 'Cocinas' },
  { id: 'closet', label: 'Closets' },
  { id: 'bano', label: 'Baños' },
  { id: 'oficina', label: 'Oficinas' },
  { id: 'comercial', label: 'Comerciales' },
]

const ventajas = [
  { icon: Home, title: 'Proyectos a la medida', text: 'Diseñamos cada espacio según tus necesidades.' },
  { icon: ShieldCheck, title: 'Calidad garantizada', text: 'Materiales de primera y acabados que perduran.' },
  { icon: Users, title: 'Asesoría personalizada', text: 'Te acompañamos en cada etapa de tu proyecto.' },
  { icon: Camera, title: 'Inspiración real', text: 'Proyectos reales que reflejan nuestro compromiso.' },
]

function Proyectos() {
  const [filtro, setFiltro] = useState('all')
  const visibles = filtro === 'all' ? proyectos : proyectos.filter((p) => p.cat === filtro)

  return (
    <main className="page">
      <section className="page-hero">
        <div className="page-hero__bg-ph" />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> › Proyectos</div>
          <h1>Proyectos</h1>
          <div className="page-hero__line" />
          <p>Descubre espacios reales transformados por Formas. Cada proyecto refleja nuestro compromiso con el diseño, la funcionalidad y los detalles que marcan la diferencia.</p>
        </div>
      </section>

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="proyectos-filtros">
          {filtros.map((f) => (
            <button
              key={f.id}
              className={`proyectos-filtro ${filtro === f.id ? 'active' : ''}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="proyectos-grid">
          {visibles.map((p) => (
            <article className="proyecto-item" key={p.id}>
              <div className="proyecto-item__img">
                <span className="proyecto-item__tag">{p.label}</span>
                <div className="proyecto-ph">Foto pendiente</div>
              </div>
              <div className="proyecto-item__body">
                <h3>{p.title}</h3>
                <p>{p.location}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/contacto" className="button button--primary">Ver más proyectos →</Link>
        </div>
      </section>

      <div className="cat-bottom-bar">
        <div className="cat-bottom-bar__inner">
          {ventajas.map((v) => {
            const Icon = v.icon
            return (
              <div className="cat-bottom-item" key={v.title}>
                <Icon size={30} strokeWidth={1.5} />
                <div><h5>{v.title}</h5><p>{v.text}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Proyectos