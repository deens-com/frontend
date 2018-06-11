// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

// COMPONENTS
import ExcerptCart from './ExcerptCart';
import FullCart from './FullCart';

// ACTIONS/CONFIG

// STYLES
import { Cart } from '../styles';

// MODULE
export default class DetailCart extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
    this.toggleExpansion = this.toggleExpansion.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.opening) {
      this.setState({ expanded: true });
    }
    if (nextProps.closing) {
      this.setState({ expanded: false });
    }
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded });
  }

  onDeleteClick = () => {
    this.props.onDeleteClick(this.props.item.tripOrganizationId);
  };

  render() {
    const { props } = this;
    const serviceCardProps = {
      data: props.item,
      toggleExpansion: this.toggleExpansion,
      isOwner: props.allowServiceRearrange,
    };
    const serviceCard = (
      <Cart withShadow column>
        {this.state.expanded ? (
          <FullCart {...serviceCardProps} onDeleteClick={this.onDeleteClick} />
        ) : (
          <ExcerptCart {...serviceCardProps} />
        )}
      </Cart>
    );
    if (!props.allowServiceRearrange) {
      return serviceCard;
    }

    return (
      <Draggable key={props.item.tripOrganizationId} draggableId={props.item.tripOrganizationId} index={props.index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {serviceCard}
          </div>
        )}
      </Draggable>
    );
  }
}

// Props Validation
DetailCart.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  allowServiceRearrange: PropTypes.bool,
};
