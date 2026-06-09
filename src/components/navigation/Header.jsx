import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bath, Bed, BookOpen, ChevronDown, CookingPot, Menu, Monitor,
  PanelsTopLeft, PencilRuler, Rows3, Search, ShoppingCart, User, X,
} from 'lucide-react'
import { useSiteContent } from '../../hooks/useSiteContent'

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const categoryIcons = {
  tv: Monitor,
  desk: PencilRuler,
  closet: PanelsTopLeft,
  kitchen: CookingPot,
  bath: Bath,
  shelf: Rows3,
  bed: Bed,
  book: BookOpen,
}

function Header({ transparent = false }) {
  const [dropOpen, setDropOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [{ categories }] = useSiteContent()
  const visibleCategories = categories.filter((category) => category.active !== false)
  const dropRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) setDropOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const query = normalizeText(searchValue)

    if (query) {
      const match = visibleCategories.find((category) => (
        normalizeText(category.id).includes(query) || normalizeText(category.name).includes(query)
      ))

      navigate(match ? `/categorias/${match.id}` : '/')
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <header className={`site-header ${transparent ? 'site-header--transparent' : 'site-header--solid'}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <svg className="brand__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="22" y="22" width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M14 20 L7 26 L17 30 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M34 28 L41 22 L31 18 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="brand__textwrap">
            <span className="brand__text">FORMAS</span>
            <span className="brand__tagline">DISEÑA TU ESTILO</span>
          </span>
        </Link>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Inicio</NavLink>

          <div className="nav-dropdown" ref={dropRef}>
            <button
              className={`nav-dropdown__trigger ${dropOpen ? 'open' : ''}`}
              onClick={() => setDropOpen((current) => !current)}
            >
              Productos
              <span className="nav-dropdown__arrow"><ChevronDown size={14} /></span>
            </button>

            <div className={`nav-dropdown__menu ${dropOpen ? 'open' : ''}`}>
              <div className="nav-dropdown__col">
                <div className="nav-dropdown__title">Categorías</div>
                {visibleCategories.map((category) => {
                  const Icon = categoryIcons[category.icon] || Rows3

                  return (
                    <Link
                      key={category.id}
                      to={`/categorias/${category.id}`}
                      className="nav-dropdown__link"
                      onClick={() => { setDropOpen(false); setMenuOpen(false) }}
                    >
                      <Icon size={18} strokeWidth={1.6} />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
              <div className="nav-dropdown__promo">
                <div className="nav-dropdown__promo-ph">Foto pendiente</div>
                <strong>Diseñamos muebles</strong>
                <span>que se adaptan a tu <em>estilo de vida.</em></span>
                <p>Funcionalidad, diseño y calidad en cada detalle.</p>
              </div>
            </div>
          </div>

          <NavLink to="/proyectos" onClick={() => setMenuOpen(false)}>Proyectos</NavLink>
          <NavLink to="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</NavLink>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</NavLink>
        </nav>

        <div className="header-actions">
          <button
            className={`header-icon header-icon--search ${searchOpen ? 'active' : ''}`}
            aria-label="Buscar"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Search size={20} />
          </button>
          <Link to="/cuenta" className="header-icon" aria-label="Admin">
            <User size={20} />
          </Link>
          <Link to="/carrito" className="header-icon" aria-label="Carrito">
            <ShoppingCart size={20} />
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen((current) => !current)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-bar">
          <form onSubmit={handleSearch} className="search-bar__form">
            <Search size={20} />
            <input
              type="text"
              placeholder="Busca productos o categorías..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              autoFocus
            />
            <button type="button" className="search-bar__close" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </button>
          </form>
        </div>
      )}
    </header>
  )
}

export default Header
