import React, { useState, useEffect } from 'react'
import { map } from 'ramda'
import { List, Space, Typography } from 'antd'
import { PageLayout } from '../components/PageLayout'
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
    <PageLayout>
      <Space direction='vertical'>
        <Typography.Title>quiz list</Typography.Title>
        <Space direction='vertical'>
          <div>This is a page for listing the quizzes</div>
          {map((it) => {
            return (
              <div>
                <List bordered size='small' key={it.name + it.author}>
                  {it.name}
                </List>
              </div>
            )
          }, quizList)}
        </Space>
      </Space>
    </PageLayout>
  )
}

export default QuizList
