import React from 'react'
import '../styles/Day.css'

function Day({dayName, degrees, icon}) {
  return (
    <div className='Day'>
      <div>{dayName}</div>
      <div>{degrees}&#8451;</div>
      <div className='icon'><img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/></div>
    </div>
  )
}

export default Day