import { Link } from 'react-router-dom'
import { PiBathtubDuotone, PiBedDuotone, PiBookOpenTextDuotone, PiCookingPotDuotone, PiGridFourDuotone, PiRulerDuotone, PiSquaresFourDuotone, PiTelevisionDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'

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

function CategoryShowcase() {
  const [{ categories, pageContent }] = useSiteContent()
  const section = pageContent.homeProducts
  const visibleCategories = categories.filter((category) => category.active !== false)

  return (
    <section className="category-showcase">
      <div className="section-heading">
        <p className="eyebrow">{section.categoriesEyebrow}</p>
        <h2>{section.categoriesTitle}</h2>
        <p>{section.categoriesDescription}</p>
      </div>

      <div className="category-grid">
        {visibleCategories.map((category) => {
          const Icon = categoryIcons[category.icon] || PiGridFourDuotone

          return (
            <Link
              className="category-card"
              key={category.id}
              to={`/categorias/${category.id}`}
              aria-label={`Ver categorÃ­a ${category.name}`}
            >
              <div className="category-card__image">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="photo-placeholder">
                    <Icon size={34} />
                    <span>Foto pendiente</span>
                  </div>
                )}
              </div>

              <div className="category-card__body">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-card__link">Ver categoría</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryShowcase
