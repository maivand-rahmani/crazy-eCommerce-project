import React from 'react'
import { Sidebar } from '@/widgets/(admin)/sidebar'

const layout = ({ children }) => {
  return (
    <layout className="flex">
      <Sidebar />
      {children}
    </layout>
  )
}

export default layout