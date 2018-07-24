import React from 'react';
import ServicesContainer from './containers/services_container';

const Services = props => {
  return (
    <div className="Services">
      <ServicesContainer {...props} />
    </div>
  );
};

export default Services;
