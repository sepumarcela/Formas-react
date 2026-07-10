import { SHOW_PROJECTS_PAGE } from '../config/features'

export function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function compactText(parts) {
  return parts.filter(Boolean).join(' ')
}

function matches(item, query) {
  const haystack = normalizeSearchText(compactText([item.title, item.description, item.type, item.keywords]))
  return haystack.includes(query)
}

function uniqueByUrl(items) {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  })
}

export function buildSearchIndex(content) {
  const categories = (content.categories || []).filter((item) => item.active !== false)
  const products = (content.products || []).filter((item) => item.active !== false)
  const projects = SHOW_PROJECTS_PAGE ? (content.projects || []).filter((item) => item.active !== false) : []
  const projectHighlights = SHOW_PROJECTS_PAGE ? (content.projectHighlights || []).filter((item) => item.active !== false) : []
  const blogPosts = (content.blogPosts || []).filter((item) => item.active !== false)
  const pageContent = content.pageContent || {}

  const pageItems = [
    {
      type: 'Pagina',
      title: 'Inicio',
      description: compactText([
        pageContent.homeProducts?.categoriesTitle,
        pageContent.homeProducts?.categoriesDescription,
        pageContent.homeProducts?.featuredTitle,
        pageContent.homeProducts?.featuredDescription,
      ]),
      keywords: 'home principal colecciones destacados muebles formas interiores',
      url: '/',
    },
    {
      type: 'Pagina',
      title: pageContent.productos?.title || 'Productos',
      description: pageContent.productos?.description,
      keywords: 'productos catalogo categorias muebles cotizar comprar',
      url: '/productos',
    },
    ...(SHOW_PROJECTS_PAGE ? [{
      type: 'Pagina',
      title: pageContent.proyectos?.title || 'Proyectos',
      description: pageContent.proyectos?.description,
      keywords: 'proyectos realizados antes despues trabajos portafolio',
      url: '/proyectos',
    }] : []),
    {
      type: 'Pagina',
      title: pageContent.nosotros?.title || 'Nosotros',
      description: compactText([pageContent.nosotros?.description, pageContent.nosotros?.historyText]),
      keywords: 'empresa historia valores quienes somos formas interiores',
      url: '/nosotros',
    },
    {
      type: 'Pagina',
      title: pageContent.blog?.title || 'Blog',
      description: pageContent.blog?.description,
      keywords: 'blog ideas inspiracion consejos tendencias articulos',
      url: '/blog',
    },
    {
      type: 'Pagina',
      title: pageContent.contacto?.title || 'Contacto',
      description: compactText([pageContent.contacto?.description, pageContent.contacto?.phone, pageContent.contacto?.email, pageContent.contacto?.address]),
      keywords: 'contacto telefono whatsapp correo ubicacion cotizacion asesoria',
      url: '/contacto',
    },
  ]

  const categoryItems = categories.map((category) => ({
    type: 'Categoria',
    title: category.name,
    description: category.description,
    keywords: compactText([category.id, category.icon]),
    url: '/categorias/' + category.id,
  }))

  const productItems = products.map((product) => ({
    type: 'Producto',
    title: product.name,
    description: compactText([product.category, product.price, product.size, product.description, product.material, product.color, product.leadTime]),
    keywords: compactText([product.id, product.categoryId]),
    url: '/productos/' + product.id,
  }))

  const projectItems = projects.map((project) => ({
    type: 'Proyecto',
    title: project.title,
    description: compactText([project.label, project.location]),
    keywords: compactText([project.id, project.cat]),
    url: '/proyectos',
  }))

  const highlightItems = projectHighlights.map((project) => ({
    type: 'Proyecto realizado',
    title: project.title,
    description: compactText([project.category, project.description]),
    keywords: compactText([project.id, 'antes despues transformacion']),
    url: '/nosotros#proyectos-realizados',
  }))

  const blogItems = blogPosts.map((post) => ({
    type: 'Blog',
    title: post.title,
    description: compactText([post.tag, post.date, post.desc, post.body]),
    keywords: compactText([post.id, post.trending ? 'tendencia' : '']),
    url: post.originalUrl || '/blog/' + post.id,
    external: Boolean(post.originalUrl),
  }))

  return [...pageItems, ...categoryItems, ...productItems, ...projectItems, ...highlightItems, ...blogItems]
}

export function searchSiteContent(content, rawQuery, limit) {
  const query = normalizeSearchText(rawQuery)
  if (!query) return []

  const results = buildSearchIndex(content)
    .filter((item) => matches(item, query))
    .sort((a, b) => {
      const aTitle = normalizeSearchText(a.title)
      const bTitle = normalizeSearchText(b.title)
      const aStarts = aTitle.startsWith(query) ? 0 : 1
      const bStarts = bTitle.startsWith(query) ? 0 : 1
      return aStarts - bStarts || aTitle.localeCompare(bTitle)
    })

  const unique = uniqueByUrl(results)
  return typeof limit === 'number' ? unique.slice(0, limit) : unique
}
