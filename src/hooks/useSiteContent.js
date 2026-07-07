import { useEffect, useState } from 'react'
import { fetchCatalogContent } from '../api/cmsApi'
import { defaultSiteContent, loadSiteContent, saveSiteContent, SITE_CONTENT_EVENT } from '../data/siteContent'
import { optimizeImage, preloadImage } from '../utils/images'


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

  const criticalImages = [
    catalog.heroSlides?.find((slide) => slide?.active !== false)?.image,
    catalog.pageContent?.productos?.image,
    catalog.pageContent?.proyectos?.image,
    catalog.pageContent?.nosotros?.image,
    catalog.pageContent?.blog?.image,
    catalog.pageContent?.contacto?.image,
    ...collectImagesFromPageContent(catalog.pageContent),
    ...(catalog.categories || []).slice(0, 4).map((category) => category.image),
    ...(catalog.products || []).slice(0, 4).map((product) => product.image),
  ].filter(Boolean)

  Array.from(new Set(criticalImages)).slice(0, 12).forEach((image) => {
    preloadImage(optimizeImage(image, { width: 1400 }))
  })
}

function mergeById(baseItems, apiItems) {
  const items = new Map()
  baseItems.forEach((item) => items.set(item.id, item))
  apiItems.forEach((item) => items.set(item.id, { ...items.get(item.id), ...item }))
  return Array.from(items.values())
}

export function useSiteContent() {
  const [content, setContent] = useState(() => loadSiteContent())

  useEffect(() => {
    let cancelled = false

    async function loadFromApi() {
      try {
        const catalog = await fetchCatalogContent()
        if (cancelled) return

        preloadCatalogImages(catalog)

        setContent((current) => saveSiteContent({
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
        }))
      } catch {
        // Si el backend no está prendido, la web usa el contenido local.
      }
    }

    loadFromApi()

    function handleContentUpdate(event) {
      setContent(event.detail || loadSiteContent())
    }

    function handleStorage(event) {
      if (!event.key || event.key.includes('formas-site-content')) {
        setContent(loadSiteContent())
      }
    }

    window.addEventListener(SITE_CONTENT_EVENT, handleContentUpdate)
    window.addEventListener('storage', handleStorage)

    return () => {
      cancelled = true
      window.removeEventListener(SITE_CONTENT_EVENT, handleContentUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  function updateContent(updater) {
    setContent((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      return saveSiteContent(next)
    })
  }

  return [content, updateContent]
}
