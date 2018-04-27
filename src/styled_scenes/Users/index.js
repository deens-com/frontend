import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserBasicInfo from './components/UserBasicInfo';

const UserScene = props => {
  return <UserBasicInfo {...props} />;
};

UserScene.propTypes = {
  user: PropTypes.object,
};

export default UserScene;
