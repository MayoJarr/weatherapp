import React from 'react'
import '../styles/Hour.css'

function Hour({hour, temp, icon}) {
  return (
    <div className='hour'>
      <div>{hour}</div>
      <div>{temp}&#8451;</div> 
      <div className='icon'><img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/></div>
    </div>
  )
}

export default Hour