import { Link, useParams } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'

function PolicyPage() {
  const { policySlug } = useParams()
  const [{ pageContent }] = useSiteContent()
  const policies = pageContent.footerPolicies?.policies || []
  const visiblePolicies = policies.filter((item) => item.active !== false)
  const policy = visiblePolicies.find((item) => (item.slug || item.id) === policySlug)

  if (!policy) {
    return (
      <main className="page policy-page">
        <section className="policy-shell">
          <article className="policy-card policy-card--empty">
            <Link className="policy-back" to="/">{'\u2190 Volver al inicio'}</Link>
            <p className="admin-kicker">{'Pol\u00edticas'}</p>
            <h1>{'Pol\u00edtica no encontrada'}</h1>
            <p>{'La informaci\u00f3n solicitada no est\u00e1 disponible en este momento.'}</p>
          </article>
        </section>
      </main>
    )
  }

  const paragraphs = String(policy.content || '').split('\n').map((paragraph) => paragraph.trim()).filter(Boolean)

  return (
    <main className="page policy-page">
      <section className="policy-shell">
        <div className="policy-hero-copy">
          <Link className="policy-back" to="/">{'\u2190 Volver al inicio'}</Link>
          <p className="admin-kicker">{pageContent.footerPolicies?.title || 'Pol\u00edticas'}</p>
          <h1>{policy.title || policy.label}</h1>
          <p>
            {'Informaci\u00f3n clara para comprar, solicitar y navegar en Formas Interiores con confianza.'}
          </p>
        </div>

        <div className="policy-layout">
          <article className="policy-card">
            <div className="policy-card__header">
              <span><ShieldCheck size={24} /></span>
              <div>
                <p>{'Documento informativo'}</p>
                <strong>{policy.label || policy.title}</strong>
              </div>
            </div>

            <div className="policy-content">
              {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Contenido pendiente.</p>}
            </div>
          </article>

          <aside className="policy-aside" aria-label="Otras pol\u00edticas">
            <div className="policy-aside__box">
              <Sparkles size={20} />
              <h2>{'Pol\u00edticas'}</h2>
              <p>{'Consulta tambi\u00e9n estos documentos de Formas Interiores.'}</p>
              <nav>
                {visiblePolicies.map((item) => {
                  const slug = item.slug || item.id
                  return (
                    <Link
                      key={item.id || slug || item.label}
                      className={slug === policySlug ? 'is-active' : ''}
                      to={'/politicas/' + slug}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default PolicyPage