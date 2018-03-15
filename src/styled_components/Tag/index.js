// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  background: ${props => props.background || '#ddd'};
  min-height: ${props => (props.size === 'big' ? '54px' : 'auto')};
  border-radius: 4px;
  padding: 10px 16px;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 15px;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  box-shadow: ${props => (props.withShadow ? '0 8px 25px 0 rgba(141,141,141,0.22)' : 'none')};
  transition: box-shadow 0.1s ease-out, background 0.1s ease-out;

  &:hover {
    background: ${props => props.hoverBg || '#dd9'};
    box-shadow: ${props => (props.withShadow ? '0 8px 40px 0px rgba(141,141,141,0.28)' : 'none')};
  }

  a {
    color: #fff;
    text-align: center;
  }
`;

// MODULE
export default function CategoryTag({ size, withShadow, item }) {
  return (
    <Wrap size={size} withShadow={withShadow} hoverBg={item.hoverBg} background={item.background}>
      <Link to="/">{item.label}</Link>
    </Wrap>
  );
}

// Props Validation
CategoryTag.propTypes = {};
