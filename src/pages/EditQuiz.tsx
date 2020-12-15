import React, { useState, useEffect } from 'react'
import { Modal, Button, Typography } from 'antd'
import { PageLayout } from '../components/PageLayout'
import { getApiURL } from '../utils'
import { Quiz } from 'typings'
import { useHistory, useParams } from 'react-router-dom'

const url = getApiURL()

const deleteQuiz = async (id: string): Promise<boolean> => {
  console.log({ id })
  try {
    const res = await fetch(`${url}/quiz`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ quizId: parseInt(id) }),
    })
    if (res.status !== 200) throw Error('something went wrong when deleting quiz')
    return true
  } catch (e) {
    return false
  }
}

const getQuiz = async (id: string) => {
  const result = await fetch(`${url}/quiz?id=${id}`)
  const { foundQuizzes } = await result.json()
  return foundQuizzes[0]
}

const EditQuiz = (): JSX.Element => {
  const { id: quizId }: { id: string } = useParams()
  const [quiz, setQuiz] = useState<Quiz>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navHistory = useHistory()

  useEffect(() => {
    const asyncGetQuiz = async () => {
      const quiz = await getQuiz(quizId)
      setQuiz(quiz)
    }

    asyncGetQuiz()
  }, [])

  const handleDeleteQuiz = async () => {
    console.log('hello')
    if (quiz?.id) {
      const quizDeleted = await deleteQuiz(quiz.id)
      if (quizDeleted) {
        navHistory.replace('/quiz/list')
      }
    }
  }

  return (
    <PageLayout headerTitle="editing quiz">
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        title="Delete quiz"
        onOk={handleDeleteQuiz}
      >
        Are you sure that you want to delete this quiz?
      </Modal>
      <Typography.Text>quiz name: {quiz?.name}</Typography.Text>
      <Typography.Text>quiz author: {quiz?.author}</Typography.Text>
      <Button
        style={{ backgroundColor: 'red', fontWeight: 'bold' }}
        size="large"
        onClick={() => setIsModalVisible(true)}
      >
        Delete quiz
      </Button>
    </PageLayout>
  )
}

export default EditQuiz
