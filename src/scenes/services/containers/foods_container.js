import React, { Component } from "react";
// import FoodsComponent from "./../components/foods_component";
import ServicesComponent from "./../components/services_component";
import { foodList } from "./../../../data/food";
import * as services_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class FoodsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_foods();
  }

  render() {
    return <ServicesComponent {...this.props} service_data={foodList} />;
  }
}

const mapStateToProps = state => {
  return {
    foods: state.ServicesReducer.foods
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodsContainer);
