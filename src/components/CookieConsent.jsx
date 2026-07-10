import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_CONSENT_KEY = 'formas-cookie-consent-v1'

function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    setVisible(!savedConsent)
  }, [])

  function saveConsent(value) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <section className="cookie-consent" aria-label="Aviso de cookies">
      <div className="cookie-consent__copy">
        <p className="cookie-consent__title">Usamos cookies</p>
        <p>
          Utilizamos cookies para mejorar tu experiencia, recordar preferencias y entender como navegas por Formas Interiores.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <Link className="cookie-consent__link" to="/politicas/cookies">Ver politica</Link>
        <button type="button" className="cookie-consent__button cookie-consent__button--ghost" onClick={() => saveConsent('rejected')}>
          Rechazar
        </button>
        <button type="button" className="cookie-consent__button" onClick={() => saveConsent('accepted')}>
          Aceptar
        </button>
      </div>
    </section>
  )
}

export default CookieConsent
