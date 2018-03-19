// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";

// COMPONENTS
import Col from "../layout/Col";

// ACTIONS/CONFIG

// MODULE
export default function WithColumnHOC(ComposedComponent) {
  return class WithColumn extends Component {
    render() {
      if (this.props.withColumn) {
        return (
          <Col
            xsBasis={this.props.xsBasis}
            smBasis={this.props.smBasis}
            mdBasis={this.props.mdBasis}
            lgBasis={this.props.lgBasis}
          >
            <ComposedComponent {...this.props} />
          </Col>
        );
      }

      return <ComposedComponent {...this.props} />;
    }
  };
}

// Props Validation
WithColumnHOC.propTypes = {};
