import React, { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Form, Button, Typography } from 'antd'

const Text = Typography.Text

interface UserData {
  username: string
  password: string
  firstname: string
  lastname: string
}

export default function CreateUser(): JSX.Element {
  const [userData, setUserData] = useState({})

  return (
    <PageLayout headerTitle="Create user">
      <Text>Create user here please</Text>
      <Form.Item></Form.Item>
      <Form.Item>
        <Button style={{ marginTop: '1rem' }} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </PageLayout>
  )
}
