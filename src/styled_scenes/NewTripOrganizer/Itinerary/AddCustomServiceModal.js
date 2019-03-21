import React, { useContext, useState } from 'react'
import { Modal } from 'semantic-ui-react'
import ServiceForm from 'shared_components/ServiceForm';
import apiClient from 'libs/apiClient';
import fetchHelpers from 'libs/fetch_helpers';
import { TripContext } from '../'

const AddCustomServiceModal = ({ day, close, service }) => {
  const { addService } = useContext(TripContext);
  const [creatingService, setCreatingService] = useState(false)

  const createService = async (values) => {
    setCreatingService(true)
    const service = fetchHelpers.createService(values, true);
    const createdService = (await apiClient.services.post(service)).data
    await addService(createdService, day)
    close()
    setCreatingService(false)
  }

  return (
    <>
      <Modal.Header>Add a private service</Modal.Header>
      <Modal.Content>
        <ServiceForm
          onSubmit={createService}
          submitInFlight={creatingService}
          service={service}
          serviceFormTagsOptions={[]}
          submitButtonText="Create"
          creatingFromLink
        />
      </Modal.Content>
    </>
  )
}

export default AddCustomServiceModal