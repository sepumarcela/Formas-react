import { useEffect, useState } from 'react'
import { fetchCatalogContent } from '../api/cmsApi'
import { defaultSiteContent, loadSiteContent, saveSiteContent, SITE_CONTENT_EVENT } from '../data/siteContent'

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

        setContent((current) => saveSiteContent({
          ...current,
          categories: catalog.categories.length ? mergeById(defaultSiteContent.categories, catalog.categories) : current.categories,
          products: catalog.products.length ? mergeById(defaultSiteContent.products, catalog.products) : current.products,
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
