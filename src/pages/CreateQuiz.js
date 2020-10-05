import React, { useState, useEffect } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Typography, Collapse, Input, Form, Button, Divider, Spin } from 'antd'
import styled from 'styled-components'
import { update, remove, last, length, append } from 'ramda'
import { getApiURL } from '../utils'
import { Link } from 'react-router-dom'

const apiUrl = getApiURL()

const StyledCollapse = styled(Collapse)`
  margin-bottom: 1rem;
  align-self: flex-start;
  width: 100%;
`

const TitleAndRemoveContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledForm = styled(Form)`
  width: 100%;
`

const FIELD_TYPE_QUESTION = 'question'
const FIELD_TYPE_ANSWER = 'answer'
const FIELD_TYPE_EXTRA_INFO = 'extraInfo'

export const CreateQuiz = () => {
  const [questionEntities, setQuestionEntities] = useState([])
  const [quizName, setQuizName] = useState('')
  const [quizAuthor, setQuizAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [addQuestionEnabled, setAddQuestionEnabled] = useState(false)

  useEffect(() => {
    const lastQuestionEntity = last(questionEntities)
    if (!lastQuestionEntity) {
      setAddQuestionEnabled(true)
    } else {
      const { questionText, acceptedAnswers } = lastQuestionEntity
      const bothFilled = questionText && acceptedAnswers
      bothFilled ? setAddQuestionEnabled(true) : setAddQuestionEnabled(false)
    }
  }, [questionEntities])

  const fetchAnswers = async (quizName, quizAuthor, questionEntities) =>
    fetch(`${apiUrl}/quiz`, {
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

  const updateQuestionText = (input, index) => {
    const currentList = questionEntities
    const isNewQuestionEntity = length(currentList) === index

    if (isNewQuestionEntity) {
      const newItem = {
        questionText: input,
        acceptedAnswers: '',
        extraInfo: '',
      }
      const updatedList = append(newItem, currentList)
      setQuestionEntities(updatedList)
    } else {
      const currentQuestionEntity = currentList[index]
      const { acceptedAnswers, extraInfo } = currentQuestionEntity
      const updatedList = update(
        index,
        { questionText: input, acceptedAnswers, extraInfo },
        currentList
      )
      setQuestionEntities(updatedList)
    }
  }

  const updateAnswerText = (input, index) => {
    const currentList = questionEntities
    const isNewQuestionEntity = length(currentList) === index

    if (isNewQuestionEntity) {
      const newItem = {
        questionText: '',
        acceptedAnswers: input,
        extraInfo: '',
      }
      const updatedList = append(newItem, currentList)
      setQuestionEntities(updatedList)
    } else {
      const currentQuestionEntity = currentList[index]
      const { questionText, extraInfo } = currentQuestionEntity
      const updatedList = update(
        index,
        { questionText, acceptedAnswers: input, extraInfo },
        currentList
      )
      setQuestionEntities(updatedList)
    }
  }

  const onFinish = async () => {
    setLoading(true)
    try {
      await fetchAnswers(quizName, quizAuthor, questionEntities)
      setLoading(false)
      setQuizSubmitted(true)
    } catch (err) {
      setLoading(false)
      console.err(err)
    }
  }

  return (
    <PageLayout headerTitle='create quiz'>
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
          <HowTo />
          <StyledForm layout='vertical' onFinish={onFinish}>
            <FormNameInput
              setQuizAuthor={setQuizAuthor}
              setQuizName={setQuizName}
            />
            <Form.List name='Add questions'>
              {(fields, { add, remove: removeFromForm }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div key={`container ${index}`}>
                        <QuestionDivider index={index} />
                        <QuestionTitle
                          index={index}
                          onClick={() => {
                            setQuestionEntities(
                              remove(index, index, questionEntities)
                            )
                            removeFromForm(field.name)
                          }}
                        />
                        <QuestionInput
                          field={field}
                          index={index}
                          updateQuestionText={updateQuestionText}
                        />
                        <AnswerInput
                          index={index}
                          updateAnswerText={updateAnswerText}
                        />
                      </div>
                    ))}
                    {/* TODO: disable this when the last question isn't finished*/}
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      disabled={!addQuestionEnabled}
                    >
                      Add question
                    </Button>
                  </div>
                )
              }}
            </Form.List>
            <Form.Item>
              <Button
                style={{ marginTop: '1rem' }}
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </Form.Item>
          </StyledForm>
        </>
      )}
    </PageLayout>
  )
}

const HowTo = () => (
  <StyledCollapse>
    <Collapse.Panel header='How to create a quiz'>
      Add all your accepted answer with slashes in between. For example: If the
      question was "How many sides does a rectangle have", the answer could be
      "4/four".
    </Collapse.Panel>
  </StyledCollapse>
)

const FormNameInput = ({ setQuizAuthor, setQuizName }) => (
  <>
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
  </>
)

const QuestionInput = ({ field, index, updateQuestionText }) => (
  <Form.Item {...field} key={`question ${index}`} label='question'>
    <Input
      placeholder='your question here'
      onInput={(e) => updateQuestionText(e.target.value, index)}
    />
  </Form.Item>
)

const AnswerInput = ({ index, updateAnswerText }) => (
  <Form.Item label='answer' key={`answer ${index}`}>
    <Input
      placeholder='your answer here'
      onInput={(e) => updateAnswerText(e.target.value, index)}
    />
  </Form.Item>
)

const QuestionTitle = ({ index, onClick }) => (
  <TitleAndRemoveContainer>
    <Typography.Title level={3}>{`question ${index + 1}`}</Typography.Title>
    <Button size='small' type='text' onClick={() => onClick()}>
      Remove question
    </Button>
  </TitleAndRemoveContainer>
)

const QuestionDivider = ({ index }) => {
  const isFirstQuestion = index === 0
  return isFirstQuestion ? null : <Divider />
}
