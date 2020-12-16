import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Input, Space, Spin, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import { PageLayout } from '../components/PageLayout'
import { camelizeKeys, formatTimerString, getApiURL } from '../utils'
import { useTimer } from '../hooks/useTimer'
import { Question, Answer, UnformattedQuestion } from 'typings'
import QuizStart from 'components/QuizStart'
import QuizFinished from 'components/QuizFinished'

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  max-width: 500px;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

export interface QuestionAnswerPair {
  question: string
  answer: string
  correctAnswer: string
  userAnswerWasCorrect: boolean
}

interface AnswerEntity {
  correctAnswer: string
  userAnswerWasCorrect: boolean
  bonusText: string
}

const initialAnswerEntity: AnswerEntity = {
  correctAnswer: '',
  userAnswerWasCorrect: false,
  bonusText: '',
}

type QuizState = 'NotStarted' | 'Answering' | 'Reviewing' | 'Finished'

export const OngoingQuiz = (): JSX.Element => {
  const { id }: { id: string } = useParams()
  const [quizState, setQuizState] = useState<QuizState>('NotStarted')
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizName, setQuizName] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [currentQuestionText, setCurrentQuestionText] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [correctCounter, setCorrectCounter] = useState(0)
  const [answerEntity, setAnswerEntity] = useState<AnswerEntity>(initialAnswerEntity)
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
  }, [id])

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
    setAnswerEntity({ correctAnswer, userAnswerWasCorrect, bonusText: extraInfo === 'undefined' ? '' : extraInfo })
    setFetchingAnswer(false)
    userAnswerWasCorrect && setCorrectCounter(correctCounter + 1)
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setTotalTime(0)
    setCorrectCounter(0)
    setQuizState('NotStarted')
  }

  const handleStartClick = () => {
    setQuizState('Answering')
    setCurrentQuestionIndex(0)
    startTimer()
  }

  interface OnAnswerProps {
    answer: string
  }

  const handleOnAnswer = async (values: OnAnswerProps) => {
    setQuizState('Reviewing')
    const { answer } = values
    setUserAnswer(answer)
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
        correctAnswer: answerEntity.correctAnswer,
        userAnswerWasCorrect: answerEntity.userAnswerWasCorrect,
      },
    ])
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      setQuizState('Finished')
    } else {
      setQuizState('Answering')
      setUserAnswer('')
      setCurrentQuestionIndex(nextIndex)
      startTimer()
    }
  }

  if (quizState === 'NotStarted') {
    return (
      <PageLayout headerTitle={quizName}>
        <QuizStart handleStartClick={handleStartClick} />
      </PageLayout>
    )
  }

  if (quizState === 'Finished') {
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

  if (quizState === 'Reviewing') {
    return (
      <PageLayout headerTitle={quizName}>
        <Space direction="vertical" align="center">
          <Typography.Text>Time: {formatTimerString(totalTime)}</Typography.Text>
          {fetchingAnswer ? (
            <Spin />
          ) : (
            <Space direction="vertical" align="center">
              <CorrectedAnswer userAnswerWasCorrect={answerEntity.userAnswerWasCorrect} />
              <Typography.Text>Your answer: {userAnswer}</Typography.Text>
              <Typography.Text>Correct answer: {answerEntity.correctAnswer}</Typography.Text>
              {answerEntity.bonusText && (
                <Typography.Text>
                  More info:
                  {
                    answerEntity.bonusText // TODO: Fix this in the backend
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

  if (quizState === 'Answering') {
    return (
      <PageLayout headerTitle={quizName}>
        <Typography.Title level={5}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography.Title>
        <StyledForm onFinish={(values) => handleOnAnswer(values as OnAnswerProps)}>
          <Form.Item label="question">
            <Typography.Text>{currentQuestionText}</Typography.Text>
          </Form.Item>
          <Form.Item label="answer" name="answer">
            <Input
              type="text"
              title="answer"
              autoComplete="off"
              ref={inputFieldRef}
              style={{ fontSizeAdjust: 'none' }}
            />
          </Form.Item>
          <ButtonWrapper>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send answer
              </Button>
            </Form.Item>
          </ButtonWrapper>
        </StyledForm>
      </PageLayout>
    )
  }

  return <Spin />
}

interface CorrectedAnswerProps {
  userAnswerWasCorrect: boolean
}

const CorrectedAnswer = ({ userAnswerWasCorrect }: CorrectedAnswerProps) =>
  userAnswerWasCorrect ? (
    <Alert message="Correct!" type="success" showIcon />
  ) : (
    <Alert message="Wrong answer" type="error" showIcon />
  )
