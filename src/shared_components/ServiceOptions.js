import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import Popup from 'shared_components/Popup';
import { Modal } from 'semantic-ui-react';
import { P, PStrong, PSmallStrong, PXSmall, H2SubtitleStrong } from 'libs/commonStyles';
import { getPriceFromServiceOption, extractPrice } from 'libs/Utils';
import { textLight, primary, primaryHover, secondaryContrast, error } from 'libs/colors';
import { minutesToHoursOrDays, calculateCancellationCharge } from 'libs/trips';
import Button from 'shared_components/Button';
import { media } from 'libs/styled';

// i18n
import { Trans } from '@lingui/macro';

const OptionsBox = styled.div`
  display: inline-block;
  margin-left: 5px;
  ${media.minMedium} {
    display: block;
  }
`;

const ModalBody = styled.div`
  padding: 40px 25px;
`;

const ChangeOptionsButton = styled.p`
  cursor: pointer;
  border: 0;
  background: white;
  color: ${primary};
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
  background-color: ${props => (props.selected ? primaryHover : 'white')};
  border-radius: 5px 5px 5px 0;
  margin-bottom: 14px;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  ${media.minSmall} {
    flex-direction: row;
    align-items: center;
  }
  > * {
    flex: 1;
    margin-bottom: 10px;
    ${media.minSmall} {
      margin: 0;
    }
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
  color: ${primary};
  font-weight: bolder;
`;
const Policy = styled.div`
  margin-bottom: 15px;
`;

const CancellationPolicyTrigger = styled.div`
  color: ${primary};
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  color: white;
  min-height: 38px;
  display: flex;
  justify-content: flex-end;
  align-self: center;
`;

const renderCancellationPolicy = (policies, price, key) => {
  if (!policies || policies.length === 0) {
    return (
      <div>
        <Trans>Non-refundable</Trans>
      </div>
    );
  }

  return (
    <React.Fragment>
      {policies.map(policy => {
        const time = minutesToHoursOrDays(policy.duration);
        return (
          <Policy key={key}>
            <Trans>If you cancel up to</Trans>{' '}
            <CancellationHighlight>
              {time.length} {time.unit}
            </CancellationHighlight>{' '}
            <Trans>before check-in, you will be charged</Trans>{' '}
            <CancellationHighlight>
              ${calculateCancellationCharge(policy, price)}
            </CancellationHighlight>{' '}
            <Trans>of cancellation fee, to be deduced from refund amount.</Trans>
          </Policy>
        );
      })}
    </React.Fragment>
  );
};

const ServiceOptions = ({ trip, selectOption, serviceData, options }) => {
  const [selectedOption, setSelectedOption] = useState(serviceData.selectedOption);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(
    () => {
      setSelectedOption(serviceData.selectedOption);
    },
    [serviceData.selectedOption],
  );

  const fullSelectedOption = options.find(
    opt => opt.otherAttributes.availabilityCode.code === selectedOption,
  );
  const service = serviceData.service;

  return (
    <OptionsBox hasSelectedOption={Boolean(selectedOption)}>
      <Modal
        open={isModalOpen}
        trigger={<ChangeOptionsButton>change</ChangeOptionsButton>}
        onOpen={() => setModalOpen(true)}
        onClose={() => {
          if (fullSelectedOption) {
            selectOption(serviceData, fullSelectedOption);
          }
          setModalOpen(false);
        }}
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
                    return (
                      <Option
                        selected={selectedOption === option.otherAttributes.availabilityCode.code}
                        key={option.otherAttributes.availabilityCode.code}
                      >
                        <RoomType>
                          <I18nText data={option.title} />
                        </RoomType>
                        <MealType>
                          <I18nText data={option.mealType} />
                        </MealType>
                        <Popup
                          trigger={
                            <CancellationPolicyTrigger>
                              <Trans>Cancellation policy</Trans>
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
                                      trip.adultCount,
                                      trip.childrenCount,
                                    ),
                                    option.otherAttributes.availabilityCode.code,
                                  )
                                : renderCancellationPolicy(
                                    service.periods &&
                                      service.periods[0] &&
                                      service.periods[0].cancellationPolicies,
                                    getPriceFromServiceOption(
                                      service.basePrice,
                                      null,
                                      trip.adultCount,
                                      trip.childrenCount,
                                    ),
                                    option.otherAttributes.availabilityCode.code,
                                  )}
                            </CancellationPolicy>
                          }
                          position="top center"
                        />
                        <Price>${extractPrice(option.price)}</Price>
                        <ButtonWrapper>
                          {selectedOption === option.otherAttributes.availabilityCode.code ? (
                            <PStrong>
                              <Trans>Selected</Trans>
                            </PStrong>
                          ) : (
                            <Button
                              theme="primaryFilled"
                              onClick={() => {
                                setSelectedOption(option.otherAttributes.availabilityCode.code);
                              }}
                            >
                              <PStrong>
                                <Trans>Select</Trans>
                              </PStrong>
                            </Button>
                          )}
                        </ButtonWrapper>
                      </Option>
                    );
                  })}
                </Options>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    disabled={!fullSelectedOption}
                    theme="primaryFilled"
                    onClick={() => {
                      if (!fullSelectedOption) {
                        return;
                      }
                      setModalOpen(false);
                      selectOption(serviceData, fullSelectedOption);
                    }}
                  >
                    <PStrong>
                      <Trans>Apply</Trans>
                    </PStrong>
                  </Button>
                </div>
              </ModalBody>
            </Modal.Description>
          </Modal.Content>
        </OptionDescription>
      </Modal>
    </OptionsBox>
  );
};

ServiceOptions.propTypes = {
  serviceData: PropTypes.shape({
    service: PropTypes.shape({
      title: PropTypes.object.isRequired,
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
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.object.isRequired,
      roomType: PropTypes.object,
      mealType: PropTypes.object,
    }),
  ),
  selectOption: PropTypes.func.isRequired,
};

export default ServiceOptions;
