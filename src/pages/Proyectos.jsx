import PageHero from '../components/sections/PageHero'
import ProjectHighlights from '../components/sections/ProjectHighlights'
import { useSiteContent } from '../hooks/useSiteContent'

function Proyectos() {
  const [{ pageContent }] = useSiteContent()

  return (
    <main className="page projects-page">
      <PageHero
        content={pageContent.proyectos}
        fallbackTitle="Proyectos realizados"
        fallbackDescription="Descubre transformaciones reales creadas por Formas Interiores."
      />
      <ProjectHighlights />
    </main>
  )
}

export default Proyectos
