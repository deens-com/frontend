// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Loader, Modal } from 'semantic-ui-react';
import { getCategory } from 'libs/categories';
import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import Category from 'shared_components/Category';
import { TrashCan } from 'shared_components/icons';
import Options from './Options';
import AddServiceModal from './AddServiceModal';
import ServiceDaySelector from './ServiceDaySelector';

const Wrapper = styled.div`
  margin: 40px auto 0;
  color: #3c434b;
`;

const DayHeader = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
`;

const DeleteDayButton = styled.button`
  background-color: white;
  border-radius: 3px;
  border: 1px solid #d98181;
  color: #d98181;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  padding: 5px 7px;
  margin-left: 15px;
  outline: 0;
  display: flex;

  svg {
    fill: #d98181;
    margin-right: 5px;
  }
`;

const DayTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Day = styled.div`
  margin: 20px 0;
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

const NoServices = styled.div`
  font-size: 18px;
  margin: 10px 0 50px;
  text-align: center;
  font-variant: all-small-caps;
  font-weight: bold;
`;

export default class Itinerary extends Component {
  constructor(props) {
    super(props);
    if (this.props.days) {
      this.r = this.props.days.map(_ => React.createRef());
    }

    this.state = {
      dayToDelete: null,
    };

    props.assignRefsToParent(this.r);
  }

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({ start_date: start, end_date: end });
  };

  openModal = day => {
    this.setState({
      dayToDelete: day,
    });
  };

  keepDay = () => {
    this.setState({
      dayToDelete: null,
    });
  };

  removeDay = () => {
    this.props.removeDay(this.state.dayToDelete);
    this.setState({
      dayToDelete: null,
    });
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
      <DayHeader>
        <DayTitle>{day.title}</DayTitle>
        <DeleteDayButton onClick={() => this.openModal(day)}>
          <TrashCan />
          Delete this day
        </DeleteDayButton>
      </DayHeader>
      <AddServiceModal trip={this.props.trip} onServiceSelect={this.props.addService} day={day} />
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
                <Link to={`/services/${dayData.service._id}`}>
                  <I18nText data={dayData.service.title} />
                </Link>
              </ServiceTitle>
              <LastLine>
                <StartingPrice>Starts from ${dayData.service.basePrice}</StartingPrice>
                <ServiceDaySelector
                  dayData={dayData}
                  daysByService={this.props.daysByService}
                  days={this.props.days}
                  removeService={this.props.removeService}
                  addService={this.props.addService}
                />
              </LastLine>
            </ServiceData>
          </ServiceBody>
          {this.renderServiceFooter(day.day, dayData.service)}
        </Service>
      ))}
      {day.data.length === 0 && (
        <NoServices>There are no services selected for this day.</NoServices>
      )}
    </Day>
  );

  render() {
    if (this.props.days.length !== this.r.length) {
      this.r = this.props.days.map(_ => React.createRef());
      this.props.assignRefsToParent(this.r);
    }

    return (
      <React.Fragment>
        {this.state.dayToDelete && (
          <Modal
            open
            on="click"
            onClose={this.keepDay}
            header={`Remove ${this.state.dayToDelete.title}`}
            content="Are you sure you want to delete this day from your trip? If there are following days, they will be moved one day back."
            size="small"
            actions={[
              {
                key: 'keep',
                content: 'Keep the day',
                onClick: this.keepDay,
              },
              {
                onClick: this.removeDay,
                key: 'delete',
                content: 'Delete',
                negative: true,
              },
            ]}
          />
        )}
        <Wrapper>{this.props.days && this.props.days.map(this.renderDay)}</Wrapper>
      </React.Fragment>
    );
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
