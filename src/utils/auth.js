export const AUTH_TOKEN_KEY = 'auth_token'
export const AUTH_USER_KEY = 'auth_user'

export function saveAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function authHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
