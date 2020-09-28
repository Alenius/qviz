import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Input, Space, Spin, Typography } from 'antd'
import { Link, useHistory, useParams } from 'react-router-dom'

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
  const [fetchingAnswer, setFetchingAnswer] = useState(false)
  const isLastQuestion = currentQuestionIndex + 1 === questions.length

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
    setFetchingAnswer(true)
    const {
      rating = 0,
      correctAnswer,
      userAnswerWasCorrect,
      extraInfo,
    } = await checkAnswer(questionId, userAnswer)

    setCorrectAnswer(correctAnswer)
    setUserAnswerWasCorrect(userAnswerWasCorrect)
    setFetchingAnswer(false)
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

  if (!quizStarted) {
    return (
      <PageLayout headerTitle={quizName}>
        <QuizStart handleStartClick={handleStartClick} />
      </PageLayout>
    )
  }

  if (quizFinished) {
    return (
      <PageLayout headerTitle={quizName}>
        <QuizFinished
          correctCounter={correctCounter}
          totalTime={totalTime}
          numberOfQuestions={questions.length}
        />
      </PageLayout>
    )
  }

  if (questionAnswered) {
    return (
      <PageLayout headerTitle={quizName}>
        <Space direction='vertical' align='center'>
          <Typography.Text>
            Time: {formatTimerString(totalTime)}
          </Typography.Text>
          {fetchingAnswer ? (
            <Spin />
          ) : (
            <Space direction='vertical' align='center'>
              <CorrectedAnswer userAnswerWasCorrect={userAnswerWasCorrect} />
              <Typography.Text>Your answer: {userAnswer}</Typography.Text>
              <Typography.Text>Correct answer: {correctAnswer}</Typography.Text>
              {bonusText !== 'undefined' && ( // TODO: Fix this in the backend
                <Typography.Text>More info: {bonusText}</Typography.Text>
              )}
              <Button type='primary' onClick={() => goToNextQuestion()}>
                {isLastQuestion ? 'Finish quiz' : 'Next Question'}
              </Button>
            </Space>
          )}
        </Space>
      </PageLayout>
    )
  }
  return (
    <PageLayout headerTitle={quizName}>
      <Typography.Title level={5}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Typography.Title>
      <StyledForm onFinish={(values) => handleOnFinish(values)}>
        <Form.Item label='question'>
          <Typography.Text>{currentQuestionText}</Typography.Text>
        </Form.Item>
        <Form.Item label='answer' name='answer'>
          <Input type='text' title='answer' autoComplete='off' />
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
    </PageLayout>
  )
}

const QuizStart = ({ handleStartClick }) => (
  <Space direction='vertical' align='center'>
    <Typography.Text>
      When you feel ready, press the button below to start
    </Typography.Text>
    <Button
      type='primary'
      onClick={() => handleStartClick()}
      style={{ maxWidth: '100px' }}
    >
      Start quiz
    </Button>
  </Space>
)

const QuizFinished = ({ correctCounter, totalTime, numberOfQuestions }) => (
  <>
    <Typography.Title level={3}>Quiz finished!</Typography.Title>
    <Space direction='vertical' align='center'>
      <Typography.Text>
        Correct answers: {correctCounter}/{numberOfQuestions}
      </Typography.Text>
      <Typography.Text>
        Total time: {formatTimerString(totalTime)}
      </Typography.Text>
      <Button type='primary'>
        <Link to='quiz/list'>Go back to quiz list</Link>
      </Button>
    </Space>
  </>
)

const CorrectedAnswer = ({ userAnswerWasCorrect }) =>
  userAnswerWasCorrect ? (
    <Alert message='Correct!' type='success' showIcon />
  ) : (
    <Alert message='Wrong answer' type='error' showIcon />
  )
