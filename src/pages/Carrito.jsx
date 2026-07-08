import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { createCustomerOrder, createWompiCheckout } from '../api/cmsApi'
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
import { submitCheckoutForm } from '../utils/payments'

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

function amountToCents(value) {
  return Math.round((Number(value) || 0) * 100)
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
  const [items, setItems] = useState(loadCartItems)
  const [quantityInputs, setQuantityInputs] = useState(() => Object.fromEntries(loadCartItems().map((item) => [item.id, String(item.quantity)])))
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const totalWithIva = useMemo(() => items.reduce((sum, item) => sum + getItemTotal(item), 0), [items])
  const { priceBeforeIva, ivaAmount } = useMemo(() => splitIncludedIva(totalWithIva), [totalWithIva])
  const hasPricedItems = totalWithIva > 0
  const productCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const quantityMap = useCallback((nextItems) => {
    return Object.fromEntries(nextItems.map((item) => [item.id, String(item.quantity)]))
  }, [])

  const syncCartItems = useCallback((nextItems) => {
    setItems(nextItems)
    setQuantityInputs(quantityMap(nextItems))
  }, [quantityMap])

  useEffect(() => {
    function syncCart(event) {
      syncCartItems(event.detail || loadCartItems())
    }

    function syncStorage(event) {
      if (event.storageArea === window.sessionStorage && (!event.key || event.key === 'formas-cart-v1')) {
        syncCartItems(loadCartItems())
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncStorage)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncStorage)
    }
  }, [syncCartItems])

  function handleQuantity(id, quantity) {
    setQuantityInputs((current) => ({ ...current, [id]: quantity }))
  }

  function commitQuantity(id, quantity) {
    const cleanQuantity = Math.max(Number(quantity) || 1, 1)
    setItems(updateCartItemQuantity(id, cleanQuantity))
    setQuantityInputs((current) => ({ ...current, [id]: String(cleanQuantity) }))
  }

  function stepQuantity(item, direction) {
    const nextQuantity = Math.max((Number(item.quantity) || 1) + direction, 1)
    setItems(updateCartItemQuantity(item.id, nextQuantity))
    setQuantityInputs((current) => ({ ...current, [item.id]: String(nextQuantity) }))
  }

  function handleRemove(id) {
    syncCartItems(removeCartItem(id))
  }

  function handleClear() {
    syncCartItems(clearCart())
  }

  async function handleCheckout(event) {
    event.preventDefault()
    if (!items.length) return

    const form = event.currentTarget
    const data = new FormData(form)

    setSending(true)
    setError('')

    try {
      if (hasPricedItems) {
        const checkout = await createWompiCheckout({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          city: data.get('city'),
          address: data.get('address'),
          notes: data.get('notes'),
          amountCents: amountToCents(totalWithIva),
          subtotalCents: amountToCents(priceBeforeIva),
          taxCents: amountToCents(ivaAmount),
          paymentMethod,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            category: item.category || '',
            image: item.image || '',
            quantity: item.quantity,
            unitAmountCents: amountToCents(parseMoney(item.price)),
          })),
        })

        if (checkout.configured && checkout.checkoutUrl && checkout.checkoutParams) {
          submitCheckoutForm(checkout.checkoutUrl, checkout.checkoutParams)
          return
        }

        setError(checkout.message || 'El pedido quedo registrado. Falta activar las llaves de Wompi para abrir pagos reales.')
        return
      }

      await createCustomerOrder({
        name: data.get('name'),
        phone: data.get('phone'),
        email: data.get('email'),
        city: data.get('city'),
        address: data.get('address'),
        notes: data.get('notes'),
        paymentMethod,
        amountCents: hasPricedItems ? amountToCents(totalWithIva) : null,
        subtotalCents: hasPricedItems ? amountToCents(priceBeforeIva) : null,
        taxCents: hasPricedItems ? amountToCents(ivaAmount) : null,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category || '',
          image: item.image || '',
          quantity: item.quantity,
          unitAmountCents: item.price ? amountToCents(parseMoney(item.price)) : null,
        })),
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
              Reúne tus productos, confirma tus datos y paga por una pasarela segura cuando el comercio de Formas Interiores quede activo.
            </p>
          </div>
          <div className="carrito-hero__badge">
            <PiShoppingCartSimpleDuotone size={22} />
            <span>{productCount} unidades</span>
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
                        <p>{item.category || 'Producto Formas Interiores'}</p>
                        <Link to={`/productos/${item.id}`}>{item.name}</Link>
                        <span>{item.size}</span>
                      </div>
                      <span className="cart-quantity-control">
                        <button type="button" onClick={() => stepQuantity(item, -1)} aria-label={`Reducir cantidad de ${item.name}`}>
                          -
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={quantityInputs[item.id] ?? String(item.quantity)}
                          onChange={(event) => handleQuantity(item.id, event.target.value)}
                          onBlur={(event) => commitQuantity(item.id, event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.currentTarget.blur()
                            }
                          }}
                        />
                        <button type="button" onClick={() => stepQuantity(item, 1)} aria-label={`Aumentar cantidad de ${item.name}`}>
                          +
                        </button>
                      </span>
                      <div className="cart-line__price">
                        <span className="cart-line__price-text">
                          <strong>{parseMoney(item.price) ? formatMoney(getItemTotal(item)) : 'Cotizar'}</strong>
                          {parseMoney(item.price) ? (
                            <small>
                              {item.quantity > 1
                                ? `${item.quantity} unidades x ${formatMoney(parseMoney(item.price))} c/u`
                                : `${formatMoney(parseMoney(item.price))} c/u`}
                            </small>
                          ) : (
                            <small>Cotización personalizada</small>
                          )}
                        </span>
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
                  <label>Teléfono / WhatsApp<input name="phone" type="tel" inputMode="numeric" pattern="[0-9]*" required placeholder="3000000000" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '') }} /></label>
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
                {sent && !hasPricedItems && <p className="checkout-message">Solicitud enviada. Te contactaremos para revisar los detalles de tu cotización.</p>}

                <button className="button button--primary checkout-submit" type="submit" disabled={sending}>
                  {sending ? 'Preparando pago...' : hasPricedItems ? 'Pagar con Wompi' : 'Solicitar cotización'}
                </button>
              </form>
            </div>

            <aside className="carrito-summary checkout-summary">
              <h3>Resumen</h3>
              <div className="carrito-summary__row">
                <span>Unidades</span>
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
                Formas Interiores no solicita claves ni códigos. Los pagos con tarjeta se completan únicamente por enlace seguro de pasarela.
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
