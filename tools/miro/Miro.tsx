import React from 'react'
import { AiOutlineApartment } from 'react-icons/ai'

function MiroView() {
  return (
    <div>
      <iframe
        src="https://miro.com/app/live-embed/o9J_lJUPo7Y=/?moveToViewport=217,-1095,3686,1766"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        width="100%"
        style={{ height: 'calc(100vh - 55px)' }}
      ></iframe>
    </div>
  )
}

export default {
  name: 'miro',
  title: 'Miro',
  component: MiroView,
  icon: AiOutlineApartment,
}
