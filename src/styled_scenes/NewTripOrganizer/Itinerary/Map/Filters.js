import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'semantic-ui-react';
import { Settings } from 'shared_components/icons';
import { primary, activity, accommodation, food, tertiary } from 'libs/colors';
import { Activity, Food, Accommodation } from 'shared_components/icons';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  padding: 10px;
`

const FiltersButton = styled.div`
  z-index: 2;
  position: relative;
  margin-right: 10px;
  background-color: white;
  border-radius: 5px 5px 5px 0;
  width: 40px;
  height: 40px;
  color: ${primary};
  font-size: 30px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
`;

const FiltersContent = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  max-height: 400px;
  background-color: white;
  z-index: 2;
  padding: 10px;
  border-radius: 5px 5px 5px 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);

  > div > * {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const FiltersType = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 16px;
`;

const FiltersDay = styled.div`
  display: flex;
  overflow-y: auto;
  padding-left: 10px;
  flex-direction: column;
`;

const SelectAll = styled.span`
  label {
    color: ${tertiary} !important;
    font-style: italic;
    font-size: 14px;
    font-weight: normal;
    padding-right: 1px;
  }
`;

const CheckLabel = styled.span`
  display: flex;
  align-items: center;
  svg {
    color: ${props => props.color};
    font-size: 20px;
    margin-right: 5px;
  }
`;

const Filters = ({ setFilters, defaultFilters }) => {
  const [accommodationState, setAccommodation] = useState(defaultFilters.accommodation);
  const [activityState, setActivity] = useState(defaultFilters.activity);
  const [foodState, setFood] = useState(defaultFilters.food);

  const [daysState, setDays] = useState(defaultFilters.days);
  const [isShowingFilters, setShowFilters] = useState(false);

  const setNewFilters = changes => {
    setFilters({
      accommodation: accommodationState,
      activity: activityState,
      food: foodState,
      days: daysState,
      ...changes,
    });
  };

  const checkAccommodation = (_, { checked }) => {
    setAccommodation(checked);
    setNewFilters({
      accommodation: checked,
    });
  };

  const checkActivity = (_, { checked }) => {
    setActivity(checked);
    setNewFilters({
      activity: checked,
    });
  };

  const checkFood = (_, { checked }) => {
    setFood(checked);
    setNewFilters({
      food: checked,
    });
  };

  const checkAllTypes = (_, { checked }) => {
    setAccommodation(checked);
    setActivity(checked);
    setFood(checked);
    setNewFilters({
      accommodation: checked,
      activity: checked,
      food: checked,
    });
  };

  const checkAllDays = (_, { checked }) => {
    const days = daysState.map(_ => checked);
    setDays(days);
    setNewFilters({
      days,
    });
  };

  const checkDay = (index, checked) => {
    const days = [...daysState.slice(0, index), checked, ...daysState.slice(index + 1)];

    setDays(days);
    setNewFilters({
      days,
    });
  };

  return (
    <Wrapper>
      <FiltersButton onClick={() => setShowFilters(!isShowingFilters)}>
        <Settings />
      </FiltersButton>
      <FiltersContent show={isShowingFilters}>
        <FiltersType>
          <SelectAll>
            <Checkbox
              checked={accommodationState && activityState && foodState}
              onChange={checkAllTypes}
              label="Select all"
            />
          </SelectAll>
          <Checkbox
            checked={accommodationState}
            onChange={checkAccommodation}
            label={{
              children: (
                <CheckLabel color={accommodation}>
                  <Accommodation />
                  Accommodations
                </CheckLabel>
              ),
            }}
          />
          <Checkbox
            checked={activityState}
            onChange={checkActivity}
            label={{
              children: (
                <CheckLabel color={activity}>
                  <Activity />
                  Activities
                </CheckLabel>
              ),
            }}
          />
          <Checkbox
            checked={foodState}
            onChange={checkFood}
            label={{
              children: (
                <CheckLabel color={food}>
                  <Food />
                  Food
                </CheckLabel>
              ),
            }}
          />
        </FiltersType>
        <FiltersDay>
          <SelectAll>
            <Checkbox
              checked={!daysState.includes(false)}
              onChange={checkAllDays}
              label="Select all"
            />
          </SelectAll>
          {daysState.map((day, i) => (
            <Checkbox
              checked={day}
              onChange={(_, { checked }) => checkDay(i, checked)}
              label={{ children: <CheckLabel color={food}>Day {i + 1}</CheckLabel> }}
            />
          ))}
        </FiltersDay>
      </FiltersContent>
    </Wrapper>
  );
};

export default Filters;
