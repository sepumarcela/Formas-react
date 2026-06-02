import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight } from 'lucide-react'

function Carrito() {
  // Por ahora el carrito está vacío. Más adelante se conecta con estado global.
  const items = []

  return (
    <main className="page">
      <section className="carrito-section">
        <div className="section-heading">
          <p className="eyebrow">Tu carrito</p>
          <h2>Carrito de cotización</h2>
        </div>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <ShoppingCart size={48} strokeWidth={1.2} />
            <h3>Tu carrito está vacío</h3>
            <p>Explora nuestras categorías y agrega los productos que te interesen para cotizar.</p>
            <Link to="/" className="button button--primary">
              Ver productos <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="carrito-items">
            {/* Aquí irían los productos agregados */}
          </div>
        )}
      </section>
    </main>
  )
}

export default Carrito