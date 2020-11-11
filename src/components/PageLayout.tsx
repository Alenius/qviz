import React from 'react'
import styled from 'styled-components'
import { Layout, PageHeader } from 'antd'
import { useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { WINDOW_SIZES_PX } from '../constants'

const BaseLayout = styled(Layout)`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
`
const Header = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`
const StyledLayout = styled(Layout)`
  display: flex;
  width: 50%;
  @media (max-width: ${WINDOW_SIZES_PX.xs}) {
    width: 95%;
  }
  @media (max-width: ${WINDOW_SIZES_PX.sm}) {
    width: 90%;
  }
  @media (max-width: ${WINDOW_SIZES_PX.md}) {
    width: 75%;
  }
`

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`

const Footer = styled.div``

interface Props {
  children: JSX.Element | JSX.Element[]
  headerTitle?: string
  headerSubtitle?: string
}

export const PageLayout = ({ children, headerTitle, headerSubtitle }: Props) => {
  const navHistory = useHistory()

  return (
    <BaseLayout style={{ minHeight: '100vh' }}>
      <StyledLayout>
        <Header>
          {headerTitle ? (
            <PageHeader
              title={headerTitle}
              subTitle={headerSubtitle}
              backIcon={<ArrowLeftOutlined color="white" />}
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
