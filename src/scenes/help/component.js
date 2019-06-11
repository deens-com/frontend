import React, { useState } from 'react';
import { PStrong, P } from 'libs/commonStyles';
import styled from 'styled-components';
import { getLocationParams } from 'libs/search';
import { media } from 'libs/styled';
import { tertiary } from 'libs/colors';
import BriefcaseHeart from 'shared_components/icons/BriefcaseHeart';
import HelpMe from 'shared_components/HelpMe/Content';
import Modal from 'shared_components/Modal';
import icon from './icon.svg';
import history from 'main/history';

const Options = styled.div`
  display: flex;
  max-width: 740px;
  flex-direction: column;
  justify-content: center;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const Option = styled.div`
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 10px;
  border-radius: 5px;
  cursor: pointer;
  ${media.minMedium} {
    flex-direction: column;
    max-width: 210px;
    margin-bottom: 0;
    margin-right: 55px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const Text = styled.div`
  margin-left: 20px;
  ${media.minMedium} {
    text-align: center;
    margin-top: 15px;
    margin-left: 0;
  }
`;

export default ({ savedSearchQuery, session, routeState }) => {
  const location = {
    ...getLocationParams(savedSearchQuery),
    formattedAddress: savedSearchQuery.address,
  };

  return (
    <>
      <div style={{ margin: '0 auto' }}>
        <Options>
          <Option
            onClick={() => window.open('https://pleaseassist.freshdesk.com/support/home', '_blank')}
          >
            <img src={icon} alt="help icon" />
            <Text>
              <PStrong style={{ marginBottom: '0' }}>SUPPORT CENTER</PStrong>
              <P>Find out how to make the most of the trip planner</P>
            </Text>
          </Option>
          <Option
            onClick={() => {
              if (routeState && routeState.modal) {
                history.replace('/help/travel-planning', {
                  ...routeState,
                  modal: true,
                  helpData: {
                    ...routeState.helpData,
                    defaultLocation: location,
                  },
                });
                return;
              }
              history.push('/help/travel-planning', {
                ...routeState,
                modal: true,
                helpData: {
                  ...routeState.helpData,
                  defaultLocation: location,
                },
              });
            }}
            style={{ border: `1px solid ${tertiary}` }}
          >
            <BriefcaseHeart
              style={{ flexShrink: 0, width: '50px', height: 'auto', color: 'white' }}
              color={tertiary}
            />
            <Text>
              <PStrong style={{ marginBottom: '0', color: tertiary }}>PREMIUM</PStrong>
              <P>
                Take the hassle away and get a travel planner to organize your ideal trip for you
              </P>
            </Text>
          </Option>
        </Options>
      </div>
    </>
  );
};
