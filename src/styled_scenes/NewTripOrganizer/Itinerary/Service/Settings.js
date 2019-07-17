import React from 'react';
import PropTypes from 'prop-types';
import TrashCan from 'shared_components/icons/TrashCan';
import styled from 'styled-components';
import { P } from 'libs/commonStyles';
import { primary, error } from 'libs/colors';
import DateSelector from './DateSelector';

const DeleteService = styled.div`
  color: ${primary};
  display: flex;
  align-items: center;
  cursor: pointer;

  > svg {
    fill: ${error} !important;
    height: 10px;
    width: 10px;
    margin-right: 6px;
  }
`;

const DatePicker = styled.div`
  margin-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
`;

const ServiceSettings = ({ servicesByDay, removeService, service }) => {
  return (
    <div>
      <DeleteService onClick={() => removeService(service._id)}>
        <TrashCan />
        <P>Delete</P>
      </DeleteService>
      {service.service.categories.find(category => category.names === 'Accommodation') && (
        <DatePicker>
          <DateSelector servicesByDay={servicesByDay} service={service} />
        </DatePicker>
      )}
    </div>
  );
};

ServiceSettings.propTypes = {
  removeService: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired,
};

export default ServiceSettings;
