import React, { createContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Space } from 'antd'
import styled from 'styled-components'
import { PageLayout } from '../components/PageLayout'
import { WINDOW_SIZES } from '../constants'
import { AuthContext } from 'App'

const StyledSpace = styled(Space)`
  display: flex;
  @media (max-width: ${WINDOW_SIZES.sm}px) {
    flex-direction: column;
    align-items: center;
  }
`

const Title = styled(Typography.Title)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function Start(): JSX.Element {
  return (
    <AuthContext.Consumer>
      {({ logout }) => (
        <PageLayout disableHeaderTitle={true}>
          <Space direction="vertical">
            <Title>qviz</Title>
            <StyledSpace>
              <Typography.Text>Press this button to the quiz list</Typography.Text>
              <Button type="primary">
                <Link to="/quiz/list">Press here please</Link>
              </Button>
            </StyledSpace>
            <StyledSpace>
              <Typography.Text>Press this button to create a new quiz</Typography.Text>
              <Button type="primary">
                <Link to="/create-quiz">Create new</Link>
              </Button>
            </StyledSpace>
            <StyledSpace>
              <Typography.Text>Press this button to create a new user</Typography.Text>
              <Button type="primary">
                <Link to="/create-user">Create user</Link>
              </Button>
            </StyledSpace>
            <StyledSpace>
              <Typography.Text>Press this button to log in</Typography.Text>
              <Button type="primary">
                <Link to="/login">Login</Link>
              </Button>
            </StyledSpace>
            <StyledSpace>
              <Typography.Text>Press this button to log out</Typography.Text>
              <Button type="primary" onClick={logout}>
                <Typography.Text>Log out</Typography.Text>
              </Button>
            </StyledSpace>
          </Space>
        </PageLayout>
      )}
    </AuthContext.Consumer>
  )
}
