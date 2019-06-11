// Ideally all routes should be here, but at least try to add dynamic routes

export default {
  service: {
    view: ({ id, slug, category = 'service' }) => {
      return `/book/${category}/${slug || `_${id}`}`;
    },
  },
  trip: {
    view: ({ id, slug }) => {
      return `/book/trip/${slug || `_${id}`}`;
    },
    organize: id => {
      return `/designer/${id}`;
    },
    share: id => {
      return `/designer/${id}/share`;
    },
    checkout: id => {
      return `/designer/${id}/checkout`;
    },
  },
};
