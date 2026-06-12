import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronDown, Menu, Search, ShoppingCart, User, X,
} from 'lucide-react'
import { PiBathtubDuotone, PiBedDuotone, PiBookOpenTextDuotone, PiCookingPotDuotone, PiGridFourDuotone, PiRulerDuotone, PiSquaresFourDuotone, PiTelevisionDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'
import { CART_UPDATED_EVENT, loadCartItems } from '../../utils/cart'

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const categoryIcons = {
  tv: PiTelevisionDuotone,
  desk: PiRulerDuotone,
  closet: PiSquaresFourDuotone,
  kitchen: PiCookingPotDuotone,
  bath: PiBathtubDuotone,
  shelf: PiGridFourDuotone,
  bed: PiBedDuotone,
  book: PiBookOpenTextDuotone,
}

function Header({ transparent = false }) {
  const [dropOpen, setDropOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [cartCount, setCartCount] = useState(() => loadCartItems().reduce((sum, item) => sum + item.quantity, 0))
  const [{ categories, pageContent }] = useSiteContent()
  const logoImage = pageContent.homeProducts?.logoImage
  const logoHeight = pageContent.homeProducts?.logoHeight || 120
  const productsMenuImage = pageContent.productos?.menuImage
  const visibleCategories = categories.filter((category) => category.active !== false)
  const dropRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const usesDarkHeader = location.pathname.startsWith('/cuenta') || location.pathname.startsWith('/carrito')

  useEffect(() => {
    function handleClick(event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) setDropOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function syncCart(event) {
      const nextItems = event.detail || loadCartItems()
      setCartCount(nextItems.reduce((sum, item) => sum + item.quantity, 0))
    }

    function syncStorage(event) {
      if (!event.key || event.key === 'formas-cart-v1') syncCart({})
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncStorage)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncStorage)
    }
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
    <header className={`site-header ${transparent ? 'site-header--transparent' : 'site-header--solid'} ${usesDarkHeader ? 'site-header--admin' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand">
          {logoImage ? (
            <img className="brand__logo-img" src={logoImage} alt="FORMAS" style={{ '--logo-height': `${logoHeight}px` }} />
          ) : (
            <>
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
            </>
          )}
        </Link>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Inicio</NavLink>

          <div className="nav-dropdown" ref={dropRef}>
            <div className="nav-dropdown__main">
              <NavLink
                to="/productos"
                className={({ isActive }) => (
                  isActive || location.pathname.startsWith('/categorias/') || location.pathname.startsWith('/productos/')
                    ? 'nav-dropdown__toplink active'
                    : 'nav-dropdown__toplink'
                )}
                onClick={() => setMenuOpen(false)}
              >
                Productos
              </NavLink>
              <button
                className={`nav-dropdown__trigger ${dropOpen ? 'open' : ''}`}
                onClick={() => setDropOpen((current) => !current)}
                aria-label="Ver categorías de productos"
                aria-expanded={dropOpen}
              >
                <span className="nav-dropdown__arrow"><ChevronDown size={14} /></span>
              </button>
            </div>

            <div className={`nav-dropdown__menu ${dropOpen ? 'open' : ''}`}>
              <div className="nav-dropdown__col">
                <div className="nav-dropdown__title">Categorías</div>
                <Link
                  to="/productos"
                  className="nav-dropdown__link"
                  onClick={() => { setDropOpen(false); setMenuOpen(false) }}
                >
                  <PiGridFourDuotone size={18} />
                  Ver todos los productos
                </Link>
                {visibleCategories.map((category) => {
                  const Icon = categoryIcons[category.icon] || PiGridFourDuotone

                  return (
                    <Link
                      key={category.id}
                      to={`/categorias/${category.id}`}
                      className="nav-dropdown__link"
                      onClick={() => { setDropOpen(false); setMenuOpen(false) }}
                    >
                      <Icon size={18} />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
              <div className="nav-dropdown__promo">
                <div className="nav-dropdown__promo-ph">
                  {productsMenuImage ? <img src={productsMenuImage} alt="Productos FORMAS" /> : 'Foto pendiente'}
                </div>
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
            {cartCount > 0 && <span className="header-cart-count">{cartCount}</span>}
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
