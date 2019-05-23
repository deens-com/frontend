import PropTypes from 'prop-types';
import React, { Component } from 'react';

const SvgWithProps = ComposedComponent => {
  return class SvgProps extends Component {
    static propTypes = {
      ariaHidden: PropTypes.bool,
      focusable: PropTypes.string,
      role: PropTypes.string,
      style: PropTypes.object,
    };
    static defaultProps = {
      ariaHidden: true,
      focusable: 'false',
      role: 'presentation',
      style: {},
    };
    render() {
      const style = {
        height: '1em',
        width: '1em',
        display: 'block',
        fill: 'currentColor',
        ...this.props.style,
      };
      return <ComposedComponent {...this.props} style={style} />;
    }
  };
};

export default SvgWithProps;
