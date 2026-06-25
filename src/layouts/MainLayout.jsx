import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/navigation/Header'
import Footer from '../components/navigation/Footer'

function MainLayout() {
  const { pathname } = useLocation()
  const needsSolidHeader = pathname === '/cuenta' || pathname === '/carrito' || pathname === '/buscar'

  return (
    <>
      <Header transparent={!needsSolidHeader} />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
