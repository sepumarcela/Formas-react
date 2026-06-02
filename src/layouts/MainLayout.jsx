import { Outlet } from 'react-router-dom'
import Header from '../components/navigation/Header'
import Footer from '../components/navigation/Footer'

function MainLayout() {
  return (
    <>
      <Header transparent={true} />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout