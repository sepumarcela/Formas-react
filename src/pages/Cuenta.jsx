import { useMemo, useState } from 'react'
import {
  BadgePlus,
  Download,
  Eye,
  EyeOff,
  FileJson,
  Images,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Newspaper,
  Package,
  Save,
  Tags,
  Trash2,
  Upload,
} from 'lucide-react'
import { createSlug, defaultSiteContent } from '../data/siteContent'
import { useSiteContent } from '../hooks/useSiteContent'

const sections = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'hero', label: 'Inicio', icon: Images },
  { id: 'pages', label: 'Páginas', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'bulk', label: 'Carga masiva', icon: FileJson },
]

const pageOptions = [
  { id: 'homeProducts', label: 'Productos en inicio' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'blog', label: 'Blog' },
  { id: 'contacto', label: 'Contacto' },
]

const ADMIN_SESSION_KEY = 'formas-admin-authenticated'
const ADMIN_EMAIL = 'admin@formas.com'
const ADMIN_PASSWORD = 'Formas2026'

function getEmptyProduct(category) {
  return {
    id: '',
    categoryId: category?.id || '',
    category: category?.name || '',
    name: '',
    price: '',
    size: '',
    description: '',
    material: '',
    color: '',
    leadTime: '',
    image: '',
    featured: false,
  }
}

function getEmptyHeroSlide(index) {
  return {
    id: `inicio-${index}`,
    eyebrow: '',
    titleAccent: 'Diseña',
    title: 'tu estilo',
    description: 'Muebles modernos y funcionales\npara transformar cada espacio\nde tu hogar.',
    primaryLabel: 'Ver colecciones',
    primaryLink: '/proyectos',
    secondaryLabel: 'Solicitar diseño',
    secondaryLink: '/contacto',
    image: '',
    active: true,
  }
}

const iconOptions = [
  ['tv', 'TV'],
  ['desk', 'Estudio'],
  ['closet', 'Closet'],
  ['kitchen', 'Cocina'],
  ['bath', 'Baño'],
  ['shelf', 'Repisa'],
  ['bed', 'Alcoba'],
  ['book', 'Biblioteca'],
]

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function parseCsvLine(line) {
  const values = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"' && quoted && next === '"') {
      current += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

function parseCsv(text) {
  const rows = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map(parseCsvLine)

  const headers = rows.shift()?.map((header) => header.trim()) || []
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])))
}

function escapeCsv(value) {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsv(items, headers) {
  return [
    headers.join(','),
    ...items.map((item) => headers.map((header) => escapeCsv(item[header])).join(',')),
  ].join('\n')
}

function normalizeImagePath(image) {
  if (!image) return ''
  if (/^(data:|https?:\/\/|\/)/.test(image)) return image
  return `/images/${image}`
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function formatCop(value) {
  const digits = onlyDigits(value)
  if (!digits) return ''
  return `$${Number(digits).toLocaleString('es-CO')}`
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const csvConfig = {
  products: {
    label: 'Productos',
    filename: 'productos-formas.csv',
    headers: ['id', 'categoryId', 'category', 'name', 'price', 'size', 'description', 'material', 'color', 'leadTime', 'image', 'featured'],
  },
  categories: {
    label: 'Categorías',
    filename: 'categorias-formas.csv',
    headers: ['id', 'name', 'description', 'image', 'icon'],
  },
  blogPosts: {
    label: 'Blog',
    filename: 'blog-formas.csv',
    headers: ['id', 'tag', 'date', 'title', 'desc', 'image', 'body'],
  },
}

function Cuenta() {
  const [content, setContent] = useSiteContent()
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [newProduct, setNewProduct] = useState(() => getEmptyProduct(content.categories[0]))
  const [bulkType, setBulkType] = useState('products')
  const [pageKey, setPageKey] = useState('proyectos')
  const [csvPreview, setCsvPreview] = useState('')
  const [notice, setNotice] = useState('')

  const stats = useMemo(() => ([
    { label: 'Productos', value: content.products.length },
    { label: 'Destacados', value: content.products.filter((product) => product.featured).length },
    { label: 'Categorías', value: content.categories.length },
    { label: 'Fotos inicio', value: content.heroSlides.length },
  ]), [content])

  function flash(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2400)
  }

  function handleLogin(event) {
    event.preventDefault()

    if (loginForm.email.trim().toLowerCase() === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      setIsAuthenticated(true)
      setLoginError('')
      flash('Sesión iniciada.')
      return
    }

    setLoginError('Correo o contraseña incorrectos.')
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setLoginForm({ email: '', password: '' })
    setShowPassword(false)
    setActiveSection('overview')
  }

  function updateCollection(collection, id, patch) {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }))
  }

  function removeFromCollection(collection, id) {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].filter((item) => item.id !== id),
    }))
    flash('Elemento eliminado.')
  }

  function addCategory() {
    const baseName = `Nueva categoría ${content.categories.length + 1}`
    setContent((current) => ({
      ...current,
      categories: [
        ...current.categories,
        { id: createSlug(baseName), name: baseName, description: 'Descripción de la categoría.', image: '', icon: 'shelf' },
      ],
    }))
    setActiveSection('categories')
    flash('Categoría creada.')
  }

  function goToProducts() {
    setActiveSection('products')
  }

  function updateNewProduct(patch) {
    setNewProduct((current) => ({ ...current, ...patch }))
  }

  function updateNewProductPrice(value) {
    updateNewProduct({ price: formatCop(value) })
  }

  function updateProductPrice(product, value) {
    updateCollection('products', product.id, { price: formatCop(value) })
  }

  function updatePageContent(section, patch) {
    setContent((current) => ({
      ...current,
      pageContent: {
        ...current.pageContent,
        [section]: {
          ...current.pageContent[section],
          ...patch,
        },
      },
    }))
  }

  function handleNewProductCategory(categoryId) {
    const category = content.categories.find((item) => item.id === categoryId)
    updateNewProduct({ categoryId, category: category?.name || '' })
  }

  async function handleNewProductImage(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updateNewProduct({ image })
  }

  function addProduct(event) {
    event?.preventDefault()
    const productName = newProduct.name.trim()

    if (!productName) {
      flash('Escribe el nombre del producto.')
      return
    }

    if (!newProduct.categoryId) {
      flash('Selecciona una categoría.')
      return
    }

    if (!onlyDigits(newProduct.price)) {
      flash('Escribe un precio válido.')
      return
    }

    const id = createSlug(newProduct.id || productName)
    const category = content.categories.find((item) => item.id === newProduct.categoryId)

    setContent((current) => ({
      ...current,
      products: [
        ...current.products,
        {
          ...newProduct,
          id,
          categoryId: newProduct.categoryId || category?.id || '',
          category: category?.name || newProduct.category,
          name: productName,
          price: formatCop(newProduct.price),
          size: newProduct.size || 'A medida',
        },
      ],
    }))
    setNewProduct(getEmptyProduct(content.categories[0]))
    flash('Producto guardado.')
  }

  function addBlogPost() {
    const baseTitle = `Nuevo artículo ${content.blogPosts.length + 1}`
    setContent((current) => ({
      ...current,
      blogPosts: [
        ...current.blogPosts,
        {
          id: createSlug(baseTitle),
          tag: 'TENDENCIAS',
          date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
          title: baseTitle,
          desc: 'Resumen del artículo.',
          image: '',
          body: '',
        },
      ],
    }))
    setActiveSection('blog')
    flash('Artículo creado.')
  }

  function addHeroSlide() {
    setContent((current) => ({
      ...current,
      heroSlides: [
        ...current.heroSlides,
        getEmptyHeroSlide(current.heroSlides.length + 1),
      ],
    }))
    setActiveSection('hero')
    flash('Foto de inicio creada.')
  }

  async function handleImageUpload(collection, id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updateCollection(collection, id, { image })
    flash('Imagen cargada.')
  }

  async function handleHeroImageUpload(id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updateCollection('heroSlides', id, { image })
    flash('Foto de inicio cargada.')
  }

  async function handlePageImageUpload(section, field, event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updatePageContent(section, { [field]: image })
    flash('Imagen de página cargada.')
  }

  function addProject() {
    const title = `Nuevo proyecto ${content.projects.length + 1}`
    setContent((current) => ({
      ...current,
      projects: [
        ...current.projects,
        { id: createSlug(title), cat: 'hogar', label: 'Hogar', title, location: 'Ciudad, Colombia', image: '' },
      ],
    }))
    flash('Proyecto creado.')
  }

  async function handleProjectImageUpload(id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updateCollection('projects', id, { image })
    flash('Imagen de proyecto cargada.')
  }

  function handleCategoryIdChange(category, id) {
    const nextId = createSlug(id)
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item) => (
        item.id === category.id ? { ...item, id: nextId } : item
      )),
      products: current.products.map((product) => (
        product.categoryId === category.id ? { ...product, categoryId: nextId } : product
      )),
    }))
  }

  function handleProductCategory(product, categoryId) {
    const category = content.categories.find((item) => item.id === categoryId)
    updateCollection('products', product.id, { categoryId, category: category?.name || product.category })
  }

  function resetContent() {
    setContent(defaultSiteContent)
    flash('Contenido restaurado al estado inicial.')
  }

  function openSection(sectionId) {
    if (sectionId === 'bulk') {
      setCsvPreview(toCsv(content[bulkType], csvConfig[bulkType].headers))
    }
    setActiveSection(sectionId)
  }

  function exportCurrentCsv() {
    const config = csvConfig[bulkType]
    downloadCsv(config.filename, toCsv(content[bulkType], config.headers))
  }

  function loadSampleCsv() {
    const config = csvConfig[bulkType]
    setCsvPreview(toCsv(content[bulkType].slice(0, 3), config.headers))
    flash('Plantilla cargada.')
  }

  function importCsvText(text = csvPreview) {
    try {
      const rows = parseCsv(text).map((row) => ({
        ...row,
        id: createSlug(row.id || row.name || row.title || crypto.randomUUID()),
        image: normalizeImagePath(row.image),
        featured: bulkType === 'products' ? ['true', '1', 'si', 'sí', 'yes'].includes(String(row.featured).toLowerCase()) : row.featured,
      }))

      setContent((current) => ({
        ...current,
        [bulkType]: rows,
      }))
      flash(`${csvConfig[bulkType].label} importado desde CSV.`)
    } catch {
      flash('No se pudo leer el CSV.')
    }
  }

  async function handleCsvFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setCsvPreview(text)
    importCsvText(text)
  }

  function renderOverview() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Panel FORMAS</p>
            <h1>Administrador de contenido</h1>
            <p>Actualiza productos, categorías, blog e imágenes desde un solo lugar.</p>
          </div>
          <button className="button button--primary" onClick={goToProducts}><BadgePlus size={16} /> Nuevo producto</button>
        </div>

        <div className="admin-stats">
          {stats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>

        <div className="admin-quick-actions">
          <button onClick={goToProducts}><Package size={20} /> Crear producto</button>
          <button onClick={addHeroSlide}><Images size={20} /> Foto de inicio</button>
          <button onClick={addBlogPost}><Newspaper size={20} /> Crear artículo</button>
          <button onClick={addCategory}><Tags size={20} /> Crear categoría</button>
          <button onClick={() => openSection('bulk')}><FileJson size={20} /> Importar masivo</button>
        </div>
      </div>
    )
  }

  function renderHero() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Inicio</p>
            <h1>Fotos y textos del inicio</h1>
            <p>Sube las imagenes principales del home y ajusta los textos que aparecen encima de cada foto.</p>
          </div>
          <button className="button button--primary" onClick={addHeroSlide}><BadgePlus size={16} /> Agregar foto</button>
        </div>

        <div className="admin-editor-list">
          {content.heroSlides.map((slide, index) => (
            <article className="admin-editor-card admin-editor-card--hero" key={slide.id}>
              <div className="admin-image-box admin-image-box--hero">
                {slide.image ? <img src={slide.image} alt={slide.title || 'Foto de inicio'} /> : <Images size={30} />}
                <label>
                  Cargar foto
                  <input type="file" accept="image/*" onChange={(event) => handleHeroImageUpload(slide.id, event)} />
                </label>
              </div>

              <div className="admin-form-grid admin-form-grid--wide">
                <label>ID<input value={slide.id} onChange={(event) => updateCollection('heroSlides', slide.id, { id: createSlug(event.target.value) })} /></label>
                <label>Texto pequeno<input value={slide.eyebrow || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { eyebrow: event.target.value })} placeholder="Opcional" /></label>
                <label>Linea principal<input value={slide.titleAccent || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { titleAccent: event.target.value })} /></label>
                <label>Linea secundaria<input value={slide.title || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { title: event.target.value })} /></label>
                <label className="admin-colspan">Descripcion<textarea value={slide.description || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { description: event.target.value })} /></label>
                <label>Boton principal<input value={slide.primaryLabel || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { primaryLabel: event.target.value })} /></label>
                <label>Link principal<input value={slide.primaryLink || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { primaryLink: event.target.value })} /></label>
                <label>Boton secundario<input value={slide.secondaryLabel || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { secondaryLabel: event.target.value })} /></label>
                <label>Link secundario<input value={slide.secondaryLink || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { secondaryLink: event.target.value })} /></label>
                <label className="admin-check"><input type="checkbox" checked={slide.active !== false} onChange={(event) => updateCollection('heroSlides', slide.id, { active: event.target.checked })} /> Visible en inicio</label>
              </div>

              <button
                className="admin-delete"
                disabled={content.heroSlides.length === 1}
                onClick={() => removeFromCollection('heroSlides', slide.id)}
                title={content.heroSlides.length === 1 ? 'Debe quedar al menos una foto' : 'Eliminar foto'}
              >
                <Trash2 size={16} /> Eliminar
              </button>
              <span className="admin-hero-order">Foto {index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderPages() {
    const page = content.pageContent[pageKey]
    const selectedPage = pageOptions.find((item) => item.id === pageKey)
    const isHeroPage = pageKey !== 'homeProducts'

    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Páginas</p>
            <h1>Editar contenido de páginas</h1>
            <p>Cambia textos e imágenes principales de Proyectos, Nosotros, Blog, Contacto y las secciones de productos del inicio.</p>
          </div>
          <div className="admin-header-actions">
            <label className="admin-page-select">
              Página
              <select value={pageKey} onChange={(event) => setPageKey(event.target.value)}>
                {pageOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {isHeroPage && (
          <article className="admin-editor-card admin-editor-card--hero">
            <div className="admin-image-box admin-image-box--hero">
              {page.image ? <img src={page.image} alt={selectedPage.label} /> : <Images size={30} />}
              <label>
                Cargar foto hero
                <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload(pageKey, 'image', event)} />
              </label>
            </div>

            <div className="admin-form-grid admin-form-grid--wide">
              <label>Breadcrumb<input value={page.breadcrumb || ''} onChange={(event) => updatePageContent(pageKey, { breadcrumb: event.target.value })} /></label>
              <label>Texto pequeño<input value={page.eyebrow || ''} onChange={(event) => updatePageContent(pageKey, { eyebrow: event.target.value })} placeholder="Opcional" /></label>
              <label className="admin-colspan">Título<textarea value={page.title || ''} onChange={(event) => updatePageContent(pageKey, { title: event.target.value })} /></label>
              <label className="admin-colspan">Descripción<textarea value={page.description || ''} onChange={(event) => updatePageContent(pageKey, { description: event.target.value })} /></label>
            </div>
          </article>
        )}

        {pageKey === 'homeProducts' && (
          <article className="admin-create-card">
            <div className="admin-create-card__header">
              <div>
                <p className="admin-kicker">Inicio / Productos</p>
                <h2>Textos de productos en el inicio</h2>
                <p>Estos textos aparecen encima de las líneas de producto y de los productos destacados.</p>
              </div>
            </div>
            <div className="admin-form-grid admin-form-grid--wide">
              <label>Etiqueta líneas<input value={page.categoriesEyebrow || ''} onChange={(event) => updatePageContent('homeProducts', { categoriesEyebrow: event.target.value })} /></label>
              <label>Título líneas<input value={page.categoriesTitle || ''} onChange={(event) => updatePageContent('homeProducts', { categoriesTitle: event.target.value })} /></label>
              <label className="admin-colspan">Descripción líneas<textarea value={page.categoriesDescription || ''} onChange={(event) => updatePageContent('homeProducts', { categoriesDescription: event.target.value })} /></label>
              <label>Etiqueta destacados<input value={page.featuredEyebrow || ''} onChange={(event) => updatePageContent('homeProducts', { featuredEyebrow: event.target.value })} /></label>
              <label>Título destacados<input value={page.featuredTitle || ''} onChange={(event) => updatePageContent('homeProducts', { featuredTitle: event.target.value })} /></label>
              <label className="admin-colspan">Descripción destacados<textarea value={page.featuredDescription || ''} onChange={(event) => updatePageContent('homeProducts', { featuredDescription: event.target.value })} /></label>
            </div>
          </article>
        )}

        {pageKey === 'proyectos' && (
          <div className="admin-editor-list">
            <div className="admin-list-heading">
              <h2>Proyectos publicados</h2>
              <button className="button button--primary" onClick={addProject}><BadgePlus size={16} /> Agregar proyecto</button>
            </div>
            <div className="admin-form-grid admin-form-grid--wide admin-create-card">
              <label>Texto botón<input value={page.ctaLabel || ''} onChange={(event) => updatePageContent('proyectos', { ctaLabel: event.target.value })} /></label>
              <label>Link botón<input value={page.ctaLink || ''} onChange={(event) => updatePageContent('proyectos', { ctaLink: event.target.value })} /></label>
            </div>
            {content.projects.map((project) => (
              <article className="admin-editor-card" key={project.id}>
                <div className="admin-image-box">
                  {project.image ? <img src={project.image} alt={project.title} /> : <Images size={26} />}
                  <label>
                    Cargar imagen
                    <input type="file" accept="image/*" onChange={(event) => handleProjectImageUpload(project.id, event)} />
                  </label>
                </div>
                <div className="admin-form-grid">
                  <label>ID<input value={project.id} onChange={(event) => updateCollection('projects', project.id, { id: createSlug(event.target.value) })} /></label>
                  <label>Categoría filtro<input value={project.cat} onChange={(event) => updateCollection('projects', project.id, { cat: createSlug(event.target.value) })} /></label>
                  <label>Etiqueta<input value={project.label} onChange={(event) => updateCollection('projects', project.id, { label: event.target.value })} /></label>
                  <label>Título<input value={project.title} onChange={(event) => updateCollection('projects', project.id, { title: event.target.value })} /></label>
                  <label>Ubicación<input value={project.location} onChange={(event) => updateCollection('projects', project.id, { location: event.target.value })} /></label>
                </div>
                <button className="admin-delete" onClick={() => removeFromCollection('projects', project.id)}><Trash2 size={16} /> Eliminar</button>
              </article>
            ))}
          </div>
        )}

        {pageKey === 'nosotros' && (
          <div className="admin-editor-list">
            <article className="admin-editor-card admin-editor-card--hero">
              <div className="admin-image-box admin-image-box--hero">
                {page.historyImage ? <img src={page.historyImage} alt={page.historyTitle} /> : <Images size={30} />}
                <label>
                  Foto historia
                  <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('nosotros', 'historyImage', event)} />
                </label>
              </div>
              <div className="admin-form-grid admin-form-grid--wide">
                <label className="admin-colspan">Título historia<input value={page.historyTitle || ''} onChange={(event) => updatePageContent('nosotros', { historyTitle: event.target.value })} /></label>
                <label className="admin-colspan">Texto historia<textarea value={page.historyText || ''} onChange={(event) => updatePageContent('nosotros', { historyText: event.target.value })} /></label>
              </div>
            </article>

            <article className="admin-editor-card admin-editor-card--hero">
              <div className="admin-image-box admin-image-box--hero">
                {page.locationImage ? <img src={page.locationImage} alt="Sede" /> : <Images size={30} />}
                <label>
                  Foto sede
                  <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('nosotros', 'locationImage', event)} />
                </label>
              </div>
              <div className="admin-form-grid admin-form-grid--wide">
                <label className="admin-colspan">Esta foto aparece en la sección Nuestra sede<input value="Imagen editable desde este bloque" readOnly /></label>
              </div>
            </article>
          </div>
        )}

        {pageKey === 'blog' && (
          <article className="admin-create-card">
            <div className="admin-form-grid admin-form-grid--wide">
              <label>Título lateral<input value={page.sidebarTitle || ''} onChange={(event) => updatePageContent('blog', { sidebarTitle: event.target.value })} /></label>
              <label>Título CTA<input value={page.ctaTitle || ''} onChange={(event) => updatePageContent('blog', { ctaTitle: event.target.value })} /></label>
              <label className="admin-colspan">Texto CTA<textarea value={page.ctaText || ''} onChange={(event) => updatePageContent('blog', { ctaText: event.target.value })} /></label>
            </div>
          </article>
        )}

        {pageKey === 'contacto' && (
          <div className="admin-editor-list">
            <article className="admin-create-card">
              <div className="admin-form-grid admin-form-grid--wide">
                <label>Título formulario<input value={page.formTitle || ''} onChange={(event) => updatePageContent('contacto', { formTitle: event.target.value })} /></label>
                <label>Subtítulo formulario<input value={page.formSubtitle || ''} onChange={(event) => updatePageContent('contacto', { formSubtitle: event.target.value })} /></label>
                <label>Dirección título<input value={page.addressTitle || ''} onChange={(event) => updatePageContent('contacto', { addressTitle: event.target.value })} /></label>
                <label>Dirección<textarea value={page.address || ''} onChange={(event) => updatePageContent('contacto', { address: event.target.value })} /></label>
                <label>Teléfono título<input value={page.phoneTitle || ''} onChange={(event) => updatePageContent('contacto', { phoneTitle: event.target.value })} /></label>
                <label>Teléfono<textarea value={page.phone || ''} onChange={(event) => updatePageContent('contacto', { phone: event.target.value })} /></label>
                <label>Email título<input value={page.emailTitle || ''} onChange={(event) => updatePageContent('contacto', { emailTitle: event.target.value })} /></label>
                <label>Email<input value={page.email || ''} onChange={(event) => updatePageContent('contacto', { email: event.target.value })} /></label>
                <label>Horario título<input value={page.hoursTitle || ''} onChange={(event) => updatePageContent('contacto', { hoursTitle: event.target.value })} /></label>
                <label>Horario<textarea value={page.hours || ''} onChange={(event) => updatePageContent('contacto', { hours: event.target.value })} /></label>
              </div>
            </article>

            <article className="admin-editor-card admin-editor-card--hero">
              <div className="admin-image-box admin-image-box--hero">
                {page.mapImage ? <img src={page.mapImage} alt={page.visitTitle} /> : <Images size={30} />}
                <label>
                  Foto/mapa
                  <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('contacto', 'mapImage', event)} />
                </label>
              </div>
              <div className="admin-form-grid admin-form-grid--wide">
                <label>Título visita<input value={page.visitTitle || ''} onChange={(event) => updatePageContent('contacto', { visitTitle: event.target.value })} /></label>
                <label>WhatsApp<input value={page.whatsappLink || ''} onChange={(event) => updatePageContent('contacto', { whatsappLink: event.target.value })} /></label>
                <label className="admin-colspan">Texto visita<textarea value={page.visitText || ''} onChange={(event) => updatePageContent('contacto', { visitText: event.target.value })} /></label>
              </div>
            </article>
          </div>
        )}
      </div>
    )
  }

  function renderProducts() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Productos</p>
            <h1>Crear, actualizar y eliminar productos</h1>
          </div>
          <button className="button button--primary" onClick={() => document.getElementById('admin-new-product-name')?.focus()}><BadgePlus size={16} /> Nuevo producto</button>
        </div>

        <form className="admin-create-card" onSubmit={addProduct}>
          <div className="admin-create-card__header">
            <div>
              <p className="admin-kicker">Nuevo producto</p>
              <h2>Guardar producto individual</h2>
              <p>Completa un producto y presiona guardar. La lista inferior queda solo para edición.</p>
            </div>
            <button type="submit" className="button button--primary"><Save size={16} /> Guardar producto</button>
          </div>

          <div className="admin-editor-card admin-editor-card--create">
            <div className="admin-image-box">
              {newProduct.image ? <img src={newProduct.image} alt={newProduct.name || 'Producto nuevo'} /> : <Images size={26} />}
              <label>
                Cargar imagen
                <input type="file" accept="image/*" onChange={handleNewProductImage} />
              </label>
            </div>

            <div className="admin-form-grid">
              <label>ID<input value={newProduct.id} onChange={(event) => updateNewProduct({ id: createSlug(event.target.value) })} placeholder="Se genera desde el nombre" /></label>
              <label>Nombre<input id="admin-new-product-name" value={newProduct.name} onChange={(event) => updateNewProduct({ name: event.target.value })} placeholder="Ej: Cocina moderna" required /></label>
              <label>Categoría
                <select value={newProduct.categoryId} onChange={(event) => handleNewProductCategory(event.target.value)}>
                  {content.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label>Precio<input inputMode="numeric" value={newProduct.price} onChange={(event) => updateNewProductPrice(event.target.value)} placeholder="$0" required /></label>
              <label>Medidas<input value={newProduct.size} onChange={(event) => updateNewProduct({ size: event.target.value })} placeholder="A medida" /></label>
              <label>Material<input value={newProduct.material} onChange={(event) => updateNewProduct({ material: event.target.value })} placeholder="Ej: MDF RH" /></label>
              <label>Color/acabado<input value={newProduct.color} onChange={(event) => updateNewProduct({ color: event.target.value })} placeholder="Ej: Nogal y blanco" /></label>
              <label>Entrega<input value={newProduct.leadTime} onChange={(event) => updateNewProduct({ leadTime: event.target.value })} placeholder="Ej: 20 a 30 días" /></label>
              <label className="admin-colspan">Descripción para la ficha<textarea value={newProduct.description} onChange={(event) => updateNewProduct({ description: event.target.value })} placeholder="Describe el producto, su uso y lo que lo hace especial." /></label>
              <label className="admin-check"><input type="checkbox" checked={newProduct.featured} onChange={(event) => updateNewProduct({ featured: event.target.checked })} /> Destacado</label>
            </div>
          </div>

          <div className="admin-field-rules">
            <span>Nombre: obligatorio.</span>
            <span>Precio: solo números, se guarda como pesos colombianos.</span>
            <span>Categoría: define dónde se verá el producto.</span>
            <span>Medidas: texto corto, ejemplo 200 x 40 x 180 cm o A medida.</span>
          </div>
        </form>

        <div className="admin-help-grid">
          <div className="admin-help-card">
            <Images size={20} />
            <div>
              <strong>Foto del producto</strong>
              <p>La imagen que cargues aquí aparece en la tarjeta del producto, en “Destacados de la semana” y en la ficha individual.</p>
            </div>
          </div>
          <div className="admin-help-card">
            <BadgePlus size={20} />
            <div>
              <strong>Producto destacado</strong>
              <p>Marca la casilla “Destacado” para que ese producto salga en la sección principal del inicio.</p>
            </div>
          </div>
        </div>

        <div className="admin-list-heading">
          <h2>Productos cargados</h2>
          <span>{content.products.length} productos</span>
        </div>

        <div className="admin-editor-list">
          {content.products.map((product) => (
            <article className="admin-editor-card" key={product.id}>
              <div className="admin-image-box">
                {product.image ? <img src={product.image} alt={product.name} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('products', product.id, event)} />
                </label>
              </div>

              <div className="admin-form-grid">
                <label>ID<input value={product.id} onChange={(event) => updateCollection('products', product.id, { id: createSlug(event.target.value) })} /></label>
                <label>Nombre<input value={product.name} onChange={(event) => updateCollection('products', product.id, { name: event.target.value })} /></label>
                <label>Categoría
                  <select value={product.categoryId} onChange={(event) => handleProductCategory(product, event.target.value)}>
                    {content.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label>Precio<input inputMode="numeric" value={product.price} onChange={(event) => updateProductPrice(product, event.target.value)} /></label>
                <label>Medidas<input value={product.size} onChange={(event) => updateCollection('products', product.id, { size: event.target.value })} /></label>
                <label>Material<input value={product.material || ''} onChange={(event) => updateCollection('products', product.id, { material: event.target.value })} /></label>
                <label>Color/acabado<input value={product.color || ''} onChange={(event) => updateCollection('products', product.id, { color: event.target.value })} /></label>
                <label>Entrega<input value={product.leadTime || ''} onChange={(event) => updateCollection('products', product.id, { leadTime: event.target.value })} /></label>
                <label className="admin-colspan">Descripción para la ficha<textarea value={product.description || ''} onChange={(event) => updateCollection('products', product.id, { description: event.target.value })} /></label>
                <label className="admin-check"><input type="checkbox" checked={product.featured} onChange={(event) => updateCollection('products', product.id, { featured: event.target.checked })} /> Destacado</label>
              </div>

              <button className="admin-delete" onClick={() => removeFromCollection('products', product.id)}><Trash2 size={16} /> Eliminar</button>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderBlog() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Blog</p>
            <h1>Administrar artículos</h1>
          </div>
          <button className="button button--primary" onClick={addBlogPost}><BadgePlus size={16} /> Nuevo artículo</button>
        </div>

        <div className="admin-editor-list">
          {content.blogPosts.map((post) => (
            <article className="admin-editor-card" key={post.id}>
              <div className="admin-image-box">
                {post.image ? <img src={post.image} alt={post.title} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('blogPosts', post.id, event)} />
                </label>
              </div>

              <div className="admin-form-grid admin-form-grid--wide">
                <label>ID<input value={post.id} onChange={(event) => updateCollection('blogPosts', post.id, { id: createSlug(event.target.value) })} /></label>
                <label>Etiqueta<input value={post.tag} onChange={(event) => updateCollection('blogPosts', post.id, { tag: event.target.value })} /></label>
                <label>Fecha<input value={post.date} onChange={(event) => updateCollection('blogPosts', post.id, { date: event.target.value })} /></label>
                <label>Título<input value={post.title} onChange={(event) => updateCollection('blogPosts', post.id, { title: event.target.value })} /></label>
                <label className="admin-colspan">Descripción<textarea value={post.desc} onChange={(event) => updateCollection('blogPosts', post.id, { desc: event.target.value })} /></label>
                <label className="admin-colspan">Contenido largo<textarea value={post.body} onChange={(event) => updateCollection('blogPosts', post.id, { body: event.target.value })} /></label>
              </div>

              <button className="admin-delete" onClick={() => removeFromCollection('blogPosts', post.id)}><Trash2 size={16} /> Eliminar</button>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderCategories() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Categorías</p>
            <h1>Editar líneas de producto</h1>
            <p>Estas imágenes son las fotos grandes de cada línea: se ven en el inicio, en el menú de productos y en el hero de la categoría.</p>
          </div>
          <button className="button button--primary" onClick={addCategory}><BadgePlus size={16} /> Nueva categoría</button>
        </div>

        <div className="admin-help-grid">
          <div className="admin-help-card">
            <Images size={20} />
            <div>
              <strong>Imagen de categoría</strong>
              <p>Úsala para Centros de entretenimiento, Closets, Cocinas y las demás líneas. No es la foto de un producto específico.</p>
            </div>
          </div>
          <div className="admin-help-card">
            <Tags size={20} />
            <div>
              <strong>Nombre y descripción</strong>
              <p>El nombre aparece en el menú Productos; la descripción aparece en el hero de la página de esa categoría.</p>
            </div>
          </div>
        </div>

        <div className="admin-editor-list">
          {content.categories.map((category) => (
            <article className="admin-editor-card" key={category.id}>
              <div className="admin-image-box">
                {category.image ? <img src={category.image} alt={category.name} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('categories', category.id, event)} />
                </label>
              </div>

              <div className="admin-form-grid">
                <label>ID<input value={category.id} onChange={(event) => handleCategoryIdChange(category, event.target.value)} /></label>
                <label>Nombre<input value={category.name} onChange={(event) => updateCollection('categories', category.id, { name: event.target.value })} /></label>
                <label>Icono
                  <select value={category.icon} onChange={(event) => updateCollection('categories', category.id, { icon: event.target.value })}>
                    {iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="admin-colspan">Descripción<textarea value={category.description} onChange={(event) => updateCollection('categories', category.id, { description: event.target.value })} /></label>
              </div>

              <button className="admin-delete" onClick={() => removeFromCollection('categories', category.id)}><Trash2 size={16} /> Eliminar</button>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderBulk() {
    const config = csvConfig[bulkType]

    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Carga masiva</p>
            <h1>Importar desde Excel o CSV</h1>
            <p>Exporta una plantilla, edítala en Excel y vuelve a cargarla como CSV. Para imágenes usa nombres como <strong>cocina.jpg</strong> y guarda los archivos en <strong>public/images</strong>.</p>
          </div>
          <div className="admin-header-actions">
            <button className="button button--soft" onClick={resetContent}>Restaurar demo</button>
            <button className="button button--primary" onClick={() => importCsvText()}><Save size={16} /> Guardar CSV</button>
          </div>
        </div>

        <div className="admin-csv-tools">
          <label>
            Tipo de contenido
            <select value={bulkType} onChange={(event) => {
              setBulkType(event.target.value)
              setCsvPreview(toCsv(content[event.target.value], csvConfig[event.target.value].headers))
            }}>
              {Object.entries(csvConfig).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
            </select>
          </label>
          <button onClick={loadSampleCsv}><FileJson size={16} /> Ver plantilla</button>
          <button onClick={exportCurrentCsv}><Download size={16} /> Exportar CSV</button>
          <label className="admin-upload-csv">
            <Upload size={16} /> Cargar CSV
            <input type="file" accept=".csv,text/csv" onChange={handleCsvFile} />
          </label>
        </div>

        <div className="admin-csv-schema">
          <strong>Columnas requeridas para {config.label}:</strong>
          <code>{config.headers.join(', ')}</code>
        </div>

        <textarea className="admin-json-editor" value={csvPreview} onChange={(event) => setCsvPreview(event.target.value)} spellCheck="false" />
      </div>
    )
  }

  const renderers = {
    overview: renderOverview,
    hero: renderHero,
    pages: renderPages,
    products: renderProducts,
    blog: renderBlog,
    categories: renderCategories,
    bulk: renderBulk,
  }

  if (!isAuthenticated) {
    return (
      <main className="page">
        <section className="cuenta-section cuenta-section--admin">
          <div className="cuenta-shell cuenta-shell--admin">
            <aside className="cuenta-panel cuenta-panel--admin">
              <p className="cuenta-panel__eyebrow">ADMIN FORMAS</p>
              <h2>Acceso privado al gestor de contenido.</h2>
              <p>
                Inicia sesión para crear productos, administrar artículos, subir imágenes y hacer cargas masivas.
              </p>
              <div className="cuenta-panel__list">
                <span><Package size={18} /> Productos y categorías</span>
                <span><Newspaper size={18} /> Blog y contenido</span>
                <span><FileJson size={18} /> Importación CSV</span>
              </div>
            </aside>

            <div className="cuenta-card cuenta-card--admin">
              <div className="cuenta-icon cuenta-icon--admin"><Lock size={30} /></div>
              <p className="cuenta-admin-label">Acceso administrativo</p>
              <h1>Iniciar sesión</h1>
              <p className="cuenta-sub">
                Usa las credenciales internas para entrar al panel de administración.
              </p>

              <form onSubmit={handleLogin} className="cuenta-form">
                <div className="cuenta-field">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="Correo administrativo"
                    autoComplete="username"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                </div>
                <div className="cuenta-field cuenta-field--password">
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {loginError && <p className="admin-login-error">{loginError}</p>}

                <button type="submit" className="button button--primary cuenta-submit">
                  Entrar al panel
                </button>
              </form>

              <p className="cuenta-security-note">
                Acceso temporal local. La autenticación segura se conectará al backend en Spring Boot.
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span>FORMAS</span>
          <small>Administrador</small>
        </div>
        <nav>
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => openSection(section.id)}
              >
                <Icon size={18} />
                {section.label}
              </button>
            )
          })}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <section className="admin-content">
        {notice && <div className="admin-notice">{notice}</div>}
        {renderers[activeSection]()}
      </section>
    </main>
  )
}

export default Cuenta
