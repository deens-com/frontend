// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import Truncate from 'react-truncate';
import { Popup, Image } from 'semantic-ui-react';

import { withRouter } from 'react-router-dom';

// COMPONENTS
import Rating from '../Rating';
import PriceTag from '../Currency/PriceTag';
import Thumb from './components/Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from './styles';
import { cardConfig } from 'libs/config';
import { PinIcon } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import AddToTrip from './AddToTrip';

import ImgurAvatar from './../../assets/no-avatar.png';

const queryString = require('qs');

const Wrap = styled.div`
  // display: inline-block;
  // width: 300px;
  position: relative;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled.h3`
  font-size: 18px;
  font-height: 21px;
  color: #3c434b;
  font-weight: bold;
  margin-bottom: 12px;
  max-height: ${cardConfig.titleHeight};
  a {
    color: inherit;
  }
  position: relative;
  bottom: 1.4em;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: #545454;
  position: relative;
  bottom: 1.5em;
`;

const Price = styled.span`
  color: #3c434b;
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
`;

const Location = styled.span`
  color: #787878;
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
  padding-top: 5px;
  height: 44px;
  font-size: 12px;
  line-height: 14px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
    top: 3px;
  }

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const ContentFooter = styled.div`
  margin-top: auto;
  position: absolute;
  bottom: ${props => (props.isTrip ? '60px' : '0')};
  max-width: 74%;
`;

const Duration = styled.div`
  color: #50a18a;
  margin-top: -15px;
`;

const Author = styled.div`
  margin: 0 22px;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  height: 43px;
  width: 43px;
`;

const AuthorText = styled.div`
  margin-left: 10px;
  color: #3c434b;
`;

const Created = styled.p`
  font-size: 10px;
  line-height: 12px;
  margin-bottom: 0;
`;

const Username = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: bold;
`;

function formatLocation(location) {
  let result = '';
  if (location.city) {
    result = location.city;
    if (location.country) {
      result = result.concat(`, ${location.country.names['en-us']}`);
    }
    return result;
  }
  return location;
}

const duration = minutes => {
  return moment.duration(minutes || 0, 'minutes').humanize();
};

class TripCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      truncated: false,
      showTitlePopup: false,
    };
  }

  onMouseEnter = () => {
    const { onOver, item } = this.props;
    if (onOver) {
      onOver(item.objectId);
    }
    if (!this.state.truncated) return;
    this.setState({ showTitlePopup: true });
  };

  onMouseLeave = () => {
    const { onLeave, item } = this.props;
    if (onLeave) {
      onLeave(item.objectId);
    }
    if (!this.state.truncated) return;
    this.setState({ showTitlePopup: false });
  };

  handleTruncate = truncated => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  };

  isViewTypeOf = type => {
    const param = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });

    if (param.serviceTypes === type || this.props.type === type) {
      return true;
    }

    return false;
  };

  renderContent() {
    const { item, isTrip } = this.props;
    const { average: rating, count } = (item && item.ratings) || 0;
    let avatar, owner;

    if (isTrip) {
      owner = item.owner;
      avatar = owner.profilePicture || ImgurAvatar;
    }

    return (
      <Wrap>
        <Cart column className="card-animate">
          {Boolean(this.props.addToTrip) && (
            <AddToTrip serviceId={item.objectId} data={this.props.addToTrip} />
          )}
          <Thumb
            url={
              (item.media.length && item.media[0].files.thumbnail.url) ||
              'https://please-com.imgix.net/7a7b798deb8064c64f57bff9ffeaa53a_1531363432782-4561574624.jpg?auto=format&dpr=1&crop=faces&fit=crop&w=800&h=500&ixlib=react-7.2.0'
            }
            tripCount={item.partOf}
            withTooltip={this.props.withTooltip}
          />
          <ContentWrap small={this.isViewTypeOf('food')}>
            {this.isViewTypeOf('food') || this.isViewTypeOf('accommodation') ? (
              <div />
            ) : (
              <Duration>{duration(this.props.item.duration)}</Duration>
            )}

            <Title
              innerRef={x => {
                this.titleRef = x;
              }}
            >
              <Truncate
                onTruncate={!this.state.truncated && this.handleTruncate}
                lines={cardConfig.titleLines}
              >
                <I18nText data={item.title} />
              </Truncate>
              <Rating rating={rating} count={count} marginBottom="10px" />
            </Title>

            {!this.isViewTypeOf('food') && (
              <Description>
                <Truncate lines={cardConfig.descriptionLines}>
                  <I18nText data={item.description} />
                </Truncate>
              </Description>
            )}
            <ContentFooter isTrip={isTrip}>
              <Price>
                {this.isViewTypeOf('food') ? 'Average ' : 'From '}
                <PriceTag unit="hidden" price={item.basePrice}>
                  {({ symbol, convertedPrice }) => `${symbol}${convertedPrice}`}
                </PriceTag>{' '}
                per person
              </Price>
              <Location>
                <PinIcon />
                <p>
                  <Truncate lines={cardConfig.locationLines}>
                    {formatLocation(item.location)}
                  </Truncate>
                </p>
              </Location>
            </ContentFooter>
          </ContentWrap>
          {isTrip && (
            <Author>
              <AvatarWrapper>
                <Image src={avatar} circular />
              </AvatarWrapper>
              <AuthorText>
                <Created>Created by</Created>
                <Username>{owner.username}</Username>
              </AuthorText>
            </Author>
          )}
        </Cart>
      </Wrap>
    );
  }

  render() {
    const { item } = this.props;

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {this.state.truncated && (
          <Popup content={item.title} context={this.titleRef} open={this.state.showTitlePopup} />
        )}

        {this.renderContent()}
      </div>
    );
  }
}

// Props Validation
TripCard.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    partof: PropTypes.number,
    //title: PropTypes.object,
    //description: PropTypes.object,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  withTooltip: PropTypes.bool,
  href: PropTypes.string,
  withShadow: PropTypes.bool,
  onOver: PropTypes.func,
  onLeave: PropTypes.func,
  isTrip: PropTypes.bool,
};

// Default props
TripCard.defaultProps = {
  withTooltip: false,
  withShadow: false,
  href: '/',
};

export default withRouter(TripCard);
