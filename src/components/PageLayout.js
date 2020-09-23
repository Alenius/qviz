import React from 'react'
import styled from 'styled-components'
import { Layout, Space } from 'antd'

const Header = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`
const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
`
const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`

const Footer = styled.div``

export const PageLayout = (props) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header></Header>
      <StyledLayout>
        <Content>{props.children}</Content>
      </StyledLayout>
      <Footer />
    </Layout>
  )
}
