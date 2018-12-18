import React, { Component } from 'react';
import styled from 'styled-components';
import { Popup, Checkbox } from 'semantic-ui-react';
import { Settings } from 'shared_components/icons';
import ConfirmationModal from './ConfirmationModal';

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

const RemoveFromTrip = styled(DayListItem)`
  color: red;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
`;

export default class ServiceDaySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: null,
    };
  }

  handleServiceDayChange = (event, data) => {
    if (!data.checked) {
      if (this.props.daysByService[this.props.service._id].length === 1) {
        this.setState({
          modalData: {
            service: this.props.service,
            day: data.day,
          },
          popupOpen: false,
        });
        return;
      }
      this.props.removeService(data.day, this.props.service._id);
      return;
    }
    this.props.addService(data.day, this.props.service);
  };

  removeServiceFromTrip = _ => {
    this.props.days.forEach(day => {
      const found = day.data.find(dayService => dayService.service._id === this.props.service._id);
      if (found) {
        this.props.removeService(day.day, this.props.service._id);
      }
    });
  };

  onDeleteClick = () => {
    this.setState({
      modalData: {
        service: this.props.service,
      },
      popupOpen: false,
    });
  };

  closeServiceModal = () => {
    this.setState({
      modalData: null,
      popupOpen: false,
    });
  };

  openPopup = () => {
    this.setState({
      popupOpen: true,
    });
  };

  closePopup = () => {
    this.setState({
      popupOpen: false,
    });
  };

  render() {
    const { dayData, daysByService, days } = this.props;
    const { modalData } = this.state;

    return (
      <React.Fragment>
        <ConfirmationModal
          service={modalData && modalData.service}
          day={modalData && modalData.day}
          removeServiceFromDay={this.props.removeService}
          removeService={this.removeServiceFromTrip}
          closeModal={this.closeServiceModal}
        />
        <Popup
          ref={this.dayByServiceRef}
          trigger={
            <PopupTrigger onClick={this.openPopup}>
              <Settings />
            </PopupTrigger>
          }
          content={
            <ul>
              <RemoveFromTrip onClick={this.onDeleteClick}>Delete from Trip</RemoveFromTrip>
              {days.map(checkboxDay => (
                <DayListItem key={checkboxDay.day}>
                  <Checkbox
                    name={`${checkboxDay.day}-${dayData.service._id}`}
                    day={checkboxDay.day}
                    service={dayData.service}
                    checked={
                      daysByService[dayData.service._id] &&
                      daysByService[dayData.service._id].includes(checkboxDay.day)
                    }
                    onChange={this.handleServiceDayChange}
                    label={checkboxDay.title}
                  />
                </DayListItem>
              ))}
            </ul>
          }
          open={this.state.popupOpen}
          onOpen={this.openPopup}
          onClose={this.closePopup}
          on="click"
          position="bottom left"
        />
      </React.Fragment>
    );
  }
}
