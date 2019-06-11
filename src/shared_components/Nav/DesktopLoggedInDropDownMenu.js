import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import history from 'main/history';

export default props => {
  return (
    <Dropdown direction="left" trigger={props.trigger()} icon={null}>
      <Dropdown.Menu>
        <Dropdown.Item icon="plane" text="My Trips" onClick={() => history.push('/my/trips')} />
        <Dropdown.Item icon="user" text="Profile" onClick={() => history.push('/my/profile')} />
        <Dropdown.Divider />
        <Dropdown.Item icon="power" text="Logout" onClick={props.logout} />
      </Dropdown.Menu>
    </Dropdown>
  );
};
