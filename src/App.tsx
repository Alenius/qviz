import 'antd/dist/antd.css'
import React from 'react'
import './App.css'
import Start from './pages/Start'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import QuizList from './pages/QuizList'
import { CreateQuiz } from './pages/CreateQuiz'
import { OngoingQuiz } from './pages/OngoingQuiz'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import EditQuiz from 'pages/EditQuiz'

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/create-user">
          <CreateUser />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/create-quiz">
          <CreateQuiz />
        </Route>
        <Route path="/quiz/edit/id=:id">
          <EditQuiz />
        </Route>
        <Route path="/quiz/id=:id">
          <OngoingQuiz />
        </Route>
        <Route path="/quiz/list">
          <QuizList />
        </Route>
        <Route path="/">
          <Start />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
