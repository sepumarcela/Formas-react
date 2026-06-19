import { lazy, Suspense } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'

const PdfInlineViewer = lazy(() => import('../components/PdfInlineViewer'))

function TechnicalSheetViewer() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const fileUrl = searchParams.get('url') || ''
  const productName = searchParams.get('name') || 'Producto'
  const returnTo = searchParams.get('returnTo') || '/productos'

  return (
    <main className="page technical-sheet-page">
      <section className="technical-sheet-shell">
        <div className="technical-sheet-header">
          <button className="technical-sheet-back" type="button" onClick={() => navigate(returnTo)}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="technical-sheet-heading">
            <span className="technical-sheet-icon"><FileText size={26} /></span>
            <div>
              <p>Ficha técnica</p>
              <h1>{productName}</h1>
            </div>
          </div>
          {fileUrl && (
            <a className="technical-sheet-download" href={fileUrl} download>
              <Download size={16} /> Descargar PDF
            </a>
          )}
        </div>

        <div className="technical-sheet-viewer-card">
          {fileUrl ? (
            <Suspense fallback={<div className="pdf-inline-viewer__state pdf-inline-viewer__state--static">Cargando ficha técnica...</div>}>
              <PdfInlineViewer fileUrl={fileUrl} title={`Ficha técnica de ${productName}`} />
            </Suspense>
          ) : (
            <div className="pdf-inline-viewer__state pdf-inline-viewer__state--static">Ficha técnica pendiente.</div>
          )}
        </div>
      </section>
    </main>
  )
}

export default TechnicalSheetViewer
