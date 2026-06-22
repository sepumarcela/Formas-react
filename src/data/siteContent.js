export const SITE_CONTENT_KEY = 'formas-site-content-v1'
export const SITE_CONTENT_EVENT = 'formas-site-content-updated'

const legacyDemoProductIds = new Set([
  'forma-tv-180',
  'forma-work',
  'forma-modular',
  'forma-nordic',
  'centro-minimalista',
  'centro-moderno',
  'closet-vidrio',
  'cocina-isla',
  'bano-minimalista',
  'alcoba-sueno',
])

export const defaultSiteContent = {
  heroSlides: [
    {
      id: 'inicio-principal',
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
    },
  ],
  pageContent: {
    homeProducts: {
      categoriesEyebrow: 'Nuestras líneas',
      logoImage: '',
      logoHeight: '120',
      heroImageFit: 'cover',
      categoriesTitle: 'Soluciones que transforman',
      categoriesDescription: 'Muebles modernos y funcionales diseñados para cada espacio de tu hogar.',
      featuredEyebrow: 'Destacados de la semana',
      featuredTitle: 'Lo más elegido por nuestros clientes',
      featuredDescription: 'Diseños funcionales, modernos y listos para inspirar nuevos espacios.',
      whyBenefits: [
        { id: 'diseno-personalizado', image: '' },
        { id: 'fabricacion-calidad', image: '' },
        { id: 'instalacion-profesional', image: '' },
        { id: 'acompanamiento-completo', image: '' },
      ],
      finalEyebrow: 'Hablemos de tu proyecto',
      finalTitle: '¿Listo para transformar tu espacio?',
      finalText: 'Cuéntanos qué necesitas y te ayudamos a crear un mueble a medida para tu hogar.',
      finalPrimaryLabel: 'Solicitar cotización',
      finalPrimaryLink: '/contacto',
      finalWhatsappLabel: 'Hablar por WhatsApp',
      finalWhatsappLink: 'https://wa.me/573001234567',
      finalImage: '',
    },
    proyectos: {
      breadcrumb: 'Proyectos',
      eyebrow: '',
      title: 'Proyectos',
      description: 'Descubre espacios reales transformados por Formas Interiores. Cada proyecto refleja nuestro compromiso con el diseño, la funcionalidad y los detalles que marcan la diferencia.',
      image: '',
      ctaLabel: 'Ver más proyectos',
      ctaLink: '/contacto',
    },
    productos: {
      breadcrumb: 'Productos',
      eyebrow: 'Productos',
      title: 'Muebles para cada espacio',
      description: 'Conoce nuestras líneas de producto y encuentra soluciones funcionales, cálidas y hechas para tu estilo de vida.',
      image: '',
      menuImage: '',
      ctaLabel: 'Solicitar asesoría',
      ctaLink: '/contacto',
    },
    nosotros: {
      breadcrumb: 'Nosotros',
      eyebrow: 'Nosotros',
      title: 'Diseñamos experiencias,\ncreamos hogares.',
      description: 'En Formas Interiores transformamos espacios en lugares que reflejan tu estilo de vida y se adaptan a tus necesidades. Combinamos diseño, calidad y funcionalidad en cada detalle.',
      image: '',
      historyTitle: 'Nuestra historia',
      historyText: 'Formas Interiores nació con la visión de ofrecer muebles personalizados de alta calidad que elevaran los espacios de nuestros clientes.\nHoy, somos un equipo apasionado por el diseño y la innovación, consolidado como una marca referente en mobiliario personalizado en Colombia.\nCada proyecto es único y refleja nuestra dedicación por crear espacios que transformen la vida de las personas.',
      historyImage: '',
      locationImage: '',
    },
    blog: {
      breadcrumb: 'Blog',
      eyebrow: '',
      title: 'Blog',
      description: 'Ideas, inspiración y consejos para diseñar espacios que reflejen tu estilo y mejoren tu día a día.',
      image: '',
      sidebarTitle: 'Artículos populares',
      ctaTitle: '¿Tienes un proyecto en mente?',
      ctaText: 'Te ayudamos a diseñar y hacer realidad el espacio que sueñas.',
    },
    contacto: {
      breadcrumb: 'Contacto',
      eyebrow: 'Contacto',
      title: 'Hablemos de tu proyecto',
      description: 'Estamos aquí para ayudarte a transformar tus ideas en espacios únicos y funcionales.',
      image: '',
      formTitle: 'Cuéntanos tu idea',
      formSubtitle: 'Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo.',
      addressTitle: 'Visítanos',
      address: 'Medellín, Colombia',
      phoneTitle: 'Llámanos',
      phone: '+57 300 123 4567\n+57 604 444 7890',
      emailTitle: 'Escríbenos',
      email: 'hola@formasinteriores.com',
      hoursTitle: 'Horario de atención',
      hours: 'Lunes a Viernes: 8:00 a.m. - 6:00 p.m.\nSábados: 9:00 a.m. - 1:00 p.m.',
      mapAddress: 'Medellín, Colombia',
      mapEmbedUrl: '',
      visitTitle: 'Sala de diseño',
      visitText: 'Agenda tu visita y conoce nuestros espacios de inspiración.',
      whatsappLink: 'https://wa.me/573001234567',
    },
  },
  projects: [
    { id: 'sala-moderna', cat: 'hogar', label: 'Hogar', title: 'Sala Moderna', location: 'Bogotá, Colombia', image: '' },
    { id: 'cocina-contemporanea', cat: 'cocina', label: 'Cocina', title: 'Cocina Contemporánea', location: 'Medellín, Colombia', image: '' },
    { id: 'vestier-abierto', cat: 'closet', label: 'Closet', title: 'Vestier Abierto', location: 'Cali, Colombia', image: '' },
    { id: 'bano-minimalista', cat: 'bano', label: 'Baño', title: 'Baño Minimalista', location: 'Barranquilla, Colombia', image: '' },
    { id: 'oficina-en-casa', cat: 'oficina', label: 'Oficina', title: 'Oficina en Casa', location: 'Bucaramanga, Colombia', image: '' },
    { id: 'local-comercial', cat: 'comercial', label: 'Comercial', title: 'Local Comercial', location: 'Medellín, Colombia', image: '' },
  ],
  projectHighlights: [
    { id: 'cocina-moderna', category: 'Cocinas', title: 'Cocina moderna familiar', before: '', after: '' },
    { id: 'closet-principal', category: 'Closets', title: 'Closet principal a medida', before: '', after: '' },
    { id: 'centro-tv', category: 'Centros de entretenimiento', title: 'Sala con centro de TV', before: '', after: '' },
  ],
  testimonials: [
    {
      id: 'maria-fernanda',
      name: 'María Fernanda G.',
      location: 'Medellín, Antioquia',
      text: 'Transformaron completamente nuestro apartamento. El resultado quedó cálido, funcional y muy bien terminado.',
      image: '',
      approved: true,
    },
    {
      id: 'juan-carlos',
      name: 'Juan Carlos R.',
      location: 'Cali, Valle del Cauca',
      text: 'Excelente calidad y acompañamiento. Nos ayudaron a entender qué diseño funcionaba mejor para el espacio.',
      image: '',
      approved: true,
    },
    {
      id: 'laura-andres',
      name: 'Laura y Andrés M.',
      location: 'Bogotá, Cundinamarca',
      text: 'El clóset quedó mejor de lo que imaginábamos. Todo el proceso fue claro y ordenado.',
      image: '',
      approved: true,
    },
  ],
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
    products: removeLegacyDemoProducts(Array.isArray(content?.products) ? content.products : defaultSiteContent.products),
    blogPosts: Array.isArray(content?.blogPosts) ? content.blogPosts : defaultSiteContent.blogPosts,
    heroSlides: Array.isArray(content?.heroSlides) ? content.heroSlides : defaultSiteContent.heroSlides,
    projects: Array.isArray(content?.projects) ? content.projects : defaultSiteContent.projects,
    projectHighlights: Array.isArray(content?.projectHighlights) ? content.projectHighlights : defaultSiteContent.projectHighlights,
    testimonials: Array.isArray(content?.testimonials) ? content.testimonials : defaultSiteContent.testimonials,
    pageContent: {
      ...defaultSiteContent.pageContent,
      ...(content?.pageContent || {}),
      homeProducts: {
        ...defaultSiteContent.pageContent.homeProducts,
        ...(content?.pageContent?.homeProducts || {}),
      },
      proyectos: {
        ...defaultSiteContent.pageContent.proyectos,
        ...(content?.pageContent?.proyectos || {}),
      },
      productos: {
        ...defaultSiteContent.pageContent.productos,
        ...(content?.pageContent?.productos || {}),
      },
      nosotros: {
        ...defaultSiteContent.pageContent.nosotros,
        ...(content?.pageContent?.nosotros || {}),
      },
      blog: {
        ...defaultSiteContent.pageContent.blog,
        ...(content?.pageContent?.blog || {}),
      },
      contacto: {
        ...defaultSiteContent.pageContent.contacto,
        ...(content?.pageContent?.contacto || {}),
      },
    },
  }
}

function removeLegacyDemoProducts(products) {
  return products.filter((product) => !legacyDemoProductIds.has(product.id))
}

export function loadSiteContent() {
  if (typeof window === 'undefined') return mergeSiteContent(defaultSiteContent)

  try {
    const stored = window.localStorage.getItem(SITE_CONTENT_KEY)
    return mergeSiteContent(stored ? JSON.parse(stored) : defaultSiteContent)
  } catch {
    return mergeSiteContent(defaultSiteContent)
  }
}

export function saveSiteContent(content) {
  const nextContent = mergeSiteContent(content)
  window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(nextContent))
  window.queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT, { detail: nextContent }))
  })
  return nextContent
}
