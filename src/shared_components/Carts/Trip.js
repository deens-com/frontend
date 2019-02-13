// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Truncate from 'react-truncate';
import { Popup, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// COMPONENTS
import PriceTag from '../Currency/PriceTag';
import Thumb from './components/Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from './styles';
import { cardConfig } from 'libs/config';
import { getHeroImage, generateTripSlug } from 'libs/Utils';
import { PinIcon } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import { H6, P, PStrong, PSmall, PXSmall } from 'libs/commonStyles';
import { lightText, primary, secondary } from 'libs/colors';
import { duration } from 'libs/trips';

import ImgurAvatar from './../../assets/no-avatar.png';

const Wrap = styled.div`
  display: inline-block;
  width: 255px;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled(H6)`
  color: ${lightText};
  padding: 0 5px 12px;
  max-height: ${cardConfig.titleHeight};
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.33);
  a {
    color: inherit;
  }
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: #545454;
`;

const Location = styled.span`
  color: #787878;
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
  margin-left: 5px;
  height: 44px;
  font-size: 12px;
  line-height: 14px;

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const Author = styled.div`
  border-radius: 5px 5px 5px 0;
  > img {
    border-radius: 4px 4px 0 0;
    height: 33px;
    width: 33px;
  }
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid white;
  background-color: white;
`;

const AuthorPro = styled.p`
  color: ${primary};
  font-weight: bold;
  font-size: 10px;
  text-align: center;
`;

const Price = styled(PStrong)`
  margin-bottom: 2px;
`;

const SecondLine = styled.div`
  display: flex;
`;

const Tag = styled(PXSmall)`
  display: inline-block;
  color: ${secondary};
  border: 1px solid ${secondary};
  border-radius: 2px 2px 2px 0;
  margin-right: 3px;
  padding: 1px 3px;
  margin-bottom: 5px;
  &:last-child {
    margin-right: 0;
  }
`;

export function formatLocation(location) {
  let result = '';
  if (!location) {
    return result;
  }

  if (location.city) {
    result = location.city;
    if (location.state) {
      result = result.concat(`, ${location.state}`);
    }
    return result;
  }
  return location.state;
}

function getTripImage(item) {
  if (!item.media || item.media.length === 0) {
    return '';
  }
  return getHeroImage(item).files.thumbnail.url;
}

export default class TripCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      truncated: false,
    };
  }

  handleTruncate = truncated => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  };

  renderTags() {
    console.log();
    return this.props.item.tags.map(tag => (
      <Tag>
        <I18nText data={tag.names} />
      </Tag>
    ));
  }

  renderCard() {
    const { owner } = this.props.item;
    const avatar = owner.profilePicture || ImgurAvatar;

    return (
      <Wrap>
        <Cart column className="card-animate">
          <Thumb
            url={getTripImage(this.props.item)}
            tripCount={this.props.item.partOf}
            withTooltip={this.props.withTooltip}
          >
            <Author>
              <Image src={avatar} />
              <AuthorPro>PRO</AuthorPro>
            </Author>
            <Title>
              <Truncate onTruncate={this.handleTruncate} lines={cardConfig.titleLines}>
                <I18nText data={this.props.item.title} />
              </Truncate>
            </Title>
          </Thumb>
          <ContentWrap>
            <Price>
              {' '}
              <PriceTag unit="hidden" price={this.props.item.basePrice}>
                {({ symbol, convertedPrice }) => `${symbol}${convertedPrice}`}
              </PriceTag>{' '}
              per day
            </Price>
            <SecondLine>
              <P>{duration(this.props.item.duration)}</P>
              <Location>
                <PSmall>{formatLocation(this.props.item.location)}</PSmall>
              </Location>
            </SecondLine>
            {this.renderTags()}
          </ContentWrap>
        </Cart>
      </Wrap>
    );
  }

  render() {
    return (
      <div>
        {this.state.truncated ? (
          <Popup trigger={this.renderCard()} content={this.props.item.title} />
        ) : (
          this.renderCard()
        )}
      </div>
    );
  }
}

// Props Validation
TripCart.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    partof: PropTypes.number,
    title: PropTypes.object,
    description: PropTypes.object,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    owner: PropTypes.object,
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
