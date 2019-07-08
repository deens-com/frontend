import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InlineInput from 'shared_components/InlineInput';
import CrossIcon from 'shared_components/icons/CrossIcon';

import { primary, secondary } from 'libs/colors';

const Wrapper = styled.div`
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  padding: 10px 15px 10px 6px;
  cursor: pointer;
  vertical-align: top;
  width: auto;
  & > * {
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  right: 3px;
  top: calc(50% - 6px);
  color: ${primary};
  &:hover {
    color: ${secondary};
  }
`;

const PriceRange = ({ text, onChange, onApply, big }) => {
  return (
    <div style={{ position: 'relative' }}>
      {!big &&
        Boolean(text) && (
          <IconWrapper onClick={() => onApply({ text: '' })}>
            <CrossIcon />
          </IconWrapper>
        )}
      <InlineInput
        customWrapper={Wrapper}
        wrapperStyle={{ width: big ? '300px' : 'auto', maxWidth: big ? '300px' : '150px' }}
        autoselect
        placeholder="Keywords"
        hideIcon
        onFocusChange={onChange}
        onChanged={value => {
          onApply({ text: value });
        }}
      >
        {text}
      </InlineInput>
    </div>
  );
};

PriceRange.propTypes = {
  onApply: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
};

PriceRange.defaultProps = {
  pricePer: 'per day',
  onlyMax: false,
};

export default PriceRange;
