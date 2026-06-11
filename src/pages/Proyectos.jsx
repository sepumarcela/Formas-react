import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PiCameraDuotone, PiDiamondDuotone, PiHandshakeDuotone, PiRulerDuotone } from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'

const filtrosBase = [
  { id: 'all', label: 'Todos' },
  { id: 'hogar', label: 'Hogares' },
  { id: 'cocina', label: 'Cocinas' },
  { id: 'closet', label: 'Closets' },
  { id: 'bano', label: 'Baños' },
  { id: 'oficina', label: 'Oficinas' },
  { id: 'comercial', label: 'Comerciales' },
]

const ventajas = [
  { icon: PiRulerDuotone, title: 'Proyectos a la medida', text: 'Diseñamos cada espacio según tus necesidades.' },
  { icon: PiDiamondDuotone, title: 'Calidad garantizada', text: 'Materiales de primera y acabados que perduran.' },
  { icon: PiHandshakeDuotone, title: 'Asesoría personalizada', text: 'Te acompañamos en cada etapa de tu proyecto.' },
  { icon: PiCameraDuotone, title: 'Inspiración real', text: 'Proyectos reales que reflejan nuestro compromiso.' },
]

function Proyectos() {
  const [{ pageContent, projects }] = useSiteContent()
  const [filtro, setFiltro] = useState('all')
  const activeProjects = useMemo(() => projects.filter((project) => project.active !== false), [projects])
  const filtros = useMemo(() => {
    const known = new Set(filtrosBase.map((item) => item.id))
    const custom = activeProjects
      .filter((project) => project.cat && !known.has(project.cat))
      .map((project) => ({ id: project.cat, label: project.label || project.cat }))

    return [...filtrosBase, ...custom]
  }, [activeProjects])
  const visibles = filtro === 'all' ? activeProjects : activeProjects.filter((project) => project.cat === filtro)
  const hero = pageContent.proyectos

  return (
    <main className="page">
      <PageHero content={hero} fallbackTitle="Proyectos" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="proyectos-filtros">
          {filtros.map((item) => (
            <button
              key={item.id}
              className={`proyectos-filtro ${filtro === item.id ? 'active' : ''}`}
              onClick={() => setFiltro(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="proyectos-grid">
          {visibles.map((project) => (
            <article className="proyecto-item" key={project.id}>
              <div className="proyecto-item__img">
                <span className="proyecto-item__tag">{project.label}</span>
                {project.image ? <img src={project.image} alt={project.title} /> : <div className="proyecto-ph">Foto pendiente</div>}
              </div>
              <div className="proyecto-item__body">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to={hero.ctaLink || '/contacto'} className="button button--primary">{hero.ctaLabel || 'Ver más proyectos'} &rarr;</Link>
        </div>
      </section>

      <div className="cat-bottom-bar">
        <div className="cat-bottom-bar__inner">
          {ventajas.map((item) => {
            const Icon = item.icon
            return (
              <div className="cat-bottom-item" key={item.title}>
                <Icon size={30} />
                <div><h5>{item.title}</h5><p>{item.text}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Proyectos
