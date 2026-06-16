import { optimizeImage } from './images'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function productPrice(product) {
  return product.price && product.price !== '0' ? product.price : 'Cotizar'
}

function catalogCategoryMarkup(category, products) {
  const categoryProducts = products.filter((product) => product.categoryId === category.id && product.active !== false)

  return `
    <section class="catalog-category">
      <div class="catalog-category__header">
        <div>
          <p>${categoryProducts.length} producto${categoryProducts.length === 1 ? '' : 's'}</p>
          <h2>${escapeHtml(category.name)}</h2>
          ${category.description ? `<span>${escapeHtml(category.description)}</span>` : ''}
        </div>
      </div>

      ${categoryProducts.length ? `
        <div class="catalog-products">
          ${categoryProducts.map((product) => `
            <article class="catalog-product">
              <div class="catalog-product__image">
                ${product.image ? `<img src="${escapeHtml(optimizeImage(product.image, { width: 700 }))}" alt="${escapeHtml(product.name)}">` : '<span>Foto pendiente</span>'}
              </div>
              <div class="catalog-product__body">
                <p>${escapeHtml(product.category || category.name)}</p>
                <h3>${escapeHtml(product.name)}</h3>
                <strong>${escapeHtml(productPrice(product))}</strong>
                ${product.size ? `<span>${escapeHtml(product.size)}</span>` : ''}
                ${product.material ? `<span>Material: ${escapeHtml(product.material)}</span>` : ''}
                ${product.color ? `<span>Acabado: ${escapeHtml(product.color)}</span>` : ''}
                ${product.description ? `<em>${escapeHtml(product.description)}</em>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      ` : '<div class="catalog-empty">Sin productos activos en esta categoria.</div>'}
    </section>
  `
}

export function downloadCatalogPdf({ categories, products }) {
  const visibleCategories = categories.filter((category) => category.active !== false)
  const visibleProducts = products.filter((product) => product.active !== false)
  const generatedAt = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Catalogo FORMAS</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: #1a1714;
            background: #f8f2eb;
            font-family: "DM Sans", Arial, sans-serif;
          }
          .catalog {
            max-width: 1080px;
            margin: 0 auto;
            padding: 42px;
          }
          .catalog-cover {
            padding: 36px 0 30px;
            border-bottom: 1px solid #dfd0bf;
            margin-bottom: 28px;
          }
          .catalog-cover p {
            margin: 0 0 12px;
            color: #c9956c;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.22em;
            text-transform: uppercase;
          }
          .catalog-cover h1 {
            margin: 0 0 12px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 46px;
            font-weight: 400;
          }
          .catalog-cover span {
            color: #75695f;
            font-size: 15px;
          }
          .catalog-summary {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 30px;
          }
          .catalog-summary div {
            padding: 16px;
            border: 1px solid #dfd0bf;
            border-radius: 12px;
            background: #fffaf5;
          }
          .catalog-summary strong {
            display: block;
            font-size: 28px;
          }
          .catalog-summary span {
            color: #75695f;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .catalog-category {
            break-inside: avoid;
            margin: 0 0 34px;
          }
          .catalog-category__header {
            margin: 0 0 16px;
          }
          .catalog-category__header p {
            margin: 0 0 6px;
            color: #c9956c;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .catalog-category__header h2 {
            margin: 0 0 6px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 30px;
            font-weight: 400;
          }
          .catalog-category__header span {
            color: #75695f;
            line-height: 1.5;
          }
          .catalog-products {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
          .catalog-product {
            display: grid;
            grid-template-columns: 150px minmax(0, 1fr);
            min-height: 160px;
            overflow: hidden;
            border: 1px solid #dfd0bf;
            border-radius: 14px;
            background: #fffaf5;
            break-inside: avoid;
          }
          .catalog-product__image {
            min-height: 160px;
            display: grid;
            place-items: center;
            color: #8b7d70;
            background: #eee5db;
            font-size: 12px;
          }
          .catalog-product__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .catalog-product__body {
            padding: 16px;
          }
          .catalog-product__body p {
            margin: 0 0 7px;
            color: #c9956c;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }
          .catalog-product__body h3 {
            margin: 0 0 8px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 21px;
            font-weight: 400;
          }
          .catalog-product__body strong {
            display: block;
            margin: 0 0 8px;
            font-size: 17px;
          }
          .catalog-product__body span,
          .catalog-product__body em {
            display: block;
            margin-top: 5px;
            color: #75695f;
            font-size: 12px;
            line-height: 1.45;
            font-style: normal;
          }
          .catalog-empty {
            padding: 18px;
            border: 1px dashed #dfd0bf;
            border-radius: 12px;
            color: #75695f;
            background: #fffaf5;
          }
          @page { margin: 14mm; }
          @media print {
            body { background: #fff; }
            .catalog { padding: 0; }
          }
        </style>
      </head>
      <body>
        <main class="catalog">
          <section class="catalog-cover">
            <p>Catalogo de productos</p>
            <h1>FORMAS</h1>
            <span>Catalogo generado el ${escapeHtml(generatedAt)} con los productos y categorias cargados actualmente.</span>
          </section>

          <section class="catalog-summary">
            <div><strong>${visibleCategories.length}</strong><span>Categorias</span></div>
            <div><strong>${visibleProducts.length}</strong><span>Productos activos</span></div>
          </section>

          ${visibleCategories.map((category) => catalogCategoryMarkup(category, visibleProducts)).join('')}
        </main>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.addEventListener('load', () => {
    printWindow.focus()
    printWindow.print()
  })
}
