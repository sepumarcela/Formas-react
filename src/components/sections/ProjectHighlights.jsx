import { useRef } from 'react'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

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
        <p>
          Cada proyecto tiene una historia. Aquí dejamos registro visual del
          antes y después de los espacios intervenidos.
        </p>
      </div>

      <div className="project-highlight-carousel">
        {visibleProjects.length > 2 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--prev" type="button" onClick={() => scrollProjects(-1)} aria-label="Ver proyectos anteriores">
            <span aria-hidden="true">‹</span>
          </button>
        )}

        <div className="project-highlight-track" ref={carouselRef}>
          {visibleProjects.map((project) => (
            <article className="project-highlight-card" key={project.id}>
              <div className="project-highlight-card__media">
                <div data-label="Antes">
                  {project.before ? (
                    <img src={optimizeImage(project.before, { width: 900 })} alt={project.title + ' antes'} loading="lazy" />
                  ) : (
                    <span>Antes</span>
                  )}
                </div>
                <div data-label="Después">
                  {project.after ? (
                    <img src={optimizeImage(project.after, { width: 900 })} alt={project.title + ' después' } loading="lazy" />
                  ) : (
                    <span>Después</span>
                  )}
                </div>
              </div>

              <div className="project-highlight-card__body">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {visibleProjects.length > 2 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--next" type="button" onClick={() => scrollProjects(1)} aria-label="Ver más proyectos">
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default ProjectHighlights
