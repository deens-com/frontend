import React from 'react';
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import axios from 'libs/axios';
import Input from 'shared_components/StyledInput';
import Button from 'shared_components/Button';
import ServiceForm from 'shared_components/ServiceForm';
import fetchHelpers from 'libs/fetch_helpers';
import * as tripUtils from 'libs/trips';
import { parseLocationDataAndCoordinates } from 'libs/location';
import apiClient from 'libs/apiClient';
import './CreateServiceModal.css';

const Wrapper = styled.div``;
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

const initialState = {
  fetchingUrlData: false,
  service: null,
  tags: null,
};

export default class CreateServiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.inputRef = React.createRef();
    this.geocoder = new window.google.maps.Geocoder();

    axios.get('/tags').then(response => {
      this.setState({
        tags: response.data,
      });
    });
  }

  addServiceToTrip = async serviceToAdd => {
    this.setState({
      savingTrip: true,
    });

    const trip = this.props.trip;

    await tripUtils.addServiceRequest(trip._id, this.props.day, serviceToAdd._id);

    this.props.goBackToTrip();
  };

  fetchUrlData = async () => {
    this.setState({
      fetchingUrlData: true,
      service: null,
      importUrl: this.inputRef.current.value,
      unique: false,
      fetchingUnique: true,
    });

    const url = this.inputRef.current.value;
    try {
      const response = await axios.post('/services/import/find', { url });
      this.addServiceToTrip(response.data);
    } catch (e) {
      try {
        this.setState({
          unique: true,
          fetchingUnique: false,
        });

        const metadata = (await axios.post('/links/extract', { url })).data;

        if (metadata.location) {
          const latlng = {
            lat: parseFloat(metadata.location.latitude),
            lng: parseFloat(metadata.location.longitude),
          };

          this.geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                this.setState({
                  fetchingUrlData: false,
                  service: fetchHelpers.buildServiceForView(
                    fetchHelpers.createServiceFromUrl({
                      ...metadata,
                      location: parseLocationDataAndCoordinates(results[0], [
                        latlng.lng,
                        latlng.lat,
                      ]),
                    }),
                  ),
                });
                return;
              }
            }

            this.setState({
              fetchingUrlData: false,
              service: fetchHelpers.buildServiceForView(
                fetchHelpers.createServiceFromUrl(metadata),
              ),
            });
          });

          return;
        }
        this.setState({
          fetchingUrlData: false,
          service: fetchHelpers.buildServiceForView(fetchHelpers.createServiceFromUrl(metadata)),
        });
      } catch (e) {
        this.setState({
          fetchingUrlData: false,
          service: {},
        });
      }
    }
  };

  renderAddLink() {
    return (
      <div>
        <PasteUrlMessage>
          Copy/Paste here the link to the service you want to add in your trip
        </PasteUrlMessage>
        <Input innerRef={this.inputRef} />
        <Buttons>
          <Button onClick={this.fetchUrlData}>Next</Button>
          <CancelButton onClick={this.props.closeModal}>Cancel</CancelButton>
        </Buttons>
      </div>
    );
  }

  onSubmit = async values => {
    this.setState({
      savingService: true,
    });
    const res = await apiClient.services.post({
      importerOptions: {
        fromUrl: this.state.importUrl,
      },
      ...fetchHelpers.createService(values, true),
    });
    this.setState({
      savingService: false,
    });
    this.addServiceToTrip(res.data);
  };

  renderServiceForm() {
    return (
      <ServiceForm
        onSubmit={this.onSubmit}
        submitInFlight={this.state.savingService || this.state.savingTrip}
        serviceFormTagsOptions={this.state.tags}
        service={this.state.service}
        submitButtonText="Create"
        creatingFromLink
      />
    );
  }

  render() {
    console.log(this.props.trip);
    return (
      <Wrapper>
        <Modal
          className="serviceModal"
          style={{ marginTop: '75px !important' }}
          open={this.props.open}
          onClose={this.props.closeModal}
        >
          <Modal.Header>Add a service from another website</Modal.Header>
          <Modal.Content>
            <Dimmer.Dimmable>
              <Dimmer
                inverted
                active={
                  this.state.fetchingUrlData || this.state.fetchingUnique || this.state.savingTrip
                }
              >
                <Loader />
              </Dimmer>
              {!this.state.tags || !this.state.service || !this.state.unique
                ? this.renderAddLink()
                : this.renderServiceForm()}
            </Dimmer.Dimmable>
          </Modal.Content>
        </Modal>
      </Wrapper>
    );
  }
}
