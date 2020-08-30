import React, { useState, useEffect } from 'react'
import { map } from 'ramda'

const getQuestionList = async () => {
  const res = await fetch('http://lvh.me:4000/quiz/?author=Adam')
  const json = await res.json()
  return json.foundQuizzes
}

function QuizList() {
  const [quizList, setQuizList] = useState([])

  useEffect(() => {
    const getQuestionListAsync = async () => {
      const fetchedQuestionList = await getQuestionList()
      setQuizList(fetchedQuestionList)
    }
    getQuestionListAsync()
  }, [])

  return (
    <div>
      <div>This is a page for listing the quizzes</div>
      {map((it) => {
        return <div key={it.name + it.author}>{it.name}</div>
      }, quizList)}
    </div>
  )
}

export default QuizList
