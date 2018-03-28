import React, { Component } from "react";
import FoodsComponent from "./../components/foods_component";

export default class FoodsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <FoodsComponent {...this.props} />;
  }
}
