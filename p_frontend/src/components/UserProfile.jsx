import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import {client} from '../client'
import Spinner from './Spinner'
import MasonryLayout from './MasonryLayout'
import { AiOutlineLogout } from 'react-icons/ai'

import { GoogleLogout } from 'react-google-login';
import { userCreatedPinsQuery, userSavedPinsQuery, userQuery } from '../utils/data'

const UserProfile = () => {

  const [pins, setPins] = useState(null)
  const [user, setUser] = useState(null)
  const [activeBtn, setActiveBtn] = useState('created')
  const [gettingPins, setGettingPins] = useState(false)

  const {userId} = useParams()
  
  const navigate = useNavigate()

  const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"

  const activeBtnStyle = 'bg-red-500 px-3 py-2 rounded-3xl text-white font-semibold'
  const regularBtnStyle = 'font-semibold'

  const getCreatedPins = () => {
    setGettingPins(true)
    const query = userCreatedPinsQuery(userId)
    client.fetch(query)
      .then((data) => {
        setPins(data)
        setGettingPins(false)
      })
  }

  const getSavedPins = () => {
    setGettingPins(true)
    const query = userSavedPinsQuery(userId)
    client.fetch(query)
      .then((data) => {
        setPins(data)
        setGettingPins(false)
      })
  }

  const getUser = (id) => {
    const query = userQuery(userId)
    client.fetch(query)
      .then((data) => setUser(data[0]))
  }

  const Logout = () => {
    localStorage.clear()

    navigate('/login')
  }

  useEffect(() => {
    getUser(userId)
  }, [userId])

  useEffect(() => {
    if (activeBtn === 'created') {
      getCreatedPins()
    } else {
      getSavedPins()
    }
    
  }, [activeBtn])
  
  

  return (
    <div className='relative flex flex-col items-center justify-center'>

      {/* Banner */}
      <img 
        src={randomImage}
        className='w-full h-370 2xl:h-510 object-cover shadow-lg'
        alt='banner'
      />
{/* onClick={() => Logout} */}
        <GoogleLogout
          clientId='584807037433-tsbjg555m5i44l43ek6gnidj321f4fkm.apps.googleusercontent.com'
          render={(renderProps) => (
            <button 
            type='button'
            className='bg-mainColor flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer'
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            >
              <AiOutlineLogout className='absolute top-3 right-3 z-50 text-3xl bg-white rounded-full cursor-pointer p-1.5 text-red-500'/>
            </button>
          )}
          
          onLogoutSuccess={Logout}
          cookiePolicy="single_host_origin"
        />
     
      
      {/* User Profile Image */}
        <img 
          src={user?.image}
          className='rounded-full h-20 w-20 -mt-10 shadow-xl'
          alt="user"
        />
      
      {/* User Name */}
      <h1 className='mt-2 text-3xl font-bold'>{user?.userName}</h1>

      {/* Buttons */}
      <div className='flex flex-row mt-5 gap-5'>
        <button
        className={activeBtn === "created" ? activeBtnStyle : regularBtnStyle}
        onClick={() => {setActiveBtn('created')}}>
          Created
        </button>
        <button
        className={activeBtn === "saved" ? activeBtnStyle : regularBtnStyle}
        onClick={() => {setActiveBtn('saved')}}>
          Saved
        </button>
      </div>

      {/* Loading ... */}
      {gettingPins && 
      <div className='m-2'>
        <Spinner message="Loading Pins ..." />
      </div>}

      {/* Pins */}
      <div className='my-10'>
        {pins?.length > 0 ? <MasonryLayout pins={pins}/> : <h1>
          No Pins Found!
        </h1>}
      </div>

    </div>
  )
}

export default UserProfile