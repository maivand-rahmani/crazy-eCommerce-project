import React from 'react'
import Image from 'next/image'
import { getTranslations } from "next-intl/server";

const Airpodspro = async () => {
  const t = await getTranslations("homeBanners.airpods");
  return (
    <div className='p-3 w-full h-full flex flex-col md:flex-row center bg-3banner-bg'>
      <img alt='Airpodspro' width={136} height={190} className='realative ' src={"/bannersImages/hero__gnfk5g59t0qe_xlarge_2x%201%20(1).png"}></img>
      <div className='p-4 flex flex-col gap-4'>
        <div className='font-extralight text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-black text-balance'>{t("title")} <span className='font-bold'>{t("subtitle")}</span></div>
        <p className='text-[clamp(0.75rem,1.5vw,1rem)] text-unactive-text'>{t("description")}</p>
      </div>
    </div>
  )
}

export default Airpodspro