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

function logoMarkup(logoImage) {
  if (logoImage) {
    return `<img class="catalog-logo__image" src="${escapeHtml(optimizeImage(logoImage, { width: 420 }))}" alt="FORMAS">`
  }

  return `
    <div class="catalog-logo__fallback">
      <div class="catalog-logo__mark">
        <span></span><span></span><span></span><span></span>
      </div>
      <strong>FORMAS</strong>
      <small>DISENA TU ESTILO</small>
    </div>
  `
}

function categoryProducts(category, products) {
  return products.filter((product) => product.categoryId === category.id && product.active !== false)
}

function imageMarkup(image, alt, width = 900) {
  if (!image) return '<span>Foto pendiente</span>'
  return `<img src="${escapeHtml(optimizeImage(image, { width }))}" alt="${escapeHtml(alt)}">`
}

function indexMarkup(categories, products) {
  return `
    <section class="catalog-page catalog-index">
      <div class="catalog-page__eyebrow">Indice</div>
      <h2>Encuentra rapido lo que necesitas</h2>
      <p class="catalog-lead">El catalogo esta organizado por categorias para que puedas revisar cada linea y sus productos disponibles.</p>
      <div class="catalog-index__grid">
        ${categories.map((category, index) => {
          const total = categoryProducts(category, products).length
          return `
            <div class="catalog-index__item">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <strong>${escapeHtml(category.name)}</strong>
              <small>${total} producto${total === 1 ? '' : 's'}</small>
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

function categoryCoverMarkup(category, products, index) {
  const total = categoryProducts(category, products).length

  return `
    <section class="catalog-page catalog-category-cover">
      <div class="catalog-category-cover__copy">
        <p class="catalog-page__eyebrow">Linea ${String(index + 1).padStart(2, '0')}</p>
        <h2>${escapeHtml(category.name)}</h2>
        ${category.description ? `<p class="catalog-lead">${escapeHtml(category.description)}</p>` : ''}
        <div class="catalog-pill">${total} producto${total === 1 ? '' : 's'} disponible${total === 1 ? '' : 's'}</div>
      </div>
      <div class="catalog-category-cover__image">
        ${imageMarkup(category.image, category.name, 1200)}
      </div>
    </section>
  `
}

function productMarkup(product, category) {
  return `
    <article class="catalog-product">
      <div class="catalog-product__image">
        ${imageMarkup(product.image, product.name, 900)}
      </div>
      <div class="catalog-product__body">
        <p>${escapeHtml(product.category || category.name)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <strong>${escapeHtml(productPrice(product))}</strong>
        <div class="catalog-product__meta">
          ${product.size ? `<span>${escapeHtml(product.size)}</span>` : ''}
          ${product.material ? `<span>Material: ${escapeHtml(product.material)}</span>` : ''}
          ${product.color ? `<span>Acabado: ${escapeHtml(product.color)}</span>` : ''}
          ${product.leadTime ? `<span>Entrega: ${escapeHtml(product.leadTime)}</span>` : ''}
        </div>
        ${product.description ? `<em>${escapeHtml(product.description)}</em>` : ''}
      </div>
    </article>
  `
}

function categoryProductsMarkup(category, products) {
  const items = categoryProducts(category, products)

  return `
    <section class="catalog-page catalog-product-page">
      <div class="catalog-product-page__header">
        <p class="catalog-page__eyebrow">Productos</p>
        <h2>${escapeHtml(category.name)}</h2>
      </div>
      ${items.length ? `
        <div class="catalog-products">
          ${items.map((product) => productMarkup(product, category)).join('')}
        </div>
      ` : '<div class="catalog-empty">No hay productos activos en esta categoria.</div>'}
    </section>
  `
}

export function downloadCatalogPdf({ categories, products, pageContent }) {
  const visibleCategories = categories.filter((category) => category.active !== false)
  const visibleProducts = products.filter((product) => product.active !== false)
  const logoImage = pageContent?.homeProducts?.logoImage
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
            background: #f7f0e8;
            font-family: "DM Sans", Arial, sans-serif;
          }
          .catalog {
            max-width: 1120px;
            margin: 0 auto;
            padding: 34px;
          }
          .catalog-page {
            min-height: 940px;
            padding: 42px;
            margin: 0 0 28px;
            border: 1px solid #e0cdbc;
            border-radius: 28px;
            background:
              radial-gradient(circle at top right, rgba(201, 149, 108, 0.22), transparent 32%),
              linear-gradient(135deg, #fffaf5 0%, #f5eadf 100%);
            break-after: page;
            overflow: hidden;
            position: relative;
          }
          .catalog-page::after {
            content: "";
            position: absolute;
            right: 34px;
            bottom: 30px;
            width: 70px;
            height: 2px;
            background: #c9956c;
          }
          .catalog-cover {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 340px;
            gap: 34px;
            align-items: center;
          }
          .catalog-logo__image {
            width: 210px;
            max-height: 150px;
            object-fit: contain;
            display: block;
            margin-bottom: 42px;
          }
          .catalog-logo__fallback {
            margin-bottom: 42px;
          }
          .catalog-logo__fallback strong {
            display: block;
            margin-top: 12px;
            font-size: 42px;
            font-weight: 400;
            letter-spacing: 0.18em;
          }
          .catalog-logo__fallback small {
            color: #8a7564;
            font-size: 10px;
            letter-spacing: 0.24em;
          }
          .catalog-logo__mark {
            width: 74px;
            height: 74px;
            position: relative;
          }
          .catalog-logo__mark span {
            position: absolute;
            width: 34px;
            height: 34px;
            border: 2px solid #c9956c;
            transform: rotate(45deg);
          }
          .catalog-logo__mark span:nth-child(1) { left: 8px; top: 8px; }
          .catalog-logo__mark span:nth-child(2) { right: 8px; top: 8px; }
          .catalog-logo__mark span:nth-child(3) { left: 8px; bottom: 8px; }
          .catalog-logo__mark span:nth-child(4) { right: 8px; bottom: 8px; }
          .catalog-page__eyebrow {
            margin: 0 0 14px;
            color: #c9956c;
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 0.28em;
            text-transform: uppercase;
          }
          .catalog-cover h1 {
            margin: 0 0 18px;
            max-width: 620px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 64px;
            line-height: 0.98;
            font-weight: 400;
          }
          .catalog-lead {
            margin: 0;
            color: #77685d;
            font-size: 18px;
            line-height: 1.65;
          }
          .catalog-cover__stats {
            display: grid;
            gap: 14px;
          }
          .catalog-cover__stats div,
          .catalog-pill,
          .catalog-index__item {
            border: 1px solid #dec7b6;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.66);
            box-shadow: 0 18px 38px rgba(62, 44, 30, 0.08);
          }
          .catalog-cover__stats div {
            padding: 22px;
          }
          .catalog-cover__stats strong {
            display: block;
            font-size: 42px;
            line-height: 1;
          }
          .catalog-cover__stats span {
            color: #8a7564;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .catalog-cover__date {
            margin-top: 26px;
            color: #8a7564;
            font-size: 14px;
          }
          .catalog-index h2,
          .catalog-category-cover h2,
          .catalog-product-page h2 {
            margin: 0 0 12px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 48px;
            line-height: 1;
            font-weight: 400;
          }
          .catalog-index__grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 30px;
          }
          .catalog-index__item {
            padding: 18px;
            display: grid;
            grid-template-columns: 54px minmax(0, 1fr);
            gap: 14px;
            align-items: center;
          }
          .catalog-index__item span {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            color: #fff;
            background: #1a1714;
            font-weight: 900;
          }
          .catalog-index__item strong {
            display: block;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 24px;
            font-weight: 400;
          }
          .catalog-index__item small {
            color: #8a7564;
            font-weight: 800;
          }
          .catalog-category-cover {
            display: grid;
            grid-template-columns: 0.8fr 1.2fr;
            gap: 32px;
            align-items: center;
          }
          .catalog-category-cover__image {
            aspect-ratio: 1 / 1;
            border: 1px solid #dec7b6;
            border-radius: 28px;
            background: #efe4d9;
            display: grid;
            place-items: center;
            overflow: hidden;
            color: #8a7564;
            font-weight: 800;
          }
          .catalog-category-cover__image img,
          .catalog-product__image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            display: block;
          }
          .catalog-pill {
            display: inline-flex;
            margin-top: 28px;
            padding: 12px 18px;
            color: #1a1714;
            font-weight: 900;
          }
          .catalog-product-page__header {
            margin-bottom: 24px;
          }
          .catalog-products {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .catalog-product {
            display: grid;
            grid-template-columns: 220px minmax(0, 1fr);
            min-height: 220px;
            overflow: hidden;
            border: 1px solid #dec7b6;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.74);
            break-inside: avoid;
            box-shadow: 0 18px 34px rgba(62, 44, 30, 0.08);
          }
          .catalog-product__image {
            aspect-ratio: 1 / 1;
            min-height: 220px;
            display: grid;
            place-items: center;
            color: #8a7564;
            background: #efe4d9;
            font-size: 12px;
            font-weight: 800;
            overflow: hidden;
          }
          .catalog-product__body {
            padding: 22px;
          }
          .catalog-product__body p {
            margin: 0 0 8px;
            color: #c9956c;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .catalog-product__body h3 {
            margin: 0 0 8px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 28px;
            line-height: 1.05;
            font-weight: 400;
          }
          .catalog-product__body strong {
            display: block;
            margin: 0 0 12px;
            font-size: 23px;
          }
          .catalog-product__meta {
            display: grid;
            gap: 5px;
          }
          .catalog-product__meta span,
          .catalog-product__body em {
            display: block;
            color: #75695f;
            font-size: 15px;
            line-height: 1.45;
            font-style: normal;
          }
          .catalog-product__body em {
            margin-top: 12px;
          }
          .catalog-empty {
            padding: 26px;
            border: 1px dashed #dec7b6;
            border-radius: 18px;
            color: #75695f;
            background: rgba(255, 255, 255, 0.7);
          }
          @page { margin: 10mm; }
          @media print {
            body { background: #fff; }
            .catalog {
              max-width: none;
              padding: 0;
            }
            .catalog-page {
              min-height: auto;
              margin: 0;
              border: 0;
              border-radius: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <main class="catalog">
          <section class="catalog-page catalog-cover">
            <div>
              ${logoMarkup(logoImage)}
              <p class="catalog-page__eyebrow">Catalogo de productos</p>
              <h1>Muebles para vivir mejor cada espacio</h1>
              <p class="catalog-lead">Una guia visual con las categorias y productos activos de FORMAS, pensada para elegir con calma, comparar ideas y empezar a imaginar tu proyecto.</p>
              <div class="catalog-cover__date">Generado el ${escapeHtml(generatedAt)}</div>
            </div>
            <aside class="catalog-cover__stats">
              <div><strong>${visibleCategories.length}</strong><span>Categorias</span></div>
              <div><strong>${visibleProducts.length}</strong><span>Productos activos</span></div>
            </aside>
          </section>

          ${indexMarkup(visibleCategories, visibleProducts)}
          ${visibleCategories.map((category, index) => `
            ${categoryCoverMarkup(category, visibleProducts, index)}
            ${categoryProductsMarkup(category, visibleProducts)}
          `).join('')}
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
