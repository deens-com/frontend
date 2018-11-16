import React from 'react';
import styled from 'styled-components';
import GuestsSelector from './GuestsSelector';

const Wrapper = styled.div`
  position: relative;
`;

export default class SelectGuests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  closeSelector = () => {
    this.setState({
      open: false,
    });
  };

  openSelector = () => {
    this.setState({
      open: true,
    });
  };

  applyChanges = data => {
    this.props.onApply(data);
    this.closeSelector();
  };

  render() {
    const { renderTrigger } = this.props;
    const { open } = this.state;

    return (
      <Wrapper>
        {renderTrigger({ triggerPopup: this.openSelector })}
        <div style={{ position: 'relative' }}>
          {open && (
            <GuestsSelector
              close={this.closeSelector}
              onApply={this.applyChanges}
              children={this.props.children}
              infants={this.props.infants}
              adults={this.props.adults}
            />
          )}
        </div>
      </Wrapper>
    );
  }
}
