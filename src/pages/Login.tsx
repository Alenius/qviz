import React, { useEffect, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Form, Button, Typography, Input } from 'antd'
import { getApiURL } from 'utils'
import { AuthContext } from '../App'

const Text = Typography.Text

interface UserData {
  username: string
  password: string
  firstname: string
  lastname: string
}

export default function Login(): JSX.Element {
  const [userData, setUserData] = useState<UserData>({ username: '', password: '', firstname: '', lastname: '' })

  // const handleSubmit = async () => {
  //   const res = await login(userData.username, userData.password)
  //   console.log({ res })
  // }

  return (
    <AuthContext.Consumer>
      {({ user, login }) => (
        <PageLayout headerTitle="Login">
          <Text>Login {user.username}</Text>
          <Form onFinish={async () => login()}>
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
