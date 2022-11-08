import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'

const Navbar = ({user, searchTerm, setSearchTerm}) => {
  
  const navigate = useNavigate()

  if(user) {
    return (
      <div className='flex my-5 items-center justify-center gap-5 '>
        <div className='flex p-4 items-center rounded-lg drop-shadow-sm focus-within:shadow-lg gap-3 bg-white w-4/5'>
          <IoMdSearch 
            className='text-xl'
          />
          <input 
            type="text"
            placeholder='Search...'
            value={searchTerm}
            className="border-none outline-none"
            onFocus={() => navigate('/search')}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
          />
        </div>
        
        <div className='gap-3 flex text-xl'>
        <Link to={`/create-pin`}>
          <IoMdAdd className='bg-black text-white w-9 p-1 h-9 rounded-md cursor-pointer flex justify-center items-center'/>
        </Link>
        <Link to={`/user-profile/${user?._id}`} >
          <img src={user?.image} alt='user' referrerpolicy="no-referrer"  className='h-9 w-9 rounded-md cursor-pointer'/>
        </Link>
        </div>
       
      </div>
    )
  }
  
}

export default Navbar