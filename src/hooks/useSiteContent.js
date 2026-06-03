import { useEffect, useState } from 'react'
import { loadSiteContent, saveSiteContent, SITE_CONTENT_EVENT } from '../data/siteContent'

export function useSiteContent() {
  const [content, setContent] = useState(() => loadSiteContent())

  useEffect(() => {
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
