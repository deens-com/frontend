import React, { Component } from 'react';
import { Grid, Divider, Icon, Input, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';

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
      isUsernameEditable: false,
      isEmailEditable: false,
      isBiographyEditable: false,
      biography: '',
      username: '',
      email: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.biography === '' || nextProps.user_profile.biography !== this.state.biography) {
      this.setState({ biography: nextProps.user_profile.biography });
    }
    if (this.state.email === '' || nextProps.user_profile.email !== this.state.email) {
      this.setState({ email: nextProps.user_profile.email });
    }
    if (this.state.username === '' || nextProps.user_profile.username !== this.state.username) {
      this.setState({ username: nextProps.user_profile.username });
    }
  }

  toggleEdition = field => {
    switch (field) {
      case 'email':
        this.setState({ isEmailEditable: !this.state.isEmailEditable });
        if (this.state.isEmailEditable) {
          const user_id = this.props.user_profile.objectId;
          this.props.update_user_profile(user_id, 'email', this.state.email);
        }
        break;
      case 'username':
        this.setState({ isUsernameEditable: !this.state.isUsernameEditable });
        if (this.state.isUsernameEditable) {
          const user_id = this.props.user_profile.objectId;
          this.props.update_user_profile(user_id, 'username', this.state.username);
        }
        break;
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
          <h2>Profile Scene</h2>
          {this.props.editUserError ? (
            <h6 style={{ color: 'red' }}>{this.props.editUserError.error}</h6>
          ) : null}
          <Divider />
          <HorizontalSpan>
            <BoldH4>Bio :</BoldH4>
            {this.state.isBiographyEditable ? (
              <Input
                style={{ minWidth: '35em' }}
                placeholder="Biography"
                name="biography"
                value={this.state.biography}
                onChange={this.handleInputChange}
              />
            ) : (
              <p>
                &nbsp;
                {this.state.biography}
                &nbsp;
              </p>
            )}
            {this.state.isBiographyEditable ? (
              <Button onClick={() => this.toggleEdition('biography')}>Save</Button>
            ) : (
              <Icon onClick={() => this.toggleEdition('biography')} name="pencil" />
            )}
          </HorizontalSpan>
          <HorizontalSpan>
            <BoldH4>Username :</BoldH4>
            {this.state.isUsernameEditable ? (
              <Input
                style={{ minWidth: '35em' }}
                placeholder="Username"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />
            ) : (
              <p>
                &nbsp;
                {this.state.username}
                &nbsp;
              </p>
            )}
            {this.state.isUsernameEditable ? (
              <Button onClick={() => this.toggleEdition('username')}>Save</Button>
            ) : (
              <Icon onClick={() => this.toggleEdition('username')} name="pencil" />
            )}
          </HorizontalSpan>
          {/*<HorizontalSpan>
            <BoldH4>Email :</BoldH4>
            {this.state.isEmailEditable ? (
              <Input
                style={{ minWidth: '35em' }}
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            ) : (
              <p>
                &nbsp;
                {this.state.email}
                &nbsp;
              </p>
            )}
            {this.state.isEmailEditable ? (
              <Button onClick={() => this.toggleEdition('email')}>Save</Button>
            ) : (
              <Icon onClick={() => this.toggleEdition('email')} name="pencil" />
            )}
          </HorizontalSpan>*/}
        </Grid.Column>
      </Grid>
    );
  }
}

export default AccountProfileScene;
