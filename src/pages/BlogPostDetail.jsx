import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { optimizeImage } from '../utils/images'

function articleParagraphs(post) {
  const source = post.body || post.desc || ''
  return source
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function BlogPostDetail() {
  const { postId } = useParams()
  const [{ blogPosts }] = useSiteContent()
  const post = blogPosts.find((item) => item.id === postId && item.active !== false)
  const relatedPosts = blogPosts.filter((item) => item.id !== postId && item.active !== false).slice(0, 3)

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

  const paragraphs = articleParagraphs(post)

  return (
    <main className="page blog-post-page">
      <section className="blog-post-hero">
        <div className="blog-post-hero__content">
          <Link to="/blog" className="blog-post-back"><ArrowLeft size={16} /> Volver al blog</Link>
          <div className="blog-post-meta">
            {post.tag && <span>{post.tag}</span>}
            {post.date && <time>{post.date}</time>}
          </div>
          <h1>{post.title}</h1>
          {post.desc && <p>{post.desc}</p>}
        </div>
        <div className="blog-post-hero__media">
          {post.image ? <img src={optimizeImage(post.image, { width: 1400 })} alt={post.title} /> : <div className="blog-ph">Foto pendiente</div>}
        </div>
      </section>

      <section className="blog-post-content-section">
        <article className="blog-post-article">
          {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
            <p>Muy pronto ampliaremos este artículo con más inspiración, recomendaciones y detalles para tu proyecto.</p>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <aside className="blog-post-related">
            <h2>Más inspiración</h2>
            <div className="blog-post-related__grid">
              {relatedPosts.map((item) => (
                <Link to={`/blog/${item.id}`} className="blog-post-related__item" key={item.id}>
                  {item.image ? <img src={optimizeImage(item.image, { width: 420 })} alt="" loading="lazy" /> : <div className="blog-ph" />}
                  <span>{item.tag}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </section>
    </main>
  )
}

export default BlogPostDetail
