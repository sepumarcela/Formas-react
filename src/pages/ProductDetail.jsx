import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { PiCheckCircleDuotone, PiClockDuotone, PiFactoryDuotone, PiHandshakeDuotone, PiRulerDuotone, PiSketchLogoDuotone } from 'react-icons/pi'
import { useSiteContent } from '../hooks/useSiteContent'
import { addCartItem } from '../utils/cart'
import { getActiveDiscount } from '../utils/discounts'
import { API_BASE_URL } from '../api/cmsApi'
import { optimizeImage } from '../utils/images'

const relatedWindowSize = 3

function technicalSheetUrl(value) {
  if (!value) return ''
  const cleanValue = value.split('?')[0]
  if (cleanValue.includes('/api/technical-sheets/')) return value
  if (!cleanValue.toLowerCase().endsWith('.pdf')) return value

  const fileName = cleanValue.split('/').filter(Boolean).pop()
  return fileName ? `${API_BASE_URL}/api/technical-sheets/${encodeURIComponent(decodeURIComponent(fileName))}` : value
}

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [{ categories, products }] = useSiteContent()
  const [relatedStart, setRelatedStart] = useState(0)
  const product = products.find((item) => item.id === productId && item.active !== false)

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
  const discount = getActiveDiscount(product)
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id && item.active !== false)
  const visibleRelated = related.slice(relatedStart, relatedStart + relatedWindowSize)
  const canGoBack = relatedStart > 0
  const canGoNext = relatedStart + relatedWindowSize < related.length
  const description = product.description || category?.description || 'Diseño funcional fabricado a la medida para adaptarse a tu espacio, tu estilo y tus necesidades.'
  const technicalSheetViewerUrl = technicalSheetUrl(product.technicalSheet)
  const specs = [
    { label: 'Categoría', value: product.category || category?.name },
    { label: 'Medidas', value: product.size },
    { label: 'Material', value: product.material || 'A definir' },
    { label: 'Color/acabado', value: product.color || 'Personalizable' },
    { label: 'Entrega', value: product.leadTime || 'Según proyecto' },
  ].filter((item) => item.value)

  function moveRelated(direction) {
    setRelatedStart((current) => {
      const next = current + direction
      const max = Math.max(related.length - relatedWindowSize, 0)
      return Math.min(Math.max(next, 0), max)
    })
  }

  function handleAddToCart() {
    addCartItem(product)
    navigate('/carrito')
  }

  return (
    <main className="page product-detail-page">
      <section className="product-hero-detail">
        <div className="product-hero-detail__inner">
          <div className="product-gallery">
            {discount && <span className="discount-badge discount-badge--detail">{discount.label}</span>}
            {product.image ? (
              <img src={optimizeImage(product.image, { width: 1400 })} alt={product.name} />
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
              <span>{discount ? `Oferta vigente: ${discount.percent}%` : 'Precio referencial'}</span>
              {discount ? (
                <>
                  <del>{discount.originalPrice}</del>
                  <strong>{discount.finalPrice}</strong>
                </>
              ) : (
                <strong>{product.price || 'Cotizar'}</strong>
              )}
            </div>

            <div className="product-feature-row">
              <span><PiRulerDuotone size={16} /> {product.size || 'A medida'}</span>
              <span><PiSketchLogoDuotone size={16} /> Personalizable</span>
              <span><PiFactoryDuotone size={16} /> Fabricación local</span>
            </div>

            <div className="product-actions">
              <Link to="/contacto" className="button button--primary">Cotizar este producto</Link>
              <button type="button" className="button button--cart" onClick={handleAddToCart}>Agregar al carrito</button>
            </div>
            <section className={`product-technical-card${technicalSheetViewerUrl ? '' : ' product-technical-card--disabled'}`}>
              {technicalSheetViewerUrl ? (
                <a
                  className="product-technical-card__download"
                  href={`/ficha-tecnica?url=${encodeURIComponent(technicalSheetViewerUrl)}&name=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={"Abrir ficha técnica de " + product.name}
                >
                  VER PDF <span aria-hidden="true">→</span>
                </a>
              ) : (
                <span className="product-technical-card__download product-technical-card__download--disabled">PDF PENDIENTE</span>
              )}
              <div className="product-technical-card__body">
                <p className="product-technical-card__title">FICHA TÉCNICA</p>
                <p className="product-technical-card__description">Consulta medidas, materiales. Acabados y especificaciones del producto</p>
              </div>
            </section>
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
              <li><PiCheckCircleDuotone size={18} /> Diseño personalizado</li>
              <li><PiClockDuotone size={18} /> Planeación por etapas</li>
              <li><PiHandshakeDuotone size={18} /> Asesoría durante el proceso</li>
            </ul>
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <div className="product-related__header">
            <div>
              <p className="eyebrow">También puede gustarte</p>
              <h2>Más productos de esta categoría</h2>
            </div>
            {related.length > relatedWindowSize && (
              <div className="product-related__controls">
                <button onClick={() => moveRelated(-1)} disabled={!canGoBack} aria-label="Ver productos anteriores">
                  <ChevronLeft size={20} />
                </button>
                <span>{Math.min(relatedStart + 1, related.length)}-{Math.min(relatedStart + relatedWindowSize, related.length)} de {related.length}</span>
                <button onClick={() => moveRelated(1)} disabled={!canGoNext} aria-label="Ver más productos">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="product-related__track">
            {visibleRelated.map((item) => {
              const relatedDiscount = getActiveDiscount(item)

              return (
                <Link
                  className="cat-product-card"
                  key={item.id}
                  to={`/productos/${item.id}`}
                  aria-label={`Ver producto ${item.name}`}
                >
                  <div className="cat-product-card__image">
                    {relatedDiscount && <span className="discount-badge">{relatedDiscount.label}</span>}
                    {item.image ? <img src={optimizeImage(item.image, { width: 700 })} alt={item.name} loading="lazy" /> : <span>Foto pendiente</span>}
                  </div>
                  <div className="cat-product-card__body">
                    <h3>{item.name}</h3>
                    {relatedDiscount ? (
                      <div className="product-price-stack">
                        <span>{relatedDiscount.originalPrice}</span>
                        <strong>{relatedDiscount.finalPrice}</strong>
                      </div>
                    ) : (
                      <strong>{item.price}</strong>
                    )}
                    <p>{item.size}</p>
                    <span className="cat-product-card__btn">Ver producto</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductDetail
