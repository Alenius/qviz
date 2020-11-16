import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Input, Space, Spin, Typography } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'

import { PageLayout } from '../components/PageLayout'
import { camelizeKeys, formatTimerString, getApiURL } from '../utils'
import { useTimer } from '../hooks/useTimer'
import { Question, Answer, UnformattedQuestion } from 'typings'

const StyledForm = styled(Form)`
  max-width: 800px;
`

const apiURL = getApiURL()

const getQuestions = async (quizId: string): Promise<{ questions: Question[]; quizName: string }> => {
  const res = await fetch(`${apiURL}/questions?quizId=${quizId}`)
  const { questions: unformattedQuestions, quizName } = await res.json()
  const formattedQuestions = camelizeKeys<UnformattedQuestion, Question>(unformattedQuestions)
  return { questions: formattedQuestions, quizName }
}

const checkAnswer = async (questionId: string, userAnswer: string): Promise<Answer> => {
  const res = await fetch(`${apiURL}/answer?questionId=${questionId}&userAnswer=${userAnswer}`)
  return res.json()
}

interface QuestionAnswerPair {
  question: string
  answer: string
  correctAnswer: string
  userAnswerWasCorrect: boolean
}

export const OngoingQuiz = (): JSX.Element => {
  const { id }: { id: string } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizName, setQuizName] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
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
  const [questionAndAnswerPairs, setQuestionAndAnswerPairs] = useState<QuestionAnswerPair[]>([])
  const isLastQuestion = currentQuestionIndex + 1 === questions.length
  const inputFieldRef = useRef<Input>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const getQuestionsAsync = async () => {
      const { questions: fetchedQuestions, quizName } = await getQuestions(id)
      setQuestions(fetchedQuestions)
      setQuizName(quizName)
    }

    getQuestionsAsync()
  }, [])

  useEffect(() => {
    if (currentQuestionIndex !== undefined && questions.length) {
      setCurrentQuestionText(questions[currentQuestionIndex].questionText)
      inputFieldRef?.current?.focus()
    }
  }, [currentQuestionIndex, questions])

  useEffect(() => {
    setTotalTime(totalTime + timerValue)
    // eslint-disable-next-line
  }, [timerValue])

  const fetchAnswer = async (questionId: string, userAnswer: string) => {
    setFetchingAnswer(true)
    const { correctAnswer, userAnswerWasCorrect, extraInfo } = await checkAnswer(questionId, userAnswer)

    setCorrectAnswer(correctAnswer)
    setUserAnswerWasCorrect(userAnswerWasCorrect)
    setFetchingAnswer(false)
    extraInfo && setBonusText(extraInfo)
    userAnswerWasCorrect && setCorrectCounter(correctCounter + 1)
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setQuestionAnswered(false)
    setQuizStarted(true)
    setQuizFinished(false)
    setTotalTime(0)
    setCorrectCounter(0)
  }

  const handleStartClick = () => {
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    startTimer()
  }

  interface OnFinishProps {
    answer: string
  }

  const handleOnFinish = async (values: OnFinishProps) => {
    const { answer } = values
    setUserAnswer(answer)
    setQuestionAnswered(true)
    stopTimer()
    const questionId = questions[currentQuestionIndex].id
    await fetchAnswer(questionId, answer)
    nextButtonRef?.current?.focus()
  }

  const goToNextQuestion = () => {
    setQuestionAndAnswerPairs([
      ...questionAndAnswerPairs,
      {
        question: currentQuestionText,
        answer: userAnswer,
        correctAnswer,
        userAnswerWasCorrect,
      },
    ])
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
          resetQuiz={resetQuiz}
          questionAndAnswerPairs={questionAndAnswerPairs}
        />
      </PageLayout>
    )
  }

  if (questionAnswered) {
    return (
      <PageLayout headerTitle={quizName}>
        <Space direction="vertical" align="center">
          <Typography.Text>Time: {formatTimerString(totalTime)}</Typography.Text>
          {fetchingAnswer ? (
            <Spin />
          ) : (
            <Space direction="vertical" align="center">
              <CorrectedAnswer userAnswerWasCorrect={userAnswerWasCorrect} />
              <Typography.Text>Your answer: {userAnswer}</Typography.Text>
              <Typography.Text>Correct answer: {correctAnswer}</Typography.Text>
              {bonusText !== 'undefined' && (
                <Typography.Text>
                  More info:{' '}
                  {
                    bonusText // TODO: Fix this in the backend
                  }
                </Typography.Text>
              )}
              <Button type="primary" onClick={() => goToNextQuestion()} ref={nextButtonRef}>
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
      <StyledForm onFinish={(values) => handleOnFinish(values as OnFinishProps)}>
        <Form.Item label="question">
          <Typography.Text>{currentQuestionText}</Typography.Text>
        </Form.Item>
        <Form.Item label="answer" name="answer">
          <Input type="text" title="answer" autoComplete="off" ref={inputFieldRef} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onChange={(e) => console.log({ e })}>
            Send answer
          </Button>
        </Form.Item>
      </StyledForm>
    </PageLayout>
  )
}

interface QuizStartProps {
  handleStartClick: () => void
}

const QuizStart = ({ handleStartClick }: QuizStartProps) => (
  <Space direction="vertical" align="center">
    <Typography.Text>When you feel ready, press the button below to start</Typography.Text>
    <Button type="primary" onClick={() => handleStartClick()} style={{ maxWidth: '100px' }}>
      Start quiz
    </Button>
  </Space>
)

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
}: QuizFinishedProps) => (
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

interface CorrectedAnswerProps {
  userAnswerWasCorrect: boolean
}

const CorrectedAnswer = ({ userAnswerWasCorrect }: CorrectedAnswerProps) =>
  userAnswerWasCorrect ? (
    <Alert message="Correct!" type="success" showIcon />
  ) : (
    <Alert message="Wrong answer" type="error" showIcon />
  )
