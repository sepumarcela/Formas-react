import { useRef } from 'react'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

function ProjectPhoto({ image, alt, label, variant }) {
  const imageSrc = image ? optimizeImage(image, { width: 1200 }) : ''

  return (
    <div
      className={'project-comparison__layer project-comparison__layer--' + variant}
      style={imageSrc ? { '--comparison-image': `url("${imageSrc}")` } : undefined}
    >
      <span className="project-comparison__label">{label}</span>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} loading="lazy" draggable="false" />
      ) : (
        <span className="project-comparison__placeholder">Foto pendiente</span>
      )}
    </div>
  )
}

function BeforeAfterPair({ project }) {
  return (
    <div className="project-highlight-card__media project-comparison project-comparison--pair">
      <ProjectPhoto image={project.before} alt={project.title + ' antes'} label="Antes" variant="before" />
      <ProjectPhoto image={project.after} alt={project.title + ' después'} label="Después" variant="after" />
    </div>
  )
}

function ProjectHighlights() {
  const [{ projectHighlights }] = useSiteContent()
  const visibleProjects = projectHighlights.filter((project) => project.active !== false)
  const carouselRef = useRef(null)

  const scrollProjects = (direction) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const firstCard = carousel.querySelector('.project-highlight-card')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : carousel.clientWidth
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap || '0') || 0
    carousel.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' })
  }

  return (
    <section id="proyectos-realizados" className="project-highlights">
      <div className="section-heading">
        <p className="eyebrow">Proyectos realizados</p>
        <h2>Transformamos espacios, creamos experiencias</h2>
        <p>Cada proyecto tiene una historia. Aquí puedes comparar el antes y el después de los espacios intervenidos.</p>
      </div>

      <div className="project-highlight-carousel">
        {visibleProjects.length > 1 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--prev" type="button" onClick={() => scrollProjects(-1)} aria-label="Ver proyectos anteriores">
            <span aria-hidden="true">‹</span>
          </button>
        )}

        <div className="project-highlight-track" ref={carouselRef}>
          {visibleProjects.map((project) => (
            <article className="project-highlight-card" key={project.id}>
              <BeforeAfterPair project={project} />
              <div className="project-highlight-card__body">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {visibleProjects.length > 1 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--next" type="button" onClick={() => scrollProjects(1)} aria-label="Ver más proyectos">
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default ProjectHighlights
