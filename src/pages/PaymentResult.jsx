import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PiCheckCircleDuotone, PiClockDuotone, PiWarningCircleDuotone } from 'react-icons/pi'
import { clearCart } from '../utils/cart'

const statusCopy = {
  APPROVED: {
    icon: PiCheckCircleDuotone,
    title: 'Pago aprobado',
    text: 'Recibimos la confirmacion del pago. Te contactaremos para coordinar los siguientes pasos.',
  },
  DECLINED: {
    icon: PiWarningCircleDuotone,
    title: 'Pago rechazado',
    text: 'La transaccion no fue aprobada. Puedes intentar nuevamente o escribirnos para recibir ayuda.',
  },
  ERROR: {
    icon: PiWarningCircleDuotone,
    title: 'No se pudo completar el pago',
    text: 'La pasarela reporto un error. Si el dinero fue debitado, espera la confirmacion o contactanos.',
  },
  PENDING: {
    icon: PiClockDuotone,
    title: 'Pago en validacion',
    text: 'El pago esta pendiente de confirmacion. Esto puede pasar con PSE u otros metodos bancarios.',
  },
  RECEIVED: {
    icon: PiCheckCircleDuotone,
    title: 'Pago recibido',
    text: 'Gracias. Recibimos el regreso de Wompi y validaremos la transaccion con la confirmacion enviada por la pasarela.',
  },
}

function PaymentResult() {
  const [params] = useSearchParams()
  const rawStatus = params.get('status') || params.get('transaction_status') || params.get('transaction.status') || ''
  const normalizedStatus = rawStatus.toUpperCase()
  const hasWompiTransaction = Boolean(params.get('id') || params.get('transaction_id') || params.get('reference'))
  const status = normalizedStatus || (hasWompiTransaction ? 'RECEIVED' : 'PENDING')
  const reference = params.get('reference') || params.get('id') || params.get('transaction_id') || ''
  const copy = statusCopy[status] || statusCopy.RECEIVED
  const Icon = copy.icon

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main className="page payment-result-page">
      <section className="payment-result">
        <Icon size={48} />
        <p className="eyebrow">Pago Formas Interiores</p>
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
        {reference && <span className="payment-reference">Referencia: {reference}</span>}
        <div className="payment-result__actions">
          <Link className="button button--primary" to="/productos">Seguir comprando</Link>
          <Link className="button button--soft" to="/contacto">Contactar asesor</Link>
        </div>
      </section>
    </main>
  )
}

export default PaymentResult
