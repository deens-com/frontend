import axios from 'axios';
import { serverBaseURL } from './config';
import { getSession } from './user-session';
import { getUserLanguage } from './language';

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
  config.headers['X-Language'] = getUserLanguage();
  return config;
});

axiosInstance.isCancel = axios.isCancel;

export default axiosInstance;

export const getAuthHeader = () => `Bearer ${getSession().accessToken}`;
export const CancelToken = axios.CancelToken;
