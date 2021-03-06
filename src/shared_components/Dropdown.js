import React, { useState, useCallback, useEffect, useRef } from 'react';
import Portal from 'shared_components/Portal';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isIosDevice } from 'libs/Utils';
import { primary, error } from 'libs/colors';
import MenuDownArrow from 'shared_components/icons/MenuDownArrow';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Button = styled.div`
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  padding: 10px 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  ${props => props.error && `border: 1px solid ${error};`};
`;

const Icon = styled.span`
  font-size: 1.5em;
  margin-left: 5px;
`;

const Content = styled.div`
  position: absolute;
  z-index: 11;
  background-color: white;
  top: 45px;
  left: 0;
  border-radius: 5px 5px 5px 0px;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.1);
  display: ${props => (props.hide ? 'none' : 'block')};
  ${props =>
    props.maxHeight &&
    `
    max-height: ${props.maxHeight}px;
    overflow-y: scroll;
  `} ${props => `max-width: ${props.maxWidth}px;`};
`;

const Dropdown = ({ open, children, trigger, onClose, onOpen, maxHeight, error, maxWidth }) => {
  const [isOpen, setOpen] = useState(open || false);

  useEffect(
    () => {
      setOpen(open);
    },
    [open],
  );

  const toggleOpen = useCallback(
    () => {
      if (isOpen) {
        onClose();
      } else {
        onOpen();
      }
      if (typeof open !== 'boolean') {
        setOpen(!isOpen);
      }
    },
    [isOpen, onClose, onOpen, open],
  );

  const contentRef = useRef(null);
  const buttonRef = useRef(null);

  const close = e => {
    e.preventDefault();
    if (!contentRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
      onClose();
      if (typeof open !== 'boolean') {
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.addEventListener('mousedown', close);
    if (isIosDevice) {
      document.body.style.cursor = 'pointer';
    }
    return () => {
      window.removeEventListener('mousedown', close);
      if (isIosDevice) {
        document.body.style.cursor = 'initial';
      }
    };
  });

  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { closeDropdown: toggleOpen }),
  );

  const getDropdownStyle = () => {
    if (!buttonRef.current) {
      return;
    }
    const { height, left, top } = buttonRef.current.getBoundingClientRect();
    return {
      top: top + height,
      left,
    };
  };

  return (
    <Wrapper>
      <Button error={error} ref={buttonRef} onClick={toggleOpen}>
        {trigger}
        <Icon>
          <MenuDownArrow />
        </Icon>
      </Button>
      <Portal>
        <Content
          maxWidth={maxWidth}
          style={getDropdownStyle()}
          maxHeight={maxHeight}
          hide={!isOpen}
          ref={contentRef}
        >
          {isOpen && childrenWithProps}
        </Content>
      </Portal>
    </Wrapper>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  trigger: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  error: PropTypes.bool,
};

Dropdown.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
  maxHeight: null,
  maxWidth: 250,
  error: false,
};

export default Dropdown;
