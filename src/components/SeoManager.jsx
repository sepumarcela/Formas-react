import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'
import { COMPANY_CITY, COMPANY_REGION, COMPANY_STREET_ADDRESS } from '../config/company'

const SITE_NAME = 'Formas Interiores'
const BUSINESS_NAME = 'Formas Interiores S.A.S.'
const SITE_URL = 'https://formasinteriores.com'
const CONTACT_EMAIL = 'contacto@formasinteriores.com'
const CONTACT_PHONE = '+573167313521'
const DEFAULT_IMAGE = `${SITE_URL}/favicon-formas.png?v=11`
const DEFAULT_DESCRIPTION = 'Formas Interiores disena y fabrica muebles a medida para hogares y espacios comerciales en Colombia, con diseno personalizado, materiales de calidad e instalacion profesional.'

const SOCIAL_LINKS = [
  'https://www.facebook.com/formasinteriores',
  'https://www.instagram.com/formasinteriores/',
  'https://www.tiktok.com/@formasinteriores',
]

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
    noindex: true,
  },
  '/pago/resultado': {
    title: 'Resultado del pago | Formas Interiores',
    description: 'Consulta el estado de tu pago y continua coordinando tu pedido con Formas Interiores.',
    noindex: true,
  },
  '/buscar': {
    title: 'Buscar | Formas Interiores',
    description: 'Busca productos, categorias, proyectos y contenido de Formas Interiores para encontrar rapido lo que necesitas.',
    noindex: true,
  },
}

const privatePrefixes = ['/admin', '/cuenta', '/carrito', '/pago', '/buscar', '/ficha-tecnica']

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

function absoluteUrl(value) {
  const raw = String(value || '').trim()
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) return DEFAULT_IMAGE
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `${SITE_URL}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function parseMoney(value) {
  const numeric = String(value || '').replace(/[^0-9]/g, '')
  return numeric ? Number(numeric) : 0
}

function normalizePath(pathname) {
  return pathname.replace(/\/$/, '') || '/'
}

function isNoIndex(path, seo) {
  return Boolean(seo.noindex || privatePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)))
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

function setJsonLd(id, data) {
  let element = document.head.querySelector(`script#${id}`)
  if (!data) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('script')
    element.id = id
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

function findRouteEntity(parts, content) {
  const { categories = [], products = [], blogPosts = [], pageContent = {} } = content

  if (parts[0] === 'categorias' && parts[1]) {
    return { type: 'category', item: categories.find((item) => item.id === parts[1]) }
  }

  if (parts[0] === 'productos' && parts[1]) {
    return { type: 'product', item: products.find((item) => item.id === parts[1]) }
  }

  if (parts[0] === 'blog' && parts[1]) {
    return { type: 'blog', item: blogPosts.find((item) => item.id === parts[1]) }
  }

  if (parts[0] === 'politicas' && parts[1]) {
    const policies = pageContent.footerPolicies?.policies || []
    return { type: 'policy', item: policies.find((item) => (item.slug || item.id) === parts[1]) }
  }

  return { type: 'static', item: null }
}

function buildSeo(pathname, content) {
  const path = normalizePath(pathname)
  const parts = path.split('/').filter(Boolean)
  const { type, item } = findRouteEntity(parts, content)

  if (type === 'category' && item) {
    return {
      title: `${item.name} | Formas Interiores`,
      description: truncate(item.description || `Muebles a medida para ${item.name.toLowerCase()} con diseno personalizado, materiales de calidad e instalacion profesional.`),
      image: item.image,
    }
  }

  if (type === 'product' && item) {
    return {
      title: `${item.name} | Formas Interiores`,
      description: truncate(item.description || `${item.name}: ${item.category || 'mueble a medida'} disenado para transformar espacios con funcionalidad, estilo y acabados de calidad.`),
      image: item.image,
    }
  }

  if (type === 'blog' && item) {
    return {
      title: `${item.title} | Blog Formas Interiores`,
      description: truncate(item.desc || item.body || 'Articulo del blog de Formas Interiores con ideas, inspiracion y consejos para disenar espacios funcionales y modernos.'),
      image: item.image,
      article: true,
    }
  }

  if (type === 'policy' && item) {
    return {
      title: `${item.title || item.label} | Formas Interiores`,
      description: truncate(item.content || `Consulta ${String(item.label || item.title || 'politicas').toLowerCase()} de Formas Interiores para comprar y navegar con claridad.`),
    }
  }

  return staticSeo[path] || {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  }
}

function buildBreadcrumb(path, seo) {
  if (path === '/') return null
  const parts = path.split('/').filter(Boolean)
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
  ]

  if (parts[0]) {
    const sectionName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, ' ')
    items.push({ '@type': 'ListItem', position: 2, name: sectionName, item: `${SITE_URL}/${parts[0]}` })
  }

  if (parts[1]) {
    items.push({ '@type': 'ListItem', position: 3, name: cleanText(seo.title).replace(` | ${SITE_NAME}`, '').replace(' | Blog Formas Interiores', ''), item: `${SITE_URL}${path}` })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function buildPageSchema(path, seo, content) {
  const parts = path.split('/').filter(Boolean)
  const { type, item } = findRouteEntity(parts, content)
  const canonical = `${SITE_URL}${path}`

  if (type === 'product' && item) {
    const price = parseMoney(item.price)
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: item.name,
      description: truncate(item.description || seo.description, 300),
      image: absoluteUrl(item.image),
      category: item.category || item.categoryId,
      brand: { '@type': 'Brand', name: SITE_NAME },
      url: canonical,
      ...(price > 0 ? {
        offers: {
          '@type': 'Offer',
          priceCurrency: 'COP',
          price,
          availability: 'https://schema.org/InStock',
          url: canonical,
        },
      } : {}),
    }
  }

  if (type === 'blog' && item) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: item.title,
      description: truncate(item.desc || seo.description, 300),
      image: absoluteUrl(item.image),
      url: canonical,
      author: { '@type': 'Organization', name: SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE } },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: canonical,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }
}

function buildGlobalSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'es-CO',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/buscar?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': ['LocalBusiness', 'FurnitureStore'],
        '@id': `${SITE_URL}/#business`,
        name: BUSINESS_NAME,
        alternateName: SITE_NAME,
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        logo: DEFAULT_IMAGE,
        description: DEFAULT_DESCRIPTION,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_STREET_ADDRESS,
          addressLocality: COMPANY_CITY,
          addressRegion: COMPANY_REGION,
          addressCountry: 'CO',
        },
        areaServed: 'Colombia',
        sameAs: SOCIAL_LINKS,
      },
    ],
  }
}

function SeoManager() {
  const location = useLocation()
  const [content] = useSiteContent()
  const path = normalizePath(location.pathname)
  const seo = useMemo(() => buildSeo(path, content), [path, content])

  useEffect(() => {
    const title = seo.title || SITE_NAME
    const description = truncate(seo.description || DEFAULT_DESCRIPTION)
    const canonical = `${SITE_URL}${path}`
    const image = absoluteUrl(seo.image)
    const robots = isNoIndex(path, seo) ? 'noindex, nofollow' : 'index, follow'

    document.documentElement.lang = 'es-CO'
    document.title = title
    setMeta('description', description)
    setMeta('robots', robots)
    setMeta('theme-color', '#18110f')
    setMeta('og:locale', 'es_CO', 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', seo.article ? 'article' : 'website', 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    setCanonical(canonical)
    setJsonLd('formas-global-schema', buildGlobalSchema())
    setJsonLd('formas-page-schema', buildPageSchema(path, { ...seo, description }, content))
    setJsonLd('formas-breadcrumb-schema', buildBreadcrumb(path, seo))
  }, [path, seo, content])

  return null
}

export default SeoManager
