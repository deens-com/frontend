import React from 'react';
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

const AccountSettingsScene = props => {
  const isMetaMaskInstalled = props.hasMetaMask();
  const publicAddrAlreadyPresent = !!(props.user_profile && props.user_profile.metamaskPublicAddress);
  const ledgerPublicAddrAlreadyPresent = !!(props.user_profile && props.user_profile.ledgerPublicAddress);
  const metaMaskButtonTxt = publicAddrAlreadyPresent ? 'MetaMask Connected' : 'Connect MetaMask';
  const ledgerButtonTxt = ledgerPublicAddrAlreadyPresent ? 'Ledger Connected' : 'Connect Ledger';
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h2>Settings Scene</h2>
        <MetamaskButton
          color="orange"
          inverted={!isMetaMaskInstalled}
          disabled={!isMetaMaskInstalled || publicAddrAlreadyPresent}
          onClick={props.signData}
        >
          {metaMaskButtonTxt}
        </MetamaskButton>
        {!isMetaMaskInstalled && (
          <Message warning>
            Please install <a href="https://metamask.io/">MetaMask</a>
          </Message>
        )}
        {props.metaMaskError.message && <Message warning>{props.metaMaskError.message}</Message>}
        <MetamaskButton
          color="green"
          disabled={ledgerPublicAddrAlreadyPresent}
          onClick={props.ledgerSignData}
        >
          {ledgerButtonTxt}
        </MetamaskButton>
        {props.ledger_error.message && <Message warning>{props.ledger_error.message}</Message>}
      </Grid.Column>
    </Grid>
  );
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
