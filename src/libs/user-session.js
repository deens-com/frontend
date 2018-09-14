import { env } from 'libs/config';

let jsonSession;

export function saveSession(userData) {
  localStorage.setItem(`please-${env}-session`, JSON.stringify(userData));
  jsonSession = userData;
}

export function readSession() {
  const localStorageUser = localStorage.getItem(`please-${env}-session`);
  if (localStorageUser) {
    jsonSession = JSON.parse(localStorageUser);
    return jsonSession;
  }
}

export function removeSession() {
  jsonSession = undefined;
  localStorage.removeItem(`please-${env}-session`);
}

export function getSession() {
  return jsonSession;
}
