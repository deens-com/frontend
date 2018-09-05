import axios from 'axios';
import Parse from 'parse';
import { serverBaseURL } from './config';
import { getSession } from './user-session';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

// Add a request interceptor to inject Parse sessionToken if it exists
axiosInstance.interceptors.request.use(config => {
  const currentUser = Parse.User.current();
  if (currentUser) {
    const sessionToken = currentUser.getSessionToken();
    config.headers['X-Parse-Session-Token'] = sessionToken;
  }

  // auth0
  const user = getSession();
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export default axiosInstance;
