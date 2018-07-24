import * as registrations_actions from './actions';

const initialState = {
  session: {},
  errors: {},
};

export default function RegistrationsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case registrations_actions.types.REGISTRATION_FETCHED:
      return {
        ...state,
        session: action.payload.session,
      };
    case registrations_actions.types.REGISTRATION_FAILED:
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}
