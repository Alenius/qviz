import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Space } from 'antd'
import styled from 'styled-components'
import { PageLayout } from '../components/PageLayout'
import { WINDOW_SIZES } from '../constants'

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
      </Space>
    </PageLayout>
  )
}
