import { useEffect, useState } from 'react'
import { fetchCatalogContent } from '../api/cmsApi'
import { defaultSiteContent, loadSiteContent, saveSiteContent, SITE_CONTENT_EVENT } from '../data/siteContent'
import { optimizeImage, preloadImage } from '../utils/images'


let sharedCatalogPromise = null
let sharedCatalogContent = null
let sharedSiteContent = null
let catalogSyncStarted = false
let externalListenersStarted = false
const siteContentSubscribers = new Set()

function getSharedCatalogContent() {
  if (sharedCatalogContent) return Promise.resolve(sharedCatalogContent)

  if (!sharedCatalogPromise) {
    sharedCatalogPromise = fetchCatalogContent()
      .then((catalog) => {
        sharedCatalogContent = catalog
        return catalog
      })
      .catch((error) => {
        sharedCatalogPromise = null
        throw error
      })
  }

  return sharedCatalogPromise
}

function getCurrentSiteContent() {
  if (!sharedSiteContent) sharedSiteContent = loadSiteContent()
  return sharedSiteContent
}

function publishSiteContent(content) {
  sharedSiteContent = content
  siteContentSubscribers.forEach((listener) => listener(content))
}

function subscribeSiteContent(listener) {
  siteContentSubscribers.add(listener)
  return () => siteContentSubscribers.delete(listener)
}

function ensureExternalContentListeners() {
  if (externalListenersStarted || typeof window === 'undefined') return
  externalListenersStarted = true

  window.addEventListener(SITE_CONTENT_EVENT, (event) => {
    publishSiteContent(event.detail || loadSiteContent())
  })

  window.addEventListener('storage', (event) => {
    if (!event.key || event.key.includes('formas-site-content')) {
      publishSiteContent(loadSiteContent())
    }
  })
}

function collectImagesFromPageContent(pageContent = {}) {
  const images = []
  Object.values(pageContent).forEach((section) => {
    if (!section || typeof section !== 'object') return
    ;['image', 'menuImage', 'historyImage', 'locationImage', 'finalImage', 'logoImage'].forEach((key) => {
      if (section[key]) images.push(section[key])
    })
    if (Array.isArray(section.whyBenefits)) {
      section.whyBenefits.forEach((benefit) => benefit?.image && images.push(benefit.image))
    }
  })
  return images
}

function preloadCatalogImages(catalog) {
  if (typeof window === 'undefined' || !catalog) return

  const isMobile = window.matchMedia?.('(max-width: 767px)').matches
  const heroImages = [
    ...(catalog.heroSlides || []).filter((slide) => slide?.active !== false).slice(0, 1).map((slide) => slide.image),
    ...(isMobile ? [] : [
      catalog.pageContent?.productos?.image,
      catalog.pageContent?.nosotros?.image,
      catalog.pageContent?.blog?.image,
      catalog.pageContent?.contacto?.image,
    ]),
  ].filter(Boolean)

  const supportingImages = [
    ...collectImagesFromPageContent(catalog.pageContent),
    ...(catalog.products || []).slice(0, 8).map((product) => product.image),
    ...(catalog.projects || []).slice(0, 6).map((project) => project.image),
    ...(catalog.blogPosts || []).slice(0, 4).map((post) => post.image),
  ].filter(Boolean)

  Array.from(new Set(heroImages)).slice(0, isMobile ? 1 : 5).forEach((image) => {
    preloadImage(optimizeImage(image, { width: isMobile ? 900 : 1400 }))
  })

  if (isMobile) return

  Array.from(new Set(supportingImages)).slice(0, 8).forEach((image) => {
    preloadImage(optimizeImage(image, { width: 700 }))
  })
}

function mergeById(baseItems, apiItems) {
  const items = new Map()
  baseItems.forEach((item) => items.set(item.id, item))
  apiItems.forEach((item) => items.set(item.id, { ...items.get(item.id), ...item }))
  return Array.from(items.values())
}
function mergeCatalogContent(current, catalog) {
  return {
    ...current,
    categories: catalog.categories.length ? mergeById(defaultSiteContent.categories, catalog.categories) : current.categories,
    products: catalog.products.length ? catalog.products : current.products,
    heroSlides: catalog.heroSlides.length ? catalog.heroSlides : current.heroSlides,
    projects: catalog.projects.length ? catalog.projects : current.projects,
    projectHighlights: catalog.projectHighlights.length ? catalog.projectHighlights : current.projectHighlights,
    testimonials: catalog.testimonials.length ? catalog.testimonials : current.testimonials,
    blogPosts: catalog.blogPosts.length ? catalog.blogPosts : current.blogPosts,
    pageContent: {
      ...current.pageContent,
      ...catalog.pageContent,
    },
  }
}

function scheduleCatalogSync(callback) {
  if (typeof window === 'undefined') return () => {}

  const pathname = window.location.pathname || ''
  const isAdminRoute = pathname.startsWith('/cuenta')

  if (isAdminRoute) {
    callback()
    return () => {}
  }

  const isMobile = window.matchMedia?.('(max-width: 767px)').matches
  const isHomeRoute = pathname === '/'
  const delay = isHomeRoute ? (isMobile ? 6200 : 1800) : (isMobile ? 2600 : 700)
  let timeoutId = null
  let idleId = null
  let cancelled = false

  const start = () => {
    timeoutId = window.setTimeout(() => {
      if (cancelled) return

      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => {
          if (!cancelled) callback()
        }, { timeout: 1600 })
      } else {
        callback()
      }
    }, delay)
  }

  if (document.readyState === 'complete') {
    start()
  } else {
    window.addEventListener('load', start, { once: true })
  }

  return () => {
    cancelled = true
    window.removeEventListener('load', start)
    if (timeoutId) window.clearTimeout(timeoutId)
    if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
  }
}

export function useSiteContent() {
  const [content, setContent] = useState(() => getCurrentSiteContent())

  useEffect(() => {
    ensureExternalContentListeners()
    const unsubscribe = subscribeSiteContent(setContent)

    if (!catalogSyncStarted) {
      catalogSyncStarted = true
      scheduleCatalogSync(async () => {
        try {
          const catalog = await getSharedCatalogContent()
          preloadCatalogImages(catalog)
          const nextContent = saveSiteContent(mergeCatalogContent(getCurrentSiteContent(), catalog))
          publishSiteContent(nextContent)
        } catch {
          // Si el backend no esta disponible, la web usa el contenido local.
        }
      })
    }

    return unsubscribe
  }, [])

  function updateContent(updater) {
    const current = getCurrentSiteContent()
    const next = typeof updater === 'function' ? updater(current) : updater
    const nextContent = saveSiteContent(next)
    publishSiteContent(nextContent)
  }

  return [content, updateContent]
}


