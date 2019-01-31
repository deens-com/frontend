import axios from 'libs/axios';

const get = url => params => axios.get(url, { params });
const post = url => body => axios.post(url, body);

// await axios.get(`${serverBaseURL}/search?include=${includes.join(',')}`)).data.trips
// GET endpoint are called like xxx.get(params, ...urlParams) where params are the query params
export default {
  trips: {
    get: get('/trips'),
    addService: {
      post: (id, body) => post(`/trips/${id}/add-service`)(body),
    },
    search: {
      get: get('/search'),
    },
  },
  services: {
    get: get('/services'),
    search: {
      get: get('/search/services'),
    },
    reviews: {
      get: (params, { serviceId }) => get(`/services/${serviceId}/reviews`)(params),
    },
  },
  users: {
    kycToken: {
      get: get('/users/kyc-token'),
    },
    username: {
      reviews: {
        get: (params, { username }) => get(`/users/username/${username}/reviews`)(params),
      },
    },
  },
};
