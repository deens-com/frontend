// NPM
import React from 'react';
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
export default function ReviewCart({ review }) {
  const { reviewer } = review;
  const reviewerProfileLink = `/users/${reviewer.username}`;
  let reviewerLocation = '';
  if (reviewer.city && reviewer.country) reviewerLocation = `${reviewer.city}, ${reviewer.country}`;
  else if (reviewer.city || reviewer.country)
    reviewerLocation = `${reviewer.city} ${reviewer.country}`.trim();
  const { profilePicture } = review.reviewer;
  const dpUrl = profilePicture
    ? buildImgUrl(profilePicture, { width: 30, height: 30 })
    : placeholder;
  return (
    <Wrap>
      <ProfileWrap>
        <Link to={reviewerProfileLink}>
          <Avatar>
            <img src={dpUrl} width="30px" height="30px" alt="" />
          </Avatar>
        </Link>
        <Profile>
          <span>
            <Link to={reviewerProfileLink}>{review.reviewer.username}</Link>
          </span>
          <span>{reviewerLocation}</span>
        </Profile>
      </ProfileWrap>
      <SummaryWrap>
        <span>{review.title}</span>
        <Stars rating={review.rating} />
      </SummaryWrap>
      <p>{review.message}</p>
    </Wrap>
  );
}

// Props Validation
ReviewCart.propTypes = {};
