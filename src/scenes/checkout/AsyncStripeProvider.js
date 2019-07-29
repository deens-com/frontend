import PropTypes from 'prop-types';
import React, { Component } from 'react';

// Copied from https://github.com/stripe/react-stripe-elements/issues/154#issuecomment-462554749
export default class AsyncStripeProvider extends Component {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      stripe: null,
    };
  }

  componentDidMount() {
    this._mounted = true;
    const { apiKey } = this.props;

    const stripeJs = document.createElement('script');
    stripeJs.src = 'https://js.stripe.com/v3/';
    stripeJs.async = true;
    stripeJs.onload = () => {
      if (this._mounted) {
        this.setState({
          stripe: window.Stripe(apiKey),
        });
      }
    };
    document.body && document.body.appendChild(stripeJs);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { stripe } = this.state;

    return React.cloneElement(this.props.children, { stripe });
  }
}
