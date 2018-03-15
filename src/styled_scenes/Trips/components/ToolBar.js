// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import Form from '../../../components/Form';
import FlatControl from '../../../components/Form/FlatControl';

// ACTIONS/CONFIG
import { sizes, media } from '../../../libs/styled';

// STYLES

const Wrap = styled.div`
  border-bottom: 1px solid #eef1f4;
  padding: 25px;
  height: 95px;
  display: flex;
  position: fixed;
  background: #ffffff;
  width: 100%;
  z-index: 18;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);

  ${media.minMedium} {
    height: auto;
    position: static;
    width: auto;
    z-index: 0;
    box-shadow: none;
  }

  > div,
  > form > div {
    margin-right: 15px;
  }
`;

// MODULE
export default function ToolBar({ state, onSubmit, onValueChange }) {
  return (
    <Wrap>
      <Media query={`(max-width: ${sizes.small})`}>
        {matches =>
          matches ? (
            <span>Mobile Filters: TODO</span>
          ) : (
            <Form display="flex" onSubmit={onSubmit}>
              <FlatControl
                onChange={value => {
                  onValueChange('location', value);
                }}
                value={state.location}
                type="text"
                placeholder="Location"
                leftIcon="pin"
              />
              <FlatControl
                onChange={value => {
                  onValueChange('startDate', value);
                }}
                value={state.startDate}
                type="date"
                placeholder="From date"
                leftIcon="date"
              />
              <FlatControl
                onChange={value => {
                  onValueChange('endDate', value);
                }}
                value={state.endDate}
                type="date"
                placeholder="To date"
                leftIcon="date"
              />
              <FlatControl
                onChange={value => {
                  onValueChange('person', value);
                }}
                value={state.person}
                type="person"
                placeholder="1"
                leftIcon="person"
              />
            </Form>
          )
        }
      </Media>
    </Wrap>
  );
}

// Props Validation
ToolBar.propTypes = {};
