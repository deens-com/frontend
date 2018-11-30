import React, { Component } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'semantic-ui-react';
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

const Label = styled.label`
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
      days: props.data.days.map(
        (value, i) =>
          Boolean(props.data.daysByService[props.service._id]) &&
          props.data.daysByService[props.service._id].includes(i + 1),
      ),
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

  optionClick = (e, index, dayName, isAdded) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) {
      this.props.data.removeFromTrip(this.props.service._id, index + 1);
    } else {
      this.props.data.addToTrip(this.props.service, index + 1);
    }

    const action = isAdded ? 'Removed' : 'Added';
    const date = moment(dayName).format('MMM DD');

    this.setState({
      days: this.state.days.map((value, i) => (i === index ? !isAdded : value)),
      lastAction: {
        action,
        date,
      },
    });

    setTimeout(() => {
      this.setState(prevState => {
        if (prevState.lastAction.date === date && prevState.lastAction.action === action) {
          return {
            lastAction: null,
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
          innerRef={this.panelRef}
          isOpen={this.state.isOpen}
          onClick={this.panelClick}
          onMouseOver={e => e.stopPropagation()}
        >
          {this.state.lastAction && (
            <Message action={this.state.lastAction.action} onClick={this.props.data.goBackToTrip}>
              {this.state.lastAction.action === 'Added' ? 'Added to' : 'Removed from'} trip on{' '}
              {this.state.lastAction.date}
            </Message>
          )}
          <AddPanelContent>
            {this.state.days.map((isAdded, i) => {
              const dayName = this.props.data.days[i];
              return (
                <Option key={i + 1} onClick={e => this.optionClick(e, i, dayName, isAdded)}>
                  <Checkbox checked={isAdded} name={dayName} label={<Label>{dayName}</Label>} />
                </Option>
              );
            })}
          </AddPanelContent>
        </AddPanel>
      </React.Fragment>
    );
  }
}
