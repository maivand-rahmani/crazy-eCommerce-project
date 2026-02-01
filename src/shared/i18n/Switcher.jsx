import React from 'react'
import { useTranslation } from "react-i18next"
import styled from './Lang.module.scss'
const LangSwitcher = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const changeLang = (lang) => {
    i18n.changeLanguage(lang)
  }

 

  return (
    <div className={styled.SwitcherCon}> 
      <button onClick={() => {changeLang(currentLang === "en" ? "ru" : "en")}}>{currentLang}</button>
    </div>
  )
}

export default LangSwitcher