const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

export function saveToken(token) {
  if (token?.access) localStorage.setItem(ACCESS_KEY, token.access);
  if (token?.refresh) localStorage.setItem(REFRESH_KEY, token.refresh);
}

export function getToken() {
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function deleteToken() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Read the expiry time stored inside a standard JWT. Returns milliseconds, or null.
export function getTokenExpiry() {
  const { access } = getToken();
  if (!access) return null;

  try {
    const payload = access.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(base64));
    return typeof data.exp === 'number' ? data.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired() {
  const expiry = getTokenExpiry();
  return !getToken().access || (expiry !== null && Date.now() >= expiry);
}
