// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Loader, Modal, TextArea, Popup } from 'semantic-ui-react';
import { getCategory } from 'libs/categories';
import { media } from 'libs/styled';
import { minutesToHoursOrDays, calculateCancellationCharge } from 'libs/trips';
import { generateServiceSlug, getPriceFromServiceOption } from 'libs/Utils';
import { getHeroImageUrlFromMedia } from 'libs/media';
import I18nText from 'shared_components/I18nText';
import Category from 'shared_components/Category';
import Button from 'shared_components/Button';
import { TrashCan } from 'shared_components/icons';
import Options from './Options';
//import AddServiceModal from './AddServiceModal';
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

const AddNoteButton = styled.span`
  margin-left: 15px;
`;

const Note = styled.div`
  position: relative;
  color: #c2af4d;
  margin-top: 15px;

  textarea {
    border: 0;
    outline: 0;
    background-color: #fffdd9;
    color: #c2af4d;
    width: 100%;
    background-color: #fffdd9;
    border-radius: 5px;
    padding: 58px 20px 8px;
    color: #c2af4d;
    :focus {
      outline: 1px solid #c2af4d;
    }
  }
`;

const NoteTitle = styled.div`
  background-color: #fdfab2;
  color: #c2af4d;
  border-radius: 20px;
  padding: 7px;
  width: 100px;
  text-align: center;
  position: absolute;
  margin: 8px auto 0;
  left: 0;
  right: 0;
`;

const NoteDeleteButton = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 18px;
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

const CheckingAvailability = styled(AvailabilityBox)`
  background-color: #f7f7f7;
  color: #919191;
`;

const Availability = styled(AvailabilityBox)`
  background-color: ${props => (props.available ? '#BAFFE8' : '#FFC3C3')};
  color: ${props => (props.available ? '#00e4ff' : '#F65353')};
  align-self: flex-end;
  margin-right: 0;
`;

const AvailabilityWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const CancellationPolicy = styled.div`
  > div {
    margin-bottom: 10px;
  }
`;

const CancellationHighlight = styled.span`
  color: #00e4ff;
  font-weight: bolder;
`;

const CancellationPolicyTrigger = styled.div`
  color: #00e4ff;
  font-size: 12px;
  cursor: pointer;
`;

const MayChange = styled.div`
  margin-bottom: 0;
  font-size: 10px;
  color: #bdc0bd;
`;

const NoServices = styled.div`
  font-size: 18px;
  margin: 10px 0 50px;
  text-align: center;
  font-variant: all-small-caps;
  font-weight: bold;
`;

const addNoteTheme = {
  background: '#FDFAB2',
  backgroundHover: '#FDFAB2',
  border: '#FDFAB2',
  borderHover: '#FDFAB2',
  color: '#C2AF4D',
  colorHover: '#C2AF4D',
};

const Policy = styled.div`
  margin-bottom: 15px;
`;

export default class Itinerary extends Component {
  constructor(props) {
    super(props);
    if (this.props.days) {
      this.r = this.props.days.map(_ => React.createRef());
    }

    this.state = {
      dayToDelete: null,
      resetNoteDefaultValues: 0,
    };

    props.assignRefsToParent(this.r);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.days.length > this.props.days.length) {
      this.setState(prevState => ({
        resetNoteDefaultValues: prevState.resetNoteDefaultValues + 1,
      }));
    }

    if (this.state.isWaitingToSave && !this.props.isSaving) {
      this.setState({ isWaitingToSave: false }, this.goToAddService);
    }
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

  editNote = (_, data) => {
    this.props.editNote(data.day, data.value);
  };

  removeDay = () => {
    this.props.removeDay(this.state.dayToDelete);
    this.setState({
      dayToDelete: null,
    });
  };

  goToAddService = day => {
    if (this.props.isSaving) {
      this.props.blockUntilSaved();
      this.setState({ isWaitingToSave: true });
      return;
    }
    this.props.goToAddService(day);
  };

  renderServiceFooter = (day, service, selectedOption, instanceId) => {
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
          value={(selectedOption && selectedOption.availabilityCode) || ''}
          day={day}
          instanceId={instanceId}
        />
      </ServiceFooter>
    );
  };

  renderCancellationPolicy = (policies, price) => {
    if (!policies || policies.length === 0) {
      return <div>Non-refundable</div>;
    }

    return (
      <React.Fragment>
        {policies.map(policy => {
          const time = minutesToHoursOrDays(policy.duration);
          return (
            <Policy>
              If you cancel{' '}
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

  renderAvailability = (day, dayData) => {
    const id = dayData.service._id;

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

    let service = dayData.service;
    let option = null;

    const thisAvailability =
      this.props.availability &&
      this.props.availability.find(elem => elem.day === day && elem.serviceId === id);

    const isAvailable = thisAvailability && thisAvailability.isAvailable;

    if (dayData.selectedOption) {
      option =
        thisAvailability.groupedOptions &&
        thisAvailability.groupedOptions.options.find(
          option =>
            option.otherAttributes &&
            option.otherAttributes.availabilityCode.code ===
              dayData.selectedOption.availabilityCode,
        );
    }

    return (
      <React.Fragment>
        <Availability
          data-testid={`service${isAvailable ? 'Available' : 'Unavailable'}`}
          available={isAvailable}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </Availability>
        {isAvailable && (
          <Popup
            trigger={<CancellationPolicyTrigger>Cancellation policy</CancellationPolicyTrigger>}
            content={
              <CancellationPolicy>
                {option && option.cancellationPolicies && option.cancellationPolicies.length > 0
                  ? this.renderCancellationPolicy(
                      option.cancellationPolicies,
                      getPriceFromServiceOption(
                        service.basePrice,
                        dayData.selectedOption.price,
                        this.props.numberOfPeople,
                      ),
                    )
                  : this.renderCancellationPolicy(
                      service.periods &&
                        service.periods[0] &&
                        service.periods[0].cancellationPolicies,
                      getPriceFromServiceOption(service.basePrice, null, this.props.numberOfPeople),
                    )}
                {thisAvailability.groupedOptions && (
                  <MayChange>
                    Cancellation policy may change when changing the selected option
                  </MayChange>
                )}
              </CancellationPolicy>
            }
            position="top center"
          />
        )}
      </React.Fragment>
    );
  };

  /*<AddServiceModal trip={this.props.trip} onServiceSelect={this.props.addService} day={day} />*/
  renderDay = (day, index) => (
    <Day data-testid="day" key={day.title} ref={this.r[index]}>
      <DayHeader>
        <DayTitle>{day.title}</DayTitle>
        {this.props.days.length > 1 && (
          <DeleteDayButton onClick={() => this.openModal(day)}>
            <TrashCan />
            Delete this day
          </DeleteDayButton>
        )}
      </DayHeader>
      <Button iconBefore="plus" theme="fillLightGreen" onClick={() => this.goToAddService(day.day)}>
        Add Service
      </Button>
      {(!this.props.notes || !this.props.notes[day.day]) && (
        <AddNoteButton>
          <Button
            iconBefore="plus"
            customTheme={addNoteTheme}
            onClick={() => this.props.addNote(day.day)}
          >
            Add note
          </Button>
        </AddNoteButton>
      )}
      {this.props.notes &&
        this.props.notes[day.day] && (
          <Note key={`${day.day}-note-${this.state.resetNoteDefaultValues}`}>
            <NoteTitle>Note</NoteTitle>
            <Popup
              trigger={
                <NoteDeleteButton onClick={() => this.props.deleteNote(day.day)}>
                  <TrashCan />
                </NoteDeleteButton>
              }
              content="Delete note"
              position="top center"
            />
            <TextArea
              autoHeight
              defaultValue={I18nText.translate(this.props.notes[day.day])}
              day={day.day}
              onChange={this.editNote}
            />
          </Note>
        )}
      {day.data.map(dayData => (
        <Service key={dayData._id}>
          <ServiceBody>
            {getHeroImageUrlFromMedia(dayData.service.media) && (
              <Image url={getHeroImageUrlFromMedia(dayData.service.media)} />
            )}
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
                  {this.renderAvailability(day.day, dayData)}
                </AvailabilityWrapper>
              </CategoryWrapper>
              <ServiceTitle>
                <Link to={`/services/${generateServiceSlug(dayData.service)}`}>
                  <I18nText data={dayData.service.title} />
                </Link>
              </ServiceTitle>
              <LastLine>
                <StartingPrice>Starts from ${dayData.service.basePrice}</StartingPrice>
                <ServiceDaySelector
                  dayData={dayData}
                  service={dayData.service}
                  days={this.props.days}
                  removeService={this.props.removeService}
                  addService={this.props.addService}
                />
              </LastLine>
            </ServiceData>
          </ServiceBody>
          {this.renderServiceFooter(day.day, dayData.service, dayData.selectedOption, dayData._id)}
        </Service>
      ))}
      {day.data.length === 0 && (
        <NoServices data-testid="noServicesText">
          There are no services selected for this day.
        </NoServices>
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
};
