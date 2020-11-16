import React, { useState, useEffect } from 'react'
import { PageLayout } from '../components/PageLayout'
import { Typography, Collapse, Input, Form, Button, Divider, Spin } from 'antd'
import styled from 'styled-components'
import { update, remove, last, length, append } from 'ramda'
import { getApiURL } from '../utils'
import { Link } from 'react-router-dom'
import { FormListFieldData } from 'antd/lib/form/FormList'

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

interface QuestionAnswerEntity {
  questionText: string
  acceptedAnswers: string
  extraInfo: string
}

enum FieldType {
  Question = 'Question',
  Answer = 'Answer',
  ExtraInfo = 'ExtraInfo',
}

export const CreateQuiz = (): JSX.Element => {
  const [questionEntities, setQuestionEntities] = useState<QuestionAnswerEntity[]>([])
  const [quizName, setQuizName] = useState('')
  const [quizAuthor, setQuizAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [addQuestionEnabled, setAddQuestionEnabled] = useState(false)
  const [isCurrentlyEditing, setIsCurrentlyEditing] = useState<FieldType | null>(null)

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

  const fetchAnswers = async (quizName: string, quizAuthor: string, questionEntities: QuestionAnswerEntity[]) =>
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

  const createNewItem = (input: string): QuestionAnswerEntity => {
    switch (isCurrentlyEditing) {
      case FieldType.Question:
        return {
          questionText: input,
          acceptedAnswers: '',
          extraInfo: '',
        }
      case FieldType.Answer:
        return {
          questionText: '',
          acceptedAnswers: input,
          extraInfo: '',
        }
      case FieldType.Answer:
        return {
          questionText: '',
          acceptedAnswers: '',
          extraInfo: input,
        }
      default:
        throw new Error(`Invalid field type, this should never happen: fieldType: ${isCurrentlyEditing}`)
    }
  }

  const updateEntity = (input: string, currentQuestionEntity: QuestionAnswerEntity): QuestionAnswerEntity => {
    switch (isCurrentlyEditing) {
      case FieldType.Question: {
        return { ...currentQuestionEntity, questionText: input }
      }
      case FieldType.Answer: {
        return { ...currentQuestionEntity, acceptedAnswers: input }
      }
      case FieldType.ExtraInfo: {
        return { ...currentQuestionEntity, extraInfo: input }
      }
      default:
        throw new Error(`Invalid field type, this should never happen ${isCurrentlyEditing}`)
    }
  }

  const updateFieldText = (input: string, index: number) => {
    const currentList = questionEntities
    const isNewQuestionEntity = length(currentList) === index

    if (!isCurrentlyEditing)
      throw Error(`No field is currently being edited, this should never happen: ${isCurrentlyEditing}`)

    if (isNewQuestionEntity) {
      const newItem = createNewItem(input)
      const updatedList = append(newItem, currentList)
      setQuestionEntities(updatedList)
    } else {
      const currentQuestionEntity = currentList[index]
      const updatedEntity = updateEntity(input, currentQuestionEntity)
      const updatedList = update(index, updatedEntity, currentList)
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
      console.error(err)
    }
  }

  return (
    <PageLayout headerTitle="create quiz">
      {loading ? (
        <Spin />
      ) : quizSubmitted ? (
        <>
          <Typography.Text>Quiz submitted, thanks! </Typography.Text>
          <Button type="primary">
            <Link to="/">Go back</Link>
          </Button>
        </>
      ) : (
        <>
          <HowTo />
          <StyledForm layout="vertical" onFinish={onFinish}>
            <FormNameInput setQuizAuthor={setQuizAuthor} setQuizName={setQuizName} />
            <Form.List name="Add questions">
              {(fields, { add, remove: removeFromForm }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div key={`container ${index}`}>
                        <QuestionDivider index={index} />
                        <QuestionTitle
                          index={index}
                          onClick={() => {
                            setQuestionEntities(remove(index, index, questionEntities))
                            removeFromForm(field.name)
                          }}
                        />
                        <QuestionInput
                          field={field}
                          index={index}
                          onFocus={() => {
                            setIsCurrentlyEditing(FieldType.Question)
                            console.log('hello')
                          }}
                          updateField={updateFieldText}
                        />
                        <AnswerInput
                          index={index}
                          onFocus={() => setIsCurrentlyEditing(FieldType.Answer)}
                          updateField={updateFieldText}
                        />
                        <ExtraInfoInput
                          index={index}
                          onFocus={() => setIsCurrentlyEditing(FieldType.ExtraInfo)}
                          updateField={updateFieldText}
                        />
                      </div>
                    ))}
                    {/* TODO: disable this when the last question isn't finished*/}
                    <Button type="dashed" onClick={() => add()} disabled={!addQuestionEnabled}>
                      Add question
                    </Button>
                  </div>
                )
              }}
            </Form.List>
            <Form.Item>
              <Button style={{ marginTop: '1rem' }} type="primary" htmlType="submit">
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
    <Collapse.Panel header="How to create a quiz" key="collapse-panel">
      Add all your accepted answer with slashes in between. For example: If the question was "How many sides does a
      rectangle have", the answer could be "4/four".
    </Collapse.Panel>
  </StyledCollapse>
)

interface FormNameInputProps {
  setQuizAuthor: (value: string) => void
  setQuizName: (value: string) => void
}
const FormNameInput = ({ setQuizAuthor, setQuizName }: FormNameInputProps) => (
  <>
    <Form.Item label="your name">
      <Input placeholder="your name here" onChange={(e) => setQuizAuthor((e.target as HTMLInputElement).value)} />
    </Form.Item>
    <Form.Item label="quiz name">
      <Input placeholder="name of quiz" onChange={(e) => setQuizName(e.target.value)} />
    </Form.Item>
  </>
)

interface QuestionInputProps {
  field: FormListFieldData
  index: number
  updateField: (value: string, index: number) => void
  onFocus: () => void
}
const QuestionInput = ({ field, index, onFocus, updateField }: QuestionInputProps) => (
  <Form.Item {...field} key={`question ${index}`} label="question">
    <Input
      placeholder="your question here"
      onFocus={onFocus}
      onInput={(e) => updateField((e.target as HTMLInputElement).value, index)}
    />
  </Form.Item>
)

interface AnswerInputProps {
  index: number
  updateField: (value: string, index: number) => void
  onFocus: () => void
}

const AnswerInput = ({ index, onFocus, updateField }: AnswerInputProps) => (
  <Form.Item label="answer" key={`answer ${index}`}>
    <Input
      placeholder="your answer here"
      onFocus={onFocus}
      onInput={(e) => updateField((e.target as HTMLInputElement).value, index)}
    />
  </Form.Item>
)

interface ExtraInfoInputProps {
  index: number
  updateField: (value: string, index: number) => void
  onFocus: () => void
}

const ExtraInfoInput = ({ index, onFocus, updateField }: ExtraInfoInputProps) => (
  <Form.Item label="extra info" key={`answer ${index}`}>
    <Input
      placeholder="extra information about the question or the answer"
      onFocus={onFocus}
      onInput={(e) => updateField((e.target as HTMLInputElement).value, index)}
    />
  </Form.Item>
)

interface QuestionTitleProps {
  index: number
  onClick: () => void
}
const QuestionTitle = ({ index, onClick }: QuestionTitleProps) => (
  <TitleAndRemoveContainer>
    <Typography.Title level={3}>{`question ${index + 1}`}</Typography.Title>
    <Button size="small" type="text" onClick={() => onClick()}>
      Remove question
    </Button>
  </TitleAndRemoveContainer>
)

const QuestionDivider = ({ index }: { index: number }) => {
  const isFirstQuestion = index === 0
  return isFirstQuestion ? null : <Divider />
}
