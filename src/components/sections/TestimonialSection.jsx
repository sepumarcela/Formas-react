const testimonials = [
  {
    name: 'María Fernanda G.',
    location: 'Medellín, Antioquia',
    text: 'Transformaron completamente nuestro apartamento. El resultado quedó cálido, funcional y muy bien terminado.',
  },
  {
    name: 'Juan Carlos R.',
    location: 'Cali, Valle del Cauca',
    text: 'Excelente calidad y acompañamiento. Nos ayudaron a entender qué diseño funcionaba mejor para el espacio.',
  },
  {
    name: 'Laura y Andrés M.',
    location: 'Bogotá, Cundinamarca',
    text: 'El clóset quedó mejor de lo que imaginábamos. Todo el proceso fue claro y ordenado.',
  },
]

function TestimonialSection() {
  return (
    <section className="testimonials">
      <div className="section-heading">
        <p className="eyebrow">Testimonios</p>
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Historias reales de espacios transformados.</p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <div className="testimonial-card__image">
              <span>Foto pendiente</span>
            </div>

            <div className="testimonial-card__body">
              <p>“{testimonial.text}”</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection