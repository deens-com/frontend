import React from 'react';
import UsersContainer from './containers/users_container';

const Users = props => {
  return (
    <div className="Users">
      <UsersContainer {...props} />
    </div>
  );
};

export default Users;
