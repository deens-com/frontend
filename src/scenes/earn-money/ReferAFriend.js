import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import copy from 'copy-to-clipboard';
import { websiteUrl } from 'libs/config';
import StyledInput from 'shared_components/StyledInput';

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

    copy(`${websiteUrl}/register?ref=${this.props.userProfile.referral}`);
    setTimeout(this.copiedTimeout, 2500);
  };

  copiedTimeout = () => {
    this.setState({ copyButtonText: buttonText });
  };

  render() {
    return (
      <Wrapper>
        <Referral>
          Your referral code:
          <CopyButton>
            <InputWrap>
              <StyledInput value={this.props.userProfile.referral} />
            </InputWrap>
            <Button type="submit" icon="copy" labelPosition="left" onClick={this.copyButtonHandler}>
              {this.state.copyButtonText}
            </Button>
          </CopyButton>
        </Referral>
        {this.props.userProfile.referralInfo && (
          <small>
            There are {this.props.userProfile.referralInfo.usersWhoSignedUp} users that signed up
            with your referral code.
          </small>
        )}
      </Wrapper>
    );
  }
}
