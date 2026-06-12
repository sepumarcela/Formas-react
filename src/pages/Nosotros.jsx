import { Link } from 'react-router-dom'
import { PiClockDuotone, PiHandshakeDuotone, PiHeartDuotone, PiMapPinDuotone, PiPaletteDuotone, PiPlantDuotone, PiSealCheckDuotone, PiShieldCheckDuotone, PiSparkleDuotone } from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'

const pilares = [
  { icon: PiHeartDuotone, title: 'Pasión por el diseño', text: 'Nos inspira crear espacios únicos y funcionales.' },
  { icon: PiShieldCheckDuotone, title: 'Calidad que perdura', text: 'Usamos materiales premium y acabados de alta resistencia.' },
  { icon: PiHandshakeDuotone, title: 'Compromiso total', text: 'Acompañamos a nuestros clientes en cada etapa del proyecto.' },
]

const valores = [
  { icon: PiPaletteDuotone, title: 'Personalización', text: 'Cada proyecto es diseñado a la medida de tus sueños.' },
  { icon: PiSealCheckDuotone, title: 'Excelencia', text: 'Buscamos la perfección en cada detalle, desde el diseño hasta la instalación.' },
  { icon: PiSparkleDuotone, title: 'Innovación', text: 'Nos mantenemos a la vanguardia en tendencias, materiales y tecnología.' },
  { icon: PiHandshakeDuotone, title: 'Confianza', text: 'Construimos relaciones basadas en la transparencia y el cumplimiento.' },
  { icon: PiPlantDuotone, title: 'Sostenibilidad', text: 'Trabajamos con procesos responsables y materiales amigables con el ambiente.' },
]

function Nosotros() {
  const [{ pageContent }] = useSiteContent()
  const page = pageContent.nosotros
  const historyParagraphs = String(page.historyText || '').split('\n').filter(Boolean)

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Nosotros" />

      <section style={{ background: 'var(--color-surface)' }}>
        <div className="nosotros-historia">
          <div className="nosotros-historia__img">
            {page.historyImage ? <img src={optimizeImage(page.historyImage, { width: 1000 })} alt={page.historyTitle} loading="lazy" /> : <div className="nosotros-ph">Foto pendiente</div>}
          </div>
          <div className="nosotros-historia__text">
            <h2>{page.historyTitle}</h2>
            {historyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="nosotros-pilares">
            {pilares.map((item) => {
              const Icon = item.icon
              return (
                <div className="nosotros-pilar" key={item.title}>
                  <Icon size={22} />
                  <div><h4>{item.title}</h4><p>{item.text}</p></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="section-heading">
          <p className="eyebrow">Nuestros valores</p>
          <h2>Lo que nos define</h2>
        </div>
        <div className="nosotros-valores">
          {valores.map((item) => {
            const Icon = item.icon
            return (
              <div className="nosotros-valor" key={item.title}>
                <div className="nosotros-valor__icon"><Icon size={24} /></div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section style={{ background: 'var(--color-surface)' }}>
        <div className="section-heading">
          <p className="eyebrow">Nuestra sede</p>
          <h2>¿Dónde estamos?</h2>
          <p>Visítanos y conoce nuestros espacios de inspiración.</p>
        </div>
        <div className="nosotros-ubicacion">
          <div className="nosotros-ubicacion__img">
            {page.locationImage ? <img src={optimizeImage(page.locationImage, { width: 1000 })} alt="Sala de diseño" loading="lazy" /> : <div className="nosotros-ph">Foto sede pendiente</div>}
          </div>
          <div className="nosotros-ubicacion__info">
            <h3>Sala de diseño</h3>
            <p className="sub">Agenda tu visita y conoce nuestros espacios</p>
            <div className="ubi-row"><PiMapPinDuotone size={20} /><p>Medellín, Colombia</p></div>
            <div className="ubi-row"><PiClockDuotone size={20} /><p>Lunes a Viernes: 8:00 a.m. - 6:00 p.m.<br />Sábados: 9:00 a.m. - 1:00 p.m.</p></div>
            <Link to="/contacto" className="button button--primary" style={{ marginTop: 20, alignSelf: 'flex-start' }}>Contactarnos &rarr;</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Nosotros
