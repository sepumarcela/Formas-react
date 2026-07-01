import { useState } from 'react'
import { PiClockDuotone, PiEnvelopeSimpleDuotone, PiMapPinDuotone, PiPhoneCallDuotone } from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { submitContactForm } from '../api/cmsApi'
import { useSiteContent } from '../hooks/useSiteContent'

function Contacto() {
  const [{ pageContent }] = useSiteContent()
  const page = pageContent.contacto
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const mapUrl = page.mapEmbedUrl || (
    page.mapAddress
      ? `https://www.google.com/maps?q=${encodeURIComponent(page.mapAddress)}&output=embed`
      : ''
  )

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setSending(true)
    setError('')

    try {
      await submitContactForm({
        name: data.get('name'),
        phone: data.get('phone'),
        email: data.get('email'),
        interest: data.get('interest'),
        message: data.get('message'),
      })
      form.reset()
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
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
                <input name="name" type="text" placeholder="Nombre completo" required />
                <input name="phone" type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="Teléfono" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '') }} />
              </div>
              <input name="email" type="email" placeholder="Correo electrónico" required />
              <select name="interest">
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
              <textarea name="message" rows={4} placeholder="Cuéntanos sobre tu proyecto, medidas aproximadas, materiales de preferencia..." />
              {error && <p className="contacto-form-note">{error}</p>}
              <button type="submit" className="button button--primary" style={{ width: '100%' }}>
                {sending ? 'Enviando...' : sent ? 'Mensaje enviado' : 'Enviar mensaje'}
              </button>
              <p className="contacto-form-note">Tu información está protegida. No compartimos tus datos.</p>
            </form>
          </div>

          <div className="contacto-info">
            <h3>Información de contacto</h3>
            <div className="contacto-info-item"><div className="contacto-info-icon"><PiMapPinDuotone size={20} /></div><div><strong>{page.addressTitle}</strong><p>{page.address.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><PiPhoneCallDuotone size={20} /></div><div><strong>{page.phoneTitle}</strong><p>{page.phone.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><PiEnvelopeSimpleDuotone size={20} /></div><div><strong>{page.emailTitle}</strong><p>{page.email}</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><PiClockDuotone size={20} /></div><div><strong>{page.hoursTitle}</strong><p>{page.hours.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div>
          </div>

          <div className="contacto-mapa">
            {mapUrl ? (
              <iframe
                title={page.visitTitle || 'Ubicación'}
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="contacto-mapa-ph">Mapa pendiente</div>
            )}
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
