import React from 'react'
import styled from 'styled-components'
import { Layout, Space } from 'antd'

const Header = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`
const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Footer = styled.div``

export const PageLayout = (props) => {
  return (
    <Layout>
      <Header></Header>
      <Layout>
        <Content>{props.children}</Content>
      </Layout>
      <Footer />
    </Layout>
  )
}
