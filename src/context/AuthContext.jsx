import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setLoading(false)
      return
    }

    getProfile()
  }, [])

  async function getProfile() {
    try {
      const response = await api.get('/profile')

      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.error('Session tidak valid:', error)

      localStorage.removeItem('access_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  function login(token, userData = null) {
    localStorage.setItem('access_token', token)

    if (userData) {
      setUser(userData)
    } else {
      getProfile()
    }
  }

  function logout() {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}