import React, { Component } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import AddToTripButton from 'shared_components/AddToTripButton';
import { primary } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const AddButton = styled.div`
  position: absolute;
  right: 20px;
  top: 5px;
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
      showingPanel: false,
    };
  }

  buttonClick = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.data) {
      this.addToCurrentTrip();
      return;
    }
    this.setState({
      showingPanel: true,
    });
  };

  addToCurrentTrip = async () => {
    this.setState({
      saving: true,
    });

    await this.props.data.addToTrip(this.props.service);

    this.setState({
      saving: false,
    });
  };

  addToSpecificTrip = async data => {
    this.setState({
      saving: true,
    });
    await this.props.addToAnyTrip(data.trip, data.day, this.props.service);
    this.setState({
      saving: false,
    });
  };

  addToNewTrip = async () => {
    this.setState({
      saving: true,
    });
    await this.props.addToNewTrip(this.props.service);
    this.setState({
      saving: false,
    });
  };

  render() {
    const button = (
      <Button theme="fillLightGreen" onClick={this.props.data ? this.buttonClick : () => {}}>
        <strong>
          <Trans>Add to trip</Trans>
        </strong>
      </Button>
    );
    return (
      <AddButton>
        {this.state.saving ? (
          <LoaderWrapper>
            <Loader inline="centered" active inverted />
          </LoaderWrapper>
        ) : this.props.data ? (
          button
        ) : (
          <AddToTripButton
            customTrigger={button}
            myUnpurchasedTrips={this.props.userTrips}
            onTripClick={this.addToSpecificTrip}
            onNewTripClick={this.addToNewTrip}
          />
        )}
      </AddButton>
    );
  }
}
