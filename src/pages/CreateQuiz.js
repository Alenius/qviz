import React, { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Typography, Collapse, Input, Form, Button, Divider, Space } from 'antd'
import styled from 'styled-components'
import { update, remove } from 'ramda'

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
  const [quizEntityList, setQuizEntityList] = useState([])

  const updateEntityFromField = (
    fieldType = FIELD_TYPE_QUESTION,
    input,
    index
  ) => {
    console.log(input)
    const currentList = quizEntityList
    const shouldUpdateQuestion = fieldType === FIELD_TYPE_QUESTION
    if (currentList[index]) {
      const updated = {
        ...currentList[index],
        [shouldUpdateQuestion ? 'question' : 'answer']: input,
      }
      const updatedList = update(index, updated, currentList)
      console.log({ updatedList })
      setQuizEntityList(updatedList)
    } else {
      let newItem
      if (shouldUpdateQuestion) {
        newItem = { question: input, answer: '' }
      } else {
        newItem = { question: '', answer: input }
      }
      setQuizEntityList([...quizEntityList, newItem])
    }
  }

  const onFinish = () => {
    console.log({ submitted: quizEntityList })
  }

  return (
    <PageLayout>
      <Typography.Title>quiz creator</Typography.Title>
      <CreateInfoContainer>
        <Collapse>
          <Collapse.Panel header='How to create a quiz'>
            Add all your accepted answer with slashes in between. For example:
            If the question was "How many sides does a rectangle have", the
            answer could be "4/four".
          </Collapse.Panel>
        </Collapse>
      </CreateInfoContainer>
      <Form style={{ width: '100%' }} layout='vertical' onFinish={onFinish}>
        <Form.Item label='your name'>
          <Input placeholder='your name here' />
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
                          setQuizEntityList(
                            remove(index, index, quizEntityList)
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
    </PageLayout>
  )
}
