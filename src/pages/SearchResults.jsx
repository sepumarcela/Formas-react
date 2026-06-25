import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { normalizeSearchText, searchSiteContent } from '../utils/searchIndex'

function ResultLink({ result }) {
  const content = (
    <>
      <span>{result.type}</span>
      <strong>{result.title}</strong>
      <p>{result.description || 'Ver contenido relacionado.'}</p>
    </>
  )

  if (result.external) {
    return (
      <a className="search-result-card" href={result.url} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link className="search-result-card" to={result.url}>
      {content}
    </Link>
  )
}

function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [siteContent] = useSiteContent()
  const hasQuery = Boolean(normalizeSearchText(query))
  const results = searchSiteContent(siteContent, query)

  return (
    <main className="search-page">
      <section className="search-page__hero">
        <p className="eyebrow">Busqueda</p>
        <h1>Resultados de busqueda</h1>
        <p>
          {hasQuery
            ? `Encontramos ${results.length} resultado${results.length === 1 ? '' : 's'} para "${query}".`
            : 'Escribe una palabra clave desde el buscador para encontrar productos, proyectos, articulos o paginas.'}
        </p>
      </section>

      <section className="search-page__body">
        {hasQuery ? (
          results.length > 0 ? (
            <div className="search-result-grid">
              {results.map((result) => <ResultLink key={result.url} result={result} />)}
            </div>
          ) : (
            <div className="search-empty-state">
              <Search size={28} />
              <h2>No encontramos coincidencias</h2>
              <p>Prueba con palabras como cocina, closet, repisas, blog, contacto o proyecto.</p>
              <Link to="/productos" className="button button--primary">Ver productos</Link>
            </div>
          )
        ) : (
          <div className="search-empty-state">
            <Search size={28} />
            <h2>Busca en Formas Interiores</h2>
            <p>Usa el icono de busqueda en la parte superior para encontrar enlaces directos.</p>
            <Link to="/productos" className="button button--primary">Explorar productos</Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default SearchResults
