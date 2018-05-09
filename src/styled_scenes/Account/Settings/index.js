import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Message, Icon } from 'semantic-ui-react';
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';

const AccountSettingsScene = props => {
  const isMetaMaskInstalled = props.hasMetaMask();

  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h2>Settings Scene</h2>
        <Button color="orange" inverted={!isMetaMaskInstalled} disabled={!isMetaMaskInstalled}>
          Login With MetaMask
        </Button>
        {!isMetaMaskInstalled && (
          <Message warning>
            Please install <a href="https://metamask.io/">MetaMask</a>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

AccountSettingsScene.propTypes = {
  user: PropTypes.object,
  showMetaMaskLogin: PropTypes.bool,
  hasMetaMask: PropTypes.func.isRequired,
};

AccountSettingsScene.defaultProps = {
  showMetaMaskLogin: false,
};

export default AccountSettingsScene;
