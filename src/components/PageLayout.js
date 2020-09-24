import React from 'react'
import styled from 'styled-components'
import { Layout, PageHeader, Space } from 'antd'
import { useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

const BaseLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  align-items: center;
`
const Header = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`
const StyledLayout = styled(Layout)`
  width: 80%;
`
const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 600px) {
    width: 90%;
    align-items: center;
  }
`

const Footer = styled.div``

export const PageLayout = ({ children, headerTitle, headerSubtitle }) => {
  const navHistory = useHistory()

  return (
    <BaseLayout style={{ minHeight: '100vh' }}>
      <StyledLayout>
        <Header>
          {headerTitle ? (
            <PageHeader
              title={headerTitle}
              subTitle={headerSubtitle}
              backIcon={<ArrowLeftOutlined color='white' />}
              onBack={() => navHistory.goBack()}
            />
          ) : null}
        </Header>
        <Content>{children}</Content>
      </StyledLayout>
      <Footer />
    </BaseLayout>
  )
}
