import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalOrNot from 'shared_components/ModalOrNot';

const TripQuoteContent = React.lazy(() =>
  import(/* webpackChunkName: "trip-quote" */ 'shared_components/HelpMe/Content'),
);
class TripQuote extends Component {
  render() {
    return (
      <ModalOrNot>
        <TripQuoteContent
          session={this.props.session}
          {...this.props.location.state && this.props.location.state.helpData}
        />
      </ModalOrNot>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.session.session,
    savedSearchQuery: state.search.searchQuery,
  };
};

export default connect(
  mapStateToProps,
  null,
)(TripQuote);
