import React, { useEffect, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Form, Button, Typography, Input } from 'antd'
import { getApiURL } from 'utils'
import { AuthContext, LoginFn, Auth } from '../App'
import jwt from 'jsonwebtoken'

const Text = Typography.Text

interface UserData {
  username: string
  password: string
  firstname: string
  lastname: string
}

const callLogin = async (username: string, password: string) => {
  const apiUrl = getApiURL()
  const res = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  return res.json()
}

export default function Login() {
  const [userData, setUserData] = useState<UserData>({ username: '', password: '', firstname: '', lastname: '' })

  const handleSubmit = async (loginFn: LoginFn) => {
    const res = await callLogin(userData.username, userData.password)
    const { username, userId, isAdmin } = jwt.decode(res.token) as {
      username: string
      userId: string
      isAdmin: boolean
    }
    const auth: Auth = { username, userId, isAdmin, rawToken: res.token }
    loginFn(auth)
  }

  return (
    <AuthContext.Consumer>
      {({ auth, login }) => (
        <PageLayout headerTitle="Login">
          <Text>Login {auth.username}</Text>
          <Form onFinish={async () => handleSubmit(login)}>
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
      )}
    </AuthContext.Consumer>
  )
}
