// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const PriceWrap = styled.div`
  // display: flex;
`;

const Price = styled.span`
  font-size: ${props => (props.size === 'big' ? '24px' : '18px')};
  font-weight: 500;
`;

const Unit = styled.span`
  font-size: 11px;
`;

// MODULE

class PriceTag extends Component {
  // exposing the Price style so others can use this same style as the default render
  static PriceStyle = Price;

  calculatePrice() {
    const priceInBitcoin = (1 / this.props.baseCurrency.rates.USD) * this.props.price;
    switch (this.props.baseCurrency.value) {
      case 'USD':
        return this.props.price.toFixed(2);
      case 'BTC':
        return priceInBitcoin.toFixed(8);
      case 'ETH':
        return (priceInBitcoin * this.props.baseCurrency.rates[this.props.baseCurrency.value]).toFixed(4);
      default:
        return (priceInBitcoin * this.props.baseCurrency.rates[this.props.baseCurrency.value]).toFixed(2);
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
          {this.props.unit !== 'hidden' && <Unit> / person</Unit>}
        </PriceWrap>
      );
    }
    // else call the render prop
    return this.props.children({ convertedPrice, symbol });
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.SessionsReducer.baseCurrency,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceTag);
