import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import { Slider, Handles, Rail, Ticks, Tracks } from 'react-compound-slider';
import Handle from './Handle';
import { primary, disabled } from 'libs/colors';
import Star from 'shared_components/icons/Star';
import Deens from 'shared_components/icons/Deens';

const Content = styled.div`
  padding: 25px;
  height: 150px;
  width: 125px;
`;

const StarsWrapper = styled.div`
  position: relative;
  display: flex;
  margin-left: 12px;
  svg {
    color: ${primary};
  }
`;

const IconWrapper = styled.span`
  ${props =>
    props.disabled &&
    `
    > svg g:nth-child(3) {
      display: none;
    }
  `};
`;

const sliderStyle = {
  position: 'relative',
  height: '100px',
  width: 30,
};

const railStyle = {
  position: 'absolute',
  height: 'calc(100% + 16px)',
  marginTop: '-8px',
  paddingBottom: '8px',
  width: 10,
  borderRadius: 5,
  backgroundColor: disabled,
  transform: 'translate(-50%, 0%)',
};

const MAX_STARS = 5;
const MIN_STARS = 1;

const renderTrigger = (start, end) => {
  if (start === end) {
    return `Rate: ${start}`;
  }
  return `Rate: ${start} to ${end}`;
};

const Rating = ({ ratingStart, ratingEnd, onApply }) => {
  const defaultMin = MIN_STARS;
  const defaultMax = MAX_STARS;
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
    <Dropdown onClose={onClose} trigger={renderTrigger(ratingStart, ratingEnd)}>
      <Content>
        <Slider
          vertical
          domain={[defaultMin, defaultMax]}
          values={[values.min, values.max]}
          step={1}
          onUpdate={onChange}
          rootStyle={sliderStyle}
        >
          <Rail>{({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}</Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <Handle key={handle.id} handle={handle} getHandleProps={getHandleProps} />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <div
                    style={{
                      position: 'absolute',
                      backgroundColor: '#8B9CB6',
                      top: `${source.percent}%`,
                      width: 10,
                      transform: 'translate(-50%, 0%)',
                      height: `${target.percent - source.percent}%`,
                      borderRadius: 5,
                    }}
                    {...getTrackProps()}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={5}>
            {({ ticks }) => (
              <div style={{ height: 100 }}>
                {ticks.map(tick => (
                  <StarsWrapper
                    style={{ position: 'absolute', top: `calc(${tick.percent}% - 8px)` }}
                  >
                    {[...new Array(tick.value)].map((_, i) => (
                      <IconWrapper
                        disabled={tick.value < values.min || tick.value > values.max}
                        key={i}
                      >
                        <Deens />
                      </IconWrapper>
                    ))}
                  </StarsWrapper>
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </Content>
    </Dropdown>
  );
};

Rating.propTypes = {
  onApply: PropTypes.func.isRequired,
  ratingStart: PropTypes.number,
  ratingEnd: PropTypes.number,
};

Rating.defaultProps = {
  ratingStart: 1,
  ratingEnd: 5,
};

export default Rating;
