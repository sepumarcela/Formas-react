const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const AUTH_TOKEN_KEY = 'formas-admin-token'

function text(value) {
  return value || ''
}

function toFrontendCategory(category) {
  return {
    id: category.id,
    name: text(category.name),
    description: text(category.description),
    image: category.image || category.heroImage || '',
    icon: category.icon || 'shelf',
    active: category.active !== false,
    persisted: true,
  }
}

function toBackendCategory(category) {
  return {
    id: category.id,
    name: category.name,
    description: text(category.description),
    image: text(category.image),
    heroImage: category.heroImage || category.image || '',
    active: category.active !== false,
    displayOrder: category.displayOrder || 0,
  }
}

function toFrontendProduct(product, categories = []) {
  const category = categories.find((item) => item.id === product.categoryId)

  return {
    id: product.id,
    categoryId: text(product.categoryId),
    category: category?.name || product.category || '',
    name: text(product.name),
    price: product.priceText || product.price || '',
    netPrice: product.netPrice ? String(product.netPrice) : '',
    size: text(product.size),
    description: text(product.description),
    material: text(product.material),
    color: product.colorFinish || product.color || '',
    leadTime: text(product.leadTime),
    discountPercent: product.discountPercent ? String(product.discountPercent) : '',
    discountLabel: text(product.discountLabel),
    discountStart: text(product.discountStart),
    discountEnd: text(product.discountEnd),
    image: text(product.image),
    featured: Boolean(product.featured),
    active: product.active !== false,
    persisted: true,
  }
}

function toBackendProduct(product) {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    priceText: text(product.price),
    netPrice: product.netPrice ? Number(product.netPrice) : null,
    size: text(product.size),
    description: text(product.description),
    material: text(product.material),
    colorFinish: text(product.color),
    leadTime: text(product.leadTime),
    image: text(product.image),
    discountPercent: product.discountPercent ? Number(product.discountPercent) : null,
    discountLabel: text(product.discountLabel),
    discountStart: product.discountStart || null,
    discountEnd: product.discountEnd || null,
    featured: Boolean(product.featured),
    active: product.active !== false,
  }
}

function toFrontendHeroSlide(slide) {
  return {
    id: slide.id,
    eyebrow: text(slide.eyebrow),
    titleAccent: text(slide.titleAccent),
    title: text(slide.title),
    description: text(slide.subtitle),
    primaryLabel: text(slide.primaryLabel),
    primaryLink: text(slide.primaryUrl),
    secondaryLabel: text(slide.secondaryLabel),
    secondaryLink: text(slide.secondaryUrl),
    image: text(slide.image),
    active: slide.active !== false,
    persisted: true,
  }
}

function toBackendHeroSlide(slide, displayOrder = 0) {
  return {
    id: typeof slide.id === 'number' ? slide.id : null,
    eyebrow: text(slide.eyebrow),
    titleAccent: text(slide.titleAccent),
    title: text(slide.title),
    subtitle: text(slide.description),
    primaryLabel: text(slide.primaryLabel),
    primaryUrl: text(slide.primaryLink),
    secondaryLabel: text(slide.secondaryLabel),
    secondaryUrl: text(slide.secondaryLink),
    image: text(slide.image),
    active: slide.active !== false,
    displayOrder,
  }
}

function toFrontendBlogPost(post) {
  return {
    id: post.id,
    tag: text(post.category),
    date: post.displayDate || text(post.publishedAt),
    title: text(post.title),
    desc: text(post.excerpt),
    image: text(post.image),
    body: text(post.content),
    active: post.active !== false,
    persisted: true,
  }
}

function toBackendBlogPost(post) {
  return {
    id: post.id,
    title: post.title,
    category: text(post.tag),
    displayDate: text(post.date),
    excerpt: text(post.desc),
    content: text(post.body),
    image: text(post.image),
    publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(post.date || '') ? post.date : null,
    active: post.active !== false,
  }
}

function toFrontendProject(project) {
  return {
    id: project.id,
    cat: text(project.categoryKey),
    label: text(project.label),
    title: text(project.title),
    location: text(project.location),
    image: text(project.image),
    active: project.active !== false,
    persisted: true,
  }
}

function toBackendProject(project, displayOrder = 0) {
  return {
    id: project.id,
    categoryKey: text(project.cat),
    label: text(project.label),
    title: project.title,
    location: text(project.location),
    image: text(project.image),
    active: project.active !== false,
    displayOrder,
  }
}

function toFrontendProjectHighlight(project) {
  return {
    id: project.id,
    category: text(project.category),
    title: text(project.title),
    description: text(project.description),
    before: text(project.beforeImage),
    after: text(project.afterImage),
    active: project.active !== false,
    persisted: true,
  }
}

function toBackendProjectHighlight(project, displayOrder = 0) {
  return {
    id: project.id,
    category: text(project.category),
    title: project.title,
    description: text(project.description),
    beforeImage: text(project.before),
    afterImage: text(project.after),
    active: project.active !== false,
    displayOrder,
  }
}

function toFrontendTestimonial(testimonial) {
  return {
    id: testimonial.id,
    name: text(testimonial.name),
    location: text(testimonial.location),
    text: text(testimonial.text),
    image: text(testimonial.image),
    approved: testimonial.approved !== false,
    active: testimonial.active !== false,
    persisted: true,
  }
}

function toBackendTestimonial(testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    location: text(testimonial.location),
    text: text(testimonial.text),
    image: text(testimonial.image),
    approved: testimonial.approved !== false,
    active: testimonial.active !== false,
  }
}

function toFrontendPage(page) {
  const extra = page.contentJson ? JSON.parse(page.contentJson) : {}
  return {
    ...extra,
    breadcrumb: text(page.breadcrumb),
    eyebrow: text(page.eyebrow),
    title: text(page.title),
    description: text(page.description),
    image: text(page.heroImage),
    ctaLabel: text(page.ctaLabel),
    persisted: true,
  }
}

function toBackendPage(pageKey, page) {
  const { breadcrumb, eyebrow, title, description, image, ctaLabel, ...extra } = page
  return {
    pageKey,
    breadcrumb: text(breadcrumb),
    eyebrow: text(eyebrow),
    title: text(title),
    description: text(description),
    heroImage: text(image),
    ctaLabel: text(ctaLabel),
    contentJson: JSON.stringify(extra),
    active: true,
  }
}

async function request(path, options = {}) {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem('formas-admin-authenticated')
    }
    throw new Error(`Error ${response.status} en ${path}`)
  }

  return response.status === 204 ? null : response.json()
}

async function optional(path, mapper) {
  try {
    const response = await request(path)
    return mapper ? mapper(response) : response
  } catch {
    return null
  }
}

export async function loginAdmin(email, password) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  sessionStorage.setItem(AUTH_TOKEN_KEY, response.token)
  return response
}

export function logoutAdmin() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function fetchCatalogContent() {
  const categoriesResponse = await optional('/api/categories')
  const categories = categoriesResponse?.map(toFrontendCategory) || []
  const productsResponse = await optional('/api/products')
  const products = productsResponse?.map((product) => toFrontendProduct(product, categories)) || []
  const heroSlides = await optional('/api/hero-slides', (items) => items.map(toFrontendHeroSlide))
  const projects = await optional('/api/project-gallery', (items) => items.map(toFrontendProject))
  const projectHighlights = await optional('/api/projects', (items) => items.map(toFrontendProjectHighlight))
  const testimonials = await optional('/api/testimonials', (items) => items.map(toFrontendTestimonial))
  const blogPosts = await optional('/api/blog-posts', (items) => items.map(toFrontendBlogPost))
  const pages = await optional('/api/pages', (items) => Object.fromEntries(items.map((page) => [page.pageKey, toFrontendPage(page)])))

  return {
    categories,
    products,
    heroSlides: heroSlides || [],
    projects: projects || [],
    projectHighlights: projectHighlights || [],
    testimonials: testimonials || [],
    blogPosts: blogPosts || [],
    pageContent: pages || {},
  }
}

async function saveEntity(entity, endpoint, mapperToBackend, mapperToFrontend, displayOrder) {
  const persisted = entity.persisted
  const path = persisted ? `${endpoint}/${encodeURIComponent(entity.id)}` : endpoint
  const saved = await request(path, {
    method: persisted ? 'PUT' : 'POST',
    body: JSON.stringify(mapperToBackend(entity, displayOrder)),
  })
  return mapperToFrontend(saved)
}

export async function saveProduct(product) {
  const saved = await saveEntity(product, '/api/products', toBackendProduct, toFrontendProduct)
  return { ...saved, category: product.category || saved.category }
}

export async function saveCategory(category) {
  return saveEntity(category, '/api/categories', toBackendCategory, toFrontendCategory)
}

export async function saveHeroSlide(slide, displayOrder = 0) {
  return saveEntity(slide, '/api/hero-slides', toBackendHeroSlide, toFrontendHeroSlide, displayOrder)
}

export async function saveBlogPost(post) {
  return saveEntity(post, '/api/blog-posts', toBackendBlogPost, toFrontendBlogPost)
}

export async function saveProject(project, displayOrder = 0) {
  return saveEntity(project, '/api/project-gallery', toBackendProject, toFrontendProject, displayOrder)
}

export async function saveProjectHighlight(project, displayOrder = 0) {
  return saveEntity(project, '/api/projects', toBackendProjectHighlight, toFrontendProjectHighlight, displayOrder)
}

export async function saveTestimonial(testimonial) {
  return saveEntity(testimonial, '/api/testimonials', toBackendTestimonial, toFrontendTestimonial)
}

export async function savePageContent(pageKey, page) {
  const saved = await request(`/api/pages/${encodeURIComponent(pageKey)}`, {
    method: page.persisted ? 'PUT' : 'POST',
    body: JSON.stringify(toBackendPage(pageKey, page)),
  }).catch(async (error) => {
    if (page.persisted) throw error
    return request('/api/pages', {
      method: 'POST',
      body: JSON.stringify(toBackendPage(pageKey, page)),
    })
  })
  return toFrontendPage(saved)
}

export async function deleteProduct(id) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteCategory(id) {
  return request(`/api/categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteHeroSlide(id) {
  return request(`/api/hero-slides/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteBlogPost(id) {
  return request(`/api/blog-posts/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteProject(id) {
  return request(`/api/project-gallery/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteProjectHighlight(id) {
  return request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteTestimonial(id) {
  return request(`/api/testimonials/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
