import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import CheckIcon from 'shared_components/icons/CheckIcon';
import CheckoutTrip from './CheckoutTrip';

const Wrapper = styled.div`
  flex: 1;
  order: -1;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 50px;
`;

const Title = styled.div`
  font-size: 24px;
  color: #097da8;
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

const Print = styled.span`
  order: 1;
  margin: auto;
  margin-top: 15px;
`;

const IconWrapper = styled.div`
  margin: auto;
  width: 85px;
  height: 85px;
  background-color: #097da8;
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

const NeedToPaySentence = styled.div`
  font-size: 18px;
  margin-bottom: 25px;
  font-weight: 400;
`;

const BookingDone = ({ number, onChange, trip }) => {
  const needToBookExternalServices = Boolean(
    trip.services.find(service => service.service.checkoutOptions.payAt !== 'please'),
  );

  return (
    <React.Fragment>
      <Wrapper>
        <IconWrapper>
          <CheckIcon style={{ width: 72, height: 72 }} />
        </IconWrapper>
        <Title>Your booking on Deens is complete!</Title>
        <FirstLine>All the details will be sent to your email.</FirstLine>
        <SecondLine>Thank you for booking with Deens.com.</SecondLine>
        <Button type="link" href="/my/trips" theme="textLightGreen">
          View your booking
        </Button>
      </Wrapper>
      {needToBookExternalServices && (
        <React.Fragment>
          <NeedToPaySentence>
            <strong>However</strong>, the following services still need to be booked separately:
          </NeedToPaySentence>
          <CheckoutTrip trip={trip} onlyExternalServices showTitle={false} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

BookingDone.propTypes = {};

export default BookingDone;
