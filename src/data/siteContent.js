export const SITE_CONTENT_KEY = 'formas-site-content-v1'
export const SITE_CONTENT_EVENT = 'formas-site-content-updated'

export const defaultSiteContent = {
  categories: [
    {
      id: 'centros-entretenimiento',
      name: 'Centros de entretenimiento',
      description: 'Diseños para integrar tecnología, almacenamiento y estilo.',
      image: '',
      icon: 'tv',
    },
    {
      id: 'centros-estudio',
      name: 'Centros de estudio',
      description: 'Espacios funcionales para trabajar, estudiar y crear.',
      image: '',
      icon: 'desk',
    },
    {
      id: 'closets',
      name: 'Closets',
      description: 'Organización elegante para aprovechar cada centímetro.',
      image: '',
      icon: 'closet',
    },
    {
      id: 'cocinas',
      name: 'Cocinas',
      description: 'Mobiliario moderno para cocinas cálidas y prácticas.',
      image: '',
      icon: 'kitchen',
    },
    {
      id: 'muebles-bano',
      name: 'Muebles de baño',
      description: 'Soluciones resistentes y funcionales para espacios de baño.',
      image: '',
      icon: 'bath',
    },
    {
      id: 'repisas',
      name: 'Repisas',
      description: 'Detalles decorativos y útiles para completar tus ambientes.',
      image: '',
      icon: 'shelf',
    },
    {
      id: 'alcobas-infantiles',
      name: 'Alcobas infantiles',
      description: 'Muebles seguros, prácticos y personalizados para niños.',
      image: '',
      icon: 'bed',
    },
    {
      id: 'bibliotecas',
      name: 'Bibliotecas',
      description: 'Diseños para organizar, exhibir y dar carácter a tus espacios.',
      image: '',
      icon: 'book',
    },
  ],
  products: [
    { id: 'forma-tv-180', categoryId: 'centros-entretenimiento', category: 'Centro de entretenimiento', name: 'FORMA TV-180', price: '$1.350.000', size: '200 x 40 x 180 cm', image: '', featured: true },
    { id: 'forma-work', categoryId: 'centros-estudio', category: 'Centro de estudio', name: 'FORMA Work', price: '$980.000', size: '120 x 60 x 200 cm', image: '', featured: true },
    { id: 'forma-modular', categoryId: 'bibliotecas', category: 'Biblioteca', name: 'FORMA Modular', price: '$750.000', size: '150 x 210 x 30 cm', image: '', featured: true },
    { id: 'forma-nordic', categoryId: 'repisas', category: 'Repisa', name: 'FORMA Nordic', price: '$220.000', size: '100 x 20 x 3.6 cm', image: '', featured: true },
    { id: 'centro-minimalista', categoryId: 'centros-entretenimiento', category: 'Centro de entretenimiento', name: 'Centro Minimalista', price: 'Desde $1.150.000', size: '200 x 40 x 180 cm', image: '', featured: false },
    { id: 'centro-moderno', categoryId: 'centros-entretenimiento', category: 'Centro de entretenimiento', name: 'Centro Moderno', price: 'Desde $1.350.000', size: '220 x 40 x 190 cm', image: '', featured: false },
    { id: 'closet-vidrio', categoryId: 'closets', category: 'Closet', name: 'Closet con Puertas de Vidrio', price: 'Desde $2.850.000', size: 'A medida', image: '', featured: false },
    { id: 'cocina-isla', categoryId: 'cocinas', category: 'Cocina', name: 'Cocina Moderna con Isla', price: 'Desde $12.500.000', size: 'A medida', image: '', featured: false },
    { id: 'bano-minimalista', categoryId: 'muebles-bano', category: 'Mueble de baño', name: 'Mueble de Baño Minimalista', price: 'Desde $1.250.000', size: 'A medida', image: '', featured: false },
    { id: 'alcoba-sueno', categoryId: 'alcobas-infantiles', category: 'Alcoba infantil', name: 'Alcoba Dulce Sueño', price: 'Desde $8.900.000', size: 'Cama, escritorio y closet', image: '', featured: false },
  ],
  blogPosts: [
    { id: 'cocinas-modernas', tag: 'TENDENCIAS', date: '20 de mayo, 2024', title: 'Cocinas modernas: 5 tendencias que seguirán marcando el 2024', desc: 'Descubre los estilos, colores y materiales que transformarán tu cocina en el corazón de tu hogar.', image: '', body: '' },
    { id: 'centro-entretenimiento-perfecto', tag: 'TIPS Y CONSEJOS', date: '8 de mayo, 2024', title: 'Cómo elegir el centro de entretenimiento perfecto para tu sala', desc: 'Te compartimos claves para lograr un diseño funcional, estético y a la medida de tu espacio.', image: '', body: '' },
    { id: 'closets-orden', tag: 'DISEÑO DE INTERIORES', date: '25 de abril, 2024', title: 'Clósets que enamoran: organización con estilo', desc: 'Ideas y soluciones para mantener todo en orden sin sacrificar el diseño.', image: '', body: '' },
  ],
}

export function createSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function mergeSiteContent(content) {
  return {
    ...defaultSiteContent,
    ...content,
    categories: Array.isArray(content?.categories) ? content.categories : defaultSiteContent.categories,
    products: Array.isArray(content?.products) ? content.products : defaultSiteContent.products,
    blogPosts: Array.isArray(content?.blogPosts) ? content.blogPosts : defaultSiteContent.blogPosts,
  }
}

export function loadSiteContent() {
  if (typeof window === 'undefined') return defaultSiteContent

  try {
    const stored = window.localStorage.getItem(SITE_CONTENT_KEY)
    return stored ? mergeSiteContent(JSON.parse(stored)) : defaultSiteContent
  } catch {
    return defaultSiteContent
  }
}

export function saveSiteContent(content) {
  const nextContent = mergeSiteContent(content)
  window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(nextContent))
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT, { detail: nextContent }))
  return nextContent
}
