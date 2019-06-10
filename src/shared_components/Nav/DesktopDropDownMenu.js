// NPM
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { buildImgUrl } from 'libs/Utils';

// COMPONENTS
import Button from '../Button';
// COMMENT: the homeSearch is just for the time being
// ACTIONS/CONFIG

import { PStrong } from 'libs/commonStyles';
import ImgurAvatar from './../../assets/no-avatar.png';
// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div {
    margin-top: 5px;
  }
  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }

  a {
    font-size: 14px;
  }

  > div > i {
    order: 1;
  }

  .dropdown {
    display: flex;
  }
`;

const AvatarWrapper = styled.div`
  height: 38px;
  width: 38px;
  border-radius: 10px 10px 10px 0;
  background: #f7f7f7;
  overflow: hidden;
  margin-left: 15px;
  margin-top: -5px;
  order: 2;
`;

const DesktopLoggedInDropDownMenu = React.lazy(() => import('./DesktopLoggedInDropDownMenu'));

// MODULE
export default class DesktopDropDownMenu extends Component {
  trigger = () => {
    const { profilePicture } = this.props.session;
    const url = profilePicture
      ? buildImgUrl(profilePicture, { width: 38, height: 38 })
      : ImgurAvatar;
    return (
      <AvatarWrapper>
        <img className="lazyload" data-src={url} width="38px" height="38px" alt="user avatar" />
      </AvatarWrapper>
    );
  };

  logged_out() {
    return (
      <Wrap>
        <Button
          type="link"
          theme="primaryFilled"
          size="small"
          href="/login"
          borderRadius="5px 0 0 0"
        >
          Login
        </Button>
        <Button borderRadius="0 5px 5px 0" type="link" size="small" href="/register">
          Sign up
        </Button>
      </Wrap>
    );
  }

  logged_in() {
    return (
      <Wrap>
        <Button
          type="link"
          theme="primaryFilled"
          size="small"
          href={{
            pathname: '/planner/create',
            state: {
              modal: true,
            },
          }}
        >
          <PStrong>Create Trip</PStrong>
        </Button>
        <Suspense fallback={this.trigger()}>
          <DesktopLoggedInDropDownMenu {...this.props} trigger={this.trigger} />
        </Suspense>
      </Wrap>
    );
  }

  render() {
    if (this.props.session.username) {
      return this.logged_in();
    } else {
      return this.logged_out();
    }
  }
}
