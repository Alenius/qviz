import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

export default function Start() {
  return (
    <div>
      <Button type='primary'>
        <Link to='/quiz/list'>Press here please</Link>
      </Button>
    </div>
  )
}
