import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'semantic-ui-react';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  flex: 1;
  order: -1;
  padding-top: 30px;
  color: #3c434b;
  font-size: 14px;
  width: 320px;
  margin: auto;
  text-align: left;
  > div {
    font-weight: bold;
    margin: auto;
    display: flex !important;
    justify-content: center;
  }
`;

const ButtonWrapper = styled.span`
  margin: 10px auto;
  display: block;
  text-align: center;
`;

class TermsAgreement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreed: false,
    };
  }

  onChange = (event, data) => {
    this.setState({
      agreed: data.checked,
    });
  };

  render() {
    return (
      <Wrapper>
        <p>I’m not a citizen or resident of restricted country.</p>
        <p>I make a contribution in my own name and on my own account.</p>
        <p>My wallet address is ERC20 compatible and NOT an exchange wallet.</p>
        <p>
          I hereby agree to the terms and conditions of Deens.com and have read the privacy policy.
        </p>
        <p>I hereby agree to the Token Sale terms and conditions and the supplemental terms.</p>
        <p>
          Yes, I want to receive Deens.com news, important announcements and updates from Token
          Sale.
        </p>
        <Checkbox onChange={this.onChange} label="I Agree" />
        <ButtonWrapper>
          <Button
            onClick={this.props.onProceed}
            disabled={!this.state.agreed}
            theme="fillLightGreen"
          >
            Proceed
          </Button>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

TermsAgreement.propTypes = {};

export default TermsAgreement;
