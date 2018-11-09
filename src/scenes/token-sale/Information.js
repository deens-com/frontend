import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import { media } from 'libs/styled';
import { SignUpIcon, KYCIcon, TokensIcon } from './icons';

const Wrapper = styled.div`
  padding: 0 25px;
  ${media.minMedium} {
    margin-top: 80px;
  }
  a {
    color: #38d39f;
    font-size: 14px;
  }
`;
const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const Step = styled.div`
  text-align: center;
  flex: 1;
  margin-top: 30px;
  max-width: 500px;
  ${media.minMedium} {
    margin-top: 0;
    &:nth-child(2) {
      margin: 0 60px;
    }
  }
`;

const StepTitle = styled.div`
  color: #3c434b;
  font-size: 18px;
  margin-top: 20px;
`;

const StepNumber = styled.div`
  color: #3c434b;
  font-size: 18px;
  font-weight: bold;
`;

const StepDescription = styled.div`
  margin-top: 20px;
  ${media.minMedium} {
    margin-top: 40px;
  }
  color: #6e7885;
  font-size: 14px;
`;

const StepIcon = styled.div`
  margin-top: 20px;
`;

const ActionsWrapper = styled.div`
  text-align: center;
  margin-top: 50px;
  margin-bottom: 70px;
  color: #6e7885;
`;

const PolicyWrapper = styled.div`
  text-align: center;
`;

const Divider = styled.div`
  border-top: 1px solid #e0e0e0;
  max-width: 670px;
  margin: 24px auto;
`;

const Or = styled.p`
  margin: 25px auto 15px;
`;

const Support = styled.p`
  color: #3c434b;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export default ({ goToNextStep }) => {
  return (
    <Wrapper>
      <StepsWrapper>
        <Step>
          <StepNumber>Step 1</StepNumber>
          <StepTitle>Sign up</StepTitle>
          <StepIcon>{SignUpIcon}</StepIcon>
          <StepDescription>
            <p>
              Sign up with your e-mail and password. Use your account to purchase tokens and book
              services in our travel platform.
            </p>
          </StepDescription>
        </Step>
        <Step>
          <StepNumber>Step 2</StepNumber>
          <StepTitle>KYC</StepTitle>
          <StepIcon>{KYCIcon}</StepIcon>
          <StepDescription>
            <p>
              We require such documents in order to prevent fraudulent or abusive activity in
              accordance with security rules, both AML (Anti Money Laundering) and KYC (Know Your
              Customer) policies. Also, to comply with (unclear) regulations.
            </p>
            <p>
              We do not store any of your personal documents on our servers. They are handled
              directly by <a href="https://sumsub.com/">Sum&Substance</a>, our KYC/AML provider.
            </p>
          </StepDescription>
        </Step>
        <Step>
          <StepNumber>Step 3</StepNumber>
          <StepTitle>Buy Tokens</StepTitle>
          <StepIcon>{TokensIcon}</StepIcon>
          <StepDescription>
            <p>
              Instant purchase PLS tokens from our site. Your PLS token will be credited to your on
              site balance. You will be able to use PLS in our site. You will be able to withdraw
              them to an ERC20 wallet after our token sale is completed. We also provide smart
              contract option for advanced users.
            </p>
          </StepDescription>
        </Step>
      </StepsWrapper>
      <ActionsWrapper>
        <Button onClick={goToNextStep} padding="12px 72px" theme="fillLightGreen">
          Proceed
        </Button>
        <Or>or</Or>
        <a href="https://protocol.please.com" rel="noopener noreferrer" target="_blank">
          Learn more about the Please.com protocol
        </a>
      </ActionsWrapper>
      <PolicyWrapper>
        <Divider />
        <a href="#">Token Sale Agreement</a>
        <span style={{ marginLeft: 10, marginRight: 10 }}>•</span>
        <a href="#">Token Sale Terms and conditions</a>
        <Divider />
        <Support>Support</Support>
        <a href="mailto:contribute@please.com">contribute@please.com</a>
        <Divider />
      </PolicyWrapper>
    </Wrapper>
  );
};
