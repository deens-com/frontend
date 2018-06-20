// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

// COMPONENTS
import TopBar from './../../shared_components/TopBarWithSearch';
import * as SmartContractStatus from 'shared_components/SmartContract/Status';
import BrandFooter from '../../shared_components/BrandFooter';
import Tag from './components/Tag';
import Rating from '../../shared_components/Rating';
import { BadgeIcon } from './icons';
import TripCart from '../../shared_components/Carts/Location';
import Review from '../../shared_components/Review';
import Carousel from '../../shared_components/Carousel';
//import Button from '../../shared_components/Button';
import ImgSlider from './components/ImgSlider';
import MapMaker from '../../shared_components/MapMarker';
import UserAvatar from '../../shared_components/UserAvatar';
import AddToTripButton from './components/AddToTripButton';
import FormControl from './../../shared_components/Form/FormControl';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import { Icon, Modal } from 'semantic-ui-react';
import SmartContractDetails from './components/SmartContractDetails';

const DetailWrapper = styled.div`
  width: 100%;
  padding: 25px 15px;

  ${media.minMedium} {
    padding: 50px 25px 25px 50px;
  }

  ${media.minLarge} {
    width: 58%;
  }
`;

const TagWrap = styled.div`
  & > div {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
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

  a {
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

const ContactBlock = styled.div`
  display: flex;
  align-items: center;

  & > div {
    flex: 1;
  }

  & > div:first-child {
    flex-basis: 75%;
  }
`;

const WorkingHoursBlock = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const HostBlock = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:last-child {
    margin-right: -36px;
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  margin-right: 25px;

  & div:first-child {
    order: 1;
  }

  ${media.minLarge} {
    flex-direction: column;

    & div:first-child {
      order: 0;
      margin-bottom: 10px;
    }
  }
`;

const Hr = styled.hr`
  height: 0;
  border: none;
  border-bottom: 1px solid #eef1f4;
  margin: 15px 0;

  ${media.minSmall} {
    margin: 25px 0;
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

const ActionWrap = styled.div`
  margin-bottom: 50px;

  ${media.minMedium} {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
  }

  ${media.minLarge} {
    flex-direction: column;
    align-items: left;
    justify-content: center;
  }

  ${media.minLargePlus} {
    flex-direction: row;
    align-items: center;
    justify-content: left;
  }
`;

const RightAlignedText = styled.span`
  display: block;
  text-align: right;
`;

const SuccessMessage = styled(Link)`
  color: #5fb79e;
  align-self: flex-end;
  margin-top: 25px;

  :hover {
    color: #4ac4a1;
  }
`;

const Wrap = styled.div`
  background: white;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  padding: 10px;
  margin-bottom: 50px;

  ${media.minSmall} {
    display: flex;
  }

  ${media.minMedium} {
    margin-bottom: 0;
    margin-right: 25px;
  }

  ${media.minLarge} {
    margin-bottom: 25px;
  }

  ${media.minLargePlus} {
    margin-bottom: 0;
  }

  & > div {
    border: none;
    flex: 1;
    min-width: 143px;
    display: flex;
    align-items: center;

    & > div {
      width: 100%;
    }

    ${media.minMedium} {
      &:after {
        content: '';
        width: 1px;
        height: 60%;
        background: #eef1f4;
        position: absolute;
        right: 10px;
        top: 20%;
      }

      &:last-child {
        &:after {
          display: none;
        }
      }
    }
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
    const showContractStatus = this.props.service.contractAddress != null;

    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent flex>
          <Media
            query={`(min-width: ${sizes.large})`}
            render={() => <ImgSlider images={this.props.service.pictures} />}
          />
          <DetailWrapper>
            {showContractStatus && (
              <SmartContractStatus.Wrapper
                size="big"
                status={this.props.service.contractStatus}
                hash={this.props.service.hash}
              />
            )}
            <br />
            <TagWrap>
              {this.props.service &&
                this.props.service.tags &&
                this.props.service.tags.map(tag => (
                  <Link to={'/results?tags=' + tag.label}>
                    <Tag key={tag.label} item={tag} />
                  </Link>
                ))}
            </TagWrap>
            <HeaderWrap>
              <h2>{this.props.service.title}</h2>
              <PreserveWhiteSpace>{this.props.service.description}</PreserveWhiteSpace>
              <SmartContractDetails address="0xe79d2818b0039052a77b0065948f0d94496bc775" abi="asdf" />
            </HeaderWrap>
            <DataWrap>
              <DataBlock>
                <TextLabel>Location</TextLabel>
                <span>{this.props.service.location}</span>
              </DataBlock>
              <DataBlock>
                <TextLabel>Rating</TextLabel>
                <Rating marginBottom="25px" rating={this.props.service.rating} count={this.props.service.reviewCount} />
              </DataBlock>

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
            <ActionWrap>
              {/*<DetailPickers />*/}
              <Wrap>
                <FormControl
                  onChange={value => {
                    console.log(value);
                  }}
                  value={this.state.date}
                  type="date"
                  placeholder="Pick the date"
                  leftIcon="date"
                />
                {/*<FormControl
                  onChange={value => {
                    console.log(value);
                  }}
                  value={this.state.time}
                  type="time"
                  placeholder="Pick the time"
                  leftIcon="date"
                />*/}
                {/*<FormControl
                  onChange={this.handleInputChange}
                  value={this.state.person}
                  type="person"
                  name="person"
                  placeholder="Person"
                  leftIcon="person"
                />*/}

                <select
                  style={{ backgroundColor: 'white', borderColor: '#eef1f4' }}
                  name="personNb"
                  value={this.state.personNb}
                  onChange={this.handleInputChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>

                <Modal
                  closeIcon
                  open={this.props.isServiceUnavailableModalOpen}
                  onClose={this.closeServiceUnavailabilityModal}
                >
                  <Modal.Header>We're Sorry</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      {/*<Header>Default Profile Image</Header>*/}
                      <p>Service Is unavailable for selected slots</p>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
              </Wrap>

              <ButtonsWrap>
                {/*<Button
                  type="button"
                  round
                  size="small"
                  onClick={ev => {
                    this.checkServiceAvailability(this.props.service.objectId);
                  }}
                  iconAfter="arrow"
                  text="Book now"
                  theme="textGreen"
                />*/}
                <AddToTripButton
                  trips={this.props.myTrips}
                  onTripClick={this.props.onAddServiceToTrip}
                  onNewTripClick={this.props.onAddServiceToNewTrip}
                />
              </ButtonsWrap>
              {this.props.serviceRecentlyAddedToTrip && (
                <SuccessMessage to={`/trips/${this.props.serviceRecentlyAddedToTrip.objectId}`}>
                  Added to <b>{this.props.serviceRecentlyAddedToTrip.title}</b>
                  <Icon name="check circle outline" />
                </SuccessMessage>
              )}
            </ActionWrap>
            <Media
              query={`(max-width: ${sizes.large})`}
              render={() => <ImgSlider images={this.props.service.pictures} />}
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
                <HostBlock>
                  <div>
                    <TextLabel>Host</TextLabel>
                  </div>
                  <div>
                    <UserAvatar user={this.props.service.owner} />
                  </div>
                </HostBlock>
                <Hr />
                {this.props.service.openingTime &&
                  this.props.service.closingTime && (
                    <div>
                      <ContactBlock>
                        <TextLabel>Working hours</TextLabel>
                        <WorkingHoursBlock>
                          {this.props.service.openingTime} H - {this.props.service.closingTime} H
                        </WorkingHoursBlock>
                      </ContactBlock>
                      <Hr />
                    </div>
                  )}
                {this.props.service.phoneNumber && (
                  <div>
                    <ContactBlock>
                      <div>
                        <TextLabel>Phone</TextLabel>
                        <RightAlignedText>{this.props.service.phoneNumber}</RightAlignedText>
                      </div>
                    </ContactBlock>
                    <Hr />
                  </div>
                )}

                {this.props.service.websiteUrl && (
                  <div>
                    <ContactBlock>
                      <div>
                        <TextLabel>Homepage</TextLabel>
                        <a href={this.props.service.websiteUrl}>
                          <RightAlignedText>{this.props.service.websiteUrl}</RightAlignedText>
                        </a>
                      </div>
                    </ContactBlock>
                    <Hr />
                  </div>
                )}
              </Contacts>
            </ContactWrap>
            {this.props.trips.length ? (
              <TripsWrap>
                <h3>Part of trips</h3>
                <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
                  {this.props.trips
                    .filter(trip => trip !== undefined)
                    .map(trip => (
                      <TripCart item={trip} withShadow key={trip.title} size="small" href={'/trips/' + trip.objectId} />
                    ))}
                </Carousel>
              </TripsWrap>
            ) : null}
            <div>
              {this.props.reviews.length ? <h2>Reviews</h2> : null}
              {this.props.reviews.map(review => <Review key={review.objectId} review={review} />)}
            </div>
          </DetailWrapper>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}

// Props Validation
FoodDetailScene.propTypes = {
  myTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.string,
};

export default FoodDetailScene;
