export const CART_STORAGE_KEY = 'formas-cart-v1'
export const CART_UPDATED_EVENT = 'formas-cart-updated'

function safeReadCart() {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    const items = stored ? JSON.parse(stored) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

function saveCart(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }))
  return items
}

export function loadCartItems() {
  if (typeof window === 'undefined') return []
  return safeReadCart()
}

export function addCartItem(product) {
  const items = safeReadCart()
  const existing = items.find((item) => item.id === product.id)

  if (existing) {
    return saveCart(items.map((item) => (
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    )))
  }

  return saveCart([
    ...items,
    {
      id: product.id,
      name: product.name,
      category: product.category,
      categoryId: product.categoryId,
      price: product.price || 'Cotizar',
      size: product.size || 'A medida',
      image: product.image || '',
      quantity: 1,
    },
  ])
}

export function updateCartItemQuantity(id, quantity) {
  const nextQuantity = Math.max(Number(quantity) || 1, 1)
  return saveCart(safeReadCart().map((item) => (
    item.id === id ? { ...item, quantity: nextQuantity } : item
  )))
}

export function removeCartItem(id) {
  return saveCart(safeReadCart().filter((item) => item.id !== id))
}

export function clearCart() {
  return saveCart([])
}

export function parseMoney(value) {
  const amount = Number(String(value || '').replace(/[^\d]/g, ''))
  return Number.isFinite(amount) ? amount : 0
}

export function formatMoney(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value || 0)
}
