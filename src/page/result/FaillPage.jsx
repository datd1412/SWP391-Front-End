import { PlayCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import './FailPage.scss'

function FaillPage() {
  return (
    <div className='idk-xd'>
      <Button
        type="default"
        icon={<PlayCircleOutlined />}
        className="hover-button"
      >
        See How it Works
      </Button>
    </div>
  )
}

export default FaillPage