// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { buildImgUrl, extractPrice, extractPricePer, PRICE_PER_SESSION } from 'libs/Utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFavoriteTrip, removeFavoriteTrip } from 'store/session/actions';
import searchActions from 'store/search/actions';
import CssOnlyTruncate from 'shared_components/CssOnlyTruncate';
import Pencil from 'shared_components/icons/PencilIcon';
import Star from 'shared_components/icons/Star';
import CartSpeed from 'shared_components/icons/CartSpeed';

// COMPONENTS
import Thumb from './components/Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from './styles';
import { generateTripSlug, generateServiceSlug } from 'libs/Utils';
import { getImageUrlFromMedia } from 'libs/media';
import Heart from 'shared_components/icons/Heart';
import I18nText, { translate } from 'shared_components/I18nText';
import { H6, P, PSmallStrong, PStrong, PSmall, PXSmall } from 'libs/commonStyles';
import * as colors from 'libs/colors';
import { duration } from 'libs/trips';
import urls from 'libs/urlGenerator';
import Stars from 'shared_components/Rating/Stars';
import { Link } from 'react-router-dom';
import ImgurAvatar from 'assets/no-avatar.png';
import Rating from 'shared_components/Rating';
import Camera from 'shared_components/icons/Camera';
import InlineInput from 'shared_components/InlineInput';
import TagSelector from 'shared_components/TagSelector';

const Wrap = styled.div`
  display: inline-block;
  min-width: 255px;
  width: calc(100% - 30px);
  max-width: 510px;
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
        will-change: transform;
      }
    `};
`;

const LinkWrapper = styled(Link)`
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Title = styled(H6)`
  padding: 5px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 15px 0;
  z-index: 1;
  pointer-events: none;
  a {
    color: inherit;
  }
`;

const Location = styled.span`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  line-height: 16px;

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const Dot = styled.span`
  color: ${colors.secondary};
  margin: 0 5px;

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const AuthorPro = styled(PSmallStrong)`
  background-color: ${colors.backgroundLight};
  border-radius: 3px;
  color: ${colors.tertiary};
  padding: 0 5px;
  display: inline-block;
  height: 18px;
  vertical-align: bottom;
  margin-right: 5px;
`;

const Price = styled(PStrong)`
  margin-bottom: 2px;
  flex-grow: 1;
  z-index: 1;
`;

const PriceText = styled.span`
  font-size: 14px;
`;

const FoodPriceBackground = styled(PStrong)`
  position: absolute;
  color: ${colors.disabled};
`;

const FirstLine = styled.div`
  display: flex;
`;

const RatingWrapper = styled.div`
  > svg {
    color: ${colors.secondary};
    margin-top: 1px;
  }
  display: flex;
  flex-shrink: 0;
`;

const HeartsNumber = styled(PXSmall)`
  margin-left: 6px;
  color: ${colors.textDark};
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
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: 2px 2px 2px 0;
  padding: 1px 3px;
`;

const TagLink = styled.span`
  display: inline-block;
  cursor: pointer;
  position: relative;
  z-index: 1;
  margin-bottom: 5px;
  line-height: 1.8em;
  margin-right: 3px;
  &:last-child {
    margin-right: 0;
  }
`;

const BookableTag = styled(PSmallStrong)`
  background-color: ${colors.backgroundLight};
  border-radius: 3px;
  color: ${colors.textDark};
  padding: 0 5px;
  display: inline-block;
  height: 18px;
  vertical-align: bottom;
  line-height: 16px;
`;

const AboveTitle = styled.div`
  right: 5px;
  top: -30px;
  position: absolute;
  text-align: right;
`;

const TagsLine = styled.div`
  overflow: hidden;
  min-height: calc(3.6em + 5px);
`;

const HeartWrapper = styled.div`
  top: 10px;
  left: 10px;
  position: absolute;
  z-index: 2;
  > svg {
    color: ${props => (props.filled ? colors.secondary : 'rgba(217,117,110,0.3)')};
    stroke: white;
    stroke-width: 1px;
    cursor: pointer;
    ${props => props.editMode && 'cursor: initial;'};
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

const AddImage = styled.div`
  border-radius: 3px;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.33);
  top: 10px;
  right: 10px;
  z-index: 1;
  padding: 5px 8px;
  cursor: pointer;
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
  return getImageUrlFromMedia(item.media, 'thumbnail');
}

class TripCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sumToHearts: 0,
    };
  }

  toggleFavorite = event => {
    event.preventDefault();
    if (this.props.editMode) {
      return;
    }
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

  isFastBookable = () => {
    if (this.props.type === 'trip') {
      return this.props.item.fastBookable;
    }
    return this.props.item.checkoutOptions && this.props.item.checkoutOptions.payAt === 'please';
  };

  enableEditTagsMode = () => {
    this.setState({
      isEditingTags: true,
    });
  };

  disableEditTagsMode = () => {
    this.setState({
      isEditingTags: false,
    });
  };

  renderAboveTitle() {
    const { isPlaceholder } = this.props;
    const owner = isPlaceholder ? {} : this.props.item.owner;
    return (
      <AboveTitle>
        {owner && owner.level === 'pro' && <AuthorPro>PRO</AuthorPro>}
        {this.isFastBookable() && (
          <BookableTag>
            <CartSpeed
              style={{
                color: colors.tertiary,
                display: 'inline-block',
                width: 12,
                height: 12,
                verticalAlign: 'middle',
              }}
            />
            <span style={{ verticalAlign: 'middle', marginLeft: '5px' }}>fast booking</span>
          </BookableTag>
        )}
      </AboveTitle>
    );
  }

  renderTitle() {
    const { isPlaceholder, editMode, item } = this.props;
    if (editMode) {
      return (
        <Title>
          {this.renderAboveTitle()}
          <InlineInput
            iconColor={colors.primary}
            useTextarea
            autoexpand
            preventLineBreak
            onChanged={this.props.onTitleChange}
          >
            {this.props.item.title}
          </InlineInput>
        </Title>
      );
    }
    return (
      <Title>
        {this.renderAboveTitle()}
        <CssOnlyTruncate>
          {!isPlaceholder && (
            <>
              {item.ratings &&
                this.props.type === 'accommodation' && (
                  <>
                    <span style={{ fontWeight: 'bold', color: colors.tertiary }}>
                      {item.ratings.average}
                    </span>
                    <Star
                      style={{
                        display: 'inline-block',
                        marginRight: '5px',
                        paddingTop: '3px',
                        color: colors.tertiary,
                      }}
                    />
                  </>
                )}
              <I18nText data={this.props.item.title} />
            </>
          )}
        </CssOnlyTruncate>
      </Title>
    );
  }

  renderThumb() {
    const { isPlaceholder, editMode, type } = this.props;
    const isFavorite = isPlaceholder ? false : this.props.favoriteTrips[this.props.item._id];

    return (
      <Thumb
        placeholder={isPlaceholder}
        url={isPlaceholder ? '' : getTripImage(this.props.item)}
        withTooltip={this.props.withTooltip}
      >
        {type === 'trip' && (
          <>
            <HeartWrapper editMode={editMode} filled={isFavorite}>
              <Heart style={{ height: '24px', width: '21px' }} onClick={this.toggleFavorite} />
            </HeartWrapper>
            {editMode && (
              <>
                <label htmlFor="cover-image">
                  <AddImage>
                    <Camera style={{ height: '1.3em', width: '1.3em', color: 'white' }} />
                  </AddImage>
                </label>
                <input
                  id="cover-image"
                  accept=".jpg, .jpeg, .png"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={this.props.onFileSelect}
                />
              </>
            )}
          </>
        )}
        {this.renderTitle()}
      </Thumb>
    );
  }

  renderTags() {
    if (this.props.isPlaceholder || !this.props.showTags) {
      return;
    }

    if (this.props.editMode && this.state.isEditingTags) {
      return (
        <TagSelector
          onBlur={this.disableEditTagsMode}
          onChange={this.props.onTagsChange}
          selectedTags={this.props.item.tags}
          suggestedTags={this.props.suggestedTags}
        />
      );
    }

    return (
      <span>
        {this.props.item.tags.map(tag => (
          <TagLink
            onClick={() => this.props.updateSearchParams({ tags: I18nText.translate(tag.names) })}
            key={I18nText.translate(tag.names)}
          >
            <Tag>
              <I18nText data={tag.names} />
            </Tag>
          </TagLink>
        ))}
        {this.props.editMode && (
          <span
            style={{ verticalAlign: 'middle', display: 'inline-flex', cursor: 'pointer' }}
            onClick={this.enableEditTagsMode}
          >
            {this.props.item.tags.length === 0 && <P>Select tags</P>}
            <Pencil style={{ alignSelf: 'center', marginLeft: '5px', color: colors.primary }} />
          </span>
        )}
      </span>
    );
  }

  renderPrice() {
    if (this.props.type === 'food') {
      if (
        !this.props.item.otherAttributes ||
        !this.props.item.otherAttributes.yelp ||
        !this.props.item.otherAttributes.yelp.yelpPrice
      ) {
        return null;
      }
      return (
        <>
          <FoodPriceBackground>
            {Array(4)
              .fill(this.props.item.otherAttributes.yelp.yelpPrice[0])
              .join('')}
          </FoodPriceBackground>
          <Price>{this.props.item.otherAttributes.yelp.yelpPrice}</Price>
        </>
      );
    }
    if (this.props.type === 'accommodation') {
      return (
        <Price>
          ${extractPrice(this.props.item.basePrice, this.props.adults, this.props.children)}{' '}
          <PriceText>
            {extractPricePer(this.props.item.basePrice) === PRICE_PER_SESSION
              ? 'per night'
              : 'for all guests'}
          </PriceText>
        </Price>
      );
    }
    if (this.props.type === 'activity') {
      return (
        <Price>
          ${extractPrice(this.props.item.basePrice, this.props.adults, this.props.children)}{' '}
          <PriceText>
            {this.props.adults + this.props.children > 1 ||
            extractPricePer(this.props.item.basePrice) === PRICE_PER_SESSION
              ? `for ${this.props.adults + this.props.children} people`
              : 'per person'}
          </PriceText>
        </Price>
      );
    }
    return (
      <Price>
        ${this.props.item.totalPricePerDay} <PriceText>per day</PriceText>
      </Price>
    );
  }

  renderRating() {
    if (this.props.type === 'trip') {
      return (
        <RatingWrapper>
          <Heart />
          <HeartsNumber>{this.props.item.hearts + this.state.sumToHearts}</HeartsNumber>
        </RatingWrapper>
      );
    }

    return (
      <RatingWrapper>
        <Rating
          rating={this.props.item.ratings.average}
          count={this.props.item.ratings.count}
          starsType={this.props.type === 'food' ? 'yelp' : 'logo'}
        />
      </RatingWrapper>
    );
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

    return (
      <>
        <FirstLine>
          {this.renderPrice()}
          {this.renderRating()}
        </FirstLine>
        <SecondLine>
          {this.props.type !== 'food' &&
            this.props.type !== 'accommodation' && (
              <>
                <Duration>{duration(this.props.item.duration)}</Duration>
                <Dot>•</Dot>
              </>
            )}
          <Location>
            <PSmall>
              {this.props.type === 'trip' &&
              this.props.item.topLocations &&
              this.props.item.topLocations.length > 0
                ? this.props.item.topLocations
                    .map(
                      location =>
                        location.city || location.state || location.country || location.countryCode,
                    )
                    .join(', ')
                : formatLocation(this.props.item.originalLocation || this.props.item.location)}
            </PSmall>
          </Location>
        </SecondLine>
        <TagsLine>{this.renderTags()}</TagsLine>
      </>
    );
  }

  getLink = () => {
    const { isPlaceholder, type } = this.props;

    if (isPlaceholder) {
      return '';
    }

    if (type === 'trip') {
      return urls.trip.view({
        slug: generateTripSlug(this.props.item),
        id: this.props.item._id,
      });
    }

    return urls.service.view({
      id: this.props.item._id,
      slug: generateServiceSlug(this.props.item),
      category: this.props.type,
    });
  };

  renderCard() {
    const { isPlaceholder, editMode, item } = this.props;
    const linkUrl = this.getLink();
    return (
      <Wrap isPlaceholder={isPlaceholder}>
        <Cart column className="card-animate">
          {!isPlaceholder &&
            !editMode && <LinkWrapper title={item && translate(item.title)} to={linkUrl} />}
          {this.renderThumb()}
          <ContentWrap>{this.renderContent()}</ContentWrap>
        </Cart>
      </Wrap>
    );
  }

  render() {
    return <div>{this.renderCard()}</div>;
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
      updateSearchParams: searchActions.updateSearchParams,
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
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    owner: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  withTooltip: PropTypes.bool,
  href: PropTypes.string,
  isPlaceholder: PropTypes.bool,
  showTags: PropTypes.bool,
  editMode: PropTypes.bool,
  suggestedTags: PropTypes.array,
  type: PropTypes.oneOf(['trip', 'accommodation', 'activity', 'food']),
  onTitleChange: PropTypes.func,
  onTagsChange: PropTypes.func,
  onFileSelect: PropTypes.func,
};

// Default props
TripCart.defaultProps = {
  withTooltip: false,
  href: '/',
  isPlaceholder: true,
  showTags: true,
  suggestedTags: [],
  type: 'trip',
  onTitleChange: () => {},
  onTagsChange: () => {},
};
