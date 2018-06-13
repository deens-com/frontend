import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Dropdown, Grid, Segment, Label } from 'semantic-ui-react';
import Media from 'react-media';
import Parse from 'parse';
import styled from 'styled-components';

import { sizes } from '../../../libs/styled';

const dropDownOptions = [
  {
    key: 'public',
    text: 'Public',
    value: 'public',
  },
  {
    key: 'unlisted',
    text: 'Unlisted',
    value: 'unlisted',
  },
  {
    key: 'private',
    text: 'Private',
    value: 'private',
  },
];

const LinkText = styled.div`
  font-size: 18px;
  font-weight: 300;
  text-align: center;
`;

export default class ShareDialogContent extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
    updateTripDetails: PropTypes.func.isRequired,
  };

  onDropDownChange = (ev, { value }) => {
    this.props.updateTripDetails({ status: value });
  };

  render() {
    const { trip } = this.props;
    const currentUser = Parse.User.current();
    const allowChangeStatus = (trip.owner && trip.owner.objectId) === (currentUser && currentUser.id);
    const tripUrl = window.location.toString();
    return (
      <Container>
        <Grid columns="2">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <h3>Visibility</h3>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Media query={`(min-width: ${sizes.large})`}>
                {matches => (
                  <Dropdown
                    selection
                    compact={!matches}
                    placeholder="Select Visibility"
                    defaultValue={trip.status.toLowerCase()}
                    options={dropDownOptions}
                    onChange={this.onDropDownChange}
                    disabled={!allowChangeStatus}
                  />
                )}
              </Media>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="16">
              <Segment padded>
                <Label attached="top">Link</Label>
                <LinkText>
                  <a href={tripUrl} target="_blank">
                    {tripUrl}
                  </a>
                </LinkText>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
