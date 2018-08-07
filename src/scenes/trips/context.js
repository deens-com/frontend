import React from 'react';
const TripContext = React.createContext('trip');

export const ContextConsumer = TripContext.Consumer;

export const ContextProvider = TripContext.Provider;
