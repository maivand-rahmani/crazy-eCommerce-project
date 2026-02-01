import './loading.css'
import React from 'react'

const Loader = () => {
  return (
    <div className="loading-screen top-0 left-0 w-full z-[999] overflow-hidden">
        <div className="loader">
          <span><span /><span /><span /><span /></span>
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
        <div className="longfazers">
          <span /><span /><span /><span />
        </div>
    </div>
  )
}

export default Loader;