// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { getSearchParams } from 'libs/location';
import history from './../../../main/history';

// COMPONENTS
import { CrossIcon, SearchIcon } from '../../icons';
import SemanticLocationControl from 'shared_components/Form/LocationAutoSuggest';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { disabled } from 'libs/colors';

// ACTIONS/CONFIG
import { resetButton } from '../../../libs/styled';

// STYLES
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  max-width: 540px;
  padding-right: ${props => (props.isMobile ? '0' : '25px')};
`;

const Inner = styled.div`
  background-color: #ffffff;
  border-radius: 10px 10px 10px 0;
  border: solid 1px ${props => (props.inFocus ? '#65AFBB' : '#eef1f4')};
  display: flex;
  flex: 1;
  height: 48px;
  padding: 8px 12px;
  transition: border 0.1s ease-in;
  width: 100%;
`;

const IconButton = styled.span`
  display: inline-block;
  margin-top: 3px;
  color: ${disabled};
  font-size: 24px;
  height: 26px;
  margin-right: 8px;
  width: 26px;

  &:last-child {
    margin-right: 15px;
  }
`;

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

// MODULE
export default class DesktopSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      mode: 'text',
      inFocus: false,
      serviceType: 'trip',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.searchWrapper = React.createRef();
    this.inputRef = React.createRef();
  }
  onFocus() {
    this.setState({ inFocus: true });
  }
  onBlur() {
    this.setState({ inFocus: false });
  }
  handleInputChange(ev) {
    this.setState({ search: ev.target.value });
  }
  handleSubmit(ev) {
    ev.preventDefault();
    //const query_string = 'keywords=' + this.state.search;
    this.setState({
      search: '',
      mode: 'text',
    });
    this.inputRef.current.onReset();
    history.push(`/results`);
  }
  handleLocationChange(address, serviceType, text) {
    if (text) {
      this.setState({ text, address: null }, this.handleSearchSubmit);
      return;
    }
    geocodeByAddress(address).then(results => {
      const result = results[0];
      const searchParams = getSearchParams(result);
      this.setState({ address, serviceType, ...searchParams, text: null }, this.handleSearchSubmit);
    });
  }
  handleSearchSubmit(serviceType) {
    const query_params = {
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      city: this.state.city,
      state: this.state.state,
      countryCode: this.state.countryCode,
      serviceTypes: this.state.serviceType,
      text: this.state.text,
      serviceType,
    };
    let query_arr = [];
    Object.entries(query_params).forEach(([key, value]) => {
      if (value) {
        let to_concat = key + '=' + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join('&');
    if (this.props.toggleSearch && this.props.isMobile) {
      this.props.toggleSearch();
    }
    history.push(`/results?${query_string}`);
  }

  handleServiceTypeChange = serviceType => {
    this.handleSearchSubmit(serviceType);
  };

  render() {
    const { isMobile, toggleSearch } = this.props;
    return (
      <Wrapper isMobile={isMobile} inFocus={this.state.inFocus}>
        <Inner>
          <div>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <Form onSubmit={this.handleSubmit}>
            {/*<Input
              ref={el => {
                this.input = el;
              }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.state.search}
              onChange={this.handleInputChange}
              type="text"
              placeholder="Tell us about your dream stay"
            />*/}

            <SemanticLocationControl
              onChange={this.handleLocationChange}
              customStyle={suggestionStyle}
              {...locationProps}
              defaultAddress={this.props.text || this.props.address}
              ref={this.inputRef}
              showServiceTypes
              handleServiceTypeChange={this.handleServiceTypeChange}
              serviceType={this.state.serviceType}
            />

            {isMobile && (
              <SubmitButton style={{ color: 'grey' }}>
                <ArrowWrap onClick={toggleSearch}>
                  <CrossIcon style={{ color: 'grey' }} />
                </ArrowWrap>
              </SubmitButton>
            )}
          </Form>
        </Inner>
      </Wrapper>
    );
  }
}

// Props Validation
DesktopSearch.propTypes = {};
