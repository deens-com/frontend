import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, List, Popup, Icon } from 'semantic-ui-react';
import Input from 'shared_components/StyledInput';
import { MapMarker } from 'shared_components/icons';
import styled from 'styled-components';

const ListSpan = styled.span`
  display: inline-flex;
`;

const ListWrapper = styled.ul`
  list-style-type: none;
  min-width: 100%;
`;

const ListItem = styled.li`
  height: 3em;
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
 */
export default class SemanticLocationControl extends Component {
  static propTypes = {
    defaultAddress: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    inputProps: PropTypes.object,
    inputStyles: PropTypes.object,
    onlyCities: PropTypes.bool,
  };

  static defaultProps = {
    defaultAddress: '',
    inputProps: {},
    inputStyles: {},
    onlyCities: false,
    useStyledInput: false,
  };

  state = {
    address: this.props.defaultAddress,
  };

  onAddressChange = address => {
    const { onKeyUp } = this.props;
    this.setState({ address }, () => {
      if (onKeyUp) onKeyUp(address);
    });
  };

  onSelect = (address, placeId) => {
    this.setState({ address, isOpen: undefined });
    return null;
  };

  openMenu = event => {
    event.target.select();
    this.setState({
      isOpen: true,
    });
  };

  closeMenu = () => {
    this.setState({
      isOpen: false,
    });
  };

  onSelectSuggestion = (address, type) => {
    this.props.onChange(address, type);
  };

  render() {
    const { inputProps, inputStyles, onlyCities, useStyledInput, customStyle = {} } = this.props;
    const { isOpen } = this.state;

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.onAddressChange}
        onSelect={this.onSelect}
        searchOptions={{
          ...(onlyCities ? { types: ['(cities)'] } : null),
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <Popup
            basic
            trigger={
              useStyledInput ? (
                <Input
                  {...getInputProps({
                    ...inputProps,
                    placeholder: inputProps.placeholder || 'Enter location ...',
                  })}
                  leftContent={<MapMarker style={{ fill: '#6E7885' }} />}
                  onFocus={this.openMenu}
                  onBlur={this.closeMenu}
                />
              ) : (
                <Form.Input
                  icon="map pin"
                  iconPosition="left"
                  type="text"
                  {...getInputProps({
                    ...inputProps,
                    placeholder: inputProps.placeholder || 'Enter location ...',
                  })}
                  style={inputStyles}
                  onFocus={this.openMenu}
                  onBlur={this.closeMenu}
                />
              )
            }
            open={suggestions.length > 0 && isOpen}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            position="bottom left"
            wide
            style={customStyle}
          >
            <ListWrapper>
              <article {...getSuggestionItemProps(suggestions.length > 0 && suggestions[0])}>
                <ListItem onClick={() => this.onSelectSuggestion(suggestions[0].description, '')}>
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
                  onClick={() => this.onSelectSuggestion(suggestions[0].description, 'activity')}
                >
                  <ListSpan>
                    <GreyIcon name="globe" />
                    &nbsp;
                    <p>
                      <b>Activities near</b> {suggestions.length > 0 && suggestions[0].description}
                    </p>
                  </ListSpan>
                </ListItem>

                {suggestions.slice(1, 4).map(suggestion => (
                  <ListItem
                    key={suggestion.placeId}
                    onClick={() => this.onSelectSuggestion(suggestion.description, '')}
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
              </article>
            </ListWrapper>
          </Popup>
        )}
      </PlacesAutocomplete>
    );
  }
}
