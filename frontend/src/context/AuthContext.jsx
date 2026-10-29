import { useState } from 'react'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('access_token')
  )

  const [user, setUser] = useState(
    () => {
      const storedUser =
        localStorage.getItem('user')

      return storedUser
        ? JSON.parse(storedUser)
        : null
    }
  )

  const login = (accessToken, userData = null) => {
    localStorage.setItem(
      'access_token',
      accessToken
    )

    if (userData) {
      localStorage.setItem(
        'user',
        JSON.stringify(userData)
      )
    }

    setToken(accessToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(
      'access_token'
    )

    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  const isAuthenticated =
    Boolean(token)

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
