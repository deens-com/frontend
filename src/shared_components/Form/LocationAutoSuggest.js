import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, Popup, Icon, Ref } from 'semantic-ui-react';
import StyledInput from 'shared_components/StyledInput';
import { MapMarker } from 'shared_components/icons';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const ListSpan = styled.span`
  display: inline-flex;
`;

const ListWrapper = styled.ul`
  list-style-type: none;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  > article {
    display: flex;
    flex-direction: column;
  }
`;

const ListItem = styled.li`
  height: 3em;
  cursor: pointer;
  order: ${props => props.order || 1};
`;

const GreyIcon = styled(Icon)`
  color: #c4c4c4;
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
    inputProps: PropTypes.object,
    inputStyles: PropTypes.object,
    onlyCities: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    defaultAddress: '',
    inputProps: {},
    inputStyles: {},
    onlyCities: false,
    useStyledInput: false,
    onFocus: () => {},
    onBlur: () => {},
  };

  onAddressChange = address => {
    const { onKeyUp } = this.props;
    this.setState({ address }, () => {
      if (onKeyUp) onKeyUp(address);
    });
  };

  onSelect = (address, placeId) => {
    this.inputRef.blur();
    this.setState({ address });
    return null;
  };

  onError = (error, clearSuggestions) => {
    if (error === 'ZERO_RESULTS') {
      clearSuggestions();
    }
  };

  onSelectSearch = () => {
    this.onSelect(this.state.address);
    this.props.onChange(null, null, this.state.address);
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
    });
    this.props.onBlur();
  };

  onSelectSuggestion = (address, type) => {
    this.onSelect(address);
    this.props.onChange(address, type);
  };

  render() {
    const { inputProps, inputStyles, onlyCities, useStyledInput, customStyle = {} } = this.props;
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.onAddressChange}
        searchOptions={{
          ...(onlyCities ? { types: ['(cities)'] } : null),
        }}
        onError={this.onError}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <Popup
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
                    />
                  </Ref>
                )}
              </Wrapper>
            }
            open={this.state.isOpen && Boolean(this.state.address)}
            //open={true}
            position="bottom center"
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
                    <b>Search for</b> {this.state.address}
                  </p>
                </ListSpan>
              </ListItem>
              {!(Boolean(this.state.address) && suggestions.length === 0) && (
                <React.Fragment>
                  <article {...getSuggestionItemProps(suggestions.length > 0 && suggestions[0])}>
                    <ListItem
                      onClick={() => this.onSelectSuggestion(suggestions[0].description, 'trip')}
                    >
                      <ListSpan>
                        <GreyIcon name="travel" />
                        &nbsp;
                        <p>
                          <b>Trips near</b> {suggestions.length > 0 && suggestions[0].description}
                        </p>
                      </ListSpan>
                    </ListItem>
                    <ListItem
                      onClick={() =>
                        this.onSelectSuggestion(suggestions[0].description, 'accommodation')
                      }
                    >
                      <ListSpan>
                        <GreyIcon name="building" />
                        &nbsp;
                        <p>
                          <b>Accommodations near</b>{' '}
                          {suggestions.length > 0 && suggestions[0].description}
                        </p>
                      </ListSpan>
                    </ListItem>
                    <ListItem
                      onClick={() => this.onSelectSuggestion(suggestions[0].description, 'food')}
                    >
                      <ListSpan>
                        <GreyIcon name="food" />
                        &nbsp;
                        <p>
                          <b>Food near</b> {suggestions.length > 0 && suggestions[0].description}
                        </p>
                      </ListSpan>
                    </ListItem>
                    <ListItem
                      onClick={() =>
                        this.onSelectSuggestion(suggestions[0].description, 'activity')
                      }
                    >
                      <ListSpan>
                        <GreyIcon name="globe" />
                        &nbsp;
                        <p>
                          <b>Activities near</b>{' '}
                          {suggestions.length > 0 && suggestions[0].description}
                        </p>
                      </ListSpan>
                    </ListItem>
                  </article>

                  {suggestions.slice(1, 4).map(suggestion => (
                    <ListItem
                      {...getSuggestionItemProps(suggestion)}
                      key={suggestion.placeId}
                      onClick={() => this.onSelectSuggestion(suggestion.description, 'trip')}
                      order={3}
                    >
                      <ListSpan>
                        <GreyIcon name="travel" />
                        &nbsp;
                        <p>
                          <b>Trips near</b> {suggestion.description}
                        </p>
                      </ListSpan>
                    </ListItem>
                  ))}
                </React.Fragment>
              )}
            </ListWrapper>
          </Popup>
        )}
      </PlacesAutocomplete>
    );
  }
}
