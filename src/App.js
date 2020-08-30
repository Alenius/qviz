import React from 'react'
import './App.css'
import Start from './pages/Start'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import QuizList from './pages/QuizList'

function App() {
  return (
    <Router>
      <Switch>
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
