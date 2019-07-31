import React from 'react';
import PropTypes from 'prop-types';
import TrashCan from 'shared_components/icons/TrashCan';
import PencilIcon from 'shared_components/icons/PencilIcon';
import styled from 'styled-components';
import { P } from 'libs/commonStyles';
import { primary, error, tertiary } from 'libs/colors';
import DateSelector from './DateSelector';
import { PRIVACY_PRIVATE } from 'libs/trips';

// i18n
import { Trans } from '@lingui/macro';

const Option = styled.div`
  color: ${primary};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DeleteService = styled(Option)`
  > svg {
    fill: ${error} !important;
    height: 10px;
    width: 10px;
    margin-right: 6px;
  }
`;

const EditService = styled(Option)`
  > svg {
    margin-right: 6px;
    color: ${tertiary};
  }
`;

const DatePicker = styled.div`
  margin-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
`;

const ServiceSettings = ({ servicesByDay, removeService, editService, service, close }) => {
  return (
    <div>
      {service.service.privacy === PRIVACY_PRIVATE && (
        <EditService
          onClick={() => {
            editService(service.service._id);
            close();
          }}
        >
          <PencilIcon />
          <P>
            <Trans>Edit</Trans>
          </P>
        </EditService>
      )}
      <DeleteService onClick={() => removeService(service._id)}>
        <TrashCan />
        <P>
          <Trans>Delete</Trans>
        </P>
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
