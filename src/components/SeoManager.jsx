import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'

const SITE_NAME = 'Formas Interiores'
const SITE_URL = 'https://formasinteriores.com'
const DEFAULT_DESCRIPTION = 'Formas Interiores disena y fabrica muebles a medida para hogares y espacios comerciales en Colombia, con diseno personalizado, materiales de calidad e instalacion profesional.'

const staticSeo = {
  '/': {
    title: 'Formas Interiores | Muebles a medida para transformar tu hogar',
    description: DEFAULT_DESCRIPTION,
  },
  '/productos': {
    title: 'Productos | Formas Interiores',
    description: 'Explora nuestras lineas de muebles a medida: cocinas, closets, centros de entretenimiento, bibliotecas, banos, repisas y soluciones para cada espacio.',
  },
  '/proyectos': {
    title: 'Proyectos realizados | Formas Interiores',
    description: 'Conoce proyectos reales de Formas Interiores y descubre espacios transformados con diseno funcional, fabricacion a medida y acabados de calidad.',
  },
  '/nosotros': {
    title: 'Nosotros | Formas Interiores',
    description: 'Somos Formas Interiores, una marca dedicada al diseno y fabricacion de muebles personalizados que combinan estetica, funcionalidad y calidad.',
  },
  '/blog': {
    title: 'Blog | Formas Interiores',
    description: 'Ideas, tendencias y consejos de diseno interior, mobiliario a medida y organizacion de espacios para inspirar proyectos funcionales y modernos.',
  },
  '/contacto': {
    title: 'Contacto | Formas Interiores',
    description: 'Cuentanos tu idea y recibe asesoria para disenar muebles a medida para tu hogar o negocio con Formas Interiores.',
  },
  '/carrito': {
    title: 'Carrito y pago | Formas Interiores',
    description: 'Revisa los productos seleccionados, confirma tus datos y coordina tu compra con Formas Interiores de forma segura.',
  },
  '/pago/resultado': {
    title: 'Resultado del pago | Formas Interiores',
    description: 'Consulta el estado de tu pago y continua coordinando tu pedido con Formas Interiores.',
  },
  '/buscar': {
    title: 'Buscar | Formas Interiores',
    description: 'Busca productos, categorias, proyectos y contenido de Formas Interiores para encontrar rapido lo que necesitas.',
  },
}

function cleanText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value, max = 158) {
  const text = cleanText(value)
  if (text.length <= max) return text
  return `${text.slice(0, max - 3).trim()}...`
}

function setMeta(name, content, attribute = 'name') {
  if (!content) return
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

function buildSeo(pathname, content) {
  const { categories = [], products = [], blogPosts = [], pageContent = {} } = content
  const path = pathname.replace(/\/$/, '') || '/'
  const parts = path.split('/').filter(Boolean)

  if (parts[0] === 'categorias' && parts[1]) {
    const category = categories.find((item) => item.id === parts[1])
    if (category) {
      return {
        title: `${category.name} | Formas Interiores`,
        description: truncate(category.description || `Muebles a medida para ${category.name.toLowerCase()} con diseno personalizado, materiales de calidad e instalacion profesional.`),
      }
    }
  }

  if (parts[0] === 'productos' && parts[1]) {
    const product = products.find((item) => item.id === parts[1])
    if (product) {
      return {
        title: `${product.name} | Formas Interiores`,
        description: truncate(product.description || `${product.name}: ${product.category || 'mueble a medida'} disenado para transformar espacios con funcionalidad, estilo y acabados de calidad.`),
        image: product.image,
      }
    }
  }

  if (parts[0] === 'blog' && parts[1]) {
    const post = blogPosts.find((item) => item.id === parts[1])
    if (post) {
      return {
        title: `${post.title} | Blog Formas Interiores`,
        description: truncate(post.desc || post.body || 'Articulo del blog de Formas Interiores con ideas, inspiracion y consejos para disenar espacios funcionales y modernos.'),
        image: post.image,
      }
    }
  }

  if (parts[0] === 'politicas' && parts[1]) {
    const policies = pageContent.footerPolicies?.policies || []
    const policy = policies.find((item) => (item.slug || item.id) === parts[1])
    if (policy) {
      return {
        title: `${policy.title || policy.label} | Formas Interiores`,
        description: truncate(policy.content || `Consulta ${String(policy.label || policy.title || 'politicas').toLowerCase()} de Formas Interiores para comprar y navegar con claridad.`),
      }
    }
  }

  return staticSeo[path] || {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  }
}

function SeoManager() {
  const location = useLocation()
  const [content] = useSiteContent()
  const seo = useMemo(() => buildSeo(location.pathname, content), [location.pathname, content])

  useEffect(() => {
    const title = seo.title || SITE_NAME
    const description = truncate(seo.description || DEFAULT_DESCRIPTION)
    const canonical = `${SITE_URL}${location.pathname}`
    const image = seo.image || `${SITE_URL}/favicon-formas.png?v=11`

    document.title = title
    setMeta('description', description)
    setMeta('robots', 'index, follow')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    setCanonical(canonical)
  }, [location.pathname, seo])

  return null
}

export default SeoManager