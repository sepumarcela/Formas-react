import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_CONSENT_KEY = 'formas-cookie-consent-v2'

const defaultPreferences = {
  necessary: true,
  analytics: false,
  personalization: false,
}

function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [preferences, setPreferences] = useState(defaultPreferences)

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) return undefined

    let timeoutId = null
    let idleId = null
    let cancelled = false

    const showNotice = () => {
      if (!cancelled) setVisible(true)
    }

    const scheduleNotice = () => {
      timeoutId = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(showNotice, { timeout: 2000 })
        } else {
          showNotice()
        }
      }, 8200)
    }

    if (document.readyState === 'complete') {
      scheduleNotice()
    } else {
      window.addEventListener('load', scheduleNotice, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', scheduleNotice)
      if (timeoutId) window.clearTimeout(timeoutId)
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
    }
  }, [])

  function saveConsent(value, customPreferences = preferences) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ value, preferences: customPreferences, savedAt: new Date().toISOString() }))
    setVisible(false)
  }

  function rejectCookies() {
    saveConsent('rejected', defaultPreferences)
  }

  function acceptCookies() {
    saveConsent('accepted', { necessary: true, analytics: true, personalization: true })
  }

  function saveConfiguration() {
    saveConsent('configured', { ...preferences, necessary: true })
  }

  function updatePreference(name) {
    setPreferences((current) => ({ ...current, [name]: !current[name] }))
  }

  if (!visible) return null

  return (
    <section className="cookie-consent" aria-label="Aviso de privacidad y cookies">
      <div className="cookie-consent__brand" aria-hidden="true">FORMAS INTERIORES</div>

      <div className="cookie-consent__copy">
        <p className="cookie-consent__title">Tu privacidad es importante para nosotros</p>
        <p>
          Utilizamos cookies propias y tecnologias similares para mejorar tu experiencia, recordar preferencias y analizar la navegacion en nuestro sitio. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.
        </p>
        <p>
          Para mas informacion consulta nuestra <Link to="/politicas/cookies">Politica de Cookies</Link> y nuestra <Link to="/politicas/privacidad">Politica de Privacidad</Link>.
        </p>
      </div>

      {isConfiguring && (
        <div className="cookie-consent__settings" aria-label="Configuracion de cookies">
          <label>
            <span>
              <strong>Cookies necesarias</strong>
              <small>Permiten que la pagina funcione correctamente.</small>
            </span>
            <input type="checkbox" checked readOnly />
          </label>
          <label>
            <span>
              <strong>Cookies analiticas</strong>
              <small>Nos ayudan a entender el uso del sitio para mejorarlo.</small>
            </span>
            <input type="checkbox" checked={preferences.analytics} onChange={() => updatePreference('analytics')} />
          </label>
          <label>
            <span>
              <strong>Cookies de personalizacion</strong>
              <small>Guardan preferencias para una experiencia mas comoda.</small>
            </span>
            <input type="checkbox" checked={preferences.personalization} onChange={() => updatePreference('personalization')} />
          </label>
        </div>
      )}

      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__button cookie-consent__button--outline" onClick={() => setIsConfiguring((value) => !value)}>
          Configurar
        </button>
        <button type="button" className="cookie-consent__button cookie-consent__button--dark" onClick={rejectCookies}>
          Rechazar
        </button>
        {isConfiguring ? (
          <button type="button" className="cookie-consent__button" onClick={saveConfiguration}>
            Guardar
          </button>
        ) : (
          <button type="button" className="cookie-consent__button" onClick={acceptCookies}>
            Aceptar
          </button>
        )}
      </div>
    </section>
  )
}

export default CookieConsent

