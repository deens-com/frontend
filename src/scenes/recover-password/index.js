import React from 'react';
import RecoverPasswordContainer from './container';

export default props => {
  return (
    <div className="RecoverPassword">
      <RecoverPasswordContainer
        message={props.location.state && props.location.state.message}
        from={props.location.state && props.location.state.from}
        action={props.location.state && props.location.state.action}
      />
    </div>
  );
};
