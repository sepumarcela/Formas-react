import { Bath, Bed, BookOpen, CookingPot, Monitor, PanelsTopLeft, PencilRuler, Rows3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'

const categoryIcons = {
  tv: Monitor,
  desk: PencilRuler,
  closet: PanelsTopLeft,
  kitchen: CookingPot,
  bath: Bath,
  shelf: Rows3,
  bed: Bed,
  book: BookOpen,
}

function CategoryShowcase() {
  const [{ categories, pageContent }] = useSiteContent()
  const section = pageContent.homeProducts

  return (
    <section className="category-showcase">
      <div className="section-heading">
        <p className="eyebrow">{section.categoriesEyebrow}</p>
        <h2>{section.categoriesTitle}</h2>
        <p>{section.categoriesDescription}</p>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon] || Rows3

          return (
            <article className="category-card" key={category.id}>
              <div className="category-card__image">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="photo-placeholder">
                    <Icon size={34} strokeWidth={1.6} />
                    <span>Foto pendiente</span>
                  </div>
                )}
              </div>

              <div className="category-card__body">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <Link to={`/categorias/${category.id}`}>Ver categoría</Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryShowcase
