import React, { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Form, Button, Typography, Input } from 'antd'
import { getApiURL } from 'utils'

const Text = Typography.Text

interface UserData {
  username: string
  password: string
  firstname: string
  lastname: string
}

const submitUser = async (username: string, password: string) => {
  const apiUrl = getApiURL()

  return fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
}

export default function Login(): JSX.Element {
  const [userData, setUserData] = useState<UserData>({ username: '', password: '', firstname: '', lastname: '' })

  const handleSubmit = async () => {
    await submitUser(userData.username, userData.password)
  }

  return (
    <PageLayout headerTitle="Login">
      <Text>Login</Text>
      <Form onFinish={handleSubmit}>
        <Form.Item label="username">
          <Input
            placeholder="your username here"
            onChange={(e) => setUserData({ ...userData, username: (e.target as HTMLInputElement).value })}
          />
        </Form.Item>

        <Form.Item label="password">
          <Input.Password
            placeholder="your name here"
            onChange={(e) => setUserData({ ...userData, password: (e.target as HTMLInputElement).value })}
          />
        </Form.Item>

        <Form.Item>
          <Button style={{ marginTop: '1rem' }} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  )
}
