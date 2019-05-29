// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// COMPONENTS
import Stars from '../Rating/Stars';
import placeholder from './../../assets/placeholder350x350.svg';
import { buildImgUrl } from 'libs/Utils';

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  margin-bottom: 25px;
  padding-left: 10px;
  padding-right: 10px;
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  display: inline-block;
  width: 45px;
  height: 45px;
  border-radius: 45px;
  overflow: hidden;
  border: 2px solid #d7dbdf;
  margin-right: 15px;

  img {
    width: 45px;
    height: 45px;
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
export default function ReviewCart({ title, rating, message, city, country, name, image, link }) {
  const avatarUrl = image ? buildImgUrl(image, { width: 45, height: 45 }) : placeholder;
  return (
    <Wrap>
      <ProfileWrap>
        <Link to={link}>
          <Avatar>
            <img className="lazyload" data-src={avatarUrl} alt="" />
          </Avatar>
        </Link>
        <Profile>
          <span>
            <Link to={link}>{name}</Link>
          </span>
          <span>
            {city}
            {country && `, ${country}`}
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
  city: PropTypes.string, // place of the user, or service
  country: PropTypes.string,
  name: PropTypes.string.isRequired, // username or service name
  image: PropTypes.string, // service or user image
  link: PropTypes.string.isRequired,
};

ReviewCart.defaultProps = {
  city: '',
  country: '',
};
