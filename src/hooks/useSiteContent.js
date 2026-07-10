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

  const heroImages = [
    ...(catalog.heroSlides || []).filter((slide) => slide?.active !== false).map((slide) => slide.image),
    catalog.pageContent?.productos?.image,
    catalog.pageContent?.proyectos?.image,
    catalog.pageContent?.nosotros?.image,
    catalog.pageContent?.blog?.image,
    catalog.pageContent?.contacto?.image,
    ...(catalog.categories || []).map((category) => category.image),
  ].filter(Boolean)

  const supportingImages = [
    ...collectImagesFromPageContent(catalog.pageContent),
    ...(catalog.products || []).slice(0, 8).map((product) => product.image),
    ...(catalog.projects || []).slice(0, 6).map((project) => project.image),
    ...(catalog.blogPosts || []).slice(0, 4).map((post) => post.image),
  ].filter(Boolean)

  Array.from(new Set(heroImages)).slice(0, 18).forEach((image) => {
    preloadImage(optimizeImage(image, { width: 1800 }))
  })

  Array.from(new Set(supportingImages)).slice(0, 16).forEach((image) => {
    preloadImage(optimizeImage(image, { width: 900 }))
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
