import 'antd/dist/antd.css'
import React, { createContext, useState } from 'react'
import './App.css'
import Start from './pages/Start'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import QuizList from './pages/QuizList'
import { CreateQuiz } from './pages/CreateQuiz'
import { OngoingQuiz } from './pages/OngoingQuiz'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import EditQuiz from 'pages/EditQuiz'
// import { useAuth, AuthProvider } from './hooks/useAuth'

const user = { username: '' }
export const AuthContext = createContext({ user, login: () => {} }) // eslint-disable-line

const PrivateRoute = ({ children, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

function App(): JSX.Element {
  const myUser = { username: '' }
  const [state, setState] = useState({ user: myUser })
  const login = () => setState({ user: { username: 'poop' } })

  return (
    <AuthContext.Provider value={{ ...state, login }}>
      <Router>
        <Switch>
          <Route path="/create-user">
            <CreateUser />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/create-quiz">
            <CreateQuiz />
          </PrivateRoute>
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
    </AuthContext.Provider>
  )
}

export default App
