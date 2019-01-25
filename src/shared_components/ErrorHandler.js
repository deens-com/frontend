import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';

const Error = styled.div`
  cursor: ${props => (props.retry ? 'pointer' : 'auto')};
`;

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    retryFunction: PropTypes.func,
    errorComponent: PropTypes.node,
    style: PropTypes.object,
  };

  static defaultProps = {
    retryFunction: null,
    errorComponent: null,
  };

  static getDerivedStateFromError(error) {
    return {
      error: true,
    };
  }

  componentDidCatch(error, info) {
    console.log({ error, info });

    Sentry.configureScope(scope => {
      scope.setExtra('info', info);
      scope.setExtra('wasHandledByComponent', true);
      if (this.props.session.username) {
        scope.setUser({ username: this.props.session.username });
      } else {
        scope.setUser(null);
      }
    });

    Sentry.captureException(error);
  }

  handleClick = () => {
    if (!this.props.retryFunction) {
      return;
    }
    this.props.retryFunction();

    this.setState({
      error: false,
    });
  };

  renderError() {
    const { retryFunction, errorComponent } = this.props;

    if (errorComponent) {
      return errorComponent;
    }

    return (
      <Error
        retry={Boolean(this.props.retryFunction)}
        onClick={this.handleClick}
        style={this.props.style}
      >
        Something went wrong :( {retryFunction ? 'Please click here to try again.' : ''}
      </Error>
    );
  }

  render() {
    return this.state.error ? this.renderError() : this.props.children;
  }
}

const mapStateToProps = state => ({
  session: state.session.session,
});

export default connect(mapStateToProps)(ErrorHandler);
