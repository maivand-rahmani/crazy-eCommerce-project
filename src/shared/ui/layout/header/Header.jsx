"use client"
import React , {useRef , useEffect} from 'react'
import DesktopHeader from './desktop/DesktopHeader'
import MobileHeader from './mobile/MobileHeader'

const Header = () => {
  return (
    <>
        <DesktopHeader/>
        <MobileHeader/>
    </>
  )
}

export default Header

 