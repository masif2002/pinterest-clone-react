import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { useParams, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { client } from '../client'
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data'
import MasonryLayout  from './MasonryLayout'

import Spinner from './Spinner'



const PinDetail = ({ user }) => {
  const { pinId } = useParams();

  const [pinDetail, setPinDetail] = useState(null)
  const [pins, setPins] = useState(null);
  const [comment, setComment] = useState('')

  const getPinDetail = () => {

    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  }

  const postComment = ({id}) => {
    if (comment) {

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ 
          comment,
          _key: uuidv4(),
          postedBy: { _type: 'postedBy', _ref: user._id } 
        }])
        .commit()
        .then(() => {
          getPinDetail();
          setComment('');
        });
    }

  }

  useEffect(() => {
    getPinDetail()    
  }, [pinId])
  

  return (
    <>
    {(!pinDetail ) ? (<Spinner message={"Fetching pin details ..."} /> ) : (
    <div className='flex flex-col m-auto mb-10' style={{maxWidth: '1500px', borderRadius: '32px'}}>

        {/* Image */}
        <div className='flex flex-initial justify-center items-center md:items-start'>
          <img className='rounded-t-3xl rounded-b-md'
          src={pinDetail?.image?.asset.url}
          alt='pin' />
        </div>

        {/* Download Button & Destination Link */}
        <div className='mt-6 flex justify-between mx-2'>
          <a href={`${pinDetail?.image?.asset.url}?dl=`}>
            <MdDownloadForOffline className='text-xl hover:text-gray-600'/>
          </a>
          <a href={pinDetail?.destination} target="_blank" rel='noreferrer'>
            <button className='bg-white op-75 hover:op-100 cursor-pointer hover:shadow-md rounded-xl p-2'>
              {pinDetail?.destination.slice(0,15)}...
             </button>
          </a>
        </div>

        {/* Title, About, User */}
        <div className='flex flex-row justify-between items-center m-2'>
          <div className='flex flex-col gap-3'>
            <p className='text-3xl font-bold'>{pinDetail?.title}</p>
            <p className='text-gray-700'>{pinDetail?.about}</p>
          </div>

          <Link to={`/user-profile/${pinDetail?.postedBy._id}`}>
            <div className='mt-2 p-2 flex items-center gap-4 border border-gray-300 rounded-xl hover:bg-gray-300 delay-75'>
              <img  src={pinDetail?.postedBy.image} className="h-8 w-8 rounded-full"
                referrerPolicy='no-referrer'
                alt='userprofile'
              />
              <p>{pinDetail?.postedBy?.userName}</p>
            </div>
          </Link>
        </div>

        {/* Comments */}
        <div className='m-2 flex flex-col'>
          <h3 className='text-xl font-bold border-t-2 pt-2 border-gray-300'>Comments</h3>

          <div className='mt-2 p-2 flex items-center gap-4 rounded-xl'>
              <img  src={user?.image} referrerPolicy='no-referrer' alt='user-profile'
              className="h-8 w-8 rounded-full"/>
              <input 
              type="text"
              placeholder='Enter Comment...'
              className='border border-gray-300 outline-none rounded-xl p-3 w-full'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              />
              <button type='button' className='bg-red-500 px-4 py-2 m-2 rounded-xl text-white text-sm  hover:bg-red-600 opacity-100 font-semibold hover:shadow-lg'
              onClick={postComment}>
                Submit
              </button>

          </div>
          <div className='max-h-370 overflow-y-scroll flex flex-col gap-2 mt-4 bg-white p-2 rounded-xl'>
            {pinDetail?.comments?.length > 0 ? pinDetail?.comments?.map((item, index) => (
                  <div className='m-2 flex gap-3 items-center'>
                    <img src={item.postedBy.image} className="h-9 w-9 rounded-full" alt='user-profile'/>
                    <div className='flex flex-col'>
                      <p className='font-semibold'>{item.postedBy.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>  )) : ''}
          </div>  
        </div>

        {/* More Pins */}
        {
          pins && 
          <div className='flex flex-col gap-5 items-center mt-5'>
            <h3 className='text-3xl font-semibold'>More Pins</h3>
            <MasonryLayout pins={pins}/>
          </div>
        
        }


        
        
    </div>

    )}

    </>
    )
}

export default PinDetail