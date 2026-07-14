import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryShowcase from '../components/sections/CategoryShowcase'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import WhyFormas from '../components/sections/WhyFormas'
import PurchaseProcess from '../components/sections/PurchaseProcess'
import ProjectHighlights from '../components/sections/ProjectHighlights'
import TestimonialSection from '../components/sections/TestimonialSection'
import FinalCta from '../components/sections/FinalCta'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage, preloadImage } from '../utils/images'
import { SHOW_PROJECT_HIGHLIGHTS } from '../config/features'

const HOME_HERO_FALLBACK = 'https://res.cloudinary.com/dokodfzmu/image/upload/v1781298433/formas/inicio/inicio01.png'

function Home() {
  const [{ heroSlides, pageContent }] = useSiteContent()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const activeSlides = useMemo(() => (
    heroSlides.filter((slide) => slide.active !== false)
  ), [heroSlides])
  const slides = activeSlides.length ? activeSlides : heroSlides
  const safeSlideIndex = slides.length ? activeSlideIndex % slides.length : 0
  const currentSlide = slides[safeSlideIndex] || {}
  const heroSrc = currentSlide.image || HOME_HERO_FALLBACK
  const optimizedHeroSrc = heroSrc ? optimizeImage(heroSrc, { width: 1200 }) : ''
  const heroImageFit = pageContent.homeProducts?.heroImageFit || 'cover'
  const descriptionLines = String(currentSlide.description || '')
    .split('\n')
    .filter(Boolean)

  useEffect(() => {
    if (optimizedHeroSrc) preloadImage(optimizedHeroSrc)
  }, [optimizedHeroSrc])

  useEffect(() => {
    if (slides.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <main className="page">
      <section className="home-hero">
        <div className="home-hero__bg">
          {optimizedHeroSrc ? (
            <img src={optimizedHeroSrc} className={`home-hero__bg-img home-hero__bg-img--${heroImageFit}`} alt="" loading="eager" decoding="async" fetchPriority="high" />
          ) : (
            <div className="home-hero__fallback" aria-hidden="true" />
          )}
          <div className="home-hero__overlay" />
        </div>

        <div className="home-hero__content">
          {currentSlide.eyebrow && <p className="home-hero__eyebrow">{currentSlide.eyebrow}</p>}
          <h1>
            <span className="home-hero__accent">{currentSlide.titleAccent || 'Diseña'}</span>
            <span className="home-hero__white">{currentSlide.title || 'tu estilo'}</span>
          </h1>
          <div className="home-hero__line" />
          <p>
            {descriptionLines.length ? descriptionLines.map((line) => (
              <span key={line}>{line}<br /></span>
            )) : (
              <>
                Muebles modernos y funcionales<br />
                para transformar cada espacio<br />
                de tu hogar.
              </>
            )}
          </p>
          <div className="home-hero__actions">
            {currentSlide.primaryLabel && (
              <Link to={currentSlide.primaryLabel?.toLowerCase() === 'ver colecciones' ? '/productos' : (currentSlide.primaryLink || '/productos')} className="button button--primary">
                {currentSlide.primaryLabel}
              </Link>
            )}
            {currentSlide.secondaryLabel && (
              <Link to={currentSlide.secondaryLink || '/contacto'} className="button button--primary button--hero-primary">
                {currentSlide.secondaryLabel}
              </Link>
            )}
          </div>

          {slides.length > 1 && (
            <div className="home-hero__dots" aria-label="Fotos de inicio">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={index === safeSlideIndex ? 'active' : ''}
                  aria-label={`Ver foto ${index + 1}`}
                  onClick={() => setActiveSlideIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CategoryShowcase />
      <FeaturedProducts />
      <WhyFormas />
      <PurchaseProcess />
      {SHOW_PROJECT_HIGHLIGHTS && <ProjectHighlights />}
      <TestimonialSection />
      <FinalCta />
    </main>
  )
}

export default Home
