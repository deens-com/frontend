import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { secondary, secondaryContrast, lightText } from 'libs/colors';
import { PStrong, PSmall } from 'libs/commonStyles';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  margin: auto;
  height: 70px;
  z-index: 1;
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

class Footer extends React.Component {
  saveButtonText() {
    if (this.props.isSaving) {
      return 'Saving Trip';
    }
    return 'Trip Saved';
  }

  render() {
    return (
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
    );
  }
}

Footer.propTypes = {
  price: PropTypes.string.isRequired,
  share: PropTypes.func.isRequired,
  book: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default Footer;
