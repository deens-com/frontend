import { getSearchParams } from 'libs/location';
import { geocodeByAddress } from 'libs/placesAutocomplete';
import { getAddress } from 'libs/search';
import { resetButton } from 'libs/styled';
import React, { Component } from 'react';
import LocationAutoSuggest from 'shared_components/Form/LocationAutoSuggest';
import styled from 'styled-components';
import CrossIcon from 'shared_components/icons/CrossIcon';
import { isSearchPage } from 'libs/Utils';

const Form = styled.form`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  background: none;
  border: none;
  display: inline-block;
  flex: 1;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  margin-right: 15px;
  outline: none;
  width: 100%;
`;

const ArrowWrap = styled.span`
  color: #50a18a;
  display: inline-block;
  height: 16px;
  margin-left: 7px;
  margin-right: 3px;
  width: 16px;
`;

const SubmitButton = styled.button`
  ${resetButton({
    fontWeight: '500',
  })};
  align-items: center;
  color: #65afbb;
  display: flex;
  width: auto;
  :active,
  :focus {
    outline: 0;
    border: 0;
  }
`;

const locationProps = {
  inputStyles: {
    height: '100%',
    border: 0,
  },
  inputProps: {
    placeholder: 'Where would you like to go?',
    icon: 'false',
    as: Input,
  },
};

const suggestionStyle = {
  width: '80vw',
  maxWidth: '500px',
};

export default class DesktopSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      mode: 'text',
      inFocus: false,
      serviceType: props.searchParams.type || 'trip',
      params: {},
      text: props.searchParams.text || undefined,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.searchWrapper = React.createRef();
    this.inputRef = React.createRef();
  }

  handleInputChange(ev) {
    this.setState({ search: ev.target.value });
  }

  handleLocationChange(address, serviceType, text) {
    if (text) {
      const params = {
        city: undefined,
        state: undefined,
        countryCode: undefined,
        lat: undefined,
        lng: undefined,
      };
      this.setState({ text, params, address: null, serviceType }, this.handleSearchSubmit);
      return;
    }
    geocodeByAddress(address).then(results => {
      const result = results[0];
      const searchParams = getSearchParams(address, result);
      this.setState(
        { address, params: searchParams, text: null, serviceType },
        this.handleSearchSubmit,
      );
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.setState({
      search: '',
      mode: 'text',
    });
    this.inputRef.current.onReset();
    this.props.updateSearchParams({});
  }

  handleSearchSubmit() {
    if (this.props.toggleSearch && this.props.isMobile) {
      this.props.toggleSearch();
    }
    const { text } = this.state;

    const params = {
      ...this.props.searchParams,
      ...this.state.params,
      topRightLat: undefined,
      topRightLng: undefined,
      bottomLeftLat: undefined,
      bottomLeftLng: undefined,
      text,
      type: text ? 'trip' : this.state.serviceType || this.props.searchParams.type,
      priceStart: undefined,
      priceEnd: undefined,
    };

    this.props.updateSearchParams(params, null, null, null, true);
  }

  handleServiceTypeChange = serviceType => {
    const params = {
      ...this.props.searchParams,
      ...this.state.params,
      text: undefined,
      type: serviceType,
      priceLevel: undefined,
      priceStart: undefined,
      priceEnd: undefined,
      tags: undefined,
      sortBy: undefined,
      accommodationStars: undefined,
      duration: undefined,
      ratingStart: undefined,
      ratingEnd: undefined,
    };
    this.props.updateSearchParams(params);
  };

  render() {
    const { isMobile, toggleSearch, windowLocation } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <LocationAutoSuggest
          onChange={this.handleLocationChange}
          customStyle={suggestionStyle}
          {...locationProps}
          defaultAddress={getAddress(this.props.searchParams)}
          ref={this.inputRef}
          showServiceTypes
          handleServiceTypeChange={this.handleServiceTypeChange}
          serviceType={this.props.searchParams.type}
          hasSearchedText={Boolean(this.state.text)}
          isInResultsPage={isSearchPage(windowLocation.pathname)}
          showGoButton={!isSearchPage(windowLocation.pathname)}
          updateSearchParams={this.props.updateSearchParams}
        />
        {isMobile && (
          <SubmitButton style={{ color: 'grey' }}>
            <ArrowWrap onClick={toggleSearch}>
              <CrossIcon style={{ color: 'grey' }} />
            </ArrowWrap>
          </SubmitButton>
        )}
      </Form>
    );
  }
}
