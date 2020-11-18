import React from 'react'
import { Space, Typography, Button } from 'antd'

interface QuizStartProps {
  handleStartClick: () => void
}

const QuizStart = ({ handleStartClick }: QuizStartProps): JSX.Element => (
  <Space direction="vertical" align="center">
    <Typography.Text>When you feel ready, press the button below to start</Typography.Text>
    <Button type="primary" onClick={() => handleStartClick()} style={{ maxWidth: '100px' }}>
      Start quiz
    </Button>
  </Space>
)

export default QuizStart
