export const MOCK_AUTH_STORAGE_KEY = 'compound_os_mock_auth';
export const MOCK_AUTH_CHANGE_EVENT = 'compound_os_mock_auth_change';

function dispatchMockAuthChange(): void {
  window.dispatchEvent(new Event(MOCK_AUTH_CHANGE_EVENT));
}

export function isMockAuthenticated(): boolean {
  return window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY) === 'true';
}

export function setMockAuthenticated(): void {
  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, 'true');
  dispatchMockAuthChange();
}

export function clearMockAuthentication(): void {
  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
  dispatchMockAuthChange();
}
