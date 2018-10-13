// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popup, Checkbox, Loader } from 'semantic-ui-react';
import { getCategory } from 'libs/categories';
import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import { Settings } from 'shared_components/icons';
import Category from 'shared_components/Category';
import Options from './Options';
import AddServiceModal from './AddServiceModal';

const Wrapper = styled.div`
  margin: 40px auto 0;
  color: #3c434b;
`;

const DayTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Day = styled.div`
  margin: 20px 0;
`;

const DayListItem = styled.li`
  list-style-type: none;
  display: flex;
  margin: 5px 0;
  align-items: center;

  > div {
    margin-right: 5px;
  }
`;

const PopupTrigger = styled.div`
  cursor: pointer;
`;

const Service = styled.div`
  margin: 10px 0;
  border: 1px solid #f8f8f8;
  border-radius: 5px;
`;

const ServiceBody = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const ServiceTitle = styled.h3`
  padding: 0;
  font-size: 18px;
  font-weight: bold;
`;

const ServiceFooter = styled.div`
  background-color: #f8f8f8;
`;

const Image = styled.div`
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 200px;
  ${media.minMedium} {
    width: 200px;
  }
`;

const ServiceData = styled.div`
  flex: 1;
  margin: 10px 10px;
`;

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AvailabilityBox = styled.div`
  flex-shrink: 1;
  display: flex;
  justify-content: flex-end;
  border-radius: 5px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
`;

const CheckingAvailability = AvailabilityBox.extend`
  background-color: #f7f7f7;
  color: #919191;
`;

const Availability = AvailabilityBox.extend`
  background-color: ${props => (props.available ? '#BAFFE8' : '#FFC3C3')};
  color: ${props => (props.available ? '#38D39F' : '#F65353')};
`;

const AvailabilityWrapper = styled.div`
  display: flex;
`;

const LastLine = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-weight: bold;
`;

const StartingPrice = styled.div`
  flex: 1;
  color: #3c434b;
  font-size: 14px;
`;

export default class Itinerary extends Component {
  constructor(props) {
    super(props);
    if (this.props.days) {
      this.r = this.props.days.map(_ => React.createRef());
    }

    props.assignRefsToParent(this.r);
  }

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({ start_date: start, end_date: end });
  };

  handleServiceDayChange = (event, data) => {
    if (!data.checked) {
      this.props.removeService(data.day, data.service._id);
      return;
    }
    this.props.addService(data.day, data.service);
  };

  renderServiceFooter = (day, service) => {
    const availability =
      this.props.availability &&
      this.props.availability.find(elem => elem.serviceId === service._id && elem.day === day);

    if (!availability) {
      return null;
    }

    return (
      <ServiceFooter>
        <Options
          basePrice={service.basePrice}
          options={availability.groupedOptions}
          onChange={this.props.selectOption}
          value={
            (this.props.optionsSelected[day] &&
              this.props.optionsSelected[day][service._id] &&
              this.props.optionsSelected[day][service._id].availabilityCode) ||
            ''
          }
          serviceId={service._id}
          day={day}
        />
      </ServiceFooter>
    );
  };

  renderAvailability = (day, id) => {
    if (this.props.isCheckingAvailability) {
      return (
        <CheckingAvailability>
          <Loader inline="centered" size="mini" active />
        </CheckingAvailability>
      );
    }

    if (!this.props.startDate || !this.props.numberOfPeople || !this.props.availability) {
      return null;
    }

    const thisAvailability =
      this.props.availability &&
      this.props.availability.find(elem => elem.day === day && elem.serviceId === id);
    const isAvailable = thisAvailability && thisAvailability.isAvailable;

    return (
      <Availability available={isAvailable}>
        {isAvailable ? 'Available' : 'Unavailable'}
      </Availability>
    );
  };

  renderDay = (day, index) => (
    <Day key={day.title} innerRef={this.r[index]}>
      <DayTitle>{day.title}</DayTitle>
      <AddServiceModal
        trip={this.props.trip}
        onServiceSelect={this.props.addService}
        day={day.day}
      />
      {day.data.map(dayData => (
        <Service key={dayData.service._id}>
          <ServiceBody>
            {dayData.service.media[0] && <Image url={dayData.service.media[0].files.small.url} />}
            <ServiceData>
              <CategoryWrapper>
                <Category
                  color={getCategory(dayData.service.categories[0]).color}
                  icon={getCategory(dayData.service.categories[0]).icon}
                  name={dayData.service.categories[0].names}
                  fontSize="11px"
                  iconSize="13px"
                  lineHeight="17px"
                />
                <AvailabilityWrapper>
                  {this.renderAvailability(day.day, dayData.service._id)}
                </AvailabilityWrapper>
              </CategoryWrapper>
              <ServiceTitle>
                <I18nText data={dayData.service.title} />
              </ServiceTitle>
              <LastLine>
                <StartingPrice>Starts from ${dayData.service.basePrice}</StartingPrice>
                <Popup
                  trigger={
                    <PopupTrigger>
                      <Settings />
                    </PopupTrigger>
                  }
                  content={
                    <ul>
                      {this.props.days.map(checkboxDay => (
                        <DayListItem key={checkboxDay.day}>
                          <Checkbox
                            name={dayData.service._id}
                            day={checkboxDay.day}
                            service={dayData.service}
                            checked={
                              this.props.daysByService[dayData.service._id] &&
                              this.props.daysByService[dayData.service._id].includes(
                                checkboxDay.day,
                              )
                            }
                            onChange={this.handleServiceDayChange}
                          />
                          {checkboxDay.title}
                        </DayListItem>
                      ))}
                    </ul>
                  }
                  on="click"
                  position="bottom left"
                />
              </LastLine>
            </ServiceData>
          </ServiceBody>
          {this.renderServiceFooter(day.day, dayData.service)}
        </Service>
      ))}
    </Day>
  );

  render() {
    if (this.props.days.length !== this.r.length) {
      this.r = this.props.days.map(_ => React.createRef());
      this.props.assignRefsToParent(this.r);
    }

    return <Wrapper>{this.props.days && this.props.days.map(this.renderDay)}</Wrapper>;
  }
}

Itinerary.propTypes = {
  trip: PropTypes.object.isRequired,
  availability: PropTypes.array,
  numberOfPeople: PropTypes.number,
  startDate: PropTypes.object,
  assignRefsToParent: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  addService: PropTypes.func.isRequired,
};
