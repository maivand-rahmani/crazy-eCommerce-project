'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from "next-intl";

const ResponsibleBanner = ({ img , name , des , link = undefined , bgColor , className }) => {
  const t = useTranslations("banner");
  return (
    <div style={{ backgroundColor: bgColor}} className={`${className}   p-8 md:flex center flex-col w-full min-w-90 h-140 md:h-160 bg-[${bgColor}]`}>
        <Image  alt={name} src={img} width={360} height={360} />
        <div className='flex flex-col gap-4' >
            <div className='text-3xl font-extralight'>{name}</div>
            <div className='text-unactive-text line-clamp-3'>{des}</div>
            <Link href={link} className='btn flex center text-black font-bold border'>{t("shopNow")}</Link>
        </div>
    </div>
  )
}

export default ResponsibleBanner