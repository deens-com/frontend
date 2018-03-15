// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import Link from 'gatsby-link';

// COMPONENTS
import TopBar from '../../../../components/TopBar';
import BrandFooter from '../../../../components/BrandFooter';
import Tag from '../../../../components/Tag';
import Rating from '../../../../components/Rating';
import mamamia from '../../../../../static/img/food/mamamia.jpg';
import { BadgeIcon } from './icons';
import Row from '../../../../components/layout/Row';
import Col from '../../../../components/layout/Col';
import TripCart from '../../../../components/Carts/Trip';
import Review from '../../../../components/Review';
import Button from '../../../../components/Button';
import DetailPickers from './components/DetailPickers';

// ACTIONS/CONFIG
import { media, sizes } from '../../../../libs/styled';
import { restaurant } from '../../../../data/food';

// STYLES
import { Page, PageContent } from '../../../../components/layout/Page';

const DetailWrapper = styled.div`
  width: 100%;
  padding: 50px 25px 25px 50px;

  ${media.minLarge} {
    width: 58%;
  }
`;

const CarouselWrapper = styled.div`
  height: 100vh;
  max-height: 800px;
  width: 42%;
  background: #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
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
    font-size: 58px;
    margin-bottom: 15px;
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
  margin-bottom: 25px;
`;

const ContactWrap = styled.div`
  display: flex;
  margin-bottom: 25px;
`;

const Map = styled.div`
  width: 45%;
  margin-right: 5%;
  background: #eee;
  height: 260px;
`;

const Contacts = styled.div`
  width: 50%;
  dispaly: flex;
  flex-direction: column;
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

const Hr = styled.hr`
  height: 0;
  border: none;
  border-bottom: 1px solid #eef1f4;
  margin: 25px 0;
`;

const TripsWrap = styled.div`
  margin-bottom: 50px;

  & > h3 {
    margin-bottom: 35px;
    font-size: 28px;
  }
`;

const ActionWrap = styled.div`
  display: flex;
  margin-bottom: 35px;

  & > div {
    flex: 1;

    &:first-child {
      flex: 2;
    }
  }
`;

// MODULE
export default function FoodDetailScene({}) {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => (
            <CarouselWrapper>
              <img src={mamamia} />
            </CarouselWrapper>
          )}
        />
        <DetailWrapper>
          <TagWrap>{restaurant.tags.map(tag => <Tag key={tag.label} item={tag} />)}</TagWrap>
          <HeaderWrap>
            <h2>{restaurant.title}</h2>
            <p>{restaurant.description}</p>
            <span>More</span>
          </HeaderWrap>
          <DataWrap>
            <DataBlock>
              <TextLabel>Location</TextLabel>
              <span>{restaurant.location}</span>
            </DataBlock>
            <DataBlock>
              <TextLabel>Rating</TextLabel>
              <Rating
                marginBottom="25px"
                rating={restaurant.rating}
                count={restaurant.reviews.count}
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
            <div>
              <Button text="Book now" />
              <Button text="Add to trip" />
            </div>
          </ActionWrap>
          <ContactWrap>
            <Map />
            <Contacts>
              <ContactBlock>
                <div>
                  <TextLabel>Working hours</TextLabel>
                  <span>Opened now</span>
                </div>
                <Link to="#">Schedule</Link>
              </ContactBlock>
              <Hr />
              <ContactBlock>
                <div>
                  <TextLabel>Phone</TextLabel>
                  <span>{restaurant.phone}</span>
                </div>
                <Link to="#">Call</Link>
              </ContactBlock>
              <Hr />
              <ContactBlock>
                <div>
                  <TextLabel>Homepage</TextLabel>
                  <span>{restaurant.website}</span>
                </div>
                <Link to="#">Browse</Link>
              </ContactBlock>
              <Hr />
            </Contacts>
          </ContactWrap>
          <TripsWrap>
            <h3>Part of trips</h3>
            <Row>
              {restaurant.partOf.map(trip => (
                <Col key={trip.title} xsBasis="300px">
                  <TripCart item={trip} href="#" />
                </Col>
              ))}
            </Row>
          </TripsWrap>
          <div>
            {restaurant.reviews.items.map(review => (
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
