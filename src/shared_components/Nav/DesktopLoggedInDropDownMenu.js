import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import history from 'main/history';
import 'semantic-ui-css/components/transition.min.css';

export default props => {
  return (
    <Dropdown direction="left" trigger={props.trigger()} icon={null}>
      <Dropdown.Menu>
        <Dropdown.Item
          icon="plane"
          text="My Trips"
          onClick={() => history.push('/account/trips/all')}
        />
        {/*<Dropdown.Item
              icon="list"
              text="My Services"
              onClick={() => history.push('/account/services')}
            />*/}
        <Dropdown.Item
          icon="user"
          text="Profile"
          onClick={() => history.push('/account/profile')}
        />
        {/*<Dropdown.Item
              icon="cogs"
              text="Settings"
              onClick={() => history.push('/account/settings')}
            />*/}
        <Dropdown.Divider />
        <Dropdown.Item icon="power" text="Logout" onClick={props.logout} />
      </Dropdown.Menu>
    </Dropdown>
  );
};
