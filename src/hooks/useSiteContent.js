import { useEffect, useState } from 'react'
import { fetchCatalogContent } from '../api/cmsApi'
import { loadSiteContent, saveSiteContent, SITE_CONTENT_EVENT } from '../data/siteContent'

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
          categories: catalog.categories.length ? catalog.categories : current.categories,
          products: catalog.products.length ? catalog.products : current.products,
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
