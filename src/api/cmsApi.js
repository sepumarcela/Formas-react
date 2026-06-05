const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function toFrontendCategory(category) {
  return {
    id: category.id,
    name: category.name || '',
    description: category.description || '',
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
    description: category.description || '',
    image: category.image || '',
    heroImage: category.heroImage || category.image || '',
    active: category.active !== false,
    displayOrder: category.displayOrder || 0,
  }
}

function toFrontendProduct(product, categories = []) {
  const category = categories.find((item) => item.id === product.categoryId)

  return {
    id: product.id,
    categoryId: product.categoryId || '',
    category: category?.name || product.category || '',
    name: product.name || '',
    price: product.priceText || product.price || '',
    netPrice: product.netPrice ? String(product.netPrice) : '',
    size: product.size || '',
    description: product.description || '',
    material: product.material || '',
    color: product.colorFinish || product.color || '',
    leadTime: product.leadTime || '',
    discountPercent: product.discountPercent ? String(product.discountPercent) : '',
    discountLabel: product.discountLabel || '',
    discountStart: product.discountStart || '',
    discountEnd: product.discountEnd || '',
    image: product.image || '',
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
    priceText: product.price || '',
    netPrice: product.netPrice ? Number(product.netPrice) : null,
    size: product.size || '',
    description: product.description || '',
    material: product.material || '',
    colorFinish: product.color || '',
    leadTime: product.leadTime || '',
    image: product.image || '',
    discountPercent: product.discountPercent ? Number(product.discountPercent) : null,
    discountLabel: product.discountLabel || '',
    discountStart: product.discountStart || null,
    discountEnd: product.discountEnd || null,
    featured: Boolean(product.featured),
    active: product.active !== false,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${path}`)
  }

  return response.status === 204 ? null : response.json()
}

export async function fetchCatalogContent() {
  const categoriesResponse = await request('/api/categories')
  const categories = categoriesResponse.map(toFrontendCategory)
  const productsResponse = await request('/api/products')
  const products = productsResponse.map((product) => toFrontendProduct(product, categories))

  return { categories, products }
}

export async function saveProduct(product) {
  const persisted = product.persisted
  const path = persisted ? `/api/products/${encodeURIComponent(product.id)}` : '/api/products'
  const saved = await request(path, {
    method: persisted ? 'PUT' : 'POST',
    body: JSON.stringify(toBackendProduct(product)),
  })

  return {
    ...toFrontendProduct(saved),
    category: product.category || '',
  }
}

export async function saveCategory(category) {
  const persisted = category.persisted
  const path = persisted ? `/api/categories/${encodeURIComponent(category.id)}` : '/api/categories'
  const saved = await request(path, {
    method: persisted ? 'PUT' : 'POST',
    body: JSON.stringify(toBackendCategory(category)),
  })

  return toFrontendCategory(saved)
}

export async function deleteProduct(id) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function deleteCategory(id) {
  return request(`/api/categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
