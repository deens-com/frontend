import React, { useState } from 'react';
import styled from 'styled-components';
import useResponsive from 'hooks/useResponsive';
import { H6 } from 'libs/commonStyles';
import { media } from 'libs/styled';
import { primary, disabled, backgroundDark } from 'libs/colors';
import { detectScreenSize } from 'libs/Utils';
import Icon from 'shared_components/icons/Menu';

const IconWrapper = styled.div`
  ${media.minMediumPlus} {
    display: none;
  }
  grid-column: 1 / 2;
  grid-row: 1;
  margin: auto;
  > svg {
    color: ${props => (props.isOpen ? disabled : primary)};
  }
`;

const Nav = styled.div`
  grid-column: 1 / 3;
  font-size: 16px;
  margin-left: 10px;
  padding-bottom: 15px;
  h6 {
    margin-top: 18px;
  }
  ${media.minMediumPlus} {
    border-bottom: 0;
  }
  ${props =>
    !props.isOpen
      ? `
    display: none;
    ${media.minMediumPlus} {
      display: block;
    }
  `
      : `
    border-bottom: 1px solid ${backgroundDark};
  `};
`;

const LinkList = styled.ul`
  list-style: none;
  color: ${primary};
  > li {
    margin-top: 10px;
  }
`;

export default ({ onChangeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onChangeScreenSize = () => {
    const currentSize = detectScreenSize();
    if (currentSize !== 'medium' && currentSize !== 'small') {
      setIsOpen(false);
    }
  };

  useResponsive(onChangeScreenSize);

  const handleChangeSection = newSection => {
    setIsOpen(false);
    onChangeSection(newSection);
  };

  return (
    <>
      <IconWrapper
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(open => !open);
        }}
      >
        <Icon style={{ height: '2em', width: '2em' }} />
      </IconWrapper>
      <Nav isOpen={isOpen}>
        <section>
          <H6>Trip</H6>
          <LinkList>
            <li onClick={() => handleChangeSection('trip-settings')}>Trip Settings</li>
          </LinkList>
        </section>
        <section>
          <H6>Days</H6>
          <LinkList>
            <li onClick={() => handleChangeSection('day-1')}>Day 1</li>
            <li onClick={() => handleChangeSection('add-day')}>Add Day</li>
          </LinkList>
        </section>
      </Nav>
    </>
  );
};
