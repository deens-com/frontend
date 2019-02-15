import axios from 'libs/axios';

const paramsSerializer = params => {
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    const param = params[key];
    if (Array.isArray(param)) {
      searchParams.append(key, param.join(','));
    } else {
      if (param !== undefined && param !== null) {
        searchParams.append(key, param);
      }
    }
  }
  return searchParams.toString();
};

const get = url => params => axios.get(url, { params, paramsSerializer });
const post = url => body => axios.post(url, body);
const deleteEndpoint = url => body => axios.delete(url, body);

// await axios.get(`${serverBaseURL}/search?include=${includes.join(',')}`)).data.trips
// GET endpoint are called like xxx.get(params, ...urlParams) where params are the query params
export default {
  trips: {
    get: get('/trips'),
    addService: {
      post: (id, body) => post(`/trips/${id}/add-service`)(body),
    },
    copy: {
      post: (id, anonymous) =>
        post(`/trips/${id}/copy?${anonymous ? paramsSerializer({ noSave: 1 }) : ''}`)(),
    },
    search: {
      get: get('/search'),
    },
    heart: {
      post: id => post(`/trips/${id}/heart`)(),
      delete: id => deleteEndpoint(`/trips/${id}/heart`)(),
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
      trips: {
        get: (params, { username }) => get(`/users/username/${username}/trips`)(params),
      },
    },
  },
  media: {
    post: async file => {
      let formData = new FormData();
      formData.append('file', file);
      return axios.post('/media', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
  },
};
