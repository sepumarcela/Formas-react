import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Proyectos from './pages/Proyectos'
import Blog from './pages/Blog'
import Contacto from './pages/Contacto'
import CategoryDetail from './pages/CategoryDetail'
import ProductDetail from './pages/ProductDetail'
import Cuenta from './pages/Cuenta'
import Carrito from './pages/Carrito'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/categorias/:categoryId" element={<CategoryDetail />} />
          <Route path="/productos/:productId" element={<ProductDetail />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/carrito" element={<Carrito />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
