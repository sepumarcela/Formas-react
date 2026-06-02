import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

function Contacto() {
  const [sent, setSent] = useState(false)
  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className="page">
      <section className="page-hero">
        <div className="page-hero__bg-ph" />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <div className="breadcrumb"><Link to="/">Inicio</Link> &rsaquo; Contacto</div>
          <p className="eyebrow">Contacto</p>
          <h1>Hablemos de <em>tu proyecto</em></h1>
          <div className="page-hero__line" />
          <p>Estamos aquí para ayudarte a transformar tus ideas en espacios únicos y funcionales.</p>
        </div>
      </section>

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="contacto-layout">
          <div className="contacto-form-box">
            <h3>Cuéntanos tu idea</h3>
            <p className="contacto-form-sub">Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo.</p>
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
                {sent ? '✓ Mensaje enviado' : 'Enviar mensaje →'}
              </button>
              <p className="contacto-form-note">🔒 Tu información está protegida. No compartimos tus datos.</p>
            </form>
          </div>

          <div className="contacto-info">
            <h3>Información de contacto</h3>
            <div className="contacto-info-item"><div className="contacto-info-icon"><MapPin size={20} /></div><div><strong>Visítanos</strong><p>Cartagena, Colombia<br />Centro histórico</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Phone size={20} /></div><div><strong>Llámanos</strong><p>+57 300 123 4567<br />+57 604 444 7890</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Mail size={20} /></div><div><strong>Escríbenos</strong><p>hola@formas.com</p></div></div>
            <div className="contacto-info-item"><div className="contacto-info-icon"><Clock size={20} /></div><div><strong>Horario de atención</strong><p>Lunes a Viernes: 8:00 a.m. &ndash; 6:00 p.m.<br />Sábados: 9:00 a.m. &ndash; 1:00 p.m.</p></div></div>
            <div className="contacto-social"><a href="#">IG</a><a href="#">FB</a><a href="#">PT</a><a href="#">YT</a></div>
          </div>

          <div className="contacto-mapa">
            <div className="contacto-mapa-ph">Mapa pendiente</div>
            <div className="contacto-mapa-card">
              <h5>Sala de diseño</h5>
              <p>Agenda tu visita y conoce nuestros espacios de inspiración.</p>
              <a href="https://wa.me/573001234567" className="button button--primary" style={{ fontSize: 11, padding: '10px 16px', width: '100%' }}>Agendar visita</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacto