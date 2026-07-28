import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import {
  PiCheckCircleDuotone,
  PiClockDuotone,
  PiEnvelopeSimpleDuotone,
  PiMapPinDuotone,
  PiPhoneCallDuotone,
} from 'react-icons/pi'
import PageHero from '../components/sections/PageHero'
import { submitContactForm } from '../api/cmsApi'
import { useSiteContent } from '../hooks/useSiteContent'

const TOTAL_STEPS = 7

const spaceOptions = [
  'Cocina integral',
  'Closet',
  'Centro de entretenimiento / TV',
  'Centro de estudio',
  'Biblioteca',
  'Mueble de baño',
  'Vestier',
  'Home Office',
  'Proyecto integral (varios espacios)',
  'Otro',
]

const investmentRanges = {
  'Centro de entretenimiento / TV': '$1.890.000 - $4.100.000',
  'Centro de estudio': '$5.200.000 - $8.500.000',
  'Cocina integral': '$8.500.000 - $60.000.000',
  Closet: '$4.500.000 - $18.000.000',
  'Mueble de baño': '$2.000.000 - $4.800.000',
  Biblioteca: '$2.500.000 - $7.800.000',
  Repisas: '$1.200.000 - $3.100.000',
}

const locationOptions = [
  'Medellín',
  'Envigado',
  'Sabaneta',
  'Itagüí',
  'Bello',
  'La Estrella',
  'Caldas',
  'Copacabana',
  'Girardota',
  'Barbosa',
  'Otro municipio',
]

const stageOptions = [
  'Ya tengo las medidas',
  'Necesito una visita para tomar medidas',
  'Estoy remodelando',
  'Es un proyecto nuevo',
  'Solo estoy explorando opciones',
]

const propertyOptions = [
  'Casa',
  'Apartamento',
  'Local comercial',
  'Oficina',
  'Otro',
]

const startOptions = [
  'Lo antes posible',
  'En 1 a 3 meses',
  'En 3 a 6 meses',
  'En más de 6 meses',
  'Aún no lo he definido',
]

const stepTitles = [
  '¿Qué espacios deseas transformar?',
  'Inversión aproximada prevista',
  'Cuéntanos quién eres',
  '¿Dónde está ubicado el proyecto?',
  '¿En qué etapa se encuentra tu proyecto?',
  '¿El inmueble es?',
  '¿Cuándo deseas iniciar el proyecto?',
]

const initialFormData = {
  spaces: [],
  otherSpace: '',
  budget: '',
  budgetUnknown: false,
  name: '',
  phone: '',
  email: '',
  location: '',
  otherLocation: '',
  projectStage: '',
  propertyType: '',
  otherProperty: '',
  startTime: '',
}

function formatBudget(value) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits ? new Intl.NumberFormat('es-CO').format(Number(digits)) : ''
}

function Contacto() {
  const [{ pageContent }] = useSiteContent()
  const page = pageContent.contacto
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const mapUrl = page.mapEmbedUrl || (
    page.mapAddress
      ? `https://www.google.com/maps?q=${encodeURIComponent(page.mapAddress)}&output=embed`
      : ''
  )

  const selectedInvestmentRanges = useMemo(() => (
    formData.spaces.map((space) => ({
      space,
      range: investmentRanges[space] || 'A definir con uno de nuestros asesores',
    }))
  ), [formData.spaces])

  const progress = ((step + 1) / TOTAL_STEPS) * 100

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }))
    setError('')
  }

  function toggleSpace(space) {
    setFormData((current) => ({
      ...current,
      spaces: current.spaces.includes(space)
        ? current.spaces.filter((item) => item !== space)
        : [...current.spaces, space],
      ...(space === 'Otro' && current.spaces.includes(space) ? { otherSpace: '' } : {}),
    }))
    setError('')
  }

  function isStepValid() {
    switch (step) {
      case 0:
        return formData.spaces.length > 0
          && (!formData.spaces.includes('Otro') || Boolean(formData.otherSpace.trim()))
      case 1:
        return formData.budgetUnknown || Boolean(formData.budget.replace(/\D/g, ''))
      case 2:
        return Boolean(
          formData.name.trim()
          && formData.phone.replace(/\D/g, '').length >= 7
          && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        )
      case 3:
        return Boolean(
          formData.location
          && (formData.location !== 'Otro municipio' || formData.otherLocation.trim()),
        )
      case 4:
        return Boolean(formData.projectStage)
      case 5:
        return Boolean(
          formData.propertyType
          && (formData.propertyType !== 'Otro' || formData.otherProperty.trim()),
        )
      case 6:
        return Boolean(formData.startTime)
      default:
        return false
    }
  }

  function handleNext() {
    if (!isStepValid()) return
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1))
    setError('')
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 0))
    setError('')
  }

  function buildMessage() {
    const spaces = formData.spaces.map((space) => (
      space === 'Otro' ? `Otro: ${formData.otherSpace.trim()}` : space
    ))
    const location = formData.location === 'Otro municipio'
      ? formData.otherLocation.trim()
      : formData.location
    const property = formData.propertyType === 'Otro'
      ? formData.otherProperty.trim()
      : formData.propertyType
    const budget = formData.budgetUnknown
      ? 'Aún no tiene un presupuesto definido'
      : `$${formData.budget}`
    const referenceRanges = selectedInvestmentRanges
      .map((item) => `${item.space}: ${item.range}`)
      .join('; ')

    return [
      `Espacios: ${spaces.join(', ')}`,
      `Inversión prevista: ${budget}`,
      `Rangos de referencia mostrados: ${referenceRanges}`,
      `Ubicación: ${location}`,
      `Etapa del proyecto: ${formData.projectStage}`,
      `Tipo de inmueble: ${property}`,
      `Fecha estimada de inicio: ${formData.startTime}`,
    ].join('\n')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (step < TOTAL_STEPS - 1) {
      handleNext()
      return
    }
    if (!isStepValid()) return

    setSending(true)
    setError('')

    try {
      await submitContactForm({
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        interest: formData.spaces.join(', '),
        message: buildMessage(),
      })
      setSent(true)
      setFormData(initialFormData)
      setStep(0)
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  function renderChoiceGrid(options, field, className = '') {
    return (
      <div className={`contacto-choice-grid ${className}`}>
        {options.map((option) => {
          const selected = formData[field] === option
          return (
            <button
              type="button"
              className={`contacto-choice${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => updateField(field, option)}
              key={option}
            >
              <span className="contacto-choice__check" aria-hidden="true">
                {selected && <Check size={15} />}
              </span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    )
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <p className="contacto-step-help">Puedes seleccionar uno o varios espacios.</p>
            <div className="contacto-choice-grid contacto-choice-grid--spaces">
              {spaceOptions.map((space) => {
                const selected = formData.spaces.includes(space)
                return (
                  <button
                    type="button"
                    className={`contacto-choice${selected ? ' is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => toggleSpace(space)}
                    key={space}
                  >
                    <span className="contacto-choice__check" aria-hidden="true">
                      {selected && <Check size={15} />}
                    </span>
                    <span>{space}</span>
                  </button>
                )
              })}
            </div>
            {formData.spaces.includes('Otro') && (
              <label className="contacto-field">
                <span>¿Cuál otro espacio?</span>
                <input
                  type="text"
                  value={formData.otherSpace}
                  onChange={(event) => updateField('otherSpace', event.target.value)}
                  placeholder="Escribe el espacio"
                  autoFocus
                />
              </label>
            )}
          </>
        )
      case 1:
        return (
          <>
            <p className="contacto-step-help">
              Estos son los rangos de referencia para los espacios seleccionados.
            </p>
            <div className="contacto-investment-list">
              {selectedInvestmentRanges.map((item) => (
                <div className="contacto-investment-card" key={item.space}>
                  <span>{item.space}</span>
                  <strong>{item.range}</strong>
                </div>
              ))}
            </div>
            <label className="contacto-field">
              <span>¿Cuánto tienes previsto invertir?</span>
              <div className="contacto-budget-input">
                <span aria-hidden="true">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.budget}
                  disabled={formData.budgetUnknown}
                  onChange={(event) => updateField('budget', formatBudget(event.target.value))}
                  placeholder="Ej. 8.500.000"
                />
              </div>
            </label>
            <label className="contacto-budget-unknown">
              <input
                type="checkbox"
                checked={formData.budgetUnknown}
                onChange={(event) => {
                  updateField('budgetUnknown', event.target.checked)
                  if (event.target.checked) updateField('budget', '')
                }}
              />
              <span>Aún no tengo un presupuesto definido</span>
            </label>
          </>
        )
      case 2:
        return (
          <div className="contacto-data-fields">
            <label className="contacto-field">
              <span>Nombre completo</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                autoFocus
              />
            </label>
            <label className="contacto-field">
              <span>Número de celular</span>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, ''))}
                placeholder="Tu celular"
                autoComplete="tel"
              />
            </label>
            <label className="contacto-field contacto-field--full">
              <span>Correo electrónico</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
            </label>
          </div>
        )
      case 3:
        return (
          <>
            {renderChoiceGrid(locationOptions, 'location', 'contacto-choice-grid--compact')}
            {formData.location === 'Otro municipio' && (
              <label className="contacto-field">
                <span>¿En cuál municipio?</span>
                <input
                  type="text"
                  value={formData.otherLocation}
                  onChange={(event) => updateField('otherLocation', event.target.value)}
                  placeholder="Escribe el municipio"
                  autoFocus
                />
              </label>
            )}
          </>
        )
      case 4:
        return renderChoiceGrid(stageOptions, 'projectStage')
      case 5:
        return (
          <>
            {renderChoiceGrid(propertyOptions, 'propertyType')}
            {formData.propertyType === 'Otro' && (
              <label className="contacto-field">
                <span>¿Qué tipo de inmueble?</span>
                <input
                  type="text"
                  value={formData.otherProperty}
                  onChange={(event) => updateField('otherProperty', event.target.value)}
                  placeholder="Escribe el tipo de inmueble"
                  autoFocus
                />
              </label>
            )}
          </>
        )
      case 6:
        return renderChoiceGrid(startOptions, 'startTime')
      default:
        return null
    }
  }

  return (
    <main className="page">
      <PageHero content={page} fallbackTitle="Contacto" />

      <section style={{ background: 'var(--color-bg)' }}>
        <div className="contacto-layout contacto-layout--wizard">
          <div className="contacto-form-box contacto-form-box--wizard">
            <h3>{page.formTitle}</h3>
            <p className="contacto-form-sub">
              Completa estos pasos y uno de nuestros asesores se pondrá en contacto contigo.
            </p>

            {sent ? (
              <div className="contacto-wizard-success" role="status">
                <PiCheckCircleDuotone size={58} aria-hidden="true" />
                <h4>Solicitud enviada</h4>
                <p>Gracias por compartir tu proyecto. Te contactaremos muy pronto.</p>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setSent(false)}
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contacto-form contacto-wizard">
                <div className="contacto-wizard__progress">
                  <div className="contacto-wizard__meta">
                    <span>Paso {step + 1} de {TOTAL_STEPS}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div
                    className="contacto-wizard__track"
                    role="progressbar"
                    aria-valuemin="1"
                    aria-valuemax={TOTAL_STEPS}
                    aria-valuenow={step + 1}
                    aria-label={`Paso ${step + 1} de ${TOTAL_STEPS}`}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <fieldset className="contacto-wizard__step" key={step}>
                  <legend>{stepTitles[step]}</legend>
                  {renderStep()}
                </fieldset>

                {error && <p className="contacto-form-error" role="alert">{error}</p>}

                <div className="contacto-wizard__actions">
                  <button
                    type="button"
                    className="contacto-wizard__back"
                    onClick={handleBack}
                    disabled={step === 0 || sending}
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                    Anterior
                  </button>

                  {step < TOTAL_STEPS - 1 ? (
                    <button
                      type="button"
                      className="button button--primary contacto-wizard__next"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                    >
                      Continuar
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="button button--primary contacto-wizard__next"
                      disabled={!isStepValid() || sending}
                    >
                      {sending ? 'Enviando...' : 'Enviar solicitud'}
                      {!sending && <Send size={17} aria-hidden="true" />}
                    </button>
                  )}
                </div>

                <p className="contacto-form-note">
                  Tu información está protegida. No compartimos tus datos.
                </p>
              </form>
            )}
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
