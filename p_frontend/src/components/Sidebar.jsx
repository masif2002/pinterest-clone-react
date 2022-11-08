import React from 'react'
import { NavLink, Link} from 'react-router-dom'

import logo from '../assets/logo.png'
import {AiFillCloseCircle} from 'react-icons/ai'
import {RiHomeFill} from 'react-icons/ri'
import {IoIosArrowForward} from 'react-icons/io'
import { categories } from '../utils/data'


const normalStyle = 'flex mt-6 items-center space-x-6 text-gray-500 capitalize hover:text-black transition-all duration-200 ease-in-out'
const activeStyle = 'flex mt-6 items-center space-x-6 font-bold border-black border-r-4 capitalize transition-all duration-200 ease-in-out' 

const Sidebar = ({handleSidebar, user}) => {

  return (
    <div className='flex flex-col pt-5 pl-10 shadow-lg h-full overflow-y-scroll min-w-210 hide-scrollbar justify-between bg-gray-50'>

      <div>

        {/* Logo and X */}
        <div className='flex justify-between items-center w-full bg-'>
          <Link
            to="/"
            onClick={handleSidebar}
          >
          <img src={logo} alt='logo 'className='w-30 md:w-full h-9 md: pr-8' />
          </Link>
          <AiFillCloseCircle 
          fontSize={30}
          className='cursor-pointer md:hidden mr-2' 
          onClick={() => { handleSidebar(false) }}
          />
        </div>

          {/* Home */}
          <NavLink
          to='/'
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
          onClick={() => {handleSidebar(false)}}>
            <RiHomeFill />
            <span>Home</span>
          </NavLink>

          {/* Discover Categories */}
          <h3 className='mt-8 text-base 2xl:text-xl'>Discover categories</h3>

          {/* Categories */}
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink 
            to={`/category/${category.name}`}
            key={category.name}
            className={({isActive}) => (
              isActive ? activeStyle : normalStyle
            )}
            onClick={() => { handleSidebar(false) }}
            >
              {category.name}
            </NavLink>
          ))}

      </div>
      
      {user &&      
        <Link
        onClick={() => {handleSidebar(false)}}
        to={`/user-profile/${user?._id}`}
        >
          <div className='flex items-center gap-3 drop-shadow-xl mr-8 mb-3 hover:bg-gray-50'>
              <img src={user?.image}  referrerpolicy="no-referrer" className="rounded-full h-10 w-10"
                alt='user-profile'
              />
              <p>{user?.userName}</p>
              <IoIosArrowForward />
          </div>
        </Link>
 }

    </div>
  )
}

export default Sidebar
