import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

function PdfInlineViewer({ fileUrl, title }) {
  const containerRef = useRef(null)
  const renderTokenRef = useRef(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container || !fileUrl) return undefined

    const renderToken = renderTokenRef.current + 1
    renderTokenRef.current = renderToken
    let cancelled = false

    async function renderPdf() {
      setStatus('loading')
      container.replaceChildren()

      try {
        const loadingTask = pdfjs.getDocument({ url: fileUrl, withCredentials: false })
        const pdf = await loadingTask.promise
        const pageWidth = Math.max(container.clientWidth - 28, 280)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled || renderTokenRef.current !== renderToken) return

          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = pageWidth / baseViewport.width
          const viewport = page.getViewport({ scale: Math.min(scale, 1.55) })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          const ratio = window.devicePixelRatio || 1

          canvas.width = Math.floor(viewport.width * ratio)
          canvas.height = Math.floor(viewport.height * ratio)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          canvas.className = 'pdf-inline-viewer__page'
          context.setTransform(ratio, 0, 0, ratio, 0, 0)
          container.appendChild(canvas)

          await page.render({ canvasContext: context, viewport }).promise
        }

        if (!cancelled && renderTokenRef.current === renderToken) setStatus('ready')
      } catch (error) {
        if (!cancelled && renderTokenRef.current === renderToken) setStatus('error')
      }
    }

    renderPdf()

    return () => {
      cancelled = true
    }
  }, [fileUrl])

  return (
    <div className="pdf-inline-viewer" aria-label={title}>
      {status === 'loading' && <div className="pdf-inline-viewer__state">Cargando ficha técnica...</div>}
      {status === 'error' && <div className="pdf-inline-viewer__state">No se pudo mostrar la ficha técnica.</div>}
      <div className="pdf-inline-viewer__pages" ref={containerRef} />
    </div>
  )
}

export default PdfInlineViewer