import React, { Component } from 'react';
import Help from './component';
import { connect } from 'react-redux';
import ModalOrNot from 'shared_components/ModalOrNot';

class HelpContainer extends Component {
  render() {
    return (
      <ModalOrNot>
        <Help
          data={this.props.data}
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
