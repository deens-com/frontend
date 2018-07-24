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
import history from './../../../main/history';

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
    this.generate_search_query = this.generate_search_query.bind(this);
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

  generate_search_query(search_params) {
    let query_arr = [];
    Object.entries(search_params).forEach(([key, value]) => {
      if (value) {
        let to_concat = key + '=' + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join('&');
    history.push('/results?' + query_string);
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
      </Wrap>
    );
  }
}

// Props Validation
TripDay.propTypes = {
  onServiceRemoveClick: PropTypes.func.isRequired,
  allowServiceRearrange: PropTypes.bool,
};
