import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Dropdown, Grid, Input } from 'semantic-ui-react';
import Media from 'react-media';
import Parse from 'parse';

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

export default class ShareDialogContent extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
    updateTripDetails: PropTypes.func.isRequired,
  };

  state = {
    copyButtonText: 'Copy',
  };

  componentDidMount() {
    this.setState({ copyButtonText: 'Copy' });
  }

  handleRef = element => {
    this.textInput = element;
  };

  onDropDownChange = (ev, { value }) => {
    this.props.updateTripDetails({ status: value });
  };

  copyToClipboard = () => {
    this.textInput.inputRef.select();
    document.execCommand('copy');
    this.setState({ copyButtonText: 'Copied' });
    setTimeout(() => this.setState({ copyButtonText: 'Copy' }), 2000);
  };

  render() {
    const { trip } = this.props;
    const tripUrl = `${window.location.origin}/#/trips/${trip.objectId}`;
    const currentUser = Parse.User.current();
    const allowChangeStatus = trip.owner.objectId === currentUser.id;
    const copyButton = (
      <Button color="teal" icon="copy" content={this.state.copyButtonText} onClick={this.copyToClipboard} />
    );
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
              <Input action={copyButton} fluid value={tripUrl} ref={this.handleRef} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
