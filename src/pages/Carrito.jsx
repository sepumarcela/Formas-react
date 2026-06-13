import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Trash2 } from 'lucide-react'
import {
  PiBankDuotone,
  PiCheckCircleDuotone,
  PiClipboardTextDuotone,
  PiCreditCardDuotone,
  PiDeviceMobileDuotone,
  PiHouseLineDuotone,
  PiLightbulbFilamentDuotone,
  PiLockKeyDuotone,
  PiRulerDuotone,
  PiShieldCheckDuotone,
  PiShoppingCartSimpleDuotone,
  PiTruckDuotone,
} from 'react-icons/pi'
import { submitContactForm } from '../api/cmsApi'
import {
  CART_UPDATED_EVENT,
  clearCart,
  formatMoney,
  loadCartItems,
  parseMoney,
  removeCartItem,
  updateCartItemQuantity,
} from '../utils/cart'
import { optimizeImage } from '../utils/images'

const IVA_RATE = 0.19

const paymentOptions = [
  {
    id: 'secure-link',
    icon: PiCreditCardDuotone,
    title: 'Tarjeta por enlace seguro',
    text: 'Te enviamos un link de pago de la pasarela. No escribes datos de tarjeta en esta web.',
  },
  {
    id: 'pse-transfer',
    icon: PiBankDuotone,
    title: 'PSE o transferencia',
    text: 'Confirmamos la cotización y compartimos instrucciones bancarias verificadas.',
  },
  {
    id: 'wallet',
    icon: PiDeviceMobileDuotone,
    title: 'Nequi / Daviplata',
    text: 'Ideal para anticipos o saldos pequeños, siempre después de validar el pedido.',
  },
  {
    id: 'installments',
    icon: PiHouseLineDuotone,
    title: 'Anticipo y saldo',
    text: 'Opción recomendada para proyectos a medida con fabricación e instalación.',
  },
]

function getItemTotal(item) {
  return parseMoney(item.price) * item.quantity
}

function splitIncludedIva(total) {
  const priceBeforeIva = Math.round(total / (1 + IVA_RATE))
  return {
    priceBeforeIva,
    ivaAmount: total - priceBeforeIva,
    totalWithIva: total,
  }
}

function Carrito() {
  const [items, setItems] = useState(() => loadCartItems())
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const totalWithIva = useMemo(() => items.reduce((sum, item) => sum + getItemTotal(item), 0), [items])
  const { priceBeforeIva, ivaAmount } = useMemo(() => splitIncludedIva(totalWithIva), [totalWithIva])
  const hasPricedItems = totalWithIva > 0
  const productCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod) || paymentOptions[0]

  useEffect(() => {
    function syncCart(event) {
      setItems(event.detail || loadCartItems())
    }

    function syncStorage(event) {
      if (event.storageArea === window.sessionStorage && (!event.key || event.key === 'formas-cart-v1')) {
        setItems(loadCartItems())
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncStorage)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  function handleQuantity(id, quantity) {
    setItems(updateCartItemQuantity(id, quantity))
  }

  function handleRemove(id) {
    setItems(removeCartItem(id))
  }

  function handleClear() {
    setItems(clearCart())
  }

  async function handleCheckout(event) {
    event.preventDefault()
    if (!items.length) return

    const form = event.currentTarget
    const data = new FormData(form)
    const orderLines = items
      .map((item) => `- ${item.quantity} x ${item.name} (${item.category || 'Producto'}) ${item.price || 'Cotizar'}`)
      .join('\n')

    setSending(true)
    setError('')

    try {
      await submitContactForm({
        name: data.get('name'),
        phone: data.get('phone'),
        email: data.get('email'),
        interest: 'Carrito de compra',
        message: [
          'Solicitud desde carrito FORMAS',
          '',
          orderLines,
          '',
          `Precio antes de IVA: ${hasPricedItems ? formatMoney(priceBeforeIva) : 'Por cotizar'}`,
          `IVA (${Math.round(IVA_RATE * 100)}%): ${hasPricedItems ? formatMoney(ivaAmount) : 'Por cotizar'}`,
          `Total con IVA: ${hasPricedItems ? formatMoney(totalWithIva) : 'Por cotizar'}`,
          `Método de pago preferido: ${selectedPayment.title}`,
          `Ciudad: ${data.get('city') || 'No indicada'}`,
          `Dirección/sector: ${data.get('address') || 'No indicado'}`,
          '',
          `Notas: ${data.get('notes') || 'Sin notas adicionales'}`,
        ].join('\n'),
      })

      setSent(true)
      form.reset()
      setPaymentMethod(paymentOptions[0].id)
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo otra vez o escríbenos por WhatsApp.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page">
      <section className="carrito-section">
        <div className="carrito-hero">
          <div>
            <p className="eyebrow">Compra segura</p>
            <h1>Carrito y pago</h1>
            <p>
              Reúne tus productos, confirma tus datos y elige cómo prefieres pagar. Los datos de tarjeta se manejan solo por una pasarela segura externa.
            </p>
          </div>
          <div className="carrito-hero__badge">
            <PiShoppingCartSimpleDuotone size={22} />
            <span>{productCount} productos</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="carrito-empty-layout">
            <div className="carrito-vacio">
              <div className="carrito-vacio__icon">
                <PiShoppingCartSimpleDuotone size={42} />
              </div>
              <p className="carrito-vacio__kicker">Tu carrito está vacío</p>
              <h2>Empieza explorando una categoría.</h2>
              <p>
                Cuando agregues productos, los verás aquí con cantidades, resumen y opciones de pago seguro.
              </p>
              <div className="carrito-vacio__actions">
                <Link to="/" className="button button--primary">
                  Ver productos <ArrowRight size={16} />
                </Link>
                <Link to="/contacto" className="button button--soft">
                  Solicitar asesoría
                </Link>
              </div>
            </div>

            <aside className="carrito-summary">
              <h3>Compra protegida</h3>
              <div className="carrito-secure-list">
                <span><PiLockKeyDuotone size={20} /> No guardamos tarjetas</span>
                <span><PiShieldCheckDuotone size={20} /> Confirmación manual del pedido</span>
                <span><PiTruckDuotone size={20} /> Instalación y entrega coordinadas</span>
              </div>
              <div className="carrito-summary__note">
                <PiLightbulbFilamentDuotone size={18} />
                Para pagos con tarjeta se debe usar un enlace de pago certificado, nunca campos de tarjeta en esta pantalla.
              </div>
            </aside>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="checkout-card">
                <div className="checkout-card__header">
                  <div>
                    <p className="eyebrow">Tu selección</p>
                    <h2>Productos en carrito</h2>
                  </div>
                  <button type="button" className="checkout-clear" onClick={handleClear}>Vaciar carrito</button>
                </div>

                <div className="cart-items-list">
                  {items.map((item) => (
                    <article className="cart-line" key={item.id}>
                      <Link to={`/productos/${item.id}`} className="cart-line__image">
                        {item.image ? <img src={optimizeImage(item.image, { width: 360 })} alt={item.name} /> : <span>Foto pendiente</span>}
                      </Link>
                      <div className="cart-line__body">
                        <p>{item.category || 'Producto FORMAS'}</p>
                        <Link to={`/productos/${item.id}`}>{item.name}</Link>
                        <span>{item.size}</span>
                      </div>
                      <div className="cart-line__qty">
                        <label>
                          Cantidad
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => handleQuantity(item.id, event.target.value)}
                          />
                        </label>
                      </div>
                      <div className="cart-line__price">
                        <strong>{parseMoney(item.price) ? formatMoney(getItemTotal(item)) : 'Cotizar'}</strong>
                        <button type="button" onClick={() => handleRemove(item.id)} aria-label={`Quitar ${item.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <form className="checkout-card checkout-form" onSubmit={handleCheckout}>
                <div className="checkout-card__header">
                  <div>
                    <p className="eyebrow">Datos de contacto</p>
                    <h2>Coordinar compra</h2>
                  </div>
                  <span className="checkout-lock"><PiLockKeyDuotone size={18} /> Seguro</span>
                </div>

                <div className="checkout-form-grid">
                  <label>Nombre completo<input name="name" required placeholder="Tu nombre" /></label>
                  <label>Teléfono / WhatsApp<input name="phone" required placeholder="300 000 0000" /></label>
                  <label>Correo electrónico<input name="email" type="email" required placeholder="correo@ejemplo.com" /></label>
                  <label>Ciudad<input name="city" placeholder="Medellín, Bogotá..." /></label>
                  <label className="checkout-colspan">Dirección o sector<input name="address" placeholder="Opcional para estimar entrega e instalación" /></label>
                  <label className="checkout-colspan">Notas del proyecto<textarea name="notes" rows="4" placeholder="Medidas, material, color, fecha ideal de entrega..." /></label>
                </div>

                <div className="payment-options">
                  <p className="payment-options__title">Método de pago preferido</p>
                  {paymentOptions.map((option) => {
                    const Icon = option.icon

                    return (
                      <label className={`payment-option ${paymentMethod === option.id ? 'active' : ''}`} key={option.id}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.id}
                          checked={paymentMethod === option.id}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <Icon size={28} />
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.text}</small>
                        </span>
                      </label>
                    )
                  })}
                </div>

                {error && <p className="checkout-message checkout-message--error">{error}</p>}
                {sent && <p className="checkout-message">Solicitud enviada. Te contactaremos para confirmar disponibilidad, medidas y enlace de pago seguro.</p>}

                <button className="button button--primary checkout-submit" type="submit" disabled={sending}>
                  {sending ? 'Enviando solicitud...' : 'Solicitar pago seguro'}
                </button>
              </form>
            </div>

            <aside className="carrito-summary checkout-summary">
              <h3>Resumen</h3>
              <div className="carrito-summary__row">
                <span>Productos</span>
                <strong>{productCount}</strong>
              </div>
              <div className="carrito-summary__row">
                <span>Precio antes de IVA</span>
                <strong>{hasPricedItems ? formatMoney(priceBeforeIva) : 'Por cotizar'}</strong>
              </div>
              <div className="carrito-summary__row">
                <span>IVA ({Math.round(IVA_RATE * 100)}%)</span>
                <strong>{hasPricedItems ? formatMoney(ivaAmount) : 'Por cotizar'}</strong>
              </div>
              <div className="checkout-total">
                <span>Total con IVA</span>
                <strong>{hasPricedItems ? formatMoney(totalWithIva) : 'Cotización personalizada'}</strong>
              </div>
              <div className="carrito-summary__note">
                <PiShieldCheckDuotone size={18} />
                FORMAS no solicita claves ni códigos. Los pagos con tarjeta se completan únicamente por enlace seguro de pasarela.
              </div>
            </aside>
          </div>
        )}

        <div className="carrito-steps">
          <article>
            <PiClipboardTextDuotone size={22} />
            <h3>Confirmamos</h3>
            <p>Validamos medidas, acabados, disponibilidad y alcance del proyecto.</p>
          </article>
          <article>
            <PiRulerDuotone size={22} />
            <h3>Personalizamos</h3>
            <p>Ajustamos propuesta, entrega e instalación según tu espacio.</p>
          </article>
          <article>
            <PiCheckCircleDuotone size={22} />
            <h3>Pagas seguro</h3>
            <p>Te enviamos la opción de pago acordada sin almacenar datos sensibles.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Carrito
