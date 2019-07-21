import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import { Slider, Handles, Rail, Tracks } from 'react-compound-slider';
import { disabled } from 'libs/colors';

import { P } from 'libs/commonStyles';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const Content = styled.div`
  padding: 25px;
  width: 250px;
`;

const PerDay = styled(P)`
  margin-top: 15px;
  text-align: center;
  > * {
    display: block;
  }
  > *:nth-child(2) {
    margin-top: 5px;
    font-size: 14px;
  }
`;

const sliderStyle = {
  position: 'relative',
  width: '200px',
  height: 30,
};

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  borderRadius: 5,
  backgroundColor: disabled,
};

const MAX_PRICE = 500;
const MIN_PRICE = 0;

const PriceRange = ({
  minPrice,
  maxPrice,
  maxPossiblePrice,
  minPossiblePrice,
  onApply,
  pricePer,
  numberOfPeople,
  onlyMax,
}) => {
  const defaultMin = minPossiblePrice || MIN_PRICE;
  const defaultMax = maxPossiblePrice || MAX_PRICE;
  const [values, setValues] = useState({
    min: minPrice || defaultMin,
    max: maxPrice || defaultMax,
  });

  useEffect(
    () => {
      const min = minPrice < defaultMin ? defaultMin : minPrice;
      const max = maxPrice > defaultMax ? defaultMax : maxPrice;

      setValues({ min: min || defaultMin, max: max || defaultMax });
    },
    [defaultMin, defaultMax, minPrice, maxPrice],
  );

  const onChange = newValues => {
    if (onlyMax) {
      setValues({ ...values, max: newValues[0] });
      return;
    }
    setValues({
      min: newValues[0],
      max: newValues[1],
    });
  };

  const renderTrigger = () => {
    if (!values.min && !maxPrice) {
      return <Trans>Select price</Trans>;
    }
    const isMaxPrice = maxPrice === defaultMax || !maxPrice;
    return (
      <span>
        <Trans>
          ${values.min || defaultMin} to ${maxPrice || defaultMax}
        </Trans>
        {isMaxPrice ? '+ ' : ' '}
        {pricePer === 'per person' ? <Trans>per person</Trans> : <Trans>per day</Trans>}
      </span>
    );
  };

  const onClose = () => {
    onApply({
      priceStart: values.min > defaultMin ? values.min : undefined,
      priceEnd: values.max < defaultMax ? values.max : undefined,
    });
  };

  const showTotalPrice = pricePer === 'per person' && numberOfPeople > 1;

  return (
    <Dropdown onClose={onClose} trigger={renderTrigger()}>
      <Content>
        <Slider
          domain={[defaultMin, defaultMax]}
          values={onlyMax ? [values.max] : [values.min, values.max]}
          step={1}
          onUpdate={onChange}
          rootStyle={sliderStyle}
        >
          <Rail>{({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}</Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <div
                    style={{
                      left: `${handle.percent}%`,
                      position: 'absolute',
                      marginLeft: -8,
                      marginTop: -3,
                      zIndex: 2,
                      width: 16,
                      height: 16,
                      border: 0,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      backgroundColor: '#2C4870',
                      color: '#333',
                    }}
                    key={handle.id}
                    {...getHandleProps(handle.id)}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={onlyMax} right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <div
                    style={{
                      position: 'absolute',
                      backgroundColor: '#8B9CB6',
                      left: `${source.percent}%`,
                      height: 10,
                      width: `${target.percent - source.percent}%`,
                      borderRadius: 5,
                    }}
                    {...getTrackProps()}
                  />
                ))}
              </div>
            )}
          </Tracks>
        </Slider>
        <PerDay>
          {showTotalPrice && (
            <span>
              <Trans>
                ${values.min * numberOfPeople} to ${values.max * numberOfPeople}
              </Trans>
              {values.max === defaultMax ? '+' : ''} <Trans>for {numberOfPeople} people</Trans>
            </span>
          )}
          <span>
            {showTotalPrice && '('}
            <Trans>
              ${values.min} to ${values.max}
            </Trans>
            {values.max === defaultMax ? '+' : ''}{' '}
            {pricePer === 'per person' ? <Trans>per person</Trans> : <Trans>per day</Trans>}
            {showTotalPrice && ')'}
          </span>
        </PerDay>
      </Content>
    </Dropdown>
  );
};

PriceRange.propTypes = {
  onApply: PropTypes.func.isRequired,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  minPossiblePrice: PropTypes.number,
  maxPossiblePrice: PropTypes.number,
  pricePer: PropTypes.oneOf(['per day', 'per person']),
  numberOfPeople: PropTypes.number,
  onlyMax: PropTypes.bool,
};

PriceRange.defaultProps = {
  pricePer: 'per day',
  onlyMax: false,
};

export default PriceRange;
