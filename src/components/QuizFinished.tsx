import React from 'react'
import { Space, Typography, Button } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { formatTimerString } from '../utils'
import { QuestionAnswerPair } from '../pages/OngoingQuiz'

interface QuizFinishedProps {
  correctCounter: number
  totalTime: number
  numberOfQuestions: number
  resetQuiz: () => void
  questionAndAnswerPairs: QuestionAnswerPair[]
}

const QuizFinished = ({
  correctCounter,
  totalTime,
  numberOfQuestions,
  resetQuiz,
  questionAndAnswerPairs,
}: QuizFinishedProps): JSX.Element => (
  <>
    <Typography.Title level={2}>Quiz finished!</Typography.Title>
    <Space direction="vertical" align="center">
      <Typography.Text>
        Correct answers: {correctCounter}/{numberOfQuestions} ({Math.round((correctCounter / numberOfQuestions) * 100)}
        %)
      </Typography.Text>
      <Typography.Text>Total time: {formatTimerString(totalTime)}</Typography.Text>
      <Button type="primary" onClick={() => resetQuiz()}>
        Play this quiz again
      </Button>
      <Button type="primary">
        <Link to="/quiz/list">Go back to quiz list</Link>
      </Button>
    </Space>

    <Typography.Title level={3}>Quiz summary</Typography.Title>
    <Space direction="vertical" align="start">
      {questionAndAnswerPairs.map((it, ix) => {
        return (
          <Space direction="vertical" align="start" key={it.question}>
            <Typography.Text>{`${ix + 1}. ${it.question}`}</Typography.Text>
            <Space direction="horizontal">
              <>
                {it.userAnswerWasCorrect ? (
                  <CheckCircleFilled style={{ color: 'lightgreen' }} />
                ) : (
                  <CloseCircleFilled style={{ color: 'tomato' }} />
                )}
              </>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography.Text>Your answer: {it.answer || '-'}</Typography.Text>
                {!it.userAnswerWasCorrect && <Typography.Text>Correct answer: {it.correctAnswer}</Typography.Text>}
              </div>
            </Space>
          </Space>
        )
      })}
    </Space>
  </>
)

export default QuizFinished
