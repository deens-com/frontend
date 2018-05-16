// NPM
import React, { Component } from "react";
import Select from "../Form/controls/Select";
import { currencies } from "../../data/nav";

// MODULE
export default class CurrencySelector extends Component {
  render() {
    return (
      <Select
        onChange={val => {
          console.log(val);
        }}
        value="USD"
        options={currencies}
      />
    );
  }
}
