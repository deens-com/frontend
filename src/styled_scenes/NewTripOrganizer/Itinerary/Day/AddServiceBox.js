import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import Popup from 'shared_components/Popup';
import Activity from 'shared_components/icons/RunningPerson';
import Food from 'shared_components/icons/SilverWare';
import Accommodation from 'shared_components/icons/Bed';
import Pen from 'shared_components/icons/Pen';
import LinkIcon from 'shared_components/icons/LinkIcon';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddButton from '../../AddButton';
import AddCustomServiceModal from './AddCustomServiceModal';
import AddLink from './AddLink';
import { media } from 'libs/styled';

import { primary, disabled, activity, accommodation, food, tertiary } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const Box = styled.div`
  border-radius: 10px 10px 10px 0;
  margin-top: ${props => (props.lowMargin ? '20px' : '75px')};
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
  margin-right: 30px;
  ${media.minSmall} {
    margin-right: 0;
  }
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
`;

const Divider = styled.div`
  border-bottom: 1px solid ${disabled};
  width: 100%;
  margin: 10px 0;
`;

const AddServiceBox = ({ day, goToAddService, lowMargin }) => {
  const [isOpenPopup, setOpenPopup] = useState(false);
  const openPopup = () => setOpenPopup(true);
  const closePopup = () => setOpenPopup(false);

  const [isOpenModal, setOpenModal] = useState(false);
  const [showingAddLink, setShowingAddLink] = useState(false);
  const [defaultService, setDefaultService] = useState(null);

  const openCustomModal = () => {
    setOpenModal(true);
    closePopup();
  };
  const closeCustomModal = () => {
    setOpenModal(false);
    setDefaultService(null);
    setShowingAddLink(false);
  };

  const showAddLink = () => {
    setShowingAddLink(true);
    openCustomModal();
  };
  const hideAddLink = () => {
    setShowingAddLink(false);
  };

  const addServiceData = service => {
    setDefaultService(service);
    hideAddLink();
  };

  const addAccommodation = () => {
    goToAddService('accommodation');
  };

  const addActivity = () => {
    goToAddService('activity');
  };

  const addFood = () => {
    goToAddService('food');
  };

  return (
    <>
      <Popup
        trigger={
          <Box lowMargin={lowMargin}>
            <AddButton />
          </Box>
        }
        content={
          <Options>
            <li onClick={addAccommodation}>
              <Accommodation style={{ color: accommodation }} />
              <Trans>Accommodation</Trans>
            </li>
            <li onClick={addFood}>
              <Food style={{ color: food }} />
              <Trans>Food</Trans>
            </li>
            <li onClick={addActivity}>
              <Activity style={{ color: activity }} />
              <Trans>Activity</Trans>
            </li>
            <Divider />
            <li onClick={openCustomModal}>
              <Pen style={{ color: tertiary }} />
              <Trans>Custom</Trans>
            </li>
            <li onClick={showAddLink}>
              <LinkIcon style={{ transform: 'rotate(-45deg)', color: tertiary }} />
              <Trans>Paste URL</Trans>
            </li>
          </Options>
        }
        position="top center"
        offset="0, -90px"
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
        closeOnDimmerClick={false}
      >
        {showingAddLink ? (
          <AddLink setServiceData={addServiceData} close={closeCustomModal} />
        ) : (
          <AddCustomServiceModal close={closeCustomModal} day={day} service={defaultService} />
        )}
      </Modal>
    </>
  );
};

AddServiceBox.propTypes = {
  day: PropTypes.number,
  goToAddService: PropTypes.func,
};

AddServiceBox.defaultProps = {
  day: null,
  goToAddService: () => {},
};

export default AddServiceBox;
