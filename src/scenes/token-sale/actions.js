import { serverBaseURL } from '../../libs/config';
import axios from 'libs/axios';

export const types = {
  KYC_TOKEN_START: 'KYC_TOKEN_START',
  KYC_TOKEN_SUCCESS: 'KYC_TOKEN_SUCCESS',
  KYC_TOKEN_ERROR: 'KYC_TOKEN_ERROR',
};

export const iframe_token_fetch = data => {
  return {
    type: this.types.KYC_TOKEN_START,
  };
};

export const iframe_token_fetched = data => {
  return {
    type: this.types.KYC_TOKEN_SUCCESS,
    payload: data.token,
  };
};

export const iframe_token_error = error => {
  return {
    type: this.types.KYC_TOKEN_ERROR,
    payload: error,
  };
};

export const fetchIFrameToken = () => async dispatch => {
  try {
    dispatch(iframe_token_fetch());

    const response = await axios.get(`${serverBaseURL}/users/kyc-token`);

    dispatch(iframe_token_fetched(response.data));
  } catch (e) {
    dispatch(iframe_token_error(e));
    console.log(e);
  }
};
