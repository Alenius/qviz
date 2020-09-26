import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Input, Space, Typography } from 'antd'
import { Link, useParams } from 'react-router-dom'

import { PageLayout } from '../components/PageLayout'
import { formatTimerString, getApiURL } from '../utils'
import { useTimer } from '../hooks/useTimer'

const StyledForm = styled(Form)`
  max-width: 800px;
`

const apiURL = getApiURL()

const getQuestions = async (quizId) => {
  const res = await fetch(`${apiURL}/questions?quizId=${quizId}`)
  const { questions, quizName } = await res.json()
  return { questions, quizName }
}

const checkAnswer = async (questionId, userAnswer) => {
  const res = await fetch(
    `${apiURL}/answer?questionId=${questionId}&userAnswer=${userAnswer}`
  )
  return res.json()
}

export const OngoingQuiz = () => {
  let { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [quizName, setQuizName] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState()
  const [currentQuestionText, setCurrentQuestionText] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionAnswered, setQuestionAnswered] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [userAnswerWasCorrect, setUserAnswerWasCorrect] = useState(false)
  const [correctCounter, setCorrectCounter] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [bonusText, setBonusText] = useState('')
  const [timerValue, startTimer, stopTimer] = useTimer()
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    const getQuestionsAsync = async () => {
      const { questions: fetchedQuestions, quizName } = await getQuestions(id)
      setQuestions(fetchedQuestions)
      setQuizName(quizName)
    }

    getQuestionsAsync()
  }, [])

  useEffect(() => {
    if (currentQuestionIndex !== undefined) {
      setCurrentQuestionText(questions[currentQuestionIndex].question_text)
    }
  }, [currentQuestionIndex, questions])

  useEffect(() => {
    setTotalTime(totalTime + timerValue)
    // eslint-disable-next-line
  }, [timerValue])

  const fetchAnswer = async (questionId, userAnswer) => {
    const {
      rating = 0,
      correctAnswer,
      userAnswerWasCorrect,
      extraInfo,
    } = await checkAnswer(questionId, userAnswer)

    setCorrectAnswer(correctAnswer)
    setUserAnswerWasCorrect(userAnswerWasCorrect)
    extraInfo && setBonusText(extraInfo)
    userAnswerWasCorrect && setCorrectCounter(correctCounter + 1)
  }

  const handleStartClick = () => {
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    startTimer()
  }

  const handleOnFinish = async (values) => {
    const { answer } = values
    setUserAnswer(answer)
    setQuestionAnswered(true)
    stopTimer()
    const questionId = questions[currentQuestionIndex].id
    await fetchAnswer(questionId, answer)
  }

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      setQuizFinished(true)
    } else {
      setQuestionAnswered(false)
      setUserAnswer('')
      setCurrentQuestionIndex(nextIndex)
      startTimer()
    }
  }
  return (
    <PageLayout headerTitle={quizName}>
      {quizStarted ? (
        quizFinished ? (
          <>
            <Typography.Title level={2}>Quiz finished!</Typography.Title>
            <Space direction='vertical' align='center'>
              <Typography.Text>
                Correct answers: {correctCounter}
              </Typography.Text>
              <Typography.Text>
                Total time: {formatTimerString(totalTime)}
              </Typography.Text>
              <Button type='primary'>
                <Link to='quiz/list'>Go back to quiz list</Link>
              </Button>
            </Space>
          </>
        ) : questionAnswered ? (
          <Space direction='vertical' align='center'>
            <Typography.Text>
              Time: {formatTimerString(totalTime)}
            </Typography.Text>
            {userAnswerWasCorrect ? (
              <Alert message='Correct!' type='success' showIcon />
            ) : (
              <Alert message='Wrong answer' type='error' showIcon />
            )}
            <Typography.Text>Your answer: {userAnswer}</Typography.Text>
            <Typography.Text>Correct answer: {correctAnswer}</Typography.Text>
            {bonusText !== 'undefined' && ( // TODO: Fix this in the backend
              <Typography.Text>More info: {bonusText}</Typography.Text>
            )}
            <Button type='primary' onClick={() => goToNextQuestion()}>
              Next Question
            </Button>
          </Space>
        ) : (
          <StyledForm onFinish={(values) => handleOnFinish(values)}>
            <Form.Item label='question'>
              <Typography.Text>{currentQuestionText}</Typography.Text>
            </Form.Item>
            <Form.Item label='answer' name='answer'>
              <Input type='text' title='answer' />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                onChange={(e) => console.log({ e })}
              >
                Send answer
              </Button>
            </Form.Item>
          </StyledForm>
        )
      ) : (
        <Button
          type='primary'
          onClick={() => handleStartClick()}
          style={{ maxWidth: '100px' }}
        >
          Start quiz
        </Button>
      )}
    </PageLayout>
  )
}
