import React, { useContext, useState } from 'react';
import { Modal } from 'semantic-ui-react';
import ServiceForm from 'shared_components/ServiceForm';
import apiClient from 'libs/apiClient';
import fetchHelpers from 'libs/fetch_helpers';
import { TripContext } from '../../';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const AddCustomServiceModal = ({ day, close, service }) => {
  const { addService } = useContext(TripContext);
  const [creatingService, setCreatingService] = useState(false);

  const createService = async values => {
    setCreatingService(true);
    const service = fetchHelpers.createService(values, true);
    const createdService = (await apiClient.services.post(service)).data;
    await addService(createdService, day);
    close();
    setCreatingService(false);
  };

  return (
    <>
      <Modal.Header>
        <Trans>Add a private service</Trans>
      </Modal.Header>
      <Modal.Content>
        <I18n>
          {({ i18n }) => (
            <ServiceForm
              onSubmit={createService}
              submitInFlight={creatingService}
              service={service}
              serviceFormTagsOptions={[]}
              submitButtonText={i18n._(t`Create`)}
              onCancel={close}
              creatingFromLink
            />
          )}
        </I18n>
      </Modal.Content>
    </>
  );
};

export default AddCustomServiceModal;
