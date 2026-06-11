import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PiCheckCircleDuotone, PiClipboardTextDuotone, PiLightbulbFilamentDuotone, PiRulerDuotone, PiShoppingCartSimpleDuotone } from 'react-icons/pi'

function Carrito() {
  const items = []

  return (
    <main className="page">
      <section className="carrito-section">
        <div className="carrito-hero">
          <div>
            <p className="eyebrow">Tu carrito</p>
            <h1>Carrito de cotización</h1>
            <p>
              Reúne los muebles que te interesan y solicita una propuesta a la medida de tu espacio.
            </p>
          </div>
          <div className="carrito-hero__badge">
            <PiShoppingCartSimpleDuotone size={22} />
            <span>{items.length} productos</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="carrito-empty-layout">
            <div className="carrito-vacio">
              <div className="carrito-vacio__icon">
                <PiShoppingCartSimpleDuotone size={42} />
              </div>
              <p className="carrito-vacio__kicker">Aún no has agregado productos</p>
              <h2>Empieza explorando una categoría.</h2>
              <p>
                Cuando agregues un producto, lo verás aquí con sus detalles para solicitar la cotización.
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
              <h3>Resumen</h3>
              <div className="carrito-summary__row">
                <span>Productos</span>
                <strong>{items.length}</strong>
              </div>
              <div className="carrito-summary__row">
                <span>Subtotal estimado</span>
                <strong>$0</strong>
              </div>
              <div className="carrito-summary__note">
                <PiLightbulbFilamentDuotone size={18} />
                El valor final depende de medidas, acabados e instalación.
              </div>
            </aside>
          </div>
        ) : (
          <div className="carrito-items">
            {/* Aqui iran los productos agregados */}
          </div>
        )}

        <div className="carrito-steps">
          <article>
            <PiClipboardTextDuotone size={22} />
            <h3>Elige</h3>
            <p>Selecciona los muebles que quieres cotizar.</p>
          </article>
          <article>
            <PiRulerDuotone size={22} />
            <h3>Personaliza</h3>
            <p>Compartes medidas, materiales y necesidades.</p>
          </article>
          <article>
            <PiCheckCircleDuotone size={22} />
            <h3>Recibe propuesta</h3>
            <p>Te enviamos una cotización clara para avanzar.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Carrito
