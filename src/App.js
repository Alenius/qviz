import 'antd/dist/antd.css'
import React from 'react'
import './App.css'
import Start from './pages/Start'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import QuizList from './pages/QuizList'
import { CreateQuiz } from './pages/CreateQuiz'
import OngoingQuiz from './pages/OngoingQuiz'
import { QuizStart } from './pages/QuizStart'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/create-quiz'>
          <CreateQuiz />
        </Route>
        <Route path='/quiz/id=:id'>
          <QuizStart />
        </Route>
        <Route path='/quiz/list'>
          <QuizList />
        </Route>
        <Route path='/'>
          <Start />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
