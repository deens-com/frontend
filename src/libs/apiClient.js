import axios from 'libs/axios';

export const paramsSerializer = params => {
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

const handleError = e => {
  if (
    e.response === undefined ||
    e.code === 'ECONNABORTED' ||
    (e.response && e.response.status === 500)
  ) {
    return;
  }
  throw e;
};

const get = url => params => axios.get(url, { params, paramsSerializer }).catch(handleError);
const post = url => body => axios.post(url, body).catch(handleError);
const deleteEndpoint = url => body => axios.delete(url, body).catch(handleError);
const patch = url => body => axios.patch(url, body).catch(handleError);

// await axios.get(`${serverBaseURL}/search?include=${includes.join(',')}`)).data.trips
// GET endpoint are called like xxx.get(params, ...urlParams) where params are the query params
export default {
  trips: {
    get: params => get('/trips')(params),
    post: post('/trips'),
    getById: (params, id) => get(`/trips/${id}`)(params),
    copy: {
      post: (id, anonymous) =>
        post(`/trips/${id}/copy?${anonymous ? paramsSerializer({ noSave: 1 }) : ''}`)(),
    },
    search: {
      get: get('/search'),
    },
    featured: {
      get: get('/trips/featured'),
    },
    heart: {
      post: id => post(`/hearts/trips/${id}`)(),
      delete: id => deleteEndpoint(`/hearts/trips/${id}`)(),
    },
    availability: {
      get: (id, { bookingDate, adultCount, infantCount, childrenCount, peopleCount }) =>
        get(`/availabilities/trips/${id}`)({
          bookingDate,
          adultCount,
          infantCount,
          childrenCount,
          peopleCount,
        }),
      anonymous: {
        post: body => post(`/trips/anonymous-availability`)(body),
      },
    },
    calculateDistances: {
      post: (id, body) => post(`/trip-ops/${id}/calculate-distances`)(body),
    },
    transports: {
      post: (id, body) => post(`/trip-ops/${id}/transports`)(body),
    },
    // edit trip
    patch: (id, body) => patch(`/trips/${id}`)(body),
    serviceOrganizations: {
      post: (id, body) => post(`/trip-ops/${id}/service-organizations`)(body),
      delete: (id, servOrgIds = []) =>
        deleteEndpoint(`/trip-ops/${id}/service-organizations/${servOrgIds.join(',')}`)(),
      rearrange: {
        post: (id, body) => post(`/trip-ops/${id}/service-organizations/rearrange`)(body),
      },
      availabilityCode: {
        post: (id, body) => post(`/trip-ops/${id}/service-organizations/availability-code`)(body),
      },
    },
  },
  services: {
    get: get('/services'),
    post: body => post('/services')(body),
    patch: (id, body) => patch(`/services/${id}`)(body),
    search: {
      get: get('/search/services'),
      prefetch: body => post('/search/prefetch/availabilities')(body),
    },
    reviews: {
      get: (params, { serviceId }) => get(`/reviews/services/${serviceId}`)(params),
    },
    import: {
      find: {
        post: body => post('/services/import/find')(body),
      },
    },
  },
  links: {
    extract: {
      post: body => post('/links/extract')(body),
    },
  },
  tags: {
    get: get('/tags'),
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
      hearts: {
        get: (params, { username }) => get(`/hearts/trips/by-username/${username}`)(params),
      },
    },
    me: {
      get: get('/users/me'),
      patch: params => patch('/users/me')(params),
      referralInfo: {
        get: get('/users/me/referral-info'),
      },
    },
    signup: {
      anonymously: {
        post: post('/users/signup/anonymously'),
      },
    },
  },
  reviews: {
    username: {
      users: {
        received: {
          get: (params, { username }) =>
            get(`/reviews/username/${username}/users/received`)(params),
        },
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
  moderation: {
    getAllPending() {
      return get('/moderation/trips/pending');
    },
  },
};
