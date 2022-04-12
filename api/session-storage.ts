import SessionType from "../types/session"
export const KEY = "spotistuff_auth"

/**
 * Get user from session storage.
 */
export function getSessionUser(): SessionType | null {
  const ses = window.sessionStorage.getItem(KEY)
  if (ses) return JSON.parse(ses)
  else return null
}

/**
 * Set session in session storage.
 */
export function setSessionUser(session: SessionType) {
  window.sessionStorage.setItem(KEY, JSON.stringify(session))
}

/**
 * Delete the session from session storage.
 */
export function deleteSessionUser() {
  window.sessionStorage.removeItem(KEY)
}
