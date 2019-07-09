import React from 'react';
import PropTypes from 'prop-types';
import { PStrong, PXSmall, PSmallStrong } from 'libs/commonStyles';
import { error, secondaryValid, secondaryWarning } from 'libs/colors';
import CheckIcon from 'shared_components/icons/CheckIcon';
import CrossIcon from 'shared_components/icons/CrossIcon';

const getColor = state => {
  if (state === 1) {
    return secondaryValid;
  }
  if (state === -1) {
    return error;
  }
  return secondaryWarning;
};

const FieldValidator = ({ validatorFunction, title, recommended, dependesOn }) => {
  const [state, text] = validatorFunction();
  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <div style={{ paddingRight: '40px', textAlign: 'right' }}>
        <PStrong>{title}</PStrong>
        <PSmallStrong style={{ color: getColor(state) }}>{text}</PSmallStrong>
        <PXSmall>{recommended}</PXSmall>
      </div>
      <div
        style={{
          backgroundColor: getColor(state),
          padding: '3px',
          right: '5px',
          top: '2px',
          borderRadius: '20px',
          position: 'absolute',
        }}
      >
        {state === -1 ? (
          <CrossIcon style={{ color: 'white' }} />
        ) : (
          <CheckIcon style={{ color: 'white' }} />
        )}
      </div>
    </div>
  );
};

FieldValidator.propTypes = {
  validatorFunction: PropTypes.func.isRequired, // returns [state, text]. state: -1=red 0=yellow 1=green
  title: PropTypes.string.isRequired,
  recommended: PropTypes.node.isRequired,
  dependesOn: PropTypes.any,
};

export default FieldValidator;
