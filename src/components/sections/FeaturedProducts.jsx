import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import { getActiveDiscount } from '../../utils/discounts'

function FeaturedProducts() {
  const [{ products, pageContent }] = useSiteContent()
  const section = pageContent.homeProducts
  const featuredProducts = products.filter((product) => product.featured && product.active !== false).slice(0, 8)

  return (
    <section className="featured-products">
      <div className="section-heading">
        <p className="eyebrow">{section.featuredEyebrow}</p>
        <h2>{section.featuredTitle}</h2>
        <p>{section.featuredDescription}</p>
      </div>

      <div className="product-grid">
        {featuredProducts.map((product) => {
          const discount = getActiveDiscount(product)

          return (
            <Link
              className="product-card"
              key={product.id}
              to={`/productos/${product.id}`}
              aria-label={`Ver producto ${product.name}`}
            >
              <div className="product-card__image">
                {discount && <span className="discount-badge">{discount.label}</span>}
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span>Foto pendiente</span>
                )}
              </div>

              <div className="product-card__body">
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                {discount ? (
                  <div className="product-price-stack">
                    <span>{discount.originalPrice}</span>
                    <strong>{discount.finalPrice}</strong>
                  </div>
                ) : (
                  <strong>{product.price}</strong>
                )}
                <span className="product-card__cta">Cotizar</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedProducts
