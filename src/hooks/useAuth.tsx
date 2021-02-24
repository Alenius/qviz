import React, { useState, useContext, useEffect, createContext } from 'react'
import { getApiURL } from 'utils'

interface User {
  username: string
  firstname?: string
  lastname?: string
}
const authContext = createContext<User | null>(null)

export const useAuth = () => {
  return useContext(authContext)
}

const defaultUser = { username: '', firstname: '', lastname: '' }
export const useProvideAuth = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState<User>(defaultUser)

  const login = async (username: string, password: string) => {
    const apiUrl = getApiURL()

    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    if (!res.ok) {
      console.log('something went wrong when logging in') // eslint-disable-line
      return false
    }
    const { token: authToken, username: returnedUsername, firstname, lastname } = await res.json()
    setToken(authToken)
    setUser({ username: returnedUsername, firstname, lastname })

    return true
  }

  const logout = () => {
    setToken(null)
    setUser(defaultUser)
  }

  return { token, login, logout, user }
}

export const AuthProvider = ({ children }: any) => {
  const { user } = useProvideAuth()

  return <authContext.Provider value={user}>{children}</authContext.Provider>
}
