import {React, useEffect, useState, useRef} from 'react'
import {HiMenu} from 'react-icons/hi'
import Logo  from '../assets/logo.png'
import {Link, Route, Routes, useNavigate} from 'react-router-dom'

import {userQuery} from '../utils/data' 
import {client} from '../client'
import { Sidebar, UserProfile } from '../components'
import Pins from './Pins'

const Home = () => {
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()
  const userId = userInfo?.googleId

  const [user, setUser] = useState(null)
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const scrollRef = useRef(null)

  const navigate = useNavigate();


  useEffect(() => {
    const query = userQuery(userId) 

    client.fetch(query)
    .then((response) => {
      setUser(response[0])
    })
  }, [])

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      scrollRef.current.scrollTo(0, 0)
    } 
  }, [])
  
  
  return (
    <div className='flex bg-gray-100 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>

      {/* Sidebar for large screens */}
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user}/>
      </div>

      {/* Sidebar for small screens  */}
      <div className='md:hidden flex flex-row'>
        <div className='flex flex-row p-2 items-center justify-between w-full shadow-md'>
          <HiMenu fontSize={40} 
          className='cursor-pointer'
          onClick={() => setToggleSidebar(!toggleSidebar)}/>
          <Link to='/'>
            <img src={Logo} alt="logo" className='w-28'/>
          </Link>
          <Link to={`/user-profile/${userId}`}>
            <img src={user?.image} alt='user' className='rounded-full h-9 w-9'/>
          </Link>
        </div>
        {toggleSidebar && 
        <div className='fixed w-3/5 bg-white h-screen overflow-y-auto z-10 animate-slide-in '>
          <Sidebar  handleSidebar={setToggleSidebar} user={user}/>
        </div>
        }
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>

    </div>
    

  )
}

export default Home