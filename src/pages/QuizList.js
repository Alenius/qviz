import React, { useState, useEffect } from 'react'
import { map } from 'ramda'
import { List, Space, Typography, Card, PageHeader } from 'antd'
import { ArrowLeftOutlined, LeftAr } from '@ant-design/icons'
import { PageLayout } from '../components/PageLayout'
import { Link, useHistory } from 'react-router-dom'
import { getApiURL } from '../utils'

const url = getApiURL()
const getQuestionList = async () => {
  const res = await fetch(`${url}/quiz`)
  const json = await res.json()
  return json.foundQuizzes
}

function QuizList() {
  const [quizList, setQuizList] = useState([])
  const navHistory = useHistory()

  useEffect(() => {
    const getQuestionListAsync = async () => {
      const fetchedQuestionList = await getQuestionList()
      setQuizList(fetchedQuestionList)
    }
    getQuestionListAsync()
  }, [])

  return (
    <PageLayout headerTitle='quiz list'>
      <List
        dataSource={[
          ...quizList,
          ...quizList,
          ...quizList,
          ...quizList,
          ...quizList,
        ]}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
        renderItem={(item) => (
          <Link to={`/quiz/id=${item.id}`}>
            <List.Item>
              <Card
                title={item.name}
              >{`Author: ${item.author}, Number of questions: ${item.numberOfQuestions}`}</Card>
            </List.Item>
          </Link>
        )}
      />
    </PageLayout>
  )
}

export default QuizList
