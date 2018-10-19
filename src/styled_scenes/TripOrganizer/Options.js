import React, { Component } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

import I18nText from 'shared_components/I18nText';

const Content = styled.span`
  font-size: 12px;
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

function getPrice(base, price) {
  if (price.operator === '+') {
    return price.value + base;
  }

  if (price.operator === '*') {
    return price.value * base;
  }

  return Number(price.value);
}

function renderOption(option, basePrice) {
  return (
    <Content>
      <Title>{I18nText.translate(option.subtitle || option.title)}</Title>
      <Price>${getPrice(basePrice, option.price)}</Price>
    </Content>
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
          price: getPrice(props.basePrice, option.price),
        })),
        groupName: props.options.groupName,
      },
    };
  }

  onDropdownChange = (event, data) => {
    const price = data.options.find(option => option.value === data.value).price;
    this.props.onChange(this.props.day, this.props.serviceId, data.value, price);
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
