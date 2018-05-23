// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";

// COMPONENTS
import TopBar from "./../../shared_components/TopBarWithSearch";

import BrandFooter from "../../shared_components/BrandFooter";
import Tag from "./components/Tag";
import Rating from "../../shared_components/Rating";
import { BadgeIcon } from "./icons";
import TripCart from "../../shared_components/Carts/Location";
import Review from "../../shared_components/Review";
import DetailPickers from "./components/DetailPickers";
import Carousel from "../../shared_components/Carousel";
import Button from "../../shared_components/Button";
import ImgSlider from "./components/ImgSlider";
import MapMaker from "../../shared_components/MapMarker";
import UserAvatar from '../../shared_components/UserAvatar';
import AddToTripButton from './components/AddToTripButton';

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";

// STYLES
import { Page, PageContent } from "../../shared_components/layout/Page";
import { Icon } from "semantic-ui-react";

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
  color: #5FB79E;
  align-self: flex-end;
  margin-top: 25px;

  :hover {
    color: #4ac4a1;
  }
`;

// MODULE
export default function FoodDetailScene(props) {
  let service_latitude = parseFloat(props.service.latitude) || 1.0;
  let service_longitude = parseFloat(props.service.longitude) || 1.0;
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent flex>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => <ImgSlider images={props.service.pictures} />}
        />
        <DetailWrapper>
          <TagWrap>
            {props.service && props.service.tags && props.service.tags.map(tag => (<Link to={"/results?tags=" + tag.label}><Tag key={tag.label} item={tag} /></Link>))}
          </TagWrap>
          <HeaderWrap>
            <h2>{props.service.title}</h2>
            <p>{props.service.description}</p>
          </HeaderWrap>
          <DataWrap>
            <DataBlock>
              <TextLabel>Location</TextLabel>
              <span>{props.service.location}</span>
            </DataBlock>
            <DataBlock>
              <TextLabel>Rating</TextLabel>
              <Rating
                marginBottom="25px"
                rating={props.service.rating}
                count={props.service.reviewCount}
              />
            </DataBlock>

              {
                props.trips.length ?
                <span>
                  <DataBlock>
                    <Badge>
                      <BadgeIcon />
                    </Badge>
                  </DataBlock>
                  <DataBlock>
                    <TextLabel>PART OF THE TRIP</TextLabel>
                    <span>"{props.trips.length && props.trips[0] && props.trips[0].description.slice(0, 40)}" and {props.trips.length} more ...</span>
                  </DataBlock>
                </span>
                :
                null
              }

          </DataWrap>
          <ActionWrap>
            <DetailPickers />
            <ButtonsWrap>
              <Button
                type="button"
                round
                size="small"
                onClick={ev => {
                  alert("Book now.");
                }}
                iconAfter="arrow"
                text="Book now"
                theme="textGreen"
              />
              <AddToTripButton
                trips={props.myTrips}
                onTripClick={props.onAddServiceToTrip}
                onNewTripClick={props.onAddServiceToNewTrip} />
            </ButtonsWrap>
            {props.serviceRecentlyAddedToTrip && <SuccessMessage to={`/trips/${props.serviceRecentlyAddedToTrip.objectId}`}>
                Added to <b>{props.serviceRecentlyAddedToTrip.title}</b>
                <Icon name="check circle outline" />
              </SuccessMessage>}
          </ActionWrap>
          <Media
            query={`(max-width: ${sizes.large})`}
            render={() => <ImgSlider images={props.service.pictures} />}
          />
          <ContactWrap>
            <MapWrap>
              <GoogleMapReact
                defaultCenter={{ lat: service_latitude, lng: service_longitude }}
                defaultZoom={11}
                bootstrapURLKeys={{
                  key: "AIzaSyDICUW2RF412bnmELi3Y_zCCzHa-w8WnXc"
                }}
              >
                <MapMaker lat={service_latitude} lng={service_longitude} scale={1} color="#4fb798" />
              </GoogleMapReact>
            </MapWrap>
            <Contacts>
              <HostBlock>
                <div>
                  <TextLabel>Host</TextLabel>
                </div>
                <div>
                  <UserAvatar user={props.service.owner} />
                </div>
              </HostBlock>
              <Hr />
              {
                props.service.openingTime && props.service.closingTime
                  &&
                ( <div>
                  <ContactBlock>
                    <TextLabel>Working hours</TextLabel>
                    <RightAlignedText>{props.service.openingTime} H - {props.service.closingTime} H</RightAlignedText>
                  </ContactBlock>
                  <Hr />
                  </div>
                )
              }
              {
                props.service.phoneNumber
                  &&
                ( <div>
                    <ContactBlock>
                      <div>
                        <TextLabel>Phone</TextLabel>
                        <RightAlignedText>{props.service.phoneNumber}</RightAlignedText>
                      </div>
                    </ContactBlock>
                    <Hr />
                  </div>
                )
              }

              {
                props.service.websiteUrl
                  &&
                ( <div>
                    <ContactBlock>
                      <div>
                        <TextLabel>Homepage</TextLabel>
                        <a href={props.service.websiteUrl}><RightAlignedText>{props.service.websiteUrl}</RightAlignedText></a>
                      </div>
                    </ContactBlock>
                    <Hr />
                  </div>
                )
              }

            </Contacts>
          </ContactWrap>
          {
            props.trips.length ?
            <TripsWrap>
              <h3>Part of trips</h3>
              <Carousel
                sm_slides_nb={1}
                md_slides_nb={2}
                lg_slides_nb={4}
                xl_slides_nb={4}
              >
                {props.trips.filter(trip => trip !== undefined).map(trip => (
                  <TripCart
                    item={trip}
                    withShadow
                    key={trip.title}
                    size="small"
                    href={"/trips/" + trip.objectId}
                  />
                ))}
              </Carousel>
            </TripsWrap>
            :
            <TripsWrap>
              <h3>Not part of any trip yet</h3>
              <span>Why not </span>
              <Button
                type="button"
                round
                size="small"
                iconAfter="arrowDown"
                onClick={ev => {
                  alert("Adding to trip");
                }}
                theme="mainFilled"
                text="add it to your trip"
                />
            </TripsWrap>
          }
          <div>
            {props.reviews.length
              ?
              <h2>Reviews</h2>
              :
              null
            }
            {props.reviews.map(review => (
              <Review key={review.objectId} review={review} />
            ))}
          </div>
        </DetailWrapper>
      </PageContent>
      <BrandFooter withTopBorder withPadding />
    </Page>
  );
}

// Props Validation
FoodDetailScene.propTypes = {
  myTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.string,
};
