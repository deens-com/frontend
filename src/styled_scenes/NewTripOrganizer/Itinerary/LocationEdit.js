import React, { useState } from 'react';
import styled from 'styled-components';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import { parseLocationData } from 'libs/location';
import { primary } from 'libs/colors';
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

export default ({ location, onChange }) => {
  const [isEditing, setEditing] = useState(false);
  const [savingData, setSavingData] = useState(null);

  const onLocationChange = (_, placeId) => {
    geocodeByPlaceId(placeId).then(results => {
      const currentResult = results[0];
      const { countryCode, city, postalCode: postcode, state } = parseLocationData(currentResult);
      setSavingData(`${city}, ${countryCode}`);

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

  const place = savingData || (location ? `${location.city}, ${location.countryCode}` : '');

  return (
    <Wrapper>
      {isEditing ? (
        <SemanticLocationControl
          autoFocus
          onBlur={() => setEditing(false)}
          onChange={onLocationChange}
        />
      ) : (
        <NotEditing onClick={() => setEditing(true)}>
          <P>{place || 'Please select an initial location'}</P>
          <PencilIcon />
        </NotEditing>
      )}
    </Wrapper>
  );
};
