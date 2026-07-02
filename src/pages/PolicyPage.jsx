import { Link, useParams } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'

function PolicyPage() {
  const { policySlug } = useParams()
  const [{ pageContent }] = useSiteContent()
  const policies = pageContent.footerPolicies?.policies || []
  const policy = policies.find((item) => (item.slug || item.id) === policySlug && item.active !== false)

  if (!policy) {
    return (
      <main className="page policy-page">
        <section className="policy-article">
          <Link className="policy-back" to="/">{'\u2190 Volver al inicio'}</Link>
          <p className="admin-kicker">{'Pol\u00edticas'}</p>
          <h1>{'Pol\u00edtica no encontrada'}</h1>
          <p>{'La informaci\u00f3n solicitada no est\u00e1 disponible en este momento.'}</p>
        </section>
      </main>
    )
  }

  const paragraphs = String(policy.content || '').split('\n').filter(Boolean)

  return (
    <main className="page policy-page">
      <section className="policy-article">
        <Link className="policy-back" to="/">{'\u2190 Volver al inicio'}</Link>
        <p className="admin-kicker">{pageContent.footerPolicies?.title || 'Pol\u00edticas'}</p>
        <h1>{policy.title || policy.label}</h1>
        {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Contenido pendiente.</p>}
      </section>
    </main>
  )
}

export default PolicyPage
