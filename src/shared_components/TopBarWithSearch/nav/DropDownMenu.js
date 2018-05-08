// NPM
import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";

import fetch_helpers from "./../../../libs/fetch_helpers";
import Parse from "parse";
// COMPONENTS
import Button from "../../../shared_components/Button";
// COMMENT: the homeSearch is just for the time being
import HomeSearch from "../../../styled_scenes/Home/components/HomeSearch";
import { Image } from 'semantic-ui-react';

// ACTIONS/CONFIG
import { sizes, media } from "../../../libs/styled";
import { Dropdown } from 'semantic-ui-react';

import history from "./../../../main/history";

// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  padding-left: 15px;

  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div:first-child {
    margin-right: 15px;
  }

  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const AvatarWrapper = styled.div`
  height: 30px;
  width: 30px;
`;

// MODULE
export default class DropDownMenu extends Component {

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
      this.setState({logged_in: true, current_user: {}});
      history.push("/");
    });
  }

  navigate_to = (path) => {
    history.push(path);
  }

  logged_out() {
    return(
      <Wrap>
        <Button type="link" theme="white" round size="small" href="/login">
          Login
        </Button>
        <Button
          type="link"
          theme="mainFilled"
          round
          size="small"
          href="/register"
        >
          Sign up
        </Button>
      </Wrap>
    )
  }

  logged_in() {
    const dpUrl = (this.state.current_user.profilePicture && this.state.current_user.profilePicture.url) || 'https://imgur.com/download/4iTD3lS';
    return(
      <Wrap>
        <AvatarWrapper>
          <Image src={dpUrl} circular onClick={() => this.navigate_to("/account/profile")} />
        </AvatarWrapper>
        <Dropdown direction="left" text={this.state.current_user.username}>
          <Dropdown.Menu>
            <Dropdown.Item icon='plane' text='My Trips' onClick={() => this.navigate_to("/account/trips/planned")} />
            <Dropdown.Item icon='list' text='My Services' onClick={() => this.navigate_to("/account/services")} />
            <Dropdown.Item icon='user' text='Profile' onClick={() => this.navigate_to("/account/profile")} />
            <Dropdown.Item icon='cogs' text='Settings' onClick={() => this.navigate_to("/account/settings")} />
            <Dropdown.Divider />
            <Dropdown.Item text='Logout' onClick={this.logout} />
          </Dropdown.Menu>
        </Dropdown>
      </Wrap>
    )
  }

  render(){
    if(!this.state.logged_in){
      return (
        this.logged_out()
      )
    }else{
      return (
        this.logged_in()
      )
    }
  }
}

// Props Validation
// DropDownMenu.propTypes = {
//
// };
