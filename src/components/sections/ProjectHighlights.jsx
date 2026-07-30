import { useRef, useState } from 'react'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

function ComparisonLayer({ image, alt, label, variant }) {
  const imageSrc = image ? optimizeImage(image, { width: 1600 }) : ''

  return (
    <div
      className={'project-comparison__layer project-comparison__layer--' + variant}
      style={imageSrc ? { '--comparison-image': `url("${imageSrc}")` } : undefined}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={alt} loading="lazy" draggable="false" />
      ) : (
        <span className="project-comparison__placeholder">{label}</span>
      )}
    </div>
  )
}

function BeforeAfterSlider({ project }) {
  const [position, setPosition] = useState(50)

  return (
    <div
      className="project-highlight-card__media project-comparison project-comparison--slider"
      style={{ '--comparison-position': position + '%' }}
    >
      <ComparisonLayer image={project.after} alt={project.title + ' después'} label="Después" variant="after" />
      <ComparisonLayer image={project.before} alt={project.title + ' antes'} label="Antes" variant="before" />

      <span className="project-comparison__label project-comparison__label--before">Antes</span>
      <span className="project-comparison__label project-comparison__label--after">Después</span>

      <input
        className="project-comparison__range"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={'Comparar el antes y después de ' + project.title}
        aria-valuetext={position + '% de la imagen antes'}
      />

      <div className="project-comparison__divider" aria-hidden="true">
        <span className="project-comparison__handle">‹ ›</span>
      </div>
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
        <p>Desliza el control central para comparar el antes y el después. Usa las flechas laterales para conocer el siguiente proyecto.</p>
      </div>

      <div className="project-highlight-carousel">
        {visibleProjects.length > 1 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--prev" type="button" onClick={() => scrollProjects(-1)} aria-label="Ver proyecto anterior">
            <span aria-hidden="true">‹</span>
          </button>
        )}

        <div className="project-highlight-track" ref={carouselRef}>
          {visibleProjects.map((project) => (
            <article className="project-highlight-card" key={project.id}>
              <BeforeAfterSlider project={project} />
              <div className="project-highlight-card__body">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {visibleProjects.length > 1 && (
          <button className="project-highlight-carousel__arrow project-highlight-carousel__arrow--next" type="button" onClick={() => scrollProjects(1)} aria-label="Ver siguiente proyecto">
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default ProjectHighlights
