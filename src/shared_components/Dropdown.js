import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { primary } from 'libs/colors';
import { MenuDownArrow } from 'shared_components/icons';

const Wrapper = styled.div`
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  padding: 10px 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const Icon = styled.span`
  font-size: 1.5em;
  margin-left: 5px;
`;

const Content = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  border-radius: 5px 5px 5px 0px;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.1);
`;

const Dropdown = ({ children, trigger }) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);
  }, []);

  const contentRef = useRef(null);

  useEffect(
    () => {
      if (!isOpen) {
        return;
      }
      const close = e => {
        if (!contentRef.current.contains(e.target)) {
          setOpen(false);
        }
      };

      window.addEventListener('mousedown', close);
      return () => {
        window.removeEventListener('mousedown', close);
      };
    },
    [isOpen],
  );

  return (
    <Wrapper onClick={toggleOpen}>
      {trigger}
      <Icon>
        <MenuDownArrow />
      </Icon>
      {isOpen && <Content ref={contentRef}>{children}</Content>}
    </Wrapper>
  );
};

export default Dropdown;
