import { Info } from 'lucide-react'

function ProductImageDisclaimer({ dark = false }) {
  return (
    <p className={`product-image-disclaimer${dark ? ' product-image-disclaimer--dark' : ''}`}>
      <Info size={17} aria-hidden="true" />
      <span>Las imágenes de los productos son referenciales.</span>
    </p>
  )
}

export default ProductImageDisclaimer
