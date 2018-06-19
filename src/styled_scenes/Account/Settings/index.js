import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Message } from 'semantic-ui-react';
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';
import styled from "styled-components";
import { media } from '../../../libs/styled';

const MetamaskButton = styled(Button)`
  display: none !important;
  ${media.mobileMinSmall} {
    display: inline-block !important;
  }
`;

const MetaMaskErrorMessage = styled(Message)`
  display: none;
  ${media.mobileMinSmall} {
    display: block !important;
  }
`;

const InlineSpan = styled.span`
  display: inline-flex;
`;

const HeightenedButton = styled(Button)`
  position: relative;
  bottom: 7px;
`;

class AccountSettingsScene extends Component {
  constructor(props){
    super(props);
    this.state = {
      metamaskEthBalance: 0,
      ledgerEthBalance: 0,
      metamaskFaucetTransaction: undefined,
      ledgerFaucetTransaction: undefined,
      metamaskFaucetRequested: false,
      ledgerFaucetRequested: false,
      faucetRequestError: ''
    };
  }
  componentWillReceiveProps(nextProps){
    if(this.props.user_profile !== nextProps.user_profile){
      if(nextProps.user_profile.metamaskPublicAddress){
        const url = "https://api-ropsten.etherscan.io/api?module=account&action=balance&address=" + nextProps.user_profile.metamaskPublicAddress + "&tag=latest&apikey=RUTM2Q3ZP65U8UJQUD9GUZU2GZHQ363FYC";
        fetch(url).then(res => {
          return res.json();
        }).then(json_res => {
          const gweiBalance = json_res.result;
          const ethBalance = gweiBalance / 10**18;
          this.setState({metamaskEthBalance: ethBalance});
        })
      }
      if(nextProps.user_profile.ledgerPublicAddress){
        const url = "https://api-ropsten.etherscan.io/api?module=account&action=balance&address=" + nextProps.user_profile.ledgerPublicAddress + "&tag=latest&apikey=RUTM2Q3ZP65U8UJQUD9GUZU2GZHQ363FYC";
        fetch(url).then(res => {
          return res.json();
        }).then(json_res => {
          const gweiBalance = json_res.result;
          const ethBalance = gweiBalance / 10**18;
          this.setState({ledgerEthBalance: ethBalance});
        })
      }

    }
  }
  handleFetchErrors = (response) => {
    if(!response.ok){
      this.setState({faucetRequestError: "We're sorry but something went wrong with your faucet request. Please try again later."})
    }else{
      return response;
    }
  }
  requestFaucetEther = (address, type) => {
    if(type === 'ledger'){
      this.setState({ledgerFaucetRequested: true})
    }
    if(type === 'metamask'){
      this.setState({metamaskFaucetRequested: true})
    }
    fetch('https://faucet.metamask.io', {
     method: 'post',
     headers: {'Content-Type':'application/rawdata'},
     body: address
   }).then(this.handleFetchErrors).then(res => {
     return res.text();
   }).then(txt_res => {
     console.log(txt_res)
     if(type === 'metamask'){
       this.setState({metamaskFaucetTransaction: txt_res});
     }
     if(type === 'ledger'){
       this.setState({ledgerFaucetTransaction: txt_res});
     }
   }).catch(error => {
     console.log(error);
   });
  }
  render(){
    const isMetaMaskInstalled = this.props.hasMetaMask();
    const publicAddrAlreadyPresent = !!(this.props.user_profile && this.props.user_profile.metamaskPublicAddress);
    const ledgerPublicAddrAlreadyPresent = !!(this.props.user_profile && this.props.user_profile.ledgerPublicAddress);
    const metaMaskButtonTxt = publicAddrAlreadyPresent ? 'MetaMask Connected' : 'Connect MetaMask';
    const ledgerButtonTxt = ledgerPublicAddrAlreadyPresent ? 'Ledger Connected' : 'Connect Ledger';
    return (
      <Grid centered columns={2}>
        <Grid.Column mobile={16} tablet={5} computer={4}>
          <SectionWrap>
            <UserBasicInfo {...this.props} />
          </SectionWrap>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={11} computer={12}>
          {this.state.faucetRequestError && <Message error>{this.state.faucetRequestError}</Message>}
          <h2>Settings</h2>
          <MetamaskButton
            color="orange"
            inverted={!isMetaMaskInstalled}
            disabled={!isMetaMaskInstalled || publicAddrAlreadyPresent}
            onClick={this.props.signData}
          >
            {metaMaskButtonTxt}
          </MetamaskButton>
          {!isMetaMaskInstalled && (
            <MetaMaskErrorMessage warning>
              Please install <a href="https://metamask.io/">MetaMask</a>
            </MetaMaskErrorMessage>
          )}
          {this.props.metaMaskError.message && <Message warning>{this.props.metaMaskError.message}</Message>}
          <MetamaskButton
            color="green"
            disabled={ledgerPublicAddrAlreadyPresent}
            onClick={this.props.ledgerSignData}
          >
            {ledgerButtonTxt}
          </MetamaskButton>
          {this.props.ledger_error.message && <Message warning>{this.props.ledger_error.message}</Message>}
          {
            this.props.user_profile && this.props.user_profile.metamaskPublicAddress &&
            <section>
              <br/>
              <h4>Metamask ETH Address</h4>
              <p><a target="_blank" href={'https://ropsten.etherscan.io/address/' + this.props.user_profile.metamaskPublicAddress}>{this.props.user_profile.metamaskPublicAddress}</a></p>
              <h4>Metamask ETH Balance</h4>
              <InlineSpan>
                <p>{this.state.metamaskEthBalance} ETH</p>&nbsp;&nbsp;
                <HeightenedButton disabled={this.state.metamaskFaucetRequested} onClick={() => this.requestFaucetEther(this.props.user_profile.metamaskPublicAddress, 'metamask')}>Request Ether</HeightenedButton>
              </InlineSpan>
              {
                this.state.metamaskFaucetTransaction &&
                <div>
                  Faucet request was successful : &nbsp;
                  <a target="_blank" href={'https://ropsten.etherscan.io/tx/' + this.state.metamaskFaucetTransaction}>{this.state.metamaskFaucetTransaction}</a>
                </div>
              }
            </section>
          }
          {
            this.props.user_profile && this.props.user_profile.ledgerPublicAddress &&
            <section>
              <br/>
              <h4>Ledger ETH Address</h4>
              <p><a target="_blank" href={`https://ropsten.etherscan.io/address/` + this.props.user_profile.ledgerPublicAddress}>{this.props.user_profile.ledgerPublicAddress}</a></p>
              <h4>Ledger ETH Balance</h4>
              <InlineSpan>
                <p>{this.state.ledgerEthBalance} ETH</p>&nbsp;&nbsp;
                <HeightenedButton disabled={this.state.ledgerFaucetRequested} onClick={() => this.requestFaucetEther(this.props.user_profile.ledgerPublicAddress, 'ledger')}>Request Ether</HeightenedButton>
              </InlineSpan>
              {
                this.state.ledgerFaucetTransaction &&
                <div>
                  Faucet request was successful : &nbsp;
                  <a target="_blank" href={'https://ropsten.etherscan.io/tx/' + this.state.ledgerFaucetTransaction}>{this.state.ledgerFaucetTransaction}</a>
                </div>
              }
            </section>
          }
        </Grid.Column>
      </Grid>
    );
  }
};

AccountSettingsScene.propTypes = {
  user_profile: PropTypes.object,
  showMetaMaskLogin: PropTypes.bool,
  hasMetaMask: PropTypes.func.isRequired,
  signData: PropTypes.func.isRequired,
  ledgerSignData: PropTypes.func.isRequired,
  metaMaskError: PropTypes.object,
  ledger_error: PropTypes.object,
};

AccountSettingsScene.defaultProps = {
  showMetaMaskLogin: false,
  metaMaskError: {},
  ledger_error: {}
};

export default AccountSettingsScene;
