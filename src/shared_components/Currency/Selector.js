// NPM
import React, { Component } from "react";
import Select from "../Form/controls/Select";
import { currencies } from "../../data/nav";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sessionsActions from "../../scenes/sessions/actions";

// MODULE
class CurrencySelector extends Component {
  state = {
    selectedOption: this.props.baseCurrency
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.set_base_currency(selectedOption);
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        onChange={this.handleChange}
        value={selectedOption}
        options={currencies}
      />
    );
  }
}

const mapStateToProps = state => {
  return{
    baseCurrency: state.SessionsReducer.baseCurrency
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(sessionsActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySelector);
