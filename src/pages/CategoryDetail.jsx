import { Link, useParams } from 'react-router-dom'
import { PiDiamondDuotone, PiHandshakeDuotone, PiRulerDuotone, PiToolboxDuotone } from 'react-icons/pi'
import { useSiteContent } from '../hooks/useSiteContent'
import { getActiveDiscount } from '../utils/discounts'

const badges = [
  { icon: PiRulerDuotone, label: 'Diseños personalizados' },
  { icon: PiDiamondDuotone, label: 'Materiales de calidad' },
  { icon: PiToolboxDuotone, label: 'Instalación profesional' },
  { icon: PiHandshakeDuotone, label: 'Acompañamiento total' },
]

function CategoryDetail() {
  const { categoryId } = useParams()
  const [{ categories, products }] = useSiteContent()
  const category = categories.find((item) => item.id === categoryId && item.active !== false)

  if (!category) {
    return (
      <main className="page section-page" style={{ padding: '120px 60px', textAlign: 'center' }}>
        <h1>Categoría no encontrada</h1>
        <p>La categoría que buscas no existe o fue movida.</p>
        <Link className="button button--primary" to="/" style={{ marginTop: 20 }}>
          Volver al inicio
        </Link>
      </main>
    )
  }

  const categoryProducts = products.filter((product) => product.categoryId === category.id && product.active !== false)

  return (
    <main className="page">
      <section className="page-hero">
        {category.image ? (
          <div className="page-hero__bg"><img src={category.image} alt={category.name} /></div>
        ) : (
          <div className="page-hero__bg-ph" />
        )}
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> › <span>Productos</span> › {category.name}</div>
          <h1>{category.name}</h1>
          <div className="page-hero__line" />
          <p>{category.description}</p>
          <div className="cat-badges">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <div className="cat-badge" key={badge.label}>
                  <Icon size={16} />
                  {badge.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="cat-filtros">
        <div className="cat-filtros__inner">
          <span className="cat-filtros__label">Filtrar por:</span>
          <select className="cat-filtro-select"><option>Estilo</option><option>Minimalista</option><option>Moderno</option><option>Clásico</option></select>
          <select className="cat-filtro-select"><option>Material</option><option>Madera natural</option><option>MDF</option><option>Melamina</option></select>
          <select className="cat-filtro-select"><option>Color</option><option>Madera clara</option><option>Blanco</option><option>Negro</option></select>
          <select className="cat-filtro-select"><option>Tamaño</option><option>Pequeño</option><option>Mediano</option><option>Grande</option></select>
          <div className="cat-filtros__orden">
            Ordenar por: <select className="cat-filtro-select"><option>Más recientes</option><option>Precio menor</option><option>Precio mayor</option></select>
          </div>
        </div>
      </div>

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="cat-products-grid">
          {categoryProducts.map((product) => {
            const discount = getActiveDiscount(product)

            return (
              <article className="cat-product-card" key={product.id}>
                <div className="cat-product-card__image">
                  {discount && <span className="discount-badge">{discount.label}</span>}
                  {product.image ? <img src={product.image} alt={product.name} /> : <span>Foto pendiente</span>}
                </div>
                <div className="cat-product-card__body">
                  <h3>{product.name}</h3>
                  {discount ? (
                    <div className="product-price-stack">
                      <span>{discount.originalPrice}</span>
                      <strong>{discount.finalPrice}</strong>
                    </div>
                  ) : (
                    <strong>{product.price}</strong>
                  )}
                  <p>{product.size}</p>
                  <Link to={`/productos/${product.id}`} className="cat-product-card__btn">Ver producto</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <div className="cat-bottom-bar">
        <div className="cat-bottom-bar__inner">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div className="cat-bottom-item" key={badge.label}>
                <Icon size={30} />
                <div>
                  <h5>{badge.label}</h5>
                  <p>Calidad y compromiso en cada proyecto.</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default CategoryDetail
