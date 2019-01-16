import axios from 'libs/axios';

const get = url => params => axios.get(url, { params });
const post = url => body => axios.post(url, body);

// await axios.get(`${serverBaseURL}/search?include=${includes.join(',')}`)).data.trips
export default {
  search: {
    get: get('/search'),
    services: {
      get: get('/search/services'),
    },
  },
  trips: {
    get: get('/trips'),
    addService: {
      post: (id, body) => post(`/trips/${id}/add-service`)(body),
    },
  },
  services: {
    get: get('/services'),
  },
  users: {
    kycToken: {
      get: get('/users/kyc-token'),
    },
  },
};
