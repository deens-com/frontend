import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from 'main/history';
import Button from 'shared_components/Button';
import CheckIcon from 'shared_components/icons/CheckIcon';
import urls from 'libs/urlGenerator';
import headerActions from 'store/header/actions';
import { generateTripSlug } from 'libs/Utils';
import { Loader } from 'semantic-ui-react';

import { Trans } from '@lingui/macro';
import BrandFooter from 'shared_components/BrandFooter';

const Wrapper = styled.div`
  flex: 1;
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

const BookingDone = ({ trip, services, inDayServices, changeHeader }) => {
  const needToBookExternalServices = Boolean(
    trip &&
      trip.services.find(
        service => services[inDayServices[service].service].checkoutOptions.payAt !== 'please',
      ),
  );

  useEffect(
    () => {
      if (!trip) {
        return;
      }
      if (trip.bookingStatus !== 'booked') {
        history.replace(urls.trip.checkout(trip._id));
      }
    },
    [trip],
  );

  useEffect(() => changeHeader({ noSearch: true }), [changeHeader]);

  return (
    <React.Fragment>
      <Wrapper>
        {trip ? (
          <>
            <IconWrapper>
              <CheckIcon style={{ width: 72, height: 72 }} />
            </IconWrapper>
            <Title>
              <Trans>Your booking on Deens is complete!</Trans>
            </Title>
            <FirstLine>
              <Trans>All the details will be sent to your email.</Trans>
            </FirstLine>
            <SecondLine>
              <Trans>Thank you for booking with Deens.com.</Trans>
            </SecondLine>
            <Button
              type="link"
              href={urls.trip.view({ id: trip._id, slug: generateTripSlug(trip) })}
              theme="textLightGreen"
            >
              <Trans>View your booking</Trans>
            </Button>
          </>
        ) : (
          <Loader inline="centered" active />
        )}
      </Wrapper>
      {needToBookExternalServices && (
        <React.Fragment>
          <NeedToPaySentence>
            <Trans>
              <strong>However</strong>, the following services still need to be booked separately
            </Trans>
            :
          </NeedToPaySentence>
        </React.Fragment>
      )}
      <BrandFooter />
    </React.Fragment>
  );
};

BookingDone.propTypes = {};

const mapStateToProps = (state, props) => {
  return {
    trip: state.tripDesigner.trip.data,
    services: state.entities.services,
    inDayServices: state.entities.inDayServices,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingDone);
