import React from 'react';
import { Modal } from 'semantic-ui-react';
import I18nText from 'shared_components/I18nText';

export default ({ service, day, removeServiceFromDay, removeService, closeModal }) => (
  <Modal
    open={Boolean(service)}
    header={`Delete ${service && I18nText.translate(service.title)}`}
    content="Are you sure you want to delete this service from your trip?"
    size="small"
    actions={[
      {
        key: 'keep',
        content: 'Keep the service',
        onClick: closeModal,
      },
      {
        onClick: () => {
          if (day) {
            removeServiceFromDay(day);
          } else {
            removeService();
          }
          closeModal();
        },
        key: 'delete',
        content: 'Delete',
        negative: true,
      },
    ]}
  />
);
