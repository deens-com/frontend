import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { CopyToClipboard } from 'shared_components/icons';
import { Popup } from 'semantic-ui-react';
import etherScanLogo from '../images/etherscan.png';

const Wrapper = styled.div`
  max-width: 650px;
  margin: 30px auto;
  text-align: center;
  border-radius: 5px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3), -1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const BaseWrapper = styled.div`
  padding: 30px 100px;
  > p {
    line-height: 1.2;
    > strong {
      font-weight: bold;
    }
  }
`;

const WalletWrapper = styled(BaseWrapper)`
  background-color: #d2ecf1;
  padding: 30px 100px;
  display: flex;
  flex-direction: column;
`;

const WalletContent = styled.div`
  max-width: 300px;
  margin: auto;
`;

const WalletTitle = styled.h2`
  color: #12545f;
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const AddressInput = styled.input`
  padding: 15px 30px;
  border: 1px solid #a7cfd6;
  border-radius: 5px;
  color: #58939d;
  background-color: #d2ecf1;
  margin-top: 15px;
`;

const ChangeAddress = styled.p`
  font-size: 12px;
  color: 12545f;
  margin-top: 15px;
  a {
    color: #38d39f;
  }
`;

const AdviceWrapper = styled(BaseWrapper)`
  background-color: #eaf6f8;
  color: #12545f;
`;

const ContractWrapper = styled(BaseWrapper)`
  background-color: #38d39f;
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 15px;
    color: white;
  }
  p {
    color: #076445;
    font-size: 14px;
  }
`;

const PleaseAddress = styled.div`
  padding: 0 10px;
  border: 1px solid #a7cfd6;
  border-radius: 5px;
  color: #58939d;
  background-color: #d2ecf1;
  margin: 15px auto;
  background: white;
  max-width: 330px;
  display: flex;
  align-items: center;
  > input {
    color: #38d39f;
    background: white;
    border: 0;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
    margin: 10px 0;
    outline: 0;
  }
`;

const CopyIcon = styled.div`
  color: #c4c4c4;
  flex-shrink: 1;
  justify-self: flex-end;
  cursor: pointer;
  &:hover {
    color: #12545f;
  }
`;

const EtherScanWrapper = styled(BaseWrapper)`
  background-color: white;
`;

const CheckContract = styled.div`
  color: #6e7885;
  font-size: 12px;
`;

const LogoWrapper = styled.div`
  width: 160px;
  background-color: white;
  border-radius: 50px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3), 0 0px 2px rgba(0, 0, 0, 0.3);
  padding: 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px auto 35px;
  > img {
    width: 100%;
  }
`;

const ContractDetails = styled.div`
  font-size: 18px;
  strong {
    font-weight: bold;
  }
`;

const Footer = styled.div`
  width: 400px;
  margin: 44px auto;
  text-align: center;
  strong {
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

export default class BuyTokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedToClipboard: false,
    };

    this.addressRef = React.createRef();
  }

  onCopy = () => {
    const input = this.addressRef.current;
    input.focus();
    input.select();
    document.execCommand('copy');
    this.setState({ copiedToClipboard: true });
    setTimeout(() => this.setState({ copiedToClipboard: false }), 2000);
  };

  render() {
    return (
      <React.Fragment>
        <Wrapper>
          <WalletWrapper>
            <WalletContent>
              <WalletTitle>Your wallet address</WalletTitle>
              <AddressInput disabled value="0x..." />
              <ChangeAddress>
                In order to change your address please contact us at{' '}
                <a href="mailto:contribute@please.com">contribute@please.com</a>
              </ChangeAddress>
            </WalletContent>
          </WalletWrapper>
          <AdviceWrapper>
            <p>
              Make sure you keep your private keys for the address used to send ether to the
              contract safe and secure, this will be the address that will hold your PLS tokens.
              Please do not send ether to Please.com crowdfunding contract from wallets hosted by
              exchanges, make sure you always use your private key.
            </p>
          </AdviceWrapper>
          <ContractWrapper>
            <h2>Contract address</h2>
            <PleaseAddress>
              <input ref={this.addressRef} value="pleasetokensale.eth" />
              <Popup
                trigger={
                  <CopyIcon>
                    <CopyToClipboard />
                  </CopyIcon>
                }
                content="Copied to clipboard"
                inverted
                on="click"
                open={this.state.copiedToClipboard}
                position="bottom center"
                onOpen={this.onCopy}
              />
            </PleaseAddress>
            <p>
              <strong>This is the only address to contribute. It will never change.</strong> Do not
              send to any other address. Do not trust anybody else, even our social media accounts
              giving you another address.
            </p>
          </ContractWrapper>
          <EtherScanWrapper>
            <CheckContract>Check contract code on</CheckContract>
            <LogoWrapper>
              <img src={etherScanLogo} alt="EtherScan" />
            </LogoWrapper>
            <ContractDetails>
              Minimum Contribution <strong>0.01 ETH</strong>
              <br />
              Gas Limit <strong>120’000</strong>
            </ContractDetails>
          </EtherScanWrapper>
        </Wrapper>
        <Footer>
          <p>
            <strong>
              To see your PLS balance in MyEtherWallet and Mist you should manually add it to your
              wallet. Use the following information:
            </strong>
          </p>
          <p>Address: 0x...</p>
          <p>Decimals: 18</p>
          <p>Symbol: PLS </p>
        </Footer>
      </React.Fragment>
    );
  }
}
