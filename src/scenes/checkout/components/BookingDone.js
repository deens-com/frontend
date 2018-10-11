import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  flex: 1;
  order: 1;
  text-align: center;
  margin-bottom: 15px;
`;

const FirstLine = styled.div`
  font-size: 16px;
`;

const SecondLine = styled.div`
  font-size: 16px;
`;

const Print = styled.span`
  order: 3;
  margin: auto;
  margin-top: 15px;
`;

function print() {
  window.print();
}

const BookingDone = ({ number, onChange }) => {
  return (
    <React.Fragment>
      <Wrapper>
        <FirstLine>Your booking is done. All the details will be sent to your email.</FirstLine>
        <SecondLine>Thank you for booking with Please.com.</SecondLine>
        {/*There is no share screen <Button theme="fillLightGreen">Share to friends</Button>*/}
        <Button type="link" href="/account/trips/planned" theme="textLightGreen">
          See your bookings
        </Button>
      </Wrapper>
      <Print>
        <Button theme="fillLightGreen" onClick={print}>
          Print
        </Button>
      </Print>
    </React.Fragment>
  );
};

BookingDone.propTypes = {};

export default BookingDone;
