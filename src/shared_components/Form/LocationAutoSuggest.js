import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import PlacesAutocomplete from 'shared_components/PlacesAutocomplete';
import { Form, Popup, Icon, Ref } from 'semantic-ui-react';
import StyledInput from 'shared_components/StyledInput';
import styled from 'styled-components';
import {
  textDark,
  disabled,
  activity,
  accommodation,
  food,
  backgroundDark,
  primary,
} from 'libs/colors';
import {
  MapMarker,
  Activity,
  Briefcase,
  Food,
  Accommodation,
  Pen,
  LinkIcon,
} from 'shared_components/icons';

const Wrapper = styled.div`
  flex-grow: 1;
  input {
    font-weight: bold;
    &::placeholder {
      font-weight: normal;
    }
  }
`;

const ListSpan = styled.span`
  display: inline-flex;
  color: ${disabled};
  strong {
    color: ${textDark};
  }
`;

const ListWrapper = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  > article {
    display: flex;
    flex-direction: column;
  }
`;

const ListItem = styled.li`
  padding: 0.5em 0;
  cursor: pointer;
  order: ${props => props.order || 1};
  &:hover {
    background-color: #f5f5f5;
  }
`;

const GreyIcon = styled(Icon)`
  color: #c4c4c4;
`;

const ServiceTypes = styled.ul`
  order: 10;
  display: flex;
  list-style: none;
  margin-top: 15px;
  > li {
    width: 26px;
    height: 26px;
    border-radius: 2px 2px 2px 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    > svg {
      width: 16px !important;
      height: 16px !important;
    }
  }
`;

const ExternalWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ExternalText = styled.label`
  display: inline-block;
  flex-shrink: 1;
  margin-right: 0.35em;
  cursor: text;
`;

/**
 * A more advanced version of LocationControl
 * In this component, `onChange` is called only when the user selects a dropdown from the list
 * If you wanna pass props to the input element directly, then pass them in `inputProps` prop
 * If you wanna listen for all the text changes on the input pass `onKeyUp` prop function
 * If you wanna change the styles of the input, pass `inputStyles` prop
 * If the user select "Search for..." option, first two "onChange" parameters are null
 */
export default class SemanticLocationControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.defaultAddress || '',
      isOpen: false,
    };
    this.inputRef = null;
  }

  componentDidMount() {
    this.setState({ address: this.props.defaultAddress });
  }

  handleInputRef = input => {
    this.inputRef = input;
  };

  static propTypes = {
    defaultAddress: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    inputProps: PropTypes.object,
    inputStyles: PropTypes.object,
    onlyCities: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    showServiceTypes: PropTypes.bool,
    serviceType: PropTypes.oneOf(['trip', 'accommodation', 'food', 'activity']),
    handleServiceTypeChange: PropTypes.func,
  };

  static defaultProps = {
    defaultAddress: '',
    inputProps: {},
    inputStyles: {},
    onlyCities: false,
    useStyledInput: false,
    onFocus: () => {},
    onBlur: () => {},
    onKeyUp: () => {},
    onKeyDown: () => {},
    showServiceTypes: false,
    serviceType: 'trip',
    handleServiceTypeChange: () => {},
  };

  onAddressChange = address => {
    this.setState({ address });
  };

  onSelect = (address, placeId) => {
    this.inputRef.blur();
    this.setState({ address });
    return null;
  };

  onReset = () => {
    this.setState({ address: '' });
  };

  onError = (error, clearSuggestions) => {
    if (error === 'ZERO_RESULTS') {
      clearSuggestions();
    }
  };

  onSelectSearch = () => {
    this.onSelect(this.state.address);
    this.props.onChange(null, 'trip', this.state.address);
  };

  handleOpen = event => {
    event.target.select();
    this.setState({
      isOpen: true,
    });
    this.props.onFocus();
  };

  handleClose = () => {
    this.setState({
      isOpen: false,
      address: this.props.defaultAddress,
    });
    this.props.onBlur();
  };

  onSelectSuggestion = (address, type) => {
    this.onSelect(address);
    this.props.onChange(address, type);
  };

  handleKeyDown = (event, first) => {
    if (event.key === 'Enter') {
      if (first) {
        this.onSelectSuggestion(first.description, 'trip');
      } else {
        this.onSelectSearch();
      }
    }
    this.props.onKeyDown(event);
  };

  changeDefaultAddress = memoize(address => this.setState({ address }));

  getSentenceWord = () => {
    const { serviceType } = this.props;
    if (serviceType === 'accommodation') {
      return 'Accommodation';
    }
    if (serviceType === 'food') {
      return 'Food';
    }
    if (serviceType === 'activity') {
      return 'Activities';
    }
    return 'Trips';
  };

  render() {
    const {
      inputProps,
      inputStyles,
      onlyCities,
      useStyledInput,
      customStyle = {},
      autoFocus,
      showServiceTypes,
      handleServiceTypeChange,
      serviceType,
      defaultAddress,
      hasSearchedText,
    } = this.props;
    this.changeDefaultAddress(defaultAddress);
    return (
      <>
        <ExternalWrapper>
          {!this.state.isOpen &&
            this.state.address &&
            showServiceTypes && (
              <ExternalText
                onClick={() => {
                  this.inputRef.focus();
                }}
                htmlFor="search"
              >
                {hasSearchedText ? 'Showing Trips with' : `Showing ${this.getSentenceWord()} in`}
              </ExternalText>
            )}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.onAddressChange}
            searchOptions={{
              ...(onlyCities ? { types: ['(cities)'] } : null),
            }}
            onError={this.onError}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
              return (
                <Popup
                  horizontalOffset={50}
                  basic
                  context={this.props.context}
                  trigger={
                    <Wrapper>
                      {useStyledInput ? (
                        <StyledInput
                          {...getInputProps({
                            ...inputProps,
                            placeholder: inputProps.placeholder || 'Enter location ...',
                          })}
                          leftContent={<MapMarker style={{ fill: '#6E7885' }} />}
                          onFocus={this.handleOpen}
                          onBlur={this.handleClose}
                          onKeyDown={event => this.handleKeyDown(event, suggestions[0])}
                          onKeyUp={this.props.onKeyUp}
                          name="search"
                          innerRef={this.handleInputRef}
                        />
                      ) : (
                        <Ref innerRef={this.handleInputRef}>
                          <Form.Input
                            icon="map pin"
                            iconPosition="left"
                            type="text"
                            {...getInputProps({
                              ...inputProps,
                              placeholder: inputProps.placeholder || 'Enter location ...',
                            })}
                            style={inputStyles}
                            onFocus={this.handleOpen}
                            onBlur={this.handleClose}
                            onKeyDown={event => this.handleKeyDown(event, suggestions[0])}
                            onKeyUp={this.props.onKeyUp}
                            autoFocus={autoFocus}
                            name="search"
                          />
                        </Ref>
                      )}
                    </Wrapper>
                  }
                  open={this.state.isOpen && Boolean(this.state.address)}
                  //open={true}
                  position="bottom left"
                  style={{ zIndex: 10000, ...customStyle }}
                >
                  <ListWrapper>
                    <ListItem
                      {...getSuggestionItemProps(this.state.address)}
                      order={2}
                      onClick={this.onSelectSearch}
                    >
                      <ListSpan>
                        <GreyIcon name="search" />
                        &nbsp;
                        <p>
                          Search for <strong>"{this.state.address}"</strong> in trips
                        </p>
                      </ListSpan>
                    </ListItem>
                    {!(Boolean(this.state.address) && suggestions.length === 0) && (
                      <React.Fragment>
                        {suggestions.map((suggestion, i) => (
                          <ListItem
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId}
                            onClick={() => this.onSelectSuggestion(suggestion.description, 'trip')}
                            order={i === 0 ? 1 : 3}
                          >
                            <ListSpan>
                              <GreyIcon name="map marker alternate" />
                              &nbsp;
                              <p>
                                {this.getSentenceWord()} in{' '}
                                <strong>{suggestion.description}</strong>
                              </p>
                            </ListSpan>
                          </ListItem>
                        ))}
                      </React.Fragment>
                    )}
                    {showServiceTypes && (
                      <ServiceTypes
                        onMouseDown={e => {
                          e.preventDefault();
                        }}
                      >
                        <li
                          onClick={() => handleServiceTypeChange('trip')}
                          style={{
                            backgroundColor: serviceType === 'trip' ? backgroundDark : 'white',
                          }}
                        >
                          <Briefcase
                            style={{ color: serviceType === 'trip' ? primary : disabled }}
                          />
                        </li>
                        <li
                          onClick={() => handleServiceTypeChange('accommodation')}
                          style={{
                            backgroundColor:
                              serviceType === 'accommodation' ? backgroundDark : 'white',
                          }}
                        >
                          <Accommodation
                            style={{
                              color: serviceType === 'accommodation' ? accommodation : disabled,
                            }}
                          />
                        </li>
                        <li
                          onClick={() => handleServiceTypeChange('food')}
                          style={{
                            backgroundColor: serviceType === 'food' ? backgroundDark : 'white',
                          }}
                        >
                          <Food style={{ color: serviceType === 'food' ? food : disabled }} />
                        </li>
                        <li
                          onClick={() => handleServiceTypeChange('activity')}
                          style={{
                            backgroundColor: serviceType === 'activity' ? backgroundDark : 'white',
                          }}
                        >
                          <Activity
                            style={{ color: serviceType === 'activity' ? activity : disabled }}
                          />
                        </li>
                      </ServiceTypes>
                    )}
                  </ListWrapper>
                </Popup>
              );
            }}
          </PlacesAutocomplete>
        </ExternalWrapper>
      </>
    );
  }
}
