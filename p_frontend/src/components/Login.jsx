import React from 'react'
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import wlogo from '../assets/logowhite.png'
import { GoogleLogin } from 'react-google-login'
import { FcGoogle } from 'react-icons/fc/index'
import { gapi } from "gapi-script"

import {client} from '../client'

const Login = () => {
  
  const navigate = useNavigate()

  window.gapi.load('client:auth2', () => { window.gapi.client.init({ clientId:`${process.env.GOOGLE_CLIENT_ID}`, plugin_name: "chat"})})

  const responseGoogle = (response) => {
    
    localStorage.setItem('user', JSON.stringify(response.profileObj))

    const {googleId, name, imageUrl} = response.profileObj;

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl
    }

    client.createIfNotExists(doc)
      .then( () => {
        navigate('/', {replace: true})
      })

  }

  return (
    <div className='h-screen'>
      <div className='h-full w-full relative'>
        <video 
          src={shareVideo}
          type='video/mp4'
          autoPlay
          muted
          controls={false}
          loop
          className='w-full h-full object-cover'
        >
        </video>
        <div className='flex flex-col bg-blackOverlay absolute top-0 right-0 bottom-0 left-0 justify-center items-center'>
          <div className='p-5'>
            <img 
              src={wlogo}
              width="130px"
              alt='logo'
            />
          </div>
          <div className='shadow-2xl'>
            
            <GoogleLogin 
              clientId='YOUR_GOOGLE_CLIENT_ID'
              render={(renderProps) => (
                <button 
                type='button'
                className='bg-mainColor flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                >
                  <FcGoogle className='mr-4'/> Sign in with Google
                </button>
              )}
              
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
          
        </div>
      </div>
    </div>
    
  )
}

export default Login

// window.gapi.load('client:auth2', () => { window.gapi.client.init({ clientId: ${process.env.REACT_APP_GOOGLE_API_TOKEN}, plugin_name: "chat" })})