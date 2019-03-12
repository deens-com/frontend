import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { primary } from 'libs/colors';

const Wrapper = styled.label`
  position: relative;
  display: flex;
  width: auto;
  cursor: pointer;

  > input {
    opacity: 0;
    width: 0;
    height: 0;
    &:checked + span {
      background-color: ${primary};
    }
    &:checked + span:before {
      transform: translateX(14px);
    }
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 18px;
  width: 32px;
  height: 18px;
  &:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ChildWrapper = styled.span`
  margin-left: 36px;
`;

const Toggle = ({ children, onSwitch, defaultValue }) => {
  const ref = useRef(null);
  const switchValue = useCallback(
    () => {
      if (!ref.current) {
        return;
      }
      onSwitch(ref.current.checked);
    },
    [ref.current && ref.current.checked],
  );

  return (
    <Wrapper>
      <input defaultChecked={defaultValue} ref={ref} onChange={switchValue} type="checkbox" />
      <Slider />
      {children && <ChildWrapper>{children}</ChildWrapper>}
    </Wrapper>
  );
};

Toggle.propTypes = {
  onSwitch: PropTypes.func.isRequired,
  children: PropTypes.node,
  defaultValue: PropTypes.bool,
};

Toggle.defaultProps = {
  defaultValue: false,
};

export default Toggle;
