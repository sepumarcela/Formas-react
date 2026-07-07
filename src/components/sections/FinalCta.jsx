import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import { optimizeImage } from '../../utils/images'

function WhatsAppLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884"
      />
    </svg>
  )
}

function FinalCta() {
  const [{ pageContent }] = useSiteContent()
  const section = pageContent.homeProducts

  return (
    <section className="final-cta">
      <div className="final-cta__content">
        <p className="eyebrow">{section.finalEyebrow || 'Hablemos de tu proyecto'}</p>
        <h2>{section.finalTitle || '¿Listo para transformar tu espacio?'}</h2>
        <p>
          {section.finalText || 'Cuéntanos qué necesitas y te ayudamos a crear un mueble a medida para tu hogar.'}
        </p>

        <div className="final-cta__actions">
          <Link className="button button--primary" to={section.finalPrimaryLink || '/contacto'}>
            {section.finalPrimaryLabel || 'Solicitar cotización'}
          </Link>

          <a
            className="whatsapp-button"
            href={section.finalWhatsappLink || 'https://wa.me/573169733417'}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppLogo />
            {section.finalWhatsappLabel || 'Hablar por WhatsApp'}
          </a>
        </div>
      </div>

      <div className="final-cta__photo">
        {section.finalImage ? <img src={optimizeImage(section.finalImage, { width: 900 })} alt={section.finalTitle || 'Proyecto Formas Interiores'} loading="lazy" /> : <span>Foto pendiente</span>}
      </div>
    </section>
  )
}

export default FinalCta
