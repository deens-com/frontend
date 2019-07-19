import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import copy from 'copy-to-clipboard';
import { websiteUrl } from 'libs/config';
import StyledInput from 'shared_components/StyledInput';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  text-align: center;
`;

const Referral = styled.div`
  text-align: center;
`;

const CopyButton = styled.div`
  text-align: center;
`;

const InputWrap = styled.div`
  width: 230px;
  display: inline-block;
  margin-right: 10px;
`;

const buttonText = 'Copy';

export default class ReferAFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyButtonText: buttonText,
    };
  }
  copyButtonHandler = () => {
    this.setState({ copyButtonText: 'Copied' });

    copy(`${websiteUrl}/register?ref=${this.props.userProfile.myReferralCode}`);
    setTimeout(this.copiedTimeout, 2500);
  };

  copiedTimeout = () => {
    this.setState({ copyButtonText: buttonText });
  };

  render() {
    return (
      <Wrapper>
        <Referral>
          <Trans>Your referral code</Trans>:
          <CopyButton>
            <InputWrap>
              <StyledInput value={this.props.userProfile.myReferralCode} />
            </InputWrap>
            <Button type="submit" icon="copy" labelPosition="left" onClick={this.copyButtonHandler}>
              {this.state.copyButtonText}
            </Button>
          </CopyButton>
        </Referral>
        {this.props.userProfile.referralInfo && (
          <small>
            <Trans>
              {this.props.userProfile.referralInfo.usersWhoSignedUp} users signed up with your
              referral code.
            </Trans>
          </small>
        )}
      </Wrapper>
    );
  }
}
