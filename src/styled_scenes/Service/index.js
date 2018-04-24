// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";

// COMPONENTS
import TopBar from "../../shared_components/TopBar";
import BrandFooter from "../../shared_components/BrandFooter";
import Tag from "./components/Tag";
import Rating from "../../shared_components/Rating";
import { BadgeIcon } from "./icons";
import Row from "../../shared_components/layout/Row";
import Col from "../../shared_components/layout/Col";
import TripCart from "../../shared_components/Carts/Trip";
import Review from "../../shared_components/Review";
import DetailPickers from "./components/DetailPickers";
import Carousel from "../../shared_components/Carousel";
import Button from "../../shared_components/Button";
import ImgSlider from "./components/ImgSlider";
import MapMaker from "../../shared_components/MapMarker";

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";
import { restaurant } from "../../data/food";

// STYLES
import { Page, PageContent } from "../../shared_components/layout/Page";

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

const ButtonsWrap = styled.div`
  display: flex;

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

// MODULE
export default function FoodDetailScene(props) {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent flex>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => <ImgSlider images={props.service.images} />}
        />
        <DetailWrapper>
          <TagWrap>
            {props.service && props.service.tags && props.service.tags.map(tag => <Tag key={tag.label} item={tag} />)}
          </TagWrap>
          <HeaderWrap>
            <h2>{props.service.title}</h2>
            <p>{props.service.description}</p>
            <Link to="#">More</Link>
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
                count={props.service.reviews && props.service.reviews.count}
              />
            </DataBlock>
            <DataBlock>
              <Badge>
                <BadgeIcon />
              </Badge>
            </DataBlock>
            <DataBlock>
              <TextLabel>PART OF THE TRIP</TextLabel>
              <span>"Explore New York" and 50 more ...</span>
            </DataBlock>
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
              <Button
                type="button"
                round
                size="small"
                iconAfter="arrowDown"
                onClick={ev => {
                  alert("Adding to trip");
                }}
                theme="mainFilled"
                text="Add to trip"
              />
            </ButtonsWrap>
          </ActionWrap>
          <Media
            query={`(max-width: ${sizes.large})`}
            render={() => <ImgSlider images={props.service.images} />}
          />
          <ContactWrap>
            <MapWrap>
              <GoogleMapReact
                defaultCenter={{ lat: 59.95, lng: 30.33 }}
                defaultZoom={11}
              >
                <MapMaker lat={59.95} lng={30.33} scale={1} color="#4fb798" />
              </GoogleMapReact>
            </MapWrap>
            <Contacts>
              <ContactBlock>
                <div>
                  <TextLabel>Working hours</TextLabel>
                  <span>{props.service.openingHours}</span>
                </div>
                <Link to="#">Schedule</Link>
              </ContactBlock>
              <Hr />
              <ContactBlock>
                <div>
                  <TextLabel>Phone</TextLabel>
                  <span>{props.service.phoneNumber}</span>
                </div>
                <Link to="#">Call</Link>
              </ContactBlock>
              <Hr />
              <ContactBlock>
                <div>
                  <TextLabel>Homepage</TextLabel>
                  <span>{props.service.websiteUrl}</span>
                </div>
                <Link to="#">Browse</Link>
              </ContactBlock>
              <Hr />
            </Contacts>
          </ContactWrap>
          <TripsWrap>
            <h3>Part of trips</h3>
            <Carousel
              show="3"
              length={props.trips.length}
              shadowInside
              withLoader
            >
              {props.trips.map(trip => (
                <TripCart
                  item={trip}
                  withShadow
                  key={trip.title}
                  smBasis="50%"
                  mdBasis="33.33%"
                />
              ))}
            </Carousel>
          </TripsWrap>
          <div>
            {props.service.reviews && props.service.reviews.length && props.service.reviews.items.map(review => (
              <Review key={review.summary} review={review} />
            ))}
          </div>
        </DetailWrapper>
      </PageContent>
      <BrandFooter withTopBorder withPadding />
    </Page>
  );
}

// Props Validation
FoodDetailScene.propTypes = {};
