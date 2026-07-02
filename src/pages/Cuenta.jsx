import { useMemo, useState } from 'react'
import {
  BadgePlus,
  Download,
  Eye,
  EyeOff,
  FileJson,
  FileText,
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
import {
  deleteBlogPost,
  deleteCategory,
  deleteHeroSlide,
  deleteProduct,
  deleteProject,
  deleteProjectHighlight,
  deleteTestimonial,
  fetchCatalogContent,
  hasAdminToken,
  loginAdmin,
  logoutAdmin,
  saveBlogPost,
  saveCategory,
  saveHeroSlide,
  savePageContent,
  saveProduct,
  saveProject,
  saveProjectHighlight,
  saveTestimonial,
  uploadImage,
  uploadProductImagesZip,
  uploadProductTechnicalSheetsZip,
} from '../api/cmsApi'
import { createSlug } from '../data/siteContent'
import { useSiteContent } from '../hooks/useSiteContent'

const sections = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'hero', label: 'Inicio', icon: Images },
  { id: 'pages', label: 'Páginas', icon: LayoutDashboard },
  { id: 'stories', label: 'Historias', icon: Images },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'bulk', label: 'Carga masiva', icon: FileJson },
]

const pageOptions = [
  { id: 'homeProducts', label: 'Productos en inicio' },
  { id: 'productos', label: 'Productos' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'blog', label: 'Blog' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'footerPolicies', label: 'Políticas del footer' },
]

const ADMIN_SESSION_KEY = 'formas-admin-authenticated'

function getEmptyProduct(category) {
  return {
    id: '',
    categoryId: category?.id || '',
    category: category?.name || '',
    name: '',
    price: '',
    netPrice: '',
    size: '',
    description: '',
    material: '',
    color: '',
    leadTime: '',
    discountPercent: '',
    discountLabel: '',
    discountStart: '',
    discountEnd: '',
    image: '',
    technicalSheet: '',
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

const projectCategoryOptions = [
  { id: 'hogar', label: 'Hogares' },
  { id: 'cocina', label: 'Cocinas' },
  { id: 'closet', label: 'Closets' },
  { id: 'bano', label: 'Baños' },
  { id: 'oficina', label: 'Oficinas' },
  { id: 'comercial', label: 'Comerciales' },
]

function parseCsvLine(line, delimiter = ',') {
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
    } else if (char === delimiter && !quoted) {
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
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim())

  const firstLine = lines[0] || ''
  const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ','
  const rows = lines.map((line) => parseCsvLine(line, delimiter))

  const headers = rows.shift()?.map((header) => header.trim()) || []
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, (row[index] || '').trim()])))
}

async function readCsvFile(file) {
  const buffer = await file.arrayBuffer()
  const utf8Text = new TextDecoder('utf-8').decode(buffer)
  if (!utf8Text.includes('\uFFFD')) return utf8Text

  return new TextDecoder('windows-1252').decode(buffer)
}

function cleanNumber(value) {
  return String(value || '').replace(/[^\d]/g, '')
}

function cleanDate(value) {
  const text = String(value || '').trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : ''
}

async function saveRowsOneByOne(rows, saver) {
  const saved = []
  for (let index = 0; index < rows.length; index += 1) {
    try {
      saved.push(await saver(rows[index]))
    } catch (error) {
      throw new Error(`No se pudo guardar la fila ${index + 2} (${rows[index].id || rows[index].name || 'sin ID'}). ${error.message || ''}`, { cause: error })
    }
  }
  return saved
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
    headers: ['id', 'categoryId', 'category', 'name', 'price', 'netPrice', 'size', 'description', 'material', 'color', 'leadTime', 'discountPercent', 'discountLabel', 'discountStart', 'discountEnd', 'image', 'technicalSheet', 'featured'],
  },
  categories: {
    label: 'Categorías',
    filename: 'categorias-formas.csv',
    headers: ['id', 'name', 'description', 'image', 'icon'],
  },
  blogPosts: {
    label: 'Blog',
    filename: 'blog-formas.csv',
    headers: ['id', 'tag', 'date', 'title', 'desc', 'image', 'body', 'originalUrl', 'trending', 'active'],
  },
}

const imageFolders = {
  products: 'productos',
  categories: 'categorias',
  heroSlides: 'inicio',
  blogPosts: 'blog',
  projects: 'proyectos',
  projectHighlights: 'proyectos',
  testimonials: 'testimonios',
  pages: 'paginas',
}

function Cuenta() {
  const [content, setContent] = useSiteContent()
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' && hasAdminToken())
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

  async function handleLogin(event) {
    event.preventDefault()

    try {
      await loginAdmin(loginForm.email.trim().toLowerCase(), loginForm.password)
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      setIsAuthenticated(true)
      setLoginError('')
      flash('Sesión iniciada.')
    } catch (error) {
      setLoginError(error?.message || 'No se pudo iniciar sesión con el backend. Verifica que Spring Boot esté encendido.')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    logoutAdmin()
    setIsAuthenticated(false)
    setLoginForm({ email: '', password: '' })
    setShowPassword(false)
    setActiveSection('overview')
  }

  function requireBackendSession() {
    if (hasAdminToken()) return true

    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setLoginError('Inicia sesión otra vez para guardar cambios.')
    flash('Inicia sesión otra vez para guardar cambios.')
    return false
  }

  function reportBackendError(defaultMessage, error) {
    if (!hasAdminToken()) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
      setIsAuthenticated(false)
      setLoginError('Inicia sesión otra vez para guardar cambios.')
    }

    flash(error?.message || defaultMessage)
  }

  function updateCollection(collection, id, patch) {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }))
  }

  async function persistImagePatch(collection, id, patch) {
    const item = content[collection]?.find((entry) => entry.id === id)
    if (!item) return

    const nextItem = { ...item, ...patch }
    const displayOrder = content[collection]?.findIndex((entry) => entry.id === id) || 0

    updateCollection(collection, id, patch)

    try {
      let saved
      if (collection === 'products') saved = await saveProduct(nextItem)
      if (collection === 'categories') saved = await saveCategory(nextItem)
      if (collection === 'heroSlides') saved = await saveHeroSlide(nextItem, displayOrder)
      if (collection === 'blogPosts') saved = await saveBlogPost(nextItem)
      if (collection === 'projects') saved = await saveProject(nextItem, displayOrder)
      if (collection === 'projectHighlights') saved = await saveProjectHighlight(nextItem, displayOrder)
      if (collection === 'testimonials') saved = await saveTestimonial(nextItem)

      if (saved) {
        updateCollection(collection, id, saved)
        flash('Imagen subida y guardada.')
      }
    } catch (error) {
      reportBackendError('La imagen se subió, pero no se pudo guardar la información asociada.', error)
    }
  }

  async function removeFromCollection(collection, id) {
    const item = content[collection]?.find((entry) => entry.id === id)

    if (item?.persisted) {
      try {
        if (collection === 'products') await deleteProduct(id)
        if (collection === 'categories') await deleteCategory(id)
        if (collection === 'heroSlides') await deleteHeroSlide(id)
        if (collection === 'blogPosts') await deleteBlogPost(id)
        if (collection === 'projects') await deleteProject(id)
        if (collection === 'projectHighlights') await deleteProjectHighlight(id)
        if (collection === 'testimonials') await deleteTestimonial(id)
      } catch (error) {
        if (error?.status !== 404) {
          reportBackendError('No se pudo eliminar en el backend.', error)
          return
        }
      }
    }

    setContent((current) => ({
      ...current,
      [collection]: current[collection].filter((item) => item.id !== id),
    }))
    flash('Elemento eliminado.')
  }

  async function addCategory() {
    const baseName = `Nueva categoría ${content.categories.length + 1}`
    const category = { id: createSlug(baseName), name: baseName, description: 'Descripción de la categoría.', image: '', icon: 'shelf' }

    let savedCategory
    try {
      savedCategory = await saveCategory(category)
    } catch {
      flash('No se pudo guardar la categoría en el backend.')
      return
    }

    setContent((current) => ({
      ...current,
      categories: [...current.categories, savedCategory],
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
    updateNewProduct({ price: value })
  }

  function updateProductPrice(product, value) {
    updateCollection('products', product.id, { price: value })
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

  function updateWhyBenefitImage(benefitId, image) {
    const currentBenefits = content.pageContent.homeProducts?.whyBenefits || []
    const defaultBenefits = [
      { id: 'diseno-personalizado', image: '' },
      { id: 'fabricacion-calidad', image: '' },
      { id: 'instalacion-profesional', image: '' },
      { id: 'acompanamiento-completo', image: '' },
    ]
    const benefitsById = new Map([...defaultBenefits, ...currentBenefits].map((benefit) => [benefit.id, benefit]))
    const whyBenefits = defaultBenefits.map((benefit) => ({
      ...benefit,
      ...benefitsById.get(benefit.id),
      ...(benefit.id === benefitId ? { image } : {}),
    }))

    updatePageContent('homeProducts', { whyBenefits })
    return whyBenefits
  }

  function handleNewProductCategory(categoryId) {
    const category = content.categories.find((item) => item.id === categoryId)
    updateNewProduct({ categoryId, category: category?.name || '' })
  }

  async function handleNewProductImage(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders.products, file)
      updateNewProduct({ image })
      flash('Imagen subida.')
    } catch (error) {
      reportBackendError('No se pudo subir la imagen al backend.', error)
    }
  }

  async function addProduct(event) {
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

    if (!newProduct.price.trim()) {
      flash('Escribe el precio visible del producto.')
      return
    }

    const id = createSlug(newProduct.id || productName)
    const category = content.categories.find((item) => item.id === newProduct.categoryId)

    const product = {
      ...newProduct,
      id,
      categoryId: newProduct.categoryId || category?.id || '',
      category: category?.name || newProduct.category,
      name: productName,
      price: newProduct.price,
      netPrice: onlyDigits(newProduct.netPrice),
      size: newProduct.size || 'A medida',
    }

    let savedProduct
    try {
      savedProduct = await saveProduct(product)
    } catch {
      flash('No se pudo guardar el producto en el backend.')
      return
    }

    setContent((current) => ({
      ...current,
      products: [...current.products, savedProduct],
    }))
    setNewProduct(getEmptyProduct(content.categories[0]))
    flash('Producto guardado.')
  }

  async function saveExistingProduct(product) {
    try {
      const savedProduct = await saveProduct(product)
      updateCollection('products', product.id, savedProduct)
      flash('Cambios del producto guardados.')
    } catch {
      flash('No se pudo guardar el producto en el backend.')
    }
  }

  async function saveExistingCategory(category) {
    try {
      const savedCategory = await saveCategory(category)
      updateCollection('categories', category.id, savedCategory)
      flash('Cambios de la categoría guardados.')
    } catch {
      flash('No se pudo guardar la categoría en el backend.')
    }
  }

  async function saveExistingHeroSlide(slide, index) {
    if (!requireBackendSession()) return

    try {
      const savedSlide = await saveHeroSlide(slide, index)
      updateCollection('heroSlides', slide.id, savedSlide)
      flash('Foto de inicio guardada.')
    } catch (error) {
      reportBackendError('No se pudo guardar la foto de inicio en el backend.', error)
    }
  }

  async function saveExistingBlogPost(post) {
    try {
      const savedPost = await saveBlogPost(post)
      updateCollection('blogPosts', post.id, savedPost)
      flash('Artículo guardado.')
    } catch {
      flash('No se pudo guardar el artículo en el backend.')
    }
  }

  async function saveExistingProject(project, index) {
    try {
      const savedProject = await saveProject(project, index)
      updateCollection('projects', project.id, savedProject)
      flash('Proyecto guardado.')
    } catch {
      flash('No se pudo guardar el proyecto en el backend.')
    }
  }

  async function saveExistingProjectHighlight(project, index) {
    try {
      const savedProject = await saveProjectHighlight(project, index)
      updateCollection('projectHighlights', project.id, savedProject)
      flash('Proyecto realizado guardado.')
    } catch {
      flash('No se pudo guardar el proyecto realizado en el backend.')
    }
  }

  async function saveExistingTestimonial(testimonial) {
    try {
      const savedTestimonial = await saveTestimonial(testimonial)
      updateCollection('testimonials', testimonial.id, savedTestimonial)
      flash('Testimonio guardado.')
    } catch {
      flash('No se pudo guardar el testimonio en el backend.')
    }
  }

  async function saveCurrentPageContent() {
    try {
      const savedPage = await savePageContent(pageKey, content.pageContent[pageKey])
      setContent((current) => ({
        ...current,
        pageContent: {
          ...current.pageContent,
          [pageKey]: savedPage,
        },
      }))
      flash('Contenido de página guardado.')
    } catch {
      flash('No se pudo guardar la página en el backend.')
    }
  }

  function renderCardSave(label, onClick) {
    return (
      <button type="button" className="admin-image-save" onClick={onClick}>
        <Save size={14} /> {label}
      </button>
    )
  }

  async function addBlogPost() {
    const baseTitle = `Nuevo artículo ${content.blogPosts.length + 1}`
    try {
      const savedPost = await saveBlogPost({
        id: createSlug(baseTitle),
        tag: '',
        date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
        title: baseTitle,
        desc: 'Resumen del artículo.',
        image: '',
        body: '',
        originalUrl: '',
        trending: false,
        active: true,
      })
      setContent((current) => ({ ...current, blogPosts: [...current.blogPosts, savedPost] }))
      setActiveSection('blog')
      flash('Artículo creado.')
    } catch {
      flash('No se pudo crear el artículo en el backend.')
    }
  }

  async function addHeroSlide() {
    try {
      const savedSlide = await saveHeroSlide(getEmptyHeroSlide(content.heroSlides.length + 1), content.heroSlides.length)
      setContent((current) => ({ ...current, heroSlides: [...current.heroSlides, savedSlide] }))
      setActiveSection('hero')
      flash('Foto de inicio creada.')
    } catch {
      flash('No se pudo crear la foto de inicio en el backend.')
    }
  }

  async function handleImageUpload(collection, id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders[collection] || 'imagenes', file)
      await persistImagePatch(collection, id, { image })
    } catch (error) {
      reportBackendError('No se pudo subir la imagen al backend.', error)
    }
  }

  async function handleHeroImageUpload(id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders.heroSlides, file)
      await persistImagePatch('heroSlides', id, { image })
    } catch (error) {
      reportBackendError('No se pudo subir la foto de inicio al backend.', error)
    }
  }

  async function handlePageImageUpload(section, field, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders.pages, file)
      const nextPage = { ...content.pageContent[section], [field]: image }
      updatePageContent(section, { [field]: image })
      const savedPage = await savePageContent(section, nextPage)
      setContent((current) => ({
        ...current,
        pageContent: {
          ...current.pageContent,
          [section]: savedPage,
        },
      }))
      flash('Imagen de página subida y guardada.')
    } catch (error) {
      reportBackendError('No se pudo subir la imagen de página al backend.', error)
    }
  }

  async function addProject() {
    const title = `Nuevo proyecto ${content.projects.length + 1}`
    try {
      const savedProject = await saveProject(
        { id: createSlug(title), cat: 'hogar', label: 'Hogar', title, location: 'Ciudad, Colombia', image: '' },
        content.projects.length,
      )
      setContent((current) => ({ ...current, projects: [...current.projects, savedProject] }))
      flash('Proyecto creado.')
    } catch {
      flash('No se pudo crear el proyecto en el backend.')
    }
  }

  async function handleProjectImageUpload(id, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders.projects, file)
      await persistImagePatch('projects', id, { image })
    } catch (error) {
      reportBackendError('No se pudo subir la imagen del proyecto al backend.', error)
    }
  }

  async function addProjectHighlight() {
    const title = `Nuevo antes y después ${content.projectHighlights.length + 1}`
    try {
      const savedProject = await saveProjectHighlight(
        { id: createSlug(title), category: 'Cocinas', title, before: '', after: '' },
        content.projectHighlights.length,
      )
      setContent((current) => ({ ...current, projectHighlights: [...current.projectHighlights, savedProject] }))
      flash('Proyecto realizado creado.')
    } catch {
      flash('No se pudo crear el proyecto realizado en el backend.')
    }
  }

  async function addTestimonial() {
    const name = `Cliente ${content.testimonials.length + 1}`
    try {
      const savedTestimonial = await saveTestimonial({
        id: createSlug(name),
        name,
        location: 'Ciudad, Colombia',
        text: 'Escribe aquí el testimonio real del cliente.',
        image: '',
        approved: true,
      })
      setContent((current) => ({ ...current, testimonials: [...current.testimonials, savedTestimonial] }))
      flash('Testimonio creado.')
    } catch {
      flash('No se pudo crear el testimonio en el backend.')
    }
  }

  async function handleCollectionImageUpload(collection, id, field, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders[collection] || 'imagenes', file)
      await persistImagePatch(collection, id, { [field]: image })
    } catch (error) {
      reportBackendError('No se pudo subir la imagen al backend.', error)
    }
  }

  function handleProductCategory(product, categoryId) {
    const category = content.categories.find((item) => item.id === categoryId)
    updateCollection('products', product.id, { categoryId, category: category?.name || product.category })
  }

  function handleProjectCategory(project, categoryId) {
    const category = projectCategoryOptions.find((item) => item.id === categoryId) || projectCategoryOptions[0]
    updateCollection('projects', project.id, { cat: category.id, label: category.label })
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

  async function importCsvText(text = csvPreview) {
    try {
      const rows = parseCsv(text).map((row) => ({
        ...row,
        id: createSlug(row.id || row.name || row.title || crypto.randomUUID()),
        image: normalizeImagePath(row.image),
        technicalSheet: normalizeImagePath(row.technicalSheet || row.fichaTecnica || row.ficha_tecnica),
        netPrice: bulkType === 'products' ? cleanNumber(row.netPrice) : row.netPrice,
        discountPercent: bulkType === 'products' ? cleanNumber(row.discountPercent) : row.discountPercent,
        discountStart: bulkType === 'products' ? cleanDate(row.discountStart) : row.discountStart,
        discountEnd: bulkType === 'products' ? cleanDate(row.discountEnd) : row.discountEnd,
        featured: bulkType === 'products' ? ['true', '1', 'si', 'sí', 'yes'].includes(String(row.featured).toLowerCase()) : row.featured,
      }))

      let savedRows = rows
      if (bulkType === 'products') savedRows = await saveRowsOneByOne(rows, saveProduct)
      if (bulkType === 'categories') savedRows = await saveRowsOneByOne(rows, saveCategory)
      if (bulkType === 'blogPosts') savedRows = await saveRowsOneByOne(rows, saveBlogPost)

      setContent((current) => ({
        ...current,
        [bulkType]: savedRows,
      }))
      flash(`${csvConfig[bulkType].label} guardado desde CSV en el backend.`)
    } catch (error) {
      reportBackendError('No se pudo guardar el CSV en el backend.', error)
    }
  }

  async function handleWhyBenefitImageUpload(benefitId, event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const image = await uploadImage(imageFolders.pages, file)
      const whyBenefits = updateWhyBenefitImage(benefitId, image)
      const nextPage = { ...content.pageContent.homeProducts, whyBenefits }
      const savedPage = await savePageContent('homeProducts', nextPage)
      setContent((current) => ({
        ...current,
        pageContent: {
          ...current.pageContent,
          homeProducts: savedPage,
        },
      }))
      flash('Foto de Por qué Formas Interiores subida y guardada.')
    } catch (error) {
      reportBackendError('No se pudo subir la foto de Por qué Formas Interiores al backend.', error)
    }
  }

  async function handleCsvFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await readCsvFile(file)
    setCsvPreview(text)
    flash('CSV cargado. Revísalo y presiona Guardar CSV.')
  }

  async function handleProductImagesZip(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadProductImagesZip(file)
      const catalog = await fetchCatalogContent()
      setContent((current) => ({
        ...current,
        products: catalog.products.length ? catalog.products : current.products,
      }))
      const unmatched = result.unmatchedFiles?.length ? ` ${result.unmatchedFiles.length} imagen(es) no encontraron producto.` : ''
      flash(`${result.matched} imagen(es) asignadas a productos.${unmatched}`)
    } catch (error) {
      reportBackendError('No se pudo cargar el ZIP de imágenes.', error)
    } finally {
      event.target.value = ''
    }
  }

  async function handleProductTechnicalSheetsZip(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadProductTechnicalSheetsZip(file)
      const catalog = await fetchCatalogContent()
      setContent((current) => ({
        ...current,
        products: catalog.products.length ? catalog.products : current.products,
      }))
      const unmatched = result.unmatchedFiles?.length ? ` ${result.unmatchedFiles.length} ficha(s) no encontraron producto.` : ''
      flash(`${result.matched} ficha(s) técnica(s) asignadas a productos.${unmatched}`)
    } catch (error) {
      reportBackendError('No se pudo cargar el ZIP de fichas técnicas.', error)
    } finally {
      event.target.value = ''
    }
  }

  function renderOverview() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Panel Formas Interiores</p>
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
            <article className="admin-editor-card admin-editor-card--hero" key={`hero-slide-${index}`}>
              <div className="admin-image-box admin-image-box--hero">
                {slide.image ? <img src={slide.image} alt={slide.title || 'Foto de inicio'} /> : <Images size={30} />}
                <label>
                  Cargar foto
                  <input type="file" accept="image/*" onChange={(event) => handleHeroImageUpload(slide.id, event)} />
                </label>
                {renderCardSave('Guardar foto', () => saveExistingHeroSlide(slide, index))}
              </div>

              <div className="admin-form-grid admin-form-grid--wide">
                <label>ID<input value={slide.id} readOnly title="Este ID lo asigna el backend automaticamente." /></label>
                <label>Texto pequeño<input value={slide.eyebrow || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { eyebrow: event.target.value })} placeholder="Opcional" /></label>
                <label>Línea principal<input value={slide.titleAccent || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { titleAccent: event.target.value })} /></label>
                <label>Línea secundaria<input value={slide.title || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { title: event.target.value })} /></label>
                <label className="admin-colspan">Descripción<textarea value={slide.description || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { description: event.target.value })} /></label>
                <label>Botón principal<input value={slide.primaryLabel || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { primaryLabel: event.target.value })} /></label>
                <label>Link principal<input value={slide.primaryLink || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { primaryLink: event.target.value })} /></label>
                <label>Botón secundario<input value={slide.secondaryLabel || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { secondaryLabel: event.target.value })} /></label>
                <label>Link secundario<input value={slide.secondaryLink || ''} onChange={(event) => updateCollection('heroSlides', slide.id, { secondaryLink: event.target.value })} /></label>
                <label className="admin-check"><input type="checkbox" checked={slide.active !== false} onChange={(event) => updateCollection('heroSlides', slide.id, { active: event.target.checked })} /> Visible en inicio</label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingHeroSlide(slide, index)}><Save size={16} /> Guardar cambios</button>
                <button
                  className="admin-delete"
                  disabled={content.heroSlides.length === 1}
                  onClick={() => removeFromCollection('heroSlides', slide.id)}
                  title={content.heroSlides.length === 1 ? 'Debe quedar al menos una foto' : 'Eliminar foto'}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
              <span className="admin-hero-order">Foto {index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function updateFooterPolicy(index, patch) {
    const policies = [...(content.pageContent.footerPolicies?.policies || [])]
    policies[index] = { ...policies[index], ...patch }
    updatePageContent('footerPolicies', { policies })
  }

  function addFooterPolicy() {
    const policies = [...(content.pageContent.footerPolicies?.policies || [])]
    const nextNumber = policies.length + 1
    policies.push({
      id: `politica-${nextNumber}`,
      label: 'Nueva política',
      slug: `politica-${nextNumber}`,
      title: 'Nueva política',
      content: 'Escribe aquí el contenido de esta política.',
      active: true,
    })
    updatePageContent('footerPolicies', { policies })
  }

  function removeFooterPolicy(index) {
    const policies = [...(content.pageContent.footerPolicies?.policies || [])]
    policies.splice(index, 1)
    updatePageContent('footerPolicies', { policies })
  }
  function renderPages() {
    const page = content.pageContent[pageKey]
    const selectedPage = pageOptions.find((item) => item.id === pageKey)
    const isHeroPage = pageKey !== 'homeProducts' && pageKey !== 'footerPolicies'

    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Páginas</p>
            <h1>Editar contenido de páginas</h1>
            <p>Cambia textos e imágenes principales de Proyectos, Nosotros, Blog, Contacto y las secciones de productos del inicio.</p>
          </div>
          <div className="admin-header-actions">
            <button className="button button--primary" onClick={saveCurrentPageContent}><Save size={16} /> Guardar página</button>
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
              {renderCardSave('Guardar página', saveCurrentPageContent)}
            </div>

            <div className="admin-form-grid admin-form-grid--wide">
              <label>Breadcrumb<input value={page.breadcrumb || ''} onChange={(event) => updatePageContent(pageKey, { breadcrumb: event.target.value })} /></label>
              <label>Texto pequeño<input value={page.eyebrow || ''} onChange={(event) => updatePageContent(pageKey, { eyebrow: event.target.value })} placeholder="Opcional" /></label>
              <label className="admin-colspan">Título<textarea value={page.title || ''} onChange={(event) => updatePageContent(pageKey, { title: event.target.value })} /></label>
              <label className="admin-colspan">Descripción<textarea value={page.description || ''} onChange={(event) => updatePageContent(pageKey, { description: event.target.value })} /></label>
            </div>
          </article>
        )}

        {pageKey === 'productos' && (
          <article className="admin-editor-card admin-editor-card--hero">
            <div className="admin-image-box admin-image-box--hero">
              {page.menuImage ? <img src={page.menuImage} alt="Foto del menú Productos" /> : <Images size={30} />}
              <label>
                Foto del menú Productos
                <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('productos', 'menuImage', event)} />
              </label>
              {renderCardSave('Guardar página', saveCurrentPageContent)}
            </div>

            <div className="admin-form-grid admin-form-grid--wide">
              <label className="admin-colspan">Esta foto aparece en el desplegable superior de Productos<input value="Imagen editable desde este bloque" readOnly /></label>
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
            <div className="admin-editor-card admin-editor-card--hero">
              <div className="admin-image-box admin-image-box--hero">
                {page.logoImage ? <img src={page.logoImage} alt="Logo Formas Interiores" /> : <Images size={30} />}
                <label>
                  Cargar logo
                  <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('homeProducts', 'logoImage', event)} />
                </label>
                {renderCardSave('Guardar página', saveCurrentPageContent)}
              </div>
              <div className="admin-logo-copy">
                <h3>Logo principal</h3>
                <p>
                  Este logo aparece arriba a la izquierda y también puede usarse en el pie de página.
                </p>
              </div>
              <div className="admin-form-grid">
                <label>Alto del logo (px)<input inputMode="numeric" value={page.logoHeight || '120'} onChange={(event) => updatePageContent('homeProducts', { logoHeight: onlyDigits(event.target.value) })} /></label>
                <label>Ajuste imagen inicio
                  <select value={page.heroImageFit || 'cover'} onChange={(event) => updatePageContent('homeProducts', { heroImageFit: event.target.value })}>
                    <option value="cover">Cubrir cuadro</option>
                    <option value="contain">Mostrar completa</option>
                  </select>
                </label>
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
            <div className="admin-list-heading">
              <h2>Fotos de Por qué Formas Interiores</h2>
            </div>
            <div className="admin-editor-list admin-editor-list--compact">
              {[
                { id: 'diseno-personalizado', label: 'Diseño personalizado' },
                { id: 'fabricacion-calidad', label: 'Fabricación de calidad' },
                { id: 'instalacion-profesional', label: 'Instalación profesional' },
                { id: 'acompanamiento-completo', label: 'Acompañamiento completo' },
              ].map((benefit) => {
                const image = page.whyBenefits?.find((item) => item.id === benefit.id)?.image

                return (
                  <article className="admin-editor-card" key={benefit.id}>
                    <div className="admin-image-box">
                      {image ? <img src={image} alt={benefit.label} /> : <Images size={26} />}
                      <label>
                        Cargar foto
                        <input type="file" accept="image/*" onChange={(event) => handleWhyBenefitImageUpload(benefit.id, event)} />
                      </label>
                    </div>
                    <div className="admin-form-grid">
                      <label>Tarjeta<input value={benefit.label} readOnly /></label>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="admin-list-heading">
              <h2>Bloque final de contacto</h2>
            </div>
            <div className="admin-editor-card admin-editor-card--hero admin-editor-card--final-cta">
              <div className="admin-image-box admin-image-box--hero">
                {page.finalImage ? <img src={page.finalImage} alt={page.finalTitle || 'Bloque final'} /> : <Images size={30} />}
                <label>
                  Cargar foto final
                  <input type="file" accept="image/*" onChange={(event) => handlePageImageUpload('homeProducts', 'finalImage', event)} />
                </label>
                {renderCardSave('Guardar página', saveCurrentPageContent)}
              </div>
              <div className="admin-form-grid admin-form-grid--wide">
                <label>Texto pequeño<input value={page.finalEyebrow || ''} onChange={(event) => updatePageContent('homeProducts', { finalEyebrow: event.target.value })} /></label>
                <label>Título<input value={page.finalTitle || ''} onChange={(event) => updatePageContent('homeProducts', { finalTitle: event.target.value })} /></label>
                <label className="admin-colspan">Texto<textarea value={page.finalText || ''} onChange={(event) => updatePageContent('homeProducts', { finalText: event.target.value })} /></label>
                <label>Botón principal<input value={page.finalPrimaryLabel || ''} onChange={(event) => updatePageContent('homeProducts', { finalPrimaryLabel: event.target.value })} /></label>
                <label>Link botón principal<input value={page.finalPrimaryLink || ''} onChange={(event) => updatePageContent('homeProducts', { finalPrimaryLink: event.target.value })} /></label>
                <label>Texto WhatsApp<input value={page.finalWhatsappLabel || ''} onChange={(event) => updatePageContent('homeProducts', { finalWhatsappLabel: event.target.value })} /></label>
                <label>Link WhatsApp<input value={page.finalWhatsappLink || ''} onChange={(event) => updatePageContent('homeProducts', { finalWhatsappLink: event.target.value })} /></label>
              </div>
            </div>
          </article>
        )}

        {pageKey === 'footerPolicies' && (
          <article className="admin-create-card">
            <div className="admin-create-card__header">
              <div>
                <p className="admin-kicker">Footer</p>
                <h2>Políticas del footer</h2>
                <p>Estos enlaces aparecen en el pie de página y abren una página interna con el contenido de cada política.</p>
              </div>
              <button className="button button--primary" onClick={addFooterPolicy}><BadgePlus size={16} /> Agregar política</button>
            </div>

            <div className="admin-form-grid admin-form-grid--wide">
              <label>Título del bloque<input value={page.title || ''} onChange={(event) => updatePageContent('footerPolicies', { title: event.target.value })} /></label>
            </div>

            <div className="admin-editor-list">
              {(page.policies || []).map((policy, index) => (
                <article className="admin-editor-card admin-editor-card--policy" key={policy.id || index}>
                  <div className="admin-form-grid admin-form-grid--wide">
                    <label>Texto del botón<input value={policy.label || ''} onChange={(event) => updateFooterPolicy(index, { label: event.target.value })} /></label>
                    <label>URL interna<input value={policy.slug || ''} onChange={(event) => updateFooterPolicy(index, { slug: createSlug(event.target.value) })} /></label>
                    <label className="admin-colspan">Título de la página<input value={policy.title || ''} onChange={(event) => updateFooterPolicy(index, { title: event.target.value })} /></label>
                    <label className="admin-colspan">Contenido<textarea value={policy.content || ''} onChange={(event) => updateFooterPolicy(index, { content: event.target.value })} /></label>
                    <label className="admin-check-row"><input type="checkbox" checked={policy.active !== false} onChange={(event) => updateFooterPolicy(index, { active: event.target.checked })} /> Visible en el footer</label>
                  </div>
                  <div className="admin-card-actions">
                    <button className="button button--primary" onClick={saveCurrentPageContent}><Save size={16} /> Guardar política</button>
                    <button className="admin-delete" onClick={() => removeFooterPolicy(index)}><Trash2 size={16} /> Eliminar</button>
                  </div>
                </article>
              ))}
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
            {content.projects.map((project, index) => (
              <article className="admin-editor-card" key={`project-${index}`}>
                <div className="admin-image-box">
                  {project.image ? <img src={project.image} alt={project.title} /> : <Images size={26} />}
                  <label>
                    Cargar imagen
                    <input type="file" accept="image/*" onChange={(event) => handleProjectImageUpload(project.id, event)} />
                  </label>
                  {renderCardSave('Guardar proyecto', () => saveExistingProject(project, index))}
                </div>
                <div className="admin-form-grid">
                  <label>ID<input value={project.id} onChange={(event) => updateCollection('projects', project.id, { id: createSlug(event.target.value) })} /></label>
                  <label>Categoría
                    <select value={project.cat || 'hogar'} onChange={(event) => handleProjectCategory(project, event.target.value)}>
                      {projectCategoryOptions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                    </select>
                  </label>
                  <label>Etiqueta<input value={project.label} readOnly title="Se actualiza automáticamente con la categoría seleccionada." /></label>
                  <label>Título<input value={project.title} onChange={(event) => updateCollection('projects', project.id, { title: event.target.value })} /></label>
                  <label>Ubicación<input value={project.location} onChange={(event) => updateCollection('projects', project.id, { location: event.target.value })} /></label>
                </div>
                <div className="admin-card-actions">
                  <button className="button button--primary" onClick={() => saveExistingProject(project, index)}><Save size={16} /> Guardar cambios</button>
                  <button className="admin-delete" onClick={() => removeFromCollection('projects', project.id)}><Trash2 size={16} /> Eliminar</button>
                </div>
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
                {renderCardSave('Guardar página', saveCurrentPageContent)}
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
                {renderCardSave('Guardar página', saveCurrentPageContent)}
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

            <article className="admin-create-card">
              <div className="admin-form-grid admin-form-grid--wide">
                <label>Título visita<input value={page.visitTitle || ''} onChange={(event) => updatePageContent('contacto', { visitTitle: event.target.value })} /></label>
                <label>WhatsApp<input value={page.whatsappLink || ''} onChange={(event) => updatePageContent('contacto', { whatsappLink: event.target.value })} /></label>
                <label className="admin-colspan">Dirección para mapa<input value={page.mapAddress || ''} onChange={(event) => updatePageContent('contacto', { mapAddress: event.target.value })} placeholder="Ej: Medellín, Colombia" /></label>
                <label className="admin-colspan">Enlace embebido de Google Maps opcional<input value={page.mapEmbedUrl || ''} onChange={(event) => updatePageContent('contacto', { mapEmbedUrl: event.target.value })} placeholder="Opcional: pega aqui el src de un mapa embebido" /></label>
                <label className="admin-colspan">Texto visita<textarea value={page.visitText || ''} onChange={(event) => updatePageContent('contacto', { visitText: event.target.value })} /></label>
                <button className="button button--primary" onClick={saveCurrentPageContent}><Save size={16} /> Guardar ubicación</button>
              </div>
            </article>
          </div>
        )}
      </div>
    )
  }

  function renderStories() {
    return (
      <div className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <p className="admin-kicker">Historias</p>
            <h1>Proyectos realizados y testimonios</h1>
            <p>Administra el antes/después de trabajos terminados y los testimonios reales que aparecen en el inicio.</p>
          </div>
          <div className="admin-header-actions">
            <button className="button button--soft" onClick={addTestimonial}><BadgePlus size={16} /> Testimonio</button>
            <button className="button button--primary" onClick={addProjectHighlight}><BadgePlus size={16} /> Proyecto realizado</button>
          </div>
        </div>

        <div className="admin-help-grid">
          <div className="admin-help-card">
            <Images size={20} />
            <div>
              <strong>Proyectos realizados</strong>
              <p>Carga una imagen de antes y otra de después. Estas tarjetas salen en el home como evidencia visual de los trabajos.</p>
            </div>
          </div>
          <div className="admin-help-card">
            <Newspaper size={20} />
            <div>
              <strong>Testimonios reales</strong>
              <p>Usa testimonios autorizados por clientes. Puedes ocultar uno desmarcando “Visible en inicio”.</p>
            </div>
          </div>
        </div>

        <div className="admin-list-heading">
          <h2>Proyectos realizados</h2>
          <span>{content.projectHighlights.length} registros</span>
        </div>
        <div className="admin-editor-list">
          {content.projectHighlights.map((project, index) => (
            <article className="admin-editor-card admin-editor-card--story" key={`project-highlight-${index}`}>
              <div className="admin-before-after">
                <div className="admin-image-box">
                  {project.before ? <img src={project.before} alt={`${project.title} antes`} /> : <Images size={24} />}
                  <label>
                    Antes
                    <input type="file" accept="image/*" onChange={(event) => handleCollectionImageUpload('projectHighlights', project.id, 'before', event)} />
                  </label>
                  {renderCardSave('Guardar', () => saveExistingProjectHighlight(project, index))}
                </div>
                <div className="admin-image-box">
                  {project.after ? <img src={project.after} alt={`${project.title} después`} /> : <Images size={24} />}
                  <label>
                    Después
                    <input type="file" accept="image/*" onChange={(event) => handleCollectionImageUpload('projectHighlights', project.id, 'after', event)} />
                  </label>
                  {renderCardSave('Guardar', () => saveExistingProjectHighlight(project, index))}
                </div>
              </div>

              <div className="admin-form-grid">
                <label>ID<input value={project.id} onChange={(event) => updateCollection('projectHighlights', project.id, { id: createSlug(event.target.value) })} /></label>
                <label>Categoría<input value={project.category} onChange={(event) => updateCollection('projectHighlights', project.id, { category: event.target.value })} /></label>
                <label>Título<input value={project.title} onChange={(event) => updateCollection('projectHighlights', project.id, { title: event.target.value })} /></label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingProjectHighlight(project, index)}><Save size={16} /> Guardar cambios</button>
                <button className="admin-delete" onClick={() => removeFromCollection('projectHighlights', project.id)}><Trash2 size={16} /> Eliminar</button>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-list-heading admin-list-heading--spaced">
          <h2>Testimonios</h2>
          <span>{content.testimonials.length} testimonios</span>
        </div>
        <div className="admin-editor-list">
          {content.testimonials.map((testimonial, index) => (
            <article className="admin-editor-card" key={`testimonial-${index}`}>
              <div className="admin-image-box">
                {testimonial.image ? <img src={testimonial.image} alt={testimonial.name} /> : <Images size={26} />}
                <label>
                  Foto cliente
                  <input type="file" accept="image/*" onChange={(event) => handleCollectionImageUpload('testimonials', testimonial.id, 'image', event)} />
                </label>
                {renderCardSave('Guardar testimonio', () => saveExistingTestimonial(testimonial))}
              </div>

              <div className="admin-form-grid admin-form-grid--wide">
                <label>ID<input value={testimonial.id} onChange={(event) => updateCollection('testimonials', testimonial.id, { id: createSlug(event.target.value) })} /></label>
                <label>Nombre<input value={testimonial.name} onChange={(event) => updateCollection('testimonials', testimonial.id, { name: event.target.value })} /></label>
                <label>Ubicación<input value={testimonial.location} onChange={(event) => updateCollection('testimonials', testimonial.id, { location: event.target.value })} /></label>
                <label className="admin-check"><input type="checkbox" checked={testimonial.approved !== false} onChange={(event) => updateCollection('testimonials', testimonial.id, { approved: event.target.checked })} /> Visible en inicio</label>
                <label className="admin-colspan">Testimonio<textarea value={testimonial.text} onChange={(event) => updateCollection('testimonials', testimonial.id, { text: event.target.value })} /></label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingTestimonial(testimonial)}><Save size={16} /> Guardar cambios</button>
                <button className="admin-delete" onClick={() => removeFromCollection('testimonials', testimonial.id)}><Trash2 size={16} /> Eliminar</button>
              </div>
            </article>
          ))}
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
              <label>Precio visible<input value={newProduct.price} onChange={(event) => updateNewProductPrice(event.target.value)} placeholder="Ej: Desde $1.200.000 o $4.500.000" required /></label>
              <label>Precio neto descuento<input inputMode="numeric" value={newProduct.netPrice} onChange={(event) => updateNewProduct({ netPrice: onlyDigits(event.target.value) })} placeholder="Ej: 4500000" /></label>
              <label>Medidas<input value={newProduct.size} onChange={(event) => updateNewProduct({ size: event.target.value })} placeholder="A medida" /></label>
              <label>Material<input value={newProduct.material} onChange={(event) => updateNewProduct({ material: event.target.value })} placeholder="Ej: MDF RH" /></label>
              <label>Color/acabado<input value={newProduct.color} onChange={(event) => updateNewProduct({ color: event.target.value })} placeholder="Ej: Nogal y blanco" /></label>
              <label>Entrega<input value={newProduct.leadTime} onChange={(event) => updateNewProduct({ leadTime: event.target.value })} placeholder="Ej: 20 a 30 días" /></label>
              <label>Descuento %<input inputMode="numeric" value={newProduct.discountPercent} onChange={(event) => updateNewProduct({ discountPercent: onlyDigits(event.target.value) })} placeholder="Ej: 15" /></label>
              <label>Texto oferta<input value={newProduct.discountLabel} onChange={(event) => updateNewProduct({ discountLabel: event.target.value })} placeholder="Ej: Oferta de lanzamiento" /></label>
              <label>Inicio oferta<input type="date" value={newProduct.discountStart} onChange={(event) => updateNewProduct({ discountStart: event.target.value })} /></label>
              <label>Fin oferta<input type="date" value={newProduct.discountEnd} onChange={(event) => updateNewProduct({ discountEnd: event.target.value })} /></label>
              <label className="admin-colspan">Descripción para la ficha<textarea value={newProduct.description} onChange={(event) => updateNewProduct({ description: event.target.value })} placeholder="Describe el producto, su uso y lo que lo hace especial." /></label>
              <label className="admin-colspan">Ficha técnica PDF<input value={newProduct.technicalSheet || ''} onChange={(event) => updateNewProduct({ technicalSheet: event.target.value })} placeholder="URL del PDF o carga masiva por ZIP" /></label>
              <label className="admin-check"><input type="checkbox" checked={newProduct.featured} onChange={(event) => updateNewProduct({ featured: event.target.checked })} /> Destacado</label>
            </div>
          </div>

          <div className="admin-field-rules">
            <span>Nombre: obligatorio.</span>
            <span>Precio visible: texto libre, ejemplo Desde $1.200.000 o Cotizar.</span>
            <span>Precio neto: solo para calcular descuentos, no se muestra en la tarjeta.</span>
            <span>Categoría: define dónde se verá el producto.</span>
            <span>Medidas: texto corto, ejemplo 200 x 40 x 180 cm o A medida.</span>
            <span>Descuento: si tiene porcentaje y está vigente, se verá como etiqueta de oferta.</span>
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
          {content.products.map((product, index) => (
            <article className="admin-editor-card" key={`product-${index}`}>
              <div className="admin-image-box">
                {product.image ? <img src={product.image} alt={product.name} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('products', product.id, event)} />
                </label>
                {renderCardSave('Guardar producto', () => saveExistingProduct(product))}
              </div>

              <div className="admin-form-grid">
                <label>ID<input value={product.id} onChange={(event) => updateCollection('products', product.id, { id: createSlug(event.target.value) })} /></label>
                <label>Nombre<input value={product.name} onChange={(event) => updateCollection('products', product.id, { name: event.target.value })} /></label>
                <label>Categoría
                  <select value={product.categoryId} onChange={(event) => handleProductCategory(product, event.target.value)}>
                    {content.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label>Precio visible<input value={product.price} onChange={(event) => updateProductPrice(product, event.target.value)} /></label>
                <label>Precio neto descuento<input inputMode="numeric" value={product.netPrice || ''} onChange={(event) => updateCollection('products', product.id, { netPrice: onlyDigits(event.target.value) })} /></label>
                <label>Medidas<input value={product.size} onChange={(event) => updateCollection('products', product.id, { size: event.target.value })} /></label>
                <label>Material<input value={product.material || ''} onChange={(event) => updateCollection('products', product.id, { material: event.target.value })} /></label>
                <label>Color/acabado<input value={product.color || ''} onChange={(event) => updateCollection('products', product.id, { color: event.target.value })} /></label>
                <label>Entrega<input value={product.leadTime || ''} onChange={(event) => updateCollection('products', product.id, { leadTime: event.target.value })} /></label>
                <label>Descuento %<input inputMode="numeric" value={product.discountPercent || ''} onChange={(event) => updateCollection('products', product.id, { discountPercent: onlyDigits(event.target.value) })} /></label>
                <label>Texto oferta<input value={product.discountLabel || ''} onChange={(event) => updateCollection('products', product.id, { discountLabel: event.target.value })} /></label>
                <label>Inicio oferta<input type="date" value={product.discountStart || ''} onChange={(event) => updateCollection('products', product.id, { discountStart: event.target.value })} /></label>
                <label>Fin oferta<input type="date" value={product.discountEnd || ''} onChange={(event) => updateCollection('products', product.id, { discountEnd: event.target.value })} /></label>
                <label className="admin-colspan">Descripción para la ficha<textarea value={product.description || ''} onChange={(event) => updateCollection('products', product.id, { description: event.target.value })} /></label>
                <label className="admin-colspan">Ficha técnica PDF<input value={product.technicalSheet || ''} onChange={(event) => updateCollection('products', product.id, { technicalSheet: event.target.value })} placeholder="URL del PDF o carga masiva por ZIP" /></label>
                <label className="admin-check"><input type="checkbox" checked={product.featured} onChange={(event) => updateCollection('products', product.id, { featured: event.target.checked })} /> Destacado</label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingProduct(product)}><Save size={16} /> Guardar cambios</button>
                <button className="admin-delete" onClick={() => removeFromCollection('products', product.id)}><Trash2 size={16} /> Eliminar</button>
              </div>
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
          {content.blogPosts.map((post, index) => (
            <article className="admin-editor-card" key={`blog-post-${index}`}>
              <div className="admin-image-box">
                {post.image ? <img src={post.image} alt={post.title} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('blogPosts', post.id, event)} />
                </label>
                {renderCardSave('Guardar artículo', () => saveExistingBlogPost(post))}
              </div>

              <div className="admin-form-grid admin-form-grid--wide">
                <label>ID<input value={post.id} onChange={(event) => updateCollection('blogPosts', post.id, { id: createSlug(event.target.value) })} /></label>
                <label>Etiqueta opcional<input value={post.tag || ''} onChange={(event) => updateCollection('blogPosts', post.id, { tag: event.target.value })} placeholder="Ej: Consejos, Inspiración" /></label>
                <label>Fecha<input value={post.date} onChange={(event) => updateCollection('blogPosts', post.id, { date: event.target.value })} /></label>
                <label>Título<input value={post.title} onChange={(event) => updateCollection('blogPosts', post.id, { title: event.target.value })} /></label>
                <label className="admin-colspan">URL original del artículo<input value={post.originalUrl || ''} onChange={(event) => updateCollection('blogPosts', post.id, { originalUrl: event.target.value })} placeholder="https://..." /></label>
                <label className="admin-check"><input type="checkbox" checked={post.trending === true} onChange={(event) => updateCollection('blogPosts', post.id, { trending: event.target.checked })} /> Marcar como tendencia</label>
                <label className="admin-check"><input type="checkbox" checked={post.active !== false} onChange={(event) => updateCollection('blogPosts', post.id, { active: event.target.checked })} /> Visible en página</label>
                <label className="admin-colspan">Descripción<textarea value={post.desc} onChange={(event) => updateCollection('blogPosts', post.id, { desc: event.target.value })} /></label>
                <label className="admin-colspan">Contenido largo<textarea value={post.body} onChange={(event) => updateCollection('blogPosts', post.id, { body: event.target.value })} /></label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingBlogPost(post)}><Save size={16} /> Guardar cambios</button>
                <button className="admin-delete" onClick={() => removeFromCollection('blogPosts', post.id)}><Trash2 size={16} /> Eliminar</button>
              </div>
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
          {content.categories.map((category, index) => (
            <article className="admin-editor-card" key={`category-${index}`}>
              <div className="admin-image-box">
                {category.image ? <img src={category.image} alt={category.name} /> : <Images size={26} />}
                <label>
                  Cargar imagen
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload('categories', category.id, event)} />
                </label>
                {renderCardSave('Guardar categoría', () => saveExistingCategory(category))}
              </div>

              <div className="admin-form-grid">
                <label>ID<input value={category.id} readOnly title="El ID se genera al crear la categoría y no debe cambiarse." /></label>
                <label>Nombre<input value={category.name} onChange={(event) => updateCollection('categories', category.id, { name: event.target.value })} /></label>
                <label>Icono
                  <select value={category.icon} onChange={(event) => updateCollection('categories', category.id, { icon: event.target.value })}>
                    {iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="admin-colspan">Descripción<textarea value={category.description} onChange={(event) => updateCollection('categories', category.id, { description: event.target.value })} /></label>
              </div>

              <div className="admin-card-actions">
                <button className="button button--primary" onClick={() => saveExistingCategory(category)}><Save size={16} /> Guardar cambios</button>
                <button className="admin-delete" onClick={() => removeFromCollection('categories', category.id)}><Trash2 size={16} /> Eliminar</button>
              </div>
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
            <p>Exporta una plantilla, edítala en Excel y vuelve a cargarla como CSV. Las imágenes que subas desde el panel quedan guardadas en <strong>uploads</strong> del backend.</p>
          </div>
          <div className="admin-header-actions">
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
          {bulkType === 'products' && (
            <>
              <label className="admin-upload-csv">
                <Images size={16} /> Cargar ZIP de imágenes
                <input type="file" accept=".zip,application/zip" onChange={handleProductImagesZip} />
              </label>
              <label className="admin-upload-csv">
                <FileText size={16} /> Cargar ZIP de fichas técnicas
                <input type="file" accept=".zip,application/zip" onChange={handleProductTechnicalSheetsZip} />
              </label>
            </>
          )}
        </div>

        <div className="admin-csv-schema">
          <strong>Columnas requeridas para {config.label}:</strong>
          <code>{config.headers.join(', ')}</code>
        </div>

        {bulkType === 'products' && (
          <div className="admin-csv-schema">
            <strong>Imágenes masivas:</strong>
            <span>Sube un ZIP con fotos llamadas igual que el ID del producto, por ejemplo <code>centro-tv-nogal-001.jpg</code>. El sistema las asigna automáticamente.</span>
          </div>
        )}

        {bulkType === 'products' && (
          <div className="admin-csv-schema">
            <strong>Fichas técnicas masivas:</strong>
            <span>Sube un ZIP con PDFs llamados igual que el ID del producto, por ejemplo <code>centro-tv-nogal-001.pdf</code>. El botón Ver ficha técnica aparecerá automáticamente.</span>
          </div>
        )}

        <textarea className="admin-json-editor" value={csvPreview} onChange={(event) => setCsvPreview(event.target.value)} spellCheck="false" />
      </div>
    )
  }

  const renderers = {
    overview: renderOverview,
    hero: renderHero,
    pages: renderPages,
    stories: renderStories,
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
              <p className="cuenta-panel__eyebrow">ADMIN Formas Interiores</p>
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
          <span>Formas Interiores</span>
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
