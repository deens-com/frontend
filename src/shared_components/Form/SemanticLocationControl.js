import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, List, Popup } from 'semantic-ui-react';
import Input from 'shared_components/StyledInput';
import { MapMarker } from 'shared_components/icons';
import styled from 'styled-components';

const ListSpan = styled.span`
  display: inline-flex;
`;

const ListWrapper = styled.ul`
  list-style-type: none;
`;

const ListItem = styled.li`
  height: 3em;
`;

/**
 * A more advanced version of LocationControl
 * In this component, `onChange` is called only when the user selects a dropdown from the list
 * If you wanna pass props to the input element directly, then pass them in `inputProps` prop
 * If you wanna listen for all the text changes on the input pass `onKeyUp` prop function
 * If you wanna change the styles of the input, pass `inputStyles` prop
 */
export default class SemanticLocationControl extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

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
    // const { onChange } = this.props;
    // this.setState({ address, isOpen: undefined }, () => {
    //   if (onChange) onChange(address, placeId);
    // });
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

  onSelectSuggestion = event => {
    console.log(event.currentTarget);
  };

  render() {
    const { inputProps, inputStyles, onlyCities, useStyledInput } = this.props;
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
          >
            <ListWrapper>
              <article {...getSuggestionItemProps(suggestions.length > 0 && suggestions[0])}>
                <ListItem
                  onClick={this.onSelectSuggestion}
                  queryParams={{
                    suggestionType: 'home',
                    suggestion: suggestions.length > 0 ? suggestions[0].description : '',
                  }}
                >
                  <ListSpan>
                    <List.Icon name="location arrow" />
                    &nbsp;
                    <p>{suggestions.length > 0 && suggestions[0].description}</p>
                  </ListSpan>
                </ListItem>
                <ListItem>
                  <ListSpan>
                    <List.Icon name="location home" />
                    &nbsp;
                    <p>Home in {suggestions.length > 0 && suggestions[0].description}</p>
                  </ListSpan>
                </ListItem>
                <ListItem>
                  <ListSpan>
                    <List.Icon name="location magic" />
                    &nbsp;
                    <p>Experiences in {suggestions.length > 0 && suggestions[0].description}</p>
                  </ListSpan>
                </ListItem>
                <ListItem>
                  <ListSpan>
                    <List.Icon name="location food" />
                    &nbsp;
                    <p>Restaurants in {suggestions.length > 0 && suggestions[0].description}</p>
                  </ListSpan>
                </ListItem>

                {suggestions.slice(1, 4).map(suggestion => (
                  <ListItem key={suggestion.placeId} onClick={this.onSelectSuggestion}>
                    <ListSpan>
                      <List.Icon name="location arrow" />
                      &nbsp;
                      <p>{suggestion.description}</p>
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
