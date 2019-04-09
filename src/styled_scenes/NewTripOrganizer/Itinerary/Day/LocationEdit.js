import React, { useState } from 'react';
import styled from 'styled-components';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import { parseLocationData } from 'libs/location';
import { primary, error } from 'libs/colors';
import { P } from 'libs/commonStyles';
import { PencilIcon } from 'shared_components/icons';

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

const NotValid = styled.div`
  color: ${error};
  font-size: 12px;
  line-height: 12px;
`;

function getCityText({ city, countryCode }) {
  if (!city) {
    return '';
  }
  return `${city}, ${countryCode}`;
}

export default ({ location, onChange, isFinal }) => {
  const [isEditing, setEditing] = useState(false);
  const [isValid, setValid] = useState(Boolean(!location || location.city));
  const [savingData, setSavingData] = useState(null);

  const onLocationChange = (_, placeId) => {
    setValid(true);

    geocodeByPlaceId(placeId).then(results => {
      const currentResult = results[0];
      const { countryCode, city, postalCode: postcode, state, country } = parseLocationData(
        currentResult,
      );

      if (!city) {
        setValid(false);
        setEditing(false);
        return;
      }

      setSavingData(getCityText({ city, state, country, countryCode }));

      const { lat, lng } = currentResult.geometry.location;
      const geo = {
        type: 'Point',
        coordinates: [lng(), lat()],
      };
      onChange({ countryCode, city, postcode, state, geo });

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
          {!isValid && (
            <NotValid>
              Please select a more specific location, e.g. a city, a street or an airport.
            </NotValid>
          )}
        </NotEditing>
      )}
    </Wrapper>
  );
};
