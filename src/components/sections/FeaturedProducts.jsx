import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'

function FeaturedProducts() {
  const [{ products, pageContent }] = useSiteContent()
  const section = pageContent.homeProducts
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)

  return (
    <section className="featured-products">
      <div className="section-heading">
        <p className="eyebrow">{section.featuredEyebrow}</p>
        <h2>{section.featuredTitle}</h2>
        <p>{section.featuredDescription}</p>
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
