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
        const response = await fetch(fileUrl, { cache: 'no-store', mode: 'cors' })
        if (!response.ok) throw new Error(`PDF ${response.status}`)

        const fileData = new Uint8Array(await response.arrayBuffer())
        const loadingTask = pdfjs.getDocument({
          data: fileData,
          disableAutoFetch: true,
          disableStream: true,
        })
        const pdf = await loadingTask.promise
        const pageWidth = Math.max(container.clientWidth - 24, 260)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled || renderTokenRef.current !== renderToken) return

          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = Math.min(pageWidth / baseViewport.width, 1.25)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d', { alpha: false })
          if (!context) throw new Error('Canvas no disponible')

          canvas.width = Math.floor(viewport.width * pixelRatio)
          canvas.height = Math.floor(viewport.height * pixelRatio)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          canvas.className = 'pdf-inline-viewer__page'
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
          container.appendChild(canvas)

          await page.render({ canvasContext: context, viewport }).promise
          page.cleanup()
        }

        if (!cancelled && renderTokenRef.current === renderToken) setStatus('ready')
      } catch {
        if (!cancelled && renderTokenRef.current === renderToken) setStatus('error')
      }
    }

    renderPdf()

    return () => {
      cancelled = true
      container.replaceChildren()
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