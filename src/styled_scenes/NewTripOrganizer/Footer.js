import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import { textDisabled, textLight, textDark } from 'libs/colors';
import { PStrong, PSmall, P } from 'libs/commonStyles';
import Button from 'shared_components/Button';
import LoadingDots from 'shared_components/LoadingDots';
import UndoArrow from 'shared_components/icons/UndoArrow';
import I18nText from 'shared_components/I18nText';
import { throttle } from 'lodash';
import { media } from 'libs/styled';

const bottomOffset = 245;

const Placeholder = styled.div`
  height: 70px;
`;

const Wrapper = styled.div`
  position: ${props => props.position};
  bottom: 0;
  left: 0;
  margin: auto;
  height: 70px;
  z-index: 5;
  width: 100%;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  padding: 25px 10px;
  display: flex;
  align-items: center;
  > *:not(:first-child) {
    margin-left: 20px;
  }
  ${media.minSmall} {
    padding: 25px 40px;
  }
`;

const TotalPriceText = styled(PSmall)`
  display: none;
  ${media.minSmall} {
    display: inline-block;
  }
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${textDark};
  display: flex;
  align-items: center;
  > p:first-child {
    margin-right: 10px;
  }
`;

const SaveText = styled(P)`
  color: ${textDisabled};
  display: none;
  ${media.minSmall} {
    display: inline-block;
  }
`;

const CheckingAvailability = styled.div`
  width: auto;
  text-align: center;
  display: flex;
  color: ${textDark};
  padding: 10px;
  right: 20px;
  bottom: 94px;
  position: absolute;
  margin-left: auto !important;
  margin-right: auto;
  background-color: #65afbb4c;
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
  color: ${textLight};
  padding: 10px;
  left: 50%;
  transform: translateX(-50%) scaleX(${props => (props.show ? 1 : 0)});
  bottom: ${props => (props.show ? '94px' : '-10px')};
  position: absolute;
  background-color: #65afbb;
  border-bottom: 0;
  border-radius: 5px;
  transition: 0.7s ease-in-out;
  cursor: pointer;
  z-index: 3;
  margin-left: auto !important;
  > p {
    margin-left: 10px;
  }
  > svg {
    width: 1.2em !important;
    height: 1.2em !important;
    color: ${textLight} !important;
  }
`;

const LoaderWrapper = styled.span`
  margin-right: 10px;
`;

const saveButtonText = isSaving => {
  if (isSaving) {
    return 'Saving Trip';
  }
  return 'Trip Saved';
};

const Footer = ({
  isSaving,
  recentlyDeletedService,
  undoRemoveService,
  book,
  price,
  share,
  isCheckingAvailability,
  isLoadingPrice,
  canShare,
}) => {
  const [position, setPosition] = useState('fixed');

  useEffect(
    () => {
      const handleScroll = () => {
        const fullHeight = document.body.scrollHeight;
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;

        if (scrolled + viewportHeight >= fullHeight - bottomOffset) {
          setPosition('relative');
          return;
        }

        if (position === 'relative') {
          setPosition('fixed');
        }
      };

      const handleScrollThrottle = throttle(handleScroll, 10);

      window.addEventListener('scroll', handleScrollThrottle);
      return () => {
        window.removeEventListener('scroll', handleScrollThrottle);
      };
    },
    [position],
  );

  return (
    <>
      <Wrapper position={position}>
        <Price>
          {isLoadingPrice ? (
            <LoaderWrapper>
              <Loader size="mini" inline="centered" active />
            </LoaderWrapper>
          ) : (
            <PStrong>${price}</PStrong>
          )}{' '}
          <TotalPriceText>Total price</TotalPriceText>
        </Price>
        <Button
          id="bookButton"
          size="small"
          type="button"
          theme="fillLightGreen"
          onClick={book}
          data-testid="checkoutBookButton"
          bold
        >
          Book
        </Button>
        {canShare && (
          <Button id="shareButton" size="small" type="button" theme="tertiary" onClick={share} bold>
            Share and earn rewards
          </Button>
        )}
        <SaveText>{saveButtonText(isSaving)}</SaveText>
        <CheckingAvailability checking={isCheckingAvailability}>
          <P>Checking availability</P>
          <LoadingDots />
        </CheckingAvailability>
        <UndoServiceDeletion
          onClick={() => recentlyDeletedService && undoRemoveService()}
          show={Boolean(recentlyDeletedService)}
        >
          <UndoArrow />
          <P>
            Undo removal of{' '}
            <I18nText
              data={
                recentlyDeletedService &&
                recentlyDeletedService.service &&
                recentlyDeletedService.service.service &&
                recentlyDeletedService.service.service.title
              }
            />
          </P>
        </UndoServiceDeletion>
      </Wrapper>
      {position === 'fixed' && <Placeholder />}
    </>
  );
};

Footer.propTypes = {
  price: PropTypes.string.isRequired,
  share: PropTypes.func.isRequired,
  book: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isCheckingAvailability: PropTypes.bool.isRequired,
  isLoadingPrice: PropTypes.bool.isRequired,
  recentlyDeletedService: PropTypes.shape({
    position: PropTypes.number.isRequired,
    service: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      service: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
};

Footer.defaultProps = {
  recentlyDeletedService: null,
};

export default Footer;
