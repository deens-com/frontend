// NPM
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Popup, Dropdown, Icon } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import moment from 'moment';
import Media from 'react-media';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import * as results_actions from './../../../scenes/results/actions';

import serviceTags from 'shared_components/ServiceForm/service-tags';
const tagsDropdownOptions = serviceTags.map(value => ({ text: value, value }));

const Wrap = styled.div`
  //margin-left: 20px;
`;

const SentenceWrapper = styled.span`
  display: inline-flex;
  font-weight: bold;
  color: grey;
  position: relative;
  top: 1.3em;
  margin-left: 20px;
`;

const MobileSentenceWrapper = styled.div`
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
  color: grey;
  margin-top: 1em;
`;

const MobileSentence = styled.div`
  display: inline-flex;
  padding-bottom: 1em;
`;

const CenteredSection = styled.section`
  text-align: center;
`;

const EditableElement = styled.div`
  margin-left: 5px;
  color: #4fb798;
  font-weight: bold;
  text-decoration: dashed underline;
  text-underline-position: under;
  cursor: pointer;
`;

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.search_query.address || undefined,
      latitude: props.search_query.latitude || undefined,
      longitude: props.search_query.longitude || undefined,
      start_date: props.search_query.start_date ? props.search_query.start_date : moment().format(),
      end_date: props.search_query.end_date
        ? props.search_query.end_date
        : moment()
            .add(1, 'days')
            .format(),
      person_nb: props.search_query.person_nb || undefined,
      service_type: props.search_query.type || [],
      tags: props.search_query.tags || [],
      showFilters: false,
      isCategoryPopupOpen: false,
      isLocationPopupOpen: false,
      isDatesPopupOpen: false,
      isGuestsPopupOpen: false,
      isMoodPopupOpen: false,
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.refetch_results = this.refetch_results.bind(this);
    this.get_query_params = this.get_query_params.bind(this);
    this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
    this.clear_address = this.clear_address.bind(this);
  }

  get_query_params() {
    return {
      type: this.props.search_query.type,
      start_date: this.props.search_query.start_date,
      end_date: this.props.search_query.end_date,
      person_nb: this.props.search_query.person_nb,
      latitude: this.props.search_query.latitude,
      longitude: this.props.search_query.longitude,
      address: this.props.search_query.address,
      tags: this.props.search_query.tags,
      onlySmartContracts: this.props.search_query.onlySmartContracts,
    };
  }

  refetch_results(param_object) {
    const query_params = this.get_query_params();
    query_params[Object.keys(param_object)[0]] = param_object[Object.keys(param_object)[0]];
    this.props.update_path(query_params);
  }

  refetch_results_for_location(lat, lon, addr) {
    const query_params = this.get_query_params();
    query_params.latitude = lat;
    query_params.longitude = lon;
    query_params.address = addr;
    this.props.update_path(query_params);
  }

  refetch_results_for_dates(dateRange) {
    const query_params = this.get_query_params();
    query_params.start_date = dateRange.start_date;
    query_params.end_date = dateRange.end_date;
    this.props.update_path(query_params);
  }

  handleStartDateChange(dateObject) {
    const date_start = dateObject.toISOString();
    this.setState({ start_date: date_start });
    this.refetch_results({ start_date: date_start });
  }

  handleEndDateChange(dateObject) {
    const date_end = dateObject.toISOString();
    this.setState({ end_date: date_end });
    this.refetch_results({ end_date: date_end });
  }

  handleLocationChange(address) {
    let addr = '';
    geocodeByAddress(address)
      .then(results => {
        //console.log(results);
        addr = results[0].formatted_address;
        this.setState({ address: addr });
        return getLatLng(results[0]);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState({ latitude: lat, longitude: lng });
        this.refetch_results_for_location(lat, lng, addr);
      });
    this.handleLocationPopupClose();
  }

  handleServiceTypeChange(event, data) {
    const type = data.value;
    this.handleCategoryPopupClose();
    this.setState({ service_type: [type] });
    this.refetch_results({ type: [type] });
  }

  handleGuestsNbChange = (event, data) => {
    const nb = data.value;
    this.handleGuestsPopupClose();
    this.setState({ person_nb: nb });
    this.refetch_results({ person_nb: nb });
  };

  handleDatesChange = dateRange => {
    const start = dateRange.startDate; // && dateRange.startDate._d.getTime();
    const end = dateRange.endDate; // && dateRange.endDate._d.getTime();
    this.setState({ startDate: start, endDate: end });
    this.refetch_results_for_dates({ start_date: start, end_date: end });
  };

  clear_address() {
    this.setState({ latitude: '', longitude: '', address: '' });
    this.refetch_results_for_location('', '', '');
  }

  clearDates = () => {
    this.setState({ startDate: '', endDate: '' });
    this.refetch_results_for_dates({ start_date: '', end_date: '' });
  };

  handleCategoryPopupClose = () => {
    this.setState({ isCategoryPopupOpen: false });
  };

  handleLocationPopupClose = () => {
    this.setState({ isLocationPopupOpen: false });
  };

  handleDatesPopupClose = () => {
    this.setState({ isDatesPopupOpen: false });
  };

  handleGuestsPopupClose = () => {
    this.setState({ isGuestsPopupOpen: false });
  };

  handleMoodPopupClose = () => {
    this.setState({ isMoodPopupOpen: false });
  };

  handleCategoryPopupOpen = () => {
    this.setState({ isCategoryPopupOpen: true });
  };

  handleLocationPopupOpen = () => {
    this.setState({ isLocationPopupOpen: true });
  };

  handleDatesPopupOpen = () => {
    this.setState({ isDatesPopupOpen: true });
  };

  handleGuestsPopupOpen = () => {
    this.setState({ isGuestsPopupOpen: true });
  };

  handleMoodPopupOpen = () => {
    this.setState({ isMoodPopupOpen: true });
  };

  onDropDownChange = (event, object) => {
    const tags = object.value.map(tag => tag.toLowerCase());
    this.setState({ tags: tags });
    this.refetch_results({ tags: tags });
  };

  displayFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  categoryPopupSelect = service_types => {
    const serviceOptions = [
      { text: 'Accommodation', value: 'accommodation' },
      { text: 'Trip', value: 'trip' },
      { text: 'Food', value: 'food' },
      { text: 'Activity', value: 'activity' },
    ];
    return (
      <div style={{ textTransform: 'capitalize' }}>
        <Dropdown
          placeholder={service_types && service_types[0]}
          options={serviceOptions}
          onChange={this.handleServiceTypeChange}
          fluid
          selection
        />
      </div>
    );
  };

  render() {
    let start_date = this.props.search_query.start_date;
    let formatted_start_date =
      start_date && start_date.length ? moment(parseInt(start_date, 10)).format('YYYY-M-D') : '';
    let end_date = this.props.search_query.end_date;
    let formatted_end_date =
      end_date && end_date.length ? moment(parseInt(end_date, 10)).format('YYYY-M-D') : '';
    let person_nb = this.props.search_query.person_nb;
    let service_types = this.props.search_query.type;
    let address = this.props.search_query.address;
    // let tags = this.props.search_query.tags || [];
    return (
      <section>
        <Wrap>
          <Media query={`(min-width: 600px)`}>
            {matches =>
              matches ? (
                <SentenceWrapper>
                  <div>
                    <p>
                      I want
                      {service_types &&
                      (service_types.includes('activity') ||
                        service_types.includes('accommodation'))
                        ? ' an'
                        : service_types && service_types.includes('food')
                          ? ' '
                          : ' a'}
                    </p>
                  </div>

                  <EditableElement>
                    <Popup
                      trigger={
                        <p style={{ textTransform: 'capitalize' }}>
                          {service_types && service_types[0]}
                        </p>
                      }
                      content={this.categoryPopupSelect(service_types)}
                      on="click"
                      open={this.state.isCategoryPopupOpen}
                      onClose={this.handleCategoryPopupClose}
                      onOpen={this.handleCategoryPopupOpen}
                      position="bottom center"
                    />
                  </EditableElement>

                  <div>
                    <p> &nbsp; {'in '} </p>
                  </div>

                  <EditableElement>
                    <Popup
                      trigger={<p>{address || 'City Name'}</p>}
                      content={
                        <div>
                          <SemanticLocationControl
                            key={address}
                            defaultAddress={address}
                            onChange={this.handleLocationChange}
                          />
                          <Icon
                            style={{ position: 'relative', left: '178px', bottom: '34px' }}
                            name="close"
                            onClick={this.clear_address}
                          />
                        </div>
                      }
                      on="click"
                      open={this.state.isLocationPopupOpen}
                      onClose={this.handleLocationPopupClose}
                      onOpen={this.handleLocationPopupOpen}
                      position="bottom center"
                    />
                  </EditableElement>

                  <div>
                    <p> &nbsp; {'on '} </p>
                  </div>

                  <EditableElement>
                    <Popup
                      trigger={
                        <p>
                          {(formatted_start_date &&
                            formatted_start_date + ' / ' + formatted_end_date) ||
                            'Dates'}
                        </p>
                      }
                      content={
                        <div>
                          <DateRangePicker
                            startDateId="startDate"
                            endDateId="endDate"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onDatesChange={({ startDate, endDate }) => {
                              this.handleDatesChange({ startDate, endDate });
                            }}
                            focusedInput={this.state.focusedInput}
                            onFocusChange={focusedInput => {
                              this.setState({ focusedInput });
                            }}
                          />
                          <Icon
                            style={{ position: 'relative', left: '265px', bottom: '44px' }}
                            name="close"
                            onClick={this.clearDates}
                          />
                        </div>
                      }
                      on="click"
                      open={this.state.isDatesPopupOpen}
                      onClose={this.handleDatesPopupClose}
                      onOpen={this.handleDatesPopupOpen}
                      position="bottom center"
                      style={{ minWidth: '316px' }}
                    />
                  </EditableElement>

                  <div>
                    <p> &nbsp; {'for '} </p>
                  </div>

                  <EditableElement>
                    <Popup
                      trigger={<p>{person_nb + ' Guests' || 'Guests Nb'}</p>}
                      content={
                        <Dropdown
                          placeholder={person_nb || 0 + ' Guests'}
                          options={[
                            { text: 1, value: 1 },
                            { text: 2, value: 2 },
                            { text: 3, value: 3 },
                            { text: 4, value: 4 },
                            { text: 5, value: 5 },
                          ]}
                          onChange={this.handleGuestsNbChange}
                          fluid
                          selection
                        />
                      }
                      on="click"
                      open={this.state.isGuestsPopupOpen}
                      onClose={this.handleGuestsPopupClose}
                      onOpen={this.handleGuestsPopupOpen}
                      position="bottom center"
                    />
                  </EditableElement>

                  <div>
                    <p> &nbsp; &nbsp; </p>
                  </div>

                  <EditableElement>
                    <Popup
                      trigger={
                        <p>
                          <Icon name="plus" />
                          {this.props.tags.length + ' Mood'}
                        </p>
                      }
                      content={
                        <Dropdown
                          name="tags"
                          options={tagsDropdownOptions}
                          placeholder="Add tags"
                          search
                          selection
                          fluid
                          multiple
                          value={this.props.tags.map(
                            tag => tag.charAt(0).toUpperCase() + tag.substr(1),
                          )}
                          onChange={this.onDropDownChange}
                          style={{ minWidth: '250px' }}
                        />
                      }
                      on="click"
                      open={this.state.isMoodPopupOpen}
                      onClose={this.handleMoodPopupClose}
                      onOpen={this.handleMoodPopupOpen}
                      position="bottom center"
                    />
                  </EditableElement>
                </SentenceWrapper>
              ) : (
                <section>
                  {this.state.showFilters ? (
                    <CenteredSection>
                      <Icon
                        name="close"
                        bordered
                        circular
                        onClick={this.displayFilters}
                        style={{ paddingBottom: '2em' }}
                      />

                      <MobileSentenceWrapper>
                        <MobileSentence>
                          <div>
                            <p>
                              I want
                              {service_types &&
                              (service_types.includes('activity') ||
                                service_types.includes('accommodation'))
                                ? ' an'
                                : service_types && service_types.includes('food')
                                  ? ' '
                                  : ' a'}
                            </p>
                          </div>

                          <EditableElement>
                            <Popup
                              trigger={
                                <p style={{ textTransform: 'capitalize' }}>
                                  {service_types && service_types[0]}
                                </p>
                              }
                              content={this.categoryPopupSelect(service_types)}
                              on="click"
                              open={this.state.isCategoryPopupOpen}
                              onClose={this.handleCategoryPopupClose}
                              onOpen={this.handleCategoryPopupOpen}
                              position="bottom center"
                            />
                          </EditableElement>

                          <div>
                            <p> &nbsp; {'in '} </p>
                          </div>

                          <EditableElement>
                            <Popup
                              trigger={<p>{address || 'City Name'}</p>}
                              content={
                                <div>
                                  <SemanticLocationControl
                                    key={address}
                                    defaultAddress={address}
                                    onChange={this.handleLocationChange}
                                  />
                                  <Icon
                                    style={{ position: 'relative', left: '178px', bottom: '34px' }}
                                    name="close"
                                    onClick={this.clear_address}
                                  />
                                </div>
                              }
                              on="click"
                              open={this.state.isLocationPopupOpen}
                              onClose={this.handleLocationPopupClose}
                              onOpen={this.handleLocationPopupOpen}
                              position="bottom center"
                            />
                          </EditableElement>
                        </MobileSentence>
                        <br />
                        <MobileSentence>
                          <div>
                            <p> &nbsp; {'on '} </p>
                          </div>

                          <EditableElement>
                            <Popup
                              trigger={
                                <p>
                                  {(formatted_start_date &&
                                    formatted_start_date + ' / ' + formatted_end_date) ||
                                    'Dates'}
                                </p>
                              }
                              content={
                                <div>
                                  <DateRangePicker
                                    startDateId="startDate"
                                    endDateId="endDate"
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onDatesChange={({ startDate, endDate }) => {
                                      this.handleDatesChange({ startDate, endDate });
                                    }}
                                    focusedInput={this.state.focusedInput}
                                    onFocusChange={focusedInput => {
                                      this.setState({ focusedInput });
                                    }}
                                  />
                                  <Icon
                                    style={{ position: 'relative', left: '265px', bottom: '44px' }}
                                    name="close"
                                    onClick={this.clearDates}
                                  />
                                </div>
                              }
                              on="click"
                              open={this.state.isDatesPopupOpen}
                              onClose={this.handleDatesPopupClose}
                              onOpen={this.handleDatesPopupOpen}
                              position="bottom center"
                              style={{ minWidth: '316px' }}
                            />
                          </EditableElement>

                          <div>
                            <p> &nbsp; {'for '} </p>
                          </div>

                          <EditableElement>
                            <Popup
                              trigger={<p>{person_nb + ' Guests' || 'Guests Nb'}</p>}
                              content={
                                <Dropdown
                                  placeholder={person_nb || 0 + ' Guests'}
                                  options={[
                                    { text: 1, value: 1 },
                                    { text: 2, value: 2 },
                                    { text: 3, value: 3 },
                                    { text: 4, value: 4 },
                                    { text: 5, value: 5 },
                                  ]}
                                  onChange={this.handleGuestsNbChange}
                                  fluid
                                  selection
                                />
                              }
                              on="click"
                              open={this.state.isGuestsPopupOpen}
                              onClose={this.handleGuestsPopupClose}
                              onOpen={this.handleGuestsPopupOpen}
                              position="bottom center"
                            />
                          </EditableElement>
                        </MobileSentence>

                        <EditableElement>
                          <Popup
                            trigger={
                              <p>
                                <Icon name="plus" />
                                {this.props.tags.length + ' Mood'}
                              </p>
                            }
                            content={
                              <Dropdown
                                name="tags"
                                options={tagsDropdownOptions}
                                placeholder="Add tags"
                                search
                                selection
                                fluid
                                multiple
                                value={this.props.tags.map(
                                  tag => tag.charAt(0).toUpperCase() + tag.substr(1),
                                )}
                                onChange={this.onDropDownChange}
                                style={{ minWidth: '250px' }}
                              />
                            }
                            on="click"
                            open={this.state.isMoodPopupOpen}
                            onClose={this.handleMoodPopupClose}
                            onOpen={this.handleMoodPopupOpen}
                            position="bottom center"
                          />
                        </EditableElement>
                      </MobileSentenceWrapper>
                    </CenteredSection>
                  ) : (
                    <CenteredSection>
                      <Icon
                        name="sliders horizontal"
                        bordered
                        circular
                        onClick={this.displayFilters}
                      />
                    </CenteredSection>
                  )}
                </section>
              )
            }
          </Media>
        </Wrap>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filters);
