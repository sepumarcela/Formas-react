import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'

function Footer() {
  const [{ categories }] = useSiteContent()
  const visibleCategories = categories.filter((category) => category.active !== false)

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* Reemplaza por <img src="/logo-blanco.png" className="site-footer__brand-logo" /> cuando tengas el logo */}
          <div className="brand__text" style={{ color: '#fff', marginBottom: 16 }}>FORMAS</div>
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
            <li>hola@formas.com</li>
            <li>+57 300 123 4567</li>
            <li>Cartagena, Colombia</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        © 2026 FORMAS · Diseña tu estilo · Cartagena, Colombia
      </div>
    </footer>
  )
}

export default Footer
