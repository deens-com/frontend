// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fiatCurrencies } from 'data/nav';
import { keyBy } from 'libs/normalizer';

// i18n
import { Trans } from '@lingui/macro';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const PriceWrap = styled.div`
  // display: flex;
`;

const Price = styled.span`
  font-size: ${props => (props.size === 'big' ? '24px' : '15px')};
  font-weight: 600;
`;

const Unit = styled.span`
  font-size: 11px;
`;

const currencies = keyBy(fiatCurrencies, 'value');

// MODULE

class PriceTag extends Component {
  // exposing the Price style so others can use this same style as the default render
  static PriceStyle = Price;

  calculatePrice() {
    const priceInBitcoin = (1 / this.props.baseCurrency.rates.USD) * this.props.price;
    switch (this.props.baseCurrency.value) {
      case 'USD':
        return parseFloat(this.props.price).toFixed(2);
      case 'BTC':
        return priceInBitcoin.toFixed(8);
      case 'ETH':
        return (
          priceInBitcoin * this.props.baseCurrency.rates[this.props.baseCurrency.value]
        ).toFixed(4);
      default:
        return (
          priceInBitcoin * this.props.baseCurrency.rates[this.props.baseCurrency.value]
        ).toFixed(2);
    }
  }

  render() {
    const convertedPrice = this.calculatePrice();
    const symbol = this.props.baseCurrency.label;
    if (typeof this.props.children !== 'function') {
      // if a render prop isn't passed use the default one
      return (
        <PriceWrap>
          <Price size={this.props.size}>
            {symbol}
            {convertedPrice}
          </Price>
          {this.props.unit !== 'hidden' && (
            <Unit>
              {' '}
              <Trans>per person</Trans>
            </Unit>
          )}
        </PriceWrap>
      );
    }
    // else call the render prop
    return this.props.children({
      convertedPrice,
      symbol,
      selectedCurrency: this.props.baseCurrency.value,
      stripeMultiplier:
        this.props.baseCurrency.stripeMultiplier ||
        currencies[this.props.baseCurrency.value].stripeMultiplier,
    });
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.session.baseCurrency,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriceTag);
