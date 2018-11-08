import { serverBaseURL } from '../../libs/config';
import axios from 'libs/axios';

export const types = {
  KYC_TOKEN_SUCCESS: 'KYC_TOKEN_SUCCESS',
};

export const iframe_token_fetched = data => {
  return {
    type: this.types.KYC_TOKEN_SUCCESS,
    payload: data.token,
  };
};

export const fetchIFrameToken = () => async dispatch => {
  try {
    const response = await axios.get(`${serverBaseURL}/users/kyc-token`);

    dispatch(iframe_token_fetched(response.data));
  } catch (e) {
    console.log(e);
  }
};
