import { Link } from 'react-router-dom'
import { optimizeImage } from '../../utils/images'

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

  return (
    <section className="page-hero">
      {content.image ? (
        <div className="page-hero__bg"><img src={optimizeImage(content.image, { width: 1800 })} alt={title} /></div>
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
