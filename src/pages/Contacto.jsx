import { useState } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import PageHero from '../components/sections/PageHero'
import { useSiteContent } from '../hooks/useSiteContent'

function Contacto() {
  const [{ pageContent }] = useSiteContent()
  const page = pageContent.contacto
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Contacto" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="contacto-layout">
          <div className="contacto-form-box">
            <h3>{page.formTitle}</h3>
            <p className="contacto-form-sub">{page.formSubtitle}</p>
            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="contacto-form-row">
                <input type="text" placeholder="Nombre completo" required />
                <input type="tel" placeholder="Teléfono" />
              </div>
              <input type="email" placeholder="Correo electrónico" required />
              <select>
                <option value="">Estoy interesado en...</option>
                <option>Centros de entretenimiento</option>
                <option>Closets</option>
                <option>Cocinas</option>
                <option>Centros de estudio</option>
                <option>Repisas</option>
                <option>Bibliotecas</option>
                <option>Muebles de baño</option>
                <option>Alcobas infantiles</option>
                <option>Otro</option>
              </select>
              <textarea rows={4} placeholder="Cuéntanos sobre tu proyecto, medidas aproximadas, materiales de preferencia..." />
              <button type="submit" className="button button--primary" style={{ width: '100%' }}>
                {sent ? 'Mensaje enviado' : 'Enviar mensaje'}
              </button>
              <p className="contacto-form-note">Tu información está protegida. No compartimos tus datos.</p>
            </form>
          </div>

          <div className="contacto-info">
            <h3>Información de contacto</h3>
            <div className="contacto-info-item"><div className="contacto-info-icon"><MapPin size={20} /></div><div><strong>{page.addressTitle}</strong><p>{page.address.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Phone size={20} /></div><div><strong>{page.phoneTitle}</strong><p>{page.phone.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Mail size={20} /></div><div><strong>{page.emailTitle}</strong><p>{page.email}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Clock size={20} /></div><div><strong>{page.hoursTitle}</strong><p>{page.hours.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
            <div className="contacto-social"><a href="#">IG</a><a href="#">FB</a><a href="#">PT</a><a href="#">YT</a></div>
          </div>

          <div className="contacto-mapa">
            {page.mapImage ? <img src={page.mapImage} alt={page.visitTitle} /> : <div className="contacto-mapa-ph">Mapa pendiente</div>}
            <div className="contacto-mapa-card">
              <h5>{page.visitTitle}</h5>
              <p>{page.visitText}</p>
              <a href={page.whatsappLink} className="button button--primary" style={{ fontSize: 11, padding: '10px 16px', width: '100%' }}>Agendar visita</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacto
