import { Link } from 'react-router-dom'
import CategoryShowcase from '../components/sections/CategoryShowcase'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import WhyFormas from '../components/sections/WhyFormas'
import PurchaseProcess from '../components/sections/PurchaseProcess'
import ProjectHighlights from '../components/sections/ProjectHighlights'
import TestimonialSection from '../components/sections/TestimonialSection'
import FinalCta from '../components/sections/FinalCta'

function Home() {
  return (
    <main className="page">
      <section className="home-hero">
        {/* Cuando tengas la foto: reemplaza el div por <img src="/hero.png" className="home-hero__bg-img" alt="" /> */}
        <div className="home-hero__bg">
          <div className="home-hero__bg-ph" />
          <div className="home-hero__overlay" />
        </div>

        <div className="home-hero__content">
          <h1>
            <span className="home-hero__accent">Diseña</span>
            <span className="home-hero__white">tu estilo</span>
          </h1>
          <div className="home-hero__line" />
          <p>
            Muebles modernos y funcionales<br />
            para transformar cada espacio<br />
            de tu hogar.
          </p>
          <div className="home-hero__actions">
            <Link to="/proyectos" className="button button--primary">Ver colecciones</Link>
            <Link to="/contacto" className="button button--outline">Solicitar diseño</Link>
          </div>
        </div>
      </section>

      <CategoryShowcase />
      <FeaturedProducts />
      <WhyFormas />
      <PurchaseProcess />
      <ProjectHighlights />
      <TestimonialSection />
      <FinalCta />
    </main>
  )
}

export default Home