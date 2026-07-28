export const SHOW_PROJECTS_PAGE = false
export const SHOW_PROJECT_HIGHLIGHTS = true

const HIDDEN_PUBLIC_CATEGORY_IDS = new Set([
  'alcobas-infantiles',
])

export function isPublicCategoryVisible(category) {
  return category?.active !== false && !HIDDEN_PUBLIC_CATEGORY_IDS.has(category?.id)
}

export function isPublicProductVisible(product) {
  return product?.active !== false && !HIDDEN_PUBLIC_CATEGORY_IDS.has(product?.categoryId)
}
