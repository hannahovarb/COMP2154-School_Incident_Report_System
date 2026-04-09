export function getAuthToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function getAuthUser() {
  const raw = sessionStorage.getItem('user') || localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(token, user, remember) {
  const userStr = JSON.stringify(user);
  if (remember) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.setItem('token', token);
    localStorage.setItem('user', userStr);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', userStr);
  }
}

export function clearAuth() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
