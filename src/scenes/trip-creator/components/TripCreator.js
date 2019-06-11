import React, { useState, useRef } from 'react';
import { H2Subtitle, PStrong, P } from 'libs/commonStyles';
import { geocodeByAddress } from 'libs/placesAutocomplete';
import styled from 'styled-components';
import { getLocationParams, hasLocationParams } from 'libs/search';
import LocationAutoSuggest from 'shared_components/Form/LocationAutoSuggest';
import { Popup } from 'semantic-ui-react';
import { parseLocationData } from 'libs/location';
import SearchIcon from 'shared_components/icons/SearchIcon';
import { placeholderMixin, media } from 'libs/styled';
import { primary, primaryDisabled, tertiary } from 'libs/colors';
import BriefcaseHeart from 'shared_components/icons/BriefcaseHeart';
import history from 'main/history';

const TypeIcon = styled.div`
  align-items: center;
  border-radius: 50%;
  color: #c4c4c4;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 40px;
  overflow: hidden;
  width: 40px;

  &:last-child {
    margin-right: 0;
  }
`;

const Input = styled.input`
  appearance: none;
  background: none;
  border: 0;
  display: block;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  outline: none;
  padding-top: 3px;
  width: 100%;
  color: #b5b5b6;
  text-align: left;

  ${placeholderMixin(`
    color: #B5B5B6;
  `)};
`;

const SearchBg = styled.div`
  position: relative;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  min-height: 54px;
  height: auto;
  padding: 0 15px;
  width: 90%;
  margin: auto;
  text-align: left;
`;

const Options = styled.div`
  display: flex;
  max-width: 740px;
  flex-direction: column;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const Option = styled.div`
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 10px;
  border-radius: 5px;
  cursor: pointer;
  ${media.minMedium} {
    flex-direction: column;
    max-width: 210px;
    margin-bottom: 0;
    margin-right: 55px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const Text = styled.div`
  margin-left: 20px;
  ${media.minMedium} {
    text-align: center;
    margin-top: 15px;
    margin-left: 0;
  }
`;

const suggestionStyle = {
  width: '80vw',
  maxWidth: '505px',
  marginLeft: '-25px',
};

const locationProps = {
  inputStyles: {
    height: '100%',
    border: 0,
    outline: 0,
  },
  inputProps: {
    placeholder: 'Type a city or country',
    as: Input,
  },
};

const LeftIcon = () => (
  <TypeIcon>
    <SearchIcon style={{ stroke: '#c4c4c4' }} />
  </TypeIcon>
);

export default ({
  savedSearchQuery,
  updateSearchParams,
  handleCreateNewTrip,
  handleSearch,
  session,
  routeState,
}) => {
  // hasDefaultLocation keeps the initial value so the location box does not disappear after selecting location
  const hasDefaultLocationRef = useRef(hasLocationParams(savedSearchQuery));
  const hasDefaultLocation = hasDefaultLocationRef.current;

  const location = {
    ...getLocationParams(savedSearchQuery),
    formattedAddress: savedSearchQuery.address,
  };
  const [address, setAddress] = useState(hasDefaultLocation ? location : undefined);

  const onLocationChange = address => {
    geocodeByAddress(address).then(results => {
      const result = results[0];
      const data = parseLocationData(result);

      updateSearchParams(
        {
          address,
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        null,
        null,
        true,
        true,
      );

      setAddress({
        ...data,
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
        formattedAddress: address,
      });
    });
  };

  const OptionWithPopup =
    !hasDefaultLocation && !address
      ? ({ children, onClick, style }) => (
          <Popup
            content="Please select a location"
            position="bottom center"
            trigger={<Option style={style}>{children}</Option>}
            on="hover"
          />
        )
      : Option;

  const locationToUse = address;
  const selectAddress = (
    <div style={{ maxWidth: '400px', margin: 'auto', marginBottom: '25px', textAlign: 'center' }}>
      <H2Subtitle style={{ marginBottom: '30px' }}>Where do you want to go?</H2Subtitle>
      <SearchBg style={{ zIndex: 1 }}>
        <LeftIcon />
        <LocationAutoSuggest
          onChange={onLocationChange}
          {...locationProps}
          customStyle={suggestionStyle}
          onFocus={() => ''}
          onBlur={() => ''}
          serviceType="none"
          defaultAddress={locationToUse && locationToUse.formattedAddress}
        />
      </SearchBg>
    </div>
  );

  return (
    <>
      <div style={{ margin: '0 auto' }}>
        {selectAddress}
        <Options>
          <OptionWithPopup onClick={() => handleSearch(locationToUse)}>
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={primary}
            />
            <Text>
              <PStrong style={{ marginBottom: '0' }}>FREE</PStrong>
              <P>Find and customize trips already created by locals</P>
            </Text>
          </OptionWithPopup>
          <OptionWithPopup
            onClick={() =>
              handleCreateNewTrip({
                ...locationToUse,
                ...(locationToUse.lng && {
                  geo: {
                    type: 'Point',
                    coordinates: [locationToUse.lng, locationToUse.lat],
                  },
                }),
              })
            }
          >
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={primaryDisabled}
            />
            <Text>
              <PStrong style={{ marginBottom: '0' }}>FREE</PStrong>
              <P>Start from scratch with an empty trip</P>
            </Text>
          </OptionWithPopup>
          <OptionWithPopup
            onClick={() => {
              if (routeState && routeState.modal) {
                history.replace('/help/travel-planning', {
                  modal: true,
                  helpData: {
                    ...(routeState && routeState.helpData),
                    defaultLocation: locationToUse,
                  },
                });
                return;
              }
              history.push('/help/travel-planning', {
                modal: true,
                helpData: {
                  ...(routeState && routeState.helpData),
                  defaultLocation: locationToUse,
                },
              });
            }}
            style={{ border: `1px solid ${tertiary}` }}
          >
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={tertiary}
            />
            <Text>
              <PStrong style={{ marginBottom: '0', color: tertiary }}>PREMIUM</PStrong>
              <P>Brief a local travel planner to organize your ideal trip</P>
            </Text>
          </OptionWithPopup>
        </Options>
      </div>
    </>
  );
};
