// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import Media from 'react-media';
import { env } from 'libs/config';

// COMPONENTS

// COMMENT: the homeSearch is just for the time being
import { Image } from 'semantic-ui-react';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import ImgurAvatar from './../../assets/imgur-avatar.png';

// STYLES
const AvatarWithUsername = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  z-index: 23;

  &.dark {
    color: #3c434b;
  }

  &.hidden {
    display: none;
  }

  &.avatar-only {
    right: 65px;
    top: 18px;
  }

  @media all and (min-width: ${sizes.medium}) {
    top: 30px;
  }

  img.image {
    display: inline-block;
    height: 30px;
    width: 30px;
    margin-right: 10px;
  }
`;

// MODULE
export default class MobileDropDownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      current_user: {},
    };
  }

  componentDidMount() {
    try {
      const localSession = localStorage.getItem(`please-${env}-session`);
      if (localSession) {
        const jsonUser = JSON.parse(localSession);
        this.setState({ logged_in: true, current_user: jsonUser });
      } else {
        this.setState({ logged_in: false });
      }
    } catch (error) {
      this.setState({ logged_in: false });
    }
  }

  render() {
    const dpUrl =
      (this.state.current_user.profilePicture && this.state.current_user.profilePicture.url) ||
      ImgurAvatar;

    if (!this.state.logged_in) {
      return null;
    }

    return (
      <Media query={`(max-width: ${sizes.large})`}>
        <AvatarWithUsername
          onClick={this.props.toggleProfileMenu}
          className={`${this.props.dark && 'dark'} ${this.props.hide && 'hidden'} ${this.props
            .avatarOnly && 'avatar-only'}`}
        >
          <Image src={dpUrl} circular />
          {!this.props.avatarOnly && this.state.current_user.username}
        </AvatarWithUsername>
      </Media>
    );
  }
}
