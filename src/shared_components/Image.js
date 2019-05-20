import React from 'react';
import PropTypes from 'prop-types';
import Imgix, { Background } from 'react-imgix';

/**
 * A generic Image component that should be used where-ever there's a need to display images
 *
 * It abstracts away the underlying library, so in case if in future we want to change Imgix with something else, we just have to change here
 */
const Image = props => {
  const ImageComponent = props.background ? Background : Imgix;
  /**
   * crop=true is set below as we are having a conflict with Coral images that's expecting that param to be true,
   *by default it's value is 'faces' and that will throw 505 for Coral images once the URL has been generated
   */
  const imageProps = {};
  if (props.alt) imageProps.alt = props.alt;

  const imgixParams = {
    ...(props.circular ? { mask: 'ellipse' } : {}),
    fit: 'crop',
    ...props.imgIxParams,
  };
  if (props.width) imgixParams.w = props.width;
  if (props.height) imgixParams.h = props.height;

  return (
    <ImageComponent
      {...props}
      className={'lazyload ' + (props.className || '')}
      // attributeConfig={{
      //   src: 'data-src',
      //   srcSet: 'data-srcset',
      //   sizes: 'data-sizes',
      // }}
      auto={['compress']}
      imgixParams={imgixParams}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  background: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Image;
