import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Message, Icon, Modal } from 'semantic-ui-react';
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';

const connectMetaMaskCb = (signData, noMetaMaskAccountsFoundCb) => () => {
  signData(noMetaMaskAccountsFoundCb);
};

const AccountSettingsScene = props => {
  const isMetaMaskInstalled = props.hasMetaMask();
  const publicAddrAlreadyPresent = !!(props.user_profile && props.user_profile.publicAddress);
  const metaMaskButtonTxt = publicAddrAlreadyPresent ? 'MetaMask Connected' : 'Connect MetaMask';
  const onClickListener = connectMetaMaskCb(props.signData, props.noMetaMaskAccountsFoundCb);
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h2>Settings Scene</h2>
        <Button
          color="orange"
          inverted={!isMetaMaskInstalled}
          disabled={!isMetaMaskInstalled || publicAddrAlreadyPresent}
          onClick={onClickListener}
        >
          {metaMaskButtonTxt}
        </Button>
        {!isMetaMaskInstalled && (
          <Message warning>
            Please install <a href="https://metamask.io/">MetaMask</a>
          </Message>
        )}
        {props.showMetaMaskNoAccountsWarning && <Message warning>Please unlock MetaMask to connect</Message>}
      </Grid.Column>
    </Grid>
  );
};

AccountSettingsScene.propTypes = {
  user_profile: PropTypes.object,
  showMetaMaskLogin: PropTypes.bool,
  hasMetaMask: PropTypes.func.isRequired,
  signData: PropTypes.func.isRequired,
  noMetaMaskAccountsFoundCb: PropTypes.func.isRequired,
  showMetaMaskNoAccountsWarning: PropTypes.bool.isRequired,
};

AccountSettingsScene.defaultProps = {
  showMetaMaskLogin: false,
};

export default AccountSettingsScene;
