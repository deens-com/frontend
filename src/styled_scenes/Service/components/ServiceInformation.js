import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UserAvatar from 'shared_components/UserAvatar';
import { padStart } from 'libs/Utils';
import PriceTag from 'shared_components/Currency/PriceTag';

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;

  tr:not(:last-child) {
    border-bottom: 1pt solid #e2e2e2;
  }
`;

const ServiceInformation = ({ service }) => {
  if (!service) return null;
  const rowProps = { height: '65px' };
  return (
    <Table>
      <tr {...rowProps}>
        <td>Host</td>
        <td>
          <UserAvatar user={service.owner} />
        </td>
      </tr>
      <tr {...rowProps}>
        <td>Working Hours</td>
        <td> {`${padStart(service.openingTime, 2)}:00 - ${padStart(service.closingTime, 2)}:00`} </td>
      </tr>
      <tr {...rowProps}>
        <td>Price Per Session</td>
        <td>
          <PriceTag price={service.pricePerSession} />
        </td>
      </tr>
    </Table>
  );
};

ServiceInformation.propTypes = {
  service: PropTypes.object,
};

export default ServiceInformation;
