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
        traits: { email },
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

export const trackTripBooked = tripId => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Trip Booked',
      properties: { tripId },
    },
  };
};

export const trackVoiceUsage = searchQuery => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Voice Query',
      properties: { voiceToText: searchQuery },
    },
  };
};

export const trackMetamaskConnected = () => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Metamask Connected',
    },
  };
};

export const trackLedgerConnected = () => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: 'Ledger Connected',
    },
  };
};
