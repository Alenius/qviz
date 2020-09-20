import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { set } from 'ramda'

const getQuestions = async (quizId) => {
  const res = await fetch(`http://lvh.me:4000/questions?quizId=${quizId}`)
  const { questions, quizName } = await res.json()
  return { questions, quizName }
}

const checkAnswer = async (questionId, userAnswer) => {
  const res = await fetch(
    `http://lvh.me:4000/answer?questionId=${questionId}&userAnswer=${userAnswer}`
  )
  return res.json()
}

export const QuizStart = () => {
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
  }

  const handleOnFinish = async (values) => {
    const { answer } = values
    setUserAnswer(answer)
    setQuestionAnswered(true)
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
    }
  }
  return (
    <PageLayout>
      <Typography.Title>{quizName}</Typography.Title>
      {quizStarted ? (
        quizFinished ? (
          <Typography.Text>
            Quiz finished! You got {correctCounter} correct answers
          </Typography.Text>
        ) : questionAnswered ? (
          <>
            {userAnswerWasCorrect ? (
              <Alert message='Correct!' type='success' showIcon />
            ) : (
              <Alert message='Wrong answer' type='error' showIcon />
            )}
            <Typography.Text>Your answer: {userAnswer}</Typography.Text>
            <Typography.Text>Correct answer: {correctAnswer}</Typography.Text>
            {bonusText && (
              <Typography.Text>More info: {bonusText}</Typography.Text>
            )}
            <Button type='primary' onClick={() => goToNextQuestion()}>
              Next Question
            </Button>
          </>
        ) : (
          <Form onFinish={(values) => handleOnFinish(values)}>
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
          </Form>
        )
      ) : (
        <Button type='primary' onClick={() => handleStartClick()}>
          Start quiz
        </Button>
      )}
    </PageLayout>
  )
}
