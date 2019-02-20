import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Rating from 'shared_components/Rating';
import Button from 'shared_components/Button';
import I18nText from 'shared_components/I18nText';
import { generateServiceSlug } from 'libs/Utils';

import AnonymousAvatar from 'assets/no-avatar.png';

const Wrapper = styled.div`
  max-width: 600px;
  margin-bottom: 25px;
`;

const Review = styled.div`
  margin-bottom: 15px;
  border: 1px solid #e5e5e5;
  padding: 10px;
  border-radius: 5px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

const Body = styled.div`
  font-size: 14px;
`;

const UserAndReview = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 5px;
  a {
    color: #4fb798;
    &:hover {
      color: #38d39f;
    }
  }
`;

const Service = styled.span`
  a {
    color: #4fb798;
    &:hover {
      color: #38d39f;
    }
  }
`;

const RatingWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  > span {
    margin-right: 4px;
  }
`;

const User = styled.div`
  justify-self: flex-end;
  align-items: center;
  display: flex;
  img {
    width: 25px;
    height: 25px;
  }
`;

const Username = styled.div`
  margin-right: 10px;
`;

const Empty = styled.div`
  font-size: 18px;
  text-align: center;
`;

class ServiceReviews extends React.Component {
  static propTypes = {
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string,
        }).isRequired,
      }),
    ).isRequired,
    fetchMore: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    showServiceInsteadOfUser: PropTypes.bool,
    emptyText: PropTypes.string,
    userKey: PropTypes.string,
  };

  static defaultProps = {
    emptyText: 'This service does not have any review yet.',
    userKey: 'user',
  };

  fetchMore = () => {
    return this.props.fetchMore();
  };

  renderUser(review) {
    const user = (
      <User>
        <Username>{review[this.props.userKey].name}</Username>
        <Image
          src={
            review[this.props.userKey].image ||
            review[this.props.userKey].profilePicture ||
            AnonymousAvatar
          }
          circular
        />
      </User>
    );

    return review[this.props.userKey].type === 'internal' ? (
      <Link to={`/users/${review[this.props.userKey].name}`}>{user}</Link>
    ) : (
      user
    );
  }

  renderService(review) {
    return (
      <Service>
        <Link to={`/services/${generateServiceSlug(review.service)}`}>
          At <I18nText data={review.service.title} />
        </Link>
      </Service>
    );
  }

  renderFooter = () => {
    if (this.props.isLoading) {
      return <Loader active inline="centered" />;
    }

    if (this.props.reviews.length < this.props.totalCount) {
      return (
        <ButtonWrapper>
          <Button onClick={this.fetchMore}>View more</Button>
        </ButtonWrapper>
      );
    }

    return null;
  };

  render() {
    if (this.props.isLoading && this.props.reviews.length === 0) {
      return <Loader active inline="centered" />;
    }

    if (!this.props.isLoading && this.props.totalCount === 0) {
      return <Empty>{this.props.emptyText}</Empty>;
    }
    return (
      <>
        {this.props.reviews.map(review => (
          <Review key={review._id}>
            <Body>{review.body}</Body>
            <UserAndReview>
              <RatingWrapper>
                <span>Rating:</span>
                <Rating rating={review.rating} marginBottom="2px" />
              </RatingWrapper>
              {this.props.showServiceInsteadOfUser
                ? this.renderService(review)
                : this.renderUser(review)}
            </UserAndReview>
          </Review>
        ))}
        {this.renderFooter()}
      </>
    );
  }
}

export default props => (
  <Wrapper>
    <ServiceReviews {...props} />
  </Wrapper>
);
