import Image from 'next/image'
import React from 'react'
import {getTranslations} from "next-intl/server"

const Applevisionpro = async () => {
  const t = await getTranslations('promotions.vision')

  return (
    <div className='p-3 w-full h-full flex flex-col bg-2banner-bg center md:flex-row '>
      <Image alt='Applevisionpro' priority width={190} height={250}  style={{ width: "auto", height: "auto" }}  src={"http://194.156.118.210/uploads/images/image%2036%20(1).png"}></Image>
      <div className='p-4 flex text-center flex-col gap-4 md:text-left'>
        <div className='font-extralight text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-white text-balance'>Apple Vision Pro</div>
        <p className='text-[clamp(0.75rem,1.5vw,1rem)] text-unactive-text'>{t("description")}</p>
      </div>
    
    </div>
  )
}

export default Applevisionpro