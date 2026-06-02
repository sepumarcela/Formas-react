import { ClipboardList, Factory, Home, MessageCircle, PencilRuler } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Cuéntanos tu idea',
    text: 'Nos compartes el espacio, medidas, necesidad y estilo que tienes en mente.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Diseñamos tu espacio',
    text: 'Creamos una propuesta funcional y visual para validar el proyecto.',
    icon: PencilRuler,
  },
  {
    number: '03',
    title: 'Fabricamos',
    text: 'Producimos cada pieza con materiales y acabados definidos.',
    icon: Factory,
  },
  {
    number: '04',
    title: 'Instalamos',
    text: 'Llevamos el mobiliario e instalamos con cuidado profesional.',
    icon: ClipboardList,
  },
  {
    number: '05',
    title: 'Disfrutas tu hogar',
    text: 'Recibes un espacio transformado, funcional y listo para usar.',
    icon: Home,
  },
]

function PurchaseProcess() {
  return (
    <section className="purchase-process">
      <div className="section-heading">
        <p className="eyebrow">Nuestro proceso</p>
        <h2>Proceso de compra</h2>
        <p>
          Así hacemos realidad el espacio que imaginas, paso a paso y sin
          complicaciones.
        </p>
      </div>

      <div className="process-grid">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <article className="process-step" key={step.number}>
              <span className="process-step__number">{step.number}</span>
              <div className="process-step__icon">
                <Icon size={28} strokeWidth={1.7} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default PurchaseProcess