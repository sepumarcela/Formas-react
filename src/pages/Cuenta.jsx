import { useMemo, useState } from 'react'
import {
  BadgePlus,
  Download,
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
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'bulk', label: 'Carga masiva', icon: FileJson },
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
    image: '',
    featured: false,
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
    headers: ['id', 'categoryId', 'category', 'name', 'price', 'size', 'image', 'featured'],
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
  const [activeSection, setActiveSection] = useState('overview')
  const [newProduct, setNewProduct] = useState(() => getEmptyProduct(content.categories[0]))
  const [bulkType, setBulkType] = useState('products')
  const [csvPreview, setCsvPreview] = useState('')
  const [notice, setNotice] = useState('')

  const stats = useMemo(() => ([
    { label: 'Productos', value: content.products.length },
    { label: 'Destacados', value: content.products.filter((product) => product.featured).length },
    { label: 'Categorías', value: content.categories.length },
    { label: 'Artículos', value: content.blogPosts.length },
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
          price: newProduct.price || 'Desde $0',
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

  async function handleImageUpload(collection, id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await readFileAsDataUrl(file)
    updateCollection(collection, id, { image })
    flash('Imagen cargada.')
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
          <button onClick={addBlogPost}><Newspaper size={20} /> Crear artículo</button>
          <button onClick={addCategory}><Tags size={20} /> Crear categoría</button>
          <button onClick={() => openSection('bulk')}><FileJson size={20} /> Importar masivo</button>
        </div>
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
              <label>Precio<input value={newProduct.price} onChange={(event) => updateNewProduct({ price: event.target.value })} placeholder="Desde $0" /></label>
              <label>Medidas<input value={newProduct.size} onChange={(event) => updateNewProduct({ size: event.target.value })} placeholder="A medida" /></label>
              <label className="admin-check"><input type="checkbox" checked={newProduct.featured} onChange={(event) => updateNewProduct({ featured: event.target.checked })} /> Destacado</label>
            </div>
          </div>
        </form>

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
                <label>Precio<input value={product.price} onChange={(event) => updateCollection('products', product.id, { price: event.target.value })} /></label>
                <label>Medidas<input value={product.size} onChange={(event) => updateCollection('products', product.id, { size: event.target.value })} /></label>
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
          </div>
          <button className="button button--primary" onClick={addCategory}><BadgePlus size={16} /> Nueva categoría</button>
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
                <div className="cuenta-field">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                </div>

                {loginError && <p className="admin-login-error">{loginError}</p>}

                <button type="submit" className="button button--primary cuenta-submit">
                  Entrar al panel
                </button>
              </form>

              <p className="cuenta-security-note">
                Credenciales temporales: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
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
