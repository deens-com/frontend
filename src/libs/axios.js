import axios from 'axios';
import { serverBaseURL } from './config';
import { getSession } from './user-session';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

// Add a request interceptor to inject Parse sessionToken if it exists
axiosInstance.interceptors.request.use(config => {
  // auth0
  const user = getSession();
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
});

export default axiosInstance;

export const getAuthHeader = () => `Bearer ${getSession().accessToken}`;
