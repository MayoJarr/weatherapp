import React from 'react'
import '../styles/Hour.css'

function Hour({hour, temp}) {
  return (
    <div className='hour'>
      <div>{hour}</div>
      <div>{temp}&#8451;</div> 
    </div>
  )
}

export default Hour