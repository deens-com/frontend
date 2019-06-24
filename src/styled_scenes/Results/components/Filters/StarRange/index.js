import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import { Slider, Handles, Rail } from 'react-compound-slider';
import Handle from './Handle';
import { primary } from 'libs/colors';
import Star from 'shared_components/icons/Star';

const Content = styled.div`
  padding: 25px;
  height: 150px;
  width: 125px;
`;

const StarsWrapper = styled.div`
  position: relative;
  display: flex;
  margin-left: 20px;
  svg {
    color: ${primary};
  }
`;

const sliderStyle = {
  position: 'relative',
  height: '100px',
  width: 30,
};

const railStyle = {
  position: 'absolute',
  height: '100%',
  width: 10,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
  transform: 'translate(-50%, 0%)',
};

const MAX_PRICE = 5;
const MIN_PRICE = 1;

const StarRange = ({ ratingStart, ratingEnd, onApply }) => {
  const defaultMin = MIN_PRICE;
  const defaultMax = MAX_PRICE;
  const [values, setValues] = useState({
    min: ratingStart || defaultMin,
    max: ratingEnd || defaultMax,
  });

  const onChange = newValues => {
    setValues({
      min: newValues[0],
      max: newValues[1],
    });
  };

  const onClose = () => {
    onApply({
      ratingStart: values.min > defaultMin ? values.min : undefined,
      ratingEnd: values.max < defaultMax ? values.max : undefined,
    });
  };

  return (
    <Dropdown onClose={onClose} trigger={`${ratingStart} - ${ratingEnd} stars`}>
      <Content>
        <Slider
          vertical
          domain={[defaultMin, defaultMax]}
          values={[values.min, values.max]}
          step={1}
          onChange={onChange}
          rootStyle={sliderStyle}
        >
          <Rail>{({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}</Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <Handle key={handle.id} handle={handle} getHandleProps={getHandleProps}>
                    <StarsWrapper>
                      {[...new Array(handle.value)].map((_, i) => (
                        <span key={i}>
                          <Star />
                        </span>
                      ))}
                    </StarsWrapper>
                  </Handle>
                ))}
              </div>
            )}
          </Handles>
        </Slider>
      </Content>
    </Dropdown>
  );
};

StarRange.propTypes = {
  onApply: PropTypes.func.isRequired,
  ratingStart: PropTypes.number,
  ratingEnd: PropTypes.number,
  numberOfPeople: PropTypes.number,
  onlyMax: PropTypes.bool,
};

StarRange.defaultProps = {
  ratingStart: 1,
  ratingEnd: 5,
  onlyMax: false,
};

export default StarRange;
