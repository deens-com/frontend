import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react'

const TeaserContainer = styled.div`
  background: #FFC30B;
  color: white;
  font-size: 15px;
  padding: 10px 50px 10px 10px;

  a {
    color: white;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export default class GlobalTeaser extends Component {

  state = {
    teaserIsVisible: true,
  };

  componentDidMount(){
    if (typeof localStorage !== "undefined" && localStorage.getItem('teaser') === "false") {
      this.setState({teaserIsVisible: false});
    }
  }

  closeTeaser = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem('teaser', false);
    }
    this.setState({teaserIsVisible: false});
  }

  render(){
    if(!this.state.teaserIsVisible) return null;

    return (
      <TeaserContainer>
        Thank you for trying our <strong>demo</strong> website. We added <strong>sample data</strong> for
        &nbsp;<a href="/#/results?latitude=48.856614&longitude=2.3522219000000177&address=Paris,%20France">Paris</a>,
        &nbsp;<a href="/#/results?latitude=51.5073509&longitude=-0.1277583&address=London,%20UK">London</a>,
        &nbsp;<a href="/#/results?latitude=40.7127753&longitude=-74.0059728&address=New%20York,%20NY,%20USA">New York</a> and
        &nbsp;<a href="/#/results?latitude=37.7749295&longitude=-122.4194155&address=San%20Francisco,%20CA,%20USA">San Francisco</a>, please try searching in these cities! <strong>You cannot book anything for real</strong>. If you use Ledger or Metamask, make sure to connect to <strong>Ropsten test network</strong>.&nbsp;
        <a href="https://vision.please.com" target="_blank" rel="noopener noreferrer">Learn more about Please</a>

        <CloseButton>
          <Icon link name='close' size='large' onClick={this.closeTeaser}/>
        </CloseButton>
      </TeaserContainer>
    );
  }
}
