import React from 'react'
import '../styles/Day.css'

function Day({dayName, degrees}) {
  return (
    <div className='Day'>
      <div>{dayName}</div>
      <div>{degrees}&#8451;</div>
    </div>
  )
}

export default Day