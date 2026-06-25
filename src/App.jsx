import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Proyectos from './pages/Proyectos'
import Blog from './pages/Blog'
import BlogPostDetail from './pages/BlogPostDetail'
import Contacto from './pages/Contacto'
import Productos from './pages/Productos'
import CategoryDetail from './pages/CategoryDetail'
import ProductDetail from './pages/ProductDetail'
import TechnicalSheetViewer from './pages/TechnicalSheetViewer'
import Cuenta from './pages/Cuenta'
import Carrito from './pages/Carrito'
import PaymentResult from './pages/PaymentResult'
import SearchResults from './pages/SearchResults'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/proyectos" element={<Proyectos />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
