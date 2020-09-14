import React, { useState, useEffect } from 'react'
import { map } from 'ramda'
import { List, Space, Typography, Card } from 'antd'
import { PageLayout } from '../components/PageLayout'
import { Link } from 'react-router-dom'
const getQuestionList = async () => {
  const res = await fetch('http://localhost:4000/quiz')
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
      <Space direction='vertical'>
        <Typography.Title>quiz list</Typography.Title>
        <Space direction='vertical'>
          <div>This is a page for listing the quizzes</div>
          <List
            dataSource={quizList}
            grid={{ gutter: 16, column: 4 }}
            size='medium'
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
        </Space>
      </Space>
    </PageLayout>
  )
}

export default QuizList
