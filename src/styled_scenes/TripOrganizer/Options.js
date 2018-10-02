import React, { Component } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

import I18nText from 'shared_components/I18nText';

const Content = styled.span`
  display: flex;
`;

const GroupTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
  flex-shrink: 1;
  align-self: center;
`;

const Title = styled.span`
  flex: 1;
`;

const Price = styled.span`
  flex: 1;
  font-weight: bold;
`;

const DropdownWrapper = styled.span`
  flex-grow: 1;
`;

function getPrice(base, price) {
  if (price.operator === '+') {
    return price.value + base;
  }

  if (price.operator === '*') {
    return price.value * base;
  }

  return price.value;
}

const Wrapper = styled.div`
  margin: auto;
  display: flex;
`;

function renderOption(option, basePrice) {
  return (
    <Content>
      <Title>{I18nText.translate(option.subtitle || option.title)}</Title> -{' '}
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
    this.props.onChange(this.props.day, this.props.serviceId, data.value);
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
