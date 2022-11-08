import {React, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'
 
const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)

  const {categoryId} = useParams()

  useEffect(() => {

    if (categoryId) {
      setLoading(true)
      client.fetch(searchQuery(categoryId))
      .then((pins) => {
        setPins(pins)
        setLoading(false)
      })
    } else {
      setLoading(true)
      client.fetch(feedQuery)
      .then((pins) => {
        setPins(pins)
        setLoading(false)
      })
    }

  }, [categoryId])
  

  if (loading) return <Spinner message="We are adding new items to your feed ..."/>

  return (
    <div>
      {pins?.length > 0 ? <MasonryLayout pins={pins} /> : (
        <p>No Pins Available</p>
      ) }
    </div>
  )
}

export default Feed