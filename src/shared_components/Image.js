import React from 'react';
import PropTypes from 'prop-types';
import Imgix from 'react-imgix';

/**
 * A generic Image component that should be used where-ever there's a need to display images
 *
 * It abstracts away the underlying library, so in case if in future we want to change Imgix with something else, we just have to change here
 */
const Image = props => {
  const translatedProps = {};
  if (props.background) translatedProps.type = 'bg';
  /**
   * crop=true is set below as we are having a conflict with Coral images that's expecting that param to be true,
   *by default it's value is 'faces' and that will throw 505 for Coral images once the URL has been generated
   */
  return <Imgix {...props} {...translatedProps} crop="true" auto="compress" />;
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  background: PropTypes.bool,
};

export default Image;
