import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Layout, Space } from 'antd'
import styled from 'styled-components'
import { PageLayout } from '../components/PageLayout'

export default function Start() {
  return (
    <PageLayout>
      <Space direction='vertical' align='center'>
        <Typography.Title>qvis</Typography.Title>
        <Space>
          <Typography.Text>Press this button to the quiz list</Typography.Text>
          <Button type='primary'>
            <Link to='/quiz/list'>Press here please</Link>
          </Button>
        </Space>
      </Space>
    </PageLayout>
  )
}
