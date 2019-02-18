const types = {
  CHANGE_HEADER: 'CHANGE_HEADER',
};

const changeHeader = options => dispatch => {
  dispatch({
    type: types.CHANGE_HEADER,
    payload: options,
  });
};

export default {
  types,
  changeHeader,
};
