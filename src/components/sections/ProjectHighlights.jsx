import { useSiteContent } from '../../hooks/useSiteContent'

function ProjectHighlights() {
  const [{ projectHighlights }] = useSiteContent()
  const visibleProjects = projectHighlights.filter((project) => project.active !== false)

  return (
    <section className="project-highlights">
      <div className="section-heading">
        <p className="eyebrow">Proyectos realizados</p>
        <h2>Transformamos espacios, creamos experiencias</h2>
        <p>
          Cada proyecto tiene una historia. Aquí dejamos registro visual del
          antes y después de los espacios intervenidos.
        </p>
      </div>

      <div className="project-highlight-grid">
        {visibleProjects.map((project) => (
          <article className="project-highlight-card" key={project.id}>
            <div className="project-highlight-card__media">
              <div data-label="Antes">
                {project.before ? (
                  <img src={project.before} alt={`${project.title} antes`} />
                ) : (
                  <span>Antes</span>
                )}
              </div>
              <div data-label="Después">
                {project.after ? (
                  <img src={project.after} alt={`${project.title} después`} />
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
    </section>
  )
}

export default ProjectHighlights
