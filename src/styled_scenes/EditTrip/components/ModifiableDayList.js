// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';

// COMPONENTS
import Col from 'shared_components/layout/Col';
import Row from 'shared_components/layout/Row';
import TripCart from 'shared_components/Carts/Trip';
import Button from 'shared_components/Button';
import Day, { Header } from '../../Trips/components/Day';
import NotesEditor from './NotesEditor';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';

// ACTIONS/CONFIG
import { media } from 'libs/styled';
import { tripsData } from 'data/home';

// STYLES
import { Highlight } from './styles';

const Wrap = styled.div`
  padding: 45px 10px 10px;

  min-height: 112px;
  overflow: auto;

  ${media.minMedium} {
    padding: 25px;
  }
`;

export default class ModifiableDayList extends React.Component {
  static propTypes = {
    trip: PropTypes.object,
    showDetails: PropTypes.bool,
    scheduledTrips: PropTypes.array,
    onServiceDragEnd: PropTypes.func.isRequired,
    onServiceRemoveClick: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    scheduledTrips: [],
  };

  renderDay = day => {
    const { trip, onServiceRemoveClick, expanded } = this.props;
    const dayProps = { trip, allowServiceRearrange: true, onServiceRemoveClick, expanded };
    return (
      <Day key={day.day} day={day} {...dayProps}>
        <EditTripContainer.ContextConsumer>
          {({ saveDayNote, notes }) => {
            const dayNote = notes[day.day] || {};
            return (
              <NotesEditor
                day={day.day}
                noteId={dayNote.objectId}
                defaultValue={dayNote.note}
                saveDayNote={saveDayNote}
              />
            );
          }}
        </EditTripContainer.ContextConsumer>
      </Day>
    );
  };

  render() {
    const { showDetails, scheduledServices, onServiceDragEnd } = this.props;
    const services = showDetails ? scheduledServices.map(this.renderDay) : [];
    return (
      <Wrap>
        {!showDetails && (
          <Header>
            <h4>
              Most popular trips to <Highlight>New York</Highlight>
            </h4>
            <Button
              type="button"
              round
              size="small"
              theme="mainFilled"
              onClick={ev => {
                alert('Creating your event');
              }}
              text="Create your own trip"
            />
          </Header>
        )}
        {showDetails ? (
          <DragDropContext onDragEnd={onServiceDragEnd}>{services}</DragDropContext>
        ) : (
          <Row>
            {tripsData.map(item => (
              <Col key={item.title} xsBasis="50%" lgBasis="25%">
                <TripCart item={item} />
              </Col>
            ))}
          </Row>
        )}
      </Wrap>
    );
  }
}
