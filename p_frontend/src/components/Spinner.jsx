import React from 'react'
import {ThreeCircles} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center gap-3 w-ful h-full'>
      <ThreeCircles
        height="50"
        width="200"
        color="#00BFFF"
        visible={true}
        className="m-5"
      />
      <p className='text-gray-700'>{message}</p>
    </div>
  )
}

export default Spinner