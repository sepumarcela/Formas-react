import { Link, useParams } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'

const cookiePolicySections = [
  {
    title: '1. Que son las cookies',
    body: 'Las cookies son pequenos archivos o tecnologias similares que se guardan en tu navegador cuando visitas un sitio web. Sirven para recordar preferencias, facilitar la navegacion y ayudarnos a entender como mejorar la experiencia dentro de Formas Interiores.',
  },
  {
    title: '2. Para que usamos cookies en Formas Interiores',
    body: 'Usamos cookies para que la pagina funcione correctamente, recordar algunas preferencias del usuario, analizar el comportamiento general de navegacion y mejorar el contenido, los productos y los formularios del sitio.',
  },
  {
    title: '3. Tipos de cookies que podemos utilizar',
    items: [
      'Cookies necesarias: permiten funciones basicas como navegar por la pagina, usar formularios, gestionar el carrito y mantener la seguridad del sitio.',
      'Cookies analiticas: nos ayudan a conocer, de forma general, que paginas se visitan, que contenido resulta mas util y como podemos mejorar la experiencia.',
      'Cookies de personalizacion: permiten recordar preferencias de navegacion para que la experiencia sea mas comoda.',
      'Cookies de terceros: pueden ser usadas por herramientas externas integradas al sitio, como servicios de medicion, formularios, mapas, pasarelas de pago o enlaces a redes sociales.',
    ],
  },
  {
    title: '4. Cookies necesarias',
    body: 'Estas cookies son esenciales para que el sitio funcione y no se pueden desactivar desde nuestro aviso, porque permiten acciones como navegar, proteger formularios, recordar una decision de privacidad o procesar funciones basicas de compra y contacto.',
  },
  {
    title: '5. Cookies analiticas y de mejora',
    body: 'Estas cookies nos permiten entender el uso del sitio de manera agregada. Por ejemplo, podemos saber que secciones se consultan con mas frecuencia, si una pagina esta funcionando bien o si necesitamos mejorar algun flujo de navegacion.',
  },
  {
    title: '6. Cookies relacionadas con pagos y servicios externos',
    body: 'Cuando usas funciones como pagos, formularios, WhatsApp, mapas o enlaces externos, algunos proveedores pueden utilizar sus propias tecnologias para operar correctamente sus servicios. Formas Interiores no controla directamente las cookies que esos terceros puedan establecer en sus plataformas.',
  },
  {
    title: '7. Como aceptar, rechazar o configurar cookies',
    body: 'Al ingresar al sitio puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias desde el aviso de cookies. Si rechazas, solo se mantendran las cookies necesarias para el funcionamiento basico del sitio.',
  },
  {
    title: '8. Como cambiar tu decision despues',
    body: 'Puedes borrar las cookies y datos del sitio desde la configuracion de tu navegador. Al hacerlo, el aviso de cookies volvera a aparecer y podras elegir nuevamente tus preferencias.',
  },
  {
    title: '9. Tratamiento de datos personales',
    body: 'Cuando una cookie o tecnologia similar pueda relacionarse con datos personales, el tratamiento se realiza de acuerdo con nuestra Politica de Privacidad y con la normativa aplicable en Colombia.',
  },
  {
    title: '10. Contacto',
    body: 'Si tienes preguntas sobre esta politica o sobre el tratamiento de tus datos, puedes escribirnos a contacto@formasinteriores.com.',
  },
]

function PolicyContent({ policy, policySlug }) {
  if (policySlug === 'cookies') {
    return (
      <div className="policy-content">
        <p>
          En Formas Interiores usamos cookies y tecnologias similares para ofrecer una navegacion segura, mejorar la experiencia del usuario y entender como se utiliza nuestro sitio web.
        </p>
        {cookiePolicySections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.body && <p>{section.body}</p>}
            {section.items && (
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    )
  }

  const paragraphs = String(policy.content || '').split('\n').map((paragraph) => paragraph.trim()).filter(Boolean)
  return (
    <div className="policy-content">
      {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Contenido pendiente.</p>}
    </div>
  )
}

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
            <Link className="policy-back" to="/">{'Volver al inicio'}</Link>
            <p className="admin-kicker">{'Politicas'}</p>
            <h1>{'Politica no encontrada'}</h1>
            <p>{'La informacion solicitada no esta disponible en este momento.'}</p>
          </article>
        </section>
      </main>
    )
  }

  return (
    <main className="page policy-page">
      <section className="policy-shell">
        <div className="policy-hero-copy">
          <Link className="policy-back" to="/">{'Volver al inicio'}</Link>
          <p className="admin-kicker">{pageContent.footerPolicies?.title || 'Politicas'}</p>
          <h1>{policy.title || policy.label}</h1>
          <p>
            {'Informacion clara para comprar, solicitar y navegar en Formas Interiores con confianza.'}
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

            <PolicyContent policy={policy} policySlug={policySlug} />
          </article>

          <aside className="policy-aside" aria-label="Otras politicas">
            <div className="policy-aside__box">
              <Sparkles size={20} />
              <h2>{'Politicas'}</h2>
              <p>{'Consulta tambien estos documentos de Formas Interiores.'}</p>
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
