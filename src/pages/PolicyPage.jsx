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
          <p className="admin-kicker">Políticas</p>
          <h1>Política no encontrada</h1>
          <p>La información solicitada no está disponible en este momento.</p>
          <Link className="button button--primary" to="/">Volver al inicio</Link>
        </section>
      </main>
    )
  }

  const paragraphs = String(policy.content || '').split('\n').filter(Boolean)

  return (
    <main className="page policy-page">
      <section className="policy-article">
        <Link className="policy-back" to="/">← Volver al inicio</Link>
        <p className="admin-kicker">{pageContent.footerPolicies?.title || 'Políticas'}</p>
        <h1>{policy.title || policy.label}</h1>
        {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Contenido pendiente.</p>}
      </section>
    </main>
  )
}

export default PolicyPage