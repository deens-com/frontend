// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

// COMPONENTS
import Button from '../../../shared_components/Button';
import DetailCart from '../../../shared_components/Carts/DetailCart';
import Trigger from '../../../shared_components/DropPicker/Trigger';
import EmptyTripDay from './EmptyTripDay';
import { Popup } from 'semantic-ui-react';

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

const DropItem = styled.div`
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  float: left;
  font-weight: lighter;

  &:hover,
  &:focus {
    color: #4fb798;
  }

  &:after {
    content: '';
    width: 1px;
    height: 60%;
    background: #eef1f4;
    position: absolute;
    right: 0px;
    top: 20%;
  }

  &:last-child:after {
    display: none;
  }
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
    const query_params = {
      person_nb: this.props.trip.numberOfPerson,
      start_date: this.props.trip.beginDate && this.props.trip.beginDate.iso,
      end_date: this.props.trip.endDate && this.props.trip.endDate.iso,
    };

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
            {allowServiceRearrange && (
              <Popup
                trigger={
                  <Trigger iconBefore="plus" size="small" round={true} text="Add new Service" />
                }
                content={
                  <div>
                    <DropItem
                      onClick={() => {
                        query_params.service_types = 'place';
                        this.generate_search_query(query_params);
                      }}
                    >
                      Place
                    </DropItem>
                    <DropItem
                      onClick={() => {
                        query_params.service_types = 'food';
                        this.generate_search_query(query_params);
                      }}
                    >
                      Food
                    </DropItem>
                    <DropItem
                      onClick={() => {
                        query_params.service_types = 'activity';
                        this.generate_search_query(query_params);
                      }}
                    >
                      Activity
                    </DropItem>
                  </div>
                }
                position="left center"
                on="click"
                flowing={true}
                className="semantic-popup-wrapper"
                style={{
                  float: 'left',
                  background: 'white',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  border: '0px',
                  boxShadow: '0 8px 25px 0 rgba(141, 141, 141, 0.22)',
                }}
                horizontalOffset="5"
              />
            )}
          </DayButtons>
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
