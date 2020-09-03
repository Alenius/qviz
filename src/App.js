import 'antd/dist/antd.css'
import React from 'react'
import './App.css'
import Start from './pages/Start'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import QuizList from './pages/QuizList'
import { CreateQuiz } from './pages/CreateQuiz'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/create-quiz'>
          <CreateQuiz />
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
