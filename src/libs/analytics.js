import { EventTypes } from 'redux-segment';

/**
 * Given a object of user, it identifies the user on segment
 * @param {ParseObject} session
 */
export const identifyUsingSession = session => {
  const email = session && session.get('email');
  if (email) {
    return {
      eventType: EventTypes.identify,
      eventPayload: {
        userId: email,
      },
    };
  }
  return undefined;
};

export const trackUserRegistered = session => {
  const email = session && session.get('email');
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'User Registered',
      properties: { email },
    },
  };
};

export const trackServiceCreated = service => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Service Created',
      properties: { serviceId: service.id },
    },
  };
};

export const trackTripCreated = trip => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Trip Created',
      properties: { tripId: trip.id || trip.objectId },
    },
  };
};

export const trackTripCloned = ({ originalTripId, newTripId }) => {
  if (originalTripId === newTripId) return undefined;
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Trip Cloned',
      properties: { originalTripId, newTripId },
    },
  };
};
