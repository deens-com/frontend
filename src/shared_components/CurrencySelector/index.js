// NPM
import React, { Component } from "react";
import Select from "../Form/controls/Select";
import { currencies } from "../../data/nav";

// MODULE
export default class CurrencySelector extends Component {
  state = {
    selectedOption: 'USD',
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
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
