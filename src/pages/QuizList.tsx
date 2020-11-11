import React, { useState, useEffect } from 'react'
import { List, Card } from 'antd'
import { PageLayout } from '../components/PageLayout'
import { Link } from 'react-router-dom'
import { getApiURL } from '../utils'
import { Quiz } from 'typings'

const url = getApiURL()
const getQuestionList = async (): Promise<Quiz[]> => {
  const res = await fetch(`${url}/quiz`)
  const json = await res.json()
  return json.foundQuizzes
}

function QuizList(): JSX.Element {
  const [quizList, setQuizList] = useState<Quiz[]>([])

  useEffect(() => {
    const getQuestionListAsync = async () => {
      const fetchedQuestionList = await getQuestionList()
      setQuizList(fetchedQuestionList)
    }
    getQuestionListAsync()
  }, [])

  return (
    <PageLayout headerTitle="quiz list">
      <List
        dataSource={quizList}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
        renderItem={(item) => (
          <Link to={`/quiz/id=${item.id}`}>
            <List.Item>
              <Card title={item.name}>{`Author: ${item.author}, Number of questions: ${item.numberOfQuestions}`}</Card>
            </List.Item>
          </Link>
        )}
      />
    </PageLayout>
  )
}

export default QuizList
