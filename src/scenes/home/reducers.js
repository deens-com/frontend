const initialState = {
  services: [],
  test_number: 7,
  tags: []
};

export default function homeReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "SERVICES_FETCHED":
      return {
        ...state,
        services: action.payload.services
      };
    case "POPULAR_TAGS_RETRIEVED":
      return {
        ...state,
        tags: action.payload
      };
    default:
      return state;
  }
}
