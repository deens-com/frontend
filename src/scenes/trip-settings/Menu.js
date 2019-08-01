import React, { useState } from 'react';
import styled from 'styled-components';
import useResponsive from 'hooks/useResponsive';
import { H6 } from 'libs/commonStyles';
import { media } from 'libs/styled';
import { primary, primaryHover, disabled, backgroundDark } from 'libs/colors';
import { detectScreenSize } from 'libs/Utils';
import Icon from 'shared_components/icons/Menu';

const Wrapper = styled.div`
  ${media.minMediumPlus} {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    border-right: 1px solid ${backgroundDark};
  }
  grid-row: 1 / 3;
  grid-column: 1 / 3;
  display: grid;
`;

const IconWrapper = styled.div`
  ${media.minMediumPlus} {
    display: none;
  }
  grid-row: 1;
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
`;

const Li = styled.li`
  color: ${primary};
  margin-top: 10px;
  p {
    cursor: pointer;
    zdisplay: inline;
  }
  ${props =>
    props.selected &&
    `
    color: ${primaryHover};
    list-style: disc;
  `};
`;

export default ({ currentSection, numberOfDays, onChangeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const days = [...new Array(numberOfDays)];

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
    <Wrapper>
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
            <Li selected={currentSection === 'trip-settings'}>
              <p onClick={() => handleChangeSection('trip-settings')}>Trip Settings</p>
            </Li>
          </LinkList>
        </section>
        <section>
          <H6>Days</H6>
          <LinkList>
            {days.map((_, i) => (
              <Li key={i} selected={currentSection === `day-${i + 1}`}>
                <p onClick={() => handleChangeSection(`day-${i + 1}`)}>Day {i + 1}</p>
              </Li>
            ))}
            <Li>
              <p onClick={() => handleChangeSection('add-day')}>Add Day</p>
            </Li>
          </LinkList>
        </section>
      </Nav>
    </Wrapper>
  );
};
