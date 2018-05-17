// NPM
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const PriceWrap = styled.div`
  // display: flex;
`;

const Price = styled.span`
  font-size: ${props => (props.size === "big" ? "24px" : "18px")};
  font-weight: 500;
`;

const Unit = styled.span`
  font-size: 11px;
`;

// MODULE

class PriceTag extends Component {

  render() {
    return (
      <PriceWrap>
        <Price size={this.props.size}>
          {this.props.price}
          {this.props.baseCurrency.label}
        </Price>
        {this.props.unit !== "hidden" &&
         <Unit>/ person</Unit>
        }
      </PriceWrap>
    );
  }
}


const mapStateToProps = state => {
  return{
    baseCurrency: state.SessionsReducer.baseCurrency
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceTag);
