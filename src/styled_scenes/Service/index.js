// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import GoogleMapReact from 'google-map-react';
import { Container, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Row from './../../shared_components/layout/Row';

// COMPONENTS
import BrandFooter from '../../shared_components/BrandFooter';
import { BadgeIcon } from './icons';
import TripCart from '../../shared_components/Carts/Trip';
// import Carousel from '../../shared_components/Carousel';
import ImgSlider from './components/ImgSlider';
import MapMaker from '../../shared_components/MapMarker';
import ListsHandler from 'shared_components/ListsHandler';
import Reviews from 'shared_components/Reviews';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';

// STYLES
import { PageContent } from '../../shared_components/layout/Page';
import ServiceTags from './components/ServiceTags';
import ServiceInformation from './components/ServiceInformation';
import ServiceActionButtons from './components/ServiceActionButtons';
import { googleMapsKey } from 'libs/config';

import { waitUntilMapsLoaded, generateTripSlug } from 'libs/Utils';
import api from 'libs/apiClient';

// i18n
import { Trans } from '@lingui/macro';

const DetailWrapper = styled.div`
  width: 100%;
  padding: 15px 15px 25px 15px;

  ${media.minMedium} {
    padding: 0 0 25px 50px;
  }

  ${media.minLarge} {
    width: 58%;
  }
`;

const HeaderWrap = styled.div`
  margin-bottom: 25px;

  h2 {
    font-size: 25px;
    margin-bottom: 15px;
    font-weight: 500;
  }

  & > a {
    margin-top: 15px;
    display: inline-block;
    color: #65afbb;
  }
`;

const Badge = styled.span`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  padding: 4px 3px;
  background: linear-gradient(50deg, #89c8a3, #65afbb);

  svg {
    fill: #fff;
  }
`;

const ReviewsTitle = styled.h2`
  color: #65afbb;
`;

const ContactWrap = styled.div`
  margin-bottom: 50px;

  ${media.minSmall} {
    display: flex;
    margin-bottom: 25px;
  }
`;

const MapWrap = styled.div`
  background: #eee;
  height: 260px;
  margin-bottom: 25px;

  ${media.minSmall} {
    width: 45%;
    margin-right: 5%;
    margin-bottom: 0;
    border-radius: 5px;
    overflow: hidden;
  }
`;

const Contacts = styled.div`
  dispaly: flex;
  flex-direction: column;

  ${media.minSmall} {
    width: 55%;
  }

  a {
    color: #65afbb;
  }
`;

const TripsWrap = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  padding: 50px 0;

  & > span {
    margin-bottom: 35px;
    font-size: 28px;
  }

  .slick-track {
    margin: 0;
  }
`;

const SelfAlignCenter = styled.span`
  align-self: center;
`;
const DetailsLink = styled.a`
  float: right;
  cursor: pointer;
`;
const CarouselColumnSpan = styled.div`
  grid-column: span 2;
`;

const PreserveWhiteSpace = styled.p`
  white-space: pre-wrap;
`;

function formatDescription(description) {
  var maxLength = 1000;
  //trim the description to the maximum length
  var trimmedString = description.substr(0, maxLength);
  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')),
  );
  return trimmedString;
}

// MODULE
class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      time: null,
      personNb: null,
      moreDetails: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkServiceAvailability = this.checkServiceAvailability.bind(this);
    this.closeServiceUnavailabilityModal = this.closeServiceUnavailabilityModal.bind(this);
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  checkServiceAvailability = serviceId => {
    this.props.checkAvailability(serviceId, this.state.personNb);
  };

  closeServiceUnavailabilityModal = () => {
    this.props.toggleServiceAvailabilitymodal(false);
  };

  render() {
    const latitude = (this.props.service.geo && this.props.service.geo.lat) || 0;
    const longitude = (this.props.service.geo && this.props.service.geo.lng) || 0;
    return (
      <React.Fragment>
        <Container>
          <br />
          <PageContent flex loading={this.props.isPageLoading || this.props.isLoading}>
            <Media
              query={`(min-width: ${sizes.large})`}
              render={() =>
                this.props.service.media ? <ImgSlider images={this.props.service.media} /> : null
              }
            />
            <DetailWrapper>
              <HeaderWrap>
                <h2>{this.props.service.title}</h2>
                <PreserveWhiteSpace>{this.props.service.subtitle}</PreserveWhiteSpace>
                <ServiceTags service={this.props.service} />
                {!this.props.service.description ||
                this.props.service.description.length < 1000 ||
                this.state.moreDetails ? (
                  <PreserveWhiteSpace>{this.props.service.description}</PreserveWhiteSpace>
                ) : (
                  <PreserveWhiteSpace>
                    {formatDescription(this.props.service.description)}
                    <DetailsLink
                      onClick={() => this.setState(({ moreDetails }) => ({ moreDetails: true }))}
                    >
                      <Trans>More</Trans>
                      ...
                    </DetailsLink>
                  </PreserveWhiteSpace>
                )}
                {((this.props.service.startInstructions &&
                  this.props.service.startInstructions !== 'none') ||
                  (this.props.service.endInstructions &&
                    this.props.service.endInstructions !== 'none')) && (
                  <h4>
                    <Trans>Instructions</Trans> :{' '}
                  </h4>
                )}
                <ul>
                  {this.props.service.startInstructions &&
                    this.props.service.startInstructions !== 'none' && (
                      <li>
                        <Trans>On arrival</Trans> : {this.props.service.startInstructions}
                      </li>
                    )}
                  {this.props.service.endInstructions &&
                    this.props.service.endInstructions !== 'none' && (
                      <li>
                        <Trans>On departure</Trans> : {this.props.service.endInstructions}
                      </li>
                    )}
                </ul>
                <br />
                {this.props.service.rules &&
                  this.props.service.rules.length > 0 && (
                    <section>
                      <h4>
                        <Trans>Rules</Trans> :{' '}
                      </h4>
                      <ul>
                        {this.props.service.rules &&
                          this.props.service.rules.map(rule => <li>{rule}</li>)}
                      </ul>
                    </section>
                  )}
              </HeaderWrap>
              <Media
                query={`(max-width: ${sizes.large})`}
                render={() =>
                  this.props.service.media ? <ImgSlider images={this.props.service.media} /> : null
                }
              />
              <ServiceActionButtons
                myUnpurchasedTrips={this.props.myUnpurchasedTrips}
                onAddServiceToTrip={this.props.onAddServiceToTrip}
                onAddServiceToNewTrip={this.props.onAddServiceToNewTrip}
                serviceRecentlyAddedToTrip={this.props.serviceRecentlyAddedToTrip}
                service={this.props.service}
                serviceAlreadyAddedToTrip={this.props.serviceAlreadyAddedToTrip}
                onBookNowClick={this.props.onBookNowClick}
                externalCheckoutUrl={
                  this.props.service &&
                  this.props.service.checkoutOptions &&
                  this.props.service.checkoutOptions.checkoutURL
                }
                externalUrl={this.props.service && this.props.service.externalUrl}
                isLoggedIn={this.props.isLoggedIn}
              />
              <ContactWrap>
                {/*<MapWrap>
                  <GoogleMapReact
                    center={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    defaultZoom={11}
                    bootstrapURLKeys={{ key: googleMapsKey }}
                    googleMapLoader={waitUntilMapsLoaded}
                  >
                    <MapMaker lat={latitude} lng={longitude} scale={1} color="#65AFBB" />
                  </GoogleMapReact>
                  </MapWrap>*/}
                <Contacts>
                  <ServiceInformation
                    numberOfDays={this.props.numberOfDays}
                    service={this.props.service}
                  />
                </Contacts>
              </ContactWrap>
            </DetailWrapper>
          </PageContent>
        </Container>
        <Container>
          <ReviewsTitle>
            <Trans>Reviews</Trans>
          </ReviewsTitle>
          {this.props.service &&
            this.props.service._id && (
              <ListsHandler
                itemKey="reviews"
                apiFunction={api.services.reviews.get}
                urlParams={{
                  serviceId: this.props.service._id,
                }}
                showLoader={false}
                render={({ items, fetchMore, totalCount, isLoading }) => (
                  <Reviews
                    reviews={items}
                    fetchMore={fetchMore}
                    totalCount={totalCount}
                    isLoading={isLoading}
                  />
                )}
              />
            )}
        </Container>
        <div className="bg-grey1">
          <Container>
            {this.props.trips.length ? (
              <TripsWrap className="service-trips">
                <Badge>
                  <BadgeIcon />
                </Badge>
                <SelfAlignCenter>
                  <Trans>Featured in these trips</Trans>
                </SelfAlignCenter>
                <CarouselColumnSpan>
                  <Row>
                    <Grid columns={4} doubling stackable>
                      {this.props.trips.map(trip => (
                        <Grid.Column key={trip._id}>
                          <TripCart
                            showTags={false}
                            isPlaceholder={false}
                            key={trip._id}
                            withTooltip
                            withShadow
                            item={trip}
                          />
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Row>
                </CarouselColumnSpan>
              </TripsWrap>
            ) : null}
          </Container>
        </div>
        <BrandFooter withTopBorder withPadding posRelative />
      </React.Fragment>
    );
  }
}

// Props Validation
Service.propTypes = {
  myUnpurchasedTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  onAddServiceToNewTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.object,
  serviceAlreadyAddedToTrip: PropTypes.object,
  onBookNowClick: PropTypes.func.isRequired,
};

export default Service;
