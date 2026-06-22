import { PiDiamondDuotone, PiHandshakeDuotone, PiRulerDuotone, PiToolboxDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

const benefits = [
  {
    id: 'diseno-personalizado',
    title: 'Diseño personalizado',
    text: 'Adaptamos cada proyecto a tu espacio, necesidades y estilo de vida.',
    icon: PiRulerDuotone,
  },
  {
    id: 'fabricacion-calidad',
    title: 'Fabricación de calidad',
    text: 'Trabajamos con materiales resistentes y acabados cuidadosamente revisados.',
    icon: PiDiamondDuotone,
  },
  {
    id: 'instalacion-profesional',
    title: 'Instalación profesional',
    text: 'Entregamos e instalamos para que recibas tu espacio listo para usar.',
    icon: PiToolboxDuotone,
  },
  {
    id: 'acompanamiento-completo',
    title: 'Acompañamiento completo',
    text: 'Te acompañamos desde la idea inicial hasta la entrega del proyecto.',
    icon: PiHandshakeDuotone,
  },
]

function WhyFormas() {
  const [{ pageContent }] = useSiteContent()
  const adminBenefits = pageContent.homeProducts?.whyBenefits || []
  const benefitImages = new Map(adminBenefits.map((benefit) => [benefit.id, benefit.image]))

  return (
    <section className="why-formas">
      <div className="section-heading">
        <p className="eyebrow">Por qué Formas Interiores</p>
        <h2>Convertimos ideas en espacios únicos</h2>
        <p>
          Cuidamos cada detalle para crear muebles funcionales, cálidos y
          duraderos.
        </p>
      </div>

      <div className="benefit-grid">
        {benefits.map((benefit) => {
          const Icon = benefit.icon
          const image = benefitImages.get(benefit.id)

          return (
            <article className="benefit-card" key={benefit.title}>
              <div className="benefit-card__content">
                <div className="benefit-card__icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
              <div className={`benefit-card__image${image ? '' : ' benefit-card__image--empty'}`}>
                {image ? <img src={optimizeImage(image, { width: 700 })} alt={benefit.title} loading="lazy" /> : <span>Foto pendiente</span>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default WhyFormas
