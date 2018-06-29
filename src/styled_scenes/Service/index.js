// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

// COMPONENTS
import TopBar from './../../shared_components/TopBarWithSearch';
import BrandFooter from '../../shared_components/BrandFooter';
import { BadgeIcon } from './icons';
import TripCart from '../../shared_components/Carts/Location';
import Review from '../../shared_components/Review';
import Carousel from '../../shared_components/Carousel';
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

const DetailWrapper = styled.div`
  width: 100%;
  padding: 15px 15px 25px 15px;

  ${media.minMedium} {
    padding: 15px 25px 25px 50px;
  }

  ${media.minLarge} {
    width: 58%;
  }
`;

const HeaderWrap = styled.div`
  margin-bottom: 25px;

  h2 {
    font-size: 48px;
    margin-bottom: 15px;

    ${media.minSmall} {
      font-size: 58px;
    }
  }

  & > a {
    margin-top: 15px;
    display: inline-block;
    color: #4fb798;
  }
`;

const DataBlock = styled.div`
  display: inline-block;
  margin-right: 25px;

  &:last-child {
    margin-right: 0;
  }
`;

const TextLabel = styled.span`
  padding-top: 5px;
  display: block;
  color: #6e7885;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 10px;
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

const DataWrap = styled.div`
  margin-bottom: 50px;

  ${media.minSmall} {
    margin-bottom: 25px;
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
  }
`;

const Contacts = styled.div`
  dispaly: flex;
  flex-direction: column;

  ${media.minSmall} {
    width: 50%;
  }

  a {
    color: #4fb798;
  }
`;

const TripsWrap = styled.div`
  margin-bottom: 50px;

  & > h3 {
    margin-bottom: 35px;
    font-size: 28px;
  }

  .slick-track {
    margin: 0;
  }
`;

const PreserveWhiteSpace = styled.p`
  white-space: pre-wrap;
`;

// MODULE
class FoodDetailScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      time: null,
      personNb: null,
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
    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent flex>
          <Media
            query={`(min-width: ${sizes.large})`}
            render={() => <ImgSlider images={this.props.service.pictures} />}
          />
          <DetailWrapper>
            <HeaderWrap>
              <h2>{this.props.service.title}</h2>
              <ServiceTags service={this.props.service} />
              <PreserveWhiteSpace>{this.props.service.description}</PreserveWhiteSpace>
            </HeaderWrap>
            <DataWrap>
              {this.props.trips.length ? (
                <span>
                  <DataBlock>
                    <Badge>
                      <BadgeIcon />
                    </Badge>
                  </DataBlock>
                  <DataBlock>
                    <TextLabel>PART OF THE TRIP</TextLabel>
                    <span>
                      <Link to={'/trips/' + (this.props.trips[0] && this.props.trips[0].objectId)}>
                        "{this.props.trips.length &&
                          this.props.trips[0] &&
                          this.props.trips[0].description.slice(0, 40)}" and {this.props.trips.length} more ...
                      </Link>
                    </span>
                  </DataBlock>
                </span>
              ) : null}
            </DataWrap>
            <Media
              query={`(max-width: ${sizes.large})`}
              render={() => <ImgSlider images={this.props.service.pictures} />}
            />
            <ServiceActionButtons
              myUnpurchasedTrips={this.props.myUnpurchasedTrips}
              onAddServiceToTrip={this.props.onAddServiceToTrip}
              onAddServiceToNewTrip={this.props.onAddServiceToNewTrip}
              serviceRecentlyAddedToTrip={this.props.serviceRecentlyAddedToTrip}
              serviceAlreadyAddedToTrip={this.props.serviceAlreadyAddedToTrip}
              onBookNowClick={this.props.onBookNowClick}
            />
            <ContactWrap>
              <MapWrap>
                <GoogleMapReact
                  center={{ lat: this.props.service.latitude || 0, lng: this.props.service.longitude || 0 }}
                  defaultZoom={11}
                  bootstrapURLKeys={{
                    key: 'AIzaSyDICUW2RF412bnmELi3Y_zCCzHa-w8WnXc',
                  }}
                >
                  <MapMaker
                    lat={this.props.service.latitude || 0}
                    lng={this.props.service.longitude || 0}
                    scale={1}
                    color="#4fb798"
                  />
                </GoogleMapReact>
              </MapWrap>
              <Contacts>
                <ServiceInformation service={this.props.service} />
              </Contacts>
            </ContactWrap>
            {this.props.trips.length ? (
              <TripsWrap>
                <h3>Part of trips</h3>
                <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
                  {this.props.trips.map(trip => (
                    <TripCart item={trip} withShadow key={trip.title} size="small" href={'/trips/' + trip.objectId} />
                  ))}
                </Carousel>
              </TripsWrap>
            ) : null}
            <div>
              {this.props.reviews.length ? <h2>Reviews</h2> : null}
              {this.props.reviews.map(review => <Review key={review.objectId} review={review} />)}
            </div>
            <SmartContractDetails address={this.props.service.contractAddress} abi={this.props.abi} />
          </DetailWrapper>
        </PageContent>
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
