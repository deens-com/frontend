import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { paramsSerializer } from 'libs/apiClient';
import axios from 'libs/axios';
import { Loader } from 'semantic-ui-react';
import { H2, H5, PSmall } from 'libs/commonStyles';
import { primary, darkText, disabled } from 'libs/colors';
import ImgurAvatar from 'assets/no-avatar.png';
import Rating from 'shared_components/Rating';
import Input from 'shared_components/StyledInput';
import { TripContext } from './';
import Button from 'shared_components/Button';
import analytics from 'libs/analytics';

const textPlaceholder =
  'Describe what you are looking for in your ideal trip, where and when you would like to go, how many people would be traveling with you, etc.';

const Wrapper = styled.div`
  margin: 40px 130px;
`;

const User = styled.div`
  display: flex;
  margin-top: 25px;
  color: ${primary};
  margin-bottom: 45px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px 5px 5px 0;
`;

const UserContent = styled.div`
  margin-left: 12px;
`;

const UserBio = styled(PSmall)`
  margin-top: 11px;
  color: ${darkText};
`;

const Form = styled.form``;

const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
`;

const FormField = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  margin-right: 12px;
  min-width: 50px;
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-top: 11px;
  font-size: 16px;
  padding: 12px 8px;
  min-height: 190px;
  border-radius: 5px 5px 5px 0;
  border: 1px solid #ebebeb;
  &:focus {
    outline: none;
    border-color: #38d39f;
  }
  &::placeholder {
    color: ${disabled};
    font-style: italic;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

const Thanks = styled(H2)`
  color: ${primary};
`;

const url = 'https://hooks.zapier.com/hooks/catch/145807/72cord/';

const HelpMe = ({ tripParent, isLoadingUser, user }) => {
  const { session, tripId } = useContext(TripContext);
  const [asked, setAsked] = useState(false);
  const budget = useRef(null);
  const duration = useRef(null);
  const description = useRef(null);
  const name = useRef(null);
  const email = useRef(null);

  const askForQuote = () => {
    const data = {
      budget: budget.current.value,
      description: description.current.value,
      duration: duration.current.value,
      name: session.username || name.current.value,
      email: session.email || email.current.value,
      parent: tripParent,
      recommendedUser: user && user._id,
      tripId,
    };
    axios.get(url, { params: data, paramsSerializer });
    analytics.planning.brief.complete();
    setAsked(true);
  };

  if (asked) {
    return (
      <Wrapper>
        <Thanks>
          Thank you for asking for help. An expert will contact you soon to help you plan your trip!
        </Thanks>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <H2>Need help planning your trip?</H2>
      {isLoadingUser && <Loader active inline="centered" />}
      {user && (
        <User>
          <Avatar src={user.profilePicture || ImgurAvatar} />
          <UserContent>
            <H5>{user.username}</H5>
            {user.rating.count > 0 && (
              <Rating rating={user.rating.average} count={user.rating.count} />
            )}
            <Rating rating={user.rating.average} count={user.rating.count} />
            <UserBio>{user.biography}</UserBio>
          </UserContent>
        </User>
      )}
      <Form>
        <FormLine>
          <FormField>
            <Label>Budget (USD)</Label>
            <Input innerRef={budget} maxWidth="90px" />
          </FormField>
          <FormField>
            <Label>Trip duration (Days)</Label>
            <Input innerRef={duration} maxWidth="90px" />
          </FormField>
        </FormLine>
        <FormLine>
          <TextArea ref={description} placeholder={textPlaceholder} />
        </FormLine>
        {!session.username && (
          <>
            <FormLine>
              <FormField>
                <Label>Name</Label>
                <Input innerRef={name} />
              </FormField>
            </FormLine>
            <FormLine>
              <FormField>
                <Label>Email</Label>
                <Input innerRef={email} />
              </FormField>
            </FormLine>
          </>
        )}
        <ButtonWrapper>
          <Button onClick={askForQuote} theme="fillLightGreen">
            Ask for a quote
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};

export default HelpMe;
