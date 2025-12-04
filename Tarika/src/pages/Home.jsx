import "../css/Home.css"
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function Home() {

  return (
    <div className='home'>
     <Header/>
     <Outlet/>
     <Navbar/>
    </div>
  )
}

export default Home