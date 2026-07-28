import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import {
  PiBathtubDuotone,
  PiBedDuotone,
  PiBookOpenTextDuotone,
  PiCookingPotDuotone,
  PiGridFourDuotone,
  PiRulerDuotone,
  PiSparkleDuotone,
  PiSquaresFourDuotone,
  PiTelevisionDuotone,
} from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'
import { printCatalogPdf } from '../utils/catalogPdf'
import { isPublicCategoryVisible, isPublicProductVisible } from '../config/features'

const categoryIcons = {
  tv: PiTelevisionDuotone,
  desk: PiRulerDuotone,
  closet: PiSquaresFourDuotone,
  kitchen: PiCookingPotDuotone,
  bath: PiBathtubDuotone,
  shelf: PiGridFourDuotone,
  bed: PiBedDuotone,
  book: PiBookOpenTextDuotone,
}

function Productos() {
  const [{ categories, products, pageContent }] = useSiteContent()
  const page = pageContent.productos
  const visibleCategories = categories.filter(isPublicCategoryVisible)
  const visibleProducts = products.filter(isPublicProductVisible)
  const featuredProducts = visibleProducts.filter((product) => product.featured).slice(0, 4)

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Productos" />

      <section className="products-overview">
        <div className="section-heading">
          <p className="eyebrow">Categorías</p>
          <h2>Soluciones para cada espacio</h2>
          <p>Explora nuestras líneas y entra a cada categoría para ver los productos disponibles.</p>
          <button
            type="button"
            className="products-catalog-download"
            onClick={() => printCatalogPdf({ categories: visibleCategories, products: visibleProducts, pageContent })}
          >
            <Download size={16} />
            Descargar catálogo PDF
          </button>
        </div>

        <div className="products-category-list">
          {visibleCategories.map((category) => {
            const Icon = categoryIcons[category.icon] || PiGridFourDuotone
            const categoryProducts = visibleProducts.filter((product) => product.categoryId === category.id)

            return (
              <Link
                className="products-category-card"
                key={category.id}
                to={`/categorias/${category.id}`}
                aria-label={`Ver categoría ${category.name}`}
              >
                <div className="products-category-card__media">
                  {category.image ? <img src={optimizeImage(category.image, { width: 800 })} alt={category.name} loading="lazy" /> : <Icon size={48} />}
                </div>
                <div className="products-category-card__body">
                  <span>{categoryProducts.length} producto{categoryProducts.length === 1 ? '' : 's'}</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <strong>Ver categoría</strong>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="products-featured-band">
        <div className="products-featured-band__text">
          <p className="eyebrow">Destacados</p>
          <h2>Los favoritos para empezar</h2>
          <p>Una selección rápida de productos que suelen inspirar nuevos proyectos.</p>
        </div>

        <div className="products-featured-mini">
          {featuredProducts.map((product) => (
            <Link className="products-featured-mini__item" to={`/productos/${product.id}`} key={product.id}>
              <div>
                {product.image ? <img src={optimizeImage(product.image, { width: 500 })} alt={product.name} loading="lazy" /> : <PiSparkleDuotone size={28} />}
              </div>
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Productos
