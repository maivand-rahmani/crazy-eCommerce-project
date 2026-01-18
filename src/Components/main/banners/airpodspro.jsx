import React from 'react'
import Image from 'next/image'

const Airpodspro = () => {
  return (
    <div className='p-3 w-full h-full flex flex-col md:flex-row center bg-3banner-bg'>
      <Image alt='Airpodspro ' priority width={136} height={190} className='realative ' src={"https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/hero__gnfk5g59t0qe_xlarge_2x%201%20(1).png"}></Image>
      <div className='p-4 flex flex-col gap-4'>
        <div className='font-extralight text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-black text-balance'>AirPods Pro <span className='font-bold'>Max</span></div>
        <p className='text-[clamp(0.75rem,1.5vw,1rem)] text-unactive-text'>Computational audio. Listen, it's powerful</p>
      </div>
    </div>
  )
}

export default Airpodspro