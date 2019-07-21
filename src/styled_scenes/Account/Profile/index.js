import React, { Component } from 'react';
import { Grid, Divider, Icon, Input, Button, Message } from 'semantic-ui-react';
import styled from 'styled-components';
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';
import { Loader } from 'semantic-ui-react';

// i18n
import { Trans } from '@lingui/macro';

const HorizontalSpan = styled.span`
  display: flex;
  flexdirection: row;
`;

const BoldH4 = styled.h4`
  font-weight: bold;
`;

class AccountProfileScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBiographyEditable: false,
    };
  }

  toggleEdition = field => {
    switch (field) {
      case 'biography':
        this.setState({ isBiographyEditable: !this.state.isBiographyEditable });
        if (this.state.isBiographyEditable) {
          const user_id = this.props.user_profile.objectId;
          this.props.update_user_profile(user_id, 'biography', this.state.biography);
        }
        break;
      default:
        break;
    }
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <Grid centered columns={2}>
        <Grid.Column mobile={16} tablet={5} computer={4}>
          <SectionWrap>
            <UserBasicInfo {...this.props} />
          </SectionWrap>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={11} computer={12}>
          {this.props.isUploadingAvatar && (
            <Message icon>
              <Icon name="circle notched" loading />
              <Message.Content>
                <Message.Header>
                  <Trans>Please wait</Trans>
                </Message.Header>
                <Trans>Your avatar is being uploaded.</Trans>
              </Message.Content>
            </Message>
          )}
          <h2>
            <Trans>Profile</Trans>
          </h2>
          {this.props.editUserError ? (
            <h6 style={{ color: 'red' }}>{this.props.editUserError.error}</h6>
          ) : null}
          <Divider />
          {this.props.isLoading ? (
            <Loader active inline="centerd" />
          ) : (
            <>
              <HorizontalSpan>
                <BoldH4>
                  <Trans>Biography:</Trans>
                </BoldH4>
                {this.state.isBiographyEditable ? (
                  <Input
                    style={{ minWidth: '35em' }}
                    placeholder="Biography"
                    name="biography"
                    defaultValue={this.props.user_profile.biography}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <p>
                    &nbsp;
                    {this.props.user_profile.biography}
                    &nbsp;
                  </p>
                )}
                {this.state.isBiographyEditable ? (
                  <Button onClick={() => this.toggleEdition('biography')}>
                    <Trans>Save</Trans>
                  </Button>
                ) : (
                  <Icon onClick={() => this.toggleEdition('biography')} name="pencil" />
                )}
              </HorizontalSpan>
              <HorizontalSpan>
                <BoldH4>
                  <Trans>Email:</Trans>
                </BoldH4>
                <p>
                  &nbsp;
                  {this.props.user_profile.email}
                  &nbsp;
                </p>
              </HorizontalSpan>
            </>
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default AccountProfileScene;
