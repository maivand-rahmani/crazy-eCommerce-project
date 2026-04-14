import Image from 'next/image'
import React from 'react'
import {getTranslations} from "next-intl/server"

const Applevisionpro = async () => {
  const t = await getTranslations('promotions.vision')

  return (
    <div className='p-3 w-full h-full flex flex-col bg-banner-4 center md:flex-row '>
      <img alt='Applevisionpro' width={190} height={250}  style={{ width: "auto", height: "auto" }}  src={"/bannersImages/image2036201.webp"}></img>
      <div className='p-4 flex text-center flex-col gap-4 md:text-left'>
        <div className='font-extralight text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-banner-white text-balance'>{t("title")}</div>
        <p className='text-[clamp(0.75rem,1.5vw,1rem)] text-unactive-text'>{t("description")}</p>
      </div>
    
    </div>
  )
}

export default Applevisionpro