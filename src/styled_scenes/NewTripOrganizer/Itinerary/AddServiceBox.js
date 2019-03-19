import React, { useState, useContext } from 'react';
import { Popup } from 'semantic-ui-react';
import { Activity, Food, Accommodation, Pen } from 'shared_components/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import AddButton from '../AddButton';

import { primary, secondary, disabled, activity, accommodation, food, tertiary } from 'libs/colors';

const Box = styled.div`
  border-radius: 10px 10px 10px 0;
  margin-top: 75px;
  width: 190px;
  height: 225px;
  position: relative;
  overflow: hidden;
  border: 1px dashed ${primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${secondary};
    border: 1px solid ${secondary};
  }
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const Options = styled.ul`
  list-style: none;
  li {
    cursor: pointer;
    color: ${primary};
    letter-spacing: 0.2em;
    line-height: 22px;
    display: flex;
    align-items: center;
    > svg {
      margin-right: 7px;
    }
  }
`

const Divider = styled.div`
  border-bottom: 1px solid ${disabled};
  width: 100%;
  margin: 10px 0;
`

const AddServiceBox = ({ goToAddService }) => {

  const addAccommodation = () => {
    goToAddService('accommodation')
  }

  const addActivity = () => {
    goToAddService('activity')
  }

  const addFood = () => {
    goToAddService('food')
  }

  return (
    <Popup
      trigger={<Box><AddButton /></Box>}
      content={(
        <Options>
          <li onClick={addAccommodation}><Accommodation style={{color: accommodation}} />Accommodation</li>
          <li onClick={addFood}><Food style={{color: food}} />Food</li>
          <li onClick={addActivity}><Activity style={{color: activity}} />Activity</li>
          {/*<Divider />
          <li onClick={openCustomModal}><Pen style={{color: tertiary}} />Custom</li>
          */}
        </Options>
      )}
      position="bottom center"
      verticalOffset={-100}
      on="click"
    />
  )
}

AddServiceBox.propTypes = {
  goToAddService: PropTypes.func.isRequired,
}

export default AddServiceBox