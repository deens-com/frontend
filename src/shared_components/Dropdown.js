import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import supportsPassive from 'libs/supportsPassive';
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
  z-index: 3;
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
  `};
`;

const Dropdown = ({ children, trigger, onClose, onOpen, maxHeight, error }) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = useCallback(
    () => {
      if (isOpen) {
        onClose();
      } else {
        onOpen();
      }
      setOpen(!isOpen);
    },
    [isOpen],
  );

  const contentRef = useRef(null);
  const buttonRef = useRef(null);

  const close = e => {
    if (!contentRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
      onClose();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.addEventListener('touchstart', close, supportsPassive && { passive: false });
    window.addEventListener('mousedown', close);
    return () => {
      window.removeEventListener('touchstart', close, supportsPassive && { passive: false });
      window.removeEventListener('mousedown', close);
    };
  });

  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { closeDropdown: toggleOpen }),
  );

  return (
    <Wrapper>
      <Button error={error} ref={buttonRef} onClick={toggleOpen}>
        {trigger}
        <Icon>
          <MenuDownArrow />
        </Icon>
      </Button>
      <Content maxHeight={maxHeight} hide={!isOpen} ref={contentRef}>
        {isOpen && childrenWithProps}
      </Content>
    </Wrapper>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  trigger: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  maxHeight: PropTypes.number,
  error: PropTypes.bool,
};

Dropdown.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
  maxHeight: null,
  error: false,
};

export default Dropdown;
