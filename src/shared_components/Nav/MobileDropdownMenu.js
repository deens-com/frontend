// NPM
import React, {Component} from "react";
import styled from "styled-components";
import fetch_helpers from "./../../libs/fetch_helpers";
import Parse from "parse";
import Media from 'react-media';
// COMPONENTS

// COMMENT: the homeSearch is just for the time being
import { Image } from 'semantic-ui-react';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import ImgurAvatar from "./../../assets/imgur-avatar.png";

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

  constructor(props){
    super(props);
    this.state = {
      logged_in: false,
      current_user: {}
    }
  }

  componentDidMount(){
    let user = Parse.User.current();
    if(user === null){
      this.setState({logged_in: false});
    }else{
      const json_user = fetch_helpers.normalizeParseResponseData(user);
      this.setState({logged_in: true, current_user: json_user});
    }
  }

  render(){
    const dpUrl = (this.state.current_user.profilePicture && this.state.current_user.profilePicture.url) || ImgurAvatar;

    if (!this.state.logged_in) {
      return null;
    }

    return (
      <Media query={`(max-width: ${sizes.large})`}>
        <AvatarWithUsername
          onClick={this.props.toggleProfileMenu}
          className={`${this.props.dark && "dark"} ${this.props.hide && "hidden"} ${this.props.avatarOnly && "avatar-only"}`}
          >
          <Image src={dpUrl} circular />
          {!this.props.avatarOnly &&
            this.state.current_user.username
          }
        </AvatarWithUsername>
      </Media>
    )
  }
}
