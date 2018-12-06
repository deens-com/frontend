import { serverBaseURL } from 'libs/config';
import axios from 'libs/axios';
import { createAsyncActions, dispatchAsyncActions } from 'store/utils';

const SEARCH_TRIPS = 'SEARCH_TRIPS';

export const types = {
  searchTrips: createAsyncActions(SEARCH_TRIPS),
};

export const searchTrips = (includes = []) => {
  return dispatchAsyncActions(
    SEARCH_TRIPS,
    async () =>
      (await axios.get(`${serverBaseURL}/search?include=${includes.join(',')}`)).data.trips,
  );
};
