import React, { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import {
  Typography,
  Collapse,
  Input,
  Form,
  Button,
  Divider,
  Space,
  Spin,
} from 'antd'
import styled from 'styled-components'
import { update, remove } from 'ramda'
import { getApiURL } from '../utils'
import { Link } from 'react-router-dom'

const apiUrl = getApiURL()

const CreateInfoContainer = styled.div`
  width: 80%;
`

const TitleAndRemoveContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FIELD_TYPE_QUESTION = 'question'
const FIELD_TYPE_ANSWER = 'answer'

export const CreateQuiz = () => {
  const [questionEntities, setQuestionEntities] = useState([])
  const [quizName, setQuizName] = useState('')
  const [quizAuthor, setQuizAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const updateEntityFromField = (
    fieldType = FIELD_TYPE_QUESTION,
    input,
    index
  ) => {
    const currentList = questionEntities
    const shouldUpdateQuestion = fieldType === FIELD_TYPE_QUESTION
    if (currentList[index]) {
      const updated = {
        ...currentList[index],
        [shouldUpdateQuestion ? 'questionText' : 'acceptedAnswers']: input,
      }
      const updatedList = update(index, updated, currentList)
      console.log({ updatedList })
      setQuestionEntities(updatedList)
    } else {
      let newItem
      if (shouldUpdateQuestion) {
        newItem = { questionText: input, acceptedAnswers: '' }
      } else {
        newItem = { questionText: '', acceptedAnswers: input }
      }
      setQuestionEntities([...questionEntities, newItem])
    }
  }

  const onFinish = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          quizName,
          author: quizAuthor,
          questionEntities,
        }),
      })
      setLoading(false)
      setQuizSubmitted(true)
    } catch (err) {
      console.err(err)
    }
  }

  return (
    <PageLayout>
      <Typography.Title>quiz creator</Typography.Title>
      {loading ? (
        <Spin />
      ) : quizSubmitted ? (
        <>
          <Typography.Text>Quiz submitted, thanks! </Typography.Text>
          <Button type='primary'>
            <Link to='/'>Go back</Link>
          </Button>
        </>
      ) : (
        <>
          <CreateInfoContainer>
            <Collapse>
              <Collapse.Panel header='How to create a quiz'>
                Add all your accepted answer with slashes in between. For
                example: If the question was "How many sides does a rectangle
                have", the answer could be "4/four".
              </Collapse.Panel>
            </Collapse>
          </CreateInfoContainer>
          <Form style={{ width: '100%' }} layout='vertical' onFinish={onFinish}>
            <Form.Item label='your name'>
              <Input
                placeholder='your name here'
                onChange={(e) => setQuizAuthor(e.target.value)}
              />
            </Form.Item>
            <Form.Item label='quiz name'>
              <Input
                placeholder='name of quiz'
                onChange={(e) => setQuizName(e.target.value)}
              />
            </Form.Item>
            <Form.List name='Add questions'>
              {(fields, { add, remove: removeFromForm }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div key={`container ${index}`}>
                        <TitleAndRemoveContainer>
                          <Typography.Title level={3}>
                            {`question ${index + 1}`}
                          </Typography.Title>
                          <Button
                            size='small'
                            type='text'
                            onClick={() => {
                              setQuestionEntities(
                                remove(index, index, questionEntities)
                              )
                              removeFromForm(field.name)
                            }}
                          >
                            Remove question
                          </Button>
                        </TitleAndRemoveContainer>
                        <Form.Item
                          {...field}
                          key={`question ${index}`}
                          label='question'
                        >
                          <Input
                            placeholder='your question here'
                            onInput={(e) =>
                              updateEntityFromField(
                                FIELD_TYPE_QUESTION,
                                e.target.value,
                                index
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label='answer' key={`answer ${index}`}>
                          <Input
                            placeholder='your answer here'
                            onInput={(e) =>
                              updateEntityFromField(
                                FIELD_TYPE_ANSWER,
                                e.target.value,
                                index
                              )
                            }
                          />
                        </Form.Item>

                        {fields.length === 1 ||
                        index === fields.length - 1 ? null : (
                          <Divider />
                        )}
                      </div>
                    ))}
                    {/* TODO: disable this when the last question isn't finished*/}
                    <Button type='dashed' onClick={() => add()}>
                      Add question{' '}
                    </Button>
                  </div>
                )
              }}
            </Form.List>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </PageLayout>
  )
}
