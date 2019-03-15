import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import { primary, primaryContrast, secondary, secondaryContrast, lightText } from 'libs/colors';
import { PStrong, PSmall } from 'libs/commonStyles';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  margin: auto;
  height: 70px;
  z-index: 5;
  width: 100%;
  background-color: ${secondaryContrast};
  border-top: 1px solid ${secondary};
  padding: 25px 40px;
  display: flex;
  align-items: center;
  > *:not(:first-child) {
    margin-left: 20px;
  }
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${lightText};
  display: flex;
  align-items: center;
  > p:first-child {
    margin-right: 10px;
  }
`;

const SaveText = styled(PStrong)`
  color: #c4c4c4;
`;

const CheckingAvailability = styled.div`
  width: 100%;
  text-align: center;
  color: ${lightText};
  padding: 10px;
  max-width: 250px;
  height: 150px;
  left: 0;
  right: 0;
  bottom: 70px;
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  background-color: ${primary};
  border: 1px solid ${primaryContrast};
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  opacity: ${props => (props.checking ? 1 : 0)};
  transform: translateY(${props => (props.checking ? '0' : '150px')});
  transition: 1s ease-in-out;
  z-index: 3;
  > p {
    margin-bottom: 35px;
  }
`;

class Footer extends React.Component {
  saveButtonText() {
    if (this.props.isSaving) {
      return 'Saving Trip';
    }
    return 'Trip Saved';
  }

  render() {
    console.log(this.props.isCheckingAvailability);
    return (
      <>
        <Wrapper>
          <Price>
            <PStrong>${this.props.price}</PStrong> <PSmall>Total price</PSmall>
          </Price>
          <Button
            size="small"
            type="button"
            theme="fillLightGreen"
            onClick={this.props.book}
            data-testid="checkoutBookButton"
            bold
          >
            Book
          </Button>
          <Button size="small" type="button" theme="fillLightGreen" onClick={this.props.share} bold>
            Share and earn rewards
          </Button>
          <SaveText>{this.saveButtonText()}</SaveText>
        </Wrapper>
        <CheckingAvailability checking={this.props.isCheckingAvailability}>
          <PStrong>Checking availability, please wait...</PStrong>
          <Loader active={this.props.isCheckingAvailability} inverted inline="centered" />
        </CheckingAvailability>
      </>
    );
  }
}

Footer.propTypes = {
  price: PropTypes.string.isRequired,
  share: PropTypes.func.isRequired,
  book: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isCheckingAvailability: PropTypes.bool.isRequired,
};

export default Footer;
