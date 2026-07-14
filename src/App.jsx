import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SeoManager from './components/SeoManager'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import { SHOW_PROJECTS_PAGE } from './config/features'
import './styles/global.css'

const Nosotros = lazy(() => import('./pages/Nosotros'))
const Proyectos = lazy(() => import('./pages/Proyectos'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Productos = lazy(() => import('./pages/Productos'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const TechnicalSheetViewer = lazy(() => import('./pages/TechnicalSheetViewer'))
const Cuenta = lazy(() => import('./pages/Cuenta'))
const Carrito = lazy(() => import('./pages/Carrito'))
const PaymentResult = lazy(() => import('./pages/PaymentResult'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const PolicyPage = lazy(() => import('./pages/PolicyPage'))

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoManager />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/proyectos" element={SHOW_PROJECTS_PAGE ? <Proyectos /> : <Navigate to="/" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPostDetail />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/categorias/:categoryId" element={<CategoryDetail />} />
            <Route path="/productos/:productId" element={<ProductDetail />} />
            <Route path="/ficha-tecnica" element={<TechnicalSheetViewer />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pago/resultado" element={<PaymentResult />} />
            <Route path="/buscar" element={<SearchResults />} />
            <Route path="/politicas/:policySlug" element={<PolicyPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
