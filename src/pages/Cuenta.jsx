import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'

function Cuenta() {
  const [modo, setModo] = useState('login') // 'login' o 'registro'

  function handleSubmit(e) {
    e.preventDefault()
    alert('Función de cuenta en construcción. Próximamente podrás iniciar sesión.')
  }

  return (
    <main className="page">
      <section className="cuenta-section">
        <div className="cuenta-card">
          <div className="cuenta-icon"><User size={28} /></div>
          <h1>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
          <p className="cuenta-sub">
            {modo === 'login'
              ? 'Accede a tu cuenta para ver tus cotizaciones y pedidos.'
              : 'Regístrate para guardar tus diseños favoritos y cotizaciones.'}
          </p>

          <form onSubmit={handleSubmit} className="cuenta-form">
            {modo === 'registro' && (
              <div className="cuenta-field">
                <User size={18} />
                <input type="text" placeholder="Nombre completo" required />
              </div>
            )}
            <div className="cuenta-field">
              <Mail size={18} />
              <input type="email" placeholder="Correo electrónico" required />
            </div>
            <div className="cuenta-field">
              <Lock size={18} />
              <input type="password" placeholder="Contraseña" required />
            </div>

            <button type="submit" className="button button--primary" style={{ width: '100%' }}>
              {modo === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <p className="cuenta-switch">
            {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}>
              {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

          <Link to="/" className="cuenta-volver">← Volver al inicio</Link>
        </div>
      </section>
    </main>
  )
}

export default Cuenta