// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

// COMPONENTS
import Button from '../../../shared_components/Button';
import DetailCart from '../../../shared_components/Carts/DetailCart';
import DropPicker from '../../../shared_components/DropPicker';
import Trigger from '../../../shared_components/DropPicker/Trigger';
import Drop from '../../../shared_components/DropPicker/Drop';
import DropItem from '../../../shared_components/DropPicker/DropItem';

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

const DayButtons = styled.div`
  display: flex;
  padding-left: 15px;
  margin-bottom: 15px;

  & > div:first-child {
    order: 1;
  }

  ${media.minSmall} {
    padding-left: 0;
    margin-bottom: 0;

    & > div:first-child {
      order: 0;
    }
  }
`;

const EmptyDropHere = styled.div`
  background-color: #efeff1;
  height: 112px;
  width: 100%;
  border-radius: 4px;
  text-align: center;
`;

const EmptyDropText = styled.h3`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

// MODULE
export default class TripDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      opening: false,
      closing: false,
    };
    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.generate_search_query = this.generate_search_query.bind(this);
  }

  toggleExpansion() {
    if (this.state.expanded) {
      this.setState({ expanded: false, closing: true });
    } else {
      this.setState({ expanded: true, opening: true });
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
      if(value){
        let to_concat = key + "=" + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join("&");
    history.push("/results?" + query_string);
  }

  render() {
    // console.log('this.state', this.state);
    const { day } = this.props;
    const dayTitle = day.day === 'null' || !day.day ? 'Unscheduled' : `Day ${day.day}`;
    const services =
      day.services.length === 0 ? (
        <EmptyDropHere>
          <EmptyDropText>Drop services here</EmptyDropText>
        </EmptyDropHere>
      ) : (
        day.services.map((item, index) => (
          <div key={item.description}>
            <DetailCart
              item={item}
              opening={this.state.opening}
              closing={this.state.closing}
              index={index}
              onDeleteClick={this.props.onServiceRemoveClick}
              allowServiceRearrange={this.props.allowServiceRearrange}
            />
          </div>
        ))
      );
    const query_params = {
      tags: this.props.trip && this.props.trip.tags && this.props.trip.tags.length || undefined,
      latitude: this.props.trip.latitude,
      longitude: this.props.trip.longitude,
      person_nb: this.props.trip.numberOfPerson,
      start_date: this.props.trip.beginDate && this.props.trip.beginDate.iso,
      end_date: this.props.trip.endDate && this.props.trip.endDate.iso,
      //address: this.props.trip.location || undefined
    }
    return (
      <Wrap>
        <Header>
          <DayTitle>
            <DayTag>{dayTitle}</DayTag>
            <Mute>{day.date}</Mute>
          </DayTitle>
          <DayButtons>
            <Button
              type="button"
              round
              size="small"
              iconAfter="arrowDown"
              theme="textGreen"
              onClick={this.toggleExpansion}
              text={this.state.expanded ? 'Collapse all' : 'Expand all'}
            />
            <DropPicker>
              <Trigger iconBefore="plus" size="small" round={true} text="Add new Service" />
              <Drop>
                <DropItem
                  onChange={ev => {
                    query_params.service_types = "place";
                    this.generate_search_query(query_params);
                  }}
                >
                  Place
                </DropItem>
                <DropItem
                  onChange={ev => {
                    query_params.service_types = "food";
                    this.generate_search_query(query_params);
                  }}
                >
                  Food
                </DropItem>
                <DropItem
                  onChange={ev => {
                    query_params.service_types = "activity";
                    this.generate_search_query(query_params);
                  }}
                >
                  Activity
                </DropItem>
              </Drop>
            </DropPicker>
            {/* <Button
              type="button"
              round
              size="small"
              iconBefore="plus"
              theme="mainFilled"
              onClick={() => {
                alert('Adding new event');
              }}
              text="Add new event"
            /> */}
          </DayButtons>
        </Header>
        {this.props.allowServiceRearrange ? (
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
