import React, { useEffect, useState, useRef } from 'react';
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import axios from 'libs/axios';
import Input from 'shared_components/StyledInput';
import Button from 'shared_components/Button';
import fetchHelpers from 'libs/fetch_helpers';
import { parseLocationDataAndCoordinates } from 'libs/location';
import * as colors from 'libs/colors';
import apiClient from 'libs/apiClient';

// i18n
import { Trans } from '@lingui/macro';

const { error: errorColor } = colors;

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
  color: #097da8;
  font-size: 14px;
  margin-left: 15px;
  cursor: pointer;
`;

const ErrorMsg = styled.div`
  color: ${errorColor};
  margin-top: 5px;
`;

const AddCustomServiceModal = ({ close, setServiceData }) => {
  const ref = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  let geocoder = useRef(new window.google.maps.Geocoder());

  const fetchUrlData = async () => {
    const url = ref.current.value;
    setIsFetching(true);
    setError('');
    try {
      const metadata = (await apiClient.links.extract.post({ url })).data;
      if (metadata.location) {
        const latlng = {
          lat: parseFloat(metadata.location.latitude),
          lng: parseFloat(metadata.location.longitude),
        };

        geocoder.current.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              setServiceData(
                fetchHelpers.buildServiceForView(
                  fetchHelpers.createServiceFromUrl({
                    ...metadata,
                    location: parseLocationDataAndCoordinates(results[0], [latlng.lng, latlng.lat]),
                  }),
                ),
              );
              return;
            }
          }

          setServiceData(
            fetchHelpers.buildServiceForView(fetchHelpers.createServiceFromUrl(metadata)),
          );
        });
        return;
      }
      setServiceData(fetchHelpers.buildServiceForView(fetchHelpers.createServiceFromUrl(metadata)));
    } catch (e) {
      setServiceData({});
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Modal.Header>
        <Trans>Add a link to create a service</Trans>
      </Modal.Header>
      <Modal.Content>
        <Dimmer.Dimmable>
          <Dimmer inverted active={isFetching}>
            <Loader />
          </Dimmer>
          <PasteUrlMessage>
            <Trans>Copy/Paste here the link to the service you want to add in your trip</Trans>
          </PasteUrlMessage>
          <Input innerRef={ref} />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Buttons>
            <Button onClick={fetchUrlData}>
              <Trans>Next</Trans>
            </Button>
            <CancelButton onClick={close}>
              <Trans>Cancel</Trans>
            </CancelButton>
          </Buttons>
        </Dimmer.Dimmable>
      </Modal.Content>
    </>
  );
};

export default AddCustomServiceModal;
