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

const PrivateRoute = ({ children, ...rest }: any) => { // eslint-disable-line
  return (
    <AuthContext.Consumer>
      {({ auth }) => (
        <Route
          {...rest}
          render={({ location }) =>
            auth.rawToken ? (
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
      )}
    </AuthContext.Consumer>
  )
}

export type Auth = { isAdmin: boolean; username: string; userId: string; rawToken: string }
export type LoginFn = (auth: Auth) => void
const defaultAuth: Auth = { isAdmin: false, username: '', userId: '', rawToken: '' }
const defaultLoginFn: LoginFn = () => null
export const AuthContext = createContext({ auth: defaultAuth, login: defaultLoginFn, logout: () => {} }) // eslint-disable-line

function App(): JSX.Element {
  const [state, setState] = useState<Auth>(defaultAuth)
  const login = (auth: Auth) =>
    setState({ username: auth.username, isAdmin: auth.isAdmin, userId: auth.userId, rawToken: auth.rawToken })
  const logout = () => setState(defaultAuth)

  return (
    <AuthContext.Provider value={{ auth: { ...state }, login, logout }}>
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
