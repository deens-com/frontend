import React, { Component } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import { primary } from 'libs/colors';

const AddButton = styled.div`
  position: absolute;
  right: 35px;
  top: 20px;
  z-index: 2;
`;

const LoaderWrapper = styled.div`
  position: relative;
  padding: 10px;
  background-color: ${primary};
  border-radius: 5px 5px 5px 0;
`;

export default class AddToTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
    };
  }

  buttonClick = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      saving: true,
    });

    await this.props.data.addToTrip(this.props.service);

    this.setState({
      saving: false,
    });
  };

  render() {
    return (
      <AddButton>
        {this.state.saving ? (
          <LoaderWrapper>
            <Loader inline="centered" active inverted />
          </LoaderWrapper>
        ) : (
          <Button theme="fillLightGreen" onClick={this.buttonClick}>
            <strong>Add to trip</strong>
          </Button>
        )}
      </AddButton>
    );
  }
}
