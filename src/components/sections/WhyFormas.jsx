import { BadgeCheck, Headphones, PencilRuler, Truck } from 'lucide-react'

const benefits = [
  {
    title: 'Diseño personalizado',
    text: 'Adaptamos cada proyecto a tu espacio, necesidades y estilo de vida.',
    icon: PencilRuler,
  },
  {
    title: 'Fabricación de calidad',
    text: 'Trabajamos con materiales resistentes y acabados cuidadosamente revisados.',
    icon: BadgeCheck,
  },
  {
    title: 'Instalación profesional',
    text: 'Entregamos e instalamos para que recibas tu espacio listo para usar.',
    icon: Truck,
  },
  {
    title: 'Acompañamiento completo',
    text: 'Te acompañamos desde la idea inicial hasta la entrega del proyecto.',
    icon: Headphones,
  },
]

function WhyFormas() {
  return (
    <section className="why-formas">
      <div className="section-heading">
        <p className="eyebrow">Por qué Formas</p>
        <h2>Convertimos ideas en espacios únicos</h2>
        <p>
          Cuidamos cada detalle para crear muebles funcionales, cálidos y
          duraderos.
        </p>
      </div>

      <div className="benefit-grid">
        {benefits.map((benefit) => {
          const Icon = benefit.icon

          return (
            <article className="benefit-card" key={benefit.title}>
              <div className="benefit-card__icon">
                <Icon size={30} strokeWidth={1.7} />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default WhyFormas