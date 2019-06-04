import React, { useState } from 'react';
import { H2Subtitle, PStrong, P } from 'libs/commonStyles';
import { geocodeByAddress, getLatLng } from 'libs/placesAutocomplete';
import styled from 'styled-components';
import { getLocationParams, hasLocationParams } from 'libs/search';
import LocationAutoSuggest from 'shared_components/Form/LocationAutoSuggest';
import { Popup } from 'semantic-ui-react';
import { parseLocationData } from 'libs/location';
import SearchIcon from 'shared_components/icons/SearchIcon';
import { placeholderMixin, media } from 'libs/styled';
import { primary, primaryDisabled, tertiary } from 'libs/colors';
import BriefcaseHeart from 'shared_components/icons/BriefcaseHeart';
import HelpMe from 'shared_components/HelpMe/Content';
import Modal from 'shared_components/Modal';

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

export default ({ savedSearchQuery, handleCreateNewTrip, handleSearch, session }) => {
  const hasDefaultLocation = hasLocationParams(savedSearchQuery);
  const location = {
    ...getLocationParams(savedSearchQuery),
    formattedAddress: savedSearchQuery.address,
  };
  const [address, setAddress] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const onLocationChange = address => {
    geocodeByAddress(address).then(results => {
      const result = results[0];
      const data = parseLocationData(result);

      setAddress({
        ...data,
        geo: {
          type: 'Point',
          coordinates: [result.geometry.location.lng(), result.geometry.location.lat()],
        },
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

  const selectAddress = hasDefaultLocation ? null : (
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
        />
      </SearchBg>
    </div>
  );
  const locationToUse = hasDefaultLocation ? location : address;
  const renderHelp = () => {
    setShowHelp(true);
  };
  console.log(showHelp);
  return (
    <>
      <Modal open={showHelp} onCloseRequest={() => setShowHelp(false)}>
        <HelpMe session={session} defaultLocation={locationToUse} />
      </Modal>
      <div style={{ margin: '0 auto' }}>
        {selectAddress}
        <Options>
          <OptionWithPopup onClick={() => handleCreateNewTrip(locationToUse)}>
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={primary}
            />
            <Text>
              <PStrong style={{ marginBottom: '0' }}>FREE</PStrong>
              <P>Find and customize trips already created by locals</P>
            </Text>
          </OptionWithPopup>
          <OptionWithPopup onClick={() => handleSearch(locationToUse)}>
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={primaryDisabled}
            />
            <Text>
              <PStrong style={{ marginBottom: '0' }}>FREE</PStrong>
              <P>Start from scratch with an empty trip</P>
            </Text>
          </OptionWithPopup>
          <OptionWithPopup onClick={renderHelp} style={{ border: `1px solid ${tertiary}` }}>
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
