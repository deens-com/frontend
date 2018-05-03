// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Media from "react-media";
import history from './../../../main/history';
import { Message } from 'semantic-ui-react';

// COMPONENTS
import { ArrowIcon, MicrophoneIcon, SearchIcon } from "../../../shared_components/icons";
import waveGif from './../../../assets/wave.gif';
// ACTIONS/CONFIG
import { media, resetButton } from "../../../libs/styled";

import annyang from 'annyang';
import * as results_actions from "./../../../scenes/results/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// STYLES
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  max-width: 650px;
  padding-right: 25px;
`;

const Inner = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  border: solid 1px ${props => (props.inFocus ? "#4fb798" : "#eef1f4")};
  display: flex;
  flex: 1;
  height: 48px;
  padding: 8px 12px;
  transition: border 0.1s ease-in;
  width: 100%;
`;

const IconButton = styled.button`
  ${resetButton()};
  color: ${props => (props.active ? "#50a18a" : "#d3d7dc")};
  font-size: 24px;
  height: 26px;
  margin-right: 8px;
  width: 26px;

  &:last-child {
    margin-right: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  background: none;
  border: none;
  display: inline-block;
  flex: 1;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  margin-right: 15px;
  outline: none;
  width: 100%;
`;

const ArrowWrap = styled.span`
  color: #50a18a;
  display: inline-block;
  height: 16px;
  margin-left: 7px;
  margin-right: 3px;
  width: 16px;
`;

const SubmitButton = styled.button`
  ${resetButton({
    fontWeight: "500"
  })};
  align-items: center;
  color: #4fb798;
  display: flex;
  width: auto;
`;

// MODULE
class DesktopSearch extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      mode: "text",
      inFocus: false,
      show_wave_gif: false,
      show_banner: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.activate_annyang = this.activate_annyang.bind(this);
  }
  onFocus() {
    this.setState({ inFocus: true });
  }
  onBlur() {
    this.setState({ inFocus: false });
  }
  handleInputChange(ev) {
    this.setState({ search: ev.target.value });
  }
  handleSubmit(ev) {
    ev.preventDefault();
    this.props.fetch_results({speech_query: this.state.search});
    this.props.toggleSearch();
  }
  activate_annyang(){
    let that = this;
    if(annyang){
       this.show_gif();
       annyang.addCallback('result', speech => {
         annyang.abort();
         that.hide_gif();
         this.setState({search: speech[0]});
         console.log("The user may have said : ", speech);
         this.props.fetch_results({speech_query: speech[0]});
       });
       annyang.addCallback('soundstart', function() {
          that.reset_search_state();
       });
       /* To consider : https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-can-i-do-to-make-speech-recognition-results-return-faster */
       annyang.start({ autoRestart: true, continuous: false });
     }else{
       this.setState({show_banner: true});
       console.log("Your browser does not support speech recognition.");
     }
  }
  reset_search_state(){
    this.setState({search: ""});
  }
  show_gif(){
    this.setState({show_wave_gif: true});
  }
  hide_gif(){
    this.setState({show_wave_gif: false});
  }
  handleDismiss = () => {
    this.setState({ show_banner: false });
  }
  render() {
    return (
      <Wrapper inFocus={this.state.inFocus}>
        <Inner>
          <div>
            <IconButton onClick={this.activate_annyang} active={this.state.mode === "voice"}>
              <MicrophoneIcon />
            </IconButton>
            <IconButton active={this.state.mode === "text"}>
              <SearchIcon />
            </IconButton>
          </div>
          <Form onSubmit={this.handleSubmit}>
          {
            this.state.show_wave_gif
            ? <img src={waveGif} alt="wave" style={{"maxHeight": "50px", "marginRight": "15px"}} />
            : null
          }
            <Input
              ref={el => {
                this.input = el;
              }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.state.search}
              onChange={this.handleInputChange}
              type="text"
              placeholder={this.state.show_wave_gif ? "" : "Tell us about your dream stay"}
            />

            <SubmitButton type="submit">
              <span>Let's go</span>
              <ArrowWrap>
                <ArrowIcon />
              </ArrowWrap>
            </SubmitButton>
          </Form>
        </Inner>
        {
          this.state.show_banner &&
          <Message color="red" onDismiss={this.handleDismiss} style={{position: "fixed", bottom: "5px", left: "5px"}}>
            <Message.Header>
              Warning !
            </Message.Header>
            <p>
              Your browser does not support voice recognition so we have disabled it on this website. Please use a compatible desktop browser like Chrome (<a href='https://www.google.com/chrome/'>https://www.google.com/chrome/</a>)
            </p>
          </Message>
        }
      </Wrapper>
    );
  }
}


const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DesktopSearch);

// Props Validation
DesktopSearch.propTypes = {};
