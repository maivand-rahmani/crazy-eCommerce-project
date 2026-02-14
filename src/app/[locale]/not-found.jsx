import React from 'react'
import { getTranslations } from 'next-intl/server'

const NotFound = async () => {
  const t = await getTranslations("notFound");
  return (
    <div>
        <h1 className='text-3xl font-bold text-center mt-20'>{t("title")}</h1>
    </div>
  )
}

export default NotFound