import React, { useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { Modal } from 'semantic-ui-react'
import { Activity, Food, Accommodation, Pen, LinkIcon } from 'shared_components/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import AddButton from '../AddButton';
import AddCustomServiceModal from './AddCustomServiceModal'
import AddLink from './AddLink'

import { primary, disabled, activity, accommodation, food, tertiary } from 'libs/colors';

const Box = styled.div`
  border-radius: 10px 10px 10px 0;
  margin-top: 75px;
  width: 190px;
  height: 225px;
  position: relative;
  overflow: hidden;
  border: 1px dashed ${primary};
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  transition: opacity 0.2s ease;
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

const AddServiceBox = ({ day, goToAddService }) => {
  const [isOpenPopup, setOpenPopup] = useState(false)
  const openPopup = () => setOpenPopup(true)
  const closePopup = () => setOpenPopup(false)

  const [isOpenModal, setOpenModal] = useState(false)
  const [showingAddLink, setShowingAddLink] = useState(false)
  const [defaultService, setDefaultService] = useState(null)

  const openCustomModal = () => {
    setOpenModal(true)
    closePopup()
  }
  const closeCustomModal = () => {
    setOpenModal(false)
    setDefaultService(null)
    setShowingAddLink(false)
  }

  const showAddLink = () => {
    setShowingAddLink(true)
    openCustomModal()
  }
  const hideAddLink = () => {
    setShowingAddLink(false)
  }

  const addServiceData = (service) => {
    setDefaultService(service)
    hideAddLink()
  }

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
    <>
      <Popup
        trigger={<Box><AddButton /></Box>}
        content={(
          <Options>
            <li onClick={addAccommodation}><Accommodation style={{color: accommodation}} />Accommodation</li>
            <li onClick={addFood}><Food style={{color: food}} />Food</li>
            <li onClick={addActivity}><Activity style={{color: activity}} />Activity</li>
            <Divider />
            <li onClick={openCustomModal}><Pen style={{color: tertiary}} />Custom</li>
            <li onClick={showAddLink}><LinkIcon style={{transform: 'rotate(-45deg)', color: tertiary}} />Paste URL</li>
          </Options>
        )}
        position="bottom center"
        verticalOffset={-100}
        on="click"
        open={isOpenPopup}
        onClose={closePopup}
        onOpen={openPopup}
      />
      <Modal
        className="serviceModal"
        style={{ marginTop: '75px !important' }}
        open={isOpenModal}
        onClose={closeCustomModal}
      >
        { showingAddLink ?
          <AddLink setServiceData={addServiceData} close={closeCustomModal} />
          : <AddCustomServiceModal close={closeCustomModal} day={day} service={defaultService} />
        }
      </Modal>
    </>
  )
}

AddServiceBox.propTypes = {
  goToAddService: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired,
}

export default AddServiceBox