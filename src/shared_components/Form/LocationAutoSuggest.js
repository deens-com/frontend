import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import PlacesAutocomplete from 'shared_components/PlacesAutocomplete';
import { FormInput, Popup, Icon, Ref } from 'semantic-ui-react';
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
import MapMarker from 'shared_components/icons/MapMarker';
import Briefcase from 'shared_components/icons/Briefcase';
import Activity from 'shared_components/icons/RunningPerson';
import Food from 'shared_components/icons/SilverWare';
import Accommodation from 'shared_components/icons/Bed';
import ReactResizeDetector from 'react-resize-detector';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const Wrapper = styled.div`
  flex-grow: 1;
  width: 0;
  cursor: text;
  display: flex;
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
  z-index: 2;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: white;
  padding: 10px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px 5px 5px 0;
  top: 39px;
  left: -53px;
  > article {
    display: flex;
    flex-direction: column;
  }
`;

const ListItem = styled.li`
  padding: 0.5em 0;
  cursor: pointer;
  order: ${props => props.order || 1};
  display: ${props => (props.hide ? 'none' : 'list-item')};
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
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
`;

const ExternalText = styled.label`
  display: inline-block;
  flex-shrink: 1;
  margin-right: 0.35em;
  cursor: text;
`;

const GoButton = styled.span`
  cursor: pointer;
  border: 1px solid ${primary};
  padding: 1px 5px;
  color: ${primary};
  border-radius: 2px 2px 2px 0;
  margin-left: 10px;
`;
/*
position: absolute;
  background: white;
  right: 0;
  top: 0;
  */

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
    serviceType: PropTypes.oneOf(['trip', 'accommodation', 'food', 'activity', 'none']),
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
    this.setState(
      {
        isOpen: true,
      },
      () => {
        this.inputRef.select();
        this.props.onFocus();
      },
    );
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
        this.onSelectSuggestion(first.description, this.props.serviceType);
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
    if (serviceType === 'trip') {
      return 'Trips';
    }
    return '';
  };

  onResize = width => {
    this.setState(prevState => {
      if (width < 280) {
        if (prevState.showExternal === 'none') {
          return;
        }
        return {
          showExternal: 'none',
        };
      }
      if (width < 340) {
        if (prevState.showExternal === 'partial') {
          return;
        }
        return {
          showExternal: 'partial',
        };
      }
      if (prevState.showExternal === 'full') {
        return;
      }
      return {
        showExternal: 'full',
      };
    });
  };

  renderExternalText() {
    const { hasSearchedText, isInResultsPage, serviceType } = this.props;
    const { showExternal } = this.state;
    const externalText = isInResultsPage ? 'Showing' : 'Search';
    if (hasSearchedText && serviceType === 'trip') {
      return `${externalText} Trips containing`;
    }
    if (showExternal === 'full') {
      return `${externalText} ${this.getSentenceWord()} in`;
    } else if (showExternal === 'partial') {
      return `${this.getSentenceWord()} in`;
    }
    return '';
  }

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
    } = this.props;
    this.changeDefaultAddress(defaultAddress);
    return (
      <>
        <ExternalWrapper>
          {showServiceTypes && <ReactResizeDetector handleWidth onResize={this.onResize} />}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.onAddressChange}
            searchOptions={{
              ...(onlyCities ? { types: ['(cities)'] } : null),
            }}
            onError={this.onError}
            fetchOnInit
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
              return (
                <>
                  <Wrapper onClick={this.handleOpen}>
                    <div style={{ overflow: 'hidden', padding: '2px 0' }}>
                      {!this.state.isOpen &&
                        this.state.address &&
                        showServiceTypes && (
                          <ExternalText onClick={this.handleOpen} htmlFor="search">
                            {this.renderExternalText()}
                          </ExternalText>
                        )}
                      {useStyledInput ? (
                        <I18n>
                          {({ i18n }) => (
                            <StyledInput
                              {...getInputProps({
                                ...inputProps,
                                placeholder: inputProps.placeholder || i18n._(t`Enter location...`),
                              })}
                              leftContent={<MapMarker style={{ fill: '#6E7885' }} />}
                              onFocus={this.handleOpen}
                              onBlur={this.handleClose}
                              onKeyDown={event => this.handleKeyDown(event, suggestions[0])}
                              onKeyUp={this.props.onKeyUp}
                              name="search"
                              innerRef={this.handleInputRef}
                            />
                          )}
                        </I18n>
                      ) : (
                        <>
                          <Ref innerRef={this.handleInputRef}>
                            <I18n>
                              {({ i18n }) => (
                                <FormInput
                                  icon="map pin"
                                  iconPosition="left"
                                  type="text"
                                  {...getInputProps({
                                    ...inputProps,
                                    placeholder:
                                      inputProps.placeholder || i18n._(t`Enter location...`),
                                  })}
                                  style={{
                                    ...inputStyles,
                                    display:
                                      this.state.isOpen || !this.state.address
                                        ? 'inline-block'
                                        : 'none',
                                  }}
                                  onFocus={this.handleOpen}
                                  onBlur={this.handleClose}
                                  onKeyDown={event => this.handleKeyDown(event, suggestions[0])}
                                  onKeyUp={this.props.onKeyUp}
                                  autoFocus={autoFocus}
                                  name="search"
                                />
                              )}
                            </I18n>
                          </Ref>
                          {!this.state.isOpen && (
                            <span style={{ fontWeight: 700 }}>{this.state.address}</span>
                          )}
                        </>
                      )}
                    </div>
                    {!this.state.isOpen &&
                      this.state.address &&
                      this.props.showGoButton && (
                        <GoButton
                          onClick={e => {
                            e.stopPropagation();
                            this.props.updateSearchParams({ type: serviceType }, { noFetch: true });
                          }}
                        >
                          Go
                        </GoButton>
                      )}
                  </Wrapper>
                  {this.state.isOpen &&
                    Boolean(this.state.address) && (
                      <ListWrapper>
                        <ListItem
                          {...getSuggestionItemProps(this.state.address)}
                          order={2}
                          onClick={this.onSelectSearch}
                          hide={serviceType !== 'trip'}
                        >
                          <ListSpan>
                            <GreyIcon name="search" />
                            &nbsp;
                            <p>
                              <Trans>
                                Search for <strong>"{this.state.address}"</strong> in trips
                              </Trans>
                            </p>
                          </ListSpan>
                        </ListItem>
                        {!(Boolean(this.state.address) && suggestions.length === 0) && (
                          <React.Fragment>
                            {suggestions.slice(0, 3).map((suggestion, i) => (
                              <ListItem
                                {...getSuggestionItemProps(suggestion)}
                                key={suggestion.placeId}
                                onClick={() =>
                                  this.onSelectSuggestion(suggestion.description, serviceType)
                                }
                                order={1}
                              >
                                <ListSpan>
                                  <GreyIcon name="map marker alternate" />
                                  &nbsp;
                                  <p>
                                    {serviceType !== 'none' && `${this.getSentenceWord()} in `}
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
                                backgroundColor:
                                  serviceType === 'activity' ? backgroundDark : 'white',
                              }}
                            >
                              <Activity
                                style={{ color: serviceType === 'activity' ? activity : disabled }}
                              />
                            </li>
                          </ServiceTypes>
                        )}
                      </ListWrapper>
                    )}
                </>
              );
            }}
          </PlacesAutocomplete>
        </ExternalWrapper>
      </>
    );
  }
}
