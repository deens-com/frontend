// NPM
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { media } from 'libs/styled';
import styled from 'styled-components';
import { Popup, Dropdown, Icon, Dimmer } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import a from 'indefinite';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import moment from 'moment';
import Media from 'react-media';
import debounce from 'lodash.debounce';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import StyledInput from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import GuestsSelector from 'shared_components/SelectGuests/GuestsSelector';
import * as results_actions from './../../../scenes/results/actions';

const radiusOptions = [1, 5, 10, 20, 50, 100];

const Wrap = styled.div`
  //margin-left: 20px;
`;

const SentenceWrapper = styled.span`
  display: inline-flex;
  font-weight: bold;
  color: grey;
  position: relative;
  margin-left: 20px;
  width: 100%;
  flex-wrap: wrap;
  flex: 1;
  @media only screen and (max-width: 968px) {
    display: inline-flex;
    padding-bottom: 1em;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  margin-top: 1.3em;
`;

const CenteredSection = styled.section`
  text-align: center;
`;

const EditableElement = styled.div`
  margin-top: ${props => (props.addMargin ? '15px' : '0')};
  color: #4fb798;
  font-weight: bold;
  text-decoration: dashed underline;
  text-underline-position: under;
  cursor: pointer;
  ${media.minSmall} {
    margin-top: 0;
    margin-left: ${props => (props.addMargin ? '15px' : '5px')};
  }
`;

const Sorting = styled.span`
  flex-grow: 0;
  flex-shrink: 1;
  margin-right: 13em;
  display: inline-flex;
`;

const MobileSorting = styled.span`
  display: inline-flex;
  margin-top: 0.9em;
`;

const InputRange = styled.input`
  appearance: none;
  width: 300px;
  height: 15px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  border-radius: 15px;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #38d39f;
    cursor: pointer;
    border-radius: 15px;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #38d39f;
    cursor: pointer;
    border-radius: 15px;
  }

  &::-ms-thumb {
    width: 15px;
    height: 15px;
    background: #38d39f;
    cursor: pointer;
    border-radius: 15px;
  }
`;

const InputRangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;

  span {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 1px;
    background: #d3d3d3;
    height: 10px;
    line-height: 40px;
    margin: 0 0 10px 0;
  }
`;

const ClearTagsWrapper = styled.div`
  margin-top: -10px;
  margin-right: 5px;
  display: flex;
  justify-content: flex-end;
`;

const ClearTagsLink = styled.span`
  color: red;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const defaultOpenStates = {
  isCategoryPopupOpen: false,
  isLocationPopupOpen: false,
  isDatesPopupOpen: false,
  isGuestsPopupOpen: false,
  isMoodPopupOpen: false,
  isSortingPopupOpen: false,
  isRadiusPopupOpen: false,
  isTextPopupOpen: false,
};

class Filters extends Component {
  constructor(props) {
    super(props);
    const radiusIndex = radiusOptions.indexOf(Number(props.search_query.radiusInKm));

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
      text: props.search_query.text || undefined,
      previousPropsText: props.search_query.text,
      adults: props.search_query.adults || undefined,
      children: props.search_query.children || undefined,
      infants: props.search_query.infants || undefined,
      service_type: props.search_query.type || [],
      tags: props.search_query.tags || [],
      showFilters: false,
      startDate: null,
      endDate: null,
      focusedInput: null,
      sortBy: props.search_query.sortBy || null,
      radiusInKm: radiusIndex !== -1 ? radiusIndex : 2,
      ...defaultOpenStates,
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.refetch_results = this.refetch_results.bind(this);
    this.get_query_params = this.get_query_params.bind(this);
    this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
    this.clear_address = this.clear_address.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.search_query.text !== state.previousPropsText) {
      const text = props.search_query.text;

      return {
        text,
        previousPropsText: text,
      };
    }

    if (state.text !== props.search_query.text) {
      const text = state.text || props.search_query.text;

      return {
        text,
      };
    }
    if (state.isRadiusPopupOpen) {
      return null;
    }

    const radiusIndex = radiusOptions.indexOf(Number(props.search_query.radiusInKm));
    if ((radiusIndex === -1) | (radiusIndex === state.radiusInKm)) {
      return null;
    }

    return {
      radiusInKm: radiusIndex,
    };
  }

  get_query_params() {
    return {
      type: this.props.search_query.type,
      start_date: this.props.search_query.start_date,
      end_date: this.props.search_query.end_date,
      adults: Number(this.props.search_query.adults),
      children: Number(this.props.search_query.children),
      infants: Number(this.props.search_query.infants),
      latitude: this.props.search_query.latitude,
      longitude: this.props.search_query.longitude,
      address: this.props.search_query.address,
      tags: this.props.search_query.tags,
      onlySmartContracts: this.props.search_query.onlySmartContracts,
      sortBy: this.props.search_query.sortBy,
      radiusInKm: this.props.search_query.radiusInKm,
      text: this.props.search_query.text,
    };
  }

  refetch_results(param_object) {
    const query_params = this.get_query_params();
    Object.keys(param_object).forEach(param => {
      query_params[param] = param_object[param];
    });
    this.props.update_path(query_params, this.props.history, this.props.routeState);
  }

  refetch_results_for_location(lat, lon, addr) {
    const query_params = this.get_query_params();
    query_params.latitude = lat;
    query_params.longitude = lon;
    query_params.address = addr;
    this.props.update_path(query_params, this.props.history, this.props.routeState);
  }

  refetch_results_for_guests({ adults, children, infants }) {
    const query_params = this.get_query_params();
    query_params.adults = adults;
    query_params.children = children;
    query_params.infants = infants;
    this.props.update_path(query_params, this.props.history, this.props.routeState);
  }

  refetch_results_for_dates(dateRange) {
    const query_params = this.get_query_params();
    query_params.start_date = dateRange.start_date;
    query_params.end_date = dateRange.end_date;
    this.props.update_path(query_params, this.props.history, this.props.routeState);
  }

  debounced_refetch_results = debounce(param_object => {
    this.refetch_results(param_object);
  }, 1000);

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
        addr = results[0].formatted_address;
        this.setState({ address: addr });
        return getLatLng(results[0]);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState({ latitude: lat, longitude: lng });
        this.refetch_results_for_location(lat, lng, addr);
      });
  }

  handleServiceTypeChange(event, data) {
    const type = data.value;
    this.handleCategoryPopupClose();
    this.setState({ service_type: [type] });
    this.refetch_results({ type: [type] });
  }

  handleGuestsNbChange = data => {
    console.log('data', data);
    this.handleGuestsPopupClose();
    this.setState({
      adults: data.adults,
      children: data.children,
      infants: data.infants,
    });
    this.refetch_results_for_guests({
      adults: data.adults,
      children: data.children,
      infants: data.infants,
    });
  };

  handleDatesChange = dateRange => {
    const start = dateRange.startDate; // && dateRange.startDate._d.getTime();
    const end = dateRange.endDate; // && dateRange.endDate._d.getTime();
    this.setState({ startDate: start, endDate: end });
    if (start && end) {
      this.refetch_results_for_dates({ start_date: start, end_date: end });
    }
  };

  clear_address() {
    this.setState({ latitude: '', longitude: '', address: '' });
    this.refetch_results_for_location('', '', '');
  }

  clearDates = () => {
    this.setState({ startDate: '', endDate: '' });
    this.refetch_results_for_dates({ start_date: '', end_date: '' });
  };

  changeRadius = event => {
    this.setState(
      {
        radiusInKm: event.target.value,
      },
      () => {
        this.debounced_refetch_results({ radiusInKm: radiusOptions[this.state.radiusInKm] });
      },
    );
  };

  changeText = (event, data) => {
    const text = event.target.value;
    this.setState(
      {
        text,
        service_type: [],
      },
      () => {
        this.debounced_refetch_results({ text, type: [] });
      },
    );
  };

  getPreposition = () => {
    if (this.state.text || this.state.willTextPopupOpen || this.state.isTextPopupOpen) {
      return ' ';
    }
    if (this.props.tags.length > 0) {
      const sentence = a(this.props.tags[0]);
      return sentence.slice(0, sentence.indexOf(' '));
    }

    const serviceTypes = this.props.search_query.type || [];

    if (serviceTypes.length === 0) {
      return ' ';
    }

    return serviceTypes.includes('activity') || serviceTypes.includes('accommodation')
      ? ' an'
      : serviceTypes.includes('food')
        ? ' '
        : ' a';
  };

  changeOpenState = (key, value) => {
    this.setState({
      ...defaultOpenStates,
      [key]: value,
    });
  };

  isAnyPopupOpen = () => {
    return Object.keys(defaultOpenStates).some(openState => this.state[openState]);
  };

  closeAll = () => {
    this.setState(defaultOpenStates);
  };

  handleCategoryPopupClose = () => {
    this.changeOpenState('isCategoryPopupOpen', false);
  };

  handleLocationPopupClose = () => {
    setTimeout(() => this.changeOpenState('isLocationPopupOpen', false), 0);
  };

  handleRadiusPopupClose = () => {
    this.changeOpenState('isRadiusPopupOpen', false);
  };

  handleTextPopupClose = () => {
    this.changeOpenState('isTextPopupOpen', false);
  };

  handleDatesPopupClose = () => {
    this.changeOpenState('isDatesPopupOpen', false);
  };

  handleGuestsPopupClose = () => {
    this.changeOpenState('isGuestsPopupOpen', false);
  };

  handleMoodPopupClose = () => {
    this.changeOpenState('isMoodPopupOpen', false);
  };

  handleSortingPopupClose = () => {
    this.changeOpenState('isSortingPopupOpen', false);
  };

  handleCategoryPopupOpen = () => {
    this.changeOpenState('isCategoryPopupOpen', true);
  };

  handleLocationPopupOpen = () => {
    this.changeOpenState('isLocationPopupOpen', true);
  };

  handleDatesPopupOpen = () => {
    this.changeOpenState('isDatesPopupOpen', true);
  };

  handleGuestsPopupOpen = () => {
    this.changeOpenState('isGuestsPopupOpen', true);
  };

  handleMoodPopupOpen = () => {
    this.changeOpenState('isMoodPopupOpen', true);
  };

  handleSortingPopupOpen = () => {
    this.changeOpenState('isSortingPopupOpen', true);
  };

  handleRadiusPopupOpen = () => {
    this.changeOpenState('isRadiusPopupOpen', true);
  };

  handleTextPopupOpen = () => {
    this.setState(
      {
        willTextPopupOpen: true,
      },
      () =>
        this.setState({
          willTextPopupOpen: false,
          isTextPopupOpen: true,
        }),
    );
  };

  onDropDownChange = (event, object) => {
    const tags = object.value.map(tag => tag.toLowerCase());
    this.setState({ tags: tags });
    this.refetch_results({ tags: tags });
  };

  onSortingDropDownChange = (event, object) => {
    const sortValue = object.value;
    if (sortValue === 'relevance:desc') {
      this.setState({ sortBy: null });
      this.refetch_results({ sortBy: null });
    } else {
      this.setState({ sortBy: sortValue });
      this.refetch_results({ sortBy: sortValue });
    }
  };

  displayFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  clearTags = () => {
    this.setState({ tags: [] });
    this.refetch_results({ tags: [] });
  };

  categoryPopupSelect = serviceTypes => {
    const serviceOptions = [
      { text: 'Accommodation', value: 'accommodation' },
      { text: 'Trip', value: 'trip' },
      { text: 'Food', value: 'food' },
      { text: 'Activity', value: 'activity' },
    ];
    return (
      <div style={{ textTransform: 'capitalize' }}>
        <Dropdown
          placeholder={serviceTypes && serviceTypes[0]}
          options={serviceOptions}
          onChange={this.handleServiceTypeChange}
          fluid
          selection
        />
      </div>
    );
  };

  sortingText = sortBy => {
    switch (sortBy) {
      case 'price:asc':
        return '↑ Price';
      case 'price:desc':
        return '↓ Price';
      case 'rating:desc':
        return 'Rating';
      default:
        return 'none';
    }
  };

  getProps = type => {
    const props = {
      dates: {
        content: (
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
        ),
        on: 'click',
        open: this.state.isDatesPopupOpen,
        onClose: this.handleDatesPopupClose,
        onOpen: this.handleDatesPopupOpen,
        position: 'bottom center',
        style: { minWidth: '316px' },
      },
      location: {
        content: (
          <div>
            <SemanticLocationControl
              key={this.props.search_query.address}
              defaultAddress={this.props.search_query.address}
              onChange={this.handleLocationChange}
            />
            <Icon
              style={{ position: 'relative', left: '178px', bottom: '34px' }}
              name="close"
              onClick={this.clear_address}
            />
          </div>
        ),
        on: 'click',
        open: this.state.isLocationPopupOpen,
        onOpen: this.handleLocationPopupOpen,
        onClose: this.handleLocationPopupClose,
        position: 'bottom center',
      },
      mood: {
        content: (
          <React.Fragment>
            {this.props.tags.length > 0 && (
              <ClearTagsWrapper>
                <ClearTagsLink onClick={this.clearTags}>Clear tags</ClearTagsLink>
              </ClearTagsWrapper>
            )}
            <Dropdown
              name="tags"
              options={this.props.tagsOptions}
              placeholder="Add tags"
              search
              selection
              fluid
              multiple
              value={this.props.tags
                .map(tag => tag.replace('%20', ' '))
                .map(tag => tag.charAt(0).toUpperCase() + tag.substr(1))}
              onChange={this.onDropDownChange}
              style={{ minWidth: '250px' }}
            />
          </React.Fragment>
        ),
        on: 'click',
        open: this.state.isMoodPopupOpen,
        onClose: this.handleMoodPopupClose,
        onOpen: this.handleMoodPopupOpen,
        position: 'bottom center',
      },
      radius: {
        content: (
          <div style={{ textAlign: 'center' }}>
            {this.state.isRadiusPopupOpen && (
              <InputRange
                type="range"
                min="0"
                max="5"
                step="1"
                value={this.state.radiusInKm}
                onChange={this.changeRadius}
                list="options"
              />
            )}
            <InputRangeValues>
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>20</span>
              <span>50</span>
              <span>100</span>
            </InputRangeValues>
            <datalist id="options">
              <option value="0" />
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="4" />
              <option value="5" />
            </datalist>
          </div>
        ),
        on: 'click',
        open: this.state.isRadiusPopupOpen,
        onClose: this.handleRadiusPopupClose,
        onOpen: this.handleRadiusPopupOpen,
        position: 'bottom center',
      },
      guests: {
        content: (
          <GuestsSelector
            adults={this.props.search_query.adults || 1}
            children={this.props.search_query.children || 0}
            infants={this.props.search_query.infants || 0}
            close={this.handleGuestsPopupClose}
            onApply={this.handleGuestsNbChange}
            relative
          />
        ),
        on: 'click',
        open: this.state.isGuestsPopupOpen,
        onClose: this.handleGuestsPopupClose,
        onOpen: this.handleGuestsPopupOpen,
        position: 'bottom center',
      },
      text: {
        content: (
          <div style={{ textAlign: 'center' }}>
            {this.state.isTextPopupOpen && (
              <StyledInput
                /*value={this.state.text}*/
                onChange={this.changeText}
                defaultValue={this.state.text}
                autoFocus
              />
            )}
          </div>
        ),
        on: 'click',
        open: this.state.isTextPopupOpen,
        onClose: this.handleTextPopupClose,
        onOpen: this.handleTextPopupOpen,
        position: 'bottom center',
        keepInViewPort: false,
      },
      category: {
        content: this.categoryPopupSelect(this.props.search_query.type),
        on: 'click',
        open: this.state.isCategoryPopupOpen,
        onClose: this.handleCategoryPopupClose,
        onOpen: this.handleCategoryPopupOpen,
        position: 'bottom center',
      },
    };

    return props[type];
  };

  renderEditable = (type, trigger, styleProps) => {
    const props = this.getProps(type);
    return (
      <EditableElement {...styleProps}>
        <Popup trigger={<p>{trigger}</p>} {...props} />
      </EditableElement>
    );
  };

  renderText = () => {
    if (!this.state.text && !this.state.willTextPopupOpen && !this.state.isTextPopupOpen) {
      return null;
    }

    return this.renderEditable('text', this.state.text || '...');
  };

  renderMood = () => {
    if (this.props.tags.length === 0 || this.state.text) {
      return null;
    }

    const tags = this.props.tags.slice(0, this.props.tags.length - 1);
    const sentence =
      tags.length > 0
        ? `${tags.join(', ')} and ${this.props.tags[this.props.tags.length - 1]}`
        : this.props.tags[0];

    return this.renderEditable('mood', sentence);
  };

  renderCategory = () => {
    if (this.state.text || this.state.willTextPopupOpen || this.state.isTextPopupOpen) {
      return null;
    }

    const type =
      !this.props.search_query.type || this.props.search_query.type.length === 0
        ? 'accommodation, food and activities'
        : this.props.search_query.type[0];

    return this.renderEditable('category', type);
  };

  renderLocation = () => {
    if (!this.props.search_query.address) {
      return null;
    }

    return (
      <React.Fragment>
        <div>
          <p> &nbsp; {'of '} </p>
        </div>

        {this.renderEditable('location', this.props.search_query.address)}
      </React.Fragment>
    );
  };

  renderRadius = () => {
    if (!this.props.search_query.address) {
      return null;
    }

    const trigger = `${
      this.state.isRadiusPopupOpen
        ? radiusOptions[this.state.radiusInKm]
        : this.props.search_query.radiusInKm
    } km`;
    return (
      <React.Fragment>
        <div>
          <p> &nbsp; {'within '} </p>
        </div>

        {this.renderEditable('radius', trigger)}
      </React.Fragment>
    );
  };

  renderDates = (formatted_start_date, formatted_end_date) => {
    if (!this.props.search_query.start_date) {
      return null;
    }

    return (
      <React.Fragment>
        <div>
          <p> &nbsp; {'from '} </p>
        </div>

        {this.renderEditable(
          'dates',
          `${formatted_start_date} ${formatted_end_date && `to ${formatted_end_date}`}`,
        )}
      </React.Fragment>
    );
  };

  renderGuests = () => {
    if (!this.props.search_query.adults) {
      return null;
    }

    const guests =
      this.props.search_query.adults +
      (this.props.search_query.children || 0) +
      (this.props.search_query.infants || 0);

    return (
      <React.Fragment>
        <div>
          <p> &nbsp; {'for '} </p>
        </div>

        {this.renderEditable('guests', `${guests} guest${guests > 1 ? 's' : ''}`)}
      </React.Fragment>
    );
  };

  renderNotDefinedFilters = () => {
    return (
      <React.Fragment>
        {!this.props.search_query.address &&
          this.renderEditable(
            'location',
            <React.Fragment>
              <Icon name="plus" /> Location
            </React.Fragment>,
            { addMargin: true },
          )}
        {!this.props.search_query.start_date &&
          this.renderEditable(
            'dates',
            <React.Fragment>
              <Icon name="plus" /> Dates
            </React.Fragment>,
            { addMargin: true },
          )}
        {this.props.tags.length === 0 &&
          !this.state.text &&
          (this.props.tagsOptions && this.props.tagsOptions.length > 0) &&
          this.renderEditable(
            'mood',
            <React.Fragment>
              <Icon name="plus" /> Mood
            </React.Fragment>,
            { addMargin: true },
          )}
        {!this.props.search_query.adults &&
          this.renderEditable(
            'guests',
            <React.Fragment>
              <Icon name="plus" /> Guests
            </React.Fragment>,
            { addMargin: true },
          )}
        {!this.state.text &&
          !this.state.isTextPopupOpen &&
          !this.state.willTextPopupOpen && (
            <EditableElement onClick={this.handleTextPopupOpen}>
              <Icon name="plus" /> Text
            </EditableElement>
          )}
      </React.Fragment>
    );
  };

  render() {
    let start_date = this.props.search_query.start_date;
    let formatted_start_date =
      start_date && start_date.length
        ? moment(parseInt(start_date, 10))
            .format('Do MMMM, YYYY')
            .replace(/(\d)(st|nd|rd|th)/g, '$1$2')
        : '';
    let end_date = this.props.search_query.end_date;
    let formatted_end_date =
      end_date && end_date.length ? moment(parseInt(end_date, 10)).format('Do MMMM, YYYY') : '';

    return (
      <section>
        <Wrap>
          <Media query={`(min-width: 968px)`}>
            {matches =>
              matches ? (
                <FiltersWrapper>
                  <SentenceWrapper>
                    <div>
                      <p>Please, find {this.getPreposition()}</p>
                    </div>

                    {this.renderText()}

                    {this.renderMood()}

                    {this.renderCategory()}

                    {this.renderRadius()}

                    {this.renderLocation()}

                    {this.renderDates(formatted_start_date, formatted_end_date)}

                    {this.renderGuests()}

                    {this.renderNotDefinedFilters()}

                    <div>
                      <p> &nbsp; &nbsp; </p>
                    </div>
                  </SentenceWrapper>
                  <Sorting>
                    <p>Sort by </p>

                    <EditableElement>
                      <Popup
                        trigger={
                          <p>
                            {this.props.sortBy
                              ? `${this.sortingText(this.props.sortBy)}`
                              : `Relevance`}
                          </p>
                        }
                        content={
                          <Dropdown
                            name="sort"
                            options={[
                              { text: '', value: '' },
                              { text: '↑ Price', value: 'price:asc' },
                              { text: '↓ Price', value: 'price:desc' },
                              { text: 'Rating', value: 'rating:desc' },
                              { text: 'Relevance', value: 'relevance:desc' },
                            ]}
                            placeholder="Sort By"
                            search
                            selection
                            fluid
                            value={this.props.sortBy}
                            onChange={this.onSortingDropDownChange}
                            style={{ minWidth: '250px' }}
                          />
                        }
                        on="click"
                        open={this.state.isSortingPopupOpen}
                        onClose={this.handleSortingPopupClose}
                        onOpen={this.handleSortingPopupOpen}
                        position="bottom center"
                      />
                    </EditableElement>
                  </Sorting>
                </FiltersWrapper>
              ) : (
                <section>
                  {this.state.showFilters ? (
                    <Dimmer.Dimmable>
                      <Dimmer
                        page
                        inverted
                        active={this.isAnyPopupOpen()}
                        onClickOutside={this.closeAll}
                      />
                      <CenteredSection>
                        <Icon
                          name="close"
                          bordered
                          circular
                          onClick={this.displayFilters}
                          style={{ paddingBottom: '2em' }}
                        />

                        <div>
                          <p>Please, find {this.getPreposition()}</p>
                        </div>

                        {this.renderText()}
                        {this.renderMood()}

                        {this.renderCategory()}

                        {this.renderRadius()}

                        {this.renderLocation()}

                        {this.renderDates(formatted_start_date, formatted_end_date)}

                        {this.renderGuests()}

                        {this.renderNotDefinedFilters()}

                        <MobileSorting>
                          <div>
                            <p> &nbsp; &nbsp; Sort by &nbsp;</p>
                          </div>

                          <EditableElement>
                            <Popup
                              trigger={
                                <p>
                                  {this.props.sortBy
                                    ? `${this.sortingText(this.props.sortBy)}`
                                    : `Relevance`}
                                </p>
                              }
                              content={
                                <Dropdown
                                  name="sort"
                                  options={[
                                    { text: '', value: '' },
                                    { text: '↑ Price', value: 'price:asc' },
                                    { text: '↓ Price', value: 'price:desc' },
                                    { text: 'Rating', value: 'rating:desc' },
                                    { text: 'Relevance', value: 'relevance:desc' },
                                  ]}
                                  placeholder="Sort By"
                                  search
                                  selection
                                  fluid
                                  value={this.props.sortBy}
                                  onChange={this.onSortingDropDownChange}
                                  style={{ minWidth: '250px' }}
                                />
                              }
                              on="click"
                              open={this.state.isSortingPopupOpen}
                              onClose={this.handleSortingPopupClose}
                              onOpen={this.handleSortingPopupOpen}
                              position="bottom center"
                            />
                          </EditableElement>
                        </MobileSorting>
                      </CenteredSection>
                    </Dimmer.Dimmable>
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
    search_query: {
      ...state.ResultsReducer.search_query,
      adults: Number(state.ResultsReducer.search_query.adults) || undefined,
      children: Number(state.ResultsReducer.search_query.children) || undefined,
      infants: Number(state.ResultsReducer.search_query.infants) || undefined,
    },
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Filters),
);
