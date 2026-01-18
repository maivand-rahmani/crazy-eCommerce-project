import React from 'react'
import CartProductsList from './pages/CartProductsList';

const page = () => {
  return (
    <div className='py-10 px-2 md:p-20 grid md:grid-cols-[2fr_1fr]'>
      <CartProductsList />
      <div></div>
    </div>
  )
}

export default page