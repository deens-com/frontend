// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import { Button } from 'semantic-ui-react';
import Parse from 'parse';

// COMPONENTS
import Form from '../../../shared_components/Form';
import FormControl from '../../../shared_components/Form/FormControl';
import MobileFilter from './MobileFilter';

// ACTIONS/CONFIG
import { sizes, media } from '../../../libs/styled';

// STYLES

const Wrap = styled.div`
  border-bottom: 1px solid #eef1f4;
  padding: 10px;
  // height: 65px;
  display: flex;
  background: #ffffff;
  width: 100%;
  z-index: 18;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);

  ${media.minSmall} {
    height: 70px;
  }

  ${media.minMedium} {
    height: 95px;
    padding: 25px;
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
export default function ToolBar({ state, onSubmit, onValueChange, trip }) {
  const tripOwnerId = trip && trip.owner && trip.owner.objectId;
  const currentUser = Parse.User.current();
  const showSaveButton = tripOwnerId === (currentUser && currentUser.id);

  return (
    <Media query={`(max-width: ${sizes.small})`}>
      {matches =>
        matches ? (
          <Wrap mobile>
            <MobileFilter state={state} onSubmit={onSubmit} onValueChange={onValueChange} />
          </Wrap>
        ) : (
          <Wrap>
            <Form display="flex" onSubmit={onSubmit}>
              <FormControl
                onChange={value => {
                  onValueChange('location', value);
                }}
                value={state.location}
                type="text"
                placeholder="Location"
                leftIcon="pin"
              />
              <FormControl
                onChange={value => {
                  onValueChange('startDate', value);
                }}
                value={state.startDate}
                type="date"
                placeholder="From date"
                leftIcon="date"
              />
              <FormControl
                onChange={value => {
                  onValueChange('endDate', value);
                }}
                value={state.endDate}
                type="date"
                placeholder="To date"
                leftIcon="date"
              />
              <FormControl
                onChange={value => {
                  onValueChange('person', value);
                }}
                value={state.person}
                type="person"
                placeholder="1"
                leftIcon="person"
              />
              {showSaveButton && <Button type="submit">Save</Button>}
            </Form>
          </Wrap>
        )
      }
    </Media>
  );
}

// Props Validation
ToolBar.propTypes = {
  trip: PropTypes.object,
};
