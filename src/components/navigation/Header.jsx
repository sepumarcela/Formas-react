import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronDown, Menu, Search, ShoppingCart, User, X,
} from 'lucide-react'
import { PiBathtubDuotone, PiBedDuotone, PiBookOpenTextDuotone, PiCookingPotDuotone, PiGridFourDuotone, PiRulerDuotone, PiSquaresFourDuotone, PiTelevisionDuotone } from 'react-icons/pi'
import { useSiteContent } from '../../hooks/useSiteContent'
import { CART_UPDATED_EVENT, loadCartItems } from '../../utils/cart'
import { optimizeImage } from '../../utils/images'
import { normalizeSearchText, searchSiteContent } from '../../utils/searchIndex'
import { SHOW_PROJECTS_PAGE } from '../../config/features'

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
  const [siteContent] = useSiteContent()
  const { categories, pageContent } = siteContent
  const logoImage = pageContent.homeProducts?.logoImage
  const logoHeight = pageContent.homeProducts?.logoHeight || 120
  const fallbackLogo = '/favicon-formas.png?v=11'
  const productsMenuImage = pageContent.productos?.menuImage
  const visibleCategories = categories.filter((category) => category.active !== false)
  const dropRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const usesDarkHeader = location.pathname.startsWith('/cuenta') || location.pathname.startsWith('/carrito') || location.pathname.startsWith('/buscar')
  const searchResults = useMemo(() => searchSiteContent(siteContent, searchValue, 5), [siteContent, searchValue])

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
      if (event.storageArea === window.sessionStorage && (!event.key || event.key === 'formas-cart-v1')) {
        syncCart({})
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncStorage)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  function closeSearch() {
    setSearchOpen(false)
    setSearchValue('')
  }

  function handleSearch(event) {
    event.preventDefault()
    const query = normalizeSearchText(searchValue)

    if (query) {
      navigate('/buscar?q=' + encodeURIComponent(searchValue.trim()))
      closeSearch()
    }
  }

  return (
    <header className={`site-header ${transparent ? 'site-header--transparent' : 'site-header--solid'} ${usesDarkHeader ? 'site-header--admin' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand">
          {logoImage ? (
            <img className="brand__logo-img" src={optimizeImage(logoImage, { width: 320 })} alt="Formas Interiores" style={{ '--logo-height': `${logoHeight}px` }} />
          ) : (
            <img className="brand__logo-img brand__logo-img--fallback" src={fallbackLogo} alt="Formas Interiores" style={{ '--logo-height': `${Math.min(Number(logoHeight) || 92, 92)}px` }} />
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
                  {productsMenuImage ? <img src={optimizeImage(productsMenuImage, { width: 500 })} alt="Productos Formas Interiores" /> : 'Foto pendiente'}
                </div>
                <strong>Diseñamos muebles</strong>
                <span>que se adaptan a tu <em>estilo de vida.</em></span>
                <p>Funcionalidad, diseño y calidad en cada detalle.</p>
              </div>
            </div>
          </div>

          {SHOW_PROJECTS_PAGE && <NavLink to="/proyectos" onClick={() => setMenuOpen(false)}>Proyectos</NavLink>}
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
          <button className="menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-bar">
          <form id="site-search-form" onSubmit={handleSearch} className="search-bar__form">
            <Search size={20} />
            <input
              type="text"
              placeholder="Busca productos, categorias, blog..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              autoFocus
            />
            <button type="button" className="search-bar__close" aria-label="Cerrar búsqueda" onClick={closeSearch}>
              <X size={20} />
            </button>
          </form>
          {normalizeSearchText(searchValue) && (
            <div className="search-suggestions">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  item.external ? (
                    <a className="search-suggestion" href={item.url} key={item.url} target="_blank" rel="noreferrer" onClick={closeSearch}>
                      <span>{item.type}</span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </a>
                  ) : (
                    <Link className="search-suggestion" to={item.url} key={item.url} onClick={closeSearch}>
                      <span>{item.type}</span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </Link>
                  )
                ))
              ) : (
                <div className="search-suggestion search-suggestion--empty">
                  <strong>Sin resultados rapidos</strong>
                  <small>Presiona Enter para ver una busqueda mas amplia.</small>
                </div>
              )}
              <button type="submit" form="site-search-form" className="search-suggestions__all">
                Ver todos los resultados
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
