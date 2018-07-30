import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

export default class AddNotesButton extends Component {
  static propTypes = {
    defaultShow: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    defaultShow: true,
  };

  state = {
    show: this.props.defaultShow,
  };

  toggle = () => {
    this.setState(({ show }) => ({ show: !show }));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.show ? (
          <Button onClick={this.toggle}>Add Notes for the day</Button>
        ) : (
          this.props.children
        )}
      </React.Fragment>
    );
  }
}
