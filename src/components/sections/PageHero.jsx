import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { optimizeImage, preloadImage } from '../../utils/images'

function renderTitle(title) {
  return String(title || '').split('\n').map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < String(title || '').split('\n').length - 1 && <br />}
    </span>
  ))
}

function PageHero({ content, fallbackTitle }) {
  const title = content.title || fallbackTitle
  const heroImage = content.image ? optimizeImage(content.image, { width: 1800 }) : ''

  useEffect(() => {
    preloadImage(heroImage)
  }, [heroImage])

  return (
    <section className="page-hero">
      {content.image ? (
        <div className="page-hero__bg"><img src={heroImage} alt={title} loading="eager" decoding="async" fetchPriority="high" /></div>
      ) : (
        <div className="page-hero__bg-ph" />
      )}
      <div className="page-hero__overlay" />
      <div className="page-hero__content">
        <div className="breadcrumb"><Link to="/">Inicio</Link> &rsaquo; {content.breadcrumb || fallbackTitle}</div>
        {content.eyebrow && <p className="eyebrow">{content.eyebrow}</p>}
        <h1>{renderTitle(title)}</h1>
        <div className="page-hero__line" />
        <p>{content.description}</p>
      </div>
    </section>
  )
}

export default PageHero
