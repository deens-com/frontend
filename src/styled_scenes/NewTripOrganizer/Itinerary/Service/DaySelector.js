import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';
import { P } from 'libs/commonStyles';

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const OptionSelector = styled.select`
  border-radius: 5px 5px 5px 0;
  color: black;
  background-color: #f8f8f8;
  margin-left: 10px;
  border: 1px solid #e0e0e0;
  padding: 5px;
  outline: none;
`;

// endDate is the last instance of the service.
// Checkout is one day after that
export default ({ service, numberOfDays, startDate, endDate, changeServiceDays }) => {
  const [internalStartDate, setInternalStartDate] = useState(startDate);
  const [internalEndDate, setInternalEndDate] = useState(endDate);

  useEffect(
    () => {
      setInternalStartDate(startDate);
      setInternalEndDate(endDate);
    },
    [startDate, endDate],
  );

  const onSelectStartDay = e => {
    const startDay = Number(e.target.value);
    const endDay = startDay >= internalEndDate ? startDay + 1 : internalEndDate;
    setInternalStartDate(startDay);
    setInternalEndDate(endDay);
    changeServiceDays(service, startDay, endDay - 1);
  };

  const onSelectEndDay = e => {
    const endDay = Number(e.target.value);
    const startDay = endDay <= internalStartDate ? endDay - 1 : internalStartDate;
    setInternalStartDate(startDay);
    setInternalEndDate(endDay);
    changeServiceDays(service, startDay, endDay - 1);
  };

  return (
    <div>
      <Field>
        <P>
          <Trans>Check-in day</Trans>
        </P>
        <OptionSelector value={internalStartDate} onChange={onSelectStartDay}>
          {[...new Array(numberOfDays)].map((_, i) => (
            <option>{i + 1}</option>
          ))}
        </OptionSelector>
      </Field>
      <Field>
        <P>
          <Trans>Check-out day</Trans>
        </P>
        <OptionSelector value={internalEndDate} onChange={onSelectEndDay}>
          {[...new Array(numberOfDays)].map((_, i) => (
            <option>{i + 2}</option>
          ))}
        </OptionSelector>
      </Field>
    </div>
  );
};
