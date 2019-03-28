import React, { useEffect, useState, useRef } from 'react'
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components'
import axios from 'libs/axios';
import Input from 'shared_components/StyledInput';
import Button from 'shared_components/Button';
import fetchHelpers from 'libs/fetch_helpers';
import { parseLocationDataAndCoordinates } from 'libs/location';

const PasteUrlMessage = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
`;

const Buttons = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
`;

const CancelButton = styled.div`
  color: #38d39f;
  font-size: 14px;
  margin-left: 15px;
  cursor: pointer;
`;

const AddCustomServiceModal = ({ close, setServiceData }) => {
  const ref = useRef(null)
  const [isFetching, setIsFetching] = useState(false)
  let geocoder
  useEffect(() => {
    geocoder = new window.google.maps.Geocoder()
  }, []);

  const fetchUrlData = async () => {
    const url = ref.current.value;
    setIsFetching(true)
    const metadata = (await axios.post('/links/extract', { url })).data;

    if (metadata.location) {
      const latlng = {
        lat: parseFloat(metadata.location.latitude),
        lng: parseFloat(metadata.location.longitude),
      };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            setServiceData(
              fetchHelpers.buildServiceForView(
                fetchHelpers.createServiceFromUrl({
                  ...metadata,
                  location: parseLocationDataAndCoordinates(results[0], [
                    latlng.lng,
                    latlng.lat,
                  ]),
                }),
              )
            )
            return;
          }
        }

        setServiceData(
          fetchHelpers.buildServiceForView(
            fetchHelpers.createServiceFromUrl(metadata),
          )
        )
      });
      return;
    }
    setServiceData(fetchHelpers.buildServiceForView(fetchHelpers.createServiceFromUrl(metadata)))
  }

  return (
    <>
      <Modal.Header>Add a link to create a service</Modal.Header>
      <Modal.Content>
        <Dimmer.Dimmable>
          <Dimmer
            inverted
            active={isFetching}
          >
            <Loader />
          </Dimmer>
          <PasteUrlMessage>
            Copy/Paste here the link to the service you want to add in your trip
          </PasteUrlMessage>
          <Input innerRef={ref} />
          <Buttons>
            <Button onClick={fetchUrlData}>Next</Button>
            <CancelButton onClick={close}>Cancel</CancelButton>
          </Buttons>
        </Dimmer.Dimmable>
      </Modal.Content>
    </>
  )
}

export default AddCustomServiceModal