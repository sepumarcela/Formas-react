import { useEffect, useMemo, useState } from 'react'
import { PiCameraDuotone, PiDiamondDuotone, PiHandshakeDuotone, PiRulerDuotone } from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'

const filtrosBase = [
  { id: 'all', label: 'Todos' },
  { id: 'hogar', label: 'Hogares' },
  { id: 'cocina', label: 'Cocinas' },
  { id: 'closet', label: 'Closets' },
  { id: 'bano', label: 'Ba\u00f1os' },
  { id: 'oficina', label: 'Oficinas' },
  { id: 'comercial', label: 'Comerciales' },
]

const ventajas = [
  { icon: PiRulerDuotone, title: 'Proyectos a la medida', text: 'Dise\u00f1amos cada espacio seg\u00fan tus necesidades.' },
  { icon: PiDiamondDuotone, title: 'Calidad garantizada', text: 'Materiales de primera y acabados que perduran.' },
  { icon: PiHandshakeDuotone, title: 'Asesor\u00eda personalizada', text: 'Te acompa\u00f1amos en cada etapa de tu proyecto.' },
  { icon: PiCameraDuotone, title: 'Inspiraci\u00f3n real', text: 'Proyectos reales que reflejan nuestro compromiso.' },
]

const PROJECTS_BATCH_SIZE = 6

function Proyectos() {
  const [{ pageContent, projects }] = useSiteContent()
  const [filtro, setFiltro] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PROJECTS_BATCH_SIZE)
  const activeProjects = useMemo(() => projects.filter((project) => project.active !== false), [projects])
  const filtros = useMemo(() => {
    const known = new Set(filtrosBase.map((item) => item.id))
    const custom = activeProjects
      .filter((project) => project.cat && !known.has(project.cat))
      .map((project) => ({ id: project.cat, label: project.label || project.cat }))

    return [...filtrosBase, ...custom]
  }, [activeProjects])
  const visibles = filtro === 'all' ? activeProjects : activeProjects.filter((project) => project.cat === filtro)
  const visibleProjects = visibles.slice(0, visibleCount)
  const hasMoreProjects = visibleCount < visibles.length
  const hero = pageContent.proyectos

  useEffect(() => {
    setVisibleCount(PROJECTS_BATCH_SIZE)
  }, [filtro])

  return (
    <main className="page">
      <PageHero content={hero} fallbackTitle="Proyectos" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="proyectos-filtros">
          {filtros.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`proyectos-filtro ${filtro === item.id ? 'active' : ''}`}
              onClick={() => setFiltro(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="proyectos-grid">
          {visibleProjects.map((project) => (
            <article className="proyecto-item" key={project.id}>
              <div className="proyecto-item__img">
                <span className="proyecto-item__tag">{project.label}</span>
                {project.image ? <img src={optimizeImage(project.image, { width: 900 })} alt={project.title} loading="lazy" /> : <div className="proyecto-ph">Foto pendiente</div>}
              </div>
              <div className="proyecto-item__body">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
              </div>
            </article>
          ))}
        </div>

        {hasMoreProjects && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              type="button"
              className="button button--primary"
              onClick={() => setVisibleCount((current) => current + PROJECTS_BATCH_SIZE)}
            >
              {hero.ctaLabel || 'Ver m\u00e1s proyectos'} &rarr;
            </button>
          </div>
        )}
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
