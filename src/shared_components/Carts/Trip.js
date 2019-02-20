// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Truncate from 'react-truncate';
import { Popup, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFavoriteTrip, removeFavoriteTrip } from 'store/session/actions';

// COMPONENTS
import Thumb from './components/Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from './styles';
import { cardConfig } from 'libs/config';
import { getHeroImage, calculatePricePerDay, generateTripSlug } from 'libs/Utils';
import { Heart } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import { H6, P, PStrong, PSmall, PXSmall } from 'libs/commonStyles';
import { lightText, primary, secondary, darkText } from 'libs/colors';
import { duration } from 'libs/trips';
import Stars from 'shared_components/Rating/Stars';
import { Link } from 'react-router-dom';
import ImgurAvatar from './../../assets/no-avatar.png';

const Wrap = styled.div`
  display: inline-block;
  width: calc(100% - 30px);
  margin: 0 15px;
  position: relative;
  &:focus {
    border: 0;
    outline: 0;
  }
  ${props =>
    props.isPlaceholder &&
    css`
      @keyframes slide {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      &:after {
        content: '';
        top: 0;
        transform: translateX(100%);
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        animation: slide 1s infinite;
        animation-delay: 0;
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.8) 50%,
          rgba(60, 217, 184, 0) 99%,
          rgba(60, 217, 184, 0) 100%
        );
        will-change: transform;
      }
    `};
`;

const Title = styled(H6)`
  color: ${lightText};
  padding: 0 5px 12px;
  max-height: ${cardConfig.titleHeight};
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.33);
  min-height: 50px;
  border-radius: 0 0 15px 0;
  a {
    color: inherit;
  }
`;

const Location = styled.span`
  color: #787878;
  display: flex;
  align-items: flex-start;
  margin-left: 5px;
  font-size: 12px;
  line-height: 16px;

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const Author = styled(Link)`
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
  box-shadow: 0 0 1px;
`;

const AuthorPro = styled.p`
  color: ${primary};
  font-weight: bold;
  font-size: 10px;
  text-align: center;
`;

const Price = styled(PStrong)`
  margin-bottom: 2px;
  flex-grow: 1;
`;

const FirstLine = styled.div`
  display: flex;
`;

const Hearts = styled.div`
  > svg {
    color: ${primary};
    margin-top: 1px;
  }
  display: flex;
  flex-shrink: 0;
`;

const HeartsNumber = styled(PXSmall)`
  margin-left: 6px;
  color: ${darkText};
`;

const SecondLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Duration = styled(P)`
  margin-bottom: 0;
  flex-shrink: 0;
`;

const Tag = styled(PXSmall)`
  display: inline-block;
  color: ${secondary};
  border: 1px solid ${secondary};
  border-radius: 2px 2px 2px 0;
  padding: 1px 3px;
`;

const TagLink = styled(Link)`
  margin-bottom: 5px;
  margin-right: 3px;
  &:last-child {
    margin-right: 0;
  }
`;

const BookableTag = styled(Tag)`
  background-color: ${primary};
  border: 1px solid ${primary};
  color: ${lightText};
  margin-bottom: 5px;
  margin-right: 3px;
`;

const TagsLine = styled.div`
  overflow: hidden;
  height: 52px;
`;

const HeartWrapper = styled.div`
  top: 10px;
  left: 10px;
  position: absolute;
  > svg {
    color: ${props => (props.filled ? primary : 'rgba(60, 217, 170, 0.2)')};
    stroke: white;
    stroke-width: 2px;
    cursor: pointer;
  }
`;

// Placeholders
const ImagePlaceholder = styled.img`
  background-color: #cacaca;
`;

const FirstLinePlaceholder = styled.div`
  background-color: #cacaca;
  width: 60%;
  height: 20px;
  margin-bottom: 5px;
  border-radius: 5px 5px 5px 0;
`;

const SecondLinePlaceholder = styled.div`
  background-color: #cacaca;
  width: 30%;
  height: 18px;
  border-radius: 5px 5px 5px 0;
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

class TripCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      truncated: false,
      sumToHearts: 0,
    };
  }

  handleTruncate = truncated => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  };

  toggleFavorite = event => {
    event.preventDefault();
    //event.stopPropagation();
    const tripId = this.props.item._id;
    if (this.props.favoriteTrips[tripId]) {
      this.props.removeFavoriteTrip(tripId);
      this.setState(prevState => ({
        sumToHearts: prevState.sumToHearts - 1,
      }));
      return;
    }
    this.props.addFavoriteTrip(tripId);
    this.setState(prevState => ({
      sumToHearts: prevState.sumToHearts + 1,
    }));
  };

  renderThumb() {
    const { isPlaceholder, hideAuthor } = this.props;
    const owner = isPlaceholder ? {} : this.props.item.owner;
    const avatar = owner.profilePicture || ImgurAvatar;
    const isFavorite = isPlaceholder ? false : this.props.favoriteTrips[this.props.item._id];

    return (
      <Thumb
        placeholder={isPlaceholder}
        url={isPlaceholder ? '' : getTripImage(this.props.item)}
        withTooltip={this.props.withTooltip}
      >
        <HeartWrapper filled={isFavorite}>
          <Heart style={{ height: '24px', width: '21px' }} onClick={this.toggleFavorite} />
        </HeartWrapper>
        {hideAuthor ? null : (
          <Author to={`/users/${owner.username}`}>
            {isPlaceholder ? <ImagePlaceholder /> : <Image src={avatar} />}
            <Stars
              length={3}
              rating={((isPlaceholder ? 0 : owner.rating.average) * 3) / 5}
              width={8.25}
              height={18}
            />
            {owner.level === 'pro' && <AuthorPro>PRO</AuthorPro>}
          </Author>
        )}
        <Title>
          <Truncate onTruncate={this.handleTruncate} lines={cardConfig.titleLines}>
            {!isPlaceholder && <I18nText data={this.props.item.title} />}
          </Truncate>
        </Title>
      </Thumb>
    );
  }

  renderTags() {
    if (this.props.isPlaceholder) {
      return;
    }
    return this.props.item.tags.map(tag => (
      <TagLink
        to={`/results?tags=${I18nText.translate(tag.names)}&serviceTypes=trip`}
        key={I18nText.translate(tag.names)}
      >
        <Tag>
          <I18nText data={tag.names} />
        </Tag>
      </TagLink>
    ));
  }

  renderContent() {
    if (this.props.isPlaceholder) {
      return (
        <>
          <FirstLinePlaceholder />
          <SecondLinePlaceholder />
        </>
      );
    }
    const hearts = this.props.item.hearts;
    return (
      <>
        <FirstLine>
          <Price>
            ${calculatePricePerDay(this.props.item.basePrice, this.props.item.duration)} per day
          </Price>
          <Hearts>
            <Heart />
            <HeartsNumber>{hearts + this.state.sumToHearts}</HeartsNumber>
          </Hearts>
        </FirstLine>
        <SecondLine>
          <Duration>{duration(this.props.item.duration)}</Duration>
          <Location>
            <PSmall>{formatLocation(this.props.item.location)}</PSmall>
          </Location>
        </SecondLine>
        <TagsLine>
          <BookableTag>Fast Booking</BookableTag>
          {this.renderTags()}
        </TagsLine>
      </>
    );
  }

  renderCard() {
    const { isPlaceholder } = this.props;
    const LinkWrap = isPlaceholder ? ({ children }) => children : Link;
    const linkUrl = isPlaceholder ? '' : `/trips/${generateTripSlug(this.props.item)}`;
    return (
      <Wrap isPlaceholder={isPlaceholder}>
        <Cart column className="card-animate">
          <LinkWrap to={linkUrl}>
            {this.renderThumb()}
            <ContentWrap>{this.renderContent()}</ContentWrap>
          </LinkWrap>
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

const mapStateToProps = state => {
  return {
    favoriteTrips: state.session.favoriteTrips,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addFavoriteTrip,
      removeFavoriteTrip,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripCart);

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
  hideAuthor: PropTypes.bool,
  isPlaceholder: PropTypes.bool,
};

// Default props
TripCart.defaultProps = {
  withTooltip: false,
  hideAuthor: false,
  href: '/',
  isPlaceholder: true,
};
