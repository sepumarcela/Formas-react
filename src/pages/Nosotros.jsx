import { Link } from 'react-router-dom'
import { Heart, ShieldCheck, Users, Sparkles, Leaf, Award, MapPin, Clock } from 'lucide-react'

const pilares = [
  { icon: Heart, title: 'Pasión por el diseño', text: 'Nos inspira crear espacios únicos y funcionales.' },
  { icon: ShieldCheck, title: 'Calidad que perdura', text: 'Usamos materiales premium y acabados de alta resistencia.' },
  { icon: Users, title: 'Compromiso total', text: 'Acompañamos a nuestros clientes en cada etapa del proyecto.' },
]

const valores = [
  { icon: Users, title: 'Personalización', text: 'Cada proyecto es diseñado a la medida de tus sueños.' },
  { icon: Award, title: 'Excelencia', text: 'Buscamos la perfección en cada detalle, desde el diseño hasta la instalación.' },
  { icon: Sparkles, title: 'Innovación', text: 'Nos mantenemos a la vanguardia en tendencias, materiales y tecnología.' },
  { icon: ShieldCheck, title: 'Confianza', text: 'Construimos relaciones basadas en la transparencia y el cumplimiento.' },
  { icon: Leaf, title: 'Sostenibilidad', text: 'Trabajamos con procesos responsables y materiales amigables con el ambiente.' },
]

function Nosotros() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="page-hero__bg-ph" />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> &rsaquo; Nosotros</div>
          <p className="eyebrow">Nosotros</p>
          <h1>Diseñamos experiencias,<br /><em>creamos hogares.</em></h1>
          <div className="page-hero__line" />
          <p>En Formas transformamos espacios en lugares que reflejan tu estilo de vida y se adaptan a tus necesidades. Combinamos diseño, calidad y funcionalidad en cada detalle.</p>
        </div>
      </section>

      <section style={{ background: 'var(--color-surface)' }}>
        <div className="nosotros-historia">
          <div className="nosotros-historia__img"><div className="nosotros-ph">Foto pendiente</div></div>
          <div className="nosotros-historia__text">
            <h2>Nuestra historia</h2>
            <p>Formas nació con la visión de ofrecer muebles personalizados de alta calidad que elevaran los espacios de nuestros clientes.</p>
            <p>Hoy, somos un equipo apasionado por el diseño y la innovación, consolidado como una marca referente en mobiliario personalizado en Colombia.</p>
            <p>Cada proyecto es único y refleja nuestra dedicación por crear espacios que transformen la vida de las personas.</p>
          </div>
          <div className="nosotros-pilares">
            {pilares.map((p) => {
              const Icon = p.icon
              return (
                <div className="nosotros-pilar" key={p.title}>
                  <Icon size={22} strokeWidth={1.6} />
                  <div><h4>{p.title}</h4><p>{p.text}</p></div>
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
          {valores.map((v) => {
            const Icon = v.icon
            return (
              <div className="nosotros-valor" key={v.title}>
                <div className="nosotros-valor__icon"><Icon size={24} strokeWidth={1.5} /></div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
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
          <div className="nosotros-ubicacion__img"><div className="nosotros-ph">Foto sede pendiente</div></div>
          <div className="nosotros-ubicacion__info">
            <h3>Sala de diseño</h3>
            <p className="sub">Agenda tu visita y conoce nuestros espacios</p>
            <div className="ubi-row"><MapPin size={20} /><p>Cartagena, Colombia<br />Centro histórico</p></div>
            <div className="ubi-row"><Clock size={20} /><p>Lunes a Viernes: 8:00 a.m. &ndash; 6:00 p.m.<br />Sábados: 9:00 a.m. &ndash; 1:00 p.m.</p></div>
            <Link to="/contacto" className="button button--primary" style={{ marginTop: 20, alignSelf: 'flex-start' }}>Contactarnos &rarr;</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Nosotros