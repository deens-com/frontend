import React, { useState } from 'react';
import styled from 'styled-components';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { geocodeByPlaceId } from 'libs/placesAutocomplete';
import { parseLocationData } from 'libs/location';
import { primary, error } from 'libs/colors';
import { P } from 'libs/commonStyles';
import PencilIcon from 'shared_components/icons/PencilIcon';

const Wrapper = styled.div`
  margin: 0 !important;
  input {
    width: 100% !important;
  }
`;

const NotEditing = styled.div`
  display: inline-block;

  svg {
    margin: auto;
    color: ${primary};
  }
`;

function getCityText({ formattedAddress, city, countryCode }) {
  if (formattedAddress) {
    return formattedAddress;
  }
  if (!city) {
    return '';
  }
  return `${city}, ${countryCode}`;
}

export default ({ location, onChange, isFinal }) => {
  const [isEditing, setEditing] = useState(false);
  const [savingData, setSavingData] = useState(null);
  const onLocationChange = (_, placeId) => {
    geocodeByPlaceId(placeId).then(results => {
      const currentResult = results[0];
      const {
        countryCode,
        city,
        postalCode: postcode,
        state,
        country,
        formattedAddress,
      } = parseLocationData(currentResult);

      setSavingData(getCityText({ formattedAddress, city, state, country, countryCode }));

      const { lat, lng } = currentResult.geometry.location;
      const geo = {
        type: 'Point',
        coordinates: [lng(), lat()],
      };
      onChange({ countryCode, city, postcode, state, geo, formattedAddress });

      setEditing(false);
      setSavingData(null);
    });
  };

  const place = getCityText(location || {});

  return (
    <Wrapper>
      {isEditing ? (
        <SemanticLocationControl
          autoFocus
          onBlur={() => setEditing(false)}
          onChange={onLocationChange}
          requireCity
        />
      ) : (
        <NotEditing onClick={() => setEditing(true)}>
          <P>{place || `Please select ${isFinal ? 'a final' : 'an initial'} location`}</P>
          <PencilIcon />
        </NotEditing>
      )}
    </Wrapper>
  );
};
