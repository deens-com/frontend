import Parse from "parse";

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

export const service_fetched = service => {
  return {
    type: "SERVICE_FETCHED",
    payload: service
  };
};

const json_response = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

export const fetch_trips = () => {
  return dispatch => {
    let Trip = Parse.Object.extend("Trip");
    let query = new Parse.Query(Trip);
    query.equalTo("type", "activity");
    query.descending("createdAt");
    query.limit(10);
    query.find().then(
      response => {
        const trips = json_response(response);
        dispatch(trips_fetched({ trips: trips }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};

export const fetch_service = (service_id) => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.equalTo("objectId", service_id);
    query.find().then(
      response => {
        const service = json_response(response);
        //service.pictures = [];
        //service.pictures = service.pictures.concat(service.mainPicture);
        const serialized_services = mapServiceObjects(service);
        dispatch(service_fetched({ service: serialized_services }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};


const get_service_image = mainPicture => {
  if (!mainPicture) {
    return "https://dummyimage.com/600x400/000/fff";
  }

  return mainPicture.url;
};

const mapServiceObjects = service => {
  const original_service = service[0];
  let serialized_service = {...original_service};
  serialized_service.location = `${original_service.city} ${original_service.country}`;
  serialized_service.rating = getRandomInt(1, 5);
  serialized_service.reviews = [];
  serialized_service.price = original_service.pricePerSession;
  serialized_service.image = get_service_image(original_service.mainPicture);
  return serialized_service;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
