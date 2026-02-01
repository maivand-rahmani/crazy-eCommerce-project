import React from 'react'
import Iphone from './Iphone17'
import Macbook from "./macbook"
import Airpodspro from './airpodspro'
import Playstation5 from './playstation5'
import Applevisionpro from './applevisionpro'


const main = () => {
  return (
    <div className='flex flex-col md:grid md:grid-cols-4  '>
        <div className=' col-span-4 row-span-2'><Iphone /></div>
        <div className=' col-span-2'><Playstation5 /></div>
        <div className=' col-span-2 row-span-2'><Macbook /></div>
        {/* <div><Airpodspro /></div> */}
        <div className=' col-span-2'><Applevisionpro /></div>
    </div>
  )
}

export default main