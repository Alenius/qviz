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
    <PageLayout>
      <PageHeader
        title='quiz list'
        subTitle='Here is where you find all the quizzes'
        backIcon={<ArrowLeftOutlined color='white' />}
        onBack={() => navHistory.goBack()}
      />
      <List
        dataSource={quizList}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
        size='large'
        style={{ width: '100%' }}
        renderItem={(item) => (
          <Link to={`/quiz/id=${item.id}`}>
            <List.Item>
              <Card
                title={item.name}
                color='blue'
              >{`Author: ${item.author}, Number of questions: ${item.numberOfQuestions}`}</Card>
            </List.Item>
          </Link>
        )}
      />
    </PageLayout>
  )
}

export default QuizList
