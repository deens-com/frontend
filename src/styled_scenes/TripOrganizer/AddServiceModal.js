import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Modal, Popup } from 'semantic-ui-react';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import I18nText from 'shared_components/I18nText';
import axios from 'libs/axios';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import CustomButton from 'shared_components/Button';
import TripCard from 'shared_components/Cards/Trip';
import { composeFetchQuery } from 'scenes/results/actions';

const TypeSelector = styled.div`
  display: flex;
`;

const EditableElement = styled.div`
  margin-left: 5px;
  color: #4fb798;
  font-weight: bold;
  text-decoration: dashed underline;
  text-underline-position: under;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
`;

const Services = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Service = styled.div`
  max-width: 30%;
  flex-shrink: 0;
  flex-grow: 1;
  margin: 10px;
  cursor: pointer;
`;

export default class AddServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedType: 'Accommodation',
      city: null,
      location: null,
      isSearching: false,
      results: null,
    };
    this.latestSearchNumber = 0;
  }

  search() {
    const { selectedType, location } = this.state;
    if (location) {
      const searchNumber = ++this.latestSearchNumber; // Avoid race condition
      this.setState(
        {
          isSearching: true,
        },
        async () => {
          const query = composeFetchQuery({
            type: [selectedType],
            latitude: location.lat,
            longitude: location.lng,
            tags: [],
            limit: 10,
          });

          const results = await axios.get(`/search/services?${query}`);
          if (searchNumber === this.latestSearchNumber) {
            this.setState({
              results: results.data,
              isSearching: false,
            });
          }
        },
      );
    }
  }

  selectType = (event, data) => {
    if (data.name === this.state.selectedType) {
      return;
    }

    this.setState(
      {
        selectedType: data.name,
      },
      this.search,
    );
  };

  handleLocationChange = async (address, id) => {
    const place = await geocodeByPlaceId(id);

    this.setState(
      {
        city: place[0].formatted_address,
        location: getLatLng(place[0]),
      },
      this.search,
    );
  };

  selectService = async service => {
    this.props.onServiceSelect(this.props.day, service);
    this.handleClose();
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderResults = () => {
    const { results } = this.state;

    if (!results) {
      return null;
    }

    return (
      <Services>
        {this.state.results.services.map((service, index) => (
          <Service key={index} onClick={() => this.selectService(service)}>
            <TripCard key={service.label} withTooltip withShadow item={service} />
          </Service>
        ))}
      </Services>
    );
  };

  render() {
    const { trip } = this.props;
    const { open, selectedType, city, isSearching } = this.state;

    return (
      <Modal
        open={open}
        onClose={this.handleClose}
        trigger={
          <CustomButton theme="fillLightGreen" onClick={this.handleOpen}>
            Add Service
          </CustomButton>
        }
        closeIcon
      >
        <Modal.Header>
          Adding to <I18nText data={trip.title} />
        </Modal.Header>
        <Modal.Content style={{ minHeight: '20vw' }}>
          <TypeSelector>
            <Button
              name="Accommodation"
              onClick={this.selectType}
              color={selectedType === 'Accommodation' ? 'green' : null}
            >
              Accommodation
            </Button>
            <Button
              name="Activity"
              onClick={this.selectType}
              color={selectedType === 'Activity' ? 'green' : null}
            >
              Activities
            </Button>
            <Button
              name="Food"
              onClick={this.selectType}
              color={selectedType === 'Food' ? 'green' : null}
            >
              Food
            </Button>
          </TypeSelector>
          <Popup
            trigger={<EditableElement>{city || 'Select city'}</EditableElement>}
            content={<SemanticLocationControl onChange={this.handleLocationChange} />}
            on="click"
            position="bottom left"
          />
          {isSearching && <p>Fetching services</p>}
          {this.renderResults()}
        </Modal.Content>
      </Modal>
    );
  }
}
