import React from 'react';
import { Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';

const Content = styled.div`
  padding: 10px 20px;
  font-size: 16px;

  > ul {
    list-style: none;
    margin-bottom: 15px;
    > li {
      margin-bottom: 5px;
    }
  }
`;

const DayTitle = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export default ({ continueFn, hideModal, availability, days, filterServicesFromDays }) => {
  const removeServices = availability.data.filter(value => !value.isAvailable);
  const daysFiltered = filterServicesFromDays(days, removeServices).filter(
    day => day.data.length > 0,
  );
  console.log(daysFiltered);

  return (
    <Modal
      open={!availability.isChecking}
      header="Are you sure?"
      content={
        <Content data-testid="popupWillDeleteServices">
          <p>
            The following services are not available in the selected dates. Do you want to remove
            them from the trip?
          </p>
          {daysFiltered.map(day => (
            <React.Fragment>
              <DayTitle>Day {day.day}</DayTitle>
              <ul>
                {day.data.map(service => (
                  <li>
                    <I18nText data={service.service.title} />
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </Content>
      }
      size="small"
      onClose={hideModal}
      actions={[
        {
          key: 'keep',
          content: 'Keep the services',
          onClick: hideModal,
          negative: true,
        },
        {
          onClick: continueFn,
          key: 'delete',
          content: 'Remove services and book trip',
          positive: true,
        },
      ]}
    />
  );
};
