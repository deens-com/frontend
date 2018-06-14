import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";
import history from "./../../main/history";
import { signMessage, ledgerSignMessage } from '../../libs/web3-utils';
import validator from 'validator';

export const user_profile_fetched = user_profile => {
  return {
    type: "USER_PROFILE_FETCHED",
    payload: user_profile
  };
};

export const user_services_fetched = user_services => {
  return {
    type: "USER_SERVICES_FETCHED",
    payload: user_services
  };
};

export const planned_trips_fetched = planned_trips => {
  return {
    type: "PLANNED_TRIPS_FETCHED",
    payload: planned_trips
  };
};

export const edit_user_error_raised = error => {
  return {
    type: "EDIT_USER_ERROR_SET",
    payload: error
  };
};

export const completed_trips_fetched = completed_trips => {
  return {
    type: "COMPLETED_TRIPS_FETCHED",
    payload: completed_trips
  };
};

export const unscheduled_trips_fetched = unscheduled_trips => {
  return {
    type: "UNSCHEDULED_TRIPS_FETCHED",
    payload: unscheduled_trips
  };
};

export const fetch_user_profile = () => dispatch => {
  let user = Parse.User.current();
  if(user === null){
    history.push("/login")
  }else{
    Parse.User.current().fetch().then(response => {
      const json_response = fetch_helpers.normalizeParseResponseData(response);
      user = json_response;
      if(user === null){
        history.push("/login")
      }else{
        const json_user = fetch_helpers.normalizeParseResponseData(user);
        dispatch(user_profile_fetched({user_profile: json_user}));
      }
    }).catch(error => {
      console.log(error);
    });
  }
};

export const update_user_service_status = (e) => async dispatch => {
  let status = e.target.dataset.status;
  let serviceId = e.target.dataset.objectId;

  if (!serviceId || !status) {
    console.error(new Error("can't update service status without serviceId and status"));
  }

  const serviceObject = await fetch_helpers.build_query('Service').get(serviceId);
  serviceObject.set('serviceStatus', status);
  await serviceObject.save();

  dispatch(fetch_user_services());
};

//const locales = ['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA'];
export const update_user_profile = (user_id, field_type, value) => {
  return dispatch => {
    let user = Parse.User.current();
    let isUsernameValid = false;
    let isEmailValid = false;
    if(field_type === "username"){
      isUsernameValid = validator.isAlphanumeric(value, 'en-US');
      if(!isUsernameValid){
        dispatch(edit_user_error_raised({"code":203,"error":"Username should be alphanumeric."}));
        let json_user = user.toJSON();
        dispatch(user_profile_fetched({user_profile: json_user}));
        return;
      };
    }
    if(field_type === "email"){
      isEmailValid = validator.isEmail(value);
      if(!isEmailValid){
        dispatch(edit_user_error_raised({"code":203,"error":"Please, enter a valid email address."}));
        let json_user = user.toJSON();
        dispatch(user_profile_fetched({user_profile: json_user}));
        return;
      };
    }
    user.set(field_type, value);
    user.save(null, {
        success: function (update) {
          // console.log("Updated!");
          let json_user = user.toJSON();
          dispatch(user_profile_fetched({user_profile: json_user}));
          dispatch(edit_user_error_raised({}));
        },
        error: function (error) {
          //console.log(error);
          dispatch(edit_user_error_raised({"code":202,"error":"Account already exists for this username or email."}));
          let json_user = user.toJSON();
          dispatch(user_profile_fetched({user_profile: json_user}));
        }
    });
  }

};

export const fetch_user_services = () => dispatch => {
  let services_query = fetch_helpers.build_query("Service");
  services_query.equalTo("owner", Parse.User.current());

  services_query.find().then(services => {
    dispatch({ type: 'USER_SERVICES_FETCHED', payload: { user_services: fetch_helpers.normalizeParseResponseData(services) }});
  });
};

export const fetch_user_trips = (owner_id, trip_state) => {
  return dispatch => {
    let user_query = fetch_helpers.build_query("User");
    user_query.equalTo("objectId", owner_id)
    user_query.first().then(user => {
      let trip_query = fetch_helpers.build_query("Trip");
      const moment_now = new Date();
      if (trip_state === "completed") {
        // Trips which are booked and with an endDate in the past
        trip_query.equalTo('booked', true);
        trip_query.lessThan("endDate", moment_now);
      } else if (trip_state === "planned") {
        // Trips which are not yet booked and with beginDate in the future
        const pastStartDateAndNotPurchased = fetch_helpers
          .build_query('Trip')
          .equalTo('booked', true)
          .greaterThan('beginDate', moment_now);
          //.lessThan('beginDate', moment_now);
        //const startDateInFuture = fetch_helpers.build_query('Trip').greaterThan('beginDate', moment_now);
        //const tripsWithoutDates = fetch_helpers.build_query('Trip').doesNotExist('beginDate');
        // trip_query = Parse.Query.or(
        //   pastStartDateAndNotPurchased,
        //   startDateInFuture,
        //   //tripsWithoutDates
        // );
        trip_query = pastStartDateAndNotPurchased;
      } else if(trip_state === "unscheduled"){
        trip_query.doesNotExist('numberOfPerson');
        trip_query.doesNotExist('beginDate');
        trip_query.doesNotExist('endDate');
      }

      trip_query.equalTo("owner", user).find().then(
        trips_response => {
          trips_response.map(trip => {
            let trip_org_query = fetch_helpers.build_query("TripOrganization");
            trip_org_query.include("service");
            trip_org_query.equalTo("trip", trip);
            const json_trip = fetch_helpers.normalizeParseResponseData([trip]);
            const formatted_trip = fetch_helpers.mapServiceObjects(json_trip)[0];
            formatted_trip.services = [];
            trip_org_query.find().then(trip_org => {
              const json_trip_org = fetch_helpers.normalizeParseResponseData(trip_org);
              if(json_trip_org.length){
                json_trip_org.forEach(t_o => {
                  const t_o_service = fetch_helpers.normalizeParseResponseData(t_o.service);
                  const formatted_service = fetch_helpers.mapServiceObjects([t_o_service])[0];
                  formatted_trip.services = formatted_trip.services.concat(formatted_service);
                })
              }
              if(trip_state === "completed"){
                dispatch(completed_trips_fetched({ completed_trips: formatted_trip }));
              }else if(trip_state === "planned"){
                dispatch(planned_trips_fetched({ planned_trips: formatted_trip }));
              }else if(trip_state === "unscheduled"){
                dispatch(unscheduled_trips_fetched({ unscheduled_trips: formatted_trip }));
              }
            })
            return true;
          })
        },
        error => {
          // TODO dispatch the error to error handler
          console.log(error);
        }
      );

      fetch_helpers
        .build_query('Reservation')
        .equalTo('client', user)
        .equalTo('transactionStatus', 0)
        .find()
        .then(fetch_helpers.normalizeParseResponseData)
        .then(failedReservations => {
          dispatch({ type: 'USER_FAILED_RESERVATIONS', payload: failedReservations });
        });
    })
  };
};

export const clearMetamaskErrors = () => dispatch => {
  dispatch({ type: 'METAMASK_ERROR', payload: {} });
};

// NOTE: for now it always signs "please"
export const signData = () => async dispatch => {
  // clear metamask errors
  dispatch({ type: 'METAMASK_ERROR', payload: {} });

  const data = 'please';
  try {
    const { signature } = await signMessage(data);
    const userObj = await Parse.Cloud.run('storePublicAddress', { signature: signature, type: "metamask" });
    dispatch(fetch_user_profile());
    dispatch(user_profile_fetched({ user_profile: fetch_helpers.normalizeParseResponseData(userObj) }));
  } catch (error) {
    console.error(error);
    if (error.showToUser) {
      dispatch({
        type: 'METAMASK_ERROR',
        payload: {
          message: error.message,
        },
      });
    }
  }
};


export const ledgerSignData = () => async dispatch => {
  dispatch({ type: 'LEDGER_ERROR', payload: {} });

  const data = 'please';
  try {
    const { signature } = await ledgerSignMessage(data);
    const userObj = await Parse.Cloud.run('storePublicAddress', { signature: signature, type: "ledger" });
    dispatch(fetch_user_profile());
    dispatch(user_profile_fetched({ user_profile: fetch_helpers.normalizeParseResponseData(userObj) }));
  } catch (error) {
    if (error.showToUser) {
      dispatch({
        type: 'LEDGER_ERROR',
        payload: {
          message: error.message
        }
      });
    }
  }
};
