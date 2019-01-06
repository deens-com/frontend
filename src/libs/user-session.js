import { env } from 'libs/config';

export function saveSession(userData) {
  localStorage.setItem(`please-${env}-session`, JSON.stringify(userData));
}

export function readSession() {
  const localStorageUser = localStorage.getItem(`please-${env}-session`);
  if (localStorageUser) {
    return JSON.parse(localStorageUser);
  }
}

export function removeSession() {
  localStorage.removeItem(`please-${env}-session`);
}

export function getSession() {
  return readSession();
}
