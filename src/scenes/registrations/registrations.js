import React from 'react';
import RegistrationsContainer from './containers/registrations_container';

const Registrations = props => {
  return (
    <div className="Registrations">
      <RegistrationsContainer
        message={props.location.state && props.location.state.message}
        from={props.location.state && props.location.state.from}
        action={props.location.state && props.location.state.action}
      />
    </div>
  );
};

export default Registrations;
