import React from 'react'
import { changeLanguage , } from "i18next"
import {  } from "next-intl"

const LangSwitcher = () => {

  const changeLang = (lang) => {
    changeLanguage(lang)
  }

 

  return (
    <div className="flex gap-3"> 
      <button onClick={() => {changeLang(currentLang === "en" ? "ru" : "en")}}>{currentLang}</button>
    </div>
  )
}

export default LangSwitcher