import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { Modal, Popup } from 'semantic-ui-react';
import { P, PStrong, PSmallStrong, PXSmall, H2SubtitleStrong } from 'libs/commonStyles';
import { getHeroImage, generateServiceSlug, getPriceFromServiceOption } from 'libs/Utils';
import { lightText, primary, primaryContrast, secondaryContrast, error } from 'libs/colors';
import { minutesToHoursOrDays, calculateCancellationCharge } from 'libs/trips';
import Button from 'shared_components/Button';
import { TripContext } from '../';

const OptionsBox = styled.div`
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-top: -8px;
  padding-top: 8px;
`;

const ModalBody = styled.div`
  padding: 40px 25px;
`;

const ChangeOptionsButton = styled.button`
  border: 0;
  border-radius: 0 0 5px 0;
  padding: 10px 6px;
  background-color: ${primary};
  color: ${lightText};
`;

const OptionDescription = styled.div`
  width: 100%;
  max-width: 1150px;
`;

const GuestsAndRooms = styled.div``;

const Options = styled.div`
  margin-top: 25px;
`;

const Option = styled.div`
  display: flex;
  background-color: white;
  flex-direction: row;
  border-radius: 5px 5px 5px 0;
  align-items: center;
  margin-bottom: 14px;
  align-items: center;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  > * {
    width: 20%;
  }
`;

const MealType = styled(P)``;

const RoomType = styled(PStrong)``;

const Price = styled(PStrong)``;

const CancellationPolicy = styled.div`
  > div {
    margin-bottom: 10px;
  }
`;

const CancellationHighlight = styled.span`
  color: #38d39f;
  font-weight: bolder;
`;
const Policy = styled.div`
  margin-bottom: 15px;
`;

const CancellationPolicyTrigger = styled.div`
  color: #38d39f;
  font-size: 12px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

const renderCancellationPolicy = (policies, price) => {
  if (!policies || policies.length === 0) {
    return <div>Non-refundable</div>;
  }

  return (
    <React.Fragment>
      {policies.map(policy => {
        const time = minutesToHoursOrDays(policy.duration);
        return (
          <Policy>
            If you cancel up to{' '}
            <CancellationHighlight>
              {time.length} {time.unit}
            </CancellationHighlight>{' '}
            before check-in, you will be charged{' '}
            <CancellationHighlight>
              ${calculateCancellationCharge(policy, price)}
            </CancellationHighlight>{' '}
            of cancellation fee, to be deduced from refund amount.
          </Policy>
        );
      })}
    </React.Fragment>
  );
};

const ServiceOptions = ({ selectOption, serviceData, options }) => {
  const tripData = useContext(TripContext).tripData;
  const selectedOption = useState(
    serviceData.selectedOption && serviceData.selectedOption.availabilityCode,
  );

  const service = serviceData.service;

  return (
    <OptionsBox>
      <Modal
        trigger={
          <ChangeOptionsButton>
            <PSmallStrong>Change Options</PSmallStrong>
          </ChangeOptionsButton>
        }
      >
        <OptionDescription>
          <Modal.Content image>
            <Modal.Description>
              <ModalBody>
                <H2SubtitleStrong>
                  <I18nText data={service.title} />
                </H2SubtitleStrong>
                <GuestsAndRooms />
                <Options>
                  {options.map(option => {
                    console.log(option);
                    return (
                      <Option>
                        <RoomType>
                          <I18nText data={option.roomType} />
                        </RoomType>
                        <MealType>
                          <I18nText data={option.mealType} />
                        </MealType>
                        <Popup
                          trigger={
                            <CancellationPolicyTrigger>
                              Cancellation policy
                            </CancellationPolicyTrigger>
                          }
                          content={
                            <CancellationPolicy>
                              {option.cancellationPolicies && option.cancellationPolicies.length > 0
                                ? renderCancellationPolicy(
                                    option.cancellationPolicies,
                                    getPriceFromServiceOption(
                                      service.basePrice,
                                      option.price,
                                      tripData.adults + tripData.infants + tripData.children,
                                    ),
                                  )
                                : renderCancellationPolicy(
                                    service.periods &&
                                      service.periods[0] &&
                                      service.periods[0].cancellationPolicies,
                                    getPriceFromServiceOption(
                                      service.basePrice,
                                      null,
                                      this.props.numberOfPeople,
                                    ),
                                  )}
                            </CancellationPolicy>
                          }
                          position="top center"
                        />
                        <Price>${option.price}</Price>
                        <ButtonWrapper>
                          <Button onClick={() => selectOption(serviceData, option)}>
                            <PStrong>Select</PStrong>
                          </Button>
                        </ButtonWrapper>
                      </Option>
                    );
                  })}
                </Options>
              </ModalBody>
            </Modal.Description>
          </Modal.Content>
        </OptionDescription>
      </Modal>
    </OptionsBox>
  );
};

ServiceOptions.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
    periods: PropTypes.arrayOf(
      PropTypes.shape({
        cancellationPolicies: PropTypes.arrayOf(
          PropTypes.shape({
            duration: PropTypes.number.isRequired,
            refundType: PropTypes.string.isRequired,
            refundAmount: PropTypes.number.isRequired,
          }),
        ),
      }),
    ),
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      roomType: PropTypes.string,
      mealType: PropTypes.string,
    }),
  ),
  selectOption: PropTypes.func.isRequired,
};

export default ServiceOptions;
