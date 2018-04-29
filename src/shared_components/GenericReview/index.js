// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import Stars from '../Rating/Stars';

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  margin-bottom: 25px;
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid #d7dbdf;
  margin-right: 15px;

  img {
    width: 30px;
    height: 30px;
  }
`;

const Profile = styled.div`
  display: inline-block;

  span {
    display: block;

    &:last-child {
      padding-top: 5px;
      font-size: 14px;
      color: #6e7885;
    }
  }
`;

const SummaryWrap = styled.div`
  display: flex;
  margin-bottom: 10px;

  span:first-child {
    font-weight: 500;
    margin-right: 15px;
  }
`;

// MODULE
export default function ReviewCart({ title, rating, message, city, country, name, image }) {
  return (
    <Wrap>
      <ProfileWrap>
        <Avatar>
          <img src={image || 'https://dummyimage.com/60x40/000/fff'} />
        </Avatar>
        <Profile>
          <span>{name}</span>
          <span>
            {city}, {country}
          </span>
        </Profile>
      </ProfileWrap>
      <SummaryWrap>
        <span>{title}</span>
        <Stars rating={rating} />
      </SummaryWrap>
      <p>{message}</p>
    </Wrap>
  );
}

// Props Validation
ReviewCart.propTypes = {
  title: PropTypes.string.isRequired, // review title
  rating: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired, // place of the user, or service
  country: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired, // username or service name
  image: PropTypes.string, // service or user image
};
