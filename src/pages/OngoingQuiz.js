import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const getQuestions = async () => {
  const res = await fetch('http://lvh.me:4000/questions?id=3')
  const json = await res.json()
  const questions = json.questions
  return questions
}

function OngoingQuiz() {
  const [questions, setQuestions] = useState(['question 1', 'question 2'])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  let { id } = useParams()

  useEffect(() => {
    const getQuestionsAsync = async () => {
      const fetchedQuestions = await getQuestions()
      setQuestions(fetchedQuestions[0].questions)
    }
    getQuestionsAsync()
  }, [])
  return (
    <div className='App'>
      <div>{questions[currentQuestion]}</div>
      <form
        onSubmit={(e) => {
          currentQuestion === questions.length
            ? setCurrentQuestion(0)
            : setCurrentQuestion(currentQuestion + 1)
          e.preventDefault()
        }}
      >
        <input title='Answer...' />
        <input type='submit' title='Svara' />
      </form>
      <p>{id}</p>
    </div>
  )
}

export default OngoingQuiz
