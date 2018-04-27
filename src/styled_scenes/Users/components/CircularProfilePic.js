import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';

const CircularProfilePic = props => {
  return <Image src={props.src} circular centered size="tiny" />;
};

CircularProfilePic.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default CircularProfilePic;
