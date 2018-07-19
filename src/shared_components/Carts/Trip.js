// NPM
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Truncate from 'react-truncate';
import {Popup} from 'semantic-ui-react';

// COMPONENTS
import Rating from '../Rating';
import PriceTag from '../Currency/PriceTag';
import Thumb from './components/Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from './styles';
import { cardConfig } from 'libs/config';
import { PinIcon } from 'shared_components/icons';

const Wrap = styled.div`
  display: inline-block;
  width: 240px;
  padding: 10px;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
  height: ${cardConfig.titleHeight};

  a {
    color: inherit;
  }
`;

const Label = styled.span`
  color: #6e7885;
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const Location = styled.span`
  color: #6e7885;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  height: 44px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
  }

  p {
    width: 100%;
  }
`;

export default class TripCart extends Component {

  constructor(props){
    super(props);
    this.state = {
      truncated: false
    };
  }

  handleTruncate = (truncated) => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated
      });
    }
  }

  render() {
    return (
      <div>
      {
        this.state.truncated ?
          <Popup
            trigger={
              <Wrap>
                <Cart column>
                  <Thumb url={this.props.item.image} tripCount={this.props.item.partOf} withTooltip={this.props.withTooltip} />
                  <ContentWrap>
                    <Title>
                      <Truncate onTruncate={this.handleTruncate} lines={cardConfig.titleLines}>{this.props.item.title}</Truncate>
                    </Title>
                    <Location>
                      <PinIcon />
                      <p>
                        <Truncate lines={cardConfig.locationLines}>{this.props.item.location}</Truncate>
                      </p>
                    </Location>
                    <Rating marginBottom="10px" rating={this.props.item.rating} count={this.props.item.reviews} />
                    <Label>Starting from</Label>
                    <PriceTag price={this.props.item.price} />
                  </ContentWrap>
                </Cart>
              </Wrap>
            }
            content={this.props.item.title}
          />
        :
        <Wrap>
          <Cart column>
            <Thumb url={this.props.item.image} tripCount={this.props.item.partOf} withTooltip={this.props.withTooltip} />
            <ContentWrap>
              <Title>
                <Truncate onTruncate={this.handleTruncate} lines={cardConfig.titleLines}>{this.props.item.title}</Truncate>
              </Title>
              <Location>
                <PinIcon />
                <p>
                  <Truncate lines={cardConfig.locationLines}>{this.props.item.location}</Truncate>
                </p>
              </Location>
              <Rating marginBottom="10px" rating={this.props.item.rating} count={this.props.item.reviews} />
              <Label>Starting from</Label>
              <PriceTag price={this.props.item.price} />
            </ContentWrap>
          </Cart>
        </Wrap>
      }
      </div>
    )
  }
}

// Props Validation
TripCart.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    partof: PropTypes.number,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  withTooltip: PropTypes.bool,
  href: PropTypes.string,
  withShadow: PropTypes.bool,
};

// Default props
TripCart.defaultProps = {
  withTooltip: false,
  withShadow: false,
  href: '/',
};
