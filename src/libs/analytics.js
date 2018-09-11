import { EventTypes } from 'redux-segment';

const commonSuffix = ' on Demo';

/**
 * Given a object of user, it identifies the user on segment
 * @param {ParseObject} session
 */
export const identifyUsingSession = session => {
  const email = session.email;
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
  const email = session.email;
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `User Registered${commonSuffix}`,
      properties: { email },
    },
  };
};

export const trackServiceCreated = service => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Service Created${commonSuffix}`,
      properties: { serviceId: service.id },
    },
  };
};

export const trackTripCreated = trip => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Trip Created${commonSuffix}`,
      properties: { tripId: trip.id || trip.objectId },
    },
  };
};

export const trackTripCloned = ({ originalTripId, newTripId }) => {
  if (originalTripId === newTripId) return undefined;
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Trip Cloned'${commonSuffix}`,
      properties: { originalTripId, newTripId },
    },
  };
};

export const trackTripBooked = tripId => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Trip Booked${commonSuffix}`,
      properties: { tripId },
    },
  };
};

export const trackVoiceUsage = searchQuery => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Voice Query${commonSuffix}`,
      properties: { voiceToText: searchQuery },
    },
  };
};

export const trackMetamaskConnected = () => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Metamask Connected${commonSuffix}`,
    },
  };
};

export const trackLedgerConnected = () => {
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Ledger Connected${commonSuffix}`,
    },
  };
};

export const trackHeaderCategoryClick = category => {
  console.log('category', category);
  return {
    eventType: EventTypes.track,
    eventPayload: {
      event: `Header Category Clicked${commonSuffix}`,
      properties: {
        category,
      },
    },
  };
};
