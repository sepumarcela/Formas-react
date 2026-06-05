import { useSiteContent } from '../../hooks/useSiteContent'

function TestimonialSection() {
  const [{ testimonials }] = useSiteContent()
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.approved !== false)

  return (
    <section className="testimonials">
      <div className="section-heading">
        <p className="eyebrow">Testimonios</p>
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Historias reales de espacios transformados.</p>
      </div>

      <div className="testimonial-grid">
        {visibleTestimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.id}>
            <div className="testimonial-card__image">
              {testimonial.image ? <img src={testimonial.image} alt={testimonial.name} /> : <span>Foto pendiente</span>}
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
