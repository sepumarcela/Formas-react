import { Link, useParams } from 'react-router-dom'
import { PencilRuler, BadgeCheck, Truck, Headphones } from 'lucide-react'
import { categories } from '../data/categories'

// Productos de muestra por categoría (reemplaza imágenes y precios cuando los tengas)
const productsByCategory = {
  'centros-entretenimiento': [
    { name: 'Centro Minimalista', price: 'Desde $1.150.000', size: '200 x 40 x 180 cm' },
    { name: 'Centro Moderno', price: 'Desde $1.350.000', size: '220 x 40 x 190 cm' },
    { name: 'Centro Clásico', price: 'Desde $1.250.000', size: '200 x 45 x 185 cm' },
    { name: 'Centro Industrial', price: 'Desde $1.450.000', size: '220 x 45 x 200 cm' },
    { name: 'Centro Esquinero', price: 'Desde $1.180.000', size: '160 x 50 x 180 cm' },
    { name: 'Centro Flotante', price: 'Desde $980.000', size: '180 x 35 x 170 cm' },
  ],
  'centros-estudio': [
    { name: 'Centro de Estudio Minimalista', price: 'Desde $890.000', size: '120 x 60 x 200 cm' },
    { name: 'Centro de Estudio Moderno', price: 'Desde $1.050.000', size: '140 x 60 x 210 cm' },
    { name: 'Centro Compacto', price: 'Desde $750.000', size: '100 x 55 x 185 cm' },
    { name: 'Centro en L', price: 'Desde $1.250.000', size: '160 x 120 x 200 cm' },
    { name: 'Centro Flotante', price: 'Desde $920.000', size: '130 x 50 x 200 cm' },
    { name: 'Centro Doble', price: 'Desde $1.480.000', size: '200 x 60 x 210 cm' },
  ],
  'closets': [
    { name: 'Closet con Puertas de Vidrio', price: 'Desde $2.850.000', size: 'A medida' },
    { name: 'Closet Minimalista', price: 'Desde $2.250.000', size: 'A medida' },
    { name: 'Closet Vestier Abierto', price: 'Desde $3.150.000', size: 'A medida' },
    { name: 'Closet Puertas Corredizas', price: 'Desde $2.050.000', size: 'A medida' },
    { name: 'Closet Esquinero', price: 'Desde $2.650.000', size: 'A medida' },
    { name: 'Closet Enchapado', price: 'Desde $2.350.000', size: 'A medida' },
  ],
  'cocinas': [
    { name: 'Cocina Moderna con Isla', price: 'Desde $12.500.000', size: 'A medida' },
    { name: 'Cocina Minimalista', price: 'Desde $10.800.000', size: 'A medida' },
    { name: 'Cocina en L', price: 'Desde $11.200.000', size: 'A medida' },
    { name: 'Cocina Abierta', price: 'Desde $11.900.000', size: 'A medida' },
    { name: 'Cocina Contemporánea', price: 'Desde $13.200.000', size: 'A medida' },
    { name: 'Cocina con Comedor', price: 'Desde $12.800.000', size: 'A medida' },
  ],
  'muebles-baño': [
    { name: 'Mueble de Baño Minimalista', price: 'Desde $1.250.000', size: 'A medida' },
    { name: 'Mueble Flotante', price: 'Desde $1.380.000', size: 'A medida' },
    { name: 'Mueble Moderno', price: 'Desde $1.450.000', size: 'A medida' },
    { name: 'Mueble Contemporáneo', price: 'Desde $1.320.000', size: 'A medida' },
    { name: 'Mueble Nórdico', price: 'Desde $1.280.000', size: 'A medida' },
    { name: 'Mueble Premium', price: 'Desde $1.580.000', size: 'A medida' },
  ],
  'repisas': [
    { name: 'Repisa Flotante Minimal', price: 'Desde $180.000', size: '80 x 20 x 3.6 cm' },
    { name: 'Repisa Esquinera', price: 'Desde $210.000', size: '60 x 60 x 3.6 cm' },
    { name: 'Repisa Modular Cubo', price: 'Desde $250.000', size: '90 x 25 x 90 cm' },
    { name: 'Repisa con Luz LED', price: 'Desde $260.000', size: '100 x 20 x 3.6 cm' },
    { name: 'Repisa Industrial', price: 'Desde $280.000', size: '100 x 25 x 80 cm' },
    { name: 'Repisa Decorativa', price: 'Desde $230.000', size: '120 x 20 x 3.6 cm' },
  ],
  'alcobas-infantiles': [
    { name: 'Alcoba Dulce Sueño', price: 'Desde $8.900.000', size: 'Cama, escritorio y closet' },
    { name: 'Alcoba Explorador', price: 'Desde $9.500.000', size: 'Cama, escritorio y closet' },
    { name: 'Alcoba Natura', price: 'Desde $8.700.000', size: 'Cama, escritorio y closet' },
    { name: 'Alcoba Compacta', price: 'Desde $9.200.000', size: 'Cama, escritorio y closet' },
    { name: 'Alcoba Princesa', price: 'Desde $8.800.000', size: 'Cama, escritorio y closet' },
    { name: 'Alcoba Héroes', price: 'Desde $9.300.000', size: 'Cama, escritorio y closet' },
  ],
  'bibliotecas': [
    { name: 'Biblioteca Minimalista', price: 'Desde $850.000', size: '120 x 200 x 30 cm' },
    { name: 'Biblioteca Clásica', price: 'Desde $1.150.000', size: '180 x 220 x 35 cm' },
    { name: 'Biblioteca Moderna', price: 'Desde $980.000', size: '150 x 210 x 30 cm' },
    { name: 'Biblioteca Industrial', price: 'Desde $1.250.000', size: '160 x 210 x 35 cm' },
    { name: 'Biblioteca Esquinera', price: 'Desde $1.080.000', size: '140 x 200 x 30 cm' },
    { name: 'Biblioteca a Medida', price: 'Desde $950.000', size: 'A medida' },
  ],
}

const badges = [
  { icon: PencilRuler, label: 'Diseños personalizados' },
  { icon: BadgeCheck, label: 'Materiales de calidad' },
  { icon: Truck, label: 'Instalación profesional' },
  { icon: Headphones, label: 'Acompañamiento total' },
]

function CategoryDetail() {
  const { categoryId } = useParams()
  const category = categories.find((item) => item.id === categoryId)

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

  const products = productsByCategory[category.id] || []

  return (
    <main className="page">
      {/* HERO */}
      <section className="page-hero" style={{ padding: 0 }}>
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
            {badges.map((b) => {
              const Icon = b.icon
              return (
                <div className="cat-badge" key={b.label}>
                  <Icon size={16} strokeWidth={1.6} />
                  {b.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FILTROS */}
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

      {/* GRILLA PRODUCTOS */}
      <section style={{ background: 'var(--color-bg)' }}>
        <div className="cat-products-grid">
          {products.map((prod) => (
            <article className="cat-product-card" key={prod.name}>
              <div className="cat-product-card__image">
                <span>Foto pendiente</span>
              </div>
              <div className="cat-product-card__body">
                <h3>{prod.name}</h3>
                <strong>{prod.price}</strong>
                <p>{prod.size}</p>
                <Link to="/contacto" className="cat-product-card__btn">Ver producto</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FRANJA INFERIOR */}
      <div className="cat-bottom-bar">
        <div className="cat-bottom-bar__inner">
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div className="cat-bottom-item" key={b.label}>
                <Icon size={30} strokeWidth={1.5} />
                <div>
                  <h5>{b.label}</h5>
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