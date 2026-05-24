export const MOCK_AUTH_STORAGE_KEY = 'compound_os_mock_auth';

export function isMockAuthenticated(): boolean {
  return window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY) === 'true';
}

export function setMockAuthenticated(): void {
  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, 'true');
}

export function clearMockAuthentication(): void {
  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}
