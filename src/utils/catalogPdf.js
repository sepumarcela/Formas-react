import { optimizeImage } from './images'

const categoryCopy = {
  'centros-entretenimiento': 'Piezas pensadas para integrar tecnologia, almacenamiento y atmosfera en el centro social de la casa.',
  'centros-estudio': 'Ambientes de trabajo que equilibran concentracion, orden y calidez para crear todos los dias.',
  closets: 'Soluciones a medida para guardar mejor, ver mejor y disfrutar rutinas mas simples.',
  cocinas: 'Cocinas disenadas para transformar la rutina diaria en una experiencia de diseno.',
  'muebles-bano': 'Mobiliario resistente y refinado para convertir el bano en un espacio de calma.',
  repisas: 'Elementos ligeros que organizan, exhiben y completan la personalidad de cada ambiente.',
  'alcobas-infantiles': 'Muebles seguros, flexibles y cercanos para acompanar cada etapa de crecimiento.',
  bibliotecas: 'Sistemas para ordenar, exhibir y dar caracter arquitectonico a tus espacios.',
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim()
}

function productSubtitle(product, category) {
  const parts = [product.color, product.material].map(cleanText).filter(Boolean)
  if (parts.length) return parts.slice(0, 2).join(' + ')

  const fallback = cleanText(product.description || categoryCopy[category.id] || category.description || '')
  if (!fallback) return 'Diseno a medida para espacios con caracter'
  return fallback.length > 70 ? `${fallback.slice(0, 67).trim()}...` : fallback
}

function productPrice(product) {
  return cleanText(product.price || product.priceText || '') || 'Cotizar'
}

function productDetails(product) {
  return [
    ['Medidas', product.size],
    ['Material', product.material],
    ['Acabado', product.color || product.colorFinish],
    ['Entrega', product.leadTime],
  ].map(([label, value]) => [label, cleanText(value)]).filter(([, value]) => value)
}

function categoryProducts(category, products) {
  return products.filter((product) => product.categoryId === category.id && product.active !== false)
}

function chunkItems(items, size) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

function firstImage(items = []) {
  return items.find((item) => item?.image)?.image || ''
}

function imageUrl(image, width = 1200) {
  return image ? optimizeImage(image, { width }) : ''
}

function imageMarkup(image, alt, width = 1200, className = '') {
  if (!image) return '<span>Foto pendiente</span>'
  return `<img class="${className}" src="${escapeHtml(imageUrl(image, width))}" alt="${escapeHtml(alt)}">`
}

function backgroundStyle(image, width = 1600) {
  return image ? `style="background-image: linear-gradient(90deg, rgba(20, 17, 14, 0.72), rgba(20, 17, 14, 0.18)), url('${escapeHtml(imageUrl(image, width))}')"` : ''
}

function logoMarkup(logoImage, variant = 'light') {
  if (logoImage) {
    return `<img class="catalog-logo catalog-logo--${variant}" src="${escapeHtml(imageUrl(logoImage, 420))}" alt="FORMAS">`
  }

  return `
    <div class="catalog-logo-fallback catalog-logo-fallback--${variant}">
      <strong>FORMAS</strong>
      <small>DISENA TU ESTILO</small>
    </div>
  `
}

function indexMarkup(categories, products) {
  const heroCategory = categories[0]
  const heroImage = heroCategory ? heroCategory.image || firstImage(categoryProducts(heroCategory, products)) : ''

  return `
    <section class="catalog-page catalog-page--light catalog-index">
      <div class="catalog-index__intro">
        <div>
          <div class="catalog-kicker">Indice</div>
          <h2>Espacios para recorrer con calma</h2>
        </div>
        <p class="catalog-lead">Una guia visual para moverte por las lineas de FORMAS sin perder la sensacion de proyecto integral.</p>
      </div>
      <div class="catalog-index__layout">
        <div class="catalog-index__hero">${imageMarkup(heroImage, heroCategory?.name || 'FORMAS', 1200)}</div>
        <div class="catalog-index__list">
          ${categories.map((category, index) => {
            const items = categoryProducts(category, products)
            return `
              <article class="catalog-index__item">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <strong>${escapeHtml(category.name)}</strong>
                <small>${items.length} producto${items.length === 1 ? '' : 's'}</small>
              </article>
            `
          }).join('')}
        </div>
      </div>
    </section>
  `
}

function philosophyMarkup() {
  const values = [
    ['Diseno a medida', 'Cada proyecto nace de una necesidad real y se adapta al espacio, al uso y al estilo de vida.'],
    ['Fabricacion precisa', 'Cuidamos proporciones, acabados y detalles tecnicos para que el mueble se sienta integrado.'],
    ['Acompanamiento', 'Guiamos decisiones de material, color y distribucion para construir confianza desde el primer contacto.'],
  ]

  return `
    <section class="catalog-page catalog-page--light catalog-philosophy">
      <div class="catalog-philosophy__intro">
        <div class="catalog-kicker">Nuestra filosofia</div>
        <h2>No fabricamos muebles aislados. Disenamos espacios para vivir mejor.</h2>
      </div>
      <div class="catalog-philosophy__grid">
        ${values.map(([title, text]) => `
          <article>
            <span></span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `
}

function materialsMarkup() {
  const items = [
    ['Materiales y acabados', 'MDF RH, melaminicos, laminados, tonos madera y superficies faciles de mantener.'],
    ['Herrajes premium', 'Sistemas funcionales para apertura, cierre, organizacion y uso diario con mayor comodidad.'],
    ['Proyectos personalizados', 'Medidas, distribuciones y detalles pensados para cocinas, closets, estudios, banos y zonas sociales.'],
  ]

  return `
    <section class="catalog-page catalog-page--light catalog-materials">
      <div class="catalog-kicker">Detalles que elevan el resultado</div>
      <h2>Materialidad calida, funcionalidad precisa y acabados que se sienten bien.</h2>
      <div class="catalog-materials__list">
        ${items.map(([title, text], index) => `
          <article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>${title}</h3>
              <p>${text}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `
}

function processMarkup() {
  const steps = [
    ['Diagnostico', 'Entendemos el espacio, las medidas y la forma en que lo quieres usar.'],
    ['Diseno', 'Definimos distribucion, materiales, acabados y detalles de fabricacion.'],
    ['Produccion', 'Fabricamos con precision para lograr un resultado limpio y durable.'],
    ['Instalacion', 'Cerramos el proyecto cuidando ajustes, remates y experiencia final.'],
  ]

  return `
    <section class="catalog-page catalog-page--light catalog-process">
      <div class="catalog-kicker">Proceso de fabricacion</div>
      <h2>Un recorrido claro desde la idea hasta el espacio instalado.</h2>
      <div class="catalog-process__steps">
        ${steps.map(([title, text], index) => `
          <article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `
}

function categoryCoverMarkup(category, products, index) {
  const items = categoryProducts(category, products)
  const image = category.image || firstImage(items)
  const text = categoryCopy[category.id] || category.description || 'Una linea disenada para resolver necesidades reales con calidez, orden y precision.'

  return `
    <section class="catalog-page catalog-category">
      <div class="catalog-category__media">
        ${imageMarkup(image, category.name, 1800, 'catalog-category__image')}
      </div>
      <div class="catalog-category__content">
        <div class="catalog-kicker">Linea ${String(index + 1).padStart(2, '0')}</div>
        <h2>${escapeHtml(category.name)}</h2>
        <p>${escapeHtml(text)}</p>
        <span>${items.length} producto${items.length === 1 ? '' : 's'} seleccionado${items.length === 1 ? '' : 's'}</span>
      </div>
    </section>
  `
}

function productCardMarkup(product, category, index) {
  const subtitle = productSubtitle(product, category)
  const details = productDetails(product)
  const description = cleanText(product.description)

  return `
    <article class="catalog-product-card">
      <div class="catalog-product-card__image">
        ${imageMarkup(product.image, product.name, 1100)}
      </div>
      <div class="catalog-product-card__body">
        <p>${escapeHtml(product.category || category.name)} / ${String(index + 1).padStart(2, '0')}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <strong>${escapeHtml(productPrice(product))}</strong>
        <em>${escapeHtml(subtitle)}</em>
        ${details.length ? `
          <dl class="catalog-product-card__details">
            ${details.map(([label, value]) => `
              <div>
                <dt>${escapeHtml(label)}</dt>
                <dd>${escapeHtml(value)}</dd>
              </div>
            `).join('')}
          </dl>
        ` : ''}
        ${description ? `<small>${escapeHtml(description)}</small>` : ''}
      </div>
    </article>
  `
}

function categoryProductsMarkup(category, products) {
  const items = categoryProducts(category, products)
  const pages = chunkItems(items, 4)

  if (!items.length) {
    return `
      <section class="catalog-page catalog-page--light catalog-empty-page">
        <div class="catalog-kicker">Productos</div>
        <h2>${escapeHtml(category.name)}</h2>
        <p>No hay productos activos en esta categoria.</p>
      </section>
    `
  }

  return pages.map((pageItems, pageIndex) => `
    <section class="catalog-page catalog-page--light catalog-product-page">
      <div class="catalog-product-page__header">
        <div>
          <div class="catalog-kicker">Productos ${pageIndex + 1} / ${pages.length}</div>
          <h2>${escapeHtml(category.name)}</h2>
        </div>
        <span>${items.length} producto${items.length === 1 ? '' : 's'}</span>
      </div>
      <div class="catalog-product-grid">
        ${pageItems.map((product, index) => productCardMarkup(product, category, pageIndex * 4 + index)).join('')}
      </div>
    </section>
  `).join('')
}

function contactMarkup(pageContent) {
  const contact = pageContent?.contacto || {}
  const phone = contact.phone || contact.whatsapp || ''
  const email = contact.email || ''
  const city = contact.city || 'Medellin, Colombia'

  return `
    <section class="catalog-page catalog-contact">
      <div>
        <div class="catalog-kicker">Contacto y cotizacion</div>
        <h2>Hablemos del espacio que quieres transformar.</h2>
        <p>Cuentanos que necesitas, comparte medidas o referentes, y te acompanamos para convertir la idea en una solucion fabricable, funcional y coherente con tu estilo.</p>
      </div>
      <div class="catalog-contact__box">
        ${phone ? `<span>Telefono / WhatsApp</span><strong>${escapeHtml(phone)}</strong>` : ''}
        ${email ? `<span>Correo</span><strong>${escapeHtml(email)}</strong>` : ''}
        <span>Ubicacion</span><strong>${escapeHtml(city)}</strong>
      </div>
    </section>
  `
}

export function downloadCatalogPdf({ categories, products, pageContent }) {
  const visibleCategories = categories.filter((category) => category.active !== false)
  const visibleProducts = products.filter((product) => product.active !== false)
  const logoImage = pageContent?.homeProducts?.logoImage
  const coverImage = pageContent?.productos?.image || firstImage(visibleCategories) || firstImage(visibleProducts)
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
          html,
          body,
          .catalog-page,
          .catalog-index__item,
          .catalog-product-card,
          .catalog-contact__box {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            margin: 0;
            color: #3A332D;
            background: #F7F4EF;
            font-family: Inter, Manrope, "DM Sans", Arial, sans-serif;
          }
          .catalog {
            max-width: 1120px;
            margin: 0 auto;
            padding: 32px;
          }
          .catalog-page {
            min-height: 980px;
            margin: 0 0 30px;
            padding: 58px;
            overflow: hidden;
            position: relative;
            break-after: page;
            page-break-after: always;
            break-inside: avoid;
            page-break-inside: avoid;
            background: #F7F4EF;
          }
          .catalog-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          .catalog-page--light {
            background:
              linear-gradient(135deg, rgba(234, 228, 218, 0.92), rgba(247, 244, 239, 0.98)),
              #F7F4EF;
          }
          .catalog-kicker {
            margin: 0 0 16px;
            color: #A88F74;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.32em;
            text-transform: uppercase;
          }
          h1,
          h2,
          h3 {
            font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
            font-weight: 400;
            letter-spacing: -0.01em;
          }
          .catalog-lead {
            max-width: 720px;
            margin: 0;
            color: rgba(58, 51, 45, 0.72);
            font-size: 19px;
            line-height: 1.65;
          }
          .catalog-logo {
            width: 168px;
            max-height: 120px;
            object-fit: contain;
            display: block;
          }
          .catalog-logo-fallback strong {
            display: block;
            font-size: 28px;
            letter-spacing: 0.22em;
          }
          .catalog-logo-fallback small {
            font-size: 9px;
            letter-spacing: 0.22em;
          }
          .catalog-logo-fallback--light,
          .catalog-logo--light {
            color: #F7F4EF;
            filter: brightness(1.25);
          }
          .catalog-cover {
            min-height: 980px;
            padding: 62px;
            color: #F7F4EF;
            background-color: #3A332D;
            background-size: cover;
            background-position: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .catalog-cover__top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 28px;
          }
          .catalog-cover__content {
            max-width: 650px;
            margin-top: auto;
            padding-bottom: 34px;
          }
          .catalog-cover h1 {
            margin: 0 0 22px;
            font-size: 82px;
            line-height: 0.92;
          }
          .catalog-cover p {
            max-width: 540px;
            margin: 0;
            color: rgba(247, 244, 239, 0.82);
            font-size: 19px;
            line-height: 1.65;
          }
          .catalog-cover__date {
            color: rgba(247, 244, 239, 0.68);
            font-size: 13px;
          }
          .catalog-index h2,
          .catalog-philosophy h2,
          .catalog-materials h2,
          .catalog-process h2,
          .catalog-empty-page h2 {
            max-width: 760px;
            margin: 0 0 18px;
            color: #3A332D;
            font-size: 58px;
            line-height: 0.98;
          }
          .catalog-index__intro {
            display: grid;
            grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
            gap: 42px;
            align-items: end;
            margin-bottom: 42px;
          }
          .catalog-index__layout {
            display: grid;
            grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
            gap: 34px;
            align-items: stretch;
          }
          .catalog-index__hero {
            min-height: 620px;
            overflow: hidden;
            background: #EAE4DA;
          }
          .catalog-index__hero img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .catalog-index__hero span {
            height: 100%;
            display: grid;
            place-items: center;
            color: rgba(58, 51, 45, 0.52);
          }
          .catalog-index__list {
            display: grid;
            align-content: stretch;
            border-top: 1px solid #D8CEC1;
          }
          .catalog-index__item {
            min-width: 0;
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr) auto;
            gap: 16px;
            align-items: center;
            padding: 18px 0;
            border-bottom: 1px solid #D8CEC1;
          }
          .catalog-index__item span {
            color: #A88F74;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.18em;
          }
          .catalog-index__item strong {
            min-width: 0;
            color: #3A332D;
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(23px, 2.25vw, 31px);
            line-height: 0.96;
            font-weight: 400;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .catalog-index__item small {
            color: rgba(58, 51, 45, 0.62);
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
          }
          .catalog-philosophy__intro {
            max-width: 820px;
          }
          .catalog-philosophy__grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 30px;
            margin-top: 58px;
          }
          .catalog-philosophy__grid article:first-child {
            grid-row: span 2;
            padding-right: 46px;
          }
          .catalog-philosophy__grid article:first-child h3 {
            font-size: 42px;
          }
          .catalog-process__steps {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
            margin-top: 70px;
          }
          .catalog-philosophy article,
          .catalog-process article {
            padding: 28px 0;
            border-top: 1px solid #A88F74;
            min-width: 0;
          }
          .catalog-philosophy article span {
            display: block;
            width: 42px;
            height: 42px;
            margin-bottom: 24px;
            border-radius: 50%;
            background: #A88F74;
          }
          .catalog-philosophy h3,
          .catalog-process h3,
          .catalog-materials h3 {
            margin: 0 0 12px;
            font-size: 30px;
            line-height: 1;
          }
          .catalog-philosophy p,
          .catalog-process p,
          .catalog-materials p,
          .catalog-empty-page p {
            margin: 0;
            color: rgba(58, 51, 45, 0.66);
            line-height: 1.6;
          }
          .catalog-materials__list {
            display: grid;
            gap: 0;
            margin-top: 62px;
            border-top: 1px solid #D8CEC1;
          }
          .catalog-materials article {
            display: grid;
            grid-template-columns: 90px minmax(0, 1fr);
            gap: 24px;
            padding: 28px 0;
            border-bottom: 1px solid #D8CEC1;
          }
          .catalog-materials article > span,
          .catalog-process article > span {
            color: #A88F74;
            font-weight: 900;
            letter-spacing: 0.16em;
          }
          .catalog-category {
            color: #F7F4EF;
            min-height: 980px;
            padding: 0;
            background-color: #3A332D;
            display: grid;
            place-items: stretch;
          }
          .catalog-category__media {
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            overflow: hidden;
            background: #2f2924;
          }
          .catalog-category__media::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(20, 17, 14, 0.08), rgba(20, 17, 14, 0.68)),
              linear-gradient(90deg, rgba(20, 17, 14, 0.42), rgba(20, 17, 14, 0.12));
          }
          .catalog-category__image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            display: block;
          }
          .catalog-category__media span {
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
            color: rgba(247, 244, 239, 0.62);
          }
          .catalog-category__content {
            position: absolute;
            left: 58px;
            right: 58px;
            bottom: 58px;
            max-width: 680px;
            z-index: 1;
          }
          .catalog-category h2 {
            margin: 0 0 18px;
            font-size: 76px;
            line-height: 0.92;
          }
          .catalog-category p {
            margin: 0 0 26px;
            color: rgba(247, 244, 239, 0.82);
            font-size: 21px;
            line-height: 1.55;
          }
          .catalog-category span {
            display: inline-flex;
            padding: 12px 18px;
            border: 1px solid rgba(247, 244, 239, 0.35);
            color: #F7F4EF;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .catalog-product-page {
            padding: 42px;
          }
          .catalog-product-page__header {
            min-height: 88px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 24px;
            align-items: start;
            margin-bottom: 24px;
          }
          .catalog-product-page__header h2 {
            max-width: 680px;
            margin: 0;
            color: #3A332D;
            font-size: 52px;
            line-height: 0.95;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .catalog-product-page__header span {
            padding-top: 8px;
            color: rgba(58, 51, 45, 0.56);
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .catalog-product-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
          .catalog-product-card {
            min-height: 0;
            height: 392px;
            display: grid;
            grid-template-rows: 58% 42%;
            overflow: hidden;
            border: 1px solid #D8CEC1;
            background: rgba(255, 255, 255, 0.64);
            box-shadow: 0 22px 48px rgba(58, 51, 45, 0.08);
          }
          .catalog-product-card__image {
            min-width: 0;
            min-height: 0;
            overflow: hidden;
            background: #EAE4DA;
            display: grid;
            place-items: center;
            color: rgba(58, 51, 45, 0.5);
            font-size: 11px;
            font-weight: 800;
          }
          .catalog-product-card__image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
          .catalog-product-card__body {
            min-width: 0;
            min-height: 0;
            padding: 16px 20px 18px;
            color: #3A332D;
            overflow: hidden;
          }
          .catalog-product-card__body p {
            margin: 0 0 6px;
            color: #A88F74;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .catalog-product-card__body h3 {
            margin: 0 0 6px;
            color: #3A332D;
            font-size: 24px;
            line-height: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .catalog-product-card__body strong {
            display: block;
            margin: 0 0 5px;
            color: #1f1a16;
            font-size: 14px;
            line-height: 1.1;
            font-weight: 900;
          }
          .catalog-product-card__body em {
            display: block;
            color: rgba(58, 51, 45, 0.62);
            font-size: 11px;
            line-height: 1.25;
            font-style: normal;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .catalog-product-card__details {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5px 12px;
            margin: 10px 0 0;
          }
          .catalog-product-card__details div {
            min-width: 0;
          }
          .catalog-product-card__details dt {
            margin: 0 0 2px;
            color: #A88F74;
            font-size: 7px;
            font-weight: 900;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .catalog-product-card__details dd {
            margin: 0;
            color: rgba(58, 51, 45, 0.76);
            font-size: 9px;
            line-height: 1.22;
            overflow-wrap: anywhere;
          }
          .catalog-product-card__body small {
            display: -webkit-box;
            margin-top: 9px;
            color: rgba(58, 51, 45, 0.58);
            font-size: 9px;
            line-height: 1.25;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .catalog-contact {
            min-height: 980px;
            color: #F7F4EF;
            background:
              radial-gradient(circle at 80% 20%, rgba(168, 143, 116, 0.28), transparent 34%),
              linear-gradient(135deg, #3A332D 0%, #211c18 100%);
            display: grid;
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 48px;
            align-items: end;
          }
          .catalog-contact h2 {
            max-width: 720px;
            margin: 0 0 22px;
            font-size: 72px;
            line-height: 0.94;
          }
          .catalog-contact p {
            max-width: 560px;
            margin: 0;
            color: rgba(247, 244, 239, 0.76);
            font-size: 19px;
            line-height: 1.65;
          }
          .catalog-contact__box {
            padding: 28px;
            border: 1px solid rgba(247, 244, 239, 0.18);
            background: rgba(247, 244, 239, 0.08);
          }
          .catalog-contact__box span {
            display: block;
            margin: 18px 0 5px;
            color: #A88F74;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .catalog-contact__box span:first-child {
            margin-top: 0;
          }
          .catalog-contact__box strong {
            display: block;
            color: #F7F4EF;
            font-size: 18px;
            line-height: 1.45;
          }
          @page { size: A4 portrait; margin: 0; }
          @media (max-width: 900px) {
            .catalog {
              padding: 16px;
            }
            .catalog-page {
              min-height: auto;
              padding: 32px;
            }
            .catalog-index__intro,
            .catalog-index__layout,
            .catalog-product-grid {
              grid-template-columns: 1fr;
              grid-template-rows: none;
            }
            .catalog-product-card {
              height: auto;
              min-height: 360px;
            }
            .catalog-cover h1,
            .catalog-category h2,
            .catalog-contact h2 {
              font-size: 54px;
            }
          }
          @media (max-width: 620px) {
            .catalog-page {
              padding: 24px;
            }
            .catalog-index__item,
            .catalog-contact {
              grid-template-columns: 1fr;
            }
            .catalog-index__hero {
              min-height: 260px;
            }
            .catalog-philosophy__grid,
            .catalog-process__steps {
              grid-template-columns: 1fr;
            }
            .catalog-philosophy__grid article:first-child {
              grid-row: auto;
              padding-right: 0;
            }
            .catalog-product-card {
              grid-template-rows: 72% 28%;
            }
          }
          @media print {
            body { background: #F7F4EF; }
            .catalog {
              max-width: none;
              padding: 0;
            }
            .catalog-page {
              width: 210mm;
              height: 297mm;
              min-height: 0;
              margin: 0;
              border-radius: 0;
              box-shadow: none;
              break-after: page;
              page-break-after: always;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .catalog-page:last-child {
              break-after: auto;
              page-break-after: auto;
            }
            .catalog-product-page {
              padding: 12mm;
            }
            .catalog-product-page__header {
              min-height: 22mm;
              margin-bottom: 6mm;
            }
            .catalog-product-page__header h2 {
              font-size: 38px;
            }
            .catalog-product-grid {
              height: 245mm;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              grid-template-rows: repeat(2, minmax(0, 1fr));
              gap: 8mm;
            }
            .catalog-product-card {
              height: auto;
              min-height: 0;
              grid-template-rows: 58% 42%;
            }
            .catalog-product-card__body h3 {
              font-size: 22px;
            }
            .catalog-product-card__body {
              padding: 4.5mm 5mm 5mm;
            }
            .catalog-product-card__body small {
              -webkit-line-clamp: 2;
            }
          }
        </style>
      </head>
      <body>
        <main class="catalog">
          <section class="catalog-page catalog-cover" ${backgroundStyle(coverImage, 1800)}>
            <div class="catalog-cover__top">
              ${logoMarkup(logoImage, 'light')}
              <span class="catalog-cover__date">${escapeHtml(generatedAt)}</span>
            </div>
            <div class="catalog-cover__content">
              <div class="catalog-kicker">Catalogo de productos</div>
              <h1>Espacios disenados a la medida de tu vida.</h1>
              <p>Una mirada editorial a las lineas, materiales y productos que FORMAS desarrolla para convertir mobiliario en arquitectura interior.</p>
            </div>
          </section>

          ${indexMarkup(visibleCategories, visibleProducts)}
          ${philosophyMarkup()}
          ${materialsMarkup()}
          ${processMarkup()}
          ${visibleCategories.map((category, index) => `
            ${categoryCoverMarkup(category, visibleProducts, index)}
            ${categoryProductsMarkup(category, visibleProducts)}
          `).join('')}
          ${contactMarkup(pageContent)}
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
