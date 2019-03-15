import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { Modal, Popup } from 'semantic-ui-react';
import { P, PStrong, PSmallStrong, PXSmall, H2SubtitleStrong } from 'libs/commonStyles';
import { getHeroImage, generateServiceSlug, getPriceFromServiceOption } from 'libs/Utils';
import { lightText, primary, secondary, secondaryContrast, error } from 'libs/colors';
import { minutesToHoursOrDays, calculateCancellationCharge } from 'libs/trips';
import Button from 'shared_components/Button';
import { TripContext } from '../';

const OptionsBox = styled.div`
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-top: -8px;
  padding: 8px 0;
`;

const ModalBody = styled.div`
  padding: 40px 25px;
`;

const ChangeOptionsButton = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 0 0 5px 0;
  padding: 10px 6px;
  background-color: ${primary};
  color: ${lightText};
  &:focus {
    outline: 0;
  }
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
  background-color: ${props => (props.selected ? secondary : 'white')};
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
  align-items: center;
`;

const SelectedOption = styled(PXSmall)`
  margin: 10px 5px;
`;

const renderCancellationPolicy = (policies, price, key) => {
  if (!policies || policies.length === 0) {
    return <div>Non-refundable</div>;
  }

  return (
    <React.Fragment>
      {policies.map(policy => {
        const time = minutesToHoursOrDays(policy.duration);
        return (
          <Policy key={key}>
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
  const [selectedOption, setSelectedOption] = useState(
    serviceData.selectedOption && serviceData.selectedOption.availabilityCode,
  );
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(
    () => {
      setSelectedOption(serviceData.selectedOption && serviceData.selectedOption.availabilityCode);
    },
    [serviceData.selectedOption],
  );

  const fullSelectedOption = options.find(
    opt => opt.otherAttributes.availabilityCode.code === selectedOption,
  );
  const service = serviceData.service;

  return (
    <OptionsBox>
      <Modal
        open={isModalOpen}
        trigger={
          <ChangeOptionsButton>
            <PSmallStrong>Change Options</PSmallStrong>
          </ChangeOptionsButton>
        }
        onOpen={() => setModalOpen(true)}
        onClose={() => setModalOpen(false)}
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
                                    option.otherAttributes.availabilityCode.code,
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
                                    option.otherAttributes.availabilityCode.code,
                                  )}
                            </CancellationPolicy>
                          }
                          position="top center"
                        />
                        <Price>${option.price}</Price>
                        <ButtonWrapper>
                          {selectedOption === option.otherAttributes.availabilityCode.code ? (
                            <PStrong>Selected</PStrong>
                          ) : (
                            <Button
                              theme="primaryFilled"
                              onClick={() => {
                                setSelectedOption(option.otherAttributes.availabilityCode.code);
                              }}
                            >
                              <PStrong>Select</PStrong>
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
                    <PStrong>Apply</PStrong>
                  </Button>
                </div>
              </ModalBody>
            </Modal.Description>
          </Modal.Content>
        </OptionDescription>
      </Modal>
      {fullSelectedOption && (
        <SelectedOption>
          <I18nText data={fullSelectedOption.title} />
        </SelectedOption>
      )}
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
      price: PropTypes.number.isRequired,
      roomType: PropTypes.object,
      mealType: PropTypes.object,
    }),
  ),
  selectOption: PropTypes.func.isRequired,
};

export default ServiceOptions;
