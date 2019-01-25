import React, { Component } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import moment from 'moment';

const AddButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1;
`;

const AddPanel = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 5;
  border-radius: 5px;
  overflow-y: scroll;
  padding: 35px 15px 15px;
  cursor: initial;
`;

const AddPanelContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Label = styled.p`
  font-weight: bold;
  margin-left: 10px;
  color: white !important;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  background: #4fb798;
  margin: 0 auto 15px;
  width: auto;
  padding: 5px;
  border-radius: 3px;
  padding-left: 0;
  cursor: pointer;
`;

const Message = styled.div`
  background-color: #b9ffe7;
  border: 1px solid #4ac4a1;
  color: #4ac4a1;
  position: absolute;
  top: 5px;
  left: 10px;
  right: 0;
  padding: 0 5px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
`;

export default class AddToTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
    this.panelRef = React.createRef();
  }

  open = () => {
    this.setState({
      isOpen: true,
    });
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  close = () => {
    this.setState({
      isOpen: false,
    });
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = e => {
    if (!this.panelRef.current.contains(e.target)) {
      this.close();
    }
  };

  buttonClick = e => {
    e.preventDefault();
    this.open();
  };

  optionClick = async (e, index, dayName) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      saving: true,
    });

    await this.props.data.addToTrip(this.props.service, index + 1);

    const actionDate = moment(dayName, 'MMMM DD').format('MMM DD');

    this.setState({
      actionDate,
      saving: false,
    });

    setTimeout(() => {
      this.setState(prevState => {
        if (prevState.actionDate === actionDate) {
          return {
            actionDate: null,
          };
        }
      });
    }, 5000);
  };

  panelClick = e => {
    e.preventDefault();
    this.close();
  };

  render() {
    return (
      <React.Fragment>
        <AddButton>
          <Button iconBefore="plus" theme="fillLightGreen" onClick={this.buttonClick}>
            Add to trip
          </Button>
        </AddButton>
        <AddPanel
          ref={this.panelRef}
          isOpen={this.state.isOpen}
          onClick={this.panelClick}
          onMouseOver={e => e.stopPropagation()}
        >
          {this.state.actionDate && (
            <Message onClick={this.props.data.goBackToTrip}>
              Added to trip on {this.state.actionDate}
            </Message>
          )}
          {this.state.saving ? (
            <Loader active inverted />
          ) : (
            <AddPanelContent>
              {this.props.data.days.map((day, i) => {
                return (
                  <Option key={i + 1} onClick={e => this.optionClick(e, i, day)}>
                    <Label>{day}</Label>
                  </Option>
                );
              })}
            </AddPanelContent>
          )}
        </AddPanel>
      </React.Fragment>
    );
  }
}
