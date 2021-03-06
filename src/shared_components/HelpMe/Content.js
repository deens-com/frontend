import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import LoadingDots from 'shared_components/LoadingDots';
import { geocodeByPlaceId } from 'libs/placesAutocomplete';
import { parseLocationData } from 'libs/location';
import { H2, H5, PSmall, P } from 'libs/commonStyles';
import { primary, textDark, error } from 'libs/colors';
import ImgurAvatar from 'assets/no-avatar.png';
import Rating from 'shared_components/Rating';
import Input from 'shared_components/StyledInput';
import Button from 'shared_components/Button';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import Dropdown from 'shared_components/Dropdown';
import GuestsSelector from 'shared_components/SelectGuests/GuestsSelector';
import analytics from 'libs/analytics';
import currencies from 'data/currencies.json';
import { media } from 'libs/styled';
import apiClient from 'libs/apiClient';

// i18n
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';

import CurrencyDropdownContent from './CurrencyDropdownContent';

const Wrapper = styled.div`
  max-width: 815px;
  margin: 10px 15px;
  display: flex;
  flex-direction: column;
  ${media.minSmall} {
    margin: 20px 35px;
  }
  ${media.minMedium} {
    margin: 40px auto;
  }
`;

const User = styled.div`
  display: flex;
  color: ${primary};
  margin-bottom: 24px;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px 5px 5px 0;
`;

const UserContent = styled.div`
  margin-left: 12px;
  width: 258px;
`;

const WillContact = styled(P)`
  margin-bottom: 45px;
`;

const UserBio = styled(PSmall)`
  margin-top: 11px;
  color: ${textDark};
`;

const Form = styled.form`
  grid-template-columns: 1fr 1fr;
  display: grid;
  grid-row-gap: 25px;
`;

const FormLine = styled.div`
  grid-column: 1 / 3;
`;

const FormHalfLine = styled.div`
  grid-column: 1 / 3;
  ${media.minSmall} {
    grid-column: auto;
  }
`;

const FormField = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  min-width: 50px;
`;

const Budget = styled.div`
  display: flex;
  > *:first-child {
    margin-right: 10px;
  }
`;

const Description = styled(PSmall)`
  font-style: italic;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  grid-column: 1 / 3;
`;

const Thanks = styled(H2)`
  color: ${primary};
`;

const Required = styled.span`
  color: ${error};
  margin-left: 4px;
`;

const HelpMe = ({ tripId, session, tripParent, isLoadingUser, user, defaultLocation }) => {
  const [asked, setAsked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState(defaultLocation);
  const [{ adults, children, infants }, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [currency, setCurrency] = useState('USD');
  const guests = adults + children + infants;
  const budget = useRef(null);
  const email = useRef(null);

  const isValid = data => {
    let err = {};
    let isValid = true;
    if (!data.budget) {
      err.budget = true;
      isValid = false;
    }
    if (!data.email) {
      err.email = true;
      isValid = false;
    }
    if (data.adults < 1) {
      err.guests = true;
      isValid = false;
    }
    setErrors(err);
    return isValid;
  };

  const askForQuote = async () => {
    setErrors({});
    const data = {
      email: session.email || email.current.value,
      location: address,
      destination: address.formattedAddress,
      budget: budget.current.value,
      currency,
      adults,
      children,
      infants,
      tripId: tripId,
      tripParentId: tripParent,
      recommendedUser: user && user._id,
    };
    if (!isValid(data)) {
      return;
    }
    try {
      setSaving(true);
      await apiClient.bookings.premiumHelp(data);
      analytics.planning.brief.complete();
      setAsked(true);
      setSaving(false);
    } catch (e) {
      setSaving(false);
      if (e.response.data.message == 'invalid email') {
        setErrors({
          email: true,
        });
      }
    }
  };

  if (asked) {
    return (
      <Wrapper>
        <Thanks>
          <Trans>We have just sent you an email, please check your inbox.</Trans>
        </Thanks>
      </Wrapper>
    );
  }

  if (saving) {
    return (
      <Wrapper>
        <LoadingDots />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <H2 style={{ textAlign: 'center', marginBottom: '25px' }}>Trip Planning Quote</H2>
      {isLoadingUser ? (
        <Loader active inline="centered" />
      ) : user ? (
        <>
          <User>
            <Avatar src={user.profilePicture || ImgurAvatar} />
            <UserContent>
              <H5>{user.username}</H5>
              {user.rating.count > 0 && (
                <Rating rating={user.rating.average} count={user.rating.count} />
              )}
              <Rating rating={user.rating.average} count={user.rating.count} />
              <UserBio>{user.biography}</UserBio>
            </UserContent>
          </User>
          <WillContact>
            <Trans>
              We will contact <strong>{user.username}</strong> or find a similar travel planner for
              a quote.
            </Trans>
          </WillContact>
        </>
      ) : (
        <WillContact>
          <Trans>
            We will contact a travel planner for your destination and will come back to you in no
            time with a quote.
          </Trans>
        </WillContact>
      )}
      <Form>
        <FormLine>
          <FormField>
            <Label>
              <Trans>What is your destination?</Trans>
            </Label>
            <Description>
              <Trans>Leave blank if you don't know</Trans>
            </Description>
            <I18n>
              {({ i18n }) => (
                <SemanticLocationControl
                  onChange={(formattedAddress, placeId) => {
                    geocodeByPlaceId(placeId).then(results => {
                      const currentResult = results[0];
                      const { countryCode, city, state, country } = parseLocationData(
                        currentResult,
                      );

                      setAddress({ formattedAddress, city, state, country, countryCode });
                    });
                  }}
                  useStyledInput
                  inputProps={{
                    placeholder: i18n._(t`Type a city or country`),
                  }}
                  defaultAddress={address.formattedAddress}
                />
              )}
            </I18n>
          </FormField>
        </FormLine>
        <FormHalfLine>
          <Label>
            <Trans>How many travelers?</Trans>
            <Required>*</Required>
          </Label>
          <Dropdown error={errors.guests} trigger={`${guests} Guest${guests > 1 ? 's' : ''}`}>
            <GuestsSelector
              adults={adults}
              children={children}
              infants={infants}
              onApply={guests => setGuests(guests)}
              relative
            />
          </Dropdown>
        </FormHalfLine>
        <FormHalfLine>
          <Label>
            <Trans>What is your budget?</Trans>
            <Required>*</Required>
          </Label>
          <Budget>
            <Dropdown maxHeight={150} trigger={currency}>
              <CurrencyDropdownContent currencies={currencies} setCurrency={setCurrency} />
            </Dropdown>
            <Input error={errors.budget} innerRef={budget} maxWidth="90px" />
          </Budget>
        </FormHalfLine>
        {!session.username && (
          <>
            <FormLine>
              <FormField>
                <Label>
                  <Trans>Your Email</Trans>
                  <Required>*</Required>
                </Label>
                <Input error={errors.email} innerRef={email} />
              </FormField>
            </FormLine>
          </>
        )}
        <ButtonWrapper>
          <Button onClick={askForQuote} theme="fillLightGreen">
            <Trans>Next</Trans>
          </Button>
        </ButtonWrapper>
        {errors &&
          Object.keys(errors).length > 0 && (
            <span style={{ color: error }}>
              <Trans>Please fill all the fields</Trans>
            </span>
          )}
      </Form>
    </Wrapper>
  );
};

export default HelpMe;
