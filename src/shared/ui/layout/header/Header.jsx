"use client"
import React , {useRef , useEffect} from 'react'
import DesktopHeader from './desktop/DesktopHeader'
import MobileHeader from './mobile/MobileHeader'
import { initUser } from '@/features/auth/model/initUser';

const Header = () => {
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initUser();
  }, []);

  return (
    <>
        <DesktopHeader/>
        <MobileHeader/>
    </>
  )
}

export default Header

 