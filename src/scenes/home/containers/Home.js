import React, { Component } from 'react';
import HomeComponent from './../components/Home';
import { searchTrips } from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HomeContainer extends Component {
  componentDidMount() {
    this.props.searchTrips(['owner']);
  }

  render() {
    return (
      <div className="HomeContainer">
        <HomeComponent trips={this.props.trips} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    trips: state.search.trips,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ searchTrips }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
