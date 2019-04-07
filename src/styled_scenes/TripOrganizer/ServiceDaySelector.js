import React, { Component } from 'react';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';
import { Settings } from 'shared_components/icons';

const DayListItem = styled.li`
  list-style-type: none;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #097da8;
  }

  > div {
    margin-right: 5px;
  }
`;

const PopupTrigger = styled.div`
  cursor: pointer;
`;

export default class ServiceDaySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: null,
    };
  }

  removeService = () =>
    this.props.removeService(
      this.props.dayData.day,
      this.props.service._id,
      this.props.dayData._id,
    );

  render() {
    return (
      <React.Fragment>
        <Popup
          ref={this.dayByServiceRef}
          trigger={
            <PopupTrigger onClick={this.openPopup}>
              <Settings />
            </PopupTrigger>
          }
          content={
            <ul>
              <DayListItem onClick={this.removeService}>Remove</DayListItem>
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
