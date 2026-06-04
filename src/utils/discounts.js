export function getActiveDiscount(product) {
  const percent = Number(product?.discountPercent || 0)
  if (!percent || percent <= 0) return null
  if (isStartingPrice(product?.price)) return null

  const originalValue = parseCopPrice(product?.netPrice || product?.price)
  if (!originalValue) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (product.discountStart) {
    const start = new Date(product.discountStart)
    start.setHours(0, 0, 0, 0)
    if (today < start) return null
  }

  if (product.discountEnd) {
    const end = new Date(product.discountEnd)
    end.setHours(23, 59, 59, 999)
    if (today > end) return null
  }

  return {
    percent,
    label: product.discountLabel || `-${percent}%`,
    originalValue,
    finalValue: Math.round(originalValue * (1 - percent / 100)),
    originalPrice: formatCopPrice(originalValue),
    finalPrice: formatCopPrice(Math.round(originalValue * (1 - percent / 100))),
  }
}

export function parseCopPrice(value) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

export function formatCopPrice(value) {
  return `$${Number(value || 0).toLocaleString('es-CO')}`
}

export function isStartingPrice(value) {
  return String(value || '').trim().toLowerCase().startsWith('desde')
}
