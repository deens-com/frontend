import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { primary, primaryContrast, secondary, secondaryContrast, lightText, darkText } from 'libs/colors';
import { PStrong, PSmall, P } from 'libs/commonStyles';
import Button from 'shared_components/Button';
import LoadingDots from 'shared_components/LoadingDots'
import { UndoArrow } from 'shared_components/icons'
import I18nText from 'shared_components/I18nText'

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
  width: auto;
  text-align: center;
  display: flex;
  color: ${darkText};
  padding: 10px;
  right: 20px;
  bottom: 94px;
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  background-color: #65AFBB4C;
  border-bottom: 0;
  border-radius: 5px;
  opacity: ${props => (props.checking ? 1 : 0)};
  transition: 1s ease-in-out;
  z-index: ${props => (props.checking ? 3 : -1)};
  > p {
    text-shadow: 1px 1px 10px white;
    margin-right: 10px;
  }
`;

const UndoServiceDeletion = styled.div`
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${lightText};
  padding: 10px;
  left: 50%;
  transform: translateX(-50%) scaleX(${props => (props.show ? 1 : 0)});
  bottom: ${props => (props.show ? '94px' : '-10px')};
  position: fixed;
  background-color: #65AFBB;
  border-bottom: 0;
  border-radius: 5px;
  transition: 0.7s ease-in-out;
  cursor: pointer;
  z-index: 3;
  > p {
    margin-left: 10px;
  }
  > svg {
    width: 1.2em !important;
    height: 1.2em !important;
    color: ${lightText} !important;
  }
`

class Footer extends React.Component {
  saveButtonText() {
    if (this.props.isSaving) {
      return 'Saving Trip';
    }
    return 'Trip Saved';
  }

  render() {
    const { recentlyDeletedService, undoRemoveService } = this.props

    return (
      <>
        <Wrapper>
          <Price>
            <PStrong>${this.props.price}</PStrong> <PSmall>Total price</PSmall>
          </Price>
          <Button
            id="bookButton"
            size="small"
            type="button"
            theme="fillLightGreen"
            onClick={this.props.book}
            data-testid="checkoutBookButton"
            bold
          >
            Book
          </Button>
          <Button id="shareButton" size="small" type="button" theme="fillLightGreen" onClick={this.props.share} bold>
            Share and earn rewards
          </Button>
          <SaveText>{this.saveButtonText()}</SaveText>
        </Wrapper>
        <CheckingAvailability checking={this.props.isCheckingAvailability}>
          <P>Checking availability</P>
          <LoadingDots />
        </CheckingAvailability>
        <UndoServiceDeletion onClick={() => recentlyDeletedService && undoRemoveService()} show={Boolean(recentlyDeletedService)}>
          <UndoArrow />
          <P>Undo removal of <I18nText data={recentlyDeletedService && recentlyDeletedService.service && recentlyDeletedService.service.service && recentlyDeletedService.service.service.title} /></P>
        </UndoServiceDeletion>
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
  recentlyDeletedService: PropTypes.shape({
    position: PropTypes.number.isRequired,
    service: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      service: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequried,
  }),
};

Footer.defaultProps = {
  recentlyDeletedService: null,
}

export default Footer;
