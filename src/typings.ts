export interface Quiz {
  author: string
  id: string
  name: string
  numberOfQuestions: string
}

export interface UnformattedQuestion {
  question_id: string
  question_text: string
}

export interface Question {
  questionId: string
  questionText: string
  id: string
}

export interface Answer {
  correctAnswer: string
  userAnswerWasCorrect: boolean
  extraInfo: string
}
