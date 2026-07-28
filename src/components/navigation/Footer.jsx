import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6'
import { PiBankDuotone, PiCreditCardDuotone, PiLockKeyDuotone, PiSealCheckDuotone, PiShieldCheckDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'
import { isPublicCategoryVisible, SHOW_PROJECTS_PAGE } from '../../config/features'
import { COMPANY_ADDRESS } from '../../config/company'

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/formasinteriores', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/formasinteriores/', Icon: FaInstagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@formasinteriores', Icon: FaTiktok },
]

const trustBadges = [
  { label: 'Conexi\u00f3n Segura', detail: 'SSL/HTTPS', Icon: PiShieldCheckDuotone, tone: 'green' },
  { label: 'Empresa Verificada', detail: 'NIT 902039587-2', Icon: PiSealCheckDuotone, tone: 'blue' },
  { label: 'Datos Protegidos', detail: 'Ley 1581/2012', Icon: PiLockKeyDuotone, tone: 'cyan', href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
  { label: 'Pago Seguro', detail: 'Plataforma Wompi', Icon: PiCreditCardDuotone, tone: 'yellow' },
  { label: 'SIC', detail: 'Industria y Comercio', Icon: PiBankDuotone, tone: 'light', href: 'https://sedeelectronica.sic.gov.co/' },
]

function Footer() {
  const [{ categories, pageContent }] = useSiteContent()
  const visibleCategories = categories.filter(isPublicCategoryVisible)
  const logoImage = pageContent.homeProducts?.logoImage
  const logoHeight = pageContent.homeProducts?.logoHeight || 120
  const footerPolicies = (pageContent.footerPolicies?.policies || []).filter((policy) => policy.active !== false)
  const contactContent = pageContent.contacto || {}
  const footerEmail = contactContent.email || 'contacto@formasinteriores.com'
  const footerPhone = contactContent.phone || '+57 316 973 3417'
  const footerAddress = contactContent.address || COMPANY_ADDRESS

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {logoImage ? <img src={optimizeImage(logoImage, { width: 240 })} className="site-footer__brand-logo" alt="Formas Interiores" width="156" height="130" style={{ '--logo-height': Math.min(Number(logoHeight) + 20, 130) + 'px' }} /> : <img src="/favicon-formas-128.png?v=1" className="site-footer__brand-logo site-footer__brand-logo--fallback" alt="Formas Interiores" width="118" height="118" style={{ '--logo-height': '118px' }} />}
          <p>{'Dise\u00f1amos y fabricamos muebles premium para transformar tu hogar con estilo y funcionalidad.'}</p>
          <div className="site-footer__social" aria-label="Redes sociales de Formas Interiores">
            <span className="site-footer__social-label">{'S\u00edguenos:'}</span>
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="site-footer__trust" aria-label="Compra segura">
            <p className="site-footer__heading">Compra segura</p>
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

          {footerPolicies.length > 0 && (
            <div className="site-footer__policies" aria-label="Politicas de Formas Interiores">
              <p className="site-footer__heading">{pageContent.footerPolicies?.title || 'Pol\u00edticas'}</p>
              <div className="site-footer__policy-list">
                {footerPolicies.map((policy) => (
                  <Link key={policy.id || policy.slug || policy.label} to={'/politicas/' + (policy.slug || policy.id)}>
                    {policy.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="site-footer__col site-footer__col--products">
          <p className="site-footer__heading">Productos</p>
          <ul>
            {visibleCategories.map((cat) => (
              <li key={cat.id}>
                <Link to={'/categorias/' + cat.id}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--company">
          <p className="site-footer__heading">Empresa</p>
          <ul>
            <li><Link to="/nosotros">Nosotros</Link></li>
            {SHOW_PROJECTS_PAGE && <li><Link to="/proyectos">Proyectos</Link></li>}
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--contact">
          <p className="site-footer__heading">Contacto</p>
          <ul>
            <li>{footerEmail}</li>
            <li>{footerPhone}</li>
            <li>{footerAddress}</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        {'\u00a9 2026 Formas Interiores \u00b7 Dise\u00f1a tu estilo \u00b7 ' + footerAddress}
      </div>
    </footer>
  )
}

export default Footer
