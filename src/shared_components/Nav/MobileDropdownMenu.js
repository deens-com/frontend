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
import history from "./../../main/history";

// STYLES
const AvatarWithUsername = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  text-align: center;
  cursor: pointer;

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

  logout = () => {
    Parse.User.logOut().then(() => {
      this.setState({logged_in: false, current_user: {}});
      history.push("/");
    });
  }

  render(){
    const dpUrl = (this.state.current_user.profilePicture && this.state.current_user.profilePicture.url) || 'https://imgur.com/download/4iTD3lS';

    return (
      <Media query={`(max-width: ${sizes.large})`}>
        <AvatarWithUsername onClick={this.props.toggleProfileMenu}>
          <Image src={dpUrl} circular />
          {this.state.current_user.username}
        </AvatarWithUsername>
      </Media>
    )
  }
}
