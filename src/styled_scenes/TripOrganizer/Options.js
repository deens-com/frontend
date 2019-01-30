import React, { Component } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

import I18nText from 'shared_components/I18nText';
import { getPriceFromServiceOption } from 'libs/Utils';

const Content = styled.div`
  font-size: 14px;
`;

const GroupTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
  margin-bottom: 3px;
  align-self: center;
`;

const Title = styled.span`
  flex: 1;
  flex-grow: 1;
`;

const Price = styled.span`
  flex: 1;
  font-weight: bold;
  flex-shrink: 1;
  margin-left: 15px;
`;

const DropdownWrapper = styled.span`
  flex-grow: 1;
`;

const Wrapper = styled.div`
  padding: 5px 10px;
`;

const OptionWrapper = styled.div``;

const Metadata = styled.div`
  font-size: 11px;
  > b {
    font-weight: bold;
  }
`;

function renderOption(option, basePrice) {
  return (
    <OptionWrapper>
      <Content>
        <Title>{I18nText.translate(option.title || option.subtitle)}</Title>
        <Price>${getPriceFromServiceOption(basePrice, option.price)}</Price>
      </Content>
      {option.mealType && (
        <Metadata>
          <b>Meal type:</b> <I18nText data={option.mealType} />
        </Metadata>
      )}
      {option.roomType && (
        <Metadata>
          <b>Room type:</b> <I18nText data={option.roomType} />
        </Metadata>
      )}
    </OptionWrapper>
  );
}

export default class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.options) {
      return null;
    }

    return {
      options: {
        data: props.options.options.map(option => ({
          key: option.otherAttributes.availabilityCode.code,
          value: option.otherAttributes.availabilityCode.code,
          content: renderOption(option, props.basePrice),
          text: renderOption(option, props.basePrice),
          price: getPriceFromServiceOption(props.basePrice, option.price),
          cancellable: option.cancellable,
        })),
        groupName: props.options.groupName,
      },
    };
  }

  onDropdownChange = (event, data) => {
    const option = data.options.find(option => option.value === data.value);
    const { price, cancellable } = option;
    this.props.onChange(this.props.day, this.props.instanceId, data.value, price, cancellable);
  };

  render() {
    const { value } = this.props;
    const { options } = this.state;

    if (!options) {
      return null;
    }

    return (
      <Wrapper>
        <GroupTitle>
          <I18nText data={options.groupName} />
        </GroupTitle>
        <DropdownWrapper>
          <Dropdown
            name="selectOption"
            placeholder="Select option"
            selection
            fluid
            value={value}
            onChange={this.onDropdownChange}
            options={options.data}
          />
        </DropdownWrapper>
      </Wrapper>
    );
  }
}
