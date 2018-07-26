// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

// COMPONENTS
import DetailCart from '../../../shared_components/Carts/DetailCart';
import EmptyTripDay from './EmptyTripDay';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

// STYLES
import { Mute } from './styles';

const Wrap = styled.div`
  margin-bottom: 50px;
`;

export const Header = styled.div`
  margin: 0 -10px 25px;

  h4 {
    font-size: 24px;
    margin-right: auto;
  }

  ${media.minSmall} {
    margin: 0 0 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const DayTag = styled.span`
  margin-right: 10px;
`;

const DayTitle = styled.h4`
  margin-bottom: 15px;
  padding-left: 15px;

  ${media.minSmall} {
    padding-left: 0;
    margin-bottom: 0;
  }
`;

// MODULE
export default class TripDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opening: false,
      closing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expanded) {
      this.setState({ opening: true });
    } else {
      this.setState({ closing: true });
    }
  }

  componentDidUpdate() {
    if (this.state.opening || this.state.closing) {
      this.setState({ closing: false, opening: false });
    }
  }

  render() {
    const { day, allowServiceRearrange } = this.props;
    const dayTitle = `Day ${day.day}`;
    const services =
      day.services.length === 0 ? (
        <EmptyTripDay allowServiceRearrange={allowServiceRearrange} />
      ) : (
        day.services.map((item, index) => (
          <div key={item.description}>
            <DetailCart
              item={item}
              opening={this.state.opening}
              closing={this.state.closing}
              index={index}
              onDeleteClick={this.props.onServiceRemoveClick}
              allowServiceRearrange={allowServiceRearrange}
            />
          </div>
        ))
      );

    return (
      <Wrap>
        <Header>
          <DayTitle>
            <DayTag>{dayTitle}</DayTag>
            <Mute>{day.date}</Mute>
          </DayTitle>
        </Header>
        {allowServiceRearrange ? (
          <Droppable droppableId={`${day.day || 'null'}`}>
            {(provided, snapshot) => <div ref={provided.innerRef}>{services}</div>}
          </Droppable>
        ) : (
          services
        )}
        {/* This the children prop is *mostly* used to render NotesEditor from EditTripPage */}
        {this.props.children}
      </Wrap>
    );
  }
}

// Props Validation
TripDay.propTypes = {
  onServiceRemoveClick: PropTypes.func.isRequired,
  allowServiceRearrange: PropTypes.bool,
};
