import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';
import styled from 'styled-components';

import { CellContainer, Header, Body } from './styles';

const CodeStyle = styled.div`
  code {
    word-break: break-all;
  }
`;

const modalTrigger = (button, abi) => {
  return (
    <Modal trigger={button} centered={false} size="fullscreen" closeIcon>
      <Modal.Header>Smart Contract ABI</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <CodeStyle>
            <code>{abi}</code>
          </CodeStyle>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button icon labelPosition="left">
          <Icon name="copy" />
          Copy
        </Button>
        <Button icon labelPosition="right">
          Go to MyEtherWallet
          <Icon name="external" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const SmartContractAbi = ({ abi }) => {
  return (
    <CellContainer>
      <Header>
        <Icon name="code" /> Smart Contract ABI
      </Header>
      <Body>
        {modalTrigger(
          <Button color="grey" size="mini">
            Show ABI
          </Button>,
          '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reservations","outputs":[{"name":"isOwner","type":"bool"},{"name":"client","type":"address"},{"name":"startTime","type":"uint256"},{"name":"numberOfSessions","type":"uint256"},{"name":"totalPrice","type":"uint256"},{"name":"numberOfGuests","type":"uint256"},{"name":"hasOwnerVoted","type":"bool"},{"name":"hasClientVoted","type":"bool"},{"name":"ownerRating","type":"uint256"},{"name":"clientRating","type":"uint256"},{"name":"creationTime","type":"uint256"},{"name":"stage","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"serviceDuration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isFrozen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"availableSpots","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxAvailableSpots","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"startTimes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"endTimes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"IPFSHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_serviceDuration","type":"uint256"},{"name":"start","type":"uint256[]"},{"name":"end","type":"uint256[]"},{"name":"_IPFSHash","type":"string"},{"name":"_price","type":"uint256"},{"name":"_maxAvailableSpots","type":"uint256"},{"name":"daysBefore","type":"uint256[]"},{"name":"percentage","type":"uint256[]"},{"name":"rcAddr","type":"address"},{"name":"trAddr","type":"address"},{"name":"drAddr","type":"address"},{"name":"btuAddr","type":"address"},{"name":"ehAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"_duration","type":"uint256"}],"name":"setServiceDuration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_start","type":"uint256[]"},{"name":"_end","type":"uint256[]"}],"name":"setTimes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_IPFSHash","type":"string"}],"name":"setIPFSHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxAvailableSpots","type":"uint256"}],"name":"setMaxAvailableSpot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_startDates","type":"uint256[]"},{"name":"_numberOfSlots","type":"uint256"}],"name":"book","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"reservationID","type":"uint256"}],"name":"accept","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reservationID","type":"uint256"}],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unFreeze","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reservationID","type":"uint256"},{"name":"rating","type":"uint256"}],"name":"finalizeRent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reservationID","type":"uint256"}],"name":"cancelReservation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
        )}
      </Body>
    </CellContainer>
  );
};

SmartContractAbi.propTypes = {
  abi: PropTypes.string.isRequired,
};

export default SmartContractAbi;
