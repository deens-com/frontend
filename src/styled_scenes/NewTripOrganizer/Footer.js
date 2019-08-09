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

// i18n
import { Trans } from '@lingui/macro';

const bottomOffset = 245;

const CheckingAvailability = styled.div`
  width: auto;
  text-align: center;
  display: flex;
  color: ${textDark};
  padding: 10px;
  right: 20px;
  bottom: 25px;
  position: fixed;
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
  bottom: ${props => (props.show ? '25px' : '-10px')};
  position: fixed;
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
      <div>
        <CheckingAvailability checking={isCheckingAvailability}>
          <P>
            <Trans>Checking availability</Trans>
          </P>
          <LoadingDots />
        </CheckingAvailability>
        <UndoServiceDeletion
          onClick={() => recentlyDeletedService && undoRemoveService()}
          show={Boolean(recentlyDeletedService)}
        >
          <UndoArrow />
          <P>
            <Trans>Undo removal of</Trans>{' '}
            <I18nText
              data={
                recentlyDeletedService &&
                recentlyDeletedService &&
                recentlyDeletedService.service &&
                recentlyDeletedService.service.title
              }
            />
          </P>
        </UndoServiceDeletion>
      </div>
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
