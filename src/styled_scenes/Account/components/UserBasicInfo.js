import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import CircularProfilePic from './CircularProfilePic';
import Stars from './Stars';
import { Link } from 'react-router-dom';
import CustomButton from 'shared_components/Button';
import { Menu, Card, Button, Input } from 'semantic-ui-react';
import ImgurAvatar from './../../../assets/no-avatar.png';
import PlsIcon from 'assets/ic_pls.png';
import NumberFormat from 'react-number-format';
import { websiteUrl } from 'libs/config';

const AttributeTitle = styled.h6`
  font-size: 9px;
  color: #a3a9b2;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

const CopyButton = styled(Input)`
  button.button {
    background: #38d39f;
    color: white;
  }
`;

const Wrapper = styled.div`
  //text-align: center;
  padding: 30px 0px 30px 0px;
`;

const NameDiv = styled.div`
  text-align: center;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 24px;
  font-weight: 600;
`;

const MenuIcon = styled(Icon)`
  color: #5fb79e;
`;

const BuyTokens = styled.div`
  text-align: center;
`;

const FileInputWrapper = styled.div`
  margin-top: 5px;
  height: 40px;
  overflow: hidden;
  position: relative;
  > input[type='file'] {
    font-size: 200px;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
  }
  > .btn-file-input {
    display: inline-block;
    width: 200px;
    height: 40px;
  }
`;

const PlsIconWrapper = styled.span`
  position: relative;
  left: 0.3em;
  top: 0.15em;
`;

const PlsBalanceWrapper = styled.span``;

class UserBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureUploadError: '',
      balanceCurrency: 'PLS',
      copyButtonText: 'Copy',
    };
  }

  scrollDownMobileOnly = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth <= 750) {
      setTimeout(() => {
        window.scrollBy(0, 520);
      }, 20);
    }
  };

  onFileSelect = e => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    if (file.size > 3000000) {
      this.setState({ pictureUploadError: 'File size should not exceed 3 Mb' });
      return;
    }
    this.props.update_user_avatar(file);
  };

  showUsdBalance = e => {
    this.setState({ balanceCurrency: 'USD' });
  };

  showPlsBalance = e => {
    this.setState({ balanceCurrency: 'PLS' });
  };

  copyButtonHandler = () => {
    this.setState({ copyButtonText: 'Copied' });

    copy(`${websiteUrl}/register?ref=${this.props.user_profile.myReferralCode}`);
  };

  render() {
    const name = this.props.user_profile.fullName || this.props.user_profile.username;
    const dpUrl = this.props.user_profile.profilePicture || ImgurAvatar;
    let activePath = this.props.match.path.replace('/account/', '');
    return (
      <Card>
        <Wrapper>
          {this.state.pictureUploadError.length > 0 && (
            <p style={{ textAlign: 'center', color: 'red' }}>{this.state.pictureUploadError}</p>
          )}
          <CircularProfilePic src={dpUrl} />
          {activePath === 'profile' && (
            <CenteredDiv>
              <FileInputWrapper>
                <Button circular className="btn-file-input">
                  Update avatar
                </Button>
                <input
                  type="file"
                  name="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={this.onFileSelect}
                />
              </FileInputWrapper>
            </CenteredDiv>
          )}
          <Link to={'/users/' + this.props.user_profile.username}>
            {name && <NameDiv>{name}</NameDiv>}
          </Link>

          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <div>
                  <AttributeTitle>PLS Balance</AttributeTitle>
                  <PlsBalanceWrapper
                    onMouseEnter={this.showUsdBalance}
                    onMouseLeave={this.showPlsBalance}
                  >
                    {this.state.balanceCurrency === 'PLS' ? (
                      <span>
                        <NumberFormat
                          value={this.props.user_profile.plsBalance || 0}
                          thousandSeparator={true}
                          displayType={'text'}
                          decimalScale={2}
                        />
                        <PlsIconWrapper>
                          <img src={PlsIcon} alt="plsIcon" />
                        </PlsIconWrapper>
                      </span>
                    ) : (
                      <span>
                        <NumberFormat
                          value={this.props.user_profile.plsBalance * 0.036 || 0}
                          thousandSeparator={true}
                          suffix={' USD'}
                          displayType={'text'}
                          decimalScale={2}
                        />
                      </span>
                    )}
                  </PlsBalanceWrapper>
                </div>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <div>
                  <AttributeTitle>RATING</AttributeTitle>
                  <Stars rating={this.props.user_profile.rating} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <br />
          <BuyTokens>
            <CustomButton theme="fillLightGreen" fontSize={12} type="link" href="/token-sale">
              Buy tokens
            </CustomButton>
          </BuyTokens>
          <br />
          <Menu secondary fluid vertical style={{ paddingLeft: '10px' }}>
            <Link to="/account/trips/all" onClick={this.scrollDownMobileOnly}>
              <Menu.Item name="trips" active={activePath === 'trips'}>
                <MenuIcon disabled name="angle right" circular />
                <span>
                  <MenuIcon disabled name="plane" circular />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; My Trips
                </span>
              </Menu.Item>
            </Link>

            <Link to="/account/services" onClick={this.scrollDownMobileOnly}>
              <Menu.Item name="services" active={activePath === 'services'}>
                <MenuIcon disabled name="angle right" circular />
                <span>
                  <MenuIcon disabled name="list" circular />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; My Services
                </span>
              </Menu.Item>
            </Link>

            <Link to="/account/profile" onClick={this.scrollDownMobileOnly}>
              <Menu.Item name="profile" active={activePath === 'profile'}>
                <MenuIcon disabled name="angle right" circular />
                <span>
                  <MenuIcon disabled name="user" circular />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Profile
                </span>
              </Menu.Item>
            </Link>

            <div style={{ cursor: 'pointer' }} onClick={this.props.logOut}>
              <Menu.Item name="logout" active={activePath === 'logout'}>
                <MenuIcon disabled name="angle right" circular />
                <span>
                  <MenuIcon disabled name="power" circular />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Logout
                </span>
              </Menu.Item>
            </div>

            <div>
              <br />
              <br />
              <center>
                Your referral code:
                <CopyButton>
                  <input value={this.props.user_profile.myReferralCode} />
                  <Button
                    type="submit"
                    icon="copy"
                    size="mini"
                    labelPosition="left"
                    content={this.state.copyButtonText}
                    onClick={this.copyButtonHandler}
                  />
                </CopyButton>
                <br />
                <br />
                {this.props.user_profile.referralInfo && (
                  <small>
                    There are {this.props.user_profile.referralInfo.usersWhoSignedUp} users that
                    signed up with your referral code.
                  </small>
                )}
              </center>
            </div>
          </Menu>
        </Wrapper>
      </Card>
    );
  }
}
export default withRouter(UserBasicInfo);
