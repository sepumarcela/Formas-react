import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6'
import { PiBankDuotone, PiCreditCardDuotone, PiLockKeyDuotone, PiSealCheckDuotone, PiShieldCheckDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/formasinteriores', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/formasinteriores/', Icon: FaInstagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@formasinteriores', Icon: FaTiktok },
]

const trustBadges = [
  { label: 'Conexión Segura', detail: 'SSL/HTTPS', Icon: PiShieldCheckDuotone, tone: 'green' },
  { label: 'Empresa Verificada', detail: 'NIT 902039587-2', Icon: PiSealCheckDuotone, tone: 'blue' },
  { label: 'Datos Protegidos', detail: 'Ley 1581/2012', Icon: PiLockKeyDuotone, tone: 'cyan', href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
  { label: 'Pago Seguro', detail: 'Plataforma Wompi', Icon: PiCreditCardDuotone, tone: 'yellow' },
  { label: 'SIC', detail: 'Industria y Comercio', Icon: PiBankDuotone, tone: 'light', href: 'https://sedeelectronica.sic.gov.co/' },
]

function Footer() {
  const [{ categories, pageContent }] = useSiteContent()
  const visibleCategories = categories.filter((category) => category.active !== false)
  const logoImage = pageContent.homeProducts?.logoImage
  const logoHeight = pageContent.homeProducts?.logoHeight || 120

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {logoImage ? <img src={optimizeImage(logoImage, { width: 420 })} className="site-footer__brand-logo" alt="Formas Interiores" style={{ '--logo-height': Math.min(Number(logoHeight) + 20, 130) + 'px' }} /> : <div className="brand__text" style={{ color: '#fff', marginBottom: 16 }}>Formas Interiores</div>}
          <p>Diseñamos y fabricamos muebles premium para transformar tu hogar con estilo y funcionalidad.</p>
          <div className="site-footer__social" aria-label="Redes sociales de Formas Interiores">
            <span className="site-footer__social-label">Síguenos:</span>
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="site-footer__trust" aria-label="Compra segura">
            <h4>Compra segura</h4>
            <div className="site-footer__trust-grid">
              {trustBadges.map(({ label, detail, Icon, tone, href }) => {
                const content = (
                  <>
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                  </>
                )

                return href ? (
                  <a className={'site-footer__trust-badge site-footer__trust-badge--' + tone} key={label} href={href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <span className={'site-footer__trust-badge site-footer__trust-badge--' + tone} key={label}>
                    {content}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="site-footer__col site-footer__col--products">
          <h4>Productos</h4>
          <ul>
            {visibleCategories.map((cat) => (
              <li key={cat.id}>
                <Link to={'/categorias/' + cat.id}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--company">
          <h4>Empresa</h4>
          <ul>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/proyectos">Proyectos</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--contact">
          <h4>Contacto</h4>
          <ul>
            <li>contacto@formasinteriores.com</li>
            <li>+57 300 123 4567</li>
            <li>Medellín, Colombia</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        © 2026 Formas Interiores · Diseña tu estilo · Medellín, Colombia
      </div>
    </footer>
  )
}

export default Footer
