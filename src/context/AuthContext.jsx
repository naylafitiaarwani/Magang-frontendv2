import { createContext, useContext, useState } from 'react'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const login = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  const authHeader = () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // role_id 1 = Super Admin, 2 = Admin (lihat RoleSeeder di backend)
  const isAdmin = () => [1, 2].includes(Number(user?.role_id))

  const value = {
    user,
    login,
    logout,
    getToken,
    authHeader,
    isAdmin,
    isLoggedIn: Boolean(user),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }

  return ctx
}
