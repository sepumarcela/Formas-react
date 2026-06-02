const projects = [
  {
    id: 'cocina-moderna',
    category: 'Cocinas',
    title: 'Cocina moderna familiar',
    before: '',
    after: '',
  },
  {
    id: 'closet-principal',
    category: 'Closets',
    title: 'Closet principal a medida',
    before: '',
    after: '',
  },
  {
    id: 'centro-tv',
    category: 'Centros de entretenimiento',
    title: 'Sala con centro de TV',
    before: '',
    after: '',
  },
]

function ProjectHighlights() {
  return (
    <section className="project-highlights">
      <div className="section-heading">
        <p className="eyebrow">Proyectos realizados</p>
        <h2>Transformamos espacios, creamos experiencias</h2>
        <p>
          Cada proyecto tiene una historia. Aquí dejaremos registro visual del
          antes y después de los espacios intervenidos.
        </p>
      </div>

      <div className="project-highlight-grid">
        {projects.map((project) => (
          <article className="project-highlight-card" key={project.id}>
            <div className="project-highlight-card__media">
              <div>
                {project.before ? (
                  <img src={project.before} alt={`${project.title} antes`} />
                ) : (
                  <span>Antes</span>
                )}
              </div>
              <div>
                {project.after ? (
                  <img src={project.after} alt={`${project.title} despues`} />
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