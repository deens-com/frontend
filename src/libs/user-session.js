import { env } from 'libs/config';
import analytics from 'libs/analytics';

export function saveSession(userData) {
  localStorage.setItem(`deens-${env}-session`, JSON.stringify(userData));
}

export function readSession() {
  const localStorageUser = localStorage.getItem(`deens-${env}-session`);
  if (localStorageUser) {
    return JSON.parse(localStorageUser);
  }
}

export function removeSession() {
  analytics.user.logout();
  localStorage.removeItem(`deens-${env}-session`);
}

export function getSession() {
  return readSession();
}
