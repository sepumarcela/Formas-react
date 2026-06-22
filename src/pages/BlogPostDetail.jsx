import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, Eye } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'

function BlogPostLink({ post, className, children }) {
  if (post.originalUrl) {
    return (
      <a className={className} href={post.originalUrl}>
        {children}
      </a>
    )
  }

  return (
    <Link className={className} to={`/blog/${post.id}`}>
      {children}
    </Link>
  )
}

function articleBlocks(post) {
  const source = post.body || post.desc || ''
  const lines = source
    .split(/\n{2,}|\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.map((line, index) => {
    const cleanLine = line.replace(/^#+\s*/, '')
    const looksLikeHeading = /^#+\s/.test(line) || (/^[¿?A-ZÁÉÍÓÚÑ]/.test(cleanLine) && cleanLine.length <= 86 && /[?:]$/.test(cleanLine))

    return {
      id: `section-${index + 1}`,
      text: cleanLine,
      type: looksLikeHeading ? 'heading' : 'paragraph',
    }
  })
}

function sidebarHeadingText(text) {
  return text.replace(/^\d+\.\s*/, '')
}

function BlogPostDetail() {
  const { postId } = useParams()
  const [{ blogPosts }] = useSiteContent()
  const post = blogPosts.find((item) => item.id === postId && item.active !== false)
  const relatedPosts = blogPosts.filter((item) => item.id !== postId && item.active !== false).slice(0, 2)

  if (!post) {
    return (
      <main className="page blog-post-page">
        <section className="blog-post-not-found">
          <p className="admin-kicker">Blog</p>
          <h1>Artículo no encontrado</h1>
          <Link to="/blog" className="button button--primary">Volver al blog</Link>
        </section>
      </main>
    )
  }

  const blocks = articleBlocks(post)
  const headings = blocks.filter((block) => block.type === 'heading').slice(0, 6)

  return (
    <main className="page blog-post-page">
      <section className="blog-post-hero">
        <div className="blog-post-hero__content">
          <div className="blog-post-hero__eyebrow">
            <Link to="/blog" className="blog-post-back"><ArrowLeft size={16} /> Volver al blog</Link>
            <div className="blog-post-meta">
              {post.date && <time><CalendarDays size={13} /> {post.date}</time>}
              <span><Clock size={13} /> 5 min de lectura</span>
              <span><Eye size={13} /> Blog Formas Interiores</span>
            </div>
          </div>
          <h1>{post.title}</h1>
          {post.desc && <p>{post.desc}</p>}
        </div>
        <div className="blog-post-hero__media">
          {post.image ? <img src={optimizeImage(post.image, { width: 1100 })} alt={post.title} /> : <div className="blog-ph">Foto pendiente</div>}
        </div>
      </section>

      <section className="blog-post-content-section">
        <article className="blog-post-article">
          {blocks.length ? blocks.map((block) => (
            block.type === 'heading'
              ? <h2 id={block.id} key={block.id}>{block.text}</h2>
              : <p key={block.id}>{block.text}</p>
          )) : (
            <p>Muy pronto ampliaremos este artículo con más inspiración, recomendaciones y detalles para tu proyecto.</p>
          )}
        </article>

        <aside className="blog-post-sidebar">
          {relatedPosts.length > 0 && (
            <div className="blog-post-sidebar__box">
              <h3>Te recomendamos</h3>
              {relatedPosts.map((item) => (
                <BlogPostLink post={item} className="blog-post-sidebar__item" key={item.id}>
                  {item.image ? <img src={optimizeImage(item.image, { width: 220 })} alt="" loading="lazy" /> : <div className="blog-ph" />}
                  {item.trending && <span>Tendencia</span>}
                  <strong>{item.title}</strong>
                </BlogPostLink>
              ))}
            </div>
          )}

          {headings.length > 0 && (
            <div className="blog-post-sidebar__box blog-post-sidebar__box--outline">
              <h3>En este artículo</h3>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id}><a href={`#${heading.id}`}>{sidebarHeadingText(heading.text)}</a></li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

export default BlogPostDetail
