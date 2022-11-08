import {React, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client'

import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'

const Pin = ({ pin }) => {
  const [hoverState, sethoverState] = useState(false)
  const [saving, setsaving] = useState(false)

  const navigate = useNavigate()

  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId)

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setsaving(true)
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId,
          },
        }])
        .commit()
        .then(() => {
          setsaving(false)
          window.location.reload();
        });
    } else {
        setsaving(true)
        client
          .patch(id)
          .unset([`save[userId=="${user?.googleId}"]`])
          .commit()
          .then(() => {
            setsaving(false)
            window.location.reload();
          });
    }
  };

  const deletePin = (id) => {
    client
      .delete(id)
      .then((response) => {
        window.location.reload();
      });
  };


  return (
    <div className='flex flex-col '>
      <div className='relative m-2  cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
    onMouseEnter={() => {sethoverState(true)}}
    onMouseLeave={() => {sethoverState(false)}}
    onClick={() => {
      navigate(`/pin-detail/${pin?._id}`)
    }}>
      <img 
      className='rounded-lg w-full ' 
      src={urlFor(pin?.image).width(250).url()} 
      alt='pin'>
      </img>

      {hoverState &&
        <div>
          <a href={`${pin?.image?.asset?.url}?dl=`} onClick = {(e) => {e.stopPropagation()}}>
            <button type='button' className='absolute top-0 left-0 m-2 bg-white rounded-full h-8 w-8 flex items-center justify-center opacity-70 hover:opacity-100'
            onClick = {(e) => {e.stopPropagation()}}
            >
              <MdDownloadForOffline className='text-xl' />
            </button>
          </a>
          
          {alreadySaved?.length !== 0 ? (
            <button type="button" className="absolute top-0 right-0 bg-red-500 px-4 py-1 m-2 rounded-xl text-white text-sm font-light hover:bg-red-600 opacity-100 hover:font-semibold
          "
          onClick={(e) => {
                e.stopPropagation();
              }}>
              {pin?.save?.length}  Saved
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                savePin(pin?._id);
              }}
              type="button"
              className="absolute top-0 right-0 bg-red-500 px-4 py-1 m-2 rounded-xl text-white text-sm font-light hover:bg-red-600 opacity-100 hover:font-semibold"
            >
              {pin?.save?.length}   {saving ? '...' : 'Save'}
            </button>
          )}

          <a href={pin?.destination} target="_blank" rel='noreferrer'>
            <button type='button' className='absolute bottom-0 left-0 bg-white h-8 gap-3 p-3 m-2 rounded-xl text-sm font-light opacity-70 hover:opacity-100 flex justify-center items-center' onClick={(e) => {
              e.stopPropagation()
            }}>
              <BsFillArrowUpRightCircleFill />
              
                {pin?.destination.slice(0, 16)}...

            </button>  
          </a>


          {(user?.googleId === pin?.postedBy?._id) && 
           (
            <button type='button' className='absolute bottom-0 right-0 m-2 bg-white rounded-full h-8 w-8 flex items-center justify-center opacity-70 hover:opacity-100'
            onClick={(e) => {
              e.stopPropagation()
              deletePin(pin?._id)
            }}>
            <AiTwotoneDelete className='text-xl' />
          </button>
           )}
          

        </div>
      }
      

    </div>
    <div>
    <Link to={`/user-profile/${pin?.postedBy?._id}`} className="flex gap-2 m-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={pin?.postedBy?.image}
          alt="user-profile"
          referrerpolicy='no-referrer'
        />
        <p className="font-semibold capitalize">{pin?.postedBy?.userName}</p>
      </Link>
    </div>
    </div>
  )
}

export default Pin