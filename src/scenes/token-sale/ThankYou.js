import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import { CheckIcon } from 'shared_components/icons';

const Wrapper = styled.div`
  flex: 1;
  order: -1;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 50px;
`;

const Title = styled.div`
  font-size: 24px;
  color: #38d39f;
  font-weight: bold;
  margin-top: 25px;
`;

const FirstLine = styled.div`
  font-size: 16px;
  margin-top: 15px;
`;

const SecondLine = styled.div`
  font-size: 16px;
  color: #6e7885;
  margin-top: 5px;
  margin-bottom: 40px;
`;

const IconWrapper = styled.div`
  margin: auto;
  width: 85px;
  height: 85px;
  background-color: #38d39f;
  color: white;
  border-radius: 50px;
  padding-top: 1px;
  > svg {
    width: 72px;
    height: 72px;
    margin: auto;
    margin-top: 10px;
    > path: {
      fill: white;
    }
  }
`;

const BookingDone = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <IconWrapper>
          <CheckIcon style={{ width: 72, height: 72 }} />
        </IconWrapper>
        <Title>Thank you!</Title>
        <FirstLine>Your information has been verified.</FirstLine>
        <SecondLine>We will update you shortly on the next steps.</SecondLine>
        <Button type="link" href="/" theme="textLightGreen">
          Now let's find some trips
        </Button>
      </Wrapper>
    </React.Fragment>
  );
};

BookingDone.propTypes = {};

export default BookingDone;
