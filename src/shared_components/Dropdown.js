import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { primary } from 'libs/colors';
import { MenuDownArrow } from 'shared_components/icons';

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
`;

const Dropdown = ({ children, trigger, onClose, onOpen }) => {
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

    window.addEventListener('mousedown', close);
    return () => {
      window.removeEventListener('mousedown', close);
    };
  });

  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { closeDropdown: toggleOpen }),
  );

  return (
    <Wrapper>
      <Button ref={buttonRef} onClick={toggleOpen}>
        {trigger}
        <Icon>
          <MenuDownArrow />
        </Icon>
      </Button>
      <Content hide={!isOpen} ref={contentRef}>
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
};

Dropdown.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
};

export default Dropdown;
