export const ACCESS_TOKEN_STORAGE_KEY = 'compound_os_access_token';
export const ACCESS_TOKEN_CHANGE_EVENT = 'compound_os_access_token_change';

function dispatchAccessTokenChange(): void {
  window.dispatchEvent(new Event(ACCESS_TOKEN_CHANGE_EVENT));
}

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  dispatchAccessTokenChange();
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  dispatchAccessTokenChange();
}
