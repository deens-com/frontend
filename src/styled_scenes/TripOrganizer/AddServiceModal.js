import React, { Component } from 'react';
import styled from 'styled-components';
import { Input, Button, Modal, Popup, Dropdown, Loader } from 'semantic-ui-react';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import I18nText from 'shared_components/I18nText';
import axios from 'libs/axios';
import fetchHelpers from 'libs/fetch_helpers';
import ReactPaginate from 'react-paginate';
import PaginationWrap from 'shared_components/PaginationWrap';
import { media } from 'libs/styled';
import { getFromCoordinates } from 'libs/Utils';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import CustomButton from 'shared_components/Button';
import TripCard from 'shared_components/Cards/Trip';
import { composeFetchQuery } from 'scenes/results/actions';
import { CrossIcon } from 'shared_components/icons';
import throttle from 'lodash.throttle';
import './styles.css';

const TypeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -5px;
  justify-content: flex-start;
  > * {
    margin-top: 5px !important;
  }
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
  flex-direction: column;
  height: 80vh;
  overflow-y: scroll;
  margin-top: 15px;
  ${media.minMedium} {
    flex-direction: row;
    flex-wrap: wrap;
    margin-right: 100px;
    position: relative;
    overflow: auto;
  }
`;

const Service = styled.div`
  flex-shrink: 0;
  flex-grow: 1;
  width: 80%;
  position: relative;
  margin: auto;
  ${media.minMedium} {
    width: 35%;
    :nth-child(2n) {
      margin-left: 20px;
    }
  }
`;

const SearchBy = styled.div`
  font-weight: bold;
  margin-top 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  > * {
    margin-top: 5px;
  }
`;

const SearchSettings = styled.div``;

const ServiceButtons = styled.div`
  position: absolute;
  top: 10px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ModalContent = styled.div`
  height: calc(100vh - 100px);
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
`;

const TripName = styled.span`
  font-weight: bold;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 25px;
  right: 15px;
`;

const Pagination = PaginationWrap.extend`
  margin-top: 15px;
`;

const CloseIcon = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <CrossIcon style={{ width: '20px', height: '20px', fill: '#38D39F' }} />
  </IconWrapper>
);

const searchLimit = 10;

export default class AddServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedType: 'Accommodation',
      city: null,
      location: null,
      searchType: 'city',
      text: null,
      isSearching: false,
      results: null,
      services: [],
      page: 0,
    };
    this.latestSearchNumber = 0;
  }

  search(page) {
    const { selectedType, location, text, searchType } = this.state;
    if (location || text) {
      const searchNumber = ++this.latestSearchNumber; // Avoid race condition
      this.setState(
        {
          isSearching: true,
          page: page || 0,
        },
        async () => {
          const query = composeFetchQuery({
            type: [selectedType],
            ...(searchType === 'city' && {
              latitude: location && location.lat,
              longitude: location && location.lng,
            }),
            tags: [],
            limit: searchLimit,
            ...(searchType === 'text' && {
              text,
            }),
            page: this.state.page + 1,
          });

          const results = await axios.get(`/search/services?${query}`);
          if (searchNumber === this.latestSearchNumber) {
            this.setState({
              results: results.data,
              services: fetchHelpers.buildServicesJson(results.data.services),
              isSearching: false,
            });
          }
        },
      );
    }
  }

  handleTextChange = throttle(
    (event, data) => {
      this.setState(
        {
          text: data.value,
        },
        this.search,
      );
    },
    1000,
    { leading: false },
  );

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
        location: await getLatLng(place[0]),
      },
      this.search,
    );
  };

  selectService = async service => {
    this.props.onServiceSelect(this.props.day.day, service);
    this.handleClose();
  };

  selectSearchType = (event, data) => {
    this.setState({
      searchType: data.value,
    });
  };

  handleOpen = () => {
    const { trip } = this.props;

    const city = trip.location && trip.location.city;
    const location =
      trip.location && trip.location.geo && getFromCoordinates(trip.location.geo.coordinates);

    this.setState(
      prevState => ({
        open: true,
        city: prevState.city || city,
        location: prevState.location || location,
      }),
      this.search,
    );
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handlePageChange = item => {
    this.search(item.selected);
  };

  renderResults = () => {
    const { results, services, selectedType } = this.state;

    if (!results) {
      return null;
    }

    if (services.length === 0) {
      return 'No results found';
    }

    return (
      <Services>
        {this.state.services.map((service, index) => (
          <Service key={index}>
            <TripCard
              type={selectedType.toLowerCase()}
              key={service.label}
              withTooltip
              withShadow
              item={service}
            />
            <ServiceButtons>
              <CustomButton
                theme="fillLightGreen"
                size="small"
                onClick={() => this.selectService(service)}
                iconBefore="plus"
                round={false}
              >
                Add to trip
              </CustomButton>
              <CustomButton
                theme="textGreen"
                target="_blank"
                href={`/services/${service._id}`}
                size="small"
                type="link"
                round={false}
              >
                View service
              </CustomButton>
            </ServiceButtons>
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
          <CustomButton iconBefore="plus" theme="fillLightGreen" onClick={this.handleOpen}>
            Add Service
          </CustomButton>
        }
        closeIcon={<CloseIcon onClick={this.handleClose} />}
        className="add-service-modal"
      >
        <Modal.Header className="add-service-modal-header">
          Adding to{' '}
          <TripName>
            <I18nText data={trip.title} />
          </TripName>{' '}
          on <TripName>{this.props.day.shortTitle}</TripName>
        </Modal.Header>
        <Modal.Content style={{ minHeight: '20vw' }}>
          <ModalContent>
            <SearchSettings>
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
              <SearchBy>
                <span>Search by</span>
                <Dropdown
                  options={[
                    {
                      text: 'Text',
                      value: 'text',
                    },
                    {
                      text: 'City',
                      value: 'city',
                    },
                  ]}
                  onChange={this.selectSearchType}
                  defaultValue="city"
                  selection
                />
                {this.state.searchType === 'text' ? (
                  <Input onChange={this.handleTextChange} />
                ) : (
                  <Popup
                    trigger={<EditableElement>{city || 'Select city'}</EditableElement>}
                    content={<SemanticLocationControl onChange={this.handleLocationChange} />}
                    on="click"
                    position="bottom left"
                  />
                )}
              </SearchBy>
            </SearchSettings>
            {isSearching ? (
              <Loader className="add-service-modal-loader" inline="centered" active />
            ) : (
              this.renderResults()
            )}
            {this.state.services &&
              this.state.services.length > 0 && (
                <Pagination>
                  <ReactPaginate
                    pageCount={Math.ceil(this.state.results.count / searchLimit)}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageChange}
                    previousClassName="previousButton"
                    nextClassName="nextButton"
                    forcePage={this.state.page}
                  />
                </Pagination>
              )}
          </ModalContent>
        </Modal.Content>
      </Modal>
    );
  }
}
