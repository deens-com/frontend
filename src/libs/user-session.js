import { env } from 'libs/config';

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
  localStorage.removeItem(`deens-${env}-session`);
}

export function getSession() {
  return readSession();
}
