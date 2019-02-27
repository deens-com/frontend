import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H2, P } from 'libs/commonStyles';
import { secondary, lightText } from 'libs/colors';

//https://maps.googleapis.com/maps/api/staticmap?center=${location.city}&zoom=13&size=140x140&maptype=roadmap&key=AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc

const Wrapper = styled.header`
  background: url('${props => props.image}');
  background-size:cover;
  background-position: center;
`;

const Overlay = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding: 25px 40px;
  > div {
    margin-left: 30px;
    &:first-child {
      flex-grow: 0;
      margin-left: 0;
    }
  }
`;

const Title = styled(H2)`
  color: ${secondary};
`;

const Description = styled(P)`
  color: ${lightText};
`;

const Map = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 5px 5px 5px 0;
`;

const Header = ({ location, title, image, description }) => {
  return (
    <Wrapper image={image}>
      <Overlay>
        <div>
          <Map src="https://i.imgur.com/9WmlVps.png" />
        </div>
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>
      </Overlay>
    </Wrapper>
  );
};

Header.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string,
    countryCode: PropTypes.string,
    geo: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
      type: PropTypes.string,
    }),
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Header.defaultProps = {
  location: null,
  title: '',
  description: '',
  image: '',
};

export default Header;
