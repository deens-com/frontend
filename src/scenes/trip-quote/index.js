import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalOrNot from 'shared_components/ModalOrNot';
import { getLocationParams } from 'libs/search';

const TripQuoteContent = React.lazy(() =>
  import(/* webpackChunkName: "trip-quote" */ 'shared_components/HelpMe/Content'),
);
class TripQuote extends Component {
  render() {
    const helpData = this.props.location.state && this.props.location.state.helpData;
    return (
      <ModalOrNot>
        <TripQuoteContent
          session={this.props.session}
          {...helpData}
          defaultLocation={(helpData && helpData.defaultLocation) || this.props.defaultLocation}
        />
      </ModalOrNot>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.session.session,
    savedSearchQuery: state.search.searchQuery,
    defaultLocation: {
      ...getLocationParams(state.search.searchQuery),
      formattedAddress: state.search.searchQuery.address,
    },
  };
};

export default connect(
  mapStateToProps,
  null,
)(TripQuote);
