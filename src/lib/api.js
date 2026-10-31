const TOKEN_KEY = 'iot_access_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(path, { ...options, headers })
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
