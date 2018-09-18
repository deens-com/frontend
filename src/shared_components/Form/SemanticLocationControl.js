import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, List, Popup } from 'semantic-ui-react';

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
    const { onChange } = this.props;
    this.setState({ address }, () => {
      if (onChange) onChange(address, placeId);
    });
  };

  render() {
    const { inputProps, inputStyles, onlyCities } = this.props;
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.onAddressChange}
        onSelect={this.onSelect}
        searchOptions={{
          ...(onlyCities ? {types: ['(cities)']} : null)
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <Popup
            basic
            trigger={
              <Form.Input
                icon="map pin"
                iconPosition="left"
                type="text"
                {...getInputProps({
                  ...inputProps,
                  placeholder: inputProps.placeholder || 'Enter location ...',
                })}
                style={inputStyles}
              />
            }
            open={suggestions.length > 0}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            position="bottom left"
            wide
          >
            <List divided selection verticalAlign="middle">
              {suggestions.map(suggestion => (
                <List.Item {...getSuggestionItemProps(suggestion)}>
                  <List.Icon name="location arrow" />
                  <List.Content>{suggestion.description}</List.Content>
                </List.Item>
              ))}
            </List>
          </Popup>
        )}
      </PlacesAutocomplete>
    );
  }
}
