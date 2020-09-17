import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'

const getQuestions = async (quizId) => {
  const res = await fetch(`http://lvh.me:4000/questions?quizId=${quizId}`)
  const { questions, quizName } = await res.json()
  return { questions, quizName }
}

export const QuizStart = () => {
  let { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [quizName, setQuizName] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState()
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    const getQuestionsAsync = async () => {
      const { questions: fetchedQuestions, quizName } = await getQuestions(id)
      setQuestions(fetchedQuestions)
      setQuizName(quizName)
    }

    getQuestionsAsync()
  }, [])
  return (
    <PageLayout>
      <Typography.Title>{quizName}</Typography.Title>
      {questions.map((item) => {
        return <p>{item.question_text}</p>
      })}
    </PageLayout>
  )
}
