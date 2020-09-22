import React, { useState, useEffect } from 'react'
import { map } from 'ramda'
import { List, Space, Typography, Card } from 'antd'
import { PageLayout } from '../components/PageLayout'
import { Link } from 'react-router-dom'
import { getApiURL } from '../utils'

const url = getApiURL()
const getQuestionList = async () => {
  const res = await fetch(`${url}/quiz`)
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
    <PageLayout>
      <Space direction='vertical' align='center'>
        <Typography.Title>quiz list</Typography.Title>
        <div>This is a page for listing the quizzes</div>
        <List
          dataSource={quizList}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
          size='large'
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
      </Space>
    </PageLayout>
  )
}

export default QuizList
