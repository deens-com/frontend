import React from 'react';
import SessionsContainer from './containers/sessions_container';

const Sessions = props => {
  return (
    <div className="Sessions">
      <SessionsContainer
        message={props.location.state && props.location.state.message}
        from={props.location.state && props.location.state.from}
        action={props.location.state && props.location.state.action}
      />
    </div>
  );
};

export default Sessions;
