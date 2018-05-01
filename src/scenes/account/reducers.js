const initialState = {
  user_profile: {}
};

export default function AccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'USER_PROFILE_FETCHED':
      return {
        ...state,
        user_profile: action.payload.user_profile
      };
    default:
      return state;
  }
}
