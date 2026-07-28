import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PiDiamondDuotone, PiHandshakeDuotone, PiRulerDuotone, PiToolboxDuotone } from 'react-icons/pi'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage, preloadImage } from '../utils/images'
import { isPublicCategoryVisible } from '../config/features'

const badges = [
  { icon: PiRulerDuotone, label: 'Dise\u00f1os personalizados' },
  { icon: PiDiamondDuotone, label: 'Materiales de calidad' },
  { icon: PiToolboxDuotone, label: 'Instalaci\u00f3n profesional' },
  { icon: PiHandshakeDuotone, label: 'Acompa\u00f1amiento total' },
]

function CategoryDetail() {
  const { categoryId } = useParams()
  const [{ categories, products }] = useSiteContent()
  const category = categories.find((item) => item.id === categoryId && isPublicCategoryVisible(item))
  const heroImage = category?.image ? optimizeImage(category.image, { width: 1800 }) : ''

  useEffect(() => {
    preloadImage(heroImage)
  }, [heroImage])

  if (!category) {
    return (
      <main className="page section-page" style={{ padding: '120px 60px', textAlign: 'center' }}>
        <h1>Categor\u00eda no encontrada</h1>
        <p>La categor\u00eda que buscas no existe o fue movida.</p>
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
          <div className="page-hero__bg"><img src={heroImage} alt={category.name} loading="eager" decoding="async" fetchPriority="high" /></div>
        ) : (
          <div className="page-hero__bg-ph" />
        )}
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> {'>'} <span>Productos</span> {'>'} {category.name}</div>
          <h1>{category.name}</h1>
          <div className="page-hero__line" />
          <p>{category.description}</p>
        </div>
      </section>

      <div className="cat-filtros cat-filtros--badges">
        <div className="cat-filtros__inner">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div className="cat-badge cat-badge--bar" key={badge.label}>
                <Icon size={18} />
                {badge.label}
              </div>
            )
          })}
        </div>
      </div>

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="cat-products-grid">
          {categoryProducts.map((product) => (
            <Link
              className="cat-product-card"
              key={product.id}
              to={`/productos/${product.id}`}
              aria-label={`Ver producto ${product.name}`}
            >
              <div className="cat-product-card__image">
                {product.image ? <img src={optimizeImage(product.image, { width: 700 })} alt={product.name} loading="lazy" /> : <span>Foto pendiente</span>}
              </div>
              <div className="cat-product-card__body">
                <h3>{product.name}</h3>
                <p>{product.size}</p>
                <span className="cat-product-card__btn">Ver producto</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default CategoryDetail
