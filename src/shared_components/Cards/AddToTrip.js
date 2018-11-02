import React, { Component } from 'react';
import styled from 'styled-components';
import { PlusIcon } from 'shared_components/icons';
import { Checkbox } from 'semantic-ui-react';

const Button = styled.div`
  position: absolute;
  background-color: #4fb798;
  color: white;
  right: 20px;
  top: 30px;
  z-index: 1;
  width: 35px;
  height: 35px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddPanel = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
  border-radius: 5px;
  overflow-y: scroll;
  padding: 15px;
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

export default class AddToTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: props.data.days.map(
        (value, i) =>
          Boolean(props.data.daysByService[props.serviceId]) &&
          props.data.daysByService[props.serviceId].includes(i + 1),
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

  optionClick = (e, index, isAdded) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) {
      this.props.data.removeFromTrip(this.props.serviceId, index + 1);
    } else {
      this.props.data.addToTrip(this.props.serviceId, index + 1);
    }
    this.setState({
      days: this.state.days.map((value, i) => (i === index ? !isAdded : value)),
    });
  };

  panelClick = e => {
    e.preventDefault();
    this.close();
  };

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.buttonClick}>
          <PlusIcon />
        </Button>
        <AddPanel innerRef={this.panelRef} isOpen={this.state.isOpen} onClick={this.panelClick}>
          <AddPanelContent>
            {this.state.days.map((isAdded, i) => {
              const dayName = this.props.data.days[i];
              return (
                <Option key={i + 1} onClick={e => this.optionClick(e, i, isAdded)}>
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
