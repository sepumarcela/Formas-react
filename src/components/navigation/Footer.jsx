import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

function Footer() {
  const [{ categories, pageContent }] = useSiteContent()
  const visibleCategories = categories.filter((category) => category.active !== false)
  const logoImage = pageContent.homeProducts?.logoImage
  const logoHeight = pageContent.homeProducts?.logoHeight || 120

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {logoImage ? <img src={optimizeImage(logoImage, { width: 260 })} className="site-footer__brand-logo" alt="FORMAS" style={{ '--logo-height': `${Math.min(Number(logoHeight), 90)}px` }} /> : <div className="brand__text" style={{ color: '#fff', marginBottom: 16 }}>FORMAS</div>}
          <p>Diseñamos y fabricamos muebles premium para transformar tu hogar con estilo y funcionalidad.</p>
          <div className="site-footer__social">
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Facebook</a>
          </div>
        </div>

        <div className="site-footer__col">
          <h4>Productos</h4>
          <ul>
            {visibleCategories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link to={`/categorias/${cat.id}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Empresa</h4>
          <ul>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/proyectos">Proyectos</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Contacto</h4>
          <ul>
            <li>sac@formas.com</li>
            <li>+57 300 123 4567</li>
            <li>Medellín, Colombia</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        © 2026 FORMAS · Diseña tu estilo · Medellín, Colombia
      </div>
    </footer>
  )
}

export default Footer
