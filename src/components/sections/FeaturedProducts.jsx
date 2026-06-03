import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'

function FeaturedProducts() {
  const [{ products }] = useSiteContent()
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)

  return (
    <section className="featured-products">
      <div className="section-heading">
        <p className="eyebrow">Destacados de la semana</p>
        <h2>Lo más elegido por nuestros clientes</h2>
        <p>
          Diseños funcionales, modernos y listos para inspirar nuevos espacios.
        </p>
      </div>

      <div className="product-grid">
        {featuredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-card__image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <span>Foto pendiente</span>
              )}
            </div>

            <div className="product-card__body">
              <p>{product.category}</p>
              <h3>{product.name}</h3>
              <strong>{product.price}</strong>
              <Link to="/contacto">Cotizar</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
