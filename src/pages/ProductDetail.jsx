import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Clock, Headphones, Ruler, Sparkles } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'

function ProductDetail() {
  const { productId } = useParams()
  const [{ categories, products }] = useSiteContent()
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return (
      <main className="page product-detail-page">
        <section className="product-not-found">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscas no existe o fue movido.</p>
          <Link to="/" className="button button--primary">Volver al inicio</Link>
        </section>
      </main>
    )
  }

  const category = categories.find((item) => item.id === product.categoryId)
  const related = products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 3)
  const description = product.description || category?.description || 'Diseño funcional fabricado a la medida para adaptarse a tu espacio, tu estilo y tus necesidades.'
  const specs = [
    { label: 'Categoría', value: product.category || category?.name },
    { label: 'Medidas', value: product.size },
    { label: 'Material', value: product.material || 'A definir' },
    { label: 'Color/acabado', value: product.color || 'Personalizable' },
    { label: 'Entrega', value: product.leadTime || 'Según proyecto' },
  ].filter((item) => item.value)

  return (
    <main className="page product-detail-page">
      <section className="product-hero-detail">
        <div className="product-hero-detail__inner">
          <div className="product-gallery">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-gallery__placeholder">Foto pendiente</div>
            )}
          </div>

          <div className="product-summary">
            <div className="breadcrumb product-breadcrumb">
              <Link to="/">Inicio</Link> &rsaquo; <Link to={`/categorias/${product.categoryId}`}>{category?.name || 'Productos'}</Link> &rsaquo; {product.name}
            </div>
            <Link to={`/categorias/${product.categoryId}`} className="product-back"><ArrowLeft size={16} /> Volver a la categoría</Link>
            <p className="admin-kicker">{product.category || category?.name}</p>
            <h1>{product.name}</h1>
            <p className="product-summary__desc">{description}</p>

            <div className="product-price-box">
              <span>Precio referencial</span>
              <strong>{product.price || 'Cotizar'}</strong>
            </div>

            <div className="product-feature-row">
              <span><Ruler size={16} /> {product.size || 'A medida'}</span>
              <span><Sparkles size={16} /> Personalizable</span>
              <span><BadgeCheck size={16} /> Fabricación local</span>
            </div>

            <div className="product-actions">
              <Link to="/contacto" className="button button--primary">Cotizar este producto</Link>
              <Link to="/carrito" className="button button--outline">Agregar al carrito</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="product-detail-grid">
          <article className="product-detail-card product-detail-card--wide">
            <p className="admin-kicker">Detalles</p>
            <h2>Información del producto</h2>
            <p>{description}</p>
            <div className="product-spec-grid">
              {specs.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="product-detail-card">
            <p className="admin-kicker">Acompañamiento</p>
            <h2>Hecho para tu espacio</h2>
            <ul className="product-service-list">
              <li><BadgeCheck size={18} /> Diseño personalizado</li>
              <li><Clock size={18} /> Planeación por etapas</li>
              <li><Headphones size={18} /> Asesoría durante el proceso</li>
            </ul>
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <div className="section-heading">
            <p className="eyebrow">También puede gustarte</p>
            <h2>Más opciones de esta línea</h2>
          </div>
          <div className="cat-products-grid">
            {related.map((item) => (
              <article className="cat-product-card" key={item.id}>
                <div className="cat-product-card__image">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span>Foto pendiente</span>}
                </div>
                <div className="cat-product-card__body">
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
                  <p>{item.size}</p>
                  <Link to={`/productos/${item.id}`} className="cat-product-card__btn">Ver producto</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductDetail
