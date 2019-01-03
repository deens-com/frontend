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
import TopBar from './../../shared_components/TopBar';
import BrandFooter from '../../shared_components/BrandFooter';
import { BadgeIcon } from './icons';
import TripCart from '../../shared_components/Cards/Trip';
import Review from '../../shared_components/Review';
// import Carousel from '../../shared_components/Carousel';
import ImgSlider from './components/ImgSlider';
import MapMaker from '../../shared_components/MapMarker';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import SmartContractDetails from './components/SmartContractDetails';
import ServiceTags from './components/ServiceTags';
import ServiceInformation from './components/ServiceInformation';
import ServiceActionButtons from './components/ServiceActionButtons';

import { waitUntilMapsLoaded, generateTripSlug } from 'libs/Utils';

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
    color: #4fb798;
  }
`;

const Badge = styled.span`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  padding: 4px 3px;
  background: linear-gradient(50deg, #89c8a3, #4fb798);

  svg {
    fill: #fff;
  }
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
    color: #4fb798;
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
class FoodDetailScene extends Component {
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
      <Page topPush>
        <TopBar fixed />

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
                      More...
                    </DetailsLink>
                  </PreserveWhiteSpace>
                )}
                {((this.props.service.startInstructions &&
                  this.props.service.startInstructions !== 'none') ||
                  (this.props.service.endInstructions &&
                    this.props.service.endInstructions !== 'none')) && <h4>Instructions : </h4>}
                <ul>
                  {this.props.service.startInstructions &&
                    this.props.service.startInstructions !== 'none' && (
                      <li>On arrival : {this.props.service.startInstructions}</li>
                    )}
                  {this.props.service.endInstructions &&
                    this.props.service.endInstructions !== 'none' && (
                      <li>On departure : {this.props.service.endInstructions}</li>
                    )}
                </ul>
                <br />
                {this.props.service.rules &&
                  this.props.service.rules.length > 0 && (
                    <section>
                      <h4>Rules : </h4>
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
                serviceAlreadyAddedToTrip={this.props.serviceAlreadyAddedToTrip}
                onBookNowClick={this.props.onBookNowClick}
                externalCheckoutUrl={
                  this.props.service &&
                  this.props.service.checkoutOptions &&
                  this.props.service.checkoutOptions.checkoutURL
                }
                isLoggedIn={this.props.isLoggedIn}
              />
              <ContactWrap>
                <MapWrap>
                  <GoogleMapReact
                    center={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    defaultZoom={11}
                    bootstrapURLKeys={{ key: 'AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc' }}
                    googleMapLoader={waitUntilMapsLoaded}
                  >
                    <MapMaker lat={latitude} lng={longitude} scale={1} color="#4fb798" />
                  </GoogleMapReact>
                </MapWrap>
                <Contacts>
                  <ServiceInformation service={this.props.service} />
                </Contacts>
              </ContactWrap>
              <div>
                {this.props.reviews.length ? <h2>Reviews</h2> : null}
                {this.props.reviews.map(review => (
                  <Review key={review.objectId} review={review} />
                ))}
              </div>
              <SmartContractDetails
                address={this.props.service.contractAddress}
                abi={this.props.abi}
              />
            </DetailWrapper>
          </PageContent>
        </Container>

        <div className="bg-grey1">
          <Container>
            {this.props.trips.length ? (
              <TripsWrap className="service-trips">
                <Badge>
                  <BadgeIcon />
                </Badge>
                <SelfAlignCenter>Part of trips</SelfAlignCenter>
                <CarouselColumnSpan>
                  <Row>
                    <Grid columns={4} doubling stackable>
                      {this.props.trips.map(trip => (
                        <Grid.Column key={trip.objectId}>
                          <Link to={'/trips/' + generateTripSlug(trip)}>
                            <TripCart key={trip.objectId} withTooltip withShadow item={trip} />
                          </Link>
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Row>

                  {/*
                    <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
                      {/*this.props.trips.map(trip => (
                        <TripCart
                          item={trip}
                          withShadow
                          key={trip.title}
                          size="small"
                          href={'/trips/' + trip.objectId}
                        />
                      ))}
                    </Carousel>
                  */}
                </CarouselColumnSpan>
              </TripsWrap>
            ) : null}
          </Container>
        </div>

        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}

// Props Validation
FoodDetailScene.propTypes = {
  myUnpurchasedTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  onAddServiceToNewTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.object,
  serviceAlreadyAddedToTrip: PropTypes.object,
  onBookNowClick: PropTypes.func.isRequired,
};

export default FoodDetailScene;
