import React from "react";
import UsersContainer from "./containers/users_container";
import history from "./../../main/history";

const Users = props => {
  return (
    <div className="Users">
      <UsersContainer {...props} />
    </div>
  );
};

export default Users;
