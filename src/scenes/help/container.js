import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalOrNot from 'shared_components/ModalOrNot';

const Help = React.lazy(() => import(/* webpackChunkName: "help" */ './component'));
class HelpContainer extends Component {
  render() {
    return (
      <ModalOrNot>
        <Help
          routeState={this.props.routeState}
          session={this.props.session}
          savedSearchQuery={this.props.savedSearchQuery}
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
)(HelpContainer);
