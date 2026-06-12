import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

function ProjectHighlights() {
  const [{ projectHighlights }] = useSiteContent()
  const visibleProjects = projectHighlights.filter((project) => project.active !== false)

  return (
    <section className="project-highlights">
      <div className="section-heading">
        <p className="eyebrow">Proyectos realizados</p>
        <h2>Transformamos espacios, creamos experiencias</h2>
        <p>
          Cada proyecto tiene una historia. Aqui dejamos registro visual del
          antes y despues de los espacios intervenidos.
        </p>
      </div>

      <div className="project-highlight-grid">
        {visibleProjects.map((project) => (
          <article className="project-highlight-card" key={project.id}>
            <div className="project-highlight-card__media">
              <div data-label="Antes">
                {project.before ? (
                  <img src={optimizeImage(project.before, { width: 700 })} alt={`${project.title} antes`} loading="lazy" />
                ) : (
                  <span>Antes</span>
                )}
              </div>
              <div data-label="Despues">
                {project.after ? (
                  <img src={optimizeImage(project.after, { width: 700 })} alt={`${project.title} despues`} loading="lazy" />
                ) : (
                  <span>Despues</span>
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
    </section>
  )
}

export default ProjectHighlights
